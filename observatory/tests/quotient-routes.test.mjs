import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {ZERO_HEIGHTS} from '../dist/math.js';
import {isQuotientGeometry} from '../dist/quotient.js';
import {fieldKey} from '../dist/field-cache.js';
import {encodeViewURL,decodeViewURL} from '../dist/view-url.js';
import {RESEARCH_DEFAULTS,RESEARCH_LIMITS,RESEARCH_ENUMS,RESEARCH_VIEW_NAMES,normalizeResearchConfig,createResearchPresets} from '../dist/research-state.js';
import {DYNAMICS_DEFAULTS,DYNAMICS_LIMITS,DYNAMICS_ENUMS,normalizeDynamicsConfig} from '../dist/dynamics.js';
import * as channelsState from '../dist/channels-state.js';
import * as infinityState from '../dist/infinity.js';
import * as dualState from '../dist/dual.js';
import * as displayState from '../dist/display-field.js';

// Exercise the application's real presets, enums and validation gate. Importing
// app.js would initialize a live DOM/renderer; extract its pre-DOM bootstrap
// rather than maintain a second, potentially divergent implementation in tests.
const source=await fs.readFile(new URL('../dist/app.js',import.meta.url),'utf8');
const start=source.indexOf('const $='),end=source.indexOf('const incomingView=');
assert.ok(start>=0&&end>start,'application bootstrap boundaries remain identifiable');
const bootstrap=source.slice(start,end);
function functionBetween(begin,next){
  const a=source.indexOf(begin),b=source.indexOf(next,a+begin.length);
  assert.ok(a>=0&&b>a,`${begin} remains executable in the integration harness`);
  return source.slice(a,b);
}
const selection=functionBetween('function selectMount(','\nfunction focusFiber(');
const changes=functionBetween('function change(','\n$$(\'[data-setting]\')');
const origin='https://zeta-view.vercel.app/';

function actualApp(){
  const effects=[],stage={scrollTop:99};
  const context=vm.createContext({
    ...channelsState,...infinityState,...dualState,...displayState,ZERO_HEIGHTS,isQuotientGeometry,fieldKey,performance,
    RESEARCH_DEFAULTS,RESEARCH_LIMITS,RESEARCH_ENUMS,RESEARCH_VIEW_NAMES,normalizeResearchConfig,createResearchPresets,
    DYNAMICS_DEFAULTS,DYNAMICS_LIMITS,DYNAMICS_ENUMS,normalizeDynamicsConfig,
    document:{querySelector:selector=>{assert.equal(selector,'.main-stage');return stage;}},
    recordEffect:effect=>effects.push(effect),
  });
  vm.runInContext(bootstrap+`
    const scene={getCameraState:()=>null,updateStyle:()=>recordEffect('style')};
    function settleCamera(){}
    function stopHeat(){state.playing=false;}
    function cancelField(){}
    function cancelWarm(){}
    function syncUI(){}
    function storeState(options){recordEffect(options?.mode||'replace');}
    function compute(){recordEffect('compute');}
    function scheduleCompute(){recordEffect('scheduleCompute');}
    function closeDrawers(){}
    function clipMatches(){return false;}
    function renderSettings(){return state;}
    function drawAtlas(){}
    function drawSlice(){}
    function holdProbe(){}
    function updateProjective(){}
    function updateFiber(){}
    function focusFiber(){}
    function toast(message){recordEffect(message);}
  `+selection+'\n'+changes+`
    globalThis.appTest={config:viewConfig,validate,selectMount,change,
      setState:value=>{state=validate(value);},getState:()=>({...state}),
      setProbe:value=>{probe={...value};},getProbe:()=>({...probe})};
  `,context,{timeout:1000});
  return {...context.appTest,effects,stage};
}
const query=(name,state)=>origin+'?'+new URLSearchParams({view:name,state:JSON.stringify(state)});

test('actual application recognizes the short Klein and annulus routes and preserves their canonical names',()=>{
  const app=actualApp();
  for(const name of ['klein','annulus']){
    const decoded=decodeViewURL(origin+'?view='+name,app.config);
    assert.equal(decoded.valid,true,decoded.error);assert.equal(decoded.name,name);
    const state=decoded.session.state;
    assert.equal(state.geometry,name);assert.equal(state.projective,true);assert.equal(state.function,'xi');
    assert.equal(state.fiberMode,'off');assert.equal(state.dynamicsMode,'off');assert.equal(state.researchMode,'off');assert.equal(state.playing,false);
    assert.equal(encodeViewURL(origin,decoded.session,{...app.config,name}),origin+'?view='+name);
    assert.equal(decodeViewURL(encodeViewURL(origin,decoded.session,app.config),app.config).name,name);
  }
});

