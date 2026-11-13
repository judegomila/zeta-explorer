import assert from 'node:assert/strict';
import test from 'node:test';
import {readFileSync,existsSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {encodeField,decodeField} from '../dist/cache-codec.js';
import {sampleField} from '../dist/sampler.js';
import {evaluatePolar,hardyZ} from '../dist/math.js';
import {fieldKey,FIELD_CACHE_VERSION} from '../dist/field-cache.js';

const base={geometry:'plane',function:'zeta',tau:0,resolution:'draft',extent:'extended',
  sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,chartScale:24,torusR:1.6,bridgeA:.25,
  colorMode:'phase',vortices:false,ladder:false,packets:false};

test('binary frame codec preserves typed bytes and nonfinite geometric metadata exactly',()=>{
 const input={double:new Float64Array([NaN,Infinity,-Infinity,-0,Number.MIN_VALUE,Math.PI]),
  single:new Float32Array([NaN,-0,Math.PI]),mask:new Uint8Array([0,1,255]),
  curve:[{t:Infinity,polar:null},{t:NaN,zero:-0}],nested:{n:-Infinity}};
 const encoded=encodeField(input),output=decodeField(encoded);
 assert.deepEqual(output,input);
 for(const name of ['double','single','mask'])assert.deepEqual(
  new Uint8Array(output[name].buffer,output[name].byteOffset,output[name].byteLength),
  new Uint8Array(input[name].buffer,input[name].byteOffset,input[name].byteLength));
 // A non-aligned transport view is valid too.
 const shifted=new Uint8Array(encoded.length+1);shifted.set(encoded,1);
 assert.deepEqual(decodeField(shifted.subarray(1)),input);
 assert.throws(()=>decodeField(encoded.subarray(0,encoded.length-1)),/Truncated/);
 const corrupt=encoded.slice();corrupt[0]=0;assert.throws(()=>decodeField(corrupt),/signature/);
});

test('pure sampler returns a complete renderable frame and exact precomputed inset without mutating state',()=>{
 const state={...base},before=structuredClone(state),progress=[];
 const data=sampleField(state,{onProgress:message=>progress.push(message)});
 assert.deepEqual(state,before);assert.ok(progress.length>1);
 assert.deepEqual(data.criticalSamples,[]);assert.deepEqual(data.landmarkValues,[]);
 assert.ok(data.slice.vals instanceof Float64Array);assert.equal(data.slice.vals.length,361);
 assert.equal(data.slice.lo,8);assert.equal(data.slice.hi,38);
 for(const i of [0,90,180,270,360])assert.equal(data.slice.vals[i],hardyZ(8+30*i/360));
 const decoded=decodeField(encodeField(data));
 assert.deepEqual(decoded,data);
});

const manifestUrl=new URL('../dist/precache/manifest.json',import.meta.url);
test('shipped starter frames have exact keys, shared geometry and independently evaluated heat values',
 {skip:!existsSync(manifestUrl)},()=>{
 const manifest=JSON.parse(readFileSync(manifestUrl,'utf8'));
 assert.equal(manifest.version,FIELD_CACHE_VERSION);
 const unique=new Set();
 for(const [key,entry]of Object.entries(manifest.entries)){
  assert.equal(key,fieldKey(entry.state));assert.equal(entry.compression,'gzip');
  for(const url of [entry.url,entry.meshUrl])assert.ok(existsSync(new URL('../dist/'+url,import.meta.url)));
 }
 for(const geometry of ['plane','sphere','torus'])for(let i=0;i<17;i++)for(const ladder of [false,true]){
  const state={...base,resolution:'standard',function:'heat',geometry,tau:Number((-.3+i*.05).toFixed(2)),ladder};
  assert.ok(manifest.entries[fieldKey(state)],`complete ${geometry} clip at tau=${state.tau}, ladder=${ladder}`);
 }
 for(const geometry of ['plane','sphere','torus'])for(const tau of [-.3,0,.5]){
  const state={...base,resolution:'standard',function:'heat',geometry,tau};
  const entry=manifest.entries[fieldKey(state)];assert.ok(entry,`${geometry} heat ${tau} exists`);
  const load=url=>decodeField(gunzipSync(readFileSync(new URL('../dist/'+url,import.meta.url))));
  const data={...load(entry.meshUrl),...load(entry.url)};unique.add(entry.url);
  assert.ok(data.slice.vals.length===361);assert.ok(data.validCount>10000);
  if(geometry!=='plane')assert.ok(data.criticalSamples.length>0);
  let checked=0;
  for(let k=0;k<data.valid.length&&checked<5;k+=137)if(data.valid[k]){
   const p=evaluatePolar(data.coords[2*k],data.coords[2*k+1],'heat',tau);
   assert.equal(data.logAbs[k],p.logAbs);assert.equal(data.arg[k],p.arg);checked++;
  }
  assert.equal(checked,5);
 }
 assert.equal(unique.size,9,'different heat parameters use independently evaluated frame files');
});
