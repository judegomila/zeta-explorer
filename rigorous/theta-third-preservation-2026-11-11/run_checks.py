"""Replay the new third-preservation certificates from fresh theta enclosures.

The earlier theorems fixed in SOURCES.md remain declared proof dependencies.
No saved replay, sampled anchor grid, or diagnostic value is a proof input.
The separate U-source implementation is corroboration, not a duplicated gate.
"""
from pathlib import Path
import importlib.metadata
import json
import platform
import sys
import time

if not __debug__:
    raise SystemExit('Run verification without python -O; assertions are proof gates.')

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))

from flint import ctx
import theta_mixed_h_source_20261111 as h_source
import theta_mixed_u_crossing_20261111 as u_crossing
import theta_mixed_identity_20261111 as identity
import theta_mixed_anchor_tail_20261111 as anchor_tail
import theta_mixed_spatial_tail_20261111 as spatial_tail


def main():
    started = time.monotonic()
    required = {'sympy': '1.14.0', 'python-flint': '0.9.0', 'mpmath': '1.3.0'}
    versions = {name: importlib.metadata.version(name) for name in required}
    if versions != required:
        raise RuntimeError({'installed': versions, 'required': required})
    ctx.prec = 512
    gates = {}

    def gate(name, callback):
        beginning = time.monotonic()
        result = callback()
        if result.get('status') != 'passed':
            raise AssertionError((name, result))
        gates[name] = result
        print(json.dumps({'gate': name, 'status': 'passed',
                          'seconds': round(time.monotonic()-beginning, 3)}), flush=True)
        return result

    orientation = gate('oriented_source_identities', identity.run_checks)
    anchor = gate('anchor_tail_identities', anchor_tail.run_checks)
    spatial = gate('spatial_tail_identities', spatial_tail.run_checks)

    h = {'status': 'passed'}
    for name in ('exact', 'origin', 'core', 'tail'):
        function = getattr(h_source, 'exact_checks' if name == 'exact' else name+'_certificate')
        h[name] = gate('H_fifth_source_'+name, function)
    h['claim'] = "W5(B',J',P',Q',H')<0 for every positive t."

    u = {'status': 'passed'}
    for name in ('exact', 'origin', 'core', 'tail'):
        function = getattr(u_crossing, 'exact_checks' if name == 'exact' else name+'_certificate')
        u[name] = gate('U_source_and_crossing_'+name, function)
    u['claim'] = ('S_U>0 for every positive t; K_U has exactly one simple '
                  'negative-to-positive zero in (1/2,9/16).')

    records = {
        'theta_mixed_identity_replay_20261111.json': orientation,
        'theta_mixed_anchor_tail_replay_20261111.json': anchor,
        'theta_mixed_spatial_tail_replay_20261111.json': spatial,
        'theta_mixed_h_source_replay_20261111.json': h,
        'theta_mixed_u_crossing_replay_20261111.json': u,
    }
    for name, record in records.items():
        (ROOT/name).write_text(json.dumps(record, indent=2, sort_keys=True)+'\n')

    exact_count = (orientation['exact_symbolic_checks'] + anchor['exact_identity_checks']
                   + spatial['exact_checks'] + h['exact']['exact_checks']
                   + u['exact']['exact_checks'])
    interval_count = sum(component[region]['cells'] for component in (h, u)
                         for region in ('origin', 'core'))
    result = {
        'status': 'passed', 'python': platform.python_version(), 'packages': versions,
        'precision_bits': ctx.prec, 'seconds': round(time.monotonic()-started, 3),
        'primary_gate_count': len(gates),
        'new_exact_symbolic_checks': exact_count,
        'new_tail_exact_rational_checks': h['tail']['exact_checks']+u['tail']['exact_checks'],
        'primary_interval_cell_evaluations': interval_count,
        'distinct_spatial_partition_cells': h['origin']['cells']+h['core']['cells'],
        'counting_note': ('H and the joint U/crossing certificate each use 256 origin '
                          'and 1980 compact cells on the same spatial domain. The '
                          'standalone U-source corroborating replay is excluded.'),
        'gates': gates,
        'scope': ('Fresh certificates for K_H<0, S_U>0 and the single ordered K_U crossing; '
                  'exact identities supporting the accompanying analytic propagation and '
                  'boundary theorems. Together with the fixed PR53/PR54 inputs these give '
                  'both global mixed signs, third full preservation and six-node real '
                  'Pick positivity. Arbitrary-depth preservation and RH remain open.'),
        'prior_proof_dependencies_rerun': False,
        'saved_replays_used_as_inputs': False,
    }
    (ROOT/'checks_replay.json').write_text(json.dumps(result, indent=2, sort_keys=True)+'\n')
    print(json.dumps({k: v for k, v in result.items() if k != 'gates'}, indent=2), flush=True)


if __name__ == '__main__':
    main()
