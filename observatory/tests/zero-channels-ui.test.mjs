import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { LAB_DEFAULTS, normalizeLabState, readLabURL, writeLabURL, createLab } from '../dist/experiments/zero-channels.js';
import { computeZeroChannels } from '../dist/zero-channels-math.js';

const origin='https://zeta-view.vercel.app/experiments/zero-channels.html';
const theta=JSON.parse(fs.readFileSync(new URL('../dist/experiments/zero-confinement-theta.json',import.meta.url)));
const bounds=JSON.parse(fs.readFileSync(new URL('../dist/experiments/zero-channel-bounds.json',import.meta.url)));
const html=fs.readFileSync(new URL('../dist/experiments/zero-channels.html',import.meta.url),'utf8');

test('share URLs retain all view controls and exact collision semantics',()=>{
 const original=normalizeLabState({view:'newton',model:'quartic',frame:124.8,branch:3,direction:'increase',radiusScale:1.25,spread:.4,seed:94,travel:.37,newtonTime:16,perturbationTime:.5});
 const url=writeLabURL(origin+'#workbench',original),restored=readLabURL(url);
 assert.deepEqual(restored,original);assert.equal(new URL(url).hash,'#workbench');
 assert.equal(writeLabURL(url,restored),url);
 const collision=readLabURL(origin+'?model=quartic&checkpoint=collision');
 assert.equal(collision.checkpoint,'collision');assert.ok(Math.abs(collision.frame-128.7068006749893)<1e-9);
 assert.equal(new URL(writeLabURL(origin,LAB_DEFAULTS)).search,'');
});

test('untrusted URL state rejects invalid enums and duplicate keys and bounds numeric work',()=>{
 const state=readLabURL(origin+'?model=wrong&view=newton&view=coupling&frame=Infinity&seedCount=100000&branch=-3&travel=4&spread=NaN&checkpoint=collision');
 assert.equal(state.view,'channels');assert.equal(state.model,'theta');assert.equal(state.frame,0);assert.equal(state.seedCount,24);assert.equal(state.branch,0);assert.equal(state.travel,1);assert.equal(state.spread,.25);assert.equal(state.checkpoint,'');
 const encoded=writeLabURL(origin+'?frame=4&frame=7&foreign=kept',state);
 assert.equal(new URL(encoded).searchParams.getAll('frame').length,0);assert.equal(new URL(encoded).searchParams.get('foreign'),'kept');
});

