/**
 * Shareable views use a named preset plus exact, allowlisted overrides.
 * Ordinary links are short (?view=projective); changed controls, probe and
 * camera live in JSON query parameters. Legacy #view=<session JSON> is read.
 * No stored notes, timestamps, numerical payloads, or playing state are copied.
 */
export const MAX_VIEW_URL_LENGTH=16384;
const OMIT_STATE=new Set(['playing','createdAt']);
const own=(o,k)=>Object.prototype.hasOwnProperty.call(o,k);
const record=o=>o!==null&&typeof o==='object'&&!Array.isArray(o);
const finite=x=>typeof x==='number'&&Number.isFinite(x);
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
const validName=name=>typeof name==='string'&&/^[A-Za-z][A-Za-z0-9_-]{0,63}$/.test(name);

function config(options={}){
  if(!record(options.defaults))throw new TypeError('View URL defaults are required.');
  return {...options,presets:options.presets||{},validate:options.validate||((s)=>s),
    maxLength:options.maxLength??MAX_VIEW_URL_LENGTH};
}
function allowedState(input,defaults){
  const out={};
  if(!record(input))return out;
  for(const key of Object.keys(defaults)){
    if(OMIT_STATE.has(key)||!own(input,key))continue;
    const value=input[key],type=typeof defaults[key];
    if(type==='number'&&finite(value))out[key]=Object.is(value,-0)?0:value;
    else if(type==='boolean'&&typeof value==='boolean')out[key]=value;
    else if(type==='string'&&typeof value==='string'&&value.length<=128)out[key]=value;
  }
  return out;
}
function cleanState(input,cfg){
  const merged={...cfg.defaults,...allowedState(input,cfg.defaults),playing:false};
  const validated=cfg.validate(merged);
  if(!record(validated))throw new TypeError('View validation must return a state object.');
  return {...cfg.defaults,...allowedState(validated,cfg.defaults),playing:false};
}
function preset(cfg,name){
  if(name==='custom')return {settings:cfg.defaults};
  if(!validName(name)||!own(cfg.presets,name))return null;
  const entry=cfg.presets[name];
  return record(entry?.settings)?entry:record(entry)?{settings:entry}:null;
}

/** Ignore malformed or extreme camera records; retain exact finite values. */
export function sanitizeViewCamera(input){
  if(!record(input))return null;
  const camera={};
  if(input.type==='webgl'||input.type==='software')camera.type=input.type;
  const vector=(a,n,bound)=>Array.isArray(a)&&a.length===n&&a.every(x=>finite(x)&&Math.abs(x)<bound);
  if(finite(input.azimuth)&&Math.abs(input.azimuth)<=1e6)camera.azimuth=input.azimuth;
  if(finite(input.elevation)&&Math.abs(input.elevation)<=Math.PI/2+1e-9)camera.elevation=input.elevation;
  if(finite(input.distance)&&input.distance>0&&input.distance<1000)camera.distance=input.distance;
  if(finite(input.zoom)&&input.zoom>=.25&&input.zoom<=8)camera.zoom=input.zoom;
  if(vector(input.pan,2,2.0000001))camera.pan=[...input.pan];
  for(const key of ['target','position','up'])if(vector(input[key],3,1000))camera[key]=[...input[key]];
  if(camera.up&&Math.hypot(...camera.up)<1e-12)delete camera.up;
  if(camera.position&&camera.target&&Math.hypot(...camera.position.map((x,i)=>x-camera.target[i]))<1e-9)delete camera.position;
  const angular=finite(camera.azimuth)&&finite(camera.elevation)&&finite(camera.distance);
  const positioned=camera.type==='webgl'&&!!camera.position;
  const software=camera.type==='software'&&finite(camera.azimuth)&&finite(camera.elevation)&&finite(camera.zoom);
  return angular||positioned||software?camera:null;
}

export function sanitizeViewProbe(input){
  return record(input)&&finite(input.sigma)&&finite(input.t)&&Math.abs(input.sigma)<=1e6&&Math.abs(input.t)<=1e6
    ?{sigma:Object.is(input.sigma,-0)?0:input.sigma,t:Object.is(input.t,-0)?0:input.t}:null;
}

