import { INFINITY_DEFAULTS, normalizeInfinityConfig, infinityPoint, infinityInverse,
 infinityProbe, infinitySamplingKey, infinityDisplayLogAbs, sampleInfinityFieldAsync } from './infinity.js';

const TAU=2*Math.PI,colors={bg:'#09131f',panel:'#102131',line:'#304859',muted:'#8ea5b9',text:'#e1ebed',mint:'#d2efa6',cyan:'#79dbe7',orange:'#f0b175'};
const fmt=x=>x===Infinity?'∞':x===-Infinity?'−∞':!Number.isFinite(x)?'—':x===0?'0':Math.abs(x)<.001||Math.abs(x)>=1e5?x.toExponential(3):Number(x.toPrecision(6)).toString();
const complex=(s,t)=>`${fmt(s)} ${t<0?'−':'+'} ${fmt(Math.abs(t))}i`;
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const label=(text,control)=>`<label class="infinity-control"><span>${text}</span>${control}</label>`;
const select=(key,items)=>`<select data-key="${key}">${items.map(([value,text])=>`<option value="${value}">${text}</option>`).join('')}</select>`;
const range=(key,min,max,step)=>`<div class="infinity-range"><input data-key="${key}" type="range" min="${min}" max="${max}" step="${step}"><output data-output="${key}"></output></div>`;
const logRange=key=>`<div class="infinity-range"><input data-key="${key}" data-log="true" type="range" min="0" max="7" step=".01"><output data-output="${key}"></output></div>`;

/** Integrated workspace. The application owns history and shared state;
 * onChange receives a PATCH, and onProbe receives {sigma,t}. Numerical work
 * is cancellable and all cosmetic controls reuse the actual sampled field.
 */
