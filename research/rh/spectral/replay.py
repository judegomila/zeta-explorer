#!/usr/bin/env python3
"""Replay frozen certificate sources in a fresh disposable tree, never in-place.

Default runs the complete accepted X=16.001 pipeline. The optional failed case
reproduces a failed sufficient surrogate, not negativity of the actual form.
Requires Python 3.12 and python-flint 0.9.0. No network or hidden data inputs.
"""
from pathlib import Path
import argparse
import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
import time

HERE = Path(__file__).resolve().parent


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def canonical(value):
    return json.dumps(value, sort_keys=True, separators=(',', ':')).encode()


def math_fields(value):
    """Ignore timing and explicitly verified source/cache provenance, not math."""
    if isinstance(value, dict):
        return {k: math_fields(v) for k, v in value.items()
                if k != 'seconds' and not k.endswith('_seconds')
                and k not in ('source_sha256_before', 'source_sha256_after',
                              'source_sha256', 'cache_sha256', 'workers')}
    if isinstance(value, list):
        return [math_fields(v) for v in value]
    return value


def verify_source_maps(value, work):
    """Validate emitted path->hash maps against files, including generated data."""
    checked = 0
    if isinstance(value, dict):
        for key, item in value.items():
            if key in ('source_sha256', 'source_sha256_before', 'source_sha256_after') and isinstance(item, dict):
                for name, expected in item.items():
                    path = Path(name)
                    if not path.is_absolute():
                        path = work / path
                    path.resolve().relative_to(work.resolve())
                    assert sha(path) == expected, f'Emitted source hash mismatch: {name}'
                    checked += 1
            else:
                checked += verify_source_maps(item, work)
    elif isinstance(value, list):
        checked += sum(verify_source_maps(v, work) for v in value)
    return checked


def verify_static_sources(root, manifest):
    for rel, item in manifest['sources'].items():
        assert sha(root / rel) == item['sha256'], f'Static source changed: {rel}'
    return len(manifest['sources'])


