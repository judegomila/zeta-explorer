#!/usr/bin/env python3
"""Read-only complete parameter/cache schema check; no regeneration."""
from pathlib import Path
import hashlib,json
from compute_moment_cache import META,validate,BOUNDS
from support_config import X,J,BITS,TOLERANCE_BITS
HERE=Path(__file__).resolve().parent
meta=json.loads((HERE/'MOMENT_CACHE_META.json').read_text());assert meta==META
seen=set();minimum=10**9
for line in (HERE/'MOMENT_CACHE.jsonl').read_text().splitlines():
 r=json.loads(line);v=validate(r);k=r['analytic_key']
 assert k['X']==str(X) and k['J']==J and k['precision_bits']==BITS and k['quadrature_U']==META['quadrature_U'] and k['abs_rel_tolerance_bits']==TOLERANCE_BITS
 key=(r['ratio'],r['power'],r['A']);assert key not in seen;seen.add(key)
 minimum=min(minimum,v.real.rel_accuracy_bits(),v.imag.rel_accuracy_bits())
required={(16,p,A) for p in range(2,144) for A in BOUNDS}|{(256,p,A) for p in range(2,144,2) for A in BOUNDS}
assert seen==required and len(seen)==10437
out={'status':'PASS_COMPLETE_CACHE_ISOLATION','X':str(X),'exact_required_index_set_complete':True,'all10437_exact_support_phase_precision_tolerance_U_source_keys_match':True,'minimum_reloaded_relative_accuracy_bits':minimum,'cache_sha256':hashlib.sha256((HERE/'MOMENT_CACHE.jsonl').read_bytes()).hexdigest(),'source_sha256':hashlib.sha256(Path(__file__).read_bytes()).hexdigest(),'scope':'Read-only verification of complete support-specific cache metadata and finite reloaded balls; not full operator positivity.'}
(HERE/'CACHE_ISOLATION_CHECK.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
