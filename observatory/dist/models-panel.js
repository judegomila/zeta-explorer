/**
 * Workbench for the two models: the finite twin ladder and the liquid-drop
 * nucleus. All numbers come from twin-ladder-model.js and nucleus-model.js;
 * this file only draws them and forwards control changes to the application.
 * The animation clocks are local and are never written into a shared view.
 */
import { ZERO_HEIGHTS, evaluatePolar } from './math.js';
import { MODELS_LIMITS, MODELS_ENUMS, ladderInput, nucleusInput, modelsSection } from './models.js';
import { LADDER_PRIMES, ladderRungs, armDamping, armSum, armWalk, heightScan, finiteBalance, finiteBalanceCurve, bridgeBalance, ladderConfig, packetKernel, packetRow, thermalEnsemble, thermoValue, thermoGrid, THERMO_RANGE } from './twin-ladder-model.js';
import { MODES, DROP, coupledModes, amplitudesAt, shapeProfile, rotorEnergy } from './nucleus-model.js';
import { U238_DATA } from './nucleus-data.js';
import { NUCLIDES } from './nuclides-data.js';
import { C, MODE_COLORS, TAU, clamp, fmt, sig, esc, surface, label, line } from './models-draw.js';
import { SECTIONS, MODE_SECTIONS } from './models-sections.js';
import { SECTION_LINKS, sectionLinks, methodsLink } from './models-links.js';

const evaluateXi=(sigma,t)=>evaluatePolar(sigma,t,'xi',0);
const frac=x=>x-Math.floor(x);
const PRESET_OF={ladder:'twinLadder',nucleus:'uranium238',horizon:'horizonModel'};
const ANIMATED=new Set(['ladder','drop']);
const theta=beta=>beta>0?fmt(1/beta,beta<.01?0:2):'∞';
const THERMO_NAMES={logZ:'log Z',meanEll:'⟨ℓ⟩',entropy:'S',armGap:'|D₊| − |D₋|'};
/** 256-entry RGB lookup tables for the heat maps, interpolated between stops. */
function lut(stops){
  const rgb=stops.map(c=>[1,3,5].map(i=>parseInt(c.slice(i,i+2),16))),out=new Uint8Array(256*3);
  for(let i=0;i<256;i++){const u=i/255*(rgb.length-1),k=Math.min(rgb.length-2,Math.floor(u)),f=u-k;for(let j=0;j<3;j++)out[i*3+j]=Math.round(rgb[k][j]+(rgb[k+1][j]-rgb[k][j])*f);}
  return out;
}
const LUT={direct:lut(['#0a1019','#103444','#23798f','#7bdeef','#effcff']),dual:lut(['#0a1019','#382614','#8f6128','#f3b462','#fff4e2']),
  diverging:lut(['#fff4e2','#f3b462','#5c3f1d','#0a1019','#1a5464','#7bdeef','#effcff']),thermo:lut(['#0f1830','#1d3b63','#2a7486','#63b98d','#d7f7ad','#f7ffe8'])};

const LADDER_CONTROLS=[
  {key:'ladderCentre',label:'Damping centre c',digits:3,hint:'Arms sit at c ± a. ξ balances only at c = ½.'},
  {key:'ladderOffset',label:'Bridge offset a',digits:3,hint:'Half-width of the bridge between the arms.'},
  {key:'ladderHeight',label:'Height T',digits:2,hint:'Every rung turns at rate log p.'},
  {key:'ladderPrimes',label:'Primes',digits:0,hint:'Ladders p = 2, 3, 5, … up to 997 (168 primes).'},
  {key:'ladderRungs',label:'Rungs per ladder M',digits:0,hint:'Powers p, p², …, p^M.'},
  {key:'ladderWidth',label:'Packet width h',digits:2,hint:'Gaussian window in log-length.'},
  {key:'ladderBeta',label:'Inverse temperature β = 1/Θ',digits:2,format:b=>`${fmt(b,2)} · Θ ${theta(b)}`,hint:'Model weight exp(−βℓ), ℓ = m log p. Θ is a model temperature, not one of ζ.'},
  {key:'ladderPressure',label:'Pressure P',digits:3,hint:'Model weight exp(−Pℓ²) on long rungs.'},
  {key:'ladderSpeed',label:'Display speed',digits:1,hint:'Height units per second while playing.'},
  {key:'ladderSpan',label:'Spacetime window ±ΔT',digits:0,hint:'Height range of the packet spacetime map.'},
];
const RAILS_CONTROLS=[
  {key:'railsA',label:'Bridge thickness a',digits:3,hint:'The line is Re s = ½ + a. Theorem range: a ≥ ½.',sections:'rails temperature vacuum horizon'},
  {key:'railsT0',label:'Window start t₀',digits:0,hint:'Heights up to 2000 are evaluated in the browser.',sections:'rails temperature vacuum horizon'},
  {key:'railsSpan',label:'Window length',digits:0,hint:'The window is t₀ ≤ t ≤ t₀ + length.',sections:'rails temperature vacuum horizon'},
  {key:'railsTerms',label:'Prime-series terms n ≤ N',digits:0,hint:'Cut of −2 Σ Λ(n) n^(−½−a) cos(t log n).',sections:'rails'},
];
const HORIZON_CONTROLS=[
  {key:'horizonMass',label:'Mass log₁₀(M / M☉)',digits:2,hint:'Sets r_s, the Hawking temperature, the entropy and the ringing mode.',sections:'horizon'},
  {key:'horizonRadius',label:'Stellar radius R / r_s',digits:3,hint:'A static fluid star needs R > 9/8 r_s (Buchdahl).',sections:'horizon'},
  {key:'horizonDistance',label:'Proper distance log₁₀(ℓ / fm)',digits:2,hint:'Distance of a static observer from the horizon.',sections:'horizon'},
];
const NUCLEUS_CONTROLS=[
  {key:'nucleusZ',label:'Protons Z',digits:0,hint:'Charge drives the Coulomb term.'},
  {key:'nucleusN',label:'Neutrons N',digits:0,hint:'Adds surface without adding charge.'},
  {key:'nucleusBeta2',label:'Static deformation β₂',digits:3,hint:'Measured value for ²³⁸U is about 0.29.',sections:'drop'},
  {key:'nucleusCoupling',label:'Mode coupling κ',digits:2,hint:'Illustrative: mixes λ with λ ± 2.',sections:'drop'},
  {key:'nucleusWidth',label:'Damping width Γ (MeV)',digits:3,hint:'Amplitude decays as exp(−Γt/2ħ).',sections:'drop'},
  {key:'nucleusSpeed',label:'Display speed',digits:1,hint:'Slows or speeds the display clock only.',sections:'drop'},
];

const ALL_CONTROLS=()=>[...LADDER_CONTROLS,...RAILS_CONTROLS,...HORIZON_CONTROLS,...NUCLEUS_CONTROLS];
function slider(spec){
  const [lo,hi,step]=MODELS_LIMITS[spec.key];
  return `<label class="models-control"${spec.sections?` data-models-sections="${spec.sections}"`:''}><span>${spec.label}<output data-models-out="${spec.key}"></output></span><input type="range" min="${lo}" max="${hi}" step="${step}" data-models-control="${spec.key}" aria-label="${spec.label}"><small>${spec.hint}</small></label>`;
}

