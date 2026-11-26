/**
 * Workbench for the two models: the finite twin ladder and the liquid-drop
 * nucleus. All numbers come from twin-ladder-model.js and nucleus-model.js;
 * this file only draws them and forwards control changes to the application.
 * The animation clocks are local and are never written into a shared view.
 */
import { ZERO_HEIGHTS, evaluatePolar } from './math.js';
import { MODELS_LIMITS, ladderInput, nucleusInput } from './models.js';
import { ladderRungs, armDamping, armSum, armWalk, packetValue, heightScan, finiteBalance, bridgeBalance, ladderConfig } from './twin-ladder-model.js';
import { MODES, DROP, coupledModes, amplitudesAt, shapeProfile, rotorEnergy, SPACING_LAWS, uniformSpacings, zeroSpacings, ksDistance } from './nucleus-model.js';
import { U238_DATA } from './nucleus-data.js';

const TAU=2*Math.PI;
const C={direct:'#7bdeef',dual:'#f3b462',bridge:'#d7f7ad',finite:'#b3acdf',grid:'#223246',axis:'#3a4c62',text:'#9db0c4',dim:'#62758a',
  proton:'#ff8a66',neutron:'#7fb1ff',surface:'#63d6c4',coulomb:'#ff7d8a',bad:'#ff7d8a',good:'#8dffb0'};
const MODE_COLORS=['#7bdeef','#f3b462','#d7f7ad','#e1a2d5','#b3acdf'];
const clamp=(x,lo,hi)=>Math.max(lo,Math.min(hi,x));
const fmt=(x,d=3)=>Number.isFinite(x)?x.toFixed(d).replace('-','−'):'—';
const sig=(x,d=3)=>Number.isFinite(x)?(Math.abs(x)>=1e4||Math.abs(x)<1e-3&&x!==0?x.toExponential(d-1):x.toPrecision(d)).replace('-','−'):'—';
const evaluateXi=(sigma,t)=>evaluatePolar(sigma,t,'xi',0);
const frac=x=>x-Math.floor(x);

const LADDER_CONTROLS=[
  {key:'ladderCentre',label:'Damping centre c',digits:3,hint:'Arms sit at c ± a. ξ balances only at c = ½.'},
  {key:'ladderOffset',label:'Bridge offset a',digits:3,hint:'Half-width of the bridge between the arms.'},
  {key:'ladderHeight',label:'Height T',digits:2,hint:'Every rung turns at rate log p.'},
  {key:'ladderPrimes',label:'Primes',digits:0,hint:'Ladders p = 2, 3, 5, …'},
  {key:'ladderRungs',label:'Rungs per ladder M',digits:0,hint:'Powers p, p², …, p^M.'},
  {key:'ladderWidth',label:'Packet width h',digits:2,hint:'Gaussian window in log-length.'},
  {key:'ladderBeta',label:'Extra damping β',digits:2,hint:'Thermal weight exp(−β·m log p).'},
  {key:'ladderPressure',label:'Pressure P',digits:3,hint:'Convex weight exp(−P·(m log p)²).'},
  {key:'ladderSpeed',label:'Display speed',digits:1,hint:'Height units per second while playing.'},
];
const NUCLEUS_CONTROLS=[
  {key:'nucleusZ',label:'Protons Z',digits:0,hint:'Charge drives the Coulomb term.'},
  {key:'nucleusN',label:'Neutrons N',digits:0,hint:'Adds surface without adding charge.'},
  {key:'nucleusBeta2',label:'Static deformation β₂',digits:3,hint:'Measured value for ²³⁸U is about 0.29.'},
  {key:'nucleusCoupling',label:'Mode coupling κ',digits:2,hint:'Illustrative: mixes λ with λ ± 2.'},
  {key:'nucleusWidth',label:'Damping width Γ (MeV)',digits:3,hint:'Amplitude decays as exp(−Γt/2ħ).'},
  {key:'nucleusSpeed',label:'Display speed',digits:1,hint:'Slows or speeds the display clock only.'},
];

function slider(spec){
  const [lo,hi,step]=MODELS_LIMITS[spec.key];
  return `<label class="models-control"><span>${spec.label}<output data-models-out="${spec.key}"></output></span><input type="range" min="${lo}" max="${hi}" step="${step}" data-models-control="${spec.key}" aria-label="${spec.label}"><small>${spec.hint}</small></label>`;
}

/** Size a canvas to its box at device resolution; returns CSS-pixel context. */
function surface(canvas){
  const view=canvas.ownerDocument?.defaultView,dpr=Math.min(view?.devicePixelRatio||1,2);
  const w=Math.max(1,canvas.clientWidth),h=Math.max(1,canvas.clientHeight);
  if(canvas.width!==Math.round(w*dpr)||canvas.height!==Math.round(h*dpr)){canvas.width=Math.round(w*dpr);canvas.height=Math.round(h*dpr);}
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  return {ctx,w,h};
}
function label(ctx,text,x,y,{color=C.text,size=10,align='left',font='ui-monospace,SFMono-Regular,Consolas,monospace'}={}){
  ctx.font=`${size}px ${font}`;ctx.fillStyle=color;ctx.textAlign=align;ctx.textBaseline='alphabetic';ctx.fillText(text,x,y);
}
function line(ctx,x0,y0,x1,y1,color,width=1,dash=null){
  ctx.save();ctx.strokeStyle=color;ctx.lineWidth=width;if(dash)ctx.setLineDash(dash);ctx.beginPath();ctx.moveTo(x0,y0);ctx.lineTo(x1,y1);ctx.stroke();ctx.restore();
}

