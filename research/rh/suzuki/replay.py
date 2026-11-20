#!/usr/bin/env python3
"""Portable replay; frozen code/receipts are never overwritten."""
import argparse,gzip,hashlib,json,shutil,subprocess,sys,tempfile
from pathlib import Path
p=argparse.ArgumentParser();p.add_argument('--output-directory');p.add_argument('--include-independent',action='store_true');a=p.parse_args()
root=Path(__file__).resolve().parent
out=Path(a.output_directory).resolve() if a.output_directory else Path(tempfile.mkdtemp(prefix='suzuki-replay-'))
out.mkdir(parents=True,exist_ok=True)
if any(out.iterdir()):raise SystemExit('Output directory must be empty; frozen files are not overwritten.')
code=out/'code';shutil.copytree(root/'code',code)
manifest=json.loads((root/'CODE_AND_RECEIPTS_MANIFEST.json').read_text())
for item in manifest['files']:
 data=(root/item['transport_path']).read_bytes()
 assert hashlib.sha256(data).hexdigest()==item['transport_sha256'],item['transport_path']
 if item.get('encoding'):data=gzip.decompress(data)
 assert hashlib.sha256(data).hexdigest()==item['source_sha256'],item['transport_path']
def run(script,args=(),cwd=None):
 with (out/(script+'.log')).open('w') as log:
  subprocess.run([sys.executable,str(code/script),*map(str,args)],cwd=cwd or out,stdout=log,stderr=subprocess.STDOUT,check=True)
run('certify_coarse_reserve.py',['--limit',10000000,'--bits',256,'--output',out/'COARSE_RESERVE_10M_256BIT.json'])
run('check_origin_interval.py')
run('check_prime_only_algebra.py',['--bits',256,'--output',out/'PRIME_ONLY_ALGEBRA_256BIT.json'])
run('check_variation_constants.py',['--bits',256,'--output',out/'VARIATION_CHECKS_256BIT.json'])
run('check_elementary_onset.py')
run('check_future_hull_budget.py')
checks={}
def compare(name,actual,expected,elapsed=False):
 aa=json.loads(actual.read_text());bb=json.loads(expected)
 if elapsed:aa.pop('elapsed_seconds');bb.pop('elapsed_seconds')
 assert aa==bb,name
 checks[name]='all JSON fields identical'+(' except elapsed_seconds' if elapsed else '')
compare('COARSE_RESERVE_10M_256BIT.json',out/'COARSE_RESERVE_10M_256BIT.json',gzip.decompress((root/'receipts/COARSE_RESERVE_10M_256BIT.json.gz').read_bytes()),True)
for name in ['ORIGIN_INTERVAL_192_256BIT.json','PRIME_ONLY_ALGEBRA_256BIT.json','VARIATION_CHECKS_256BIT.json','ELEMENTARY_ONSET_CHECKS.json','FUTURE_HULL_BUDGET_192_256BIT.json']:
 actual=out/name
 if not actual.exists():actual=code/name
 compare(name,actual,(root/'receipts'/name).read_bytes())
if a.include_independent:
 run('independent_spf_and_direct_reserve.py')
 name='INDEPENDENT_SPF_DIRECT_384BIT.json'
 compare(name,code/name,(root/'receipts'/name).read_bytes(),True)
report={'status':'PASS','cutoff':10000000,'checks':checks,'independent_384bit_rerun':a.include_independent,'scope':'Scoped scalar finite positivity and symbolic/scalar algebra replay; analytic proofs and audit conditions remain required. No all-future endpoint bound or RH claim.'}
(out/'REPLAY_RESULT.json').write_text(json.dumps(report,indent=2,sort_keys=True)+'\n')
print(json.dumps(report,indent=2,sort_keys=True));print('Output:',out)
