#!/usr/bin/env python3
"""Generate papers/lambda-qrh-0.116091/PROVENANCE.md with `shasum -a 256`."""
import subprocess, os, glob, datetime
ROOT = '/Users/USER/Documents/GitHub/mathexplorer'
PKG = 'papers/lambda-qrh-0.116091'
os.chdir(ROOT)

def sha(path):
    out = subprocess.run(['shasum', '-a', '256', path], capture_output=True, text=True)
    if out.returncode != 0:
        return None
    return out.stdout.split()[0]

def tracked(path):
    r = subprocess.run(['git', 'ls-files', '--error-unmatch', path], capture_output=True, text=True)
    if r.returncode != 0:
        return 'untracked'
    st = subprocess.run(['git', 'status', '--porcelain', '--', path], capture_output=True, text=True).stdout.strip()
    return 'tracked, modified' if st else 'tracked'

def files_under(d, exclude=('.lake',)):
    res = []
    for dp, dn, fn in os.walk(d):
        dn[:] = sorted(x for x in dn if x not in exclude)
        for f in sorted(fn):
            if f == '.DS_Store':
                continue
            res.append(os.path.join(dp, f))
    return res

groups = []
def group(title, note, paths):
    groups.append((title, note, paths))

group('This package', 'Hashed after the last edit of each file. `PROVENANCE.md` itself is not listed.',
      [f'{PKG}/{f}' for f in ['README.md', 'PROOF_NOTE.md', 'PARAMETERS.md', 'DEPENDENCIES.md', 'LEAN.md',
                               'OPEN_REVIEW_QUESTIONS.md', 'BIBLIOGRAPHY.md', 'CITATION.md',
                               'paper/main.tex', 'paper/refs.bib', 'paper/main.pdf', 'lambda-qrh-0.116091-draft.pdf', 'tools/make_provenance.py']])
group('Project record modules and page', 'Source of the numbers in `PARAMETERS.md` and of the status statements.',
      ['src/data/qrh-path-push-2026-10-08.js', 'src/data/openai-math-integration-2026-10-08.js',
       'src/data/qrh-theta-and-improvement-2026-10-08.js', 'src/data/beat-seven-eighths-2026-10-08.js',
       'src/data/beat78-prop152-2026-10-09.js', 'src/data/lambda-levers-combined-2026-10-09.js',
       'src/data/qrh-lambda-lean-2026-10-09.js', 'src/data/r2-structured-floor-2026-10-02.js',
       'src/data/r5-synthesis-2026-10-05.js', 'src/pages/LambdaQrhConditionalPage.jsx'])
group('Internal write-ups', 'Internal reviews and notes cited in the package (unpublished).',
      ['formalization/paper/lambda-qrh-note-draft.md', 'formalization/paper/raymond-g0-review-a-2026-10-08.md',
       'formalization/paper/raymond-g0-review-b-2026-10-08.md', 'formalization/external/openai-math-qrh-verification.md',
       'formalization/paper/joint-pair-arbitrary-shift.md', 'formalization/paper/lemma-B-two-band.md',
       'formalization/paper/cg-monotonicity.md', 'formalization/paper/outer-lemma-weak.md',
       'formalization/paper/wol-pd-lemmas.md', 'formalization/paper/beat78-synthesis.md',
       'formalization/paper/beat78-amplifier.md', 'formalization/paper/beat78-meansquare.md',
       'formalization/paper/beat78-height.md', 'formalization/paper/beat78-project.md',
       'formalization/paper/beat78-prop152-subtract.md', 'formalization/paper/beat78-prop152-holder.md',
       'formalization/paper/beat78-prop152-restrict.md', 'formalization/paper/qrh-improvement-attempt-a.md',
       'formalization/paper/qrh-improvement-attempt-b.md', 'formalization/paper/verify_qrh_improvement_a.py',
       'formalization/paper/qrh_improvement_a_sensitivity.py'])
group("Raymond's deposit (local copies)", 'Files of Zenodo 10.5281/zenodo.22867547 as read by the project; the `.txt` files are text extractions.',
      sorted(glob.glob('tmp/raymond-22867547/*')))
group('Reference copies', 'Polymath arXiv:1904.12438v2 (same hash as recorded in the earlier package) and its text extraction; text extractions of the openai/math manuscripts at commit `adc7f1241` (outside the repository, in the local openai/math workspace).',
      ['tmp/b145-C-refA/polymath.pdf', 'tmp/b145-C-refA/polymath.txt',
       '/tmp/qrh-verify/paper.txt', '/tmp/qrh-verify/paper2.txt'])