export class ModelsPanel {
  constructor(container,{onChange=()=>{},onPreset=()=>{}}={}){
    if(!container)throw new Error('ModelsPanel requires a mount element.');
    this.container=container;this.onChange=onChange;this.onPreset=onPreset;
    this.state=null;this.mode='off';this.playing=false;this.raf=0;this.last=0;
    this.height=14.134725;this.clock=0;this.spin=0;this.cache={};
    const view=container.ownerDocument?.defaultView;
    this.view=view;this.reducedMotion=!!view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    container.classList.add('models-workbench');container.hidden=true;
    container.innerHTML=`
      <header class="models-heading">
        <div><span class="models-eyebrow" data-models="eyebrow"></span><h3 data-models="title"></h3><p data-models="lede"></p></div>
        <div class="models-tabs" role="tablist" aria-label="Model">
          <button role="tab" data-models-mode="ladder">Twin ladder</button><button role="tab" data-models-mode="nucleus">Uranium-238</button>
        </div>
      </header>
      <div class="models-body">
        <aside class="models-controls" aria-label="Model controls">
          <div class="models-transport"><button data-models-action="play" class="models-primary"></button><button data-models-action="reset">Reset</button></div>
          <div data-models-panel="ladder">
            <div class="models-chips" aria-label="Damping centre presets"><button data-models-set='{"ladderCentre":0.5}'>c = ½</button><button data-models-set='{"ladderCentre":1}'>c = 1</button><button data-models-set='{"ladderCentre":0.25}'>c = ¼</button><button data-models-set='{"ladderHeight":14.134725}'>First zero</button></div>
            ${LADDER_CONTROLS.map(slider).join('')}
            <label class="models-control"><span>Rung weight</span><select data-models-control="ladderWeight" aria-label="Rung weight"><option value="mangoldt">log p · von Mangoldt</option><option value="unit">1 · bare powers</option></select><small>log p makes the direct sum a truncation of −ζ′/ζ.</small></label>
          </div>
          <div data-models-panel="nucleus">
            <div class="models-chips" aria-label="Nucleus presets"><button data-models-set='{"nucleusZ":92,"nucleusN":146,"nucleusBeta2":0.286}'>²³⁸U</button><button data-models-set='{"nucleusZ":115,"nucleusN":146}'>Past the threshold</button><button data-models-set='{"nucleusBeta2":0}'>Spherical</button><button data-models-action="pluck">Pluck again</button></div>
            ${NUCLEUS_CONTROLS.map(slider).join('')}
            <label class="models-control"><span>Plucked mode</span><select data-models-control="nucleusPluck" aria-label="Plucked multipole"><option value="2">λ = 2 · quadrupole</option><option value="3">λ = 3 · octupole</option><option value="4">λ = 4 · hexadecapole</option><option value="5">λ = 5</option><option value="6">λ = 6</option></select><small>The surface is displaced in this multipole and released.</small></label>
          </div>
        </aside>
        <div class="models-stage">
          <div class="models-hero"><canvas data-models-canvas="hero"></canvas><span class="models-status" data-models="status" role="status"></span></div>
          <dl class="models-readouts" data-models="readouts"></dl>
          <div class="models-grid">
            <article><div class="models-mini"><span data-models="h1"></span><span data-models="t1"></span></div><canvas data-models-canvas="a"></canvas><p data-models="c1"></p></article>
            <article><div class="models-mini"><span data-models="h2"></span><span data-models="t2"></span></div><canvas data-models-canvas="b"></canvas><p data-models="c2"></p></article>
            <article><div class="models-mini"><span data-models="h3"></span><span data-models="t3"></span></div><canvas data-models-canvas="c"></canvas><p data-models="c3"></p></article>
            <article data-models="fourth"><div class="models-mini"><span data-models="h4"></span><span data-models="t4"></span></div><canvas data-models-canvas="d"></canvas><p data-models="c4"></p></article>
          </div>
          <p class="models-note" data-models="note"></p>
        </div>
      </div>`;
    this.el=name=>container.querySelector(`[data-models="${name}"]`);
    this.canvas=name=>container.querySelector(`[data-models-canvas="${name}"]`);
    container.addEventListener('input',event=>this.onInput(event));
    container.addEventListener('change',event=>this.onInput(event));
    container.addEventListener('click',event=>this.onClick(event));
    this.pointer=event=>this.onPointer(event);
    for(const name of ['b','c'])this.canvas(name).addEventListener('pointerdown',this.pointer);
    this.frame=this.frame.bind(this);
    if(view?.ResizeObserver){this.resizeObserver=new view.ResizeObserver(()=>this.draw());this.resizeObserver.observe(container);}
  }

  // ---- application interface ----------------------------------------------
  update(state){
    const previous=this.mode;this.state=state;this.mode=state.modelsMode;
    const active=this.mode!=='off';
    this.container.hidden=!active;
    if(!active){this.stop();return;}
    if(previous!==this.mode){this.describe();this.clock=0;this.playing=!this.reducedMotion;}
    if(!this.playing||previous!==this.mode||Math.abs(state.ladderHeight-this.committedHeight)>1e-9)this.height=state.ladderHeight;
    this.committedHeight=state.ladderHeight;
    const key=JSON.stringify(nucleusInput(state));
    if(key!==this.nucleusKey){this.nucleusKey=key;this.clock=0;}
    this.syncControls();this.draw();
    if(this.playing)this.start();
  }
  pause(){if(this.playing){this.playing=false;this.commitHeight();this.syncControls();}this.stop();}
  togglePlay(){this.playing=!this.playing;if(this.playing)this.start();else{this.stop();this.commitHeight();}this.syncControls();}
  destroy(){this.stop();this.resizeObserver?.disconnect();}
  redraw(){this.draw();}

