import { DynamicsSimulation, DYNAMICS_DEFAULTS, DYNAMICS_LIMITS, DYNAMICS_ENUMS } from './dynamics.js';

const TAU=2*Math.PI,MAX_STEPS=2400;
const MODES=[
 ['phase','Phase vortices','Tracers follow the phase velocity of a fixed ξ field.'],
 ['relax','Modulus relaxation','Move down log |ξ| toward zeros of the fixed field.'],
 ['walk','Seeded random walk','Deterministic seeded diffusion with drift.'],
 ['cancel','Interference & cancellation','A deformed field whose zeros can move.'],
 ['heat','Bounded heat surrogate','A finite grid evolves under a declared boundary condition.'],
 ['trap','Vortex trapping','A finite dynamical model with tunable confinement.'],
 ['collision','Polynomial zero dynamics','Finite coefficient heat flow and zero collisions.']
];
const MODE_DEFAULTS={phase:{dynamicsAlpha:0,dynamicsBeta:1},relax:{dynamicsAlpha:.8,dynamicsBeta:0},walk:{dynamicsAlpha:.15,dynamicsBeta:.45,dynamicsDiffusion:.035},cancel:{dynamicsAmplitude:1,dynamicsShift:.25,dynamicsPhase:0,dynamicsPhaseRate:.4},heat:{dynamicsDiffusion:.08,dynamicsPerturbation:.6,dynamicsBoundary:'pin'},trap:{dynamicsKappa:2,dynamicsForcing:0},collision:{dynamicsPolynomial:'cubic'}};
const PARAMETERS=[
 ['dynamicsAlpha','Modulus relaxation α',['relax','walk','cancel','heat']],
 ['dynamicsBeta','Phase circulation β',['phase','walk','cancel','heat']],
 ['dynamicsDiffusion','Diffusion D',['walk','heat']],
 ['dynamicsPhase','Relative phase φ',['cancel']],
 ['dynamicsPhaseRate','Phase sweep rate',['cancel']],
 ['dynamicsAmplitude','Relative amplitude c',['cancel']],
 ['dynamicsShift','Spectral shift a',['cancel']],
 ['dynamicsPerturbation','Initial perturbation ε',['heat','trap']],
 ['dynamicsKappa','Confinement κ',['trap']],
 ['dynamicsForcing','Phase-locked forcing',['trap']],
 ['dynamicsRate','Playback speed',['phase','relax','walk','cancel','heat','trap','collision']]
];
const CONFIG_KEYS=Object.keys(DYNAMICS_DEFAULTS).filter(key=>key!=='dynamicsStep'&&key!=='dynamicsRate'&&!key.startsWith('dynamicsShow'));
const POLYNOMIAL_LABELS={cubic:'Exact cubic collision','six-real':'Six real roots',lehmer:'Lehmer near-pair','eight-real':'Eight real roots',quartet:'Symmetric quartet'};
const DIAGNOSTIC_LABELS={maxSpeed:'Maximum speed',meanSpeed:'Mean speed',rmsSpeed:'RMS speed',energy:'Grid energy',fieldEnergy:'Field energy',mass:'Grid mass',norm:'Field norm',l2Norm:'L² norm',l2Energy:'L² energy',dirichletEnergy:'Dirichlet energy',minSeparation:'Minimum zero separation',minZeroSeparation:'Minimum zero separation',meanSigma:'Mean σ',meanT:'Mean t',meanOffset:'Mean transverse offset',rmsOffset:'RMS transverse offset',meanDistance:'Mean transverse distance',rmsDistance:'RMS transverse distance',variance:'Tracer variance',trapped:'Trapped tracers',trappedCount:'Trapped tracers',activeParticles:'Active tracers',boundaryHits:'Boundary contacts',maxResidual:'Maximum root residual',zeroResidual:'Root residual',rootResidual:'Root residual',rmsResidual:'RMS residual',zeroCount:'Detected zeros',detectedZeros:'Detected zeros',windingSum:'Sum of sampled windings',finiteFraction:'Finite sample fraction',validFraction:'Valid grid fraction',maxMagnitude:'Maximum magnitude',maxAbs:'Maximum magnitude',diffusion:'Diffusion D',boundary:'Boundary rule',fieldKind:'Field type',status:'Status',drift:'Mean drift',heatTime:'Heat parameter',tau:'Heat parameter τ',dt:'Fixed time step',steps:'Step count'};
const finite=Number.isFinite;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const fmt=(x,d=4)=>{
 if(typeof x==='boolean')return x?'yes':'no';
 if(typeof x!=='number')return String(x??'—');
 if(!finite(x))return x===Infinity?'∞':x===-Infinity?'−∞':'—';
 if(x===0)return '0';
 const n=Math.abs(x);return (n>=1e4||n<1e-3?x.toExponential(Math.max(1,d-1)):Number(x.toPrecision(d)).toString()).replace('e-','e−');
};
const humanize=key=>DIAGNOSTIC_LABELS[key]||key.replace(/([A-Z])/g,' $1').replace(/_/g,' ').replace(/^./,c=>c.toUpperCase());
const modelKind=mode=>mode==='heat'?'grid':['cancel','trap','collision'].includes(mode)?'model':'xi';
const kindLabel=mode=>mode==='heat'?'BOUNDED GRID · SURROGATE':mode==='collision'?'FINITE POLYNOMIAL MODEL':mode==='cancel'?'DEFORMED ξ · MOVING ZEROS':mode==='trap'?'FINITE DYNAMICAL MODEL':'FIXED ξ · TRACER MOTION';
const bounds=(key,fallback)=>DYNAMICS_LIMITS[key]||fallback;
const currentStep=state=>Math.round(clamp(Number(state.dynamicsStep)||0,0,bounds('dynamicsStep',[0,MAX_STEPS])[1]));
const signature=state=>CONFIG_KEYS.map(key=>`${key}:${state[key]}`).join('|');
const colorTable=Array.from({length:360},(_,i)=>{
 const h=i/60,x=1-Math.abs(h%2-1),a=h<1?[1,x,0]:h<2?[x,1,0]:h<3?[0,1,x]:h<4?[0,x,1]:h<5?[x,0,1]:[1,0,x];
 return a.map(v=>.23+.77*v);
});