group('Scripts', 'Producers, consumers, verifiers and review scripts.',
      ['tmp/oai-lambda-raymond.py', 'tmp/oai-lambda-routeP.py', 'tmp/oai-lambda-classical.py',
       'tmp/oai-lambda-ref-raymond.py', 'tmp/oai-lambda-ref-routeP-verify.py',
       'tmp/s145-1-g1/pipeline.py', 'tmp/s145-1-g1/code/assemble_joint.py', 'tmp/s145-1-g1/code/certify_coupled_probe.py',
       'tmp/b145-B-ccp.py', 'tmp/qrh-tune-consume.py', 'tmp/qrh-tune-verify.py', 'tmp/qrh-tune-final.sh',
       'tmp/qrh-tune-ladder.sh', 'tmp/qrh-tune-fast.py', 'tmp/qrh-ref-verify.py', 'tmp/qrh-ref-kcert.py',
       'tmp/qrh-ref-tables.py', 'tmp/qrh-ref-run.sh', 'tmp/qrh-recheck-extract.py', 'tmp/qrh-recheck-premises.py',
       'tmp/qrh-theta-curve-raymond.sh', 'tmp/qrh-theta-curve-routeP.sh',
       'tmp/g0a-review-checks.py', 'tmp/g0a-review-entry.py', 'tmp/g0a-review-wall-direct.py', 'tmp/g0a-review-wall-ideal.py']
      + sorted(glob.glob('tmp/g0-review-b-2026-10-08/*.py')))
group('Run inputs: tables, plans, kernels', "Raymond's plan, X1 tables and wall certificate; kernel catalogue; the height tables, plans, route-3 tables and r2 certfile read by value (ii).",
      ['tmp/s145-1-g1/data/PLAN.json', 'tmp/s145-1-g1/out/X1/TABLES.json', 'tmp/s145-1-g1/out/WALL_X1_B.json',
       'tmp/oai-lambda-out/KERNELS_raymond_backup.json', 'tmp/qrh-tune-out/xkernels_final.json',
       'tmp/qrh-tune-out/archive/QA_m0.88/TABLES.json', 'tmp/qrh-tune-out/archive/QB_m0.91/TABLES.json',
       'tmp/qrh-tune-out/archive/QC_cliff/TABLES.json', 'tmp/qrh-tune-out/plans/QA_m0.88.json',
       'tmp/qrh-tune-out/plans/QB_m0.91.json', 'tmp/qrh-tune-out/plans/QC_cliff.json',
       'tmp/routes-b3-9-out/archive/W4_single/TABLES.json', 'tmp/routes-b3-9-out/plans/W4_single.json',
       'tmp/routes-b3-9-out/archive/X1_P0_97/TABLES.json', 'tmp/b145-B-out/plans/X1_mult_0_97b.json',
       'tmp/routes-b3-9-out/archive/X1_m0.94_c200_600/TABLES.json', 'tmp/routes-b3-9-out/plans/X1_mult_0.94.json',
       'tmp/routes-b3-9-out/archive/X1_m0.91_c200_600/TABLES.json', 'tmp/routes-b3-9-out/plans/X1_mult_0.91.json',
       'tmp/routes-b2-r3-out/tab_P.json', 'tmp/routes-b3-combine-out/tab_X.json', 'tmp/routes-b3-combine-out/tab_X2.json',
       'tmp/routes-b4-rec-joint-out/collect6/merge/certfile_fullref.json'])
group('Run outputs', 'Results of the runs and verifiers. The per-substep dump of value (ii) is kept compressed in the repository tree; the uncompressed copy used by the verifiers is in `/tmp`.',
      ['tmp/oai-lambda-out/summary.json', 'tmp/oai-lambda-out/raymond_X1.json', 'tmp/oai-lambda-out/routeP_t78.json',
       'tmp/oai-lambda-out/routeP_t1112.json', 'tmp/oai-lambda-out/routeP_strip.json',
       'tmp/oai-lambda-ref-out/raymond_X1.json', 'tmp/oai-lambda-ref-out/raymond_X1_rob.json',
       'tmp/oai-lambda-ref-out/routeP_t78_verify.json', 'tmp/oai-lambda-ref-out/routeP_t1112_verify.json',
       'tmp/qrh-tune-out/summary.json', 'tmp/qrh-tune-out/F2_final.json', 'tmp/qrh-tune-out/F2_final_verify.json',
       'tmp/qrh-tune-out/F2_final.steps.jsonl.gz', '/tmp/qrh-tune-dump-F2_final.steps.jsonl', 'tmp/qrh-tune-out/lever3_targets.json',
       'tmp/qrh-ref-out/F2_refverify.json', 'tmp/qrh-ref-out/F2_rerun_refverify.json', 'tmp/qrh-ref-out/F2_tuneverify.json',
       'tmp/qrh-ref-out/kc_final_new79_p64.jsonl', 'tmp/qrh-ref-out/kc_final_usedF2_p128.jsonl',
       'tmp/qrh-recheck-out/premises.json', 'tmp/qrh-recheck-out/used_cells.json',
       'tmp/qrh-theta-curve-out/table.json', 'tmp/qrh-theta-curve-out/raymond_X1.json',
       'tmp/qrh-theta-curve-out/routeP_t85.json', 'tmp/qrh-theta-curve-out/routeP_t85_verify.json',
       'tmp/qrh-theta-curve-out/routeP_t80.json', 'tmp/qrh-theta-curve-out/routeP_t80_verify.json',
       'tmp/g0-review-b-2026-10-08/kerncert_out.json'])
