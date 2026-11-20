import test from 'node:test';
import assert from 'node:assert/strict';
import {encodeViewURL,decodeViewURL,sanitizeViewCamera,sanitizeViewProbe,ViewURLController} from '../dist/view-url.js';

const defaults={geometry:'plane',function:'zeta',projective:false,fiberMode:'none',projectiveChannel:'bridge',
  height:1.1,chartScale:24,torusR:1.6,heightReference:0,opacity:.97,playing:false};
const settings=patch=>({...defaults,...patch});
const presets={critical:{settings:settings({})},sphere:{settings:settings({geometry:'sphere'})},
  projective:{settings:settings({geometry:'torus',projective:true,function:'xi',torusR:2})},
  spinor:{settings:settings({geometry:'sphere',fiberMode:'spinor'})},
  twistor:{settings:settings({geometry:'torus',fiberMode:'twistor'})}};
function validate(input){
  const out={...defaults,...input,playing:false};
  if(!['plane','sphere','torus'].includes(out.geometry))out.geometry='plane';
  if(!['zeta','xi','heat'].includes(out.function))out.function='zeta';
  if(!['none','spinor','twistor'].includes(out.fiberMode))out.fiberMode='none';
  out.height=Math.max(0,Math.min(2.4,out.height));return out;
}
const defaultProbe={sigma:.5,t:14.134725141734695};
const options={defaults,presets,validate,defaultProbe};
const origin='https://zeta-view.vercel.app/';

test('every named view produces a short link and restores before local-state fallback',()=>{
  for(const name of Object.keys(presets)){
    const href=encodeViewURL(origin,{state:presets[name].settings,probe:defaultProbe},{...options,name});
    assert.equal(href,origin+'?view='+name);
    const decoded=decodeViewURL(href,options);
    assert.equal(decoded.matched,true);assert.equal(decoded.valid,true);assert.equal(decoded.source,'query');
    assert.equal(decoded.name,name);assert.deepEqual(decoded.session.state,presets[name].settings);
    assert.deepEqual(decoded.session.probe,defaultProbe);
  }
  assert.equal(decodeViewURL(origin,options).matched,false);
});

test('state, camera and probe roundtrip exactly while metadata and transient playback are excluded',()=>{
  const state={...presets.projective.settings,height:.12345678901234567,heightReference:1e-270,playing:true,
    createdAt:'private timestamp',notes:'private note',unexpected:'drop this'};
  const camera={type:'webgl',azimuth:.12345678901234567,elevation:.8123456789012345,distance:23.879124123,
    target:[.2,-.3,1.7],position:[10.12345678901234,11.5,-12.7],up:[0,1,0],secret:'drop this'};
  const probe={sigma:.5000000001234567,t:1999.7999999999442,secret:'drop this'};
  const href=encodeViewURL(origin+'?tracking=unrelated#view=old',{state,camera,probe,createdAt:'drop'},{...options,name:'projective'});
  const u=new URL(href);assert.equal(u.hash,'');assert.equal(u.searchParams.has('tracking'),false);
  const extra=JSON.parse(u.searchParams.get('state'));
  assert.deepEqual(extra,{height:state.height,heightReference:state.heightReference});
  assert.ok(!href.includes('playing')&&!href.includes('secret')&&!href.includes('notes'));
  const decoded=decodeViewURL(href,options);
  assert.deepEqual(decoded.session.state,validate({...presets.projective.settings,...extra}));
  assert.deepEqual(decoded.session.camera,sanitizeViewCamera(camera));
  assert.deepEqual(decoded.session.probe,sanitizeViewProbe(probe));
  assert.equal(encodeViewURL(href,decoded.session,{...options,name:decoded.name}),href,'canonical encoding is stable');
});

test('legacy session and raw-state hashes remain readable; a named query takes precedence',()=>{
  for(const input of [{state:{...presets.spinor.settings,height:.7},probe:defaultProbe},presets.twistor.settings]){
    const href=origin+'#'+new URLSearchParams({view:JSON.stringify(input)});
    const decoded=decodeViewURL(href,options);assert.equal(decoded.valid,true);assert.equal(decoded.source,'legacy');
    assert.deepEqual(decoded.session.state,validate(input.state??input));
    const migrated=encodeViewURL(href,decoded.session,options);
    assert.equal(new URL(migrated).hash,'');assert.ok(new URL(migrated).searchParams.has('view'));
  }
  const mixed=origin+'?view=projective#'+new URLSearchParams({view:JSON.stringify(presets.spinor.settings)});
  assert.equal(decodeViewURL(mixed,options).session.state.projective,true);
  assert.equal(decodeViewURL(mixed,options).session.state.fiberMode,'none');
});