def verify_cache(path, expected):
    from flint import arb, acb, ctx
    ctx.prec = 1000
    rows = [json.loads(line) for line in path.read_text().splitlines()]
    seen = set()
    minimum = 10**9
    bounds = [16384 * 2**o * (8+k) // 8 for o in range(6) for k in range(8)] + [64*16384]
    required = {(16, p, a) for p in range(2, 144) for a in bounds} | {
        (256, p, a) for p in range(2, 144, 2) for a in bounds}
    for row in rows:
        key = (row['ratio'], row['power'], row['A'])
        assert key not in seen
        seen.add(key)
        val = acb(arb(row['real_ball']), arb(row['imag_ball']))
        assert val.is_finite() and row['roundtrip_contains_original']
        bits = min(val.real.rel_accuracy_bits(), val.imag.rel_accuracy_bits())
        assert bits >= 900
        minimum = min(minimum, bits)
        row.pop('seconds', None)
    assert seen == required and len(rows) == expected['required_cache_rows']
    rows.sort(key=lambda r: r['key'])
    digest = hashlib.sha256(canonical(rows)).hexdigest()
    assert digest == expected['canonical_all_rows_sha256'], 'Recomputed moment balls differ from frozen key-indexed rows'
    return {'rows': len(rows), 'exact_required_index_set': True,
            'minimum_reloaded_accuracy_bits': minimum,
            'canonical_all_rows_sha256': digest,
            'every_nontiming_row_field_matches_reference_digest': True}


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument('--case', choices=['accepted', 'failed'], default='accepted')
    ap.add_argument('--report', type=Path, help='Optional NEW report path; will not overwrite an existing file')
    args = ap.parse_args()
    import flint
    assert flint.__version__ == '0.9.0', 'Use the pinned python-flint version for exact replay'
    if args.report:
        assert not args.report.exists(), 'Refusing to overwrite existing report'
        assert HERE / 'reference' not in args.report.resolve().parents, 'Frozen references are immutable'
    manifest = json.loads((HERE / 'manifest.json').read_text())
    case = manifest['cases'][args.case]
    verify_static_sources(HERE / 'source-tree', manifest)
    for rel, item in manifest['reference_receipts'].items():
        assert sha(HERE / 'reference' / rel) == item['transport_sha256']
    work = Path(tempfile.mkdtemp(prefix=f'rh-spectral-{args.case}-'))
    shutil.copytree(HERE / 'source-tree', work, dirs_exist_ok=True)
    # The source tree contains human proof documents too. Only .py sources and
    # generated receipts/cache participate in executable verification.
    verify_static_sources(work, manifest)
    logdir = work / 'replay-logs'
    logdir.mkdir()
    started = time.time()
    out = {'schema_version': 1, 'case': args.case, 'status': 'RUNNING',
           'manifest_sha256': sha(HERE / 'manifest.json'),
           'launcher_sha256': sha(Path(__file__)),
           'python': sys.version.split()[0], 'python_flint': flint.__version__,
           'disposable_work_directory_name': work.name,
           'stages': [], 'receipt_comparisons': []}
    print(f'Disposable replay tree: {work}', flush=True)
    try:
        for i, command in enumerate(case['commands'], 1):
            log = logdir / f'{i:02d}-{Path(command[0]).stem}.log'
            print(f'Stage {i}/{len(case["commands"])}: {" ".join(command)}', flush=True)
            t = time.time()
            with log.open('w') as stream:
                result = subprocess.run([sys.executable, *command], cwd=work,
                                        stdout=stream, stderr=subprocess.STDOUT,
                                        check=False)
            out['stages'].append({'command': command, 'exit_code': result.returncode,
                                  'seconds': time.time()-t, 'log': str(log.relative_to(work))})
            assert result.returncode == 0, f'Stage failed; inspect {log}'
            verify_static_sources(work, manifest)
        out['cache'] = verify_cache(work / case['cache'], case)
        directory = case['directory']
        names = ['GENERIC_SMALL_DENSE_GATE.json', 'GENERIC_FULL_EVEN_CERTIFICATE.json']
        if args.case == 'accepted':
            names += ['GENERIC_POWER7_FEASIBILITY.json', 'GENERIC_ACTUAL_HEAD_PILOT.json',
                      'GENERIC_MOMENT_CACHE_V2_META.json', 'GENERIC_MOMENT_CACHE_V2_COMPLETE.json']
            paths = [directory + '/' + name for name in names]
        else:
            names += ['PREFLIGHT_SUPPORT_AND_CACHE.json', 'CACHE_ISOLATION_CHECK.json',
                      'MOMENT_CACHE_META.json', 'MOMENT_CACHE_COMPLETE.json']
            paths = [directory + '/' + name for name in names]
            paths += ['rh_attack_cycle_20261030/support_endpoint_next_feasibility/X161_POWER7_FEASIBILITY.json']
        for rel in paths:
            current = json.loads((work / rel).read_text())
            reference = json.loads((HERE / 'reference' / rel).read_text())
            count = verify_source_maps(current, work)
            a, b = math_fields(current), math_fields(reference)
            assert a == b, f'Mathematical receipt fields differ: {rel}'
            out['receipt_comparisons'].append({'path': rel,
                'all_mathematical_and_nontiming_nonprovenance_fields_identical': True,
                'verified_emitted_source_hashes': count,
                'canonical_mathematical_fields_sha256': hashlib.sha256(canonical(a)).hexdigest()})
        full = json.loads((work / directory / 'GENERIC_FULL_EVEN_CERTIFICATE.json').read_text())
        assert full['dimension'] == 2049 and full['all_sources_unchanged']
        assert full['core']['pass_positive'] and full['coefficient_H']['pass_positive']
        assert full['status'] == case['expected_certificate_status']
        assert full['whitened_Schur']['pass_positive'] == (args.case == 'accepted')
        out['certificate_status'] = full['status']
        out['complete_gate_fields'] = math_fields(full)
        out['static_source_count_verified_before_after_every_stage'] = verify_static_sources(work, manifest)
        verify_static_sources(HERE / 'source-tree', manifest)
        for rel, item in manifest['reference_receipts'].items():
            assert sha(HERE / 'reference' / rel) == item['transport_sha256']
        out['frozen_reference_receipts_unchanged'] = True
        out['status'] = 'PASS_COMPLETE_CLEAN_REPRODUCTION'
        out['scope'] = ('Reproduces the accepted whole-even certificate at sqrt(16001/1000). '
                        'No odd/cofinal/RH conclusion. ' if args.case == 'accepted' else
                        'Reproduces the failed sufficient surrogate at sqrt(161/10); '
                        'NOT actual operator negativity and NOT a new accepted endpoint. ')
        out['scope'] += 'This is a producer clean-checkout replay, separate from the sealed independent mathematical audit.'
    except BaseException as exc:
        out.update(status='FAILED_OR_INCOMPLETE_REPRODUCTION', error=repr(exc))
        raise
    finally:
        out['seconds'] = time.time()-started
        report = work / 'REPLAY_RESULT.json'
        report.write_text(json.dumps(out, indent=2)+'\n')
        if args.report:
            args.report.parent.mkdir(parents=True, exist_ok=True)
            with args.report.open('x') as stream:
                stream.write(json.dumps(out, indent=2)+'\n')
        print(f'Replay status: {out["status"]}; full report: {report}', flush=True)


if __name__ == '__main__':
    main()