group('Checks re-run for this package (2026-10-09)', 'Outside the repository, in `/tmp/qrh-paper-check/`.',
      ['/tmp/qrh-paper-check/raymond78.json', '/tmp/qrh-paper-check/raymond78.log',
       '/tmp/qrh-paper-check/run_refverify.sh', '/tmp/qrh-paper-check/F2_refverify.json', '/tmp/qrh-paper-check/F2_refverify.log'])
group('Lean: raymond-core', 'All files outside `.lake/`.', files_under('formalization/lean/raymond-core'))
group('Lean: qrh-lambda', 'All files outside `.lake/` (sources, chunk certificates, data, scripts, axiom outputs, build logs, exports, vendored inputs).',
      files_under('formalization/lean/qrh-lambda'))
group('Lean: referee consistency proof', 'The internal referee\'s proof that the named hypotheses follow from RH (`QrhLambda.Referee.raymondChainHyps_of_RH`) and its axiom output, in the referee\'s copy outside the repository.',
      ['/tmp/qrh-referee-20261009/qrh-lambda/referee/RefereeSanity.lean', '/tmp/qrh-referee-20261009/logs/sanity.out'])
group('Lean: openai/math check files', 'Statement and axiom checks for the 7/8 theorem, in the local openai/math workspace (outside the repository).',
      sorted(glob.glob('/tmp/qrh-verify/check/*')))

head = subprocess.run(['git', 'rev-parse', 'HEAD'], capture_output=True, text=True).stdout.strip()
branch = subprocess.run(['git', 'rev-parse', '--abbrev-ref', 'HEAD'], capture_output=True, text=True).stdout.strip()
now = datetime.datetime.now().strftime('%Y-%m-%d %H:%M %Z').strip()

L = []
L.append('# Provenance\n')
L.append(f'Generated {now} (local time) with `shasum -a 256` by `papers/lambda-qrh-0.116091/tools/make_provenance.py`, on branch `{branch}` at commit `{head}`. Paths are relative to the repository root unless they start with `/`.\n')
L.append('To re-check one group, copy its block into a file and run `shasum -a 256 -c FILE` from the repository root.\n')
L.append('Git status is given per group. Paths under `/tmp/` are outside the repository, and most files under `tmp/` are untracked (the local copies of Raymond\'s deposit are tracked); for untracked files the hashes here are the only record of the state used. The Lean package `qrh-lambda` was edited by another process shortly before this file was generated (dependencies moved out of `/tmp`, inputs vendored; commit `6c1ef30d4`); the hashes are a snapshot.\n')
L.append('External pins recorded elsewhere and not re-hashed here:\n')
L.append('* openai/math: lean/ directory of commit `adc7f1241b42e322a6451854ab7e4b4c146bf78a`; built `Nonvanishing.olean` sha256 `adeff7db7211767b3a3437958cecce7229185c998c8ac909a7013ec75d499fdc` (`formalization/external/openai-math-qrh-verification.md`).')
L.append('* LeanCert: commit `7f91b6eb3567437f6cfac03ed279706603ee22f4` (checkout `formalization/lean/raymond-core/.lake/packages/leancert`).')
L.append('* Mathlib: commit `d13f23b723b8a846827a245b89c10fc7d3f11612`; Lean toolchain `leanprover/lean4:v4.34.1`.')
L.append('* Platt–Trudgian arXiv:2004.09765v1 PDF as fetched on 2026-10-09: sha256 `3362f66af9fa9373977eee70e2282ec33989d5d8b97e0852df9e32cc25b52885` (equal to the hash in `dbn-lambda-01787854-candidate-audit/references/README.md`).')
L.append("* Raymond's deposit: the local copies of `Analytic_Foundations.pdf`, `Correlated_Translated_Probes.pdf`, `Correlated_Translated_Probes.tex`, `README.md` and `Verification_Guide.pdf` match the deposit's `SHA256SUMS.txt` (checked 2026-10-09).")
L.append('* Python: 3.13.15 with python-flint 0.8.0 (`tmp/routes-b1-r1-venv`, route-P consumer); 3.14.7 with python-flint 0.9.0 (`.venv-arb`, Raymond chain replay and verifiers).\n')
missing = []
for title, note, paths in groups:
    rows = []
    stat = {}
    for p in paths:
        h = sha(p)
        if h is None:
            missing.append(p); continue
        rows.append(f'{h}  {p}')
        s = 'outside repository' if p.startswith('/') else tracked(p)
        stat[s] = stat.get(s, 0) + 1
    L.append(f'## {title}\n')
    L.append(note + '\n')
    L.append('Git status: ' + ', '.join(f'{v} {k}' for k, v in sorted(stat.items())) + '.\n')
    L.append('```')
    L.extend(rows)
    L.append('```\n')
if missing:
    L.append('## Not found when hashing\n')
    L.extend(f'* `{m}`' for m in missing)
    L.append('')
open(f'{PKG}/PROVENANCE.md', 'w').write('\n'.join(L))
print('written; missing:', missing)