test('malformed, duplicate, oversized and unknown links reject; untrusted fields cannot enter state',()=>{
  for(const suffix of ['?view=missing','?view=projective&view=spinor','?view=critical&state=%7Bbad',
    '?view=critical&state=[]','?view=critical&camera=[]','#view=%7Bbad']){
    const decoded=decodeViewURL(origin+suffix,options);assert.equal(decoded.matched,true);assert.equal(decoded.valid,false);assert.ok(decoded.error);
  }
  const oversized=origin+'?view=critical&state='+encodeURIComponent(JSON.stringify({height:1,notes:'x'.repeat(17000)}));
  assert.equal(decodeViewURL(oversized,options).valid,false);
  const extra=JSON.parse('{"__proto__":{"polluted":true},"height":99,"projective":"false","function":"bad","unknown":123}');
  const href=origin+'?'+new URLSearchParams({view:'projective',state:JSON.stringify(extra)});
  const decoded=decodeViewURL(href,options);assert.equal(decoded.valid,true);
  assert.equal(decoded.session.state.height,2.4);assert.equal(decoded.session.state.projective,true);
  assert.equal(decoded.session.state.function,'zeta');assert.equal(decoded.session.state.unknown,undefined);assert.equal({}.polluted,undefined);
  assert.equal(decodeViewURL(origin+'?view=critical&probe='+encodeURIComponent('{"sigma":1e300,"t":0}'),options).session.probe,undefined);
});

test('camera sanitization handles both renderers, drops unsafe vectors and keeps exact valid values',()=>{
  const camera={type:'software',azimuth:1.23456789012345,elevation:.62,zoom:1.49,pan:[-.25,.08],distance:20/1.49,target:[0,0,0]};
  assert.deepEqual(sanitizeViewCamera(camera),camera);
  assert.equal(sanitizeViewCamera({type:'webgl',position:[Infinity,0,0]}),null);
  assert.equal(sanitizeViewCamera({type:'webgl',position:[0,0,0],target:[0,0,0]}),null);
  const safe=sanitizeViewCamera({type:'webgl',position:[1,2,3],up:[0,0,0],secret:'discard'});
  assert.deepEqual(safe,{type:'webgl',position:[1,2,3]});
  assert.equal(sanitizeViewProbe({sigma:0,t:NaN}),null);
});

class FakeWindow{
  constructor(href=origin){
    this.location={href};this.entries=[href];this.index=0;this.writes=[];this.listeners=new Map();this.timers=new Map();this.timerId=0;
    const write=(kind,state,title,url)=>{if(kind==='push'){this.entries=this.entries.slice(0,this.index+1);this.entries.push(url);this.index++;}else this.entries[this.index]=url;this.location.href=url;this.writes.push({kind,url,state});};
    this.history={pushState:(...args)=>write('push',...args),replaceState:(...args)=>write('replace',...args)};
  }
  addEventListener(name,fn){if(!this.listeners.has(name))this.listeners.set(name,new Set());this.listeners.get(name).add(fn);}
  removeEventListener(name,fn){this.listeners.get(name)?.delete(fn);}
  setTimeout(fn){const id=++this.timerId;this.timers.set(id,fn);return id;}
  clearTimeout(id){this.timers.delete(id);}
  runTimers(){const pending=[...this.timers.values()];this.timers.clear();for(const fn of pending)fn();}
  async emit(name){await Promise.all([...this.listeners.get(name)??[]].map(fn=>fn()));}
  async go(delta){this.index=Math.max(0,Math.min(this.entries.length-1,this.index+delta));this.location.href=this.entries[this.index];await this.emit('popstate');await this.emit('hashchange');}
}
function deferred(){let resolve;const promise=new Promise(r=>resolve=r);return {promise,resolve};}

test('history replaces continuous edits, pushes discrete choices and restores Back/Forward without feedback',async()=>{
  const win=new FakeWindow();let snapshot={state:{...presets.critical.settings},probe:defaultProbe},controller,restores=0;
  controller=new ViewURLController({window:win,...options,getSnapshot:()=>snapshot,onRestore:session=>{
    restores++;snapshot=session;assert.equal(controller.sync({immediate:true}),false,'restore writes are suppressed');
  }});
  controller.sync({name:'critical',immediate:true});assert.equal(win.entries.length,1);
  snapshot.state={...snapshot.state,height:1.37};controller.sync();assert.equal(win.timers.size,1);
  snapshot={state:{...presets.projective.settings},probe:defaultProbe};controller.sync({mode:'push',name:'projective'});
  assert.equal(win.entries.length,2);assert.equal(new URL(win.entries[1]).searchParams.get('view'),'projective');
  assert.equal(decodeViewURL(win.entries[0],options).session.state.height,1.37,'pending previous edit committed before choice');
  const writes=win.writes.length;await win.go(-1);
  assert.equal(snapshot.state.geometry,'plane');assert.equal(snapshot.state.height,1.37);assert.equal(restores,1);
  assert.equal(win.writes.length,writes);await win.go(1);assert.equal(snapshot.state.projective,true);assert.equal(restores,2);
  controller.sync({mode:'push',name:'projective'});assert.equal(win.entries.length,2,'same view does not add duplicate history');
  controller.dispose();assert.equal(win.listeners.get('popstate').size,0);assert.equal(win.listeners.get('hashchange').size,0);
});

