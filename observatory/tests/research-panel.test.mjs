import test from 'node:test';
import assert from 'node:assert/strict';
import {ResearchPanel} from '../dist/research-panel.js';
import {RESEARCH_DEFAULTS} from '../dist/research-state.js';

// Small DOM/worker boundary fixture. This runs the actual panel constructor,
// queue and paint paths without a browser or numerical work on the UI thread.
const dataKey=name=>name.slice(5).replace(/-([a-z])/g,(_,c)=>c.toUpperCase());
class Element {
 constructor(tag){this.tagName=tag.toUpperCase();this.children=[];this.parentNode=null;this.dataset={};this.attributes={};this.style={setProperty(){}};this.classList={add(){}};this.hidden=false;this.clientWidth=760;this.clientHeight=460;this.width=760;this.height=460;this._value='';this._text='';this.className='';this.events={};if(tag==='select')Object.defineProperty(this,'type',{get:()=> 'select-one'});}
 append(...children){for(const child of children){child.parentNode=this;this.children.push(child);}}
 replaceChildren(...children){this.children=[];this.append(...children);}
 remove(){if(this.parentNode)this.parentNode.children=this.parentNode.children.filter(child=>child!==this);}
 setAttribute(name,value){this.attributes[name]=String(value);if(name.startsWith('data-'))this.dataset[dataKey(name)]=String(value);else if(name==='class')this.className=String(value);else if(name==='value')this.value=value;else if(name!=='type'||this.tagName!=='SELECT')this[name]=String(value);}
 removeAttribute(name){delete this.attributes[name];}
 hasAttribute(name){return name in this.attributes;}
 getAttribute(name){return this.attributes[name];}
 set value(value){this._value=this.type==='range'&&Number.isFinite(Number(value))?String(Math.max(Number(this.min||0),Math.min(Number(this.max||100),Number(value)))):String(value);}
 get value(){return this._value;}
 set textContent(value){this._text=String(value);this.children=[];}
 get textContent(){return this._text+this.children.map(child=>child.textContent).join('');}
 set innerHTML(html){this.children=[];const stack=[this];for(const token of html.match(/<[^>]+>|[^<]+/g)||[]){if(token.startsWith('</')){stack.pop();continue;}if(token.startsWith('<')){const tag=/^<([\w-]+)/.exec(token)?.[1];if(!tag)continue;const el=new Element(tag);for(const match of token.matchAll(/([\w-]+)="([^"]*)"/g))el.setAttribute(match[1],match[2]);stack.at(-1).append(el);if(!['input','br','hr','img','meta','link'].includes(tag))stack.push(el);}else stack.at(-1)._text+=token;}}
 querySelectorAll(selector){const match=/^\[([^=\]]+)(?:="([^"]+)")?\]$/.exec(selector);const out=[];for(const child of this.children){if(match&&child.hasAttribute(match[1])&&(match[2]===undefined||child.getAttribute(match[1])===match[2]))out.push(child);else if(match?.[1].startsWith('data-')&&dataKey(match[1]) in child.dataset&&(match[2]===undefined||child.dataset[dataKey(match[1])]===match[2]))out.push(child);out.push(...child.querySelectorAll(selector));}return out;}
 addEventListener(name,handler){this.events[name]=handler;}
 removeEventListener(name){delete this.events[name];}
 getBoundingClientRect(){return {left:0,top:0,width:this.clientWidth,height:this.clientHeight};}
 getContext(){if(!this.context){const calls=[];this.context=new Proxy({calls,createImageData:(w,h)=>({data:new Uint8ClampedArray(w*h*4)}),putImageData:img=>{this.imageData=img;},measureText:t=>({width:t.length*6})},{get:(target,key)=>key in target?target[key]:(...args)=>{if(['moveTo','lineTo','arc','fillRect','drawImage'].includes(key))assert.ok(args.filter(v=>typeof v==='number').every(Number.isFinite),`finite ${key} coordinates`);calls.push([key,...args]);},set:(target,key,value)=>{target[key]=value;return true;}});}return this.context;}
 toDataURL(){return 'data:image/png;base64,fixture';}
}
class FakeWorker {
 static instances=[];
 constructor(){this.sent=[];this.terminated=false;FakeWorker.instances.push(this);}
 postMessage(job){this.sent.push(job);}
 respond(id,result,error){this.onmessage({data:{id,result,error}});}
 terminate(){this.terminated=true;}
}
let frameId=0;const frames=new Map();
globalThis.window={devicePixelRatio:1,addEventListener(){},removeEventListener(){}};
globalThis.document={createElement:tag=>new Element(tag),activeElement:null,hidden:false,addEventListener(){},removeEventListener(){}};
globalThis.Worker=FakeWorker;
globalThis.ResizeObserver=class{observe(){}unobserve(){}disconnect(){}};
globalThis.requestAnimationFrame=callback=>{frames.set(++frameId,callback);return frameId;};
globalThis.cancelAnimationFrame=id=>frames.delete(id);
const basicResult=(name='result',plots=[])=>({title:name,subtitle:'computed',formula:'F′/F',scope:'finite samples',metrics:[{label:'Value',value:2}],details:['Diagnostic only.'],plots});
function mount(){const calls=[],panel=new ResearchPanel(new Element('section'),{controlsEl:new Element('section'),inspectorEl:new Element('section'),onChange:(patch,meta)=>calls.push({patch,meta})});return {panel,calls};}
function active(panel,patch={}){panel.update({...RESEARCH_DEFAULTS,researchMode:'ratio',...patch});return panel.worker;}

test('constructor avoids read-only select.type and update never emits callbacks',()=>{
 const {panel,calls}=mount();assert.equal(panel.worker,null);assert.equal(panel.container.hidden,true);active(panel);assert.equal(panel.worker.sent.length,1);panel.update({...panel.state});assert.equal(panel.worker.sent.length,1);assert.equal(calls.length,0);panel.dispose();
});

test('one worker job plus latest pending ignores stale results and exports only current results',()=>{
 const {panel}=mount(),worker=active(panel),first=worker.sent[0];panel.update({...panel.state,researchFrame:1});panel.update({...panel.state,researchFrame:2});assert.equal(worker.sent.length,1);assert.equal(panel.pendingJob.state.researchFrame,2);assert.equal(panel.screenshot(),null);
 worker.respond(first.id,basicResult('stale'));assert.equal(panel.result,null);assert.equal(worker.sent.length,2);assert.equal(worker.sent[1].state.researchFrame,2);worker.respond(worker.sent[1].id,basicResult('latest'));assert.equal(panel.result.title,'latest');assert.equal(panel.resultState.researchFrame,2);assert.equal(panel.desiredKey,panel.resultKey);panel.dispose();
});

test('progress callback echoes keep Play running; external frame restore pauses',()=>{
 const {panel,calls}=mount();active(panel);panel.worker.respond(panel.worker.sent[0].id,basicResult());panel.onChange=(patch,meta)=>{calls.push({patch,meta});panel.update({...panel.state,...patch});};panel.togglePlay();panel.tick(0);panel.tick(100);assert.equal(panel.state.researchFrame,1);assert.equal(panel.running,true);assert.equal(calls.at(-1).meta.progress,true);
 panel.update({...panel.state,researchFrame:20});assert.equal(panel.running,false);assert.equal(panel.state.researchFrame,20);assert.equal(panel.el.timeline.value,'20');panel.dispose();
});

test('focused timeline, pending frame zero and mode reset remain synchronized',()=>{
 const {panel}=mount();active(panel,{researchFrame:120});document.activeElement=panel.el.timeline;panel.queuePatch({researchFrame:0},false);assert.equal(panel.el.timeline.value,'0');assert.equal(panel.el.frame.textContent,'0 / 240');panel.commit({researchMode:'heat',researchFrame:0},{immediate:true});assert.equal(panel.pendingPatch,null);assert.equal(panel.el.timeline.value,'0');assert.equal(panel.state.researchFrame,0);panel.update({...panel.state,researchFrame:77});assert.equal(panel.el.timeline.value,'77');panel.dispose();document.activeElement=null;
});

test('pause/flush persist the final local frame and exit terminates in-flight work',()=>{
 const {panel,calls}=mount(),worker=active(panel);worker.respond(worker.sent[0].id,basicResult());panel.running=true;panel.commit({researchFrame:7},{progress:true});panel.flush();assert.equal(calls.at(-1).meta.immediate,true);assert.equal(calls.at(-1).patch.researchFrame,7);const count=calls.length;panel.pause();panel.pause();assert.equal(calls.length,count+1);panel.update({...panel.state,researchMode:'off'});assert.equal(worker.terminated,true);assert.equal(panel.inFlight,null);panel.dispose();
});

test('mode controls expose the actual parameters and reject invalid real Pick nodes',()=>{
 const {panel,calls}=mount();active(panel,{researchMode:'gram'});assert.equal(panel.controls.get('researchNodeImag').row.hidden,false);const kernel=panel.controls.get('researchKernel').input;kernel.value='logPick';kernel.onchange();assert.equal(panel.state.researchNodes,'0.15,0.35,0.7,1.2');assert.equal(panel.controls.get('researchNodeImag').row.hidden,true);assert.equal(panel.controls.get('researchT').row.hidden,true);const nodes=panel.controls.get('researchNodes').input;nodes.value='-1,1';const count=calls.length;nodes.onchange();assert.equal(nodes.getAttribute('aria-invalid'),'true');assert.equal(calls.length,count);
 panel.update({...panel.state,researchMode:'theta'});assert.equal(panel.controls.get('researchA').row.hidden,false);assert.equal(panel.controls.get('researchA').label.textContent,'Mellin tilt x');panel.update({...panel.state,researchMode:'heat',researchHeatModel:'theta'});assert.equal(panel.controls.get('researchT').row.hidden,false);assert.equal(panel.controls.get('researchShowVectors').row.hidden,false);panel.dispose();
});

test('all plot kinds paint cached samples, preserving masks and line path breaks',()=>{
 const {panel}=mount(),worker=active(panel,{researchMode:'shear'}),plots=[
  {kind:'heatmap',title:'Signed',xLabel:'σ',yLabel:'t',xMin:0,xMax:1,yMin:0,yMax:1,cols:2,rows:2,values:[-1,null,0,1],palette:'diverging',contours:[{name:'zero',segments:[[[0,0],[1,1]]]}],vectors:[{x:.5,y:.5,dx:.1,dy:.1}]},
  {kind:'lines',title:'Broken at a pole',series:[{name:'sample',points:[[0,0],[1,1],null,[2,2],[3,1]]}]},
  {kind:'complex',title:'Complex',unitCircle:true,series:[{points:[[0,0],[1,1]]}],points:[{x:.5,y:.5,label:'point'}]},
  {kind:'matrix',title:'Matrix',labels:['a','b'],values:[[1,-.2],[-.2,1]]},
  {kind:'bars',title:'Signed bars',labels:['+','−'],values:[1,-2]}
 ];worker.respond(worker.sent[0].id,basicResult('paint',plots));assert.equal(panel.plots.length,5);for(const plot of panel.plots)plot.draw();assert.equal(panel.plots[0].hasMasked,true);assert.equal(panel.plots[0].raster.imageData.data.length,16);const operations=panel.plots[1].ctx.calls.filter(c=>c[0]==='moveTo');assert.ok(operations.length>=2);assert.ok(panel.screenshot().startsWith('data:image/png'));const count=worker.sent.length;panel.scheduleDraw();for(const [id,callback]of [...frames]){frames.delete(id);callback(0);}assert.equal(worker.sent.length,count,'redraw never asks for numerical evaluation');panel.dispose();
});

test('an unresolved numerical result explains why no plot is available',()=>{
 const {panel}=mount(),worker=active(panel,{researchMode:'gram'});worker.respond(worker.sent[0].id,basicResult('Unresolved matrix'));assert.equal(panel.el.empty.hidden,false);assert.match(panel.el.empty.textContent,/numerical status/);panel.dispose();
});

test('surface handoff follows the displayed energy or ratio point and waits for that result',()=>{
 const {panel}=mount();active(panel,{researchMode:'energy',researchA:.5,researchShift:.2});assert.equal(panel.currentLinkedPoint().sigma,.7);assert.equal(panel.inspect.surface.disabled,true);panel.update({...panel.state,researchMode:'ratio',researchPath:'circle',researchSigma:.6,researchT:14,researchRadius:.4,researchFrame:60});assert.ok(Math.abs(panel.currentLinkedPoint().sigma-.6)<1e-12);assert.equal(panel.currentLinkedPoint().t,14.4);panel.update({...panel.state,researchPath:'bridgeSweep',researchA:.25,researchFrame:120});assert.equal(panel.currentLinkedPoint().a,.1275);panel.update({...panel.state,researchGhost:true});assert.equal(panel.inspect.handoff.hidden,true);panel.dispose();
});

test('range bounds change before values when restoring another experiment',()=>{
 const {panel}=mount();active(panel,{researchMode:'energy',researchA:.5});panel.update({...panel.state,researchMode:'shear',researchA:.25});assert.equal(panel.controls.get('researchA').input.value,'0.25');panel.update({...panel.state,researchMode:'modes',researchPrimeCount:4,researchPrimeSolo:3});panel.update({...panel.state,researchPrimeCount:32,researchPrimeSolo:30});assert.equal(panel.controls.get('researchPrimeSolo').input.value,'30');panel.dispose();
});
