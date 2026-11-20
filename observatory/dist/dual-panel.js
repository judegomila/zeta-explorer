import { DUAL_DEFAULTS, normalizeDualConfig, dualSourceFromProbe, conormalFromProjective } from './dual.js';

const TAU=2*Math.PI;
const colors={mint:'#d4f1aa',cyan:'#80dfe9',orange:'#f4b875',purple:'#c3a4ed',muted:'#8ca3b8',line:'#34485c'};
const fmt=(n,d=4)=>!Number.isFinite(n)?'—':Math.abs(n)<1e-13?'0':Math.abs(n)>=1e4||Math.abs(n)<.001?n.toExponential(2):Number(n.toPrecision(d)).toString();
const complex=z=>z?`${fmt(z.re)} ${z.im<0?'−':'+'} ${fmt(Math.abs(z.im))}i`:'—';
const error=n=>!Number.isFinite(n)?'—':n===0?'0':n.toExponential(2);
const quartet=z=>z?'['+z.map(complex).join(' : ')+']':'—';
const word=(ctx,text,x,y,color=colors.muted,align='center',font='9px ui-monospace, monospace')=>{
  ctx.fillStyle=color;ctx.textAlign=align;ctx.font=font;ctx.fillText(text,x,y);
};

function canvasContext(canvas){
  const bounds=canvas.getBoundingClientRect(),w=Math.max(1,bounds.width),h=Math.max(1,bounds.height),dpr=Math.min(window.devicePixelRatio||1,2);
  const W=Math.round(w*dpr),H=Math.round(h*dpr);
  if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
  const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
  const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#111f2d');bg.addColorStop(1,'#0c1322');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
  return {ctx,w,h};
}

const yaw=.4,pitch=.25;
function project(v,cx,cy,r){
  const depth=Math.cos(yaw)*v.x-Math.sin(yaw)*v.y;
  return {x:cx+r*(Math.sin(yaw)*v.x+Math.cos(yaw)*v.y),
    y:cy-r*(Math.cos(pitch)*v.z-Math.sin(pitch)*depth),
    depth:Math.cos(pitch)*depth+Math.sin(pitch)*v.z};
}
function curve(ctx,points,cx,cy,r,color,width=1){
  for(const front of [false,true]){
    ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=front?.85:.25;ctx.setLineDash(front?[]:[3,4]);let begun=false;
    for(const v of points){const p=project(v,cx,cy,r);if((p.depth>=0)!==front){begun=false;continue;}if(begun)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);begun=true;}
    ctx.stroke();
  }
  ctx.globalAlpha=1;ctx.setLineDash([]);
}
function dot(ctx,p,color,r=4){
  ctx.beginPath();ctx.arc(p.x,p.y,r+3,0,TAU);ctx.fillStyle=color+'22';ctx.fill();
  ctx.beginPath();ctx.arc(p.x,p.y,r,0,TAU);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#10202d';ctx.lineWidth=1;ctx.stroke();
}
function arrow(ctx,a,b,color,width=1.5){
  const dx=b.x-a.x,dy=b.y-a.y,length=Math.hypot(dx,dy);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;
  ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
  if(length>7){const angle=Math.atan2(dy,dx);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-6*Math.cos(angle-.42),b.y-6*Math.sin(angle-.42));ctx.lineTo(b.x-6*Math.cos(angle+.42),b.y-6*Math.sin(angle+.42));ctx.closePath();ctx.fill();}
}
function sphere(ctx,cx,cy,r,color){
  const grad=ctx.createRadialGradient(cx-r*.3,cy-r*.4,r*.1,cx,cy,r);grad.addColorStop(0,'#263f4c');grad.addColorStop(.7,'#172b3b');grad.addColorStop(1,'#0d1a29');
  ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle=grad;ctx.fill();ctx.strokeStyle='#426071';ctx.lineWidth=.9;ctx.stroke();
  for(const z of [-.6,0,.6]){const rho=Math.sqrt(1-z*z);curve(ctx,Array.from({length:97},(_,i)=>({x:rho*Math.cos(TAU*i/96),y:rho*Math.sin(TAU*i/96),z})),cx,cy,r,z===0?color:colors.line,z===0?1:.7);}
  for(const a of [0,Math.PI/2])curve(ctx,Array.from({length:97},(_,i)=>({x:Math.cos(a)*Math.cos(TAU*i/96),y:Math.sin(a)*Math.cos(TAU*i/96),z:Math.sin(TAU*i/96)})),cx,cy,r,colors.line,.7);
}
function domainSphere(source){
  if(source?.chartInfinity)return {x:0,y:0,z:1};
  const w=source?.w;
  if(!w||![w.re,w.im].every(Number.isFinite))return null;
  const scale=Math.max(1,Math.abs(w.re),Math.abs(w.im)),x=w.re/scale,y=w.im/scale,t=1/scale,d=x*x+y*y+t*t;
  return {x:2*x*t/d,y:2*y*t/d,z:(x*x+y*y-t*t)/d};
}