const dataKey=name=>name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
class Element{
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.attributes={};this.dataset={};this.style={setProperty(){}};this.hidden=false;this.clientWidth=780;this.clientHeight=460;this.events={};this._text='';this._value='';}
 append(...children){this.children.push(...children);}
 replaceChildren(...children){this.children=[];this.append(...children);}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(c=>c.textContent).join('');}
 set value(value){this._value=String(value);}
 get value(){return this._value;}
 setAttribute(key,value){this.attributes[key]=String(value);if(key.startsWith('data-'))this.dataset[dataKey(key)]=String(value);if(key==='id')this.id=String(value);if(key==='value')this.value=value;if(['cx','cy','x','y','x1','x2','y1','y2','r','width','height'].includes(key)&&this.tagName!=='INPUT')assert.ok(Number.isFinite(Number(value)),`${this.tagName} ${key}=${value}`);if(key==='d')assert.doesNotMatch(String(value),/NaN|Infinity|undefined/);}
 getAttribute(key){return this.attributes[key]??null;}
 removeAttribute(key){delete this.attributes[key];}
 matches(selector){const attribute=/^\[([^=\]]+)(?:="([^"]+)")?\]$/.exec(selector);if(attribute)return attribute[1] in this.attributes&&(attribute[2]===undefined||this.attributes[attribute[1]]===attribute[2]);return this.tagName.toLowerCase()===selector.toLowerCase();}
 querySelectorAll(selector){const result=[];for(const child of this.children){if(child.matches(selector))result.push(child);result.push(...child.querySelectorAll(selector));}return result;}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
}
function parseHTML(source){const root=new Element('document'),stack=[root];for(const token of source.match(/<[^>]+>|[^<]+/g)||[]){if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}if(token.startsWith('<')){const tag=/^<([\w-]+)/.exec(token)?.[1];if(!tag)continue;const e=new Element(tag);for(const m of token.matchAll(/([\w-]+)="([^"]*)"/g))e.setAttribute(m[1],m[2]);if(/\shidden(?:\s|>)/.test(token))e.hidden=true;stack.at(-1).append(e);if(!['input','br','hr','img','meta','link'].includes(tag))stack.push(e);}else stack.at(-1)._text+=token;}return root;}
class FakeWorker{
 static current;
 constructor(){this.sent=[];FakeWorker.current=this;}
 postMessage(message){this.sent.push(message);}
 ready(){this.onmessage({data:{type:'ready'}});}
 reply(message,result){this.onmessage({data:{type:'result',id:message.id,result}});}
 terminate(){this.terminated=true;}
}
async function mount(url=origin){
 const root=parseHTML(html),ids=new Map();const walk=e=>{if(e.id)ids.set(e.id,e);e.children.forEach(walk);};walk(root);const listeners={},frames=new Map();let raf=0;
 const doc={hidden:false,createElement:t=>new Element(t),createElementNS:(_,t)=>new Element(t),getElementById:id=>ids.get(id),querySelectorAll:s=>root.querySelectorAll(s),addEventListener:(n,f)=>listeners[n]=f,removeEventListener:n=>delete listeners[n]};
 const win={location:{href:url},navigator:{clipboard:{writeText:async()=>{}}},requestAnimationFrame:f=>{frames.set(++raf,f);return raf;},cancelAnimationFrame:id=>frames.delete(id),addEventListener:(n,f)=>listeners[n]=f,removeEventListener:n=>delete listeners[n]};
 const history=[url];let historyIndex=0;win.history={replaceState:(_,__,next)=>{win.location.href=next;history[historyIndex]=next;},pushState:(_,__,next)=>{win.location.href=next;history.splice(++historyIndex);history.push(next);},back(){if(historyIndex>0){win.location.href=history[--historyIndex];listeners.popstate?.();}}};
 globalThis.document=doc;globalThis.window=win;
 const lab=createLab({window:win,document:doc,Worker:FakeWorker,fetch:async url=>({ok:true,json:async()=>String(url).includes('zero-confinement-theta')?theta:bounds})});await lab.ready;FakeWorker.current.ready();
 const worker=FakeWorker.current,resolve=()=>{const job=worker.sent.filter(j=>j.type==='compute').at(-1);const result=computeZeroChannels(job.state,theta,bounds,{includeGuidance:job.state.view==='newton'});worker.reply(job,result);return result;};
 return {lab,worker,resolve,$:id=>ids.get(id),win,frames,root};
}

test('actual UI renders each view, keeps finite SVG coordinates, and never certifies a collision',async()=>{
 const m=await mount(origin+'?model=quartic&frame=124.8');m.resolve();assert.equal(m.$('scope-badge').textContent,'Whole-cell certificate');assert.match(m.$('finding-text').textContent,/Exactly one simple zero/);assert.equal(m.$('experiment-content').hidden,false);
 m.$('collision').onclick();const collision=m.resolve();assert.equal(collision.selected.channel.status,'collision');assert.equal(m.$('scope-badge').textContent,'Isolation unresolved');assert.match(m.$('finding-text').textContent,/double zero/);
 m.lab.commit({view:'coupling'},{mode:'push'});m.resolve();assert.equal(m.$('scope-badge').textContent,'Linearization undefined');assert.match(m.$('primary-plot').textContent,/multiple|ill-conditioned/);
 m.lab.commit({frame:80,checkpoint:null});m.resolve();assert.equal(m.$('primary-plot').querySelectorAll('svg').length,1);assert.equal(m.$('measurement-body').children.length,4);
 m.lab.commit({view:'newton',frame:144,branch:0,seedCount:4},{mode:'push'});m.resolve();assert.equal(m.$('scope-badge').textContent,'Numerical probe paths');assert.equal(m.$('measurement-body').children.length,4);assert.match(m.$('finding-text').textContent,/off-line zero/);
 m.lab.destroy();assert.equal(m.worker.terminated,true);
});

test('latest request wins and Back restores the selected view and frame paused',async()=>{
 const m=await mount();const initialJob=m.worker.sent.filter(j=>j.type==='compute').at(-1);
 m.lab.commit({view:'coupling',frame:10},{mode:'push'});m.lab.commit({view:'channels',frame:30},{mode:'push'});
 m.worker.reply(initialJob,computeZeroChannels(initialJob.state,theta,bounds));assert.equal(m.lab.getSnapshot(),null);
 const latest=m.resolve();assert.equal(latest.state.frame,30);assert.equal(m.$('heat-frame').value,'30');
 m.win.history.back();m.resolve();assert.equal(m.lab.getState().view,'coupling');assert.equal(m.lab.getState().frame,10);assert.equal(m.$('play').textContent,'▶ Play');assert.equal(m.$('view-eyebrow').textContent,'COUPLING NETWORK');
 m.lab.destroy();
});

test('Newton travel redraws cached paths without scheduling another numerical job',async()=>{
 const m=await mount(origin+'?view=newton&model=quartic&frame=144&seedCount=4');m.resolve();const count=m.worker.sent.length;
 m.lab.commit({travel:.4},{compute:false});assert.equal(m.worker.sent.length,count);assert.equal(m.$('travel-output').textContent,'40%');assert.match(m.$('primary-caption').textContent,/40%/);assert.equal(readLabURL(m.win.location.href).travel,.4);
 m.lab.destroy();
});

test('theta witness labels only its first disk and exact time window as certified',async()=>{
 assert.equal(bounds.thetaCertifiedWitness.certified,true);
 const m=await mount();m.resolve();assert.equal(m.$('scope-badge').textContent,'1 / 3 certified');assert.match(m.$('equation').textContent,/infΓ/);assert.match(m.$('finding-text').textContent,/first disk only/);assert.equal(m.$('theta-checkpoints').hidden,false);
 m.$('theta-certificate-start').onclick();const endpoint=m.resolve();assert.equal(endpoint.tau,-.05);assert.equal(m.$('scope-badge').textContent,'1 / 3 certified');
 m.lab.commit({frame:61});m.resolve();assert.equal(m.$('scope-badge').textContent,'Sampled candidate');assert.equal(m.$('equation').textContent,'E + ½Br² < Ar');
 m.lab.commit({frame:0,branch:1});m.resolve();assert.equal(m.$('scope-badge').textContent,'Sampled candidate');
 m.lab.commit({branch:0,radiusScale:1.1});const scaled=m.resolve();assert.equal(scaled.selected.channel.certified,false);assert.equal(scaled.selected.channel.baseRadius,.35);assert.match(m.$('radius-note').textContent,/recorded center is preserved/);
 m.lab.destroy();
});