function resolvedBase(cfg,name){
  const entry=preset(cfg,name);
  if(!entry)return null;
  return {state:cleanState(entry.settings,cfg),probe:sanitizeViewProbe(entry.probe??cfg.defaultProbe),
    camera:sanitizeViewCamera(entry.camera??cfg.defaultCamera)};
}
function overrides(state,base,cfg){
  const out={};
  for(const key of Object.keys(cfg.defaults))if(!OMIT_STATE.has(key)&&!Object.is(state[key],base[key]))out[key]=state[key];
  return out;
}
function nearestName(state,cfg){
  // Prefer semantic agreement before compactness. Callers can always name the
  // chosen preset explicitly, retaining its name across later slider changes.
  const candidates=Object.keys(cfg.presets).filter(name=>validName(name)&&preset(cfg,name));
  let name='custom',best=Infinity;
  for(const candidate of candidates){
    const base=resolvedBase(cfg,candidate).state;
    const mismatches=['geometry','function','fiberMode','projective'].filter(k=>own(cfg.defaults,k)&&state[k]!==base[k]).length;
    const cost=mismatches*1e6+JSON.stringify(overrides(state,base,cfg)).length;
    if(cost<best){best=cost;name=candidate;}
  }
  return name;
}
function parseObject(text,label,maxLength){
  if(typeof text!=='string'||text.length>maxLength)throw new RangeError(`${label} is too large.`);
  const value=JSON.parse(text);
  if(!record(value))throw new TypeError(`${label} must be an object.`);
  return value;
}

/**
 * Query parameters take precedence over legacy hashes. A matched but invalid
 * URL returns an error rather than silently loading a different saved view.
 * The caller may use its normal local/default fallback when matched is false.
 */
export function decodeViewURL(href,options){
  const cfg=config(options);
  let url;
  try{url=new URL(String(href));}catch{return {matched:false,valid:false,source:null,name:null,session:null,error:'Invalid URL.'};}
  const query=url.searchParams,hash=new URLSearchParams(url.hash.slice(1));
  const queryView=query.has('view'),legacy=!queryView&&hash.has('view');
  if(!queryView&&!legacy)return {matched:false,valid:false,source:null,name:null,session:null};
  const source=queryView?'query':'legacy';
  try{
    if(url.href.length>cfg.maxLength)throw new RangeError('View URL is too large.');
    if(queryView){
      for(const key of ['view','state','probe','camera'])if(query.getAll(key).length>1)throw new TypeError(`Duplicate ${key} parameter.`);
      const name=query.get('view'),base=resolvedBase(cfg,name);
      if(!base)throw new TypeError('Unknown named view.');
      const extra=query.has('state')?parseObject(query.get('state'),'View settings',cfg.maxLength):{};
      const state=cleanState({...base.state,...allowedState(extra,cfg.defaults)},cfg);
      const probe=query.has('probe')?sanitizeViewProbe(parseObject(query.get('probe'),'Probe',cfg.maxLength)):base.probe;
      const camera=query.has('camera')?sanitizeViewCamera(parseObject(query.get('camera'),'Camera',cfg.maxLength)):base.camera;
      return {matched:true,valid:true,source,name,session:{state,...(probe?{probe}:{}),...(camera?{camera}:{})}};
    }
    if(hash.getAll('view').length!==1)throw new TypeError('Duplicate legacy view parameter.');
    const input=parseObject(hash.get('view'),'Legacy view',cfg.maxLength);
    const state=cleanState(record(input.state)?input.state:input,cfg);
    const probe=sanitizeViewProbe(input.probe??cfg.defaultProbe),camera=sanitizeViewCamera(input.camera);
    return {matched:true,valid:true,source,name:nearestName(state,cfg),session:{state,...(probe?{probe}:{}),...(camera?{camera}:{})}};
  }catch(error){return {matched:true,valid:false,source,name:null,session:null,error:error.message||'Invalid view URL.'};}
}