test('navigation cancels stale debounce and suppresses writes through asynchronous restoration',async()=>{
  const win=new FakeWindow(),gate=deferred();let snapshot={state:{...presets.critical.settings},probe:defaultProbe},restores=0;
  const controller=new ViewURLController({window:win,...options,getSnapshot:()=>snapshot,onRestore:async session=>{restores++;snapshot=session;await gate.promise;}});
  controller.sync({immediate:true,name:'critical'});
  snapshot={state:{...presets.sphere.settings},probe:defaultProbe};controller.sync({mode:'push',name:'sphere'});
  snapshot={state:{...presets.projective.settings},probe:defaultProbe};controller.sync({mode:'push',name:'projective'});
  snapshot.state={...snapshot.state,height:.5};controller.sync();assert.equal(win.timers.size,1);
  const navigation=win.go(-1);assert.equal(controller.restoring,true);assert.equal(win.timers.size,0);
  const writes=win.writes.length;assert.equal(controller.sync({immediate:true}),false);win.runTimers();assert.equal(win.writes.length,writes);
  gate.resolve();await navigation;assert.equal(controller.restoring,false);assert.equal(restores,1);assert.equal(snapshot.state.geometry,'sphere');
  await win.go(1);assert.equal(snapshot.state.height,presets.projective.settings.height,'cancelled edit did not overwrite navigated history');
  controller.dispose();
});

test('completed navigation reconciles the retained fallback and pending edits without adding history',async()=>{
  const win=new FakeWindow(),gate=deferred();let snapshot={state:{...presets.critical.settings},probe:defaultProbe};
  const controller=new ViewURLController({window:win,...options,syncAfterRestore:true,getSnapshot:()=>snapshot,
    onRestore:async session=>{snapshot=session;await gate.promise;}});
  controller.sync({immediate:true,name:'critical'});
  snapshot={state:{...presets.sphere.settings},probe:defaultProbe};controller.sync({mode:'push',name:'sphere'});
  snapshot={state:{...presets.projective.settings},probe:defaultProbe};controller.sync({mode:'push',name:'projective'});
  const navigation=win.go(-1);assert.equal(controller.restoring,true);
  // The app keeps an ordinary field when loading the requested sphere fails.
  // A control edit during the load must survive the same final reconciliation.
  snapshot={state:{...presets.critical.settings,height:.83},probe:defaultProbe};
  assert.equal(controller.sync({immediate:true,name:'critical'}),false);
  const entries=win.entries.length;gate.resolve();await navigation;
  const restored=decodeViewURL(win.location.href,options);
  assert.equal(restored.name,'critical','the final state chooses its semantic preset, not the failed sphere');
  assert.equal(restored.session.state.geometry,'plane');assert.equal(restored.session.state.height,.83);
  assert.equal(win.entries.length,entries,'reconciliation replaces the navigated entry');
  const writes=win.writes.length;await win.go(1);
  assert.equal(snapshot.state.projective,true);assert.equal(win.writes.length,writes,'canonical successful restores produce no feedback write');
  controller.dispose();
});

test('external legacy hash navigation restores once and cancelled timers never write after dispose',async()=>{
  const win=new FakeWindow(origin+'?view=critical'),restored=[];let snapshot={state:{...presets.critical.settings},probe:defaultProbe};
  const controller=new ViewURLController({window:win,...options,getSnapshot:()=>snapshot,onRestore:s=>restored.push(s)});
  win.location.href=origin+'#'+new URLSearchParams({view:JSON.stringify({state:presets.twistor.settings})});
  await win.emit('hashchange');await win.emit('popstate');assert.equal(restored.length,1);assert.equal(restored[0].state.fiberMode,'twistor');
  snapshot.state.height=.6;controller.sync();assert.equal(win.timers.size,1);controller.cancelPending();win.runTimers();assert.equal(win.writes.length,0);
  controller.sync();controller.dispose();win.runTimers();assert.equal(win.writes.length,0);
});
