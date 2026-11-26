import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import vm from 'node:vm';
import {ZERO_HEIGHTS,NUMERICS} from '../dist/math.js';
import {isQuotientGeometry} from '../dist/quotient.js';
import {domainFor} from '../dist/domain.js';
import {fieldKey} from '../dist/field-cache.js';
import {encodeViewURL,decodeViewURL,sanitizeViewCamera,sanitizeViewProbe} from '../dist/view-url.js';
import * as channelsState from '../dist/channels-state.js';
import * as infinityState from '../dist/infinity.js';
import * as dualState from '../dist/dual.js';
import * as modelsState from '../dist/models.js';
import * as displayState from '../dist/display-field.js';
import {HOLE_DEFAULTS,HOLE_LIMITS} from '../dist/domain.js';
import {RESEARCH_DEFAULTS,RESEARCH_LIMITS,RESEARCH_ENUMS,RESEARCH_VIEW_NAMES,normalizeResearchConfig,createResearchPresets} from '../dist/research-state.js';
import {DYNAMICS_DEFAULTS,DYNAMICS_LIMITS,DYNAMICS_ENUMS,normalizeDynamicsConfig} from '../dist/dynamics.js';

// Run the actual application's state and navigation functions. This intentionally
// avoids a duplicate router implementation and avoids starting a WebGL renderer.
const source=await fs.readFile(new URL('../dist/app.js',import.meta.url),'utf8');
function between(begin,next){
 const a=source.indexOf(begin),b=source.indexOf(next,a+begin.length);
 assert.ok(a>=0&&b>a,`${begin} remains available to the application harness`);
 return source.slice(a,b);
}
const bootstrap=between('const $=','const incomingView=');
const navigation=[
 between('function shareViewName(','\nfunction storeState('),
 between('async function restoreURLView(','\n\nfunction syncUI('),
 between('function selectMount(','\nfunction focusFiber('),
 between('function selectFiber(','\nfunction updateFiber('),
 between('function applyPreset(',"\n$('lockHeight')"),
 between('function session(','\nfunction download('),
 between('function changeChannels(','\nchannelsPanel=new ChannelsPanel('),
 between("$('pngBtn').onclick=", "$('jsonBtn').onclick="),
 between("document.addEventListener('keydown'", "\nwindow.addEventListener('resize'"),
].join('\n');
const origin='https://zeta-view.vercel.app/';

