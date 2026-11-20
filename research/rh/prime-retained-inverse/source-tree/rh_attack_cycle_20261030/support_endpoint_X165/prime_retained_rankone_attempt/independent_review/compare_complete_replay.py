#!/usr/bin/env python3
"""Verify the complete isolated receipt, every source/runtime pin and all math fields."""
from pathlib import Path
import hashlib,json,sys
from flint import arb

HERE=Path(__file__).resolve().parent
BASE=HERE.parent
ROOT=BASE.parents[2]
REPLAY=HERE/'replay_root'
REL=BASE.relative_to(ROOT)
PREP=HERE/'REPLAY_PREPARATION.json'
PRODUCER=BASE/'PRIME_RETAINED_RANKONE_FULL_GATE.json'
INDEPENDENT=REPLAY/REL/'PRIME_RETAINED_RANKONE_FULL_GATE.json'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
prep=json.loads(PREP.read_text())
assert sha(Path(sys.executable))==prep['python_executable_sha256']
for path,h in prep['source_sha256'].items():
    assert sha(ROOT/path)==h,('producer source changed',path)
    assert sha(REPLAY/path)==h,('replay source changed',path)
for path,h in prep['runtime_sha256'].items():
    assert sha(ROOT/path)==h,('producer runtime changed',path)
    assert sha(REPLAY/path)==h,('replay runtime changed',path)
assert sys.version==prep['python_version']
p=json.loads(PRODUCER.read_text());q=json.loads(INDEPENDENT.read_text())
for receipt in [p,q]:
    assert receipt['status']=='PASS'
    assert receipt['test_kind']=='COMPLETE_FULL_EVEN_TEST'
    assert receipt['dimension']==2049 and receipt['X']=='33/2'
    assert receipt['N']==2048 and receipt['J']==16384 and receipt['L']==36
    assert receipt['precision_bits']==1000
    assert receipt['rank_one_lift'] is False
    assert receipt['positive_rank_one_tail_inverse_correction'] is True
    assert receipt['source_sha256_before']==prep['source_sha256']==receipt['source_sha256_after']
    for key,dim in [('core',2049),('coefficient_H',72),('whitened_Schur',72)]:
        item=receipt[key]
        assert item['pass_positive'] and item['dimension']==dim
        assert arb(item['min_pivot_lower'])>0 and arb(item['last_pivot'])>0
    assert sorted(receipt['core']['elimination_order'])==list(range(2049))
    assert arb(receipt['E0'])>0 and arb(receipt['tail_floor'])>0
    assert arb(receipt['scaled_rem'])>0
    assert arb(receipt['far_H_and_rem_multiplier'])>1

timing={'repair_builder_seconds','setup_seconds','elimination_seconds','seconds'}
pm={k:v for k,v in p.items() if k not in timing}
qm={k:v for k,v in q.items() if k not in timing}
assert pm==qm,'Non-timing mathematical receipt mismatch'
out={
    'status':'PASS_COMPLETE_ISOLATED_REPLAY_AND_ANALYTIC_AUDIT',
    'X':'33/2','lambda':'sqrt(33/2)','dimension':2049,
    'all_2049_core_72_H_72_Schur_pivots_positive':True,
    'all_non_timing_receipt_fields_identical':True,
    'all_19_source_files_unchanged_in_both_trees':True,
    'all_115_runtime_files_unchanged_in_both_trees':True,
    'core':q['core'],'coefficient_H':q['coefficient_H'],'whitened_Schur':q['whitened_Schur'],
    'producer_receipt_sha256':sha(PRODUCER),'independent_receipt_sha256':sha(INDEPENDENT),
    'preparation_manifest_sha256':sha(PREP),'comparison_script_sha256':sha(Path(__file__).resolve()),
    'producer_seconds':p['seconds'],'independent_seconds':q['seconds'],
    'scope':'The new finite reflection-even endpoint passes the complete producer, isolated replay, and independent analytic/source audit. No odd-sector, cofinal-support, or RH conclusion.'
}
(HERE/'COMPLETE_REPLAY_INDEPENDENT_AUDIT.json').write_text(json.dumps(out,indent=2)+'\n')
print(json.dumps({k:v for k,v in out.items() if k not in ['core','coefficient_H','whitened_Schur']},indent=2))