export class InfinityPanel {
 constructor(container,{onChange=()=>{},onProbe=()=>{},onPreset=()=>{},Worker:WorkerClass=globalThis.Worker}={}){
  this.el=container;this.doc=container.ownerDocument||document;this.win=this.doc.defaultView||window;
  this.onChange=onChange;this.onProbe=onProbe;this.onPreset=onPreset;this.WorkerClass=WorkerClass;
  this.state={...INFINITY_DEFAULTS};this.data=null;this.probe=null;this.serial=0;this.active=false;
  this.worker=null;this.timer=null;this.pending=null;this.ready=Promise.resolve();this.destroyed=false;this.hitAreas=[];
  this._mount();
  this.resize=()=>this._drawSoon();
  if(this.win.ResizeObserver){this.observer=new this.win.ResizeObserver(this.resize);this.observer.observe(this.el);}
  else this.win.addEventListener('resize',this.resize);
 }
 _mount(){
  this.el.classList.add('infinity-workbench');
  this.el.innerHTML=`<header class="infinity-heading"><div><p class="infinity-eyebrow">INFINITY ATLAS</p><h2>Expand the end.</h2><p class="infinity-subtitle">Keep the exact field while giving spectral infinity its own coordinates.</p></div><div class="infinity-actions"><button type="button" data-command="klein">Klein surface ↗</button><button type="button" data-command="annulus">Boundary annulus ↗</button><button type="button" data-command="png">Save image</button></div></header>
   <nav class="infinity-tabs" aria-label="Infinity chart"><button type="button" data-mode="end">Expanded puncture</button><button type="button" data-mode="strip">Strip ends</button><span class="infinity-status" role="status">Preparing chart</span></nav>
   <div class="infinity-layout"><aside class="infinity-controls" aria-label="Infinity chart controls">
   <section><h3>Analytic field</h3>${label('Source',select('function',[['xi','Completed ξ'],['heat','Theta heat family']]))}<div data-heat-only>${label('Heat parameter τ',range('tau',-.3,.5,.01))}</div></section>
   <section data-end-only><h3>Finite radial window</h3>${label('Near cutoff · −log|q|',range('infinityTauMin',0,11.75,.05))}${label('Far cutoff · −log|q|',range('infinityTauMax',.25,12,.05))}<p>q = 1 − w. The local end stays inside |q| ≤ 1, away from all cover branch points. Increasing the far cutoff approaches the puncture without evaluating it.</p></section>
   <section data-strip-only><h3>Vertical strip</h3>${label('End',select('infinityEnd',[['upper','Upper · t > 0'],['lower','Lower · t < 0']]))}${label('Near |t| · logarithmic range',logRange('infinityTMin'))}${label('Far |t| · logarithmic range',logRange('infinityTMax'))}${label('Half-width · |σ − ½|',range('infinitySigmaSpan',.05,8,.05))}<p>The horizontal coordinate x = σ − ½ stays independent. Reciprocal height is y = 1/t.</p></section>
   <section><h3>Presentation</h3>${label('Charts',select('infinityLayout',[['paired','Paired charts'],['cylinder','First chart'],['flat','Unrolled / log chart']]))}${label('Colour',select('infinityColor',[['phase','Phase hue'],['amplitude','Log amplitude']]))}${label('Display field',select('infinityDisplay',[['exact','Exact field'],['damped','Positive Gaussian fade']]))}<div data-damped-only>${label('Gaussian scale S',range('infinityDampingScale',1,2000,1))}<p>Display factor exp(−|s − ½|²/S²). Finite zeros and phase are retained. Diagnostics use the original analytic field.</p></div>${label('Sampling',select('infinityResolution',[['draft','Draft'],['standard','Standard'],['fine','Fine']]))}</section>
   <section><h3>Cover and quotient</h3>${label('Local sheet',select('infinitySheet',[['plus','Sheet +'],['minus','Sheet −']]))}<label class="infinity-check"><input type="checkbox" data-key="infinityPartner"> Show Klein partner</label><p>Sheet exchange keeps the field value. The Klein partner sends s to 1 − s̄ and conjugates the field.</p></section>
   </aside><div class="infinity-main"><div class="infinity-chart-title"><strong data-title>Expanded puncture</strong><span data-chart-note></span></div><canvas class="infinity-canvas" aria-label="Sampled complex field in finite infinity charts" role="img" tabindex="0"></canvas>
   <div class="infinity-legend"><span><i class="infinity-phase-key"></i> Phase / fixed amplitude transfer</span><span><i class="infinity-gray-key"></i> Outside numerical coverage</span><span><i class="infinity-hatch-key"></i> Phase may wind between samples</span></div>
   <p class="infinity-scope" data-scope></p>
   <section class="infinity-inspector"><div class="infinity-section-label">INSPECTED POINT <span>Click either chart</span></div><div class="infinity-metrics" data-inspector></div><button type="button" data-command="inspect">Inspect on the main surface ↗</button></section>
   <section class="infinity-cutoffs"><div class="infinity-section-label">FINITE CUTOFF DIAGNOSTICS</div><div class="infinity-cutoff-grid" data-cutoffs></div><p data-boundary-scope>Boundary sums use evaluated samples only. Missing arcs remain missing; these are neither global energy bounds nor certified winding counts.</p></section>
   <details class="infinity-methods"><summary>Coordinates, field and limits</summary><p data-formula></p><p>Infinity remains an essential end of ξ. The cylinder stretches the domain; it does not assign a limiting value or phase. The two strip charts show the same samples in y = 1/t and ρ = log|t|.</p><p>The positive Gaussian changes only the displayed amplitude. It is not holomorphic. Values, logarithmic derivatives, conjugacy residuals and boundary fluxes below always belong to the original ξ or heat field.</p><p>Flux is the sampled integral of Re(F̄ ∂ₙF) in the stated conformal coordinates, displayed after division by exp(2M), with M the largest sampled boundary log amplitude. In the strip, horizontal cutoff flux uses the spectral plane metric. In the cylindrical end it uses dτ² + dθ². These formulas do not omit unknown tails by declaring them zero.</p><p>A finite grid cannot resolve arbitrarily rapid phase variation. Hatching marks a local derivative-based phase-step warning. Gray marks excluded numerical data, not zeros.</p></details>
   </div></div>`;
  this.canvas=this.el.querySelector('canvas');
  this.el.addEventListener('input',event=>{
   const input=event.target,key=input.dataset?.key;if(!key)return;
   let value=input.type==='checkbox'?input.checked:input.tagName==='SELECT'?input.value:Number(input.value);
   if(input.dataset.log)value=Math.pow(10,value);
   this._patch({[key]:value});
  });
  this.el.addEventListener('click',event=>{
   const mode=event.target.closest('[data-mode]')?.dataset.mode;
   if(mode){this.onPreset(mode==='strip'?'stripEnds':'infinityEnd');this._patch({infinityMode:mode});return;}
   const command=event.target.closest('[data-command]')?.dataset.command;
   if(command==='png')this.downloadPNG();
   else if(command==='inspect'){const p=this.probe?.point;if(p?.valid)this.onProbe({sigma:p.sigma,t:p.t,open:true});}
   else if(command)this.onPreset(command);
  });
  this.canvas.addEventListener('click',event=>this._pick(event));
  this.canvas.addEventListener('keydown',event=>{
   const delta=event.shiftKey?.05:.01,patch={};
   if(event.key==='ArrowLeft')patch.infinityProbeU=clamp(this.state.infinityProbeU-delta,0,1);
   else if(event.key==='ArrowRight')patch.infinityProbeU=clamp(this.state.infinityProbeU+delta,0,1);
   else if(event.key==='ArrowUp')patch.infinityProbeV=clamp(this.state.infinityProbeV+delta,0,1);
   else if(event.key==='ArrowDown')patch.infinityProbeV=clamp(this.state.infinityProbeV-delta,0,1);
   else return;
   event.preventDefault();this._patch(patch);this._sendProbe();
  });
 }
 _patch(patch){this.update({...this.state,...patch});this.onChange(patch);}
 update(input={}){
  if(this.destroyed)return this.ready;
  this.state={...input,...normalizeInfinityConfig(input)};this.active=this.state.infinityMode!=='off';
  if(!this.active){this.pause();return this.ready;}
  this._syncControls();
  this.probe=infinityProbe(this.state);this._inspector();
  const key=infinitySamplingKey(this.state);
  if(this.data?.key===key){this._readouts();this._drawSoon();}
  else if(this.pending?.key!==key){this._schedule(key);}
  else this._drawSoon();
  return this.ready;
 }
 _syncControls(){
  const s=this.state;
  for(const input of this.el.querySelectorAll('[data-key]')){
   let value=s[input.dataset.key];if(input.dataset.key==='function')value=s.function==='heat'?'heat':'xi';
   if(input.type==='checkbox')input.checked=!!value;
   else input.value=input.dataset.log?Math.log10(value):value??0;
  }
  for(const output of this.el.querySelectorAll('[data-output]'))output.textContent=fmt(s[output.dataset.output]);
  for(const el of this.el.querySelectorAll('[data-end-only]'))el.hidden=s.infinityMode!=='end';
  for(const el of this.el.querySelectorAll('[data-strip-only]'))el.hidden=s.infinityMode!=='strip';
  for(const el of this.el.querySelectorAll('[data-heat-only]'))el.hidden=s.function!=='heat';
  for(const el of this.el.querySelectorAll('[data-damped-only]'))el.hidden=s.infinityDisplay!=='damped';
  for(const el of this.el.querySelectorAll('[data-mode]')){const selected=el.dataset.mode===s.infinityMode;el.classList.toggle('selected',selected);el.setAttribute('aria-pressed',String(selected));}
  this.el.querySelector('[data-title]').textContent=s.infinityMode==='strip'?`${s.infinityEnd==='lower'?'Lower':'Upper'} strip end`:`Expanded puncture · sheet ${s.infinitySheet==='minus'?'−':'+'}`;
  this.el.querySelector('[data-chart-note]').textContent=s.infinityDisplay==='damped'?'Gaussian display · original-field diagnostics':'Original analytic field · finite samples';
  this.el.querySelector('[data-formula]').textContent=s.infinityMode==='strip'?'x = σ − ½, ρ = log|t|, y = 1/t. The upper and lower ends retain their signs, and the Klein partner sends x to −x at the same t.':`q = e^(−τ)e^(iθ), w = 1 − q, s = L/q + (1 − L)/2, with L = ${fmt(s.chartScale??24)}. The Klein partner acts by q ↦ −q̄/(1 − q̄), not simply by reversing θ.`;
 }
 _cancel(){
  clearTimeout(this.timer);this.timer=null;this.worker?.terminate();this.worker=null;this.serial++;
  this.resolveReady?.(null);this.resolveReady=null;this.pending=null;
 }
 _schedule(key){
  this._cancel();this.data=null;this._clearSampledReadouts();const id=this.serial;this.pending={id,key,state:{...this.state}};
  this.ready=new Promise(resolve=>{this.resolveReady=resolve;});
  this._status('Sampling actual field…');this.el.classList.add('is-sampling');
  this.timer=setTimeout(()=>this._start(id),70);this._drawSoon();
 }
 _clearSampledReadouts(){
  this.el.querySelector('[data-scope]').textContent='Preparing samples for the selected coordinates and analytic field.';
  const cutoffs=this.el.querySelector('[data-cutoffs]');cutoffs.replaceChildren();cutoffs.textContent='Sampling finite cutoff boundaries…';
  this.el.querySelector('[data-boundary-scope]').textContent='Boundary values appear after this chart finishes sampling.';
 }
 _start(id){
  clearTimeout(this.timer);this.timer=null;
  if(!this.active||this.destroyed||id!==this.serial||!this.pending)return;
  const input=this.pending.state;
  const finish=result=>{
   if(!result||id!==this.serial||!this.active||this.destroyed)return;
   this.worker?.terminate();this.worker=null;this.data=result;this.pending=null;
   this.el.classList.remove('is-sampling');this.probe=infinityProbe(this.state);
   this._inspector();this._readouts();this._drawSoon();this.resolveReady?.(result);this.resolveReady=null;
  };
  const failed=error=>{if(id!==this.serial)return;this.worker?.terminate();this.worker=null;this.pending=null;this.el.classList.remove('is-sampling');this._status(error?.message||String(error));this.resolveReady?.(null);this.resolveReady=null;};
  const fallback=()=>sampleInfinityFieldAsync(input,{cancelled:()=>id!==this.serial||!this.active||this.destroyed,onProgress:p=>{if(id===this.serial)this._status(`Sampling actual field · ${Math.round(p*100)}%`);}}).then(finish,failed);
  if(this.WorkerClass){
   try{
    this.worker=new this.WorkerClass(new URL('./infinity-worker.js',import.meta.url),{type:'module'});
    this.worker.onmessage=event=>{if(event.data.id!==this.serial)return;if(event.data.error)failed(new Error(event.data.error));else if(event.data.result)finish(event.data.result);else this._status(`Sampling actual field · ${Math.round(event.data.progress*100)}%`);};
    this.worker.onerror=()=>{if(id!==this.serial)return;this.worker?.terminate();this.worker=null;fallback();};
    this.worker.postMessage({id,state:input});
   }catch{this.worker?.terminate();this.worker=null;fallback();}
  }else fallback();
 }
 _status(text){this.el.querySelector('.infinity-status').textContent=text;}
 _readouts(){
  const d=this.data;if(!d)return;
  const count=(d.nx+1)*(d.ny+1),coverage=100*d.validCount/count;
  this._status(`${d.validCount.toLocaleString()} evaluated samples · ${coverage.toFixed(1)}% covered`);
  this.el.querySelector('[data-scope]').textContent=`${d.kind==='heat'?'Theta heat family':'Completed ξ'} · numerical coverage ${d.domain.sigmaMin} ≤ σ ≤ ${d.domain.sigmaMax}, |t| ≤ ${d.domain.tMax.toLocaleString()}. ${d.phaseWarningCount.toLocaleString()} samples carry a phase-step warning. Infinity is beyond the finite plotted cutoff.`;
  this.el.querySelector('[data-boundary-scope]').textContent=(this.state.infinityMode==='strip'?'These are the two height caps only; the vertical sides are not included. ':'')+'Boundary sums use evaluated samples only. Each flux has its own stated multiplier; retain it before comparing or adding values. Missing arcs remain missing. These are neither global energy bounds nor certified winding counts.';
  const box=this.el.querySelector('[data-cutoffs]');box.replaceChildren();
  for(const b of d.boundaries){
   const card=this.doc.createElement('article');card.className='infinity-cutoff-card';
   const title=this.doc.createElement('h4');title.textContent=b.outer?'Far cutoff':'Near cutoff';
   const range=this.doc.createElement('p');range.textContent=b.minLogAbs===null||b.maxLogAbs===null?'log₁₀|F|: unevaluated':`log₁₀|F|: ${fmt(b.minLogAbs/Math.LN10)} … ${fmt(b.maxLogAbs/Math.LN10)}`;
   const flux=this.doc.createElement('p');flux.textContent=b.fluxScaled===null||b.fluxLogScale===null?'Signed flux: unevaluated':`Scaled signed flux: ${fmt(b.fluxScaled)} · multiplier 10^${fmt(b.fluxLogScale/Math.LN10)}`;
   const coverage=this.doc.createElement('p');coverage.className=b.complete?'complete':'partial';coverage.textContent=b.complete?'Full sampled boundary covered':`${(100*b.coverage).toFixed(1)}% of boundary covered · partial sum`;
   card.append(title,range,flux,coverage);box.append(card);
  }
 }
 _inspector(){
  const p=this.probe;if(!p)return;
  const f=p.value,pv=p.partnerValue,rows=[['s',complex(p.point.sigma,p.point.t)],['Original log₁₀|F|',f.valid?fmt(f.logAbs/Math.LN10):'Outside numerical coverage'],['Phase',f.phaseStable?`${fmt(f.arg/Math.PI)}π`:f.logAbs===-Infinity?'Undefined at evaluated zero':'Unresolved'],['Display log₁₀|F|',f.valid?fmt(infinityDisplayLogAbs(f.logAbs,p.point.sigma,p.point.t,this.state)/Math.LN10):'—']];
  if(this.state.infinityPartner){rows.push(['Klein partner',complex(p.partner.sigma,p.partner.t)],['Partner chart',p.partner.inView?'Inside plotted window':'Outside plotted window'],['Conjugacy residual',p.conjugacy!==null?fmt(p.conjugacy):'Partner outside coverage']);}
  rows.push([`Phase current j${p.current?.coordinate==='x'?'ₓ':'θ'}`,p.current?fmt(p.current.value):'Unresolved']);
  const box=this.el.querySelector('[data-inspector]');box.replaceChildren();
  for(const [name,value] of rows){const cell=this.doc.createElement('div'),dt=this.doc.createElement('span'),dd=this.doc.createElement('strong');dt.textContent=name;dd.textContent=value;cell.append(dt,dd);box.append(cell);}
  this.el.querySelector('[data-command="inspect"]').disabled=!p.point.valid;
 }
 _drawSoon(){if(this.frame||!this.active||this.destroyed)return;this.frame=this.win.requestAnimationFrame(()=>{this.frame=null;this._draw();});}
 _colour(k,shade=1){
  const d=this.data,s=this.state;
  if(!d.valid[k])return '#17232e';
  if(d.logAbs[k]===-Infinity)return '#070c13';
  if(s.infinityColor==='amplitude'){
   const value=infinityDisplayLogAbs(d.logAbs[k],d.sigma[k],d.t[k],s),a=.5+Math.atan(value/40)/Math.PI;
   return `hsl(${205-160*a} ${40+35*a}% ${(10+62*a)*shade}%)`;
  }
  if(!d.phaseStable[k])return '#405365';
  const hue=((d.arg[k]/TAU*360)%360+360)%360;
  const fade=s.infinityDisplay==='damped'?Math.exp(Math.max(-35,-((d.sigma[k]-.5)**2+d.t[k]**2)/s.infinityDampingScale**2)):1;
  return `hsl(${hue} ${12+68*fade}% ${(9+42*fade)*shade}%)`;
 }
 _draw(){
  if(!this.active)return;
  const w=Math.max(280,this.canvas.clientWidth||this.el.clientWidth-270),paired=this.state.infinityLayout==='paired',stacked=paired&&w<740;
  const h=stacked?920:610,dpr=Math.min(this.win.devicePixelRatio||1,2);
  this.canvas.style.height=`${h}px`;this.canvas.width=Math.round(w*dpr);this.canvas.height=Math.round(h*dpr);
  const ctx=this.canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.fillStyle=colors.bg;ctx.fillRect(0,0,w,h);this.hitAreas=[];
  ctx.font='11px ui-monospace,monospace';ctx.fillStyle=colors.muted;
  if(!this.data||this.data.key!==infinitySamplingKey(this.state)){ctx.textAlign='center';ctx.fillText('Preparing independently evaluated samples…',w/2,h/2);return;}
  const first=this.state.infinityMode==='strip'?'reciprocal':'cylinder',second=this.state.infinityMode==='strip'?'log':'flat';
  const types=paired?[first,second]:[this.state.infinityLayout==='cylinder'?first:second];
  const panes=types.map((type,i)=>({type,x:stacked?6:6+i*(w-12)/types.length,y:stacked?12+i*345:12,w:stacked?w-12:(w-12)/types.length,h:stacked?335:420}));
  for(const pane of panes){if(pane.type==='cylinder')this._drawCylinder(ctx,pane);else this._drawFlat(ctx,pane);}
  const y=stacked?725:465;this._drawProfiles(ctx,{x:56,y,w:w-78,h:88});
  if(this.pending){ctx.fillStyle='#0a1424b0';ctx.fillRect(w-180,8,172,25);ctx.fillStyle=colors.mint;ctx.textAlign='right';ctx.fillText('Updating exact samples…',w-16,25);}
 }
 _title(ctx,pane,title,subtitle){ctx.textAlign='left';ctx.fillStyle=colors.text;ctx.font='11px ui-monospace,monospace';ctx.fillText(title,pane.x+13,pane.y+14);ctx.fillStyle=colors.muted;ctx.font='9px ui-monospace,monospace';ctx.fillText(subtitle,pane.x+13,pane.y+30);}
 _fraction(v,type){
  if(type!=='reciprocal')return v;
  const s=this.state,t=s.infinityTMin*Math.exp(v*Math.log(s.infinityTMax/s.infinityTMin));
  return (1/s.infinityTMin-1/t)/(1/s.infinityTMin-1/s.infinityTMax);
 }
 _flatPoint(u,v,area){return {x:area.x+u*area.w,y:area.y+(1-this._fraction(v,area.type))*area.h};}
 _drawFlat(ctx,pane){
  const d=this.data,s=this.state,strip=s.infinityMode==='strip';
  this._title(ctx,pane,pane.type==='reciprocal'?'RECIPROCAL HEIGHT · y = 1/t':strip?'LOG HEIGHT · ρ = log|t|':'UNROLLED CYLINDER · θ, τ',strip?'The same x = σ − ½ is retained in both charts.':'Periodic edges identify; the far edge is a finite cutoff.');
  const area={type:pane.type,x:pane.x+48,y:pane.y+51,w:pane.w-64,h:pane.h-100};
  ctx.fillStyle='#152431';ctx.fillRect(area.x,area.y,area.w,area.h);
  for(let j=0;j<d.ny;j++)for(let i=0;i<d.nx;i++){
   const k=j*(d.nx+1)+i,a=this._flatPoint(i/d.nx,j/d.ny,area),b=this._flatPoint((i+1)/d.nx,(j+1)/d.ny,area);
   ctx.fillStyle=this._colour(k);ctx.fillRect(a.x,b.y,Math.max(.5,b.x-a.x+.35),Math.max(.35,a.y-b.y+.3));
   if(d.valid[k]&&d.phaseWarning[k]&&s.infinityColor==='phase'&&a.y-b.y>2){ctx.strokeStyle='#08152280';ctx.lineWidth=.65;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();}
  }
  ctx.strokeStyle=colors.line;ctx.lineWidth=1;ctx.strokeRect(area.x,area.y,area.w,area.h);
  ctx.font='9px ui-monospace,monospace';ctx.fillStyle=colors.muted;
  for(let i=0;i<=4;i++){
   const u=i/4,x=area.x+area.w*u;ctx.textAlign='center';ctx.fillText(strip?fmt(s.infinitySigmaSpan*(2*u-1)):['−π','−π/2','0','π/2','π'][i],x,area.y+area.h+17);
   const f=i/4,y=area.y+area.h*(1-f);let value;
   if(pane.type==='reciprocal')value=(s.infinityEnd==='lower'?-1:1)*(1/s.infinityTMin-f*(1/s.infinityTMin-1/s.infinityTMax));
   else if(strip)value=(s.infinityEnd==='lower'?-1:1)*s.infinityTMin*Math.exp(f*Math.log(s.infinityTMax/s.infinityTMin));
   else value=s.infinityTauMin+f*(s.infinityTauMax-s.infinityTauMin);
   ctx.textAlign='right';ctx.fillText(fmt(value),area.x-7,y+3);
  }
  ctx.textAlign='center';ctx.fillText(strip?'x = σ − ½':'θ = arg(q)',area.x+area.w/2,area.y+area.h+34);
  ctx.fillStyle=colors.orange;ctx.textAlign='right';ctx.fillText('far cutoff',area.x+area.w-4,area.y+12);
  ctx.fillStyle=colors.mint;ctx.fillText('near cutoff',area.x+area.w-4,area.y+area.h-6);
  if(strip){const p=this._flatPoint(.5,0,area);ctx.strokeStyle='#e9f2c8b0';ctx.setLineDash([4,4]);ctx.beginPath();ctx.moveTo(p.x,area.y);ctx.lineTo(p.x,area.y+area.h);ctx.stroke();ctx.setLineDash([]);}
  this._markers(ctx,(u,v)=>this._flatPoint(u,v,area));this.hitAreas.push(area);
 }
 _cylinderPoint(u,v,area){const theta=TAU*u-Math.PI;return {x:area.cx+area.rx*Math.cos(theta),y:area.base-v*area.height+area.ry*Math.sin(theta),depth:Math.sin(theta)};}
 _drawCylinder(ctx,pane){
  const d=this.data,s=this.state;
  this._title(ctx,pane,`LOCAL CYLINDER · p${s.infinitySheet==='minus'?'−':'+'}`,'q = e^(−τ)e^(iθ) · infinity remains an open end');
  const area={type:'cylinder',cx:pane.x+pane.w*.53,base:pane.y+pane.h-47,rx:pane.w*.31,ry:24,height:pane.h-127};
  const cells=[];
  for(let j=0;j<d.ny;j++)for(let i=0;i<d.nx;i++)cells.push({i,j,depth:Math.sin(TAU*(i+.5)/d.nx-Math.PI)});
  cells.sort((a,b)=>a.depth-b.depth);
  for(const {i,j,depth} of cells){
   const points=[[i/d.nx,j/d.ny],[(i+1)/d.nx,j/d.ny],[(i+1)/d.nx,(j+1)/d.ny],[i/d.nx,(j+1)/d.ny]].map(([u,v])=>this._cylinderPoint(u,v,area)),k=j*(d.nx+1)+i;
   ctx.fillStyle=this._colour(k,.75+.25*Math.max(0,depth));ctx.globalAlpha=depth<0?.6:1;
   ctx.beginPath();points.forEach((p,n)=>n?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();ctx.fill();
   if(depth>0&&d.phaseWarning[k]&&s.infinityColor==='phase'){ctx.strokeStyle='#06121b66';ctx.lineWidth=.55;ctx.beginPath();ctx.moveTo(points[0].x,points[0].y);ctx.lineTo(points[2].x,points[2].y);ctx.stroke();}
  }
  ctx.globalAlpha=1;
  for(const v of [0,.5,1]){ctx.strokeStyle=v===1?colors.orange:v===0?colors.mint:colors.line;ctx.setLineDash(v===.5?[3,5]:[]);ctx.beginPath();for(let i=0;i<=128;i++){const p=this._cylinderPoint(i/128,v,area);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);}ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=colors.muted;ctx.font='9px ui-monospace,monospace';ctx.textAlign='right';ctx.fillText(`τ=${fmt(s.infinityTauMin+v*(s.infinityTauMax-s.infinityTauMin))}`,area.cx-area.rx-7,area.base-v*area.height+3);}
  ctx.strokeStyle=colors.orange;ctx.setLineDash([3,4]);ctx.beginPath();ctx.moveTo(area.cx,area.base-area.height-3);ctx.lineTo(area.cx,area.base-area.height-29);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle=colors.orange;ctx.textAlign='center';ctx.fillText('toward ∞',area.cx,area.base-area.height-35);
  this._markers(ctx,(u,v)=>this._cylinderPoint(u,v,area));this.hitAreas.push({...area,pane});
 }
 _markers(ctx,project){
  const s=this.state,p=this.probe;
  const marker=(u,v,label,color)=>{if(!(u>=0&&u<=1&&v>=0&&v<=1))return;const xy=project(u,v);ctx.beginPath();ctx.arc(xy.x,xy.y,5,0,TAU);ctx.strokeStyle='#08131f';ctx.lineWidth=4;ctx.stroke();ctx.strokeStyle=color;ctx.lineWidth=2;ctx.stroke();ctx.font='9px ui-monospace,monospace';ctx.fillStyle=color;ctx.textAlign='left';ctx.fillText(label,xy.x+9,xy.y-8);};
  marker(s.infinityProbeU,s.infinityProbeV,'P',colors.mint);
  if(s.infinityPartner&&p?.partner?.inView)marker(p.partner.u,p.partner.v,'A(P)',colors.cyan);
 }
 _drawProfiles(ctx,area){
  const s=this.state,d=this.data,yMin=-800,yMax=100,py=value=>area.y+area.h*(1-clamp((value-yMin)/(yMax-yMin),0,1));
  ctx.fillStyle=colors.text;ctx.font='10px ui-monospace,monospace';ctx.textAlign='left';ctx.fillText('CUTOFF AMPLITUDE · fixed log₁₀ scale',area.x,area.y-18);
  ctx.fillStyle=colors.muted;ctx.font='9px ui-monospace,monospace';ctx.textAlign='right';ctx.fillText(s.infinityDisplay==='damped'?'near —   far —   Gaussian display - -':'near —   far —   original field',area.x+area.w,area.y-18);
  ctx.fillStyle='#0e1c2a';ctx.fillRect(area.x,area.y,area.w,area.h);
  for(const value of [-800,-400,0,100]){ctx.strokeStyle=colors.line;ctx.lineWidth=.5;ctx.beginPath();ctx.moveTo(area.x,py(value));ctx.lineTo(area.x+area.w,py(value));ctx.stroke();ctx.fillStyle=colors.muted;ctx.textAlign='right';ctx.fillText(String(value),area.x-8,py(value)+3);}
  for(const boundary of d.boundaries){
   const draw=damped=>{ctx.strokeStyle=boundary.outer?colors.orange:colors.mint;ctx.lineWidth=1.4;ctx.setLineDash(damped?[4,3]:[]);ctx.beginPath();let open=false;
    for(const p of boundary.points){if(!p.valid||!Number.isFinite(p.logAbs)){open=false;continue;}const value=damped?infinityDisplayLogAbs(p.logAbs,p.sigma,p.t,{...s,infinityDisplay:'damped'}):p.logAbs,px=area.x+p.u*area.w,y=py(value/Math.LN10);if(open)ctx.lineTo(px,y);else ctx.moveTo(px,y);open=true;}ctx.stroke();ctx.setLineDash([]);};
   draw(false);if(s.infinityDisplay==='damped')draw(true);
  }
  ctx.textAlign='center';ctx.fillStyle=colors.muted;ctx.fillText(s.infinityMode==='strip'?'Across the cutoff: σ − ½':'Around the cutoff: θ',area.x+area.w/2,area.y+area.h+18);
 }
 _pick(event){
  if(!this.data||!this.active)return;
  const rect=this.canvas.getBoundingClientRect(),x=event.clientX-rect.left,y=event.clientY-rect.top;let selected=null;
  for(const area of this.hitAreas){
   if(area.type==='cylinder'){
    const p=area.pane;if(x<p.x||x>p.x+p.w||y<p.y+40||y>p.y+p.h)continue;
    let best=Infinity;
    for(let j=0;j<=this.data.ny;j++)for(let i=0;i<=this.data.nx;i++){const u=i/this.data.nx,v=j/this.data.ny,pt=this._cylinderPoint(u,v,area);if(pt.depth<-.01)continue;const distance=(pt.x-x)**2+(pt.y-y)**2;if(distance<best){best=distance;selected={u,v};}}
    if(best>625)selected=null;
   }else if(x>=area.x&&x<=area.x+area.w&&y>=area.y&&y<=area.y+area.h){
    const u=(x-area.x)/area.w,f=1-(y-area.y)/area.h;let v=f;
    if(area.type==='reciprocal'){const s=this.state,absY=1/s.infinityTMin-f*(1/s.infinityTMin-1/s.infinityTMax),t=1/absY;v=Math.log(t/s.infinityTMin)/Math.log(s.infinityTMax/s.infinityTMin);}
    selected={u:clamp(u,0,1),v:clamp(v,0,1)};
   }
   if(selected)break;
  }
  if(selected){this._patch({infinityProbeU:selected.u,infinityProbeV:selected.v});this._sendProbe();}
 }
 _sendProbe(){const p=infinityPoint(this.state.infinityProbeU,this.state.infinityProbeV,this.state);if(p.valid)this.onProbe({sigma:p.sigma,t:p.t});}
 pause(){this._cancel();if(this.frame){this.win.cancelAnimationFrame(this.frame);this.frame=null;}this.el.classList.remove('is-sampling');}
 flush(){if(this.timer&&this.pending)this._start(this.pending.id);return this.ready;}
 async downloadPNG(){await this.flush();this._draw();const a=this.doc.createElement('a');a.download=`zeta-${this.state.infinityMode==='strip'?'strip-end':'infinity-end'}.png`;a.href=this.canvas.toDataURL('image/png');a.click();}
 destroy(){this.destroyed=true;this.pause();this.observer?.disconnect();this.win.removeEventListener('resize',this.resize);}
}