function actualApp(){
 const effects=[],nodes=new Map(),listeners=new Map();
 const makeNode=id=>({id,tagName:'DIV',textContent:'',value:'',hidden:false,open:false,scrollTop:99,dataset:{},
  classList:{add(){},remove(){},toggle(){}},setAttribute(){},getAttribute(){return null;},
  append(){},remove(){},click(){effects.push('click:'+id);},querySelector(){return makeNode('nested');},querySelectorAll(){return []}});
 const node=id=>{if(!nodes.has(id))nodes.set(id,makeNode(id));return nodes.get(id);};
 const document={getElementById:node,querySelectorAll:()=>[],
  querySelector:selector=>selector==='dialog[open]'?null:node(selector),
  createElement:tag=>({...makeNode('created:'+tag),tagName:tag.toUpperCase()}),
  activeElement:{tagName:'BODY'},body:{append(){}},
  addEventListener:(name,callback)=>listeners.set(name,callback)};
 const context=vm.createContext({
  ...channelsState,...infinityState,...dualState,...modelsState,...displayState,HOLE_DEFAULTS,HOLE_LIMITS,ZERO_HEIGHTS,NUMERICS,isQuotientGeometry,domainFor,fieldKey,performance,document,
  RESEARCH_DEFAULTS,RESEARCH_LIMITS,RESEARCH_ENUMS,RESEARCH_VIEW_NAMES,normalizeResearchConfig,createResearchPresets,
  DYNAMICS_DEFAULTS,DYNAMICS_LIMITS,DYNAMICS_ENUMS,normalizeDynamicsConfig,
  sanitizeViewCamera,sanitizeViewProbe,Blob,clearTimeout,setTimeout,
  recordEffect:effect=>effects.push(effect),
 });
 vm.runInContext(bootstrap+`
  const scene={getCameraState:()=>({type:'software',azimuth:1,elevation:.4,zoom:1,pan:[0,0]}),
   updateStyle:()=>recordEffect('surface-style'),screenshot:()=>{recordEffect('surface-screenshot');return null;}};
  dynamicsPanel={pause:()=>recordEffect('dynamics-pause'),flush:()=>recordEffect('dynamics-flush'),togglePlay:()=>recordEffect('dynamics-play')};
  researchPanel={pause:()=>recordEffect('research-pause'),flush:()=>recordEffect('research-flush'),togglePlay:()=>recordEffect('research-play')};
  infinityPanel={pause:()=>recordEffect('infinity-pause'),flush:()=>recordEffect('infinity-flush'),
   update:()=>recordEffect('infinity-update'),exportData:()=>({kind:'infinity',mode:state.infinityMode})};
  dualPanel={update:()=>recordEffect('dual-update'),hold:()=>recordEffect('dual-hold')};
  channelsPanel={pause:()=>recordEffect('channels-pause'),flush:()=>recordEffect('channels-flush'),
   update:(value,options)=>recordEffect(options?.restore?'channels-restore':'channels-update'),
   togglePlay:()=>recordEffect('channels-play'),reset:()=>recordEffect('channels-reset'),
   exportData:()=>({kind:'channels',frame:state.channelsFrame}),getSnapshot:()=>({state:{frame:state.channelsFrame}})};
  function settleCamera(){}
  function stopHeat(){state.playing=false;}
  function cancelField(){recordEffect('cancel-field');}
  function cancelWarm(){recordEffect('cancel-warm');}
  function syncUI(){recordEffect('sync');}
  function storeState(options){recordEffect(options?.mode||'replace');}
  function compute(){recordEffect('compute');}
  function closeDrawers(){}
  function focusFiber(){}
  function updateProjective(){}
  function change(key,value){state[key]=value;}
  function resetViewCamera(){recordEffect('surface-camera-reset');}
  function changeResearch(patch){Object.assign(state,patch);recordEffect('research-reset');}
  function changeDynamics(patch){Object.assign(state,patch);recordEffect('dynamics-reset');}
  function toast(message){recordEffect('toast:'+message);}
  function download(blob){recordEffect('download:'+blob.type);}
  function filename(ext){return 'view.'+ext;}
 `+navigation+`
  globalThis.appTest={config:viewConfig,validate,applyPreset,selectMount,selectFiber,restoreURLView,session,shareViewName,changeChannels,
   setState:value=>{state=validate(value);},getState:()=>({...state}),
   setPendingFrame:value=>{channelsPanel.flush=()=>{state.channelsFrame=value;recordEffect('channels-flush');};},
   setData:value=>{data=value;},getButton:id=>$(id)};
 `,context,{timeout:1500});
 return {...context.appTest,effects,nodes,listeners,document};
}

test('main-app short channel routes enter the native mode and preserve full share state',()=>{
 const app=actualApp();
 for(const name of ['channels','coupling','newton']){
  const decoded=decodeViewURL(origin+'?view='+name,app.config);
  assert.equal(decoded.valid,true,decoded.error);assert.equal(decoded.name,name);
  const state=decoded.session.state;
  assert.equal(state.channelsMode,name);assert.equal(state.researchMode,'off');assert.equal(state.dynamicsMode,'off');
  assert.equal(state.projective,false);assert.equal(state.fiberMode,'off');assert.equal(state.playing,false);
  app.setState(state);assert.equal(app.shareViewName(),name);
  const changed={...state,channelsFrame:60,channelsBranch:1,channelsRadiusScale:1.25,channelsSeed:73,channelsTravel:.37};
  const url=encodeViewURL(origin,{state:changed},{...app.config,name});
  const restored=decodeViewURL(url,app.config);assert.equal(restored.valid,true,restored.error);
  for(const key of ['channelsMode','channelsFrame','channelsBranch','channelsRadiusScale','channelsSeed','channelsTravel'])assert.equal(restored.session.state[key],changed[key],key);
  assert.equal(encodeViewURL(url,restored.session,{...app.config,name}),url);
 }
});

test('main import validation makes Channels exclusive even when old quotient and fiber settings remain',()=>{
 const app=actualApp();
 for(const geometry of ['klein','annulus','torus']){
  const state=app.validate({...app.config.presets.channels.settings,geometry,projective:true,fiberMode:'twistor',
   researchMode:'heat',dynamicsMode:'phase',autoRotate:true,packets:true,playing:true});
  assert.equal(state.channelsMode,'channels');assert.equal(state.geometry,'plane');assert.equal(state.projective,false);
  assert.equal(state.fiberMode,'off');assert.equal(state.researchMode,'off');assert.equal(state.dynamicsMode,'off');
  assert.equal(state.autoRotate,false);assert.equal(state.packets,false);assert.equal(state.playing,false);
 }
});