/**
 * A geometry-only linked inspector. No function samples are requested, even
 * while the main field is loading or while the spectral-infinity anchor is on.
 */
export class DualPanel {
  constructor(container,{onChange=()=>{},onProbe=()=>{},onPreset=()=>{}}={}){
    if(!container)throw new Error('DualPanel requires a mount element.');
    this.container=container;this.onChange=onChange;this.onProbe=onProbe;this.onPreset=onPreset;
    this.state=null;this.probe=null;this.source=null;this.snapshot=null;this.sourceKey=null;this.message='';
    container.classList.add('dual-workbench');container.hidden=true;
    container.innerHTML=`
      <header class="dual-heading"><div><span class="dual-eyebrow">POINT & TANGENT HYPERPLANE</span><h3>The dual view of the elliptic curve.</h3><p>Keep the point fixed and explore every projective hyperplane containing its tangent line. The two spheres below show the source coordinate and the family parameter.</p></div><span class="dual-pill">ℂℙ³ × (ℂℙ³)*<br>W · Z = 0</span></header>
      <div class="dual-controls">
        <label><span>Source point</span><select data-dual-control="dualAnchor" aria-label="Dual geometry source point"><option value="probe">Selected surface point</option><option value="infinity">Spectral infinity · p±</option><option value="antiBridge">Anti-bridge · q±</option><option value="branch">Branch point · w = i/r</option><option value="chartInfinity">Reciprocal chart · w = ∞</option></select></label>
        <label><span>Sheet</span><select data-dual-control="dualSheet" aria-label="Elliptic sheet for dual geometry"><option value="1">Source lift</option><option value="-1">Deck partner · η → −η</option></select></label>
        <label><span>Family latitude θ <output data-dual="thetaValue"></output></span><input type="range" min="0" max="${Math.PI}" step="0.005" data-dual-control="dualTheta" aria-label="Conormal family latitude theta"></label>
        <label><span>Relative phase φ <output data-dual="phiValue"></output></span><input type="range" min="0" max="${TAU}" step="0.005" data-dual-control="dualPhi" aria-label="Conormal family relative phase phi"></label>
      </div>
      <div class="dual-grid">
        <article><div class="dual-mini-heading"><span>SOURCE & FAMILY</span><span data-dual="anchorTag">LINKED GEOMETRY</span></div><canvas data-dual="geometryCanvas" aria-label="Source coordinate sphere and conormal family sphere; click the right sphere to choose a family member"></canvas><p class="dual-caption">Left: the projection w of the chosen elliptic point. Right: [α:β] parametrizes its tangent hyperplanes. Click the right sphere, or use θ and φ.</p></article>
        <article><div class="dual-mini-heading"><span>COMPLEX HOMOGENEOUS COORDINATES</span><span>UNIT REPRESENTATIVES</span></div><canvas data-dual="coeffCanvas" aria-label="Four normalized complex coordinates of the source Z and four dual hyperplane coefficients W"></canvas><p class="dual-caption">Each disk is one complex coefficient: horizontal is real, vertical is imaginary. Z and W are normalized independently; the marked coefficient fixes each local phase gauge.</p></article>
      </div>
      <div class="dual-status" data-dual="status" role="status"></div>
      <div class="dual-metrics" aria-label="Conormal geometry residuals"><div><span>POINT INCIDENCE · |W · Z|</span><strong data-dual="pointResidual">—</strong></div><div><span>TANGENT INCIDENCE · |W · T|</span><strong data-dual="tangentResidual">—</strong></div><div><span>ELLIPTIC EQUATIONS · MAX |Qᵢ|</span><strong data-dual="curveResidual">—</strong></div><div><span>FAMILY SEPARATION · SIN ANGLE</span><strong data-dual="separation">—</strong></div></div>
      <div class="dual-actions"><span>FAMILY MEMBERS</span><button type="button" data-dual-action="first">dQ₁</button><button type="button" data-dual-action="equal">dQ₁ + dQ₂</button><button type="button" data-dual-action="imaginary">dQ₁ + i dQ₂</button><button type="button" data-dual-action="second">dQ₂</button><span class="dual-action-spacer"></span><button type="button" data-dual-action="zero">Inspect first ξ zero</button><button type="button" data-dual-action="surface">Show source on surface</button></div>
      <div class="dual-coordinates"><div><span data-dual="sourceLabel">SOURCE Z</span><strong data-dual="sourceCoordinates">—</strong></div><div><span>DUAL W = α dQ₁ + β dQ₂</span><strong data-dual="dualCoordinates">—</strong></div><small data-dual="coordinateNote"></small></div>
      <details class="dual-details"><summary>What this dual construction represents</summary><p>Q₁ = X₁² − X₀X₂ and Q₂ = X₃² − X₀² − (r² + r⁻²)X₁² − X₂². Their gradients span the projective conormal. The family uses α = cos(θ/2), β = exp(iφ) sin(θ/2), in this stated equation basis. The pair (Z,W) lies in the complex five-dimensional point–hyperplane incidence variety. The drawings show coordinate spheres and coefficient disks, not a literal three-dimensional hyperplane in ℂℙ³.</p><p>T is a unit projective tangent, chosen perpendicular to Z using the standard Hermitian norm. The two incidence tests use the complex bilinear pairing, with no conjugation. These residuals are floating-point diagnostics. The construction does not choose a unique normal or a phase-gradient direction, and it does not regularize ξ at infinity.</p></details>`;
    this.el=Object.fromEntries([...container.querySelectorAll('[data-dual]')].map(el=>[el.dataset.dual,el]));
    this.controls=Object.fromEntries([...container.querySelectorAll('[data-dual-control]')].map(el=>[el.dataset.dualControl,el]));
    this.actions=Object.fromEntries([...container.querySelectorAll('[data-dual-action]')].map(el=>[el.dataset.dualAction,el]));
    for(const [key,el]of Object.entries(this.controls)){
      el.addEventListener(el.tagName==='SELECT'?'change':'input',()=>this.onChange(key,typeof DUAL_DEFAULTS[key]==='number'?Number(el.value):el.value));
    }
    const family=(theta,phi=0)=>{this.onChange('dualTheta',theta);this.onChange('dualPhi',phi);};
    this.actions.first.onclick=()=>family(0);this.actions.equal.onclick=()=>family(Math.PI/2);
    this.actions.imaginary.onclick=()=>family(Math.PI/2,Math.PI/2);this.actions.second.onclick=()=>family(Math.PI);
    this.actions.zero.onclick=()=>{this.onChange('dualAnchor','probe');this.onProbe({sigma:.5,t:14.1347251417347});};
    this.actions.surface.onclick=()=>{const point=this.source?.spectralCoordinate;if(point&&Number.isFinite(point.sigma)&&Number.isFinite(point.t)){this.onChange('dualAnchor','probe');this.onProbe({...point});}};
    this.el.geometryCanvas.addEventListener('pointerdown',event=>this.pickFamily(event));
    if(typeof ResizeObserver!=='undefined'){
      this.resizeObserver=new ResizeObserver(()=>{cancelAnimationFrame(this.resizeFrame);this.resizeFrame=requestAnimationFrame(()=>this.redraw());});
      this.resizeObserver.observe(container);
    }
  }
  update(state,probe){
    this.state={...state,...normalizeDualConfig(state)};this.probe={...probe};this.message='';
    if(this.state.dualMode!=='conormal'){this.sync();return;}
    const s=this.state,key=[s.dualAnchor,s.torusR,s.chartScale,s.dualAnchor==='probe'?probe?.sigma:'',s.dualAnchor==='probe'?probe?.t:''].join('|');
    if(key!==this.sourceKey){this.source=dualSourceFromProbe(s,probe);this.sourceKey=key;}
    this.snapshot=this.source?.valid?conormalFromProjective(this.source,{theta:s.dualTheta,phi:s.dualPhi,sheet:s.dualSheet}):this.source;
    this.sync();this.redraw();
  }
  hold(state,probe,message=''){
    // Geometry remains available independently of scalar sampling and playback.
    this.update(state,probe);this.message=message;this.sync();
  }
  sync(){
    const s=this.state,p=this.snapshot;this.container.hidden=!s||s.dualMode!=='conormal';if(this.container.hidden)return;
    for(const [key,el]of Object.entries(this.controls))el.value=String(s[key]);
    this.el.thetaValue.textContent=`${fmt(s.dualTheta/Math.PI,3)}π`;
    this.el.phiValue.textContent=`${fmt(s.dualPhi/Math.PI,3)}π`;
    this.el.anchorTag.textContent=s.dualAnchor==='probe'?'LINKED POINT':s.dualAnchor==='infinity'?'EXACT PUNCTURE GEOMETRY':'EXACT GEOMETRIC ANCHOR';
    this.el.sourceLabel.textContent='SOURCE Z · '+(this.source?.label||'unresolved');
    const text=p?.valid?(p.sourceSpectralInfinity?
      'The elliptic point and every member of its conormal family are regular here. The ξ field remains undefined at spectral infinity; no limiting value is assigned.':
      s.dualAnchor==='branch'?'The sheets meet at this branch point. The elliptic curve and its tangent hyperplane family remain smooth.':
      'Every selected W contains the same point Z and its tangent line. Changing the family member does not move the point or the zeros of ξ.'):
      'The geometric source is unresolved. Choose an exact anchor or inspect another finite surface point.';
    this.el.status.textContent=text+(this.message?' Geometry is available while the main field is held.':'');
    this.el.status.classList.toggle('dual-status-warn',!p?.valid);
    this.el.pointResidual.textContent=error(p?.pointResidual);this.el.tangentResidual.textContent=error(p?.tangentResidual);
    this.el.curveResidual.textContent=error(p?.valid?Math.max(...Object.values(p.quadricResiduals)):NaN);
    this.el.separation.textContent=p?.valid?fmt(p.familySeparation):'—';
    this.el.sourceCoordinates.textContent=quartet(p?.sourceCoordinates);this.el.dualCoordinates.textContent=quartet(p?.dualCoordinates);
    const point=this.source?.spectralCoordinate;
    this.el.coordinateNote.textContent=p?.valid?`${point?'s = '+complex({re:point.sigma,im:point.t}):'s = ∞ · scalar field not evaluated'} · [α:β] = [${complex(p.family.alpha)} : ${complex(p.family.beta)}] · r = ${fmt(s.torusR??2)} · independent local gauges Z${p.gaugeIndex}, W${p.dualGaugeIndex}`:`Status: ${p?.status||'awaiting-point'}`;
    this.actions.surface.disabled=!point||!Number.isFinite(point.sigma)||!Number.isFinite(point.t);
    this.actions.surface.title=this.actions.surface.disabled?'Spectral infinity has no finite point to evaluate.':'Inspect this finite coordinate on the main surface.';
    for(const [name,theta,phi]of[['first',0,0],['equal',Math.PI/2,0],['imaginary',Math.PI/2,Math.PI/2],['second',Math.PI,0]]){
      const active=Math.abs(s.dualTheta-theta)<.008&&(theta===0||theta===Math.PI||Math.abs(s.dualPhi-phi)<.008);
      this.actions[name].classList.toggle('active',active);this.actions[name].setAttribute('aria-pressed',String(active));
    }
  }
  redraw(){if(this.container.hidden)return;this.drawGeometry();this.drawCoefficients();}
  drawGeometry(){
    const {ctx,w,h}=canvasContext(this.el.geometryCanvas),p=this.snapshot;
    const r=Math.min(w*.195,h*.285),cy=h*.48,left=w*.25,right=w*.75;
    sphere(ctx,left,cy,r,colors.cyan);sphere(ctx,right,cy,r,colors.purple);
    word(ctx,'SOURCE · w ∈ ℂℙ¹',left,25,colors.cyan);word(ctx,'FAMILY · [α:β]',right,25,colors.purple);
    word(ctx,'chosen elliptic sheet',left,h-22);word(ctx,'tangent hyperplanes at Z',right,h-22);
    this.familyHit={cx:right,cy,r};
    const sourcePoint=domainSphere(this.source);
    const atInfinity=project({x:1,y:0,z:0},left,cy,r),atBridge=project({x:-1,y:0,z:0},left,cy,r);
    dot(ctx,atInfinity,colors.orange,2.4);dot(ctx,atBridge,colors.purple,2.4);
    if(w>370){word(ctx,'p',atInfinity.x+7,atInfinity.y-5,colors.orange,'left');word(ctx,'q',atBridge.x-8,atBridge.y+12,colors.purple,'right');}
    if(sourcePoint){const v=project(sourcePoint,left,cy,r);arrow(ctx,{x:left,y:cy},v,colors.cyan);dot(ctx,v,colors.cyan,4.5);}
    word(ctx,'dQ₁',right,cy-r-10,colors.orange);word(ctx,'dQ₂',right,cy+r+19,colors.mint);
    if(p?.valid){
      const theta=p.family.theta,phi=p.family.phi;
      curve(ctx,Array.from({length:97},(_,i)=>({x:Math.sin(theta)*Math.cos(TAU*i/96),y:Math.sin(theta)*Math.sin(TAU*i/96),z:Math.cos(theta)})),right,cy,r,'#be9add',1.2);
      curve(ctx,Array.from({length:97},(_,i)=>({x:Math.sin(Math.PI*i/96)*Math.cos(phi),y:Math.sin(Math.PI*i/96)*Math.sin(phi),z:Math.cos(Math.PI*i/96)})),right,cy,r,'#718b8b',.9);
      const v=project(p.family.sphere,right,cy,r);arrow(ctx,{x:right,y:cy},v,colors.mint);dot(ctx,v,colors.mint,4.5);
      ctx.setLineDash([3,4]);ctx.strokeStyle='#49616b';ctx.beginPath();ctx.moveTo(left+r+6,cy);ctx.lineTo(right-r-6,cy);ctx.stroke();ctx.setLineDash([]);
      word(ctx,'fixed Z',w*.5,cy-10,colors.muted,'center','8px ui-monospace, monospace');
    }else word(ctx,'Choose a source point',w/2,h-45,colors.muted);
  }
  drawCoefficients(){
    const {ctx,w,h}=canvasContext(this.el.coeffCanvas),p=this.snapshot;
    const margin=17,cell=(w-2*margin)/4,r=Math.min(26,cell*.33,h*.12);
    for(const [row,name,coordinates,color,gauge]of[[0,'Z',p?.sourceCoordinates,colors.cyan,p?.gaugeIndex],[1,'W',p?.dualCoordinates,colors.mint,p?.dualGaugeIndex]]){
      const cy=row===0?h*.32:h*.75;
      word(ctx,row===0?'SOURCE · Z':'DUAL HYPERPLANE · W',margin,cy-r-24,color,'left','8px ui-monospace, monospace');
      for(let i=0;i<4;i++){
        const cx=margin+(i+.5)*cell,z=coordinates?.[i];
        ctx.strokeStyle='#2f465a';ctx.lineWidth=.8;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();
        ctx.strokeStyle='#22364a';ctx.beginPath();ctx.moveTo(cx-r-4,cy);ctx.lineTo(cx+r+4,cy);ctx.moveTo(cx,cy-r-4);ctx.lineTo(cx,cy+r+4);ctx.stroke();
        if(z){
          const phase=Math.atan2(z.im,z.re),m=Math.hypot(z.re,z.im);
          if(m>1e-12){ctx.beginPath();ctx.arc(cx,cy,r+3,0,-phase,phase>0);ctx.strokeStyle=row?'#8eab7480':'#63adbb80';ctx.lineWidth=2;ctx.stroke();}
          const end={x:cx+r*z.re,y:cy-r*z.im};arrow(ctx,{x:cx,y:cy},end,color,1.7);dot(ctx,end,color,2.5);
          word(ctx,fmt(m,3),cx,cy+r+29,colors.muted,'center','8px ui-monospace, monospace');
        }
        word(ctx,name+i+(gauge===i?' *':''),cx,cy+r+16,gauge===i?colors.orange:color,'center','9px ui-monospace, monospace');
      }
    }
    if(!p?.valid){ctx.fillStyle='#0a1424b0';ctx.fillRect(0,0,w,h);word(ctx,'Geometric coordinates unresolved',w/2,h/2);}
  }
  pickFamily(event){
    if(!this.familyHit||!this.snapshot?.valid)return;
    const rect=this.el.geometryCanvas.getBoundingClientRect(),{cx,cy,r}=this.familyHit;
    const right=(event.clientX-rect.left-cx)/r,up=-(event.clientY-rect.top-cy)/r,d2=right*right+up*up;
    if(d2>1)return;
    // Invert the same orthographic camera on its visible hemisphere.
    const forward=Math.sqrt(Math.max(0,1-d2)),depth=Math.cos(pitch)*forward-Math.sin(pitch)*up,z=Math.sin(pitch)*forward+Math.cos(pitch)*up;
    const x=Math.sin(yaw)*right+Math.cos(yaw)*depth,y=Math.cos(yaw)*right-Math.sin(yaw)*depth;
    const theta=Math.acos(Math.max(-1,Math.min(1,z))),phi=(Math.atan2(y,x)+TAU)%TAU;
    this.onChange('dualTheta',theta);this.onChange('dualPhi',phi);
  }
  flush(){}
  pause(){}
  destroy(){this.resizeObserver?.disconnect();if(this.resizeFrame)cancelAnimationFrame(this.resizeFrame);}
}