function node(tag,className,text){const el=document.createElement(tag);if(className)el.className=className;if(text!==undefined)el.textContent=text;return el;}
function label(ctx,text,x,y,color='#93abc1',align='center',size=9){ctx.fillStyle=color;ctx.font=`${size}px ui-monospace, SFMono-Regular, Consolas, monospace`;ctx.textAlign=align;ctx.textBaseline='middle';ctx.fillText(text,x,y);}
function niceTicks(min,max,target=5){
 const raw=(max-min)/Math.max(1,target),power=10**Math.floor(Math.log10(raw||1)),q=raw/power;
 const step=(q<=1?1:q<=2?2:q<=5?5:10)*power,values=[];
 for(let n=Math.ceil(min/step)*step;n<=max+step*1e-7&&values.length<20;n+=step)values.push(Math.abs(n)<step*1e-8?0:n);
 return values;
}

/** Canvas view and fixed-step clock for the dynamics lab.
 * The simulation owns every numerical evaluation. Painting, resizing and
 * cached-cell inspection use its snapshot only. Flat state is persisted by
 * the parent through onChange; the running clock itself is never serialized.
 */
export class DynamicsPanel {
 constructor(container,{controlsEl,inspectorEl,onChange=()=>{},onCommand=()=>{}}={}){
  if(!container)throw new Error('DynamicsPanel requires a main mount.');
  this.container=container;this.controlsEl=controlsEl||node('div');this.inspectorEl=inspectorEl||node('div');
  this.onChange=onChange;this.onCommand=onCommand;this.state={...DYNAMICS_DEFAULTS};this.engine=null;this.snapshot=null;
  this.running=false;this.disposed=false;this.frame=null;this.lastFrame=null;this.accumulator=0;this.lastSync=0;this.lastEmittedStep=null;this.externalStep=0;this.replayTarget=null;
  this.configSignature=null;this.fieldCache=null;this.brightnessReference=null;this.selected=null;this.dirty=true;this.pendingPatch=null;this.changeTimer=null;this.lastInspector=0;
  this.raster=document.createElement('canvas');this.rasterContext=this.raster.getContext('2d');
  container.classList.add('dynamics-workbench');this.controlsEl.classList.add('dynamics-controls');this.inspectorEl.classList.add('dynamics-inspector');
  this.buildMain();this.buildControls();this.buildInspector();
  this.canvas=this.el.canvas;this.ctx=this.canvas.getContext('2d');
  this.resizeObserver=typeof ResizeObserver==='function'?new ResizeObserver(()=>{this.dirty=true;this.requestFrame();}):null;
  this.resizeObserver?.observe(this.el.stage);
  this.onResize=()=>{this.dirty=true;this.requestFrame();};window.addEventListener('resize',this.onResize);
  this.onVisibility=()=>{if(document.hidden)this.pause();};document.addEventListener('visibilitychange',this.onVisibility);
  this.canvas.addEventListener('click',event=>this.selectCell(event));
  this.update(this.state);
 }

 buildMain(){
  this.container.innerHTML=`
   <header class="dynamics-heading"><div><span class="dynamics-eyebrow">07 / DYNAMICS LAB</span><h2 data-dynamics="title">Follow the motion.</h2><p data-dynamics="description"></p></div><span class="dynamics-model-badge" data-dynamics="modelBadge"></span></header>
   <div class="dynamics-equation-row"><span class="dynamics-equation" data-dynamics="equation"></span><span class="dynamics-run-status" data-dynamics="runStatus">PAUSED</span></div>
   <div class="dynamics-stage" data-dynamics="stage"><canvas data-dynamics="canvas" aria-label="Complex field with particle trajectories and computed zero locations"></canvas><div class="dynamics-canvas-note"><span data-dynamics="canvasNote"></span><strong data-dynamics="canvasTime">T = 0.000</strong></div><div class="dynamics-phase-legend" data-dynamics="phaseLegend"><b>ARG F</b><span>−π</span><i></i><span>π</span></div><div class="dynamics-empty" data-dynamics="empty" role="status">Preparing the experiment…</div></div>
   <div class="dynamics-transport"><div class="dynamics-transport-buttons"><button type="button" class="dynamics-play" data-dynamics="play" aria-label="Play dynamics"><span data-dynamics="playIcon">▶</span><span data-dynamics="playText">Play</span></button><button type="button" data-dynamics="step" title="Advance one fixed time step">Step ›</button><button type="button" data-dynamics="reset" title="Restore the same seed at time zero">↺ Reset</button><button type="button" data-dynamics="perturb" title="Choose a new deterministic seed and restart">✧ Perturb</button></div><div class="dynamics-scrub"><label for="dynamicsTimeline">FIXED-STEP TIMELINE</label><output data-dynamics="timelineOutput">0 / 2400</output><input id="dynamicsTimeline" data-dynamics="timeline" aria-label="Simulation step" type="range" min="0" max="2400" step="1" value="0"></div><div class="dynamics-seed">DETERMINISTIC SEED<strong data-dynamics="seed">17</strong></div></div>
   <div class="dynamics-scope-note" data-dynamics="scopeNote"></div>
   <div class="dynamics-mobile-actions"><button type="button" data-dynamics-command="controls">Parameters ↗</button><button type="button" data-dynamics-command="inspect">Measurements ↗</button></div>`;
  this.el=Object.fromEntries([...this.container.querySelectorAll('[data-dynamics]')].map(el=>[el.dataset.dynamics,el]));
  this.el.play.onclick=()=>this.togglePlay();this.el.step.onclick=()=>this.step();this.el.reset.onclick=()=>this.reset();this.el.perturb.onclick=()=>this.perturb();
  this.el.timeline.oninput=()=>{const step=Number(this.el.timeline.value);this.queuePatch({dynamicsStep:step},false);this.stop(false);};
  this.el.timeline.onchange=()=>this.commitPending(true);
  for(const button of this.container.querySelectorAll('[data-dynamics-command]'))button.onclick=()=>this.onCommand(button.dataset.dynamicsCommand);
 }

