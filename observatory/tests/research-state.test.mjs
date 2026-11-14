import test from 'node:test';
import assert from 'node:assert/strict';
import { RESEARCH_DEFAULTS, RESEARCH_VIEW_NAMES, createResearchPresets, normalizeResearchConfig } from '../dist/research-state.js';
import { encodeViewURL, decodeViewURL } from '../dist/view-url.js';
import { fieldKey } from '../dist/field-cache.js';

const defaults={...RESEARCH_DEFAULTS,dynamicsMode:'off',projective:false,fiberMode:'off',geometry:'plane',function:'xi',playing:false,autoRotate:false,packets:false};
const presets=createResearchPresets(defaults);
const options={defaults,presets,validate:state=>({...state,...normalizeResearchConfig(state),playing:false})};
const origin='https://zeta-view.vercel.app/';

test('every research starting point has a short link and restores the intended experiment',()=>{
 for(const [mode,name] of Object.entries(RESEARCH_VIEW_NAMES)){
  const href=encodeViewURL(origin,{state:presets[name].settings},{...options,name});
  assert.equal(href,origin+'?view='+name);
  const decoded=decodeViewURL(href,options);
  assert.equal(decoded.valid,true);assert.equal(decoded.session.state.researchMode,mode);
  assert.equal(decoded.session.state.playing,false);
 }
});

test('a shared research experiment retains its exact nodes, model, parameters and paused frame',()=>{
 const state={...presets.heatZeros.settings,researchHeatModel:'quartic',researchHeatEnd:-.25,researchFrame:173,
  researchNodes:'-1.225,-0.25,0.35,1.327',researchT:21.022039638771555,researchA:.3712345678901234,
  researchAlpha:1.5123456789012345,researchGhost:true,researchShowVectors:false,playing:true,researchRunning:true};
 const href=encodeViewURL(origin,{state},{...options,name:'heatZeros'}),decoded=decodeViewURL(href,options);
 assert.equal(decoded.valid,true);
 for(const key of Object.keys(RESEARCH_DEFAULTS))assert.equal(decoded.session.state[key],state[key],key);
 assert.equal(decoded.session.state.playing,false);assert.equal(Object.hasOwn(decoded.session.state,'researchRunning'),false);
 assert.equal(encodeViewURL(href,decoded.session,{...options,name:decoded.name}),href);
});

test('semantic URL inference follows research mode even after large parameter changes',()=>{
 const state={...presets.bridgeShear.settings,researchMode:'gram',researchT:50,researchA:.91,researchNodes:'-2,-1,0,1,2'};
 assert.equal(decodeViewURL(encodeViewURL(origin,{state},options),options).name,'gramSchur');
});

test('invalid controls stay bounded and empty CSV tokens do not silently create Gram nodes',()=>{
 const state=normalizeResearchConfig({researchFrame:Infinity,researchRate:999,researchMode:'energy',researchSource:'xi',researchA:.1,
  researchNodes:' , -1, , 0, bad, 1, 99',researchFrozen:7,researchPrimeCount:4,researchPrimeSolo:30,researchShowContours:'false'});
 assert.equal(state.researchFrame,0);assert.equal(state.researchRate,12);assert.equal(state.researchA,.5);
 assert.equal(state.researchNodes,'-1,0,1');assert.equal(state.researchFrozen,2);assert.equal(state.researchPrimeSolo,4);
 assert.equal(state.researchShowContours,true);
});

test('logarithmic shear cannot reuse an incompatible phase or finite-bridge cache payload',()=>{
 const base={geometry:'plane',function:'xi',resolution:'draft',colorMode:'phase'};
 assert.notEqual(fieldKey({...base,colorMode:'shear'}),fieldKey(base));
 assert.notEqual(fieldKey({...base,colorMode:'shear'}),fieldKey({...base,colorMode:'bridge'}));
 assert.equal(fieldKey({...base,colorMode:'shear',researchFrame:200,researchMode:'shear'}),fieldKey({...base,colorMode:'shear'}));
 assert.equal(fieldKey({...base,colorMode:'shear',bridgeA:.5}),fieldKey({...base,colorMode:'shear',bridgeA:.2}));
});