export class ModelsPanel {
  constructor(container,{onChange=()=>{},onPreset=()=>{}}={}){
    if(!container)throw new Error('ModelsPanel requires a mount element.');
    this.container=container;this.onChange=onChange;this.onPreset=onPreset;
    this.state=null;this.mode='off';this.section='off';this.viewKey='';this.playing=false;this.raf=0;this.last=0;
    this.height=14.134725;this.clock=0;this.spin=0;this.cache={};
    const view=container.ownerDocument?.defaultView;
    this.view=view;this.reducedMotion=!!view?.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    container.classList.add('models-workbench');container.hidden=true;
    container.innerHTML=`
      <header class="models-heading">
        <div><span class="models-eyebrow" data-models="eyebrow"></span><h3 data-models="title"></h3><p data-models="lede"></p></div>
        <div class="models-tabs" role="tablist" aria-label="Model">
          <button role="tab" data-models-mode="ladder">Twin ladder</button><button role="tab" data-models-mode="nucleus">Nucleus</button><button role="tab" data-models-mode="horizon">Horizon</button>
        </div>
      </header>
      <div class="models-subnav">
        <div class="models-sections" data-models="sections" role="tablist" aria-label="Section"></div>
        <nav class="models-links" data-models="links" aria-label="Mathematics behind this view"></nav>
      </div>
      <div class="models-body">
        <aside class="models-controls" aria-label="Model controls">
          <div class="models-transport"><button data-models-action="play" class="models-primary"></button><button data-models-action="reset">Reset</button></div>
          <div data-models-sections="rails temperature vacuum horizon" class="models-group">
            <div class="models-chips" aria-label="Thickness presets"><button data-models-set='{"railsA":1}'>a = 1</button><button data-models-set='{"railsA":0.5}'>a = ½</button><button data-models-set='{"railsA":0.25}'>a = ¼</button><button data-models-set='{"railsA":0.05}'>a = 0.05</button><button data-models-set='{"railsT0":10,"railsSpan":40}'>First zeros</button><button data-models-set='{"railsT0":1000,"railsSpan":200}'>t ≈ 1000</button></div>
            ${RAILS_CONTROLS.map(slider).join('')}
            <label class="models-control" data-models-sections="vacuum"><span>Ladder</span><select data-models-control="vacuumLadder" aria-label="Ladder"><option value="perfect">Perfect ladder · spacing 1</option><option value="primes">Prime-corrected · rail B_a</option></select><small>The prime-corrected ladder displaces each rung by the phase of ζ.</small></label>
          </div>
          <div data-models-sections="horizon" class="models-group">
            <div class="models-chips" aria-label="Mass presets"><button data-models-set='{"horizonMass":0}'>1 M☉</button><button data-models-set='{"horizonMass":1}'>10 M☉</button><button data-models-set='{"horizonMass":6.6}'>4 × 10⁶ M☉</button><button data-models-set='{"horizonRadius":1.125}'>R = 9/8 r_s</button></div>
            ${HORIZON_CONTROLS.map(slider).join('')}
          </div>
          <div data-models-sections="drop statistics trend" class="models-group">
            <label class="models-control"><span>Nucleus</span><select data-models-control="nucleus" aria-label="Nucleus">${Object.values(NUCLIDES).map(n=>`<option value="${n.id}">${n.label} · ${n.name}</option>`).join('')}</select><small>Sets Z, N and the measured β₂ where one exists.</small></label>
          </div>
          <div data-models-panel="ladder">
            <div class="models-chips" aria-label="Damping centre presets"><button data-models-set='{"ladderCentre":0.5}'>c = ½</button><button data-models-set='{"ladderCentre":1}'>c = 1</button><button data-models-set='{"ladderCentre":0.25}'>c = ¼</button><button data-models-set='{"ladderHeight":14.134725}'>First zero</button></div>
            ${LADDER_CONTROLS.map(slider).join('')}
            <label class="models-control"><span>Rung weight</span><select data-models-control="ladderWeight" aria-label="Rung weight"><option value="mangoldt">log p · von Mangoldt</option><option value="unit">1 · bare powers</option></select><small>log p makes the direct sum a truncation of −ζ′/ζ.</small></label>
          </div>
          <div data-models-panel="nucleus" data-models-sections="drop trend">
            <div class="models-chips" aria-label="Nucleus presets"><button data-models-set='{"nucleus":"U238","nucleusZ":92,"nucleusN":146,"nucleusBeta2":0.286}'>²³⁸U</button><button data-models-set='{"nucleusZ":115,"nucleusN":146}'>Past the threshold</button><button data-models-set='{"nucleusBeta2":0}' data-models-sections="drop">Spherical</button><button data-models-action="pluck" data-models-sections="drop">Pluck again</button></div>
            ${NUCLEUS_CONTROLS.map(slider).join('')}
            <label class="models-control" data-models-sections="drop"><span>Plucked mode</span><select data-models-control="nucleusPluck" aria-label="Plucked multipole"><option value="2">λ = 2 · quadrupole</option><option value="3">λ = 3 · octupole</option><option value="4">λ = 4 · hexadecapole</option><option value="5">λ = 5</option><option value="6">λ = 6</option></select><small>The surface is displaced in this multipole and released.</small></label>
          </div>
        </aside>
        <div class="models-stage">
          <div class="models-hero"><canvas data-models-canvas="hero"></canvas><span class="models-status" data-models="status" role="status"></span></div>
          <article class="models-wide" data-models-only="ladder"><div class="models-mini"><span>PACKET CARRIERS · FINITE MODEL</span><span>REAL AND IMAGINARY PARTS</span></div><canvas data-models-canvas="carrier" class="models-carrier" role="img" aria-label="Real and imaginary parts of the direct and dual packets along log-length"></canvas><p>The packets above are envelopes |ψ|. Here are their real (solid) and imaginary (dashed) parts: each rung carries the carrier exp(∓iTℓ), so the fast oscillation inside the envelope is the phase turning at rate ℓ. Each lane has its own printed scale.</p></article>
          <dl class="models-readouts" data-models="readouts"></dl>
          <article class="models-wide" data-models-only="ladder">
            <div class="models-mini"><span>PACKET SPACETIME · FINITE MODEL</span><span data-models="t5"></span></div>
            <div class="models-chips models-seg" aria-label="Spacetime arm"><button data-models-set='{"ladderSpaceMode":"both"}'>Both arms</button><button data-models-set='{"ladderSpaceMode":"direct"}'>Direct</button><button data-models-set='{"ladderSpaceMode":"dual"}'>Dual</button><button data-models-set='{"ladderSpaceMode":"difference"}'>Difference</button></div>
            <canvas data-models-canvas="space" class="models-space" role="img" aria-label="Packet magnitude over log-length and height; drag vertically to set the height"></canvas>
            <p>|ψ(ℓ, T)| of the Gaussian-windowed finite packet, log-length across and height up, in a window around the current T (dashed line). Drag up or down to set T; while playing the map scrolls. Colour is |ψ| relative to the largest value in the window, square-root scaled; in Difference, cyan means the direct arm is larger and amber the dual. Ticks on the right edge mark zeros of ζ for reference only: this is a finite sum, not ζ.</p>
          </article>
          <div class="models-pair" data-models-only="ladder">
            <article><div class="models-mini"><span>TEMPERATURE–PRESSURE MAP · FINITE MODEL</span><span data-models="t6"></span></div>
              <label class="models-inline"><span>Observable</span><select data-models-control="ladderThermoObs" aria-label="Observable on the temperature–pressure map"><option value="logZ">log Z = log Σ w</option><option value="meanEll">mean log-length ⟨ℓ⟩</option><option value="entropy">entropy S of the weights</option><option value="armGap">|direct sum| − |dual sum| at T</option></select></label>
              <canvas data-models-canvas="thermo" class="models-thermo" role="img" aria-label="Map of the selected observable over inverse temperature and pressure; click or drag to set both"></canvas>
              <p>Each rung carries the model weight w = b(p)·exp(−βℓ − Pℓ²). Click or drag to set β and P. The arm gap is coloured on a symmetric log scale (three decades). β and P are parameters of this finite model, not a temperature or pressure of ζ; with log p weights and P = 0, Z is a truncation of −ζ′/ζ(β), which diverges for β ≤ 1 as primes are added.</p></article>
            <article><div class="models-mini"><span>THERMAL WEIGHT PROFILE</span><span data-models="t7"></span></div><canvas data-models-canvas="profile" class="models-profile" role="img" aria-label="Normalised thermal weights against log-length"></canvas><p>Normalised weights w / Z of every rung at the current β and P. Raising β tilts weight onto short rungs; P cuts off long rungs faster. e^S counts the rungs that effectively take part.</p></article>
          </div>
          <div class="models-grid">
            ${[['a',1],['b',2],['c',3],['d',4]].map(([name,i])=>`<article${i===4?' data-models="fourth"':''}><div class="models-mini"><span data-models="h${i}"></span><span data-models="t${i}"></span></div><canvas data-models-canvas="${name}"></canvas><p data-models="c${i}"></p><a class="models-math" data-models="m${i}" target="_blank" rel="noopener">Mathematics ↗</a></article>`).join('\n            ')}
          </div>
          <div class="models-table" data-models="table"></div>
          <p class="models-note" data-models="note"></p>
        </div>
      </div>`;
    this.el=name=>container.querySelector(`[data-models="${name}"]`);
    this.canvas=name=>container.querySelector(`[data-models-canvas="${name}"]`);
    container.addEventListener('input',event=>this.onInput(event));
    container.addEventListener('change',event=>this.onInput(event));
    container.addEventListener('click',event=>this.onClick(event));
    this.pointer=event=>this.onPointer(event);
    for(const name of ['b','c','space','thermo'])this.canvas(name).addEventListener('pointerdown',this.pointer);
    this.frame=this.frame.bind(this);
    if(view?.ResizeObserver){this.resizeObserver=new view.ResizeObserver(()=>this.draw());this.resizeObserver.observe(container);}
  }