 buildControls(){
  this.controlsEl.innerHTML=`<div class="dynamics-control-heading"><span class="dynamics-eyebrow">EXPERIMENT SETTINGS</span><h3>Choose the dynamics.</h3><p>One fixed-step clock. Explicit field models.</p></div><div class="dynamics-control-group"><label class="dynamics-control-label" for="dynamicsVariant">Variant</label><select id="dynamicsVariant" data-dynamics-setting="dynamicsMode"></select><p class="dynamics-variant-note" data-control="variantNote"></p></div><div class="dynamics-control-group" data-control="modelGroup"><div class="dynamics-select-wrap" data-control="polynomialWrap"><label class="dynamics-control-label" for="dynamicsPolynomial">Polynomial initial state</label><select id="dynamicsPolynomial" data-dynamics-setting="dynamicsPolynomial"></select></div><div class="dynamics-select-wrap" data-control="boundaryWrap"><label class="dynamics-control-label" for="dynamicsBoundary">Boundary condition</label><select id="dynamicsBoundary" data-dynamics-setting="dynamicsBoundary"></select></div></div><div class="dynamics-control-group" data-control="parameters"><h4>EVOLUTION PARAMETERS</h4></div><div class="dynamics-control-group"><h4>INITIAL CONDITION</h4><div class="dynamics-number-row"><label for="dynamicsSeedInput">Random seed</label><input id="dynamicsSeedInput" data-dynamics-setting="dynamicsSeed" type="number" min="0" max="4294967295" step="1" value="17"></div><p class="dynamics-fine-print">Reset replays this seed. Perturb chooses a new seed and restarts. Parameter changes return to step zero.</p></div><div class="dynamics-control-group"><h4>CANVAS LAYERS</h4><div class="dynamics-checks"><label><input type="checkbox" data-dynamics-setting="dynamicsShowPhase" checked>Phase color</label><label><input type="checkbox" data-dynamics-setting="dynamicsShowVelocity" checked>Velocity</label><label><input type="checkbox" data-dynamics-setting="dynamicsShowTrails" checked>Trails</label><label><input type="checkbox" data-dynamics-setting="dynamicsShowZeros" checked>Zeros</label></div></div><div class="dynamics-control-group"><button type="button" class="dynamics-secondary-action" data-control="theta">Open exact theta heat flow<span>↗</span></button><p class="dynamics-fine-print">The existing theta panel evaluates the de Bruijn–Newman family. Grid and polynomial experiments here have their own equations.</p></div>`;
  this.control=Object.fromEntries([...this.controlsEl.querySelectorAll('[data-control]')].map(el=>[el.dataset.control,el]));
  const modeSelect=this.controlsEl.querySelector('[data-dynamics-setting="dynamicsMode"]');
  for(const [value,title] of MODES){const option=node('option','',title);option.value=value;modeSelect.append(option);}
  const polynomialSelect=this.controlsEl.querySelector('[data-dynamics-setting="dynamicsPolynomial"]');
  for(const value of DYNAMICS_ENUMS.dynamicsPolynomial||Object.keys(POLYNOMIAL_LABELS)){const option=node('option','',POLYNOMIAL_LABELS[value]||value);option.value=value;polynomialSelect.append(option);}
  const boundarySelect=this.controlsEl.querySelector('[data-dynamics-setting="dynamicsBoundary"]');
  for(const value of DYNAMICS_ENUMS.dynamicsBoundary||['reflect','pin']){const option=node('option','',value==='reflect'?'Reflect · no normal flux':value==='pin'?'Pin · fixed boundary values':value);option.value=value;boundarySelect.append(option);}
  this.parameterRows=new Map();
  for(const [key,title,modes] of PARAMETERS){
   if(!(key in DYNAMICS_DEFAULTS))continue;
   const row=node('div','dynamics-control-row'),id=`dynamicsParam-${key}`;
   const name=node('label','',title);name.htmlFor=id;const output=node('output');output.dataset.dynamicsOutput=key;
   const input=node(key==='dynamicsForcing'?'select':'input');input.id=id;input.dataset.dynamicsSetting=key;
   if(key==='dynamicsForcing')for(const value of [0,.01,.05]){const option=node('option','',value===0?'Off · 0':String(value));option.value=value;input.append(option);}
   else{input.type='range';const [min,max,step]=bounds(key,key==='dynamicsRate'?[1,100,1]:[0,3,.01]);input.min=min;input.max=max;input.step=step??.01;}
   row.append(name,output,input);this.control.parameters.append(row);this.parameterRows.set(key,{row,output,input,modes});
  }
  this.settings=[...this.controlsEl.querySelectorAll('[data-dynamics-setting]')];
  for(const input of this.settings){
   const key=input.dataset.dynamicsSetting;
   if(input.type==='range'){
    input.oninput=()=>{const value=Number(input.value);this.parameterRows.get(key).output.textContent=this.parameterValue(key,value);this.queuePatch({[key]:value},key!=='dynamicsRate');};
    input.onchange=()=>this.commitPending(true);
   }else input.onchange=()=>{
    const value=input.type==='checkbox'?input.checked:typeof DYNAMICS_DEFAULTS[key]==='number'?Number(input.value):input.value;
    this.commit({...(key==='dynamicsMode'?MODE_DEFAULTS[value]:{}),[key]:value},{reset:!key.startsWith('dynamicsShow'),mode:input.tagName==='SELECT'?'push':'replace',immediate:true});
   };
  }
  this.control.theta.onclick=()=>{this.pause();this.onCommand('theta');};
 }