test('main navigation exits Channels for each surface, quotient, fiber, research and dynamics view',()=>{
 for(const [geometry,projective] of [['plane',false],['sphere',false],['torus',false],['torus',true],['klein',true],['annulus',true]]){
  const app=actualApp();app.setState(app.config.presets.channels.settings);app.selectMount(geometry,projective);
  const state=app.getState();assert.equal(state.channelsMode,'off');assert.equal(state.geometry,geometry);
  assert.equal(state.projective,projective);assert.ok(app.effects.includes('channels-pause'));
  assert.ok(app.effects.includes('push'));assert.ok(app.effects.includes('compute'));
 }
 for(const name of ['critical','projective','spinor','twistor','klein','annulus','bridgeShear','dynamics','smoothKlein','infinityEnd','stripEnds','dualTwistor']){
  const app=actualApp();app.setState(app.config.presets.channels.settings);app.applyPreset(name);
  assert.equal(app.getState().channelsMode,'off',name);assert.ok(app.effects.includes('channels-pause'),name);
 }
 for(const fiberMode of ['spinor','twistor']){
  const app=actualApp();app.setState(app.config.presets.channels.settings);app.selectFiber(fiberMode);
  assert.equal(app.getState().channelsMode,'off');assert.equal(app.getState().fiberMode,fiberMode);
 }
});

test('infinity, strip, smooth Klein and dual routes restore their actual controls and canonical names',()=>{
 const entries=[
  ['smoothKlein',{displayDampingScale:87.375}],
  ['infinityEnd',{infinityTauMin:.65,infinityTauMax:4.15,infinityProbeU:.173,infinityProbeV:.811,
   infinityPartner:false,infinityLayout:'cylinder',infinitySheet:'minus',infinityDisplay:'damped',infinityDampingScale:177.25}],
  ['stripEnds',{infinityTMin:13.25,infinityTMax:1444.125,infinitySigmaSpan:.71,infinityEnd:'lower',
   infinityLayout:'flat',infinityProbeU:.11,infinityProbeV:.93}],
  ['dualTwistor',{dualTheta:.7,dualPhi:5.2,dualSheet:-1,dualAnchor:'infinity'}],
 ];
 for(const [name,changes]of entries){
  const app=actualApp(),decoded=decodeViewURL(origin+'?view='+name,app.config);
  assert.equal(decoded.valid,true,decoded.error);assert.equal(decoded.name,name);
  app.setState(decoded.session.state);assert.equal(app.shareViewName(),name);
  const initial=app.getState();
  assert.equal(initial.channelsMode,'off');assert.equal(initial.dynamicsMode,'off');assert.equal(initial.researchMode,'off');
  assert.equal(initial.playing,false);
  if(name==='infinityEnd'||name==='stripEnds'){
   assert.equal(initial.infinityMode,name==='stripEnds'?'strip':'end');
   assert.equal(initial.projective,false,'infinity is its own chart, not the hidden torus/quotient panels');
   assert.equal(initial.dualMode,'off');assert.equal(initial.function,'xi');
   if(name==='infinityEnd')assert.equal(app.validate({...initial,infinityTauMin:-.65}).infinityTauMin,0,'negative cylinder cutoff is clamped to the branch-free end');
  }else if(name==='dualTwistor'){
   assert.equal(initial.dualMode,'conormal');assert.equal(initial.geometry,'torus');assert.equal(initial.projective,true);
   assert.equal(initial.infinityMode,'off');assert.equal(initial.fiberMode,'off');
  }else{
   assert.equal(initial.geometry,'klein');assert.equal(initial.displayDamping,true);assert.equal(initial.heightMode,'flat');
   assert.equal(initial.function,'xi');assert.equal(initial.infinityMode,'off');assert.equal(initial.dualMode,'off');
  }
  const changed={...initial,...changes,playing:true},probe={sigma:.731,t:26.625};
  const href=encodeViewURL(origin,{state:changed,probe},{...app.config,name}),restored=decodeViewURL(href,app.config);
  assert.equal(restored.valid,true,restored.error);assert.equal(restored.name,name);
  for(const [key,value]of Object.entries(changes))assert.equal(restored.session.state[key],value,`${name}: ${key}`);
  assert.equal(restored.session.state.playing,false);assert.deepEqual(restored.session.probe,probe);
  assert.equal(encodeViewURL(href,restored.session,{...app.config,name}),href,'exact control serialization is stable');
  app.setState(restored.session.state);assert.equal(app.shareViewName(),name);
  app.applyPreset(name);assert.deepEqual(app.getState(),app.validate(app.config.presets[name].settings),'preset button and URL enter the same normalized state');
 }
});

