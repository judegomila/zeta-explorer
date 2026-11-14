#!/usr/bin/env node
/** Reproduce the saved comparison. Add --reference for the independent
 * 60-digit Python/mpmath checks; this explicitly replaces all saved datasets.
 */
import {spawnSync} from 'node:child_process';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';

const root=fileURLToPath(new URL('..',import.meta.url));
const output=resolve(root,'dist/experiments');
await mkdir(output,{recursive:true});
function run(command,args){
 const result=spawnSync(command,args,{cwd:root,encoding:'utf8'});
 if(result.status!==0)throw new Error(result.stderr||result.stdout||String(result.error));
}
run(process.execPath,['scripts/experiments/theta-sweep.mjs',root,resolve(output,'zero-confinement-theta.json')]);
run(process.execPath,['scripts/experiments/shear-probe.mjs',resolve(output,'zero-confinement-shear.json')]);
run(process.execPath,['scripts/experiments/quartic-comparison.mjs',root,resolve(output,'zero-confinement-quartic')]);
if(process.argv.includes('--reference')){
 run(process.env.CODEX_PRIMARY_RUNTIME_PYTHON||'python3',['scripts/experiments/theta-reference.py',resolve(output,'zero-confinement-theta.json')]);
}
const sourceHashes={};
for(const name of ['math.js','research-math.js','research-dynamics.js','research-state.js']){
 sourceHashes['dist/'+name]=createHash('sha256').update(await readFile(resolve(root,'dist',name))).digest('hex');
}
for(const name of ['theta','shear','quartic']){
 const path=resolve(output,`zero-confinement-${name}.json`),data=JSON.parse(await readFile(path,'utf8'));
 data.evaluatedSourceSha256=sourceHashes;
 await writeFile(path,JSON.stringify(data,(_,v)=>typeof v==='number'&&!Number.isFinite(v)?null:v)+'\n');
}
// The full polynomial proof is ordinary text suitable for independent review.
await rename(resolve(output,'zero-confinement-quartic.txt'),resolve(output,'zero-confinement-quartic-proof.txt'));
const theta=JSON.parse(await readFile(resolve(output,'zero-confinement-theta.json'),'utf8'));
console.log(JSON.stringify({
 saved:'dist/experiments/zero-confinement-{theta,shear,quartic}.json',
 independentReference:!!theta.independentVerification,
 numericalScope:theta.runs.map(run=>run.summary),
 sourceHashes,
},null,2));