 buildInspector(){
  this.inspectorEl.innerHTML=`<div class="dynamics-inspector-heading"><span class="dynamics-eyebrow">LIVE MEASUREMENTS</span><h3>Measure the motion.</h3><p data-inspect="description">Diagnostics are calculated from the evolving state.</p></div><div class="dynamics-primary-metrics"><div><span>SIMULATION TIME</span><strong data-inspect="time">0.000</strong></div><div><span>FIXED STEP</span><strong data-inspect="step">0</strong></div><div><span data-inspect="zeroLabel">ZEROS IN VIEW</span><strong data-inspect="zeros">—</strong></div><div><span data-inspect="particlesLabel">TRACERS</span><strong data-inspect="particles">—</strong></div></div><section class="dynamics-inspector-section"><h4>ACTUAL DIAGNOSTICS</h4><dl class="dynamics-diagnostic-list" data-inspect="diagnostics"></dl><p class="dynamics-live-note" data-inspect="status"></p></section><section class="dynamics-inspector-section"><h4>ROOT LOCATIONS</h4><div class="dynamics-zero-list" data-inspect="zeroList"></div><p class="dynamics-inspector-note" data-inspect="rootNote"></p></section><section class="dynamics-inspector-section"><h4>SAMPLED CELL · CLICK THE CANVAS</h4><div class="dynamics-selection" data-inspect="selection">Select a point in the field.</div></section><section class="dynamics-inspector-section"><h4>MODEL SCOPE</h4><p class="dynamics-inspector-note" data-inspect="scope"></p></section>`;
  this.inspect=Object.fromEntries([...this.inspectorEl.querySelectorAll('[data-inspect]')].map(el=>[el.dataset.inspect,el]));this.diagnosticNodes=new Map();
 }

 parameterValue(key,value){return key==='dynamicsPhase'?`${fmt(value/Math.PI,3)}π`:key==='dynamicsRate'?`${Math.round(value)} steps/s`:key==='dynamicsPhaseRate'?`${fmt(value,3)} rad/T`:fmt(value,3);}

 syncControls(){
  const mode=this.state.dynamicsMode;
  for(const input of this.settings){const value=this.state[input.dataset.dynamicsSetting];if(input.type==='checkbox')input.checked=!!value;else if(document.activeElement!==input||input.type!=='range')input.value=value;}
  for(const [key,{row,output,modes}] of this.parameterRows){row.hidden=!modes.includes(mode);output.textContent=this.parameterValue(key,this.state[key]);}
  this.control.variantNote.textContent=MODES.find(item=>item[0]===mode)?.[2]||'';
  this.control.polynomialWrap.hidden=mode!=='collision';this.control.boundaryWrap.hidden=mode!=='heat';this.control.modelGroup.hidden=this.control.polynomialWrap.hidden&&this.control.boundaryWrap.hidden;
  this.el.phaseLegend.hidden=!this.state.dynamicsShowPhase;this.el.seed.textContent=String(this.state.dynamicsSeed);
  const finitePreset=mode==='collision';this.el.perturb.disabled=finitePreset;this.el.perturb.title=finitePreset?'The selected polynomial has a fixed initial state; choose a different polynomial preset.':'Choose a new deterministic seed and restart';
  this.controlsEl.querySelector('[data-dynamics-setting="dynamicsSeed"]').disabled=finitePreset;
 }

 update(input){
  if(this.disposed)return;
  const incoming={...DYNAMICS_DEFAULTS,...input},active=incoming.dynamicsMode&&incoming.dynamicsMode!=='off';
  const wanted=currentStep(incoming),nextSignature=signature(incoming),explicitSeek=wanted!==this.externalStep;
  this.externalStep=wanted;this.state=incoming;
  this.container.hidden=!active;this.controlsEl.hidden=!active;this.inspectorEl.hidden=!active;
  if(!active){this.stop(false);this.replayTarget=null;this.syncControls();return;}
  try{
   if(!this.engine||this.configSignature!==nextSignature){
    this.stop(false);this.engine=new DynamicsSimulation(incoming);this.snapshot=this.engine.snapshot();this.configSignature=nextSignature;this.fieldCache=null;this.captureBrightnessReference();this.selected=null;this.lastEmittedStep=null;this.replayTarget=wanted>0?wanted:null;
   }else if((wanted!==this.snapshot.step&&(explicitSeek||(!this.running&&this.replayTarget===null)))||(explicitSeek&&this.replayTarget!==null&&wanted!==this.replayTarget)){
    this.stop(false);
    if(wanted<this.snapshot.step){this.engine.reset(incoming);this.snapshot=this.engine.snapshot();this.fieldCache=null;this.captureBrightnessReference();}
    this.replayTarget=wanted>this.snapshot.step?wanted:null;
   }
   this.state.dynamicsStep=this.snapshot.step;this.syncControls();this.updatePresentation();this.updateTransport();this.renderInspector(true);this.dirty=true;this.requestFrame();
  }catch(error){this.stop(false);this.el.empty.hidden=false;this.el.empty.textContent=`The experiment could not start: ${error.message||error}`;this.inspect.status.textContent=this.el.empty.textContent;}
 }

 updatePresentation(){
  const snapshot=this.snapshot,mode=this.state.dynamicsMode;if(!snapshot)return;
  const meta=snapshot.meta||{},fallback=MODES.find(item=>item[0]===mode);
  this.el.title.textContent=meta.title||fallback?.[1]||'Dynamics lab';this.el.description.textContent=meta.note||fallback?.[2]||'';
  this.el.equation.textContent=meta.equation||'';this.el.modelBadge.textContent=kindLabel(mode);this.el.modelBadge.dataset.kind=modelKind(mode);
  this.el.canvasNote.textContent=mode==='phase'||mode==='relax'||mode==='walk'?'Fixed ξ field · trajectories move':mode==='heat'?'Evolving finite grid · bounded domain':mode==='collision'?'Finite polynomial · roots recomputed':mode==='cancel'?'Interfering ξ fields · relative phase moves zeros':'Finite zero model · roots evolve';
  this.el.scopeNote.textContent=meta.note||'This finite numerical experiment is separate from the exact theta heat family.';
  this.inspect.description.textContent=`${kindLabel(mode).toLowerCase()} · fixed ΔT = ${fmt(snapshot.dt??.02,3)}.`;
  this.inspect.scope.textContent=`${meta.note||this.el.scopeNote.textContent} Brightness uses a fixed initial-frame magnitude scale; hue shows phase.`;
  this.inspect.zeroLabel.textContent=mode==='collision'?'MODEL ROOTS':'ZEROS IN VIEW';
  this.inspect.particlesLabel.textContent=['trap','collision'].includes(mode)?'MODEL ZEROS':'TRACERS';
  this.inspect.rootNote.textContent=mode==='collision'?'Roots of the finite model, including nonreal roots. Click a listed root to inspect its nearest grid cell.':'Sampled or independently located roots in this displayed window. This is not a complete zero census.';
  this.el.empty.hidden=true;
 }