test('infinity and dual modes exit cleanly when a mount or exclusive research view is selected',()=>{
 for(const name of ['infinityEnd','stripEnds','dualTwistor']){
  const app=actualApp();app.applyPreset(name);app.selectMount('sphere',false);
  assert.equal(app.getState().infinityMode,'off');assert.equal(app.getState().dualMode,'off');
  assert.equal(app.getState().geometry,'sphere');assert.equal(app.getState().projective,false);
  assert.ok(app.effects.includes('infinity-pause'));
  for(const target of ['channels','bridgeShear','dynamics','twistor']){
   app.applyPreset(name);app.applyPreset(target);
   assert.equal(app.getState().infinityMode,'off',`${name} → ${target}`);
   assert.equal(app.getState().dualMode,'off',`${name} → ${target}`);
  }
 }
});

test('display-only damping and dual family controls preserve the exact field-cache key',()=>{
 const app=actualApp(),smooth=app.validate(app.config.presets.smoothKlein.settings),dual=app.validate(app.config.presets.dualTwistor.settings);
 assert.equal(fieldKey(smooth),fieldKey({...smooth,displayDamping:false,displayDampingScale:200}));
 assert.equal(fieldKey(dual),fieldKey({...dual,dualTheta:.9,dualPhi:4,dualSheet:-1,dualAnchor:'infinity'}));
 const raw=app.validate({...smooth,function:'zeta',geometry:'torus',projective:true});
 assert.equal(raw.displayDamping,false,'raw zeta is not silently assigned the completed-field smooth display');
});

test('main URL restoration pauses Channels and session capture excludes the old surface grid and camera',async()=>{
 const app=actualApp();app.setState(app.config.presets.critical.settings);
 app.setData({nx:33,ny:44,valid:new Uint8Array(0)});
 const decoded=decodeViewURL(origin+'?view=channels&state='+encodeURIComponent(JSON.stringify({channelsFrame:60})),app.config);
 assert.equal(decoded.valid,true,decoded.error);
 await app.restoreURLView(decoded.session,decoded);
 assert.equal(app.getState().channelsMode,'channels');assert.equal(app.getState().channelsFrame,60);
 assert.ok(app.effects.includes('channels-pause'));
 const captured=app.session();
 assert.ok(app.effects.includes('channels-flush'));assert.equal(captured.state.channelsFrame,60);
 assert.equal(captured.camera,null);assert.equal(captured.display.sampledGrid,null);assert.equal(captured.state.playing,false);
 app.setPendingFrame(61);assert.equal(app.session().state.channelsFrame,61,'session flush occurs before state capture');
});

test('main channel callbacks preserve live state and ignore late work after a mode switch',()=>{
 const app=actualApp();app.setState(app.config.presets.channelsQuartet.settings);
 const first={...channelsState.toLabState(app.getState()),view:'newton',frame:144,seed:73,travel:.4};
 app.changeChannels(first,{mode:'push'});
 assert.equal(app.getState().channelsMode,'newton');assert.equal(app.getState().channelsFrame,144);
 assert.equal(app.getState().channelsSeed,73);assert.equal(app.getState().channelsTravel,.4);
 assert.ok(app.effects.includes('push'));
 app.effects.length=0;
 app.changeChannels({...first,travel:.46},{progress:true});
 assert.equal(app.getState().channelsTravel,.46);assert.deepEqual(app.effects,['replace']);
 app.selectMount('torus',false);const state=app.getState();app.effects.length=0;
 app.changeChannels({...first,frame:180},{mode:'push'});
 assert.deepEqual(app.getState(),state);assert.deepEqual(app.effects,[]);
});

