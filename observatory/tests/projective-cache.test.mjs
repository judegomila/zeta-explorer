import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {FieldCache,fieldKey} from '../dist/field-cache.js';
import {sequenceKey} from '../dist/playback.js';
import {sampleField} from '../dist/sampler.js';
import {encodeField,decodeField} from '../dist/cache-codec.js';

const base={geometry:'sphere',projective:true,function:'xi',tau:0,resolution:'draft',extent:'extended',
  sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,chartScale:24,torusR:2,bridgeA:.25,
  colorMode:'phase',vortices:false,ladder:false,packets:false,projectiveChannel:'domain',derivativeScale:1};

test('projective fields and clips are isolated while shipped ordinary cache keys stay unchanged',()=>{
  const manifest=JSON.parse(readFileSync(new URL('../dist/precache/manifest.json',import.meta.url),'utf8'));
  for(const [key,entry]of Object.entries(manifest.entries)){
    assert.equal(fieldKey({...entry.state,projective:false}),key,'ordinary starter frame remains addressable');
  }
  for(const geometry of ['sphere','torus']){
    const state={...base,geometry};
    assert.notEqual(fieldKey(state),fieldKey({...state,projective:false}));
    assert.notEqual(sequenceKey(state),sequenceKey({...state,projective:false}));
    assert.notEqual(fieldKey(state),fieldKey({...state,torusR:1.7}),'branch geometry participates in identity');
    assert.equal(fieldKey(state),fieldKey({...state,projectiveChannel:'derivative',derivativeScale:12}));
    assert.equal(sequenceKey(state),sequenceKey({...state,projectiveChannel:'bridge',derivativeScale:.1}));
  }
  assert.equal(fieldKey({...base,geometry:'plane'}),fieldKey({...base,geometry:'plane',projective:false}));
});

test('projective frames retain computed guides and chart landmarks through cache and binary transport',async()=>{
  const cache=new FieldCache({memoryBudgetBytes:64*1024*1024,storageBudgetBytes:0,persistentStore:null});
  for(const geometry of ['sphere','torus']){
    const state={...base,geometry},data=sampleField(state),ordinary={...state,projective:false};
    assert.ok(data.projectiveGuides.length>0);
    assert.equal(data.landmarkValues.filter(p=>p.kind==='chart').length,2);
    for(const p of data.landmarkValues.filter(p=>p.kind==='puncture')){
      assert.equal(p.computed,false);assert.equal(p.polar,null);
    }
    const decoded=decodeField(encodeField(data));
    assert.deepEqual(decoded.projectiveGuides,data.projectiveGuides);
    assert.deepEqual(decoded.landmarkValues,data.landmarkValues);
    await cache.set(state,decoded);
    assert.equal(await cache.get(ordinary),null,'ordinary view cannot consume projective chart data');
    const hit=await cache.get({...state,projectiveChannel:'derivative',derivativeScale:3});
    assert.equal(hit.source,'memory');
    assert.deepEqual(hit.data.coords,data.coords);
    assert.deepEqual(hit.data.projectiveGuides,data.projectiveGuides);
    assert.deepEqual(hit.data.landmarkValues,data.landmarkValues);
  }
});