 queuePatch(patch,reset){
  if(reset)this.stop(false);
  this.pendingPatch={...(this.pendingPatch||{}),...patch,...(reset?{dynamicsStep:0}:{})};
  clearTimeout(this.changeTimer);this.changeTimer=setTimeout(()=>this.commitPending(false),110);
 }

 commitPending(immediate=false){
  clearTimeout(this.changeTimer);this.changeTimer=null;
  if(!this.pendingPatch)return;
  const patch=this.pendingPatch;this.pendingPatch=null;this.commit(patch,{reset:false,mode:'replace',immediate});
 }

 commit(patch,{reset=false,mode='replace',immediate=true}={}){
  if(this.disposed)return;
  if(reset){clearTimeout(this.changeTimer);this.changeTimer=null;this.pendingPatch=null;this.stop(false);}
  const merged={...patch};if(reset)merged.dynamicsStep=0;
  else if(!('dynamicsStep' in merged))merged.dynamicsStep=this.replayTarget??this.snapshot?.step??currentStep(this.state);
  this.update({...this.state,...merged});this.lastEmittedStep=merged.dynamicsStep;this.onChange(merged,{mode,immediate});
 }

 stop(commit=true){
  const wasRunning=this.running;this.running=false;this.lastFrame=null;this.accumulator=0;
  if(commit&&(wasRunning||this.lastEmittedStep!==this.snapshot?.step))this.emitProgress(true);
  this.updateTransport();
 }

 pause(){if(this.disposed)return;this.commitPending(true);this.stop(true);}

 togglePlay(){
  if(this.disposed||this.state.dynamicsMode==='off'||!this.engine)return;
  this.commitPending(true);
  if(this.running){this.pause();return;}
  if(this.replayTarget!==null||this.snapshot.stopped)return;
  if(this.snapshot.step>=this.maxSteps())this.reset();
  this.running=true;this.lastFrame=null;this.accumulator=0;this.lastSync=performance.now();this.updateTransport();this.requestFrame();
 }

 step(){
  if(!this.engine||this.disposed)return;this.commitPending(true);this.stop(false);
  if(this.replayTarget!==null)return;
  this.advance(1);this.emitProgress(true);this.renderInspector(true);this.updateTransport();this.dirty=true;this.requestFrame();
 }

 reset(){
  clearTimeout(this.changeTimer);this.pendingPatch=null;this.stop(false);this.replayTarget=null;
  // Reset even when the shared URL is already at step zero but the clock has
  // advanced since its last throttled write.
  if(this.engine){this.engine.reset({...this.state,dynamicsStep:0});this.snapshot=this.engine.snapshot();this.fieldCache=null;this.captureBrightnessReference();}
  this.commit({dynamicsStep:0},{mode:'replace',immediate:true});
 }

 perturb(){
  const seed=(Math.imul((Number(this.state.dynamicsSeed)||0)>>>0,1664525)+1013904223)>>>0;
  this.commit({dynamicsSeed:seed,dynamicsStep:0},{reset:true,mode:'push',immediate:true});
 }

 flush(){
  if(this.disposed)return;this.commitPending(true);this.emitProgress(true);
  return {dynamicsStep:this.replayTarget??this.snapshot?.step??currentStep(this.state),dynamicsSeed:this.state.dynamicsSeed};
 }

 emitProgress(immediate=false){
  if(!this.snapshot||this.state.dynamicsMode==='off')return;
  const step=this.replayTarget??this.snapshot.step;
  if(step===this.lastEmittedStep)return;
  this.lastEmittedStep=step;this.state.dynamicsStep=step;
  this.onChange({dynamicsStep:step},{mode:'replace',immediate});
 }

 maxSteps(){return Math.min(this.snapshot?.maxSteps||MAX_STEPS,bounds('dynamicsStep',[0,MAX_STEPS])[1]);}

 advance(count){
  const available=this.maxSteps()-(this.snapshot?.step||0),n=Math.min(available,Math.max(0,Math.floor(count)));
  if(n<1)return;
  const next=this.engine.step(n);this.snapshot=next&&typeof next==='object'?next:this.engine.snapshot();this.state.dynamicsStep=this.snapshot.step;this.dirty=true;
 }

 requestFrame(){
  if(this.disposed||this.frame!==null||this.state.dynamicsMode==='off')return;
  this.frame=requestAnimationFrame(time=>this.tick(time));
 }

 tick(now){
  this.frame=null;if(this.disposed||this.state.dynamicsMode==='off')return;
  try{
   if(this.replayTarget!==null){
    const remaining=this.replayTarget-this.snapshot.step;
    this.advance(Math.min(remaining,12));
    if(this.snapshot.step>=this.replayTarget){this.replayTarget=null;this.state.dynamicsStep=this.snapshot.step;this.renderInspector(true);}
   }else if(this.running){
    if(this.lastFrame!==null){
     this.accumulator+=Math.min(.12,Math.max(0,(now-this.lastFrame)/1000))*Number(this.state.dynamicsRate||40);
     const count=Math.min(8,Math.floor(this.accumulator));if(count>0){this.accumulator-=count;this.advance(count);}
    }
    this.lastFrame=now;
    if(now-this.lastSync>=1000){this.lastSync=now;this.emitProgress(false);}
    if(this.snapshot.step>=this.maxSteps()||this.snapshot.stopped)this.stop(true);
   }
   if(this.dirty){this.draw();this.dirty=false;this.updateTransport();}
   if(now-this.lastInspector>160){this.renderInspector();this.lastInspector=now;}
  }catch(error){this.stop(false);this.replayTarget=null;this.el.empty.hidden=false;this.el.empty.textContent=`Simulation paused: ${error.message||error}`;this.inspect.status.textContent=this.el.empty.textContent;}
  if(this.running||this.replayTarget!==null)this.requestFrame();
 }

