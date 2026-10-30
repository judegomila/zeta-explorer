#!/usr/bin/env python3
"""Clean complete X161 eighth-power repair replay against the frozen base package.

No original source, reference receipt or cache is overwritten. All moments,
old/new prime norm receipts, preflight, small and full gates are regenerated in
an isolated source overlay. Requires sibling ../spectral and its pinned runtime.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, json, shutil, subprocess, sys, tempfile, time
HERE=Path(__file__).resolve().parent
BASE=HERE.parent/'spectral'
D='rh_attack_cycle_20261030/support_endpoint_X161_power8_repair/'
T='rh_attack_cycle_20261030/support_endpoint_X161/diagnosis/'
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
def main():
 ap=argparse.ArgumentParser(description=__doc__);ap.add_argument('--report',type=Path);args=ap.parse_args()
 if args.report:
  assert not args.report.exists(),'Refusing to overwrite report'
  assert HERE/'reference' not in args.report.resolve().parents
  assert BASE/'reference' not in args.report.resolve().parents
 import flint
 assert flint.__version__=='0.9.0'
 manifest=json.loads((HERE/'manifest.json').read_text());base=json.loads((BASE/'manifest.json').read_text())
 assert sha(BASE/'manifest.json')==manifest['base_manifest_sha256']
 assert sha(BASE/'replay.py')==manifest['base_replay_helper_sha256']
 spec=importlib.util.spec_from_file_location('spectral_base_helpers',BASE/'replay.py');helper=importlib.util.module_from_spec(spec);spec.loader.exec_module(helper)
 def check_frozen():
  helper.verify_static_sources(BASE/'source-tree',base);helper.verify_static_sources(HERE/'source-tree',manifest)
  for package,m in [(BASE,base),(HERE,manifest)]:
   for rel,info in m['reference_receipts'].items():assert sha(package/'reference'/rel)==info['transport_sha256']
 check_frozen()
 work=Path(tempfile.mkdtemp(prefix='rh-spectral-repair-'));shutil.copytree(BASE/'source-tree',work,dirs_exist_ok=True);shutil.copytree(HERE/'source-tree',work,dirs_exist_ok=True)
 logdir=work/'replay-logs';logdir.mkdir()
 commands=base['cases']['failed']['commands'][:5]+[[T+'X161_power8_targeted.py'],[D+'repaired_inputs.py'],[D+'certify_repaired_support.py','--small'],[D+'certify_repaired_support.py','--full']]
 started=time.time();out={'schema_version':1,'status':'RUNNING','manifest_sha256':sha(HERE/'manifest.json'),'launcher_sha256':sha(Path(__file__)),'base_manifest_sha256':sha(BASE/'manifest.json'),'disposable_work_directory_name':work.name,'python':sys.version.split()[0],'python_flint':flint.__version__,'stages':[],'receipt_comparisons':[]}
 print('Disposable replay tree:',work,flush=True)
 try:
  for i,command in enumerate(commands,1):
   print(f'Stage {i}/{len(commands)}: {" ".join(command)}',flush=True);log=logdir/f'{i:02d}-{Path(command[0]).stem}.log';t=time.time()
   with log.open('w') as stream:run=subprocess.run([sys.executable,*command],cwd=work,stdout=stream,stderr=subprocess.STDOUT,check=False)
   out['stages'].append({'command':command,'exit_code':run.returncode,'seconds':time.time()-t,'log':str(log.relative_to(work))})
   assert run.returncode==0,f'Stage failed; inspect {log}'
   helper.verify_static_sources(work,base);helper.verify_static_sources(work,manifest)
  case=base['cases']['failed'];out['cache']=helper.verify_cache(work/case['cache'],case)
  oldpaths=[case['directory']+'/'+f for f in ['MOMENT_CACHE_META.json','MOMENT_CACHE_COMPLETE.json','PREFLIGHT_SUPPORT_AND_CACHE.json','CACHE_ISOLATION_CHECK.json']]+['rh_attack_cycle_20261030/support_endpoint_next_feasibility/X161_POWER7_FEASIBILITY.json']
  newpaths=[T+'X161_POWER8_TARGETED.json']+[D+f for f in ['REPAIR_WRAPPER_PREFLIGHT.json','REPAIRED_SMALL_DENSE_GATE.json','REPAIRED_FULL_EVEN_CERTIFICATE.json']]
  for package,paths in [(BASE,oldpaths),(HERE,newpaths)]:
   for rel in paths:
    current=json.loads((work/rel).read_text());reference=json.loads((package/'reference'/rel).read_text());count=helper.verify_source_maps(current,work)
    a,b=helper.math_fields(current),helper.math_fields(reference)
    assert a==b,f'Mathematical receipt mismatch: {rel}'
    out['receipt_comparisons'].append({'path':rel,'all_mathematical_and_nontiming_nonprovenance_fields_identical':True,'verified_emitted_source_hashes':count,'canonical_mathematical_fields_sha256':hashlib.sha256(helper.canonical(a)).hexdigest()})
  full=json.loads((work/D/'REPAIRED_FULL_EVEN_CERTIFICATE.json').read_text())
  assert full['status']=='PASS' and full['dimension']==2049 and full['all_sources_unchanged']
  assert all(full[k]['pass_positive'] for k in ['core','coefficient_H','whitened_Schur'])
  assert full['old_far_majorant_reused_unchanged'] and full['exact_near_denominator_increase']=='0.014520'
  check_frozen();out.update(status='PASS_COMPLETE_CLEAN_REPAIR_REPRODUCTION',complete_gate_fields=helper.math_fields(full),all_base_and_delta_source_bytes_unchanged=True,all_reference_receipts_unchanged=True,scope='Clean producer packaging replay of the separately independently accepted whole-even sqrt(161/10) repair. Old seventh-power failure and old X16.001 acceptance are preserved. No numerical coercivity constant, odd/cofinal or RH result.')
 except BaseException as exc:
  out.update(status='FAILED_OR_INCOMPLETE_REPRODUCTION',error=repr(exc));raise
 finally:
  out['seconds']=time.time()-started;(work/'REPLAY_RESULT.json').write_text(json.dumps(out,indent=2)+'\n')
  if args.report:
   args.report.parent.mkdir(parents=True,exist_ok=True)
   with args.report.open('x') as stream:stream.write(json.dumps(out,indent=2)+'\n')
  print('Replay status:',out['status'],'report:',work/'REPLAY_RESULT.json',flush=True)
if __name__=='__main__':main()