test('actual import gate repairs incompatible raw-zeta, fiber and Klein relief settings',()=>{
  const app=actualApp();
  for(const geometry of ['klein','annulus'])for(const fiberMode of ['spinor','twistor']){
    const imported={geometry,projective:false,function:'zeta',fiberMode,heightMode:'imag',height:1.8,playing:true};
    const direct=app.validate(imported),decoded=decodeViewURL(query(geometry,imported),app.config);
    assert.equal(decoded.valid,true,decoded.error);
    for(const state of [direct,decoded.session.state]){
      assert.equal(state.geometry,geometry);assert.equal(state.projective,true);assert.equal(state.function,'xi');assert.equal(state.fiberMode,'off');
      assert.equal(state.playing,false);assert.doesNotThrow(()=>fieldKey(state));
      assert.equal(state.heightMode,geometry==='klein'?'flat':'imag');assert.equal(state.height,geometry==='klein'?0:1.8);
    }
    const legacy=origin+'#'+new URLSearchParams({view:JSON.stringify({state:imported})});
    const restored=decodeViewURL(legacy,app.config);assert.equal(restored.valid,true,restored.error);
    assert.equal(restored.session.state.geometry,geometry);assert.equal(restored.session.state.function,'xi');assert.equal(restored.session.state.fiberMode,'off');
  }
});

test('actual quotient URLs roundtrip exact heat, lens, elliptic shape, probe and camera settings',()=>{
  const app=actualApp();
  for(const geometry of ['klein','annulus']){
    const state={...app.config.presets[geometry].settings,function:'heat',tau:-.1734567890123456,
      chartScale:37.12345678901234,torusR:2.271234567890123,bridgeA:.3712345678901234,
      projectiveChannel:'derivative',derivativeScale:3.123456789012345,colorMode:'imag',phaseOffset:1.2345678901234567,
      resolution:'high',extent:'core',height:geometry==='klein'?0:.7312345678901234,heightMode:geometry==='klein'?'flat':'real',
      heatStart:-.27,heatEnd:.43,heatFrames:33,heatFPS:7,playing:true};
    const probe={sigma:.2712345678901234,t:-27.12345678901234};
    const camera={type:'software',azimuth:1.2345678901234567,elevation:.4321234567890123,zoom:1.731234567890123,pan:[.137,-.221]};
    const href=encodeViewURL(origin,{state,probe,camera},{...app.config,name:geometry}),decoded=decodeViewURL(href,app.config);
    assert.equal(decoded.valid,true,decoded.error);assert.equal(decoded.name,geometry);
    for(const key of ['geometry','function','tau','chartScale','torusR','bridgeA','projectiveChannel','derivativeScale','colorMode','phaseOffset','resolution','extent','height','heightMode','heatStart','heatEnd','heatFrames','heatFPS'])assert.equal(decoded.session.state[key],state[key],key);
    assert.deepEqual(decoded.session.probe,probe);assert.deepEqual(decoded.session.camera,camera);assert.equal(decoded.session.state.playing,false);
    assert.equal(encodeViewURL(href,decoded.session,{...app.config,name:decoded.name}),href);
  }
});

test('actual quotient state validation bounds controls without changing valid lens and shape values',()=>{
  const app=actualApp();
  for(const geometry of ['klein','annulus']){
    const decoded=decodeViewURL(query(geometry,{torusR:99,chartScale:-20,tau:8,function:'heat',geometry,projective:false,
      fiberMode:'twistor',height:1e8,derivativeScale:500,phaseOffset:-4}),app.config);
    assert.equal(decoded.valid,true,decoded.error);
    const state=decoded.session.state;
    assert.equal(state.torusR,3);assert.equal(state.chartScale,1);assert.equal(state.tau,.5);assert.equal(state.derivativeScale,20);assert.equal(state.phaseOffset,0);
    assert.equal(state.height,geometry==='klein'?0:2.4);assert.equal(state.projective,true);assert.equal(state.fiberMode,'off');
    const valid=app.validate({...state,torusR:1.83,chartScale:12.4});assert.equal(valid.torusR,1.83);assert.equal(valid.chartScale,12.4);
  }
});

test('actual control updates cannot reenable raw zeta or normal relief on Klein',()=>{
  const app=actualApp();app.setState(app.config.presets.klein.settings);
  assert.doesNotThrow(()=>app.change('function','zeta'));
  assert.equal(app.getState().function,'xi');assert.equal(app.getState().projective,true);
  app.change('heightMode','imag');app.change('height',1.4);
  assert.equal(app.getState().heightMode,'flat');assert.equal(app.getState().height,0);
  app.change('function','heat');app.change('tau',-.12);
  assert.equal(app.getState().function,'heat');assert.equal(app.getState().tau,-.12);
  assert.ok(app.effects.includes('scheduleCompute'));
});

test('actual mount selection preserves the spectral lens, shape and probe while enabling the quotient',()=>{
  for(const geometry of ['klein','annulus']){
    const app=actualApp(),probe={sigma:.731234567890123,t:21.022039638771555};
    app.setState({...app.config.defaults,geometry:'torus',projective:false,function:'zeta',torusR:1.83,chartScale:12.4,heightMode:'log',height:1.2});
    app.setProbe(probe);app.selectMount(geometry,false,{fiberMode:'twistor'});
    const state=app.getState();assert.equal(state.geometry,geometry);assert.equal(state.projective,true);assert.equal(state.fiberMode,'off');assert.equal(state.function,'xi');
    assert.equal(state.torusR,1.83);assert.equal(state.chartScale,12.4);assert.deepEqual(structuredClone(app.getProbe()),probe);
    if(geometry==='klein'){assert.equal(state.height,0);assert.equal(state.heightMode,'flat');}
    assert.equal(app.stage.scrollTop,0);assert.ok(app.effects.includes('push'));assert.ok(app.effects.includes('compute'));
  }
});