  // ---- application interface ----------------------------------------------
  update(state){
    const previous=this.mode,previousView=this.viewKey;this.state=state;this.mode=state.modelsMode;this.section=modelsSection(state);
    const active=this.mode!=='off';
    this.container.hidden=!active;
    if(!active){this.stop();this.viewKey='';return;}
    this.viewKey=this.mode+'/'+this.section+'/'+state.nucleus;
    if(previousView!==this.viewKey)this.describe();
    if(previous!==this.mode){this.clock=0;this.playing=!this.reducedMotion;}
    if(!this.playing||previous!==this.mode||Math.abs(state.ladderHeight-this.committedHeight)>1e-9)this.height=state.ladderHeight;
    this.committedHeight=state.ladderHeight;
    const key=JSON.stringify(nucleusInput(state));
    if(key!==this.nucleusKey){this.nucleusKey=key;this.clock=0;}
    this.syncControls();this.draw();
    if(this.playing&&ANIMATED.has(this.section))this.start();else this.stop();
  }
  pause(){if(this.playing){this.playing=false;this.commitHeight();this.syncControls();}this.stop();clearTimeout(this.deferTimer);this.deferTimer=0;}
  togglePlay(){this.playing=!this.playing;if(this.playing)this.start();else{this.stop();this.commitHeight();}this.syncControls();}
  destroy(){this.stop();clearTimeout(this.deferTimer);if(this.spaceRaf)this.view?.cancelAnimationFrame?.(this.spaceRaf);this.spaceRaf=0;this.resizeObserver?.disconnect();}
  redraw(){this.draw();}

