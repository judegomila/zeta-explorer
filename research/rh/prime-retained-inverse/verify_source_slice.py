#!/usr/bin/env python3
"""Verify the frozen local source slice; no numerical producer is executed."""
from pathlib import Path
import hashlib,json
HERE=Path(__file__).resolve().parent
manifest=json.loads((HERE/'INTEGRATION_MANIFEST.json').read_text())
for item in manifest['files']:
    p=HERE/item['staged']
    assert p.is_file(),p
    assert hashlib.sha256(p.read_bytes()).hexdigest()==item['sha256'],p
assert hashlib.sha256((HERE/'prime-retained-tail-certificate.md').read_bytes()).hexdigest()==manifest['module_sha256']
base='rh_attack_cycle_20261030/support_endpoint_X165/prime_retained_rankone_attempt'
producer=json.loads((HERE/'source-tree'/base/'PRIME_RETAINED_RANKONE_FULL_GATE.json').read_text())
independent=json.loads((HERE/'receipts/INDEPENDENT_FULL_GATE.json').read_text())
for rel,sha in producer['source_sha256_before'].items():
    assert hashlib.sha256((HERE/'source-tree'/rel).read_bytes()).hexdigest()==sha,rel
assert producer['source_sha256_before']==producer['source_sha256_after']
assert independent['source_sha256_before']==independent['source_sha256_after']
def mathematical(x):
    if isinstance(x,dict):return {k:mathematical(v) for k,v in x.items() if not k.endswith('seconds')}
    if isinstance(x,list):return [mathematical(v) for v in x]
    return x
assert mathematical(producer)==mathematical(independent)
assert producer['status']==independent['status']=='PASS'
for key,n in [('core',2049),('coefficient_H',72),('whitened_Schur',72)]:
    assert producer[key]['pass_positive'] and producer[key]['dimension']==n
print(json.dumps({'status':'PASS_FROZEN_SOURCE_SLICE_AND_RECEIPT_COMPARISON',
                  'copied_evidence_files':len(manifest['files']),
                  'all_19_driver_dependencies_match':len(producer['source_sha256_before'])==19,
                  'all_nontiming_mathematical_fields_identical':True,
                  'full_producer_runs_performed_by_this_verifier':0},indent=2))