 updateTransport(){
  if(!this.el)return;
  const step=this.snapshot?.step||0,max=this.maxSteps(),time=this.snapshot?.time||0,replaying=this.replayTarget!==null;
  this.el.playText.textContent=this.running?'Pause':'Play';this.el.playIcon.textContent=this.running?'Ⅱ':'▶';this.el.play.setAttribute('aria-label',this.running?'Pause dynamics':'Play dynamics');this.el.play.disabled=replaying||!!this.snapshot?.stopped;
  this.el.step.disabled=replaying||step>=max||!!this.snapshot?.stopped;this.el.runStatus.textContent=replaying?`REPLAY ${step} / ${this.replayTarget}`:this.snapshot?.stopped?'MODEL STOPPED':this.running?'RUNNING':step>=max?'END OF RUN':'PAUSED';this.el.runStatus.dataset.running=String(this.running);
  this.el.canvasTime.textContent=`T = ${time.toFixed(3)}`;this.el.timeline.max=max;
  const pendingSeek=this.pendingPatch!=null&&Object.prototype.hasOwnProperty.call(this.pendingPatch,'dynamicsStep');
  const shownStep=pendingSeek?this.pendingPatch.dynamicsStep:replaying?this.replayTarget:step;
  this.el.timeline.value=shownStep;this.el.timelineOutput.textContent=`${shownStep} / ${max}`;
 }

 renderInspector(force=false){
  const snapshot=this.snapshot;if(!snapshot||(!force&&this.inspectorEl.hidden))return;
  this.inspect.time.textContent=(snapshot.time||0).toFixed(3);this.inspect.step.textContent=String(snapshot.step||0);
  this.inspect.zeros.textContent=String(snapshot.zeros?.length||0);this.inspect.particles.textContent=String(snapshot.particles?.length||0);
  const entries=Object.entries(snapshot.diagnostics||{}).filter(([,value])=>typeof value==='number'||typeof value==='string'||typeof value==='boolean');
  const keys=new Set(entries.map(([key])=>key));for(const [key,row] of this.diagnosticNodes)if(!keys.has(key)){row.parent.remove();this.diagnosticNodes.delete(key);}
  for(const [key,value] of entries){
   let row=this.diagnosticNodes.get(key);if(!row){const parent=node('div'),term=node('dt','',humanize(key)),definition=node('dd');parent.append(term,definition);this.inspect.diagnostics.append(parent);row={parent,definition};this.diagnosticNodes.set(key,row);}
   row.definition.textContent=fmt(value,5);
  }
  if(!entries.length&&!this.diagnosticNodes.size)this.inspect.diagnostics.textContent='No diagnostic values are available.';
  this.inspect.status.textContent=snapshot.status||'';
  this.inspect.zeroList.replaceChildren();
  for(const zero of (snapshot.zeros||[]).slice(0,12)){
   if(!finite(zero.sigma)||!finite(zero.t))continue;
   const button=node('button'),position=node('strong','',`${fmt(zero.sigma,5)} ${zero.t<0?'−':'+'} ${fmt(Math.abs(zero.t),6)}i`),winding=node('span','',finite(zero.winding)?`w = ${fmt(zero.winding,2)}`:'');
   button.type='button';button.append(position,winding);if(zero.residual!==undefined)button.append(node('small','',`residual ${fmt(zero.residual,3)}${zero.status?' · '+zero.status:''}`));
   button.onclick=()=>{this.selected={sigma:zero.sigma,t:zero.t};this.updateSelection();this.dirty=true;this.requestFrame();};this.inspect.zeroList.append(button);
  }
  if(!snapshot.zeros?.length)this.inspect.zeroList.append(node('p','','No resolved roots in this snapshot.'));
  else if(snapshot.zeros.length>12)this.inspect.zeroList.append(node('p','',`${snapshot.zeros.length-12} more roots are included in the canvas.`));
  this.updateSelection();
 }

 geometry(){
  const rect=this.canvas.getBoundingClientRect(),width=Math.max(1,rect.width),height=Math.max(1,rect.height),small=width<500;
  return {width,height,left:small?46:54,right:small?14:22,top:13,bottom:small?34:39};
 }

 mapPoint(sigma,t,g=this.plot){
  const d=this.snapshot.domain;return {x:g.left+(sigma-d.sigmaMin)/(d.sigmaMax-d.sigmaMin)*g.plotWidth,y:g.top+(d.tMax-t)/(d.tMax-d.tMin)*g.plotHeight};
 }

 captureBrightnessReference(){
  const field=this.snapshot?.field||this.snapshot?.grid,values=[];
  if(field?.logAbs)for(let i=0;i<field.logAbs.length;i+=Math.max(1,Math.floor(field.logAbs.length/1200)))if((!field.valid||field.valid[i])&&finite(field.logAbs[i]))values.push(field.logAbs[i]);
  values.sort((a,b)=>a-b);const median=values[Math.floor(values.length*.5)]??0,low=values[Math.floor(values.length*.1)]??median-1,high=values[Math.floor(values.length*.9)]??median+1;
  this.brightnessReference={median,span:Math.max(2,high-low)};
 }

 prepareRaster(){
  const field=this.snapshot.field||this.snapshot.grid;if(!field)return false;
  const revision=field.revision??this.snapshot.fieldVersion??this.snapshot.step,phase=!!this.state.dynamicsShowPhase;
  if(this.fieldCache?.field===field&&this.fieldCache.revision===revision&&this.fieldCache.phase===phase)return true;
  const width=field.width,height=field.height;if(!width||!height||!field.phase||!field.logAbs)return false;
  if(!this.brightnessReference)this.captureBrightnessReference();const {median,span}=this.brightnessReference;
  this.raster.width=width;this.raster.height=height;const data=this.rasterContext.createImageData(width,height),pixels=data.data;
  for(let y=0;y<height;y++)for(let x=0;x<width;x++){
   const i=y*width+x,p=((height-1-y)*width+x)*4,a=field.phase[i],log=field.logAbs[i];
   if((field.valid&&!field.valid[i])||!finite(a)||Number.isNaN(log)){pixels[p]=22;pixels[p+1]=34;pixels[p+2]=47;pixels[p+3]=255;continue;}
   const magnitude=log===-Infinity?0:clamp(.52+(log-median)/span*.45,.09,1),contour=finite(log)?1-.07*(.5+.5*Math.cos(log*2.6)):1;
   if(phase){const hue=((Math.round((a/TAU+.5)*360)%360)+360)%360,color=colorTable[hue],brightness=(.27+.73*Math.sqrt(magnitude))*contour;pixels[p]=Math.round(color[0]*brightness*255);pixels[p+1]=Math.round(color[1]*brightness*255);pixels[p+2]=Math.round(color[2]*brightness*255);}
   else{const v=(.12+.7*Math.sqrt(magnitude))*contour;pixels[p]=Math.round(115*v);pixels[p+1]=Math.round(175*v);pixels[p+2]=Math.round(207*v);}
   pixels[p+3]=255;
  }
  this.rasterContext.putImageData(data,0,0);this.fieldCache={field,revision,phase};return true;
 }