/** Canonical named URL with exact whitelisted overrides, no transient metadata. */
export function encodeViewURL(href,snapshot,options){
  const cfg=config(options),state=cleanState(snapshot?.state??snapshot,cfg);
  const name=cfg.name&&preset(cfg,cfg.name)?cfg.name:nearestName(state,cfg),base=resolvedBase(cfg,name);
  const url=new URL(String(href));url.search='';url.hash='';url.searchParams.set('view',name);
  const extra=overrides(state,base.state,cfg);
  if(Object.keys(extra).length)url.searchParams.set('state',JSON.stringify(extra));
  const probe=sanitizeViewProbe(snapshot?.probe),camera=sanitizeViewCamera(snapshot?.camera);
  if(probe&&!same(probe,base.probe))url.searchParams.set('probe',JSON.stringify(probe));
  if(camera&&!same(camera,base.camera))url.searchParams.set('camera',JSON.stringify(camera));
  if(url.href.length>cfg.maxLength)throw new RangeError('View URL is too large.');
  return url.href;
}

/**
 * Event-driven history synchronization. sync captures the state immediately;
 * delayed replacements cannot accidentally capture a later discrete choice.
 * Return an awaitable from onRestore to suppress writes until restoration,
 * including asynchronous field loading and camera installation, is complete.
 * syncAfterRestore reconciles a retained fallback or controls edited during a
 * pending load, using the final snapshot rather than the requested view name.
 */
export class ViewURLController {
  constructor({window:win=globalThis.window,getSnapshot,onRestore=()=>{},onError=()=>{},delay=180,syncAfterRestore=false,...options}){
    if(!win?.history||typeof getSnapshot!=='function')throw new TypeError('History and a view snapshot getter are required.');
    this.window=win;this.getSnapshot=getSnapshot;this.onRestore=onRestore;this.onError=onError;
    this.options=config(options);this.delay=Math.max(0,Number(delay)||0);this.pending=null;this.timer=null;
    this.syncAfterRestore=!!syncAfterRestore;
    this.restoring=false;this.disposed=false;this.restoreSerial=0;this.lastNavigationHref=win.location.href;
    const initial=decodeViewURL(win.location.href,this.options);this.name=initial.valid?initial.name:null;
    this.navigate=()=>this.restore();
    win.addEventListener('popstate',this.navigate);win.addEventListener('hashchange',this.navigate);
  }
  cancelPending(){if(this.timer!==null)this.window.clearTimeout(this.timer);this.timer=null;this.pending=null;}
  sync({mode='replace',name,immediate=mode==='push'}={}){
    if(this.disposed||this.restoring)return false;
    if(mode!=='push'&&mode!=='replace')throw new TypeError('History mode must be push or replace.');
    // Commit an earlier slider/probe replacement before adding a new choice.
    if(mode==='push'&&this.pending)this.flush();
    if(name!==undefined)this.name=preset(this.options,name)?name:null;
    try{
      const url=encodeViewURL(this.window.location.href,this.getSnapshot(),{...this.options,name:this.name});
      if(this.timer!==null)this.window.clearTimeout(this.timer);this.timer=null;
      this.pending={url,mode};
      if(immediate)return this.flush();
      this.timer=this.window.setTimeout(()=>{this.timer=null;this.flush();},this.delay);return true;
    }catch(error){this.onError(error);return false;}
  }
  flush(){
    if(this.timer!==null)this.window.clearTimeout(this.timer);this.timer=null;
    const pending=this.pending;this.pending=null;
    if(!pending||this.disposed||this.restoring||pending.url===this.window.location.href)return false;
    try{
      this.window.history[pending.mode==='push'?'pushState':'replaceState']({zetaView:1},'',pending.url);
      this.lastNavigationHref=this.window.location.href;return true;
    }catch(error){this.onError(error);return false;}
  }
  async restore(){
    if(this.disposed)return;
    const href=this.window.location.href;
    if(href===this.lastNavigationHref)return;
    this.lastNavigationHref=href;this.cancelPending();
    const decoded=decodeViewURL(href,this.options);
    if(!decoded.valid){if(decoded.matched)this.onError(new Error(decoded.error));return;}
    const serial=++this.restoreSerial;this.restoring=true;this.name=decoded.name;
    try{await this.onRestore(decoded.session,decoded);}catch(error){this.onError(error);}
    finally{if(serial===this.restoreSerial){this.restoring=false;if(this.syncAfterRestore&&!this.disposed)this.sync({mode:'replace',name:null,immediate:true});}}
  }
  dispose(){this.cancelPending();this.disposed=true;++this.restoreSerial;this.window.removeEventListener('popstate',this.navigate);this.window.removeEventListener('hashchange',this.navigate);}
}