  // ---- events ----------------------------------------------------------------
  commitHeight(){
    if(this.section!=='ladder'||!this.state)return;
    const [lo,hi]=MODELS_LIMITS.ladderHeight,value=clamp(Math.round(this.height*100)/100,lo,hi);
    if(Math.abs(value-this.state.ladderHeight)>1e-9)this.onChange({ladderHeight:value});
  }
  onInput(event){
    const key=event.target?.dataset?.modelsControl;if(!key)return;
    const raw=event.target.value,enumValues=MODELS_ENUMS[key],value=enumValues&&typeof enumValues[0]==='string'?raw:Number(raw);
    if(key==='ladderHeight')this.height=value;
    const patch={[key]:value};
    if(key==='nucleus'&&NUCLIDES[value]){
      // Choosing a nucleus sets the model's Z and N, and β₂ where a measured value exists.
      const n=NUCLIDES[value];patch.nucleusZ=n.Z;patch.nucleusN=n.N;if(n.beta2)patch.nucleusBeta2=Math.round(n.beta2.raman2001[0]*500)/500;this.clock=0;
    }
    this.onChange(patch,{mode:event.type==='change'?'push':'replace'});
  }
  onClick(event){
    const button=event.target?.closest?.('button');if(!button||!this.container.contains(button))return;
    const {modelsMode,modelsAction,modelsSet}=button.dataset;
    if(modelsMode&&modelsMode!==this.mode){this.onPreset(PRESET_OF[modelsMode]);return;}
    if(modelsSet){const patch=JSON.parse(modelsSet);if('ladderHeight'in patch)this.height=patch.ladderHeight;this.clock=0;this.onChange(patch,{mode:'push'});return;}
    if(modelsAction==='play')this.togglePlay();
    else if(modelsAction==='pluck'){this.clock=0;this.draw();}
    else if(modelsAction==='reset'){this.clock=0;this.cache={};this.onPreset(PRESET_OF[this.mode]);}
  }
  /**
   * Drag on the height scan or the packet spacetime to set T, on the balance
   * plot to set c, on the temperature–pressure map to set β and P.
   */
  onPointer(event){
    if(this.section!=='ladder')return;
    const canvas=event.currentTarget,which=canvas.dataset.modelsCanvas;
    if(which==='space'&&this.spaceGeom)this.spaceFrozen={centre:this.spaceGeom.centre};
    const apply=e=>{
      const box=canvas.getBoundingClientRect();
      if(which==='space'){
        const g=this.spaceGeom,u=clamp((e.clientY-box.top-g.top)/g.ph,0,1),[lo,hi]=MODELS_LIMITS.ladderHeight;
        const c=this.spaceFrozen?.centre??g.centre,span=this.state.ladderSpan;
        this.height=clamp(c+span-u*2*span,lo,hi);this.onChange({ladderHeight:Math.round(this.height*100)/100});
      }else if(which==='thermo'){
        const g=this.thermoGeom,[b0,b1]=THERMO_RANGE.beta,[p0,p1]=THERMO_RANGE.pressure;
        const u=clamp((e.clientX-box.left-g.left)/g.pw,0,1),v=clamp(1-(e.clientY-box.top-g.top)/g.ph,0,1);
        this.onChange({ladderBeta:Math.round((b0+u*(b1-b0))*100)/100,ladderPressure:Math.round((p0+v*(p1-p0))*200)/200});
      }else{
        const u=clamp((e.clientX-box.left-34)/(box.width-46),0,1);
        if(which==='b'){const [lo,hi]=MODELS_LIMITS.ladderHeight;this.height=lo+u*(hi-lo);this.onChange({ladderHeight:Math.round(this.height*100)/100});}
        else this.onChange({ladderCentre:Math.round(u*200)/200});
      }
    };
    event.preventDefault?.();apply(event);try{canvas.setPointerCapture?.(event.pointerId);}catch{}
    const move=e=>apply(e),up=()=>{canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);
      if(which==='space'){this.spaceFrozen=null;this.draw();}};
    canvas.addEventListener('pointermove',move);canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
  }

  // ---- clock -----------------------------------------------------------------
  start(){if(!this.raf&&ANIMATED.has(this.section)&&this.view?.requestAnimationFrame){this.last=0;this.raf=this.view.requestAnimationFrame(this.frame);}}
  stop(){if(this.raf)this.view?.cancelAnimationFrame?.(this.raf);this.raf=0;}
  frame(now){
    this.raf=0;if(!this.playing||this.mode==='off'||this.container.hidden||!ANIMATED.has(this.section))return;
    const dt=this.last?Math.min(.1,(now-this.last)/1000):0;this.last=now;this.advance(dt);this.draw();
    this.raf=this.view.requestAnimationFrame(this.frame);
  }
  /** Advance the local clocks by dt seconds of display time. */
  advance(dt){
    if(this.section==='ladder'){
      const [lo,hi]=MODELS_LIMITS.ladderHeight;this.height+=dt*this.state.ladderSpeed;
      if(this.height>hi)this.height=lo;
      const input=this.container.querySelector('[data-models-control="ladderHeight"]'),out=this.container.querySelector('[data-models-out="ladderHeight"]');
      if(input)input.value=this.height;if(out)out.textContent=fmt(this.height,2);
    }else{
      this.clock+=dt*2*this.state.nucleusSpeed;this.spin+=dt*.22;
    }
  }

  // ---- text ------------------------------------------------------------------
  /** Run `compute` after the current frame and redraw; returns the cached value or undefined. */
  defer(key,compute){
    this.deferred??=new Map();
    if(this.deferred.has(key))return this.deferred.get(key);
    if(this.deferKey===key)return undefined;
    clearTimeout(this.deferTimer);this.deferKey=key;
    const run=()=>{this.deferTimer=0;if(this.deferKey!==key)return;if(this.deferred.size>24)this.deferred.clear();this.deferred.set(key,compute());this.deferKey='';this.draw();};
    if(this.view?.setTimeout)this.deferTimer=this.view.setTimeout(run,30);else run();
    return this.deferred.get(key);
  }
  status(text,tone){this.el('status').textContent=text;this.el('status').dataset.tone=tone;}
  table(html){const el=this.el('table');if(this.tableHTML!==html){this.tableHTML=html;el.innerHTML=html;}el.hidden=!html;}
  describe(){
    const section=this.section,spec=SECTIONS[section],ladder=section==='ladder',set=(name,text)=>{this.el(name).textContent=text;};
    const nuclide=NUCLIDES[this.state.nucleus]??NUCLIDES.U238;
    const text=spec??(ladder?{eyebrow:'FINITE MODEL · PRIME LADDERS',title:'Two ladders, one bridge.',
      lede:'Every prime carries a ladder of rungs at log-lengths m·log p. The direct arm is damped at c + a and the dual arm at c − a. Move the damping centre and watch the two arms, their packets and the bridge between them.',
      heads:[['PHASOR WALKS','TIP TO TAIL'],['HEIGHT SCAN','DRAG TO SET T'],['BRIDGE BALANCE','DRAG TO SET c'],['','']],
      captions:['Each rung is an arrow of length its amplitude; the arm sum is where the chain ends. Cyan: direct. Amber: dual.',
        'Magnitude of the two finite arm sums along the height axis. Ticks mark the first zeros of ζ for reference; the finite sums are not ζ.',
        'Green: the completed bridge of ξ, exactly zero at c = ½ for every a and T. Violet: the bare finite arms, which have no balanced centre.',''],
      note:'Finite experiment. With log p weights the direct sum truncates −ζ′/ζ(σ + iT), which converges only for σ > 1; at c = ½ it is a model, not ζ. The packet spacetime, the carriers, the temperature–pressure map and the weight profile are all finite sums of this model; β, Θ = 1/β and P are model parameters, not physical quantities of ζ. The balance at c = ½ belongs to the completed function ξ through |ξ(s)| = |ξ(1 − s̄)|. Nothing here tests or proves the Riemann hypothesis.',
      aria:'Twin prime ladders with rung phasors, packet envelopes and the bridge between the arms',hideFourth:true}
    :{eyebrow:'COLLECTIVE MODEL · LIQUID DROP',title:'Which oscillations hold the nucleus together?',
      lede:'A heavy nucleus rings like a charged liquid drop. Surface tension restores each ripple; electric repulsion works against it. Add protons until the quadrupole gives way, and couple the modes to see stability change.',
      heads:[['MODE STIFFNESS','SURFACE − COULOMB'],['MODE AMPLITUDES','AFTER THE PLUCK'],['ROTATIONAL LADDER','MEASURED vs RIGID ROTOR'],['','']],
      captions:['Bars up: surface tension. Bars down: Coulomb repulsion. The dot is the net stiffness C; a mode with C below zero is unstable. Numbers: uncoupled ħω in MeV.',
        'Amplitude of each multipole after the pluck. Coupling passes the motion between modes of the same parity.',
        nuclide.id==='U238'?'Measured ground-band levels of ²³⁸U beside a rigid rotor fixed by the 2⁺ level. A ladder of a different kind: its rungs follow J(J+1).':`The measured ground band is loaded for ²³⁸U only; for ${nuclide.label} it is not available here.`,''],
      note:`Textbook liquid-drop model, not a many-body calculation. Shell structure, pairing and rotation are absent; liquid-drop energies overshoot observed band heads; the coupling κ and the width Γ are illustrative. Measured values are quoted with their sources in Methods. ${nuclide.label}: half-life ${nuclide.halfLife.text.replace(/E\+?(-?\d+)/,' × 10^$1').replace(' Y',' yr')}; ${nuclide.notes[0]} The spacing statistics are in the Level statistics section.`,
      aria:'Nucleons of the model nucleus following the oscillating liquid-drop surface',hideFourth:true});
    set('eyebrow',text.eyebrow);set('title',text.title);set('lede',text.lede);
    const anchors=SECTION_LINKS[section]?.panels??[];
    text.heads.forEach(([h,t],i)=>{set('h'+(i+1),h);set('t'+(i+1),t);set('c'+(i+1),text.captions[i]);
      const link=this.el('m'+(i+1));link.hidden=!anchors[i];if(anchors[i])link.href=methodsLink(anchors[i]);});
    this.el('fourth').hidden=!!text.hideFourth;
    set('note',text.note);
    const mounted=!!this.container.ownerDocument?.querySelector?.('.site-bar');
    this.el('links').innerHTML=sectionLinks(section,{mounted}).map(l=>`<a href="${esc(l.href)}" data-kind="${l.kind}"${l.kind==='site'?'':' target="_blank" rel="noopener"'}>${esc(l.label)} ↗</a>`).join('');
    this.el('sections').innerHTML=(MODE_SECTIONS[this.mode]??[]).map(([key,name])=>`<button role="tab" aria-selected="${key===section}" class="${key===section?'active':''}" data-models-set='${JSON.stringify({[this.mode==='ladder'?'ladderPanel':'nucleusPanel']:key})}'>${esc(name)}</button>`).join('');
    this.el('sections').hidden=(MODE_SECTIONS[this.mode]??[]).length<2;
    for(const group of this.container.querySelectorAll('[data-models-sections]'))group.hidden=!group.dataset.modelsSections.split(' ').includes(section);
    for(const panel of this.container.querySelectorAll('[data-models-panel]'))if(!panel.dataset.modelsSections)panel.hidden=panel.dataset.modelsPanel!==section;
    // The packet, spacetime and thermal panels belong to the finite ladder section only.
    for(const part of this.container.querySelectorAll('[data-models-only]'))part.hidden=part.dataset.modelsOnly!==section;
    for(const tab of this.container.querySelectorAll('[data-models-mode]')){const on=tab.dataset.modelsMode===this.mode;tab.classList.toggle('active',on);tab.setAttribute('aria-selected',String(on));}
    this.container.querySelector('[data-models-action="play"]').hidden=!ANIMATED.has(section);
    this.container.dataset.modelsSection=section;
    this.canvas('hero').setAttribute('aria-label',text.aria);
    this.canvas('hero').setAttribute('role','img');
    if(!spec)this.table('');
  }
  syncControls(){
    const s=this.state;if(!s)return;
    for(const input of this.container.querySelectorAll('[data-models-control]')){
      const key=input.dataset.modelsControl,value=key==='ladderHeight'?this.height:s[key];
      if(this.container.ownerDocument?.activeElement!==input||input.tagName==='SELECT')input.value=String(value);
    }
    for(const out of this.container.querySelectorAll('[data-models-out]')){
      const key=out.dataset.modelsOut,spec=ALL_CONTROLS().find(c=>c.key===key);
      const value=key==='ladderHeight'?this.height:s[key];
      out.textContent=spec?.format?spec.format(value):fmt(value,spec?.digits??2);
    }
    for(const chip of this.container.querySelectorAll('[data-models-set]')){
      if(chip.getAttribute('role')==='tab')continue;
      const patch=JSON.parse(chip.dataset.modelsSet),keys=Object.keys(patch);
      if(keys.length===1&&typeof patch[keys[0]]==='string'){const on=s[keys[0]]===patch[keys[0]];chip.classList.toggle('active',on);chip.setAttribute('aria-pressed',String(on));}
    }
    const play=this.container.querySelector('[data-models-action="play"]');
    play.textContent=this.playing?'Pause':'Play';play.setAttribute('aria-pressed',String(this.playing));
  }
  readouts(rows){
    this.el('readouts').innerHTML=rows.map(([name,value,tone])=>`<div${tone?` data-tone="${tone}"`:''}><dt>${name}</dt><dd>${value}</dd></div>`).join('');
  }

  // ---- drawing ---------------------------------------------------------------
  draw(){
    if(!this.state||this.mode==='off'||this.container.hidden)return;
    const spec=SECTIONS[this.section];
    if(spec)spec.draw(this);else if(this.section==='ladder')this.drawLadder();else this.drawNucleus();
  }

  drawLadder(){
    const s=this.state,input=ladderInput(s),cfg=ladderConfig(input),rungs=ladderRungs(input),T=this.height;
    const damping=armDamping(input),inputKey=JSON.stringify(input);
    // Fixed reference scales: the same ladder at c = ½, a = 0 without thermal
    // weights, so changing the damping visibly shrinks or grows the arms. The
    // log-length axis fits the longest rung.
    const refKey=[cfg.primes,cfg.rungs,cfg.weight,cfg.width].join(',');
    if(this.cache.refKey!==refKey){
      const ref=ladderRungs({...input,centre:.5,offset:0,beta:0,pressure:0});
      const reach=Math.min(ref[ref.length-1].ell,24)+.6,ells=Float64Array.from({length:481},(_,i)=>reach*i/480);
      const row=packetRow(packetKernel(ref,ells,cfg.width),0);let packet=1e-12,rung=0;
      for(let i=0;i<=480;i++)packet=Math.max(packet,Math.hypot(row.directRe[i],row.directIm[i]));
      for(const r of ref)rung=Math.max(rung,r.direct);
      this.cache={...this.cache,refKey,rung,packet,carrierExtent:null};
    }
    // The ℓ axis fits the longest rung that is visible on either arm (at least
    // 10⁻³ of the largest amplitude); fainter rungs are summed but off-axis.
    let topAmp=0,far=0;for(const r of rungs)topAmp=Math.max(topAmp,r.direct,r.dual);
    for(const r of rungs)if(Math.max(r.direct,r.dual)>=1e-3*topAmp)far=Math.max(far,r.ell);
    this.cache.L=Math.max(3,far+.6);this.cache.offAxis=rungs.filter(r=>r.ell>this.cache.L).length;
    if(this.cache.scanKey!==inputKey){
      const [lo,hi]=MODELS_LIMITS.ladderHeight;
      this.cache.scanKey=inputKey;this.cache.scan={direct:heightScan(rungs,'direct',lo,hi,540),dual:heightScan(rungs,'dual',lo,hi,540)};
      this.cache.ensemble=thermalEnsemble(input);
    }
    const direct=armSum(rungs,T,'direct'),dual=armSum(rungs,T,'dual'),ensemble=this.cache.ensemble;
    const xiBridge=bridgeBalance(evaluateXi,cfg.centre,cfg.offset,T),finite=finiteBalance(rungs,T);
    let nearest=ZERO_HEIGHTS[0];for(const z of ZERO_HEIGHTS)if(Math.abs(z-T)<Math.abs(nearest-T))nearest=z;
    const heroRow=this.ladderHero(rungs,cfg,damping,T,inputKey);
    this.ladderCarriers(heroRow);
    this.ladderSpace(rungs,cfg,T,inputKey);
    this.ladderThermo(input,cfg,T,inputKey);
    this.ladderProfile(ensemble);
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
      ['Nearest ζ zero',`${fmt(nearest,4)} · ${fmt(T-nearest,2)} away`],['Rungs summed',`${rungs.length} · ${cfg.primes} primes ≤ ${LADDER_PRIMES[cfg.primes-1]}`],
      ['Model temperature Θ = 1/β',theta(cfg.beta)],['log Z (finite sum)',fmt(ensemble.logZ,4)],
      ['Mean log-length ⟨ℓ⟩',fmt(ensemble.mean,4)],['Entropy S · e^S',`${fmt(ensemble.entropy,3)} · ${sig(Math.exp(ensemble.entropy),3)}`],
    ]);
  }

  /** ℓ ticks: at most about a dozen gridlines whatever the axis length. */
  ellTicks(L){const step=[1,2,5,10,20].find(v=>L/v<=12)||20,out=[];for(let x=0;x<=L+1e-9;x+=step)out.push(x);return out;}

  ladderHero(rungs,cfg,damping,T,inputKey){
    const {ctx,w,h}=surface(this.canvas('hero')),{L,rung:refRung,packet:refPacket}=this.cache;
    const left=18,right=18,cy=h/2,gap=Math.max(15,h*.045),arm=h/2-gap-44,unit=.46,cap=2.15;
    const X=ell=>left+ell/L*(w-left-right);
    for(const ell of this.ellTicks(L)){line(ctx,X(ell),24,X(ell),h-20,C.grid,1);if(X(ell)<w-right-(w<640?16:150))label(ctx,String(ell),X(ell),h-7,{color:C.dim,size:9,align:'center'});}
    label(ctx,w<640?'ℓ':'log-length ℓ = m · log p',w-right,h-7,{color:C.dim,size:9,align:'right'});
    ctx.fillStyle='rgba(215,247,173,.07)';ctx.fillRect(left,cy-gap,w-left-right,2*gap);
    line(ctx,left,cy,w-right,cy,C.bridge,1,[5,5]);
    // One windowed kernel per configuration; each frame only turns the phases.
    const n=Math.max(120,Math.min(640,Math.round(w/2))),key=inputKey+'|'+L+'|'+n;
    if(this.cache.heroKey!==key){this.cache.heroKey=key;this.cache.heroEll=Float64Array.from({length:n+1},(_,i)=>L*i/n);this.cache.heroKernel=packetKernel(rungs,this.cache.heroEll,cfg.width);}
    const row=packetRow(this.cache.heroKernel,T,this.cache.heroRow||{});this.cache.heroRow=row;
    const many=rungs.length>240,spacing=(w-left-right)/Math.max(1,rungs.filter(r=>r.m===1).length);
    for(const [name,dir,color] of [['direct',-1,C.direct],['dual',1,C.dual]]){
      const base=cy+dir*gap,re=row[name+'Re'],im=row[name+'Im'];
      const Y=v=>base+dir*clamp(v,-cap,cap)*arm*unit,env=i=>Math.hypot(re[i],im[i])/refPacket;
      const fill=ctx.createLinearGradient(0,base,0,base+dir*arm);fill.addColorStop(0,color+'08');fill.addColorStop(1,color+'40');
      ctx.fillStyle=fill;ctx.beginPath();ctx.moveTo(X(0),base);for(let i=0;i<=n;i++)ctx.lineTo(X(L*i/n),Y(env(i)));ctx.lineTo(X(L),base);ctx.closePath();ctx.fill();
      ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.beginPath();for(let i=0;i<=n;i++){const x=X(L*i/n),y=Y(env(i));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      ctx.strokeStyle=color+'70';ctx.lineWidth=1;ctx.beginPath();for(let i=0;i<=n;i++){const x=X(L*i/n),y=Y(Math.abs(re[i])/refPacket);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      line(ctx,left,base,w-right,base,color+'90',1);
      // Rungs with phasors. With many rungs, stems are batched and only the
      // visible heads are drawn.
      for(const first of [true,false]){
        ctx.globalAlpha=first?1:.6;ctx.strokeStyle=color;ctx.lineWidth=first?(many?1.4:2):1.2;ctx.beginPath();
        for(const r of rungs){if(r.ell>L)break;if((r.m===1)!==first)continue;const x=X(r.ell);ctx.moveTo(x,base);ctx.lineTo(x,base+dir*clamp(r[name]/refRung,0,cap)*arm*unit);}
        ctx.stroke();
      }
      ctx.globalAlpha=1;
      for(const r of rungs){
        if(r.ell>L)break;
        const norm=r[name]/refRung;if(many&&(norm<.12||spacing<5&&r.m>1))continue;
        const x=X(r.ell),tip=base+dir*clamp(norm,0,cap)*arm*unit;
        const radius=(many?2.5:3)+(many?3:5)*Math.sqrt(clamp(norm,0,2.5)),phase=(name==='dual'?1:-1)*T*r.ell;
        ctx.globalAlpha=r.m===1?1:.6;
        ctx.fillStyle='#0b111b';ctx.strokeStyle=color;ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(x,tip,radius,0,TAU);ctx.fill();ctx.stroke();
        line(ctx,x,tip,x+radius*Math.cos(phase),tip-radius*Math.sin(phase),'#f2f6fb',1.4);
        if(norm>cap)label(ctx,'▲',x,tip+dir*-4,{color,size:7,align:'center'});
      }
      ctx.globalAlpha=1;
      const sigma=name==='direct'?damping.direct:damping.dual;
      label(ctx,`${name.toUpperCase()} ARM · σ${name==='direct'?'₊':'₋'} = ${fmt(sigma,3)}${w<640?'':` · turns as e^${name==='direct'?'−':'+'}iTℓ`}`,left+6,dir<0?16:h-24,{color,size:10});
    }
    // Bridge links and prime labels, thinned so labels never collide.
    let lastLabel=-1e9;
    for(const r of rungs){
      if(r.ell>L)break;
      const x=X(r.ell),strength=clamp(Math.sqrt(r.direct*r.dual)/refRung,0,1);
      if(!many||strength>.03){ctx.globalAlpha=.2+.8*strength;line(ctx,x,cy-gap,x,cy+gap,C.bridge,1+2*strength);}
      ctx.globalAlpha=1;
      if(r.m===1&&x-lastLabel>=6+7*String(r.p).length){label(ctx,String(r.p),x+4,cy+3,{color:'#cfe6b2',size:9});lastLabel=x;}
    }
    const narrow=w<640;
    if(narrow)label(ctx,`BRIDGE c = ${fmt(cfg.centre,3)} · 2a = ${fmt(2*cfg.offset,3)} · T = ${fmt(T,2)}`,left+6,h-38,{color:C.bridge,size:10});
    else label(ctx,`BRIDGE · centre c = ${fmt(cfg.centre,3)} · width 2a = ${fmt(2*cfg.offset,3)} · T = ${fmt(T,2)}`,w-right-6,h-24,{color:C.bridge,size:10,align:'right'});
    const hidden=this.cache.offAxis;
    if(hidden)label(ctx,`${hidden} fainter rungs beyond ℓ = ${fmt(L,1)} summed, not drawn`,w-right-6,narrow?h-52:h-38,{color:C.dim,size:9,align:'right'});
    return row;
  }

  /** Real and imaginary parts of both packets, on the hero's ℓ axis. */
  ladderCarriers(row){
    const {ctx,w,h}=surface(this.canvas('carrier')),{L}=this.cache,ells=this.cache.heroEll,n=ells.length-1;
    const left=18,right=18,top=8,bottom=18,lane=(h-top-bottom)/2,X=ell=>left+ell/L*(w-left-right);
    for(const ell of this.ellTicks(L)){line(ctx,X(ell),top,X(ell),h-bottom,C.grid,1);label(ctx,String(ell),X(ell),h-5,{color:C.dim,size:8,align:'center'});}
    this.cache.carrierExtent??={direct:0,dual:0};
    [['direct',C.direct,'ψ₊'],['dual',C.dual,'ψ₋']].forEach(([name,color,sym],k)=>{
      const re=row[name+'Re'],im=row[name+'Im'],mid=top+lane*(k+.5);
      let peak=1e-300;for(let i=0;i<=n;i++)peak=Math.max(peak,Math.hypot(re[i],im[i]));
      // Each lane has its own smoothed scale so the carrier stays readable
      // whatever the damping; the scale is printed.
      const prev=this.cache.carrierExtent[name],extent=prev?Math.max(peak,prev*.97):peak;this.cache.carrierExtent[name]=extent;
      const amp=lane*.44/extent,Y=v=>mid-v*amp;
      line(ctx,left,mid,w-right,mid,C.axis,1);
      ctx.fillStyle=color+'1f';ctx.beginPath();
      for(let i=0;i<=n;i++){const x=X(ells[i]),y=Y(Math.hypot(re[i],im[i]));i?ctx.lineTo(x,y):ctx.moveTo(x,y);}
      for(let i=n;i>=0;i--)ctx.lineTo(X(ells[i]),Y(-Math.hypot(re[i],im[i])));ctx.closePath();ctx.fill();
      ctx.save();ctx.strokeStyle=color+'b0';ctx.lineWidth=1;ctx.setLineDash([3,3]);ctx.beginPath();
      for(let i=0;i<=n;i++){const x=X(ells[i]),y=Y(im[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();ctx.restore();
      ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();
      for(let i=0;i<=n;i++){const x=X(ells[i]),y=Y(re[i]);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.stroke();
      label(ctx,w<640?`${name.toUpperCase()} · — Re ┄ Im`:`${name.toUpperCase()} · — Re ${sym}  ┄ Im ${sym}  ▒ ±|${sym}|`,left+4,mid-lane*.5+12,{color,size:9});
      label(ctx,`scale ${sig(extent,2)}`,w-right-4,mid-lane*.5+12,{color:C.dim,size:8,align:'right'});
    });
  }

  /**
   * Packet spacetime: |ψ| over (ℓ, T) in a window around the current height.
   * Rows are cached by their index on a fixed T lattice and filled a few at a
   * time, so scrolling only computes the new rows.
   */
  ladderSpace(rungs,cfg,T,inputKey){
    const canvas=this.canvas('space'),{ctx,w,h}=surface(canvas),{L}=this.cache,s=this.state,mode=s.ladderSpaceMode;
    const panels=mode==='both'?[['direct'],['dual']]:[[mode]],gutter=12,left=34,right=10,top=20,bottom=22;
    const pw=(w-left-right-gutter*(panels.length-1))/panels.length,ph=h-top-bottom;
    const nEll=Math.round(clamp(pw/2.5,80,320)),span=s.ladderSpan,dT=span/80,[lo,hi]=MODELS_LIMITS.ladderHeight;
    const key=inputKey+'|'+L+'|'+nEll+'|'+span;
    let sp=this.cache.space;
    if(!sp||sp.key!==key){
      const ells=Float64Array.from({length:nEll},(_,i)=>L*(i+.5)/nEll);
      sp=this.cache.space={key,ells,kernel:packetKernel(rungs,ells,cfg.width),rows:new Map(),dT,peak:0,scratch:{}};
    }
    const frozen=this.spaceFrozen,centre=frozen?frozen.centre:clamp(T,lo+span,hi-span);
    const t0=centre-span,t1=centre+span,k0=Math.floor(t0/dT),k1=Math.ceil(t1/dT),nRows=k1-k0+1;
    // Fill missing rows nearest the marker first, within a time budget.
    const clock=this.view?.performance||globalThis.performance,start=clock.now();let missing=0;
    const order=[];for(let k=k0;k<=k1;k++)if(!sp.rows.has(k))order.push(k);
    const kT=Math.round(T/dT);order.sort((a,b)=>Math.abs(a-kT)-Math.abs(b-kT));
    for(const k of order){
      if(clock.now()-start>7){missing++;continue;}
      const r=packetRow(sp.kernel,k*dT,sp.scratch),d=new Float32Array(nEll),u=new Float32Array(nEll);
      for(let i=0;i<nEll;i++){d[i]=Math.hypot(r.directRe[i],r.directIm[i]);u[i]=Math.hypot(r.dualRe[i],r.dualIm[i]);}
      sp.rows.set(k,{direct:d,dual:u});
    }
    for(const k of sp.rows.keys())if(k<k0-40||k>k1+40)sp.rows.delete(k);
    if(missing&&!this.playing&&!this.spaceRaf&&this.view?.requestAnimationFrame)this.spaceRaf=this.view.requestAnimationFrame(()=>{this.spaceRaf=0;this.draw();});
    // Scale: the largest |ψ| in the window, eased so scrolling does not pump.
    let peak=1e-300;
    for(let k=k0;k<=k1;k++){const r=sp.rows.get(k);if(!r)continue;for(let i=0;i<nEll;i++)peak=Math.max(peak,r.direct[i],r.dual[i]);}
    sp.peak=sp.peak?Math.max(peak,sp.peak*.98):peak;
    const img=this.spaceImage(nEll,nRows);
    panels.forEach(([arm],p)=>{
      const x0=left+p*(pw+gutter),lut=LUT[arm==='difference'?'diverging':arm],data=img.data.data;
      for(let k=k0;k<=k1;k++){
        const r=sp.rows.get(k),y=k1-k;
        for(let i=0;i<nEll;i++){
          const o=(y*nEll+i)*4;let idx;
          if(!r){data[o]=12;data[o+1]=18;data[o+2]=28;data[o+3]=255;continue;}
          if(arm==='difference'){const v=(r.direct[i]-r.dual[i])/sp.peak;idx=Math.round(clamp(.5+.5*Math.sign(v)*Math.sqrt(Math.abs(v)),0,1)*255);}
          else idx=Math.round(clamp(Math.sqrt(r[arm][i]/sp.peak),0,1)*255);
          data[o]=lut[idx*3];data[o+1]=lut[idx*3+1];data[o+2]=lut[idx*3+2];data[o+3]=255;
        }
      }
      img.ctx.putImageData(img.data,0,0);
      // The lattice spans [k0·dT, k1·dT]; map it onto the plotted window.
      const Yt=t=>top+(t1-t)/(t1-t0)*ph,yTop=Yt(k1*dT+dT/2),yBot=Yt(k0*dT-dT/2);
      ctx.save();ctx.beginPath();ctx.rect(x0,top,pw,ph);ctx.clip();ctx.imageSmoothingEnabled=true;
      ctx.drawImage(img.canvas,0,0,nEll,nRows,x0,yTop,pw,yBot-yTop);ctx.restore();
      ctx.strokeStyle=C.axis;ctx.lineWidth=1;ctx.strokeRect(x0+.5,top+.5,pw-1,ph-1);
      for(const ell of this.ellTicks(L)){const x=x0+ell/L*pw;if(x>x0+pw-14)continue;line(ctx,x,top+ph,x,top+ph+4,C.axis);label(ctx,String(ell),x,h-8,{color:C.dim,size:8,align:'center'});}
      for(const z of ZERO_HEIGHTS)if(z>t0&&z<t1)line(ctx,x0+pw-6,Yt(z),x0+pw,Yt(z),'#cfe6b2',1);
      const yT=Yt(T);line(ctx,x0,yT,x0+pw,yT,'#f2f6fb',1.2,[6,3]);
      const name=arm==='difference'?'|ψ₊| − |ψ₋|':arm==='direct'?'|ψ₊| DIRECT':'|ψ₋| DUAL';
      label(ctx,name,x0+4,top-6,{color:arm==='dual'?C.dual:arm==='direct'?C.direct:C.bridge,size:9});
      if(p===panels.length-1&&w>=640)label(ctx,'ζ zeros ▸ reference',x0+pw,top-6,{color:'#cfe6b2',size:8,align:'right'});
    });
    const step=span>25?10:5;
    for(let t=Math.ceil(t0/step)*step;t<=t1;t+=step){const y=top+(t1-t)/(t1-t0)*ph;label(ctx,String(t),left-5,y+3,{color:C.dim,size:8,align:'right'});}
    label(ctx,'T',left-5,top-8,{color:C.dim,size:8,align:'right'});
    this.spaceGeom={top,ph,t0,t1,centre};
    this.el('t5').textContent=`T = ${fmt(T,2)} · WINDOW ${fmt(t0,0)}–${fmt(t1,0)}${missing?' · FILLING':''}`;
  }
  spaceImage(w,h){
    let img=this.cache.spaceImg;
    if(!img||img.canvas.width!==w||img.canvas.height!==h){
      const canvas=this.container.ownerDocument.createElement('canvas');canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d');img=this.cache.spaceImg={canvas,ctx,data:ctx.createImageData(w,h)};
    }
    return img;
  }

  /** Map of a thermal observable over β ∈ [0, 4], P ∈ [0, 2]. */
  ladderThermo(input,cfg,T,inputKey){
    const {ctx,w,h}=surface(this.canvas('thermo')),obs=this.state.ladderThermoObs,gap=obs==='armGap';
    const left=40,right=60,top=14,bottom=30,pw=w-left-right,ph=h-top-bottom,nb=64,np=32;
    const base=JSON.stringify({...input,beta:0,pressure:0}),key=base+'|'+obs;
    const clock=this.view?.performance||globalThis.performance,now=clock.now(),th=this.cache.thermo;
    // The arm gap depends on T; while playing it is refreshed a few times a second.
    const stale=!th||th.key!==key||gap&&Math.abs(th.T-T)>1e-9&&(!this.playing||now-th.at>220);
    if(stale)this.cache.thermo={key,T,at:now,grid:thermoGrid(input,obs,T,{nb,np})};
    const {grid}=this.cache.thermo,img=this.thermoImage(nb,np),data=img.data.data,lut=gap?LUT.diverging:LUT.thermo;
    const span=gap?Math.max(Math.abs(grid.min),Math.abs(grid.max))||1:grid.max-grid.min||1;
    for(let j=0;j<np;j++)for(let i=0;i<nb;i++){
      const v=grid.values[j*nb+i],u=gap?.5+.5*Math.sign(v)*Math.log1p(Math.abs(v)/(span*1e-3))/Math.log1p(1e3):(v-grid.min)/span,idx=Math.round(clamp(Number.isFinite(u)?u:0,0,1)*255),o=((np-1-j)*nb+i)*4;
      data[o]=lut[idx*3];data[o+1]=lut[idx*3+1];data[o+2]=lut[idx*3+2];data[o+3]=255;
    }
    img.ctx.putImageData(img.data,0,0);
    const [b0,b1]=THERMO_RANGE.beta,[p0,p1]=THERMO_RANGE.pressure,X=b=>left+(b-b0)/(b1-b0)*pw,Y=p=>top+(1-(p-p0)/(p1-p0))*ph;
    ctx.imageSmoothingEnabled=true;ctx.drawImage(img.canvas,X(b0)-pw/(2*(nb-1)),Y(p1)-ph/(2*(np-1)),pw*nb/(nb-1),ph*np/(np-1));
    ctx.clearRect(0,0,left,h);ctx.clearRect(0,0,w,top);ctx.clearRect(left+pw,0,w,h);ctx.clearRect(0,top+ph,w,h);
    ctx.strokeStyle=C.axis;ctx.strokeRect(left+.5,top+.5,pw-1,ph-1);
    for(const b of [0,1,2,3,4])label(ctx,String(b),X(b),top+ph+12,{color:C.dim,size:8,align:'center'});
    for(const p of [0,.5,1,1.5,2])label(ctx,String(p),left-5,Y(p)+3,{color:C.dim,size:8,align:'right'});
    label(ctx,'β = 1/Θ →',left+pw,h-4,{color:C.dim,size:8,align:'right'});label(ctx,'Θ = ∞',left,h-4,{color:C.dim,size:8});
    label(ctx,'P',6,top+ph/2+3,{color:C.dim,size:9});
    // Colour bar.
    const bx=left+pw+12,bh=ph;for(let y=0;y<bh;y++){const idx=Math.round((1-y/(bh-1))*255);ctx.fillStyle=`rgb(${lut[idx*3]},${lut[idx*3+1]},${lut[idx*3+2]})`;ctx.fillRect(bx,top+y,8,1);}
    const hiText=gap?sig(span,2):sig(grid.max,3),loText=gap?sig(-span,2):sig(grid.min,3);
    label(ctx,hiText,bx+12,top+7,{color:C.dim,size:8});label(ctx,loText,bx+12,top+bh,{color:C.dim,size:8});if(gap)label(ctx,'0',bx+12,top+bh/2+3,{color:C.dim,size:8});
    const cx=X(cfg.beta),cy=Y(cfg.pressure);
    line(ctx,cx,top,cx,top+ph,'#f2f6fbaa',1,[3,3]);line(ctx,left,cy,left+pw,cy,'#f2f6fbaa',1,[3,3]);
    ctx.strokeStyle='#f2f6fb';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(cx,cy,5,0,TAU);ctx.stroke();
    this.thermoGeom={left,top,pw,ph};
    const value=thermoValue(input,obs,T);
    this.el('t6').textContent=`${THERMO_NAMES[obs]} = ${sig(value,4)}`;
  }
  thermoImage(w,h){
    let img=this.cache.thermoImg;
    if(!img||img.canvas.width!==w||img.canvas.height!==h){
      const canvas=this.container.ownerDocument.createElement('canvas');canvas.width=w;canvas.height=h;
      const ctx=canvas.getContext('2d');img=this.cache.thermoImg={canvas,ctx,data:ctx.createImageData(w,h)};
    }
    return img;
  }

  /** Normalised thermal weights against log-length, with ⟨ℓ⟩ marked. */
  ladderProfile(ensemble){
    const {ctx,w,h}=surface(this.canvas('profile')),{L}=this.cache,left=34,right=12,top=30,bottom=22;
    const X=ell=>left+ell/L*(w-left-right);let max=1e-300;for(const q of ensemble.weights)max=Math.max(max,q);
    const Y=q=>h-bottom-q/max*(h-top-bottom);
    line(ctx,left,h-bottom,w-right,h-bottom,C.axis);line(ctx,left,top,left,h-bottom,C.axis);
    ctx.strokeStyle=C.bridge;ctx.lineWidth=ensemble.count>300?1:1.5;ctx.beginPath();
    for(let k=0;k<ensemble.count&&ensemble.ell[k]<=L;k++){const x=X(ensemble.ell[k]);ctx.moveTo(x,h-bottom);ctx.lineTo(x,Y(ensemble.weights[k]));}ctx.stroke();
    if(ensemble.count<=120){ctx.fillStyle=C.bridge;for(let k=0;k<ensemble.count&&ensemble.ell[k]<=L;k++){ctx.beginPath();ctx.arc(X(ensemble.ell[k]),Y(ensemble.weights[k]),2,0,TAU);ctx.fill();}}
    const xm=X(ensemble.mean);line(ctx,xm,top,xm,h-bottom,'#f2f6fb',1,[4,3]);label(ctx,'⟨ℓ⟩',xm+4,top-4,{color:'#f2f6fb',size:8});
    for(const ell of this.ellTicks(L))label(ctx,String(ell),X(ell),h-8,{color:C.dim,size:8,align:'center'});
    label(ctx,sig(max,2),left-4,top+8,{color:C.dim,size:8,align:'right'});label(ctx,'0',left-4,h-bottom,{color:C.dim,size:8,align:'right'});
    label(ctx,'ℓ',w-right,h-8,{color:C.dim,size:8,align:'right'});
    const stats=w<560?`S = ${fmt(ensemble.entropy,3)} · e^S = ${sig(Math.exp(ensemble.entropy),3)} / ${ensemble.count}`:`log Z = ${fmt(ensemble.logZ,3)} · ⟨ℓ⟩ = ${fmt(ensemble.mean,3)} · S = ${fmt(ensemble.entropy,3)} · e^S = ${sig(Math.exp(ensemble.entropy),3)} of ${ensemble.count} rungs`;
    label(ctx,stats,w-right,12,{color:C.text,size:9,align:'right'});
    this.el('t7').textContent=`β = ${fmt(this.state.ladderBeta,2)} · P = ${fmt(this.state.ladderPressure,3)}`;
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
    const n=80,xi=[],bare=[...finiteBalanceCurve(input,T,n)];
    for(let i=0;i<=n;i++)xi.push(bridgeBalance(evaluateXi,i/n,cfg.offset,T));
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
    if(this.state.nucleus!=='U238'){label(ctx,'ground band: not available for this nucleus',w/2,h/2,{color:C.dim,size:10,align:'center'});return;}
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
}