  // ---- events ----------------------------------------------------------------
  commitHeight(){
    if(this.mode!=='ladder'||!this.state)return;
    const [lo,hi]=MODELS_LIMITS.ladderHeight,value=clamp(Math.round(this.height*100)/100,lo,hi);
    if(Math.abs(value-this.state.ladderHeight)>1e-9)this.onChange({ladderHeight:value});
  }
  onInput(event){
    const key=event.target?.dataset?.modelsControl;if(!key)return;
    const raw=event.target.value,value=event.target.tagName==='SELECT'&&key==='ladderWeight'?raw:Number(raw);
    if(key==='ladderHeight')this.height=value;
    this.onChange({[key]:value},{mode:event.type==='change'?'push':'replace'});
  }
  onClick(event){
    const button=event.target?.closest?.('button');if(!button||!this.container.contains(button))return;
    const {modelsMode,modelsAction,modelsSet}=button.dataset;
    if(modelsMode&&modelsMode!==this.mode){this.onPreset(modelsMode==='ladder'?'twinLadder':'uranium238');return;}
    if(modelsSet){const patch=JSON.parse(modelsSet);if('ladderHeight'in patch)this.height=patch.ladderHeight;this.clock=0;this.onChange(patch,{mode:'push'});return;}
    if(modelsAction==='play')this.togglePlay();
    else if(modelsAction==='pluck'){this.clock=0;this.draw();}
    else if(modelsAction==='reset'){this.clock=0;this.onPreset(this.mode==='ladder'?'twinLadder':'uranium238');}
  }
  /** Drag on the height scan to set T, on the balance plot to set c. */
  onPointer(event){
    if(this.mode!=='ladder')return;
    const canvas=event.currentTarget,isScan=canvas===this.canvas('b');
    const apply=e=>{
      const box=canvas.getBoundingClientRect(),u=clamp((e.clientX-box.left-34)/(box.width-46),0,1);
      if(isScan){const [lo,hi]=MODELS_LIMITS.ladderHeight;this.height=lo+u*(hi-lo);this.onChange({ladderHeight:Math.round(this.height*100)/100});}
      else this.onChange({ladderCentre:Math.round(u*200)/200});
    };
    apply(event);canvas.setPointerCapture?.(event.pointerId);
    const move=e=>apply(e),up=()=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);};
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  }

  // ---- clock -----------------------------------------------------------------
  start(){if(!this.raf&&this.view?.requestAnimationFrame){this.last=0;this.raf=this.view.requestAnimationFrame(this.frame);}}
  stop(){if(this.raf)this.view?.cancelAnimationFrame?.(this.raf);this.raf=0;}
  frame(now){
    this.raf=0;if(!this.playing||this.mode==='off'||this.container.hidden)return;
    const dt=this.last?Math.min(.1,(now-this.last)/1000):0;this.last=now;this.advance(dt);this.draw();
    this.raf=this.view.requestAnimationFrame(this.frame);
  }
  /** Advance the local clocks by dt seconds of display time. */
  advance(dt){
    if(this.mode==='ladder'){
      const [lo,hi]=MODELS_LIMITS.ladderHeight;this.height+=dt*this.state.ladderSpeed;
      if(this.height>hi)this.height=lo;
      const input=this.container.querySelector('[data-models-control="ladderHeight"]'),out=this.container.querySelector('[data-models-out="ladderHeight"]');
      if(input)input.value=this.height;if(out)out.textContent=fmt(this.height,2);
    }else{
      this.clock+=dt*2*this.state.nucleusSpeed;this.spin+=dt*.22;
    }
  }

  // ---- text ------------------------------------------------------------------
  describe(){
    const ladder=this.mode==='ladder',set=(name,text)=>{this.el(name).textContent=text;};
    set('eyebrow',ladder?'FINITE MODEL · PRIME LADDERS':'COLLECTIVE MODEL · LIQUID DROP');
    set('title',ladder?'Two ladders, one bridge.':'Which oscillations hold the nucleus together?');
    set('lede',ladder
      ?'Every prime carries a ladder of rungs at log-lengths m·log p. The direct arm is damped at c + a and the dual arm at c − a. Move the damping centre and watch the two arms, their packets and the bridge between them.'
      :'A heavy nucleus rings like a charged liquid drop. Surface tension restores each ripple; electric repulsion works against it. Add protons until the quadrupole gives way, and couple the modes to see stability change.');
    const heads=ladder
      ?[['PHASOR WALKS','TIP TO TAIL'],['HEIGHT SCAN','DRAG TO SET T'],['BRIDGE BALANCE','DRAG TO SET c'],['','']]
      :[['MODE STIFFNESS','SURFACE − COULOMB'],['MODE AMPLITUDES','AFTER THE PLUCK'],['ROTATIONAL LADDER','MEASURED vs RIGID ROTOR'],['LEVEL REPULSION','CUMULATIVE SPACINGS']];
    const captions=ladder
      ?['Each rung is an arrow of length its amplitude; the arm sum is where the chain ends. Cyan: direct. Amber: dual.',
        'Magnitude of the two finite arm sums along the height axis. Ticks mark the first zeros of ζ for reference; the finite sums are not ζ.',
        'Green: the completed bridge of ξ, exactly zero at c = ½ for every a and T. Violet: the bare finite arms, which have no balanced centre.','']
      :['Bars up: surface tension. Bars down: Coulomb repulsion. The dot is the net stiffness C; a mode with C below zero is unstable. Numbers: uncoupled ħω in MeV.',
        'Amplitude of each multipole after the pluck. Coupling passes the motion between modes of the same parity.',
        'Measured ground-band levels of ²³⁸U beside a rigid rotor fixed by the 2⁺ level. A ladder of a different kind: its rungs follow J(J+1).',
        this.spacingCaption()];
    heads.forEach(([h,t],i)=>{set('h'+(i+1),h);set('t'+(i+1),t);set('c'+(i+1),captions[i]);});
    this.el('fourth').hidden=ladder;
    set('note',ladder
      ?'Finite experiment. With log p weights the direct sum truncates −ζ′/ζ(σ + iT), which converges only for σ > 1; at c = ½ it is a model, not ζ. The balance at c = ½ belongs to the completed function ξ through |ξ(s)| = |ξ(1 − s̄)|. Nothing here tests or proves the Riemann hypothesis.'
      :'Textbook liquid-drop model, not a many-body calculation. Shell structure, pairing and rotation are absent; liquid-drop energies overshoot observed band heads; the coupling κ and the width Γ are illustrative. Measured values are quoted with their sources in Methods. The comparison with ζ is the shared statistics of level repulsion and nothing more.');
    for(const panel of this.container.querySelectorAll('[data-models-panel]'))panel.hidden=panel.dataset.modelsPanel!==this.mode;
    for(const tab of this.container.querySelectorAll('[data-models-mode]')){const on=tab.dataset.modelsMode===this.mode;tab.classList.toggle('active',on);tab.setAttribute('aria-selected',String(on));}
    this.canvas('hero').setAttribute('aria-label',ladder?'Twin prime ladders with rung phasors, packet envelopes and the bridge between the arms':'Nucleons of the model nucleus following the oscillating liquid-drop surface');
    this.canvas('hero').setAttribute('role','img');
  }
  syncControls(){
    const s=this.state;if(!s)return;
    for(const input of this.container.querySelectorAll('[data-models-control]')){
      const key=input.dataset.modelsControl,value=key==='ladderHeight'?this.height:s[key];
      if(this.container.ownerDocument?.activeElement!==input||input.tagName==='SELECT')input.value=String(value);
    }
    for(const out of this.container.querySelectorAll('[data-models-out]')){
      const key=out.dataset.modelsOut,spec=[...LADDER_CONTROLS,...NUCLEUS_CONTROLS].find(c=>c.key===key);
      out.textContent=fmt(key==='ladderHeight'?this.height:s[key],spec?.digits??2);
    }
    const play=this.container.querySelector('[data-models-action="play"]');
    play.textContent=this.playing?'Pause':'Play';play.setAttribute('aria-pressed',String(this.playing));
  }
  spacingCaption(){
    const ks=sample=>['goe','gue','poisson'].map(name=>`${name==='poisson'?'Poisson':name.toUpperCase()} ${fmt(ksDistance(sample,SPACING_LAWS[name]),2)}`).join(', ');
    const resonances=uniformSpacings(U238_DATA.resonances),zeros=zeroSpacings(ZERO_HEIGHTS);
    return `Neutron resonances of ²³⁸U and unfolded zeros of ζ both avoid small gaps. Dashed: Wigner surmises for GOE and GUE; dotted: Poisson. Largest distance to each law: ²³⁸U (${resonances.length} gaps) ${ks(resonances)}; ζ (${zeros.length} gaps) ${ks(zeros)}. Samples this small cannot tell GOE from GUE.`;
  }
  readouts(rows){
    this.el('readouts').innerHTML=rows.map(([name,value,tone])=>`<div${tone?` data-tone="${tone}"`:''}><dt>${name}</dt><dd>${value}</dd></div>`).join('');
  }

  // ---- drawing ---------------------------------------------------------------
  draw(){
    if(!this.state||this.mode==='off'||this.container.hidden)return;
    if(this.mode==='ladder')this.drawLadder();else this.drawNucleus();
  }

  drawLadder(){
    const s=this.state,input=ladderInput(s),cfg=ladderConfig(input),rungs=ladderRungs(input),T=this.height;
    const damping=armDamping(input);
    // Fixed reference scales: the same ladder at c = ½, a = 0 without thermal
    // weights, so changing the damping visibly shrinks or grows the arms.
    const refKey=[cfg.primes,cfg.rungs,cfg.weight,cfg.width].join(',');
    if(this.cache.refKey!==refKey){
      const ref=ladderRungs({...input,centre:.5,offset:0,beta:0,pressure:0});
      const L=Math.min(8,Math.max(3,ref[ref.length-1].ell+.6));let packet=1e-12;
      for(let i=0;i<=240;i++)packet=Math.max(packet,packetValue(ref,L*i/240,0,'direct',cfg.width).abs);
      this.cache={...this.cache,refKey,L,rung:Math.max(...ref.map(r=>r.direct)),packet,total:ref.reduce((a,r)=>a+r.direct,0)};
    }
    const scanKey=JSON.stringify(input);
    if(this.cache.scanKey!==scanKey){
      const [lo,hi]=MODELS_LIMITS.ladderHeight;
      this.cache.scanKey=scanKey;this.cache.scan={direct:heightScan(rungs,'direct',lo,hi,540),dual:heightScan(rungs,'dual',lo,hi,540)};
    }
    const direct=armSum(rungs,T,'direct'),dual=armSum(rungs,T,'dual');
    const xiBridge=bridgeBalance(evaluateXi,cfg.centre,cfg.offset,T),finite=finiteBalance(rungs,T);
    let nearest=ZERO_HEIGHTS[0];for(const z of ZERO_HEIGHTS)if(Math.abs(z-T)<Math.abs(nearest-T))nearest=z;
    this.ladderHero(rungs,cfg,damping,T);
    this.ladderWalks(rungs,T,direct,dual);
    this.ladderScan(T);
    this.ladderBalance(input,cfg,T,xiBridge,finite);
    const balanced=Math.abs(cfg.centre-.5)<1e-9;
    this.el('status').textContent=balanced?'c = ½ · ξ bridge balanced':`c = ${fmt(cfg.centre,3)} · ξ bridge tilted`;
    this.el('status').dataset.tone=balanced?'good':'caution';
    this.readouts([
      ['Direct damping σ₊ = c + a',fmt(damping.direct,3)],['Dual damping σ₋ = c − a',fmt(damping.dual,3)],
      ['|direct sum|',sig(direct.abs,4)],['|dual sum|',sig(dual.abs,4)],
      ['Finite arm balance',fmt(finite,4)],['Completed ξ bridge',Number.isFinite(xiBridge)?fmt(xiBridge,4):'outside the evaluated domain',balanced?'good':''],
      ['Nearest ζ zero',`${fmt(nearest,4)} · ${fmt(T-nearest,2)} away`],['Rungs summed',String(rungs.length)],
    ]);
  }

  ladderHero(rungs,cfg,damping,T){
    const {ctx,w,h}=surface(this.canvas('hero')),{L,rung:refRung,packet:refPacket}=this.cache;
    const left=18,right=18,cy=h/2,gap=Math.max(15,h*.045),arm=h/2-gap-44,unit=.46,cap=2.15;
    const X=ell=>left+ell/L*(w-left-right);
    // log-length grid
    for(let ell=0;ell<=L;ell++){line(ctx,X(ell),24,X(ell),h-20,C.grid,1);if(X(ell)<w-right-(w<640?16:150))label(ctx,String(ell),X(ell),h-7,{color:C.dim,size:9,align:'center'});}
    label(ctx,w<640?'ℓ':'log-length ℓ = m · log p',w-right,h-7,{color:C.dim,size:9,align:'right'});
    // bridge deck
    ctx.fillStyle='rgba(215,247,173,.07)';ctx.fillRect(left,cy-gap,w-left-right,2*gap);
    line(ctx,left,cy,w-right,cy,C.bridge,1,[5,5]);
    const sides=[['direct',-1,C.direct],['dual',1,C.dual]];
    for(const [name,dir,color] of sides){
      const base=cy+dir*gap;
      // packet envelope and its real part
      const n=Math.min(480,Math.round(w/2)),env=[],real=[];
      for(let i=0;i<=n;i++){const v=packetValue(rungs,L*i/n,T,name,cfg.width);env.push(v.abs/refPacket);real.push(v.re/refPacket);}
      const Y=v=>base+dir*clamp(v,-cap,cap)*arm*unit;
      const fill=ctx.createLinearGradient(0,base,0,base+dir*arm);fill.addColorStop(0,color+'08');fill.addColorStop(1,color+'40');
      ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(X(0),base);for(let i=0;i<=n;i++)ctx.lineTo(X(L*i/n),Y(env[i]));ctx.lineTo(X(L),base);ctx.closePath();ctx.fill();
      ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=n;i++){const x=X(L*i/n),y=Y(env[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      ctx.strokeStyle=color+'70';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=n;i++){const x=X(L*i/n),y=Y(Math.abs(real[i]));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      line(ctx,left,base,w-right,base,color+'90',1);
      // rungs with phasors
      for(const r of rungs){
        if(r.ell>L)break;
        const x=X(r.ell),norm=r[name]/refRung,len=clamp(norm,0,cap)*arm*unit,tip=base+dir*len,alpha=r.m===1?1:.6;
        ctx.globalAlpha=alpha;line(ctx,x,base,x,tip,color,r.m===1?2:1.2);
        const radius=3+5*Math.sqrt(clamp(norm,0,2.5)),phase=(name==='dual'?1:-1)*T*r.ell;
        ctx.fillStyle='#0b111b';ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,tip,radius,0,TAU);ctx.fill();ctx.stroke();
        line(ctx,x,tip,x+radius*Math.cos(phase),tip-radius*Math.sin(phase),'#f2f6fb',1.4);
        if(norm>cap)label(ctx,'▲',x,tip+dir*-4,{color,size:7,align:'center'});
        ctx.globalAlpha=1;
      }
      const sigma=name==='direct'?damping.direct:damping.dual;
      label(ctx,`${name.toUpperCase()} ARM · σ${name==='direct'?'₊':'₋'} = ${fmt(sigma,3)}${w<640?'':` · turns as e^${name==='direct'?'−':'+'}iTℓ`}`,left+6,dir<0?16:h-24,{color,size:10});
    }
    // bridge links and prime labels
    for(const r of rungs){
      if(r.ell>L)break;
      const x=X(r.ell),strength=clamp(Math.sqrt(r.direct*r.dual)/refRung,0,1);
      ctx.globalAlpha=.2+.8*strength;line(ctx,x,cy-gap,x,cy+gap,C.bridge,1+2*strength);ctx.globalAlpha=1;
      if(r.m===1&&(rungs.length<=40||r.p<30))label(ctx,String(r.p),x+4,cy+3,{color:'#cfe6b2',size:9});
    }
    const narrow=w<640,hidden=rungs.filter(r=>r.ell>L).length;
    if(narrow)label(ctx,`BRIDGE c = ${fmt(cfg.centre,3)} · 2a = ${fmt(2*cfg.offset,3)} · T = ${fmt(T,2)}`,left+6,h-38,{color:C.bridge,size:10});
    else label(ctx,`BRIDGE · centre c = ${fmt(cfg.centre,3)} · width 2a = ${fmt(2*cfg.offset,3)} · T = ${fmt(T,2)}`,w-right-6,h-24,{color:C.bridge,size:10,align:'right'});
    if(hidden)label(ctx,`${hidden} longer rungs summed, not drawn`,w-right-6,narrow?h-52:h-38,{color:C.dim,size:9,align:'right'});
  }

  ladderWalks(rungs,T,direct,dual){
    const {ctx,w,h}=surface(this.canvas('a')),cx=w/2,cy=h/2;
    const walks=[['direct',C.direct,armWalk(rungs,T,'direct')],['dual',C.dual,armWalk(rungs,T,'dual')]];
    let extent=1e-9;for(const [,,points] of walks)for(const p of points)extent=Math.max(extent,Math.hypot(p.re,p.im));
    // Smooth the scale so the picture does not pump while the walk turns.
    this.cache.walkExtent=this.cache.walkExtent?Math.max(extent,this.cache.walkExtent*.985):extent;
    const scale=(Math.min(w,h)/2-16)/this.cache.walkExtent;
    line(ctx,8,cy,w-8,cy,C.grid);line(ctx,cx,8,cx,h-8,C.grid);
    const ring=10**Math.floor(Math.log10(this.cache.walkExtent));
    ctx.strokeStyle=C.axis;ctx.setLineDash([3,4]);ctx.beginPath();ctx.arc(cx,cy,ring*scale,0,TAU);ctx.stroke();ctx.setLineDash([]);
    label(ctx,`|z| = ${ring}`,cx+ring*scale*.71+4,cy-ring*scale*.71,{color:C.dim,size:8});
    for(const [,color,points] of walks){
      ctx.strokeStyle=color;ctx.lineWidth=1.3;ctx.beginPath();
      points.forEach((p,i)=>{const x=cx+p.re*scale,y=cy-p.im*scale;i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
      const end=points[points.length-1];ctx.fillStyle=color;ctx.beginPath();ctx.arc(cx+end.re*scale,cy-end.im*scale,3.5,0,TAU);ctx.fill();
    }
    label(ctx,`|D₊| = ${sig(direct.abs,3)}`,10,h-22,{color:C.direct,size:9});label(ctx,`|D₋| = ${sig(dual.abs,3)}`,10,h-9,{color:C.dual,size:9});
  }

  ladderScan(T){
    const {ctx,w,h}=surface(this.canvas('b')),[lo,hi]=MODELS_LIMITS.ladderHeight,{direct,dual}=this.cache.scan;
    const left=34,right=12,top=16,bottom=22,X=t=>left+(t-lo)/(hi-lo)*(w-left-right);
    // Scale to the oscillating part: at T = 0 every rung is aligned, and that
    // single spike would flatten the rest of the scan.
    let max=1e-12;for(let i=Math.ceil(direct.length*4/(hi-lo));i<direct.length;i++)max=Math.max(max,direct[i],dual[i]);
    const Y=v=>h-bottom-Math.min(v/max,1.06)*(h-top-bottom);
    line(ctx,left,h-bottom,w-right,h-bottom,C.axis);line(ctx,left,top,left,h-bottom,C.axis);
    for(const z of ZERO_HEIGHTS)if(z<=hi)line(ctx,X(z),top,X(z),top+7,'#cfe6b2',1);
    label(ctx,'ζ zeros',left+2,top-4,{color:'#cfe6b2',size:8});
    for(const [values,color] of [[dual,C.dual],[direct,C.direct]]){
      ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();
      for(let i=0;i<values.length;i++){const x=X(lo+(hi-lo)*i/(values.length-1)),y=Y(values[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
    }
    line(ctx,X(T),top,X(T),h-bottom,'#e6eaf0',1);
    for(let t=0;t<=hi;t+=15)label(ctx,String(t),X(t),h-8,{color:C.dim,size:8,align:'center'});
    label(ctx,sig(max,2),left-4,top+8,{color:C.dim,size:8,align:'right'});label(ctx,'0',left-4,h-bottom,{color:C.dim,size:8,align:'right'});
    label(ctx,'T',w-right,h-8,{color:C.dim,size:8,align:'right'});
  }

  ladderBalance(input,cfg,T,xiBridge,finite){
    const {ctx,w,h}=surface(this.canvas('c')),left=34,right=12,top=14,bottom=22;
    const X=c=>left+c*(w-left-right),Y=v=>top+(1-v)/2*(h-top-bottom);
    line(ctx,left,Y(0),w-right,Y(0),C.axis);line(ctx,left,top,left,h-bottom,C.axis);
    line(ctx,X(.5),top,X(.5),h-bottom,C.bridge,1,[3,4]);label(ctx,'c = ½',X(.5)+4,top+8,{color:C.bridge,size:8});
    const n=80,xi=[],bare=[];
    for(let i=0;i<=n;i++){const c=i/n;xi.push(bridgeBalance(evaluateXi,c,cfg.offset,T));bare.push(finiteBalance(ladderRungs({...input,centre:c}),T));}
    for(const [values,color,width] of [[bare,C.finite,1.2],[xi,C.bridge,1.8]]){
      ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();let pen=false;
      values.forEach((v,i)=>{if(!Number.isFinite(v)){pen=false;return;}const x=X(i/n),y=Y(v);pen?ctx.lineTo(x,y):ctx.moveTo(x,y);pen=true;});ctx.stroke();
    }
    const c=clamp(cfg.centre,0,1);line(ctx,X(c),top,X(c),h-bottom,'#e6eaf0',1);
    if(cfg.centre<=1){
      if(Number.isFinite(xiBridge)){ctx.fillStyle=C.bridge;ctx.beginPath();ctx.arc(X(c),Y(xiBridge),4,0,TAU);ctx.fill();}
      if(Number.isFinite(finite)){ctx.fillStyle=C.finite;ctx.beginPath();ctx.arc(X(c),Y(finite),3,0,TAU);ctx.fill();}
    }else label(ctx,'c beyond 1 →',w-right,top+8,{color:'#e6eaf0',size:8,align:'right'});
    for(const [v,text] of [[1,'+1'],[0,'0'],[-1,'−1']])label(ctx,text,left-4,Y(v)+3,{color:C.dim,size:8,align:'right'});
    for(const c0 of [0,.25,.75,1])label(ctx,String(c0),X(c0),h-8,{color:C.dim,size:8,align:'center'});
    label(ctx,'ξ bridge',w-right,h-bottom-16,{color:C.bridge,size:8,align:'right'});label(ctx,'bare arms',w-right,h-bottom-5,{color:C.finite,size:8,align:'right'});
  }

  // ---- nucleus ---------------------------------------------------------------
  drawNucleus(){
    const s=this.state,modes=coupledModes(nucleusInput(s)),cfg=modes.config;
    // Restart the pluck once it has rung down or run away.
    const period=TAU/Math.max(.2,modes.parts[0].energy);let t=this.clock;
    const amplitudes=amplitudesAt(modes,t),peak=Math.max(...amplitudes.map(Math.abs));
    const decayed=cfg.width>0&&Math.exp(-cfg.width*t/2)<.04,ranAway=peak>.55;
    if((decayed||ranAway)&&this.playing){this.holdUntil??=t+period*.35;if(t>this.holdUntil){this.clock=0;this.holdUntil=undefined;}}
    else this.holdUntil=undefined;
    const shown=amplitudes.map(a=>clamp(a,-.6,.6));
    this.nucleusHero(modes,shown,ranAway);
    this.nucleusStiffness(modes);
    this.nucleusTraces(modes,t);
    this.nucleusBand();
    this.nucleusSpacings();
    const lowest=modes.normal[0],zs=DROP.hbar*1e21;
    this.el('status').textContent=modes.stable?'All coupled modes stable':'Unstable mode · the drop gives way';
    this.el('status').dataset.tone=modes.stable?'good':'bad';
    this.readouts([
      ['Nucleons A = Z + N',`${modes.A} · Z = ${cfg.Z}, N = ${cfg.N}`],['Radius R₀',`${fmt(modes.R0,2)} fm`],
      ['Surface energy Eₛ',`${fmt(modes.Es,0)} MeV`],['Coulomb energy E꜀',`${fmt(modes.Ec,0)} MeV`],
      ['Fissility x = E꜀ / 2Eₛ',fmt(modes.fissility,3),modes.fissility<1?'good':'bad'],['Z² / A · threshold',`${fmt(modes.z2a,2)} · ${fmt(modes.criticalZ2A,1)}`],
      ['Lowest coupled mode',lowest.stable?`ħω = ${fmt(lowest.energy,3)} MeV`:`grows at ${fmt(lowest.energy,3)} MeV/ħ`,lowest.stable?'':'bad'],
      ['Model time',`${fmt(t*zs,2)} zs`],
    ]);
  }

  nucleons(Z,N){
    const key=Z+','+N;if(this.cache.nucleonKey===key)return this.cache.nucleons;
    const A=Z+N,order=Array.from({length:A},(_,i)=>i).sort((i,j)=>frac(i*.6180339887)-frac(j*.6180339887));
    const proton=new Uint8Array(A);for(let k=0;k<Z;k++)proton[order[k]]=1;
    const points=[];
    for(let i=0;i<A;i++){
      const r=Math.cbrt((i+.5)/A),cosT=1-2*frac((i+.5)*.7548776662),phi=TAU*frac((i+.5)*.5698402910);
      points.push({r,cosT,sinT:Math.sqrt(1-cosT*cosT),phi,proton:proton[i],wobble:TAU*frac(i*.3819660113)});
    }
    this.cache.nucleonKey=key;this.cache.nucleons=points;return points;
  }
  sprite(color){
    this.cache.sprites??={};if(this.cache.sprites[color])return this.cache.sprites[color];
    const canvas=this.container.ownerDocument.createElement('canvas');canvas.width=canvas.height=64;
    const ctx=canvas.getContext('2d'),g=ctx.createRadialGradient(24,22,2,32,32,31);
    g.addColorStop(0,'#ffffff');g.addColorStop(.22,color);g.addColorStop(1,'#0b111b');
    ctx.fillStyle=g;ctx.beginPath();ctx.arc(32,32,31,0,TAU);ctx.fill();
    this.cache.sprites[color]=canvas;return canvas;
  }
  nucleusHero(modes,amplitudes,ranAway){
    const {ctx,w,h}=surface(this.canvas('hero')),cfg=modes.config,profile=shapeProfile(cfg.beta2,amplitudes,96);
    const cx=w/2,cy=h/2,scale=Math.min(w,h)/2/1.95,tilt=.42,spin=this.spin;
    const cosTilt=Math.cos(tilt),sinTilt=Math.sin(tilt),radius=theta=>{const u=theta/Math.PI*96,i=Math.min(95,Math.floor(u));return profile[i]+(profile[i+1]-profile[i])*(u-i);};
    // reference sphere and symmetry axis
    ctx.strokeStyle=C.axis;ctx.setLineDash([4,5]);ctx.beginPath();ctx.arc(cx,cy,scale,0,TAU);ctx.stroke();ctx.setLineDash([]);
    line(ctx,cx-sinTilt*scale*1.75,cy-cosTilt*scale*1.75,cx+sinTilt*scale*1.75,cy+cosTilt*scale*1.75,C.grid,1);
    const size=scale*1.12/Math.cbrt(modes.A),drawn=[];
    for(const p of this.nucleons(cfg.Z,cfg.N)){
      const theta=Math.acos(p.cosT),rr=p.r*radius(theta)*(1+.012*Math.sin(this.clock*1.7+p.wobble));
      const phi=p.phi+spin,x0=rr*p.sinT*Math.cos(phi),z0=rr*p.sinT*Math.sin(phi),y0=rr*p.cosT;
      // tilt the symmetry axis toward the viewer's right
      drawn.push({x:x0*cosTilt+y0*sinTilt,y:-x0*sinTilt+y0*cosTilt,z:z0,proton:p.proton});
    }
    drawn.sort((a,b)=>a.z-b.z);
    const protons=this.sprite(C.proton),neutrons=this.sprite(C.neutron);
    for(const d of drawn){
      const depth=clamp((d.z+1.4)/2.8,0,1),px=cx+d.x*scale,py=cy-d.y*scale,r=size*(.9+.2*depth);
      ctx.drawImage(d.proton?protons:neutrons,px-r,py-r,2*r,2*r);
      ctx.fillStyle=`rgba(8,13,22,${(.62*(1-depth)).toFixed(3)})`;ctx.beginPath();ctx.arc(px,py,r,0,TAU);ctx.fill();
    }
    // scale bar and legend
    const fm=scale/modes.R0,bar=5*fm;line(ctx,18,h-18,18+bar,h-18,'#e6eaf0',2);label(ctx,'5 fm',18+bar+6,h-14,{color:C.text,size:10});
    label(ctx,'● protons',w-18,h-28,{color:C.proton,size:10,align:'right'});label(ctx,'● neutrons',w-18,h-14,{color:C.neutron,size:10,align:'right'});
    label(ctx,w<640?'dashed: equal-volume sphere':'dashed: sphere of equal volume · line: symmetry axis',18,w<640?h-36:18,{color:C.dim,size:9});
    if(ranAway)label(ctx,'linear theory has left its range · restarting',w/2,h-14,{color:C.bad,size:10,align:'center'});
  }

  nucleusStiffness(modes){
    const {ctx,w,h}=surface(this.canvas('a')),left=14,right=10,top=14,bottom=34,n=modes.parts.length;
    const max=Math.max(...modes.parts.map(p=>Math.max(p.surface,-p.coulomb)));
    const zero=top+(h-top-bottom)*.62,up=(zero-top)/max,down=(h-bottom-zero)/max*1.6,step=(w-left-right)/n;
    line(ctx,left,zero,w-right,zero,C.axis);
    modes.parts.forEach((p,i)=>{
      const x=left+step*(i+.5),bw=Math.min(26,step*.34);
      ctx.fillStyle=C.surface+'cc';ctx.fillRect(x-bw-1,zero-p.surface*up,bw,p.surface*up);
      ctx.fillStyle=C.coulomb+'cc';ctx.fillRect(x+1,zero,bw,Math.min(-p.coulomb*down,h-bottom-zero));
      const y=p.C>=0?zero-p.C*up:zero+Math.min(-p.C*down,h-bottom-zero);
      ctx.fillStyle=p.C>=0?'#f2f6fb':C.bad;ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();
      label(ctx,`λ = ${p.lambda}`,x,h-bottom+13,{color:MODE_COLORS[i],size:9,align:'center'});
      label(ctx,p.stable?fmt(p.energy,2):'unstable',x,h-bottom+25,{color:p.stable?C.dim:C.bad,size:8,align:'center'});
    });
    label(ctx,'surface',left,top+2,{color:C.surface,size:8});label(ctx,'Coulomb',left+50,top+2,{color:C.coulomb,size:8});label(ctx,'● net C',left+104,top+2,{color:'#f2f6fb',size:8});
  }

  nucleusTraces(modes,tNow){
    const {ctx,w,h}=surface(this.canvas('b')),left=30,right=10,top=12,bottom=20,span=24,t0=Math.max(0,tNow-span);
    const X=t=>left+(t-t0)/span*(w-left-right),Y=a=>top+(1-clamp(a/.16,-1.15,1.15))/2*(h-top-bottom);
    line(ctx,left,Y(0),w-right,Y(0),C.axis);line(ctx,left,top,left,h-bottom,C.axis);
    const n=220,series=MODES.map(()=>[]);
    for(let i=0;i<=n;i++){const t=t0+(tNow-t0)*i/n,a=amplitudesAt(modes,t);a.forEach((v,k)=>series[k].push([t,v]));}
    series.forEach((points,k)=>{
      ctx.strokeStyle=MODE_COLORS[k];ctx.lineWidth=k===MODES.indexOf(modes.config.pluck)?1.8:1.1;ctx.beginPath();
      points.forEach(([t,v],i)=>{const x=X(t),y=Y(v);i?ctx.lineTo(x,y):ctx.moveTo(x,y);});ctx.stroke();
      label(ctx,`λ${MODES[k]}`,left+6+k*26,top+8,{color:MODE_COLORS[k],size:8});
    });
    label(ctx,'a',left-6,top+8,{color:C.dim,size:8,align:'right'});label(ctx,'0',left-6,Y(0)+3,{color:C.dim,size:8,align:'right'});
    const zs=DROP.hbar*1e21;label(ctx,`${fmt(t0*zs,1)} zs`,left,h-6,{color:C.dim,size:8});label(ctx,`${fmt((t0+span)*zs,1)} zs`,w-right,h-6,{color:C.dim,size:8,align:'right'});
  }

  nucleusBand(){
    const {ctx,w,h}=surface(this.canvas('c')),band=U238_DATA.groundBand,left=30,right=10,top=14,bottom=16;
    const max=band[band.length-1].energy*1.04,Y=e=>h-bottom-e/max*(h-top-bottom),e2=band[0].energy;
    const mid=(left+w-right)/2,m0=left+4,m1=mid-22,r0=mid+22,r1=w-right-4;
    label(ctx,'measured',(m0+m1)/2,top-3,{color:C.direct,size:8,align:'center'});label(ctx,'rigid rotor',(r0+r1)/2,top-3,{color:C.dual,size:8,align:'center'});
    line(ctx,m0,Y(0),m1,Y(0),C.direct,1.5);line(ctx,r0,Y(0),r1,Y(0),C.dual,1.5);label(ctx,'0⁺',mid,Y(0)+3,{color:C.text,size:8,align:'center'});
    let lastLabel=Y(0);
    for(const level of band){
      const rotor=rotorEnergy(level.J,e2),room=lastLabel-Y(level.energy)>=10;if(room)lastLabel=Y(level.energy);
      line(ctx,m0,Y(level.energy),m1,Y(level.energy),C.direct,1.5);
      if(rotor<=max){line(ctx,r0,Y(rotor),r1,Y(rotor),C.dual,1.5);line(ctx,m1,Y(level.energy),r0,Y(rotor),C.axis,1,[2,3]);}
      if(room){label(ctx,`${level.J}⁺`,mid,Y(level.energy)+3,{color:C.text,size:8,align:'center'});
        label(ctx,fmt(level.energy,0),left-2,Y(level.energy)+3,{color:C.dim,size:7,align:'right'});}
    }
    label(ctx,'keV',left-2,top-3,{color:C.dim,size:7,align:'right'});
  }

  nucleusSpacings(){
    const {ctx,w,h}=surface(this.canvas('d')),left=26,right=10,top=12,bottom=20,sMax=3;
    const X=s=>left+s/sMax*(w-left-right),Y=f=>h-bottom-f*(h-top-bottom);
    line(ctx,left,h-bottom,w-right,h-bottom,C.axis);line(ctx,left,top,left,h-bottom,C.axis);
    const laws=[['poisson',C.dim,[2,4]],['goe',C.direct,[5,3]],['gue',C.dual,[5,3]]];
    for(const [name,color,dash] of laws){
      ctx.save();ctx.strokeStyle=color;ctx.lineWidth=1;ctx.setLineDash(dash);ctx.beginPath();
      for(let i=0;i<=120;i++){const s=sMax*i/120,x=X(s),y=Y(SPACING_LAWS[name](s));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
    }
    this.cache.spacings??={resonances:U238_DATA.resonances.length>2?uniformSpacings(U238_DATA.resonances):[],zeros:zeroSpacings(ZERO_HEIGHTS)};
    const sets=[[this.cache.spacings.resonances,C.direct],[this.cache.spacings.zeros,C.dual]];
    for(const [sample,color] of sets){
      if(!sample.length)continue;
      const sorted=[...sample].sort((a,b)=>a-b),n=sorted.length;
      ctx.strokeStyle=color;ctx.lineWidth=1.7;ctx.beginPath();ctx.moveTo(X(0),Y(0));
      sorted.forEach((s,i)=>{const x=X(Math.min(s,sMax));ctx.lineTo(x,Y(i/n));ctx.lineTo(x,Y((i+1)/n));});ctx.lineTo(X(sMax),Y(1));ctx.stroke();
    }
    label(ctx,'²³⁸U + n resonances',w-right,h-bottom-18,{color:C.direct,size:8,align:'right'});label(ctx,'ζ zeros, unfolded',w-right,h-bottom-6,{color:C.dual,size:8,align:'right'});
    for(const s of [0,1,2,3])label(ctx,String(s),X(s),h-7,{color:C.dim,size:8,align:'center'});
    label(ctx,'1',left-4,Y(1)+3,{color:C.dim,size:8,align:'right'});label(ctx,'spacing / mean',w-right,h-7,{color:C.dim,size:8,align:'right'});
  }
}