test('Channels PNG and CSV actions cannot export a stale surface',()=>{
 const app=actualApp();app.setState(app.config.presets.channels.settings);
 let reads=0;app.setData(new Proxy({valid:new Uint8Array(0)},{get(object,key){reads++;return object[key];}}));
 app.getButton('pngBtn').onclick();app.getButton('csvBtn').onclick();
 assert.equal(app.effects.includes('surface-screenshot'),false);
 assert.equal(app.effects.includes('download:text/csv'),false);
 assert.equal(reads,0,'hidden capture actions never inspect the previous surface grid');
});

test('main keyboard controls target Channels while text entry inside its shadow root stays untouched',()=>{
 const app=actualApp();app.setState(app.config.presets.channels.settings);
 const keydown=app.listeners.get('keydown');assert.equal(typeof keydown,'function');
 const key=(key,tag='DIV')=>({key,code:key===' '?'Space':key,composedPath:()=>[{tagName:tag},{tagName:'SECTION'}],preventDefault(){}});
 keydown(key(' '));keydown(key('r'));
 assert.equal(app.effects.filter(e=>e==='channels-play').length,1);assert.equal(app.effects.filter(e=>e==='channels-reset').length,1);
 assert.equal(app.effects.includes('surface-camera-reset'),false);assert.equal(app.effects.includes('click:playHeat'),false);
 for(const tag of ['INPUT','TEXTAREA','SELECT','BUTTON']){keydown(key(' ',tag));keydown(key('r',tag));}
 assert.equal(app.effects.filter(e=>e==='channels-play').length,1);assert.equal(app.effects.filter(e=>e==='channels-reset').length,1);
});


test('model routes open the twin ladder and the nucleus, share their controls, and leave cleanly',()=>{
 const app=actualApp();
 for(const [name,mode] of [['twinLadder','ladder'],['uranium238','nucleus']]){
  const decoded=decodeViewURL(origin+'?view='+name,app.config);
  assert.equal(decoded.valid,true,decoded.error);assert.equal(decoded.name,name);
  const state=decoded.session.state;
  assert.equal(state.modelsMode,mode);
  for(const key of ['channelsMode','researchMode','dynamicsMode','infinityMode','dualMode','fiberMode'])assert.equal(state[key],'off',key);
  assert.equal(state.geometry,'plane');assert.equal(state.projective,false);assert.equal(state.packets,false);
  app.setState(state);assert.equal(app.shareViewName(),name);
  const changed={...state,ladderCentre:.8,ladderOffset:.1,ladderHeight:21.02,ladderPrimes:25,ladderRungs:4,ladderWeight:'unit',nucleusZ:115,nucleusCoupling:1.5,nucleusPluck:3};
  const url=encodeViewURL(origin,{state:changed},{...app.config,name});
  const restored=decodeViewURL(url,app.config);assert.equal(restored.valid,true,restored.error);
  for(const key of Object.keys(modelsState.MODELS_DEFAULTS))assert.equal(restored.session.state[key],changed[key],key);
  assert.equal(encodeViewURL(url,restored.session,{...app.config,name}),url);
 }
 // Out-of-range and non-integer values are clamped and rounded, unknown enums ignored.
 const wild=app.validate({modelsMode:'ladder',ladderCentre:9,ladderPrimes:7.6,ladderRungs:-2,ladderWeight:'x',nucleusZ:1e6,nucleusPluck:9});
 assert.equal(wild.ladderCentre,1.5);assert.equal(wild.ladderPrimes,8);assert.equal(wild.ladderRungs,1);assert.equal(wild.ladderWeight,'mangoldt');
 assert.equal(wild.nucleusZ,126);assert.equal(wild.nucleusPluck,2);
 // A model mode wins over a stale workbench flag; choosing another view leaves the model.
 const mixed=app.validate({modelsMode:'nucleus',channelsMode:'newton',geometry:'klein',projective:true});
 assert.equal(mixed.modelsMode,'nucleus');assert.equal(mixed.channelsMode,'off');assert.equal(mixed.geometry,'plane');assert.equal(mixed.projective,false);
 app.applyPreset('uranium238');assert.equal(app.getState().modelsMode,'nucleus');
 app.selectMount('sphere',false);assert.equal(app.getState().modelsMode,'off');assert.equal(app.getState().geometry,'sphere');
 app.applyPreset('twinLadder');app.applyPreset('channels');assert.equal(app.getState().modelsMode,'off');assert.equal(app.getState().channelsMode,'channels');
 app.applyPreset('twinLadder');assert.equal(app.session().camera,null);assert.equal(app.session().state.modelsMode,'ladder');
});