 draw(){
  if(!this.snapshot||!this.ctx)return;
  const g=this.geometry(),dpr=Math.min(window.devicePixelRatio||1,2),pixelWidth=Math.round(g.width*dpr),pixelHeight=Math.round(g.height*dpr);
  if(this.canvas.width!==pixelWidth||this.canvas.height!==pixelHeight){this.canvas.width=pixelWidth;this.canvas.height=pixelHeight;}
  const ctx=this.ctx;ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,g.width,g.height);ctx.fillStyle='#0a1421';ctx.fillRect(0,0,g.width,g.height);
  g.plotWidth=Math.max(1,g.width-g.left-g.right);g.plotHeight=Math.max(1,g.height-g.top-g.bottom);this.plot=g;
  ctx.save();ctx.beginPath();ctx.rect(g.left,g.top,g.plotWidth,g.plotHeight);ctx.clip();
  if(this.prepareRaster()){ctx.imageSmoothingEnabled=true;ctx.drawImage(this.raster,g.left,g.top,g.plotWidth,g.plotHeight);}
  this.drawGrid(ctx,g);
  if(this.state.dynamicsShowVelocity)this.drawVelocity(ctx,g);
  if(this.state.dynamicsShowTrails)this.drawTrails(ctx,g);
  this.drawParticles(ctx,g);
  if(this.state.dynamicsShowZeros)this.drawZeros(ctx,g);
  if(this.selected){const p=this.mapPoint(this.selected.sigma,this.selected.t,g);ctx.strokeStyle='#fff';ctx.lineWidth=1;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(g.left,p.y);ctx.lineTo(g.left+g.plotWidth,p.y);ctx.moveTo(p.x,g.top);ctx.lineTo(p.x,g.top+g.plotHeight);ctx.stroke();ctx.setLineDash([]);ctx.strokeStyle='#fff';ctx.beginPath();ctx.arc(p.x,p.y,7,0,TAU);ctx.stroke();}
  ctx.restore();this.drawAxes(ctx,g);
 }

 drawGrid(ctx,g){
  const d=this.snapshot.domain;ctx.strokeStyle='#06111d45';ctx.lineWidth=1;
  for(const x of niceTicks(d.sigmaMin,d.sigmaMax,g.width<500?4:6)){const p=this.mapPoint(x,d.tMin,g);ctx.beginPath();ctx.moveTo(p.x,g.top);ctx.lineTo(p.x,g.top+g.plotHeight);ctx.stroke();}
  for(const y of niceTicks(d.tMin,d.tMax,6)){const p=this.mapPoint(d.sigmaMin,y,g);ctx.beginPath();ctx.moveTo(g.left,p.y);ctx.lineTo(g.left+g.plotWidth,p.y);ctx.stroke();}
  if(d.sigmaMin<.5&&d.sigmaMax>.5){
   const p=this.mapPoint(.5,d.tMin,g);ctx.strokeStyle='#e3f4cf90';ctx.lineWidth=1;ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(p.x,g.top);ctx.lineTo(p.x,g.top+g.plotHeight);ctx.stroke();ctx.setLineDash([]);
  }
 }

 drawAxes(ctx,g){
  const d=this.snapshot.domain;ctx.strokeStyle='#5d718440';ctx.lineWidth=1;ctx.strokeRect(g.left+.5,g.top+.5,g.plotWidth-1,g.plotHeight-1);
  for(const x of niceTicks(d.sigmaMin,d.sigmaMax,g.width<500?4:6)){const p=this.mapPoint(x,d.tMin,g);label(ctx,fmt(x,3),p.x,g.top+g.plotHeight+14,'#a6b8ca','center',8);}
  for(const y of niceTicks(d.tMin,d.tMax,6)){const p=this.mapPoint(d.sigmaMin,y,g);label(ctx,fmt(y,4),g.left-10,p.y,'#a6b8ca','right',8);}
  const axes=this.snapshot.meta?.axes||{x:'σ',y:'t'};label(ctx,axes.x||'σ',g.left+g.plotWidth-2,g.height-8,'#c5d8e9','right',10);label(ctx,axes.y||'t',g.left-10,8,'#c5d8e9','right',10);
 }

 drawVelocity(ctx,g){
  const f=this.snapshot.field||this.snapshot.grid;if(!f?.velocityX||!f?.velocityY)return;
  const d=this.snapshot.domain,sx=Math.max(1,Math.round(f.width/Math.max(5,g.plotWidth/38))),sy=Math.max(1,Math.round(f.height/Math.max(5,g.plotHeight/37))),arrows=[];
  for(let y=Math.floor(sy/2);y<f.height;y+=sy)for(let x=Math.floor(sx/2);x<f.width;x+=sx){
   const i=y*f.width+x,vx=f.velocityX[i],vy=f.velocityY[i];if((f.valid&&!f.valid[i])||!finite(vx)||!finite(vy))continue;
   const dx=vx/(d.sigmaMax-d.sigmaMin)*g.plotWidth,dy=-vy/(d.tMax-d.tMin)*g.plotHeight,speed=Math.hypot(dx,dy);if(speed<1e-10)continue;
   arrows.push({p:this.mapPoint(d.sigmaMin+x/(f.width-1)*(d.sigmaMax-d.sigmaMin),d.tMin+y/(f.height-1)*(d.tMax-d.tMin),g),dx:dx/speed,dy:dy/speed,speed});
  }
  if(!arrows.length)return;
  const speeds=arrows.map(a=>a.speed).sort((a,b)=>a-b),reference=speeds[Math.floor(speeds.length*.7)]||1;
  ctx.lineWidth=.85;ctx.lineCap='round';
  for(const {p,dx,dy,speed} of arrows){const len=clamp(5+7*Math.sqrt(speed/reference),5,16),end={x:p.x+dx*len*.5,y:p.y+dy*len*.5};ctx.strokeStyle='#edfffba8';ctx.beginPath();ctx.moveTo(p.x-dx*len*.5,p.y-dy*len*.5);ctx.lineTo(end.x,end.y);ctx.moveTo(end.x-dx*3-dy*2,end.y-dy*3+dx*2);ctx.lineTo(end.x,end.y);ctx.lineTo(end.x-dx*3+dy*2,end.y-dy*3-dx*2);ctx.stroke();}
 }

 drawTrails(ctx,g){
  const d=this.snapshot.domain,maxJump=Math.max(g.plotWidth,g.plotHeight)*.28;
  for(const particle of this.snapshot.particles||[]){
   const trail=particle.trail;if(!trail?.length)continue;
   const hue=(particle.id*29+185)%360;ctx.strokeStyle=`hsla(${hue},100%,88%,.5)`;ctx.lineWidth=1.3;ctx.lineJoin='round';ctx.beginPath();let previous=null;
   for(const point of trail){const sigma=Array.isArray(point)?point[0]:point.sigma,t=Array.isArray(point)?point[1]:point.t;if(!finite(sigma)||!finite(t)||sigma<d.sigmaMin||sigma>d.sigmaMax||t<d.tMin||t>d.tMax){previous=null;continue;}const p=this.mapPoint(sigma,t,g);if(!previous||Math.hypot(p.x-previous.x,p.y-previous.y)>maxJump)ctx.moveTo(p.x,p.y);else ctx.lineTo(p.x,p.y);previous=p;}
   ctx.stroke();
  }
 }

 drawParticles(ctx,g){
  for(const particle of this.snapshot.particles||[]){if(!finite(particle.sigma)||!finite(particle.t))continue;const p=this.mapPoint(particle.sigma,particle.t,g);ctx.fillStyle=particle.trapped?'#f3cc8a':'#f0ffeb';ctx.shadowColor=particle.trapped?'#f1be5e':'#b8ffda';ctx.shadowBlur=7;ctx.beginPath();ctx.arc(p.x,p.y,particle.trapped?3:2.3,0,TAU);ctx.fill();ctx.shadowBlur=0;ctx.strokeStyle='#10263f';ctx.lineWidth=.8;ctx.stroke();}
 }

 drawZeros(ctx,g){
  let count=0;
  for(const zero of this.snapshot.zeros||[]){
   if(!finite(zero.sigma)||!finite(zero.t))continue;
   const p=this.mapPoint(zero.sigma,zero.t,g),color=zero.winding<0?'#ffd5e7':'#e3ffba';ctx.strokeStyle='#0a1428';ctx.lineWidth=4;ctx.beginPath();ctx.arc(p.x,p.y,6,0,TAU);ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();
   ctx.beginPath();ctx.moveTo(p.x-9,p.y);ctx.lineTo(p.x-3,p.y);ctx.moveTo(p.x+3,p.y);ctx.lineTo(p.x+9,p.y);ctx.moveTo(p.x,p.y-9);ctx.lineTo(p.x,p.y-3);ctx.moveTo(p.x,p.y+3);ctx.lineTo(p.x,p.y+9);ctx.stroke();
   if(count++<8&&g.width>430){ctx.shadowColor='#061320';ctx.shadowBlur=5;label(ctx,finite(zero.winding)?`${zero.winding>0?'+':''}${fmt(zero.winding,2)}`:'0',p.x+12,p.y-10,color,'left',8);ctx.shadowBlur=0;}
  }
 }

 selectCell(event){
  if(!this.snapshot||!this.plot)return;
  const rect=this.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top,g=this.plot,d=this.snapshot.domain;
  if(x<g.left||x>g.left+g.plotWidth||y<g.top||y>g.top+g.plotHeight)return;
  this.selected={sigma:d.sigmaMin+(x-g.left)/g.plotWidth*(d.sigmaMax-d.sigmaMin),t:d.tMax-(y-g.top)/g.plotHeight*(d.tMax-d.tMin)};this.updateSelection();this.dirty=true;this.requestFrame();
 }

 updateSelection(){
  if(!this.selected||!this.snapshot)return;
  const f=this.snapshot.field||this.snapshot.grid,d=this.snapshot.domain;if(!f)return;
  const x=clamp(Math.round((this.selected.sigma-d.sigmaMin)/(d.sigmaMax-d.sigmaMin)*(f.width-1)),0,f.width-1),y=clamp(Math.round((this.selected.t-d.tMin)/(d.tMax-d.tMin)*(f.height-1)),0,f.height-1),i=y*f.width+x;
  const sigma=d.sigmaMin+x/(f.width-1)*(d.sigmaMax-d.sigmaMin),t=d.tMin+y/(f.height-1)*(d.tMax-d.tMin);
  if(f.valid&&!f.valid[i]){this.inspect.selection.textContent=`σ = ${fmt(sigma,6)}\nt = ${fmt(t,6)}\nThis cell is masked.`;return;}
  this.inspect.selection.textContent=`${this.snapshot.meta?.axes?.x||'σ'} = ${fmt(sigma,6)}\n${this.snapshot.meta?.axes?.y||'t'} = ${fmt(t,6)}\nlog |F| = ${fmt(f.logAbs[i],6)}\narg F = ${fmt(f.phase[i]/Math.PI,5)}π\n|v| = ${fmt(Math.hypot(f.velocityX?.[i]||0,f.velocityY?.[i]||0),5)}`;
 }

 screenshot(){if(this.disposed||!this.snapshot||this.replayTarget!==null)return null;this.draw();try{return this.canvas.toDataURL('image/png');}catch{return null;}}

 dispose(){
  if(this.disposed)return;this.disposed=true;this.running=false;this.replayTarget=null;clearTimeout(this.changeTimer);if(this.frame!==null)cancelAnimationFrame(this.frame);
  this.frame=null;this.resizeObserver?.disconnect();window.removeEventListener('resize',this.onResize);document.removeEventListener('visibilitychange',this.onVisibility);
 }
}
