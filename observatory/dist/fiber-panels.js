import { spinorFromProjective } from './spinor.js';
import { twistorFromProjective } from './twistor.js';

const TAU=2*Math.PI;
const palette={mint:'#d4f1aa',cyan:'#80dfe9',orange:'#f4b875',purple:'#c3a4ed',muted:'#8198af',line:'#34485c'};
const vec=p=>Array.isArray(p)?{x:p[0],y:p[1],z:p[2]}:p;
const norm2=z=>z.reduce((sum,p)=>sum+p.re*p.re+p.im*p.im,0);
const fmt=(n,digits=4)=>!Number.isFinite(n)?'—':Math.abs(n)<1e-12?'0':Math.abs(n)>=1e4||Math.abs(n)<.001?n.toExponential(2):Number(n.toPrecision(digits)).toString();
const complex=z=>!z?'—':`${fmt(z.re)} ${z.im<0?'−':'+'} ${fmt(Math.abs(z.im))}i`;
const maxResidual=r=>r?Math.max(...Object.values(r).filter(Number.isFinite)):NaN;
const sourceLabel=state=>({domain:'domain [s₀−1:s₀]',bridge:'shifted pair [U:V]',derivative:'derivative [G:ℓG′]'})[state.projectiveChannel]||'selected projective state';
const finiteVec=p=>p&&[p.x,p.y,p.z].every(Number.isFinite);

function context(canvas){
 const {width,height}=canvas.getBoundingClientRect(),w=Math.max(1,width),h=Math.max(1,height),dpr=Math.min(window.devicePixelRatio||1,2);
 const W=Math.round(w*dpr),H=Math.round(h*dpr);if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
 const bg=ctx.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#111d2b');bg.addColorStop(1,'#0b1321');ctx.fillStyle=bg;ctx.fillRect(0,0,w,h);
 return {ctx,w,h};
}

// A fixed orthographic view of R³. For the twistor base only the explicitly
// named three R⁴ coordinates are supplied; the fourth has its own readout.
function project(p,cx,cy,r){
 p=vec(p);const sy=Math.sin(.48),co=Math.cos(.48),sp=Math.sin(.29),cp=Math.cos(.29);
 const depth=co*p.x-sy*p.y;
 return {x:cx+r*(sy*p.x+co*p.y),y:cy-r*(cp*p.z-sp*depth),depth:cp*depth+sp*p.z};
}
function label(ctx,text,x,y,color=palette.muted,{align='center',font='9px ui-monospace, monospace'}={}){
 ctx.font=font;ctx.textAlign=align;ctx.fillStyle=color;ctx.fillText(text,x,y);
}
function path3(ctx,points,cx,cy,r,color,width=1,opacity=1){
 if(points.length<2)return;
 for(const front of [false,true]){
  ctx.beginPath();ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=(front?.9:.28)*opacity;ctx.setLineDash(front?[]:[3,4]);let begun=false;
  for(const point of points){const p=project(point,cx,cy,r);if((p.depth>=0)!==front){begun=false;continue;}if(begun)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);begun=true;}
  ctx.stroke();
 }
 ctx.globalAlpha=1;ctx.setLineDash([]);
}
function arrow(ctx,a,b,color,width=1.5){
 const angle=Math.atan2(b.y-a.y,b.x-a.x);ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=width;
 ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
 ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(b.x-7*Math.cos(angle-.4),b.y-7*Math.sin(angle-.4));ctx.lineTo(b.x-7*Math.cos(angle+.4),b.y-7*Math.sin(angle+.4));ctx.closePath();ctx.fill();
}
function dot(ctx,p,color,size=4,hollow=false){
 ctx.beginPath();ctx.arc(p.x,p.y,size,0,TAU);ctx.fillStyle=color;ctx.strokeStyle=color;ctx.lineWidth=1.3;
 if(hollow)ctx.stroke();else{ctx.fill();ctx.strokeStyle='#0b1420';ctx.lineWidth=1;ctx.stroke();}
}
function sphere(ctx,cx,cy,r){
 const g=ctx.createRadialGradient(cx-r*.3,cy-r*.35,r*.1,cx,cy,r);g.addColorStop(0,'#203846');g.addColorStop(.8,'#142432');g.addColorStop(1,'#0d1826');
 ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fillStyle=g;ctx.fill();ctx.strokeStyle='#3c5669';ctx.lineWidth=.9;ctx.stroke();
 const n=96;
 for(const z of [-.6,0,.6]){const rad=Math.sqrt(1-z*z);path3(ctx,Array.from({length:n+1},(_,i)=>({x:rad*Math.cos(TAU*i/n),y:rad*Math.sin(TAU*i/n),z})),cx,cy,r,z===0?'#5a7a81':palette.line,z===0?1:.6);}
 for(const a of [0,Math.PI/2])path3(ctx,Array.from({length:n+1},(_,i)=>({x:Math.cos(a)*Math.cos(TAU*i/n),y:Math.sin(a)*Math.cos(TAU*i/n),z:Math.sin(TAU*i/n)})),cx,cy,r,palette.line,.7);
}
function placeholder(ctx,w,h,message){
 ctx.fillStyle='#0a1424bf';ctx.fillRect(0,0,w,h);
 label(ctx,message||'Inspect a point to load this state.',w/2,h/2,palette.muted,{font:'10px ui-monospace, monospace'});
}
function circleAmplitude(ctx,cx,cy,r,z,name,color,reference){
 ctx.strokeStyle='#334b60';ctx.lineWidth=1;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.stroke();
 ctx.strokeStyle='#253a4e';ctx.beginPath();ctx.moveTo(cx-r-7,cy);ctx.lineTo(cx+r+7,cy);ctx.moveTo(cx,cy-r-7);ctx.lineTo(cx,cy+r+7);ctx.stroke();
 if(reference){ctx.setLineDash([3,3]);ctx.strokeStyle='#6c8195';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+r*reference.re,cy-r*reference.im);ctx.stroke();ctx.setLineDash([]);}
 if(z){const p={x:cx+r*z.re,y:cy-r*z.im};arrow(ctx,{x:cx,y:cy},p,color);dot(ctx,p,color,3);}
 label(ctx,name,cx,cy-r-17,color,{font:'14px Georgia, serif'});label(ctx,'Re',cx+r+8,cy+12);label(ctx,'Im',cx+10,cy-r-5);
}

/** Linked pure-coordinate panels. Analytic values are supplied by the caller.
 * update transforms those values, while hold/redraw never fetch or evaluate.
 */
export class FiberPanels {
 constructor(container,{onChange=()=>{}}={}){
  if(!container)throw new Error('FiberPanels requires a mount element.');
  this.container=container;this.onChange=onChange;this.state=null;this.probe=null;this.source=null;this.snapshot=null;this.message='';
  container.classList.add('fiber-workbench');container.hidden=true;
  container.innerHTML=`
   <header class="fiber-heading"><div><span class="fiber-eyebrow">LINKED FIBER GEOMETRY</span><h3 data-fiber="title"></h3><p data-fiber="subtitle"></p></div><span class="fiber-pill" data-fiber="tag"></span></header>
   <div class="fiber-grid">
    <article class="fiber-primary"><div class="mini-heading"><span data-fiber="mainTitle"></span><span data-fiber="mainBadge"></span></div><canvas data-fiber="mainCanvas" aria-label="Geometric base point and frame"></canvas><p class="fiber-caption" data-fiber="mainCaption"></p></article>
    <article class="fiber-secondary"><div class="mini-heading"><span data-fiber="liftTitle"></span><span data-fiber="liftBadge"></span></div><canvas data-fiber="liftCanvas" aria-label="Fiber coordinate and complex representative"></canvas><p class="fiber-caption" data-fiber="liftCaption"></p></article>
   </div>
   <div class="fiber-status" data-fiber="status" role="status"></div>
   <div class="fiber-metrics" aria-label="Coordinate invariants"><div><span data-fiber="metricLabel1"></span><strong data-fiber="metric1">—</strong></div><div><span data-fiber="metricLabel2"></span><strong data-fiber="metric2">—</strong></div><div><span data-fiber="metricLabel3"></span><strong data-fiber="metric3">—</strong></div></div>
   <div class="fiber-actions" data-fiber="spinorActions"><span>SPATIAL ROTATION</span><button type="button" data-rotation="0">0 · reference</button><button type="button" data-rotation="1">2π · one turn</button><button type="button" data-rotation="2">4π · two turns</button><button type="button" data-action="phaseReset">Reset common phase</button></div>
   <div class="fiber-actions" data-fiber="twistorActions"><span>FIBER POINT</span><button type="button" data-fiber-theta="0">Z · elliptic anchor</button><button type="button" data-fiber-theta="0.5">Equator</button><button type="button" data-fiber-theta="1">JZ · opposite point</button><button type="button" data-action="switchChart">Switch S⁴ chart</button></div>
   <div class="fiber-coordinates"><span data-fiber="coordinateLabel"></span><strong data-fiber="coordinate"></strong><small data-fiber="extra"></small></div>
   <details class="fiber-details"><summary data-fiber="detailsTitle"></summary><p data-fiber="details"></p></details>`;
  this.el=Object.fromEntries([...container.querySelectorAll('[data-fiber]')].map(el=>[el.dataset.fiber,el]));
  for(const button of container.querySelectorAll('[data-rotation]'))button.onclick=()=>this.onChange('spinorRotation',Number(button.dataset.rotation)*TAU);
  for(const button of container.querySelectorAll('[data-fiber-theta]'))button.onclick=()=>this.onChange('twistorFiberTheta',Number(button.dataset.fiberTheta)*Math.PI);
  container.querySelector('[data-action="phaseReset"]').onclick=()=>this.onChange('spinorPhase',0);
  container.querySelector('[data-action="switchChart"]').onclick=()=>this.onChange('twistorProjection',this.state?.twistorProjection==='south'?'north':'south');
 }
 update(state,probe,source=this.source){
  this.state={...state};this.probe={...probe};this.source=source;this.message='';this.snapshot=null;
  if(state.playing){this.hold(state,probe,'Buffered playback · pause to inspect');return;}
  if(state.fiberMode==='spinor'){
   const options={phase:state.spinorPhase||0,angle:state.spinorRotation||0,axis:state.spinorAxis||'z'};
   const point=spinorFromProjective(source?.pair,options);
   const path=point.valid?Array.from({length:97},(_,i)=>spinorFromProjective(source.pair,{...options,angle:options.angle*i/96}).bloch):[];
   this.snapshot={kind:'spinor',point,path};
  }else if(state.fiberMode==='twistor'){
   const point=twistorFromProjective(source?.curvePoint,{theta:state.twistorFiberTheta||0,phi:state.twistorFiberPhi||0,projection:state.twistorProjection||'north',pole:4,sheet:state.twistorSheet===-1?-1:1});
   this.snapshot={kind:'twistor',point};
  }
  this.sync();this.redraw();
 }
 hold(state,probe,message='Pause and inspect to update the fiber state.'){
  this.state={...state};this.probe={...probe};this.source=null;this.snapshot=null;this.message=message;
  this.sync();this.redraw();
 }
 sync(){
  const s=this.state||{},spin=s.fiberMode==='spinor',active=spin||s.fiberMode==='twistor';
  this.container.hidden=!active||!s.projective;if(this.container.hidden)return;
  const text=(name,value)=>this.el[name].textContent=value;
  text('title',spin?'A spinor above the point.':'A twistor fiber over S⁴.');
  text('subtitle',spin?`Source: ${sourceLabel(s)}. Follow its normalized representative, common phase, and spatial rotation.`:'The elliptic ℂℙ³ point selects a base point in S⁴. Explore the full ℂℙ¹ fiber above it.');
  text('tag',spin?'S³ → S² · HOPF':'ℂℙ³ → S⁴ · EUCLIDEAN');
  text('mainTitle',spin?'BLOCH POINT & SPIN FRAME':'S⁴ BASE · THREE R⁴ COORDINATES');
  text('mainBadge',spin?'n = ψ†σψ':(s.twistorProjection==='south'?'SOUTH':'NORTH')+' CHART');
  text('liftTitle',spin?'TWO COMPLEX AMPLITUDES':'THE ℂℙ¹ FIBER');
  text('liftBadge',spin?'‖ψ‖² = 1':'SAME S⁴ POINT');
  text('mainCaption',spin?'Mint: Bloch point. Cyan and amber: an oriented tangent frame. Common phase rotates the frame and keeps the Bloch point fixed.':'The picture shows projected coordinates ρ₀, ρ₁, ρ₂. The fourth coordinate ρ₃ has a separate color bar; this is a projection of S⁴.');
  text('liftCaption',spin?'Each arrow is one complex component. Dashed arrows are the source representative; the circles have unit radius.':'The sphere parameterizes the fiber [c:d]. Z is the chosen elliptic anchor; a general fiber representative is a different ℂℙ³ point.');
  text('metricLabel1',spin?'SPINOR NORM ERROR':'S⁴ NORM ERROR');
  text('metricLabel2',spin?'BLOCH NORM ERROR':'S⁴ BASE CHANGE');
  text('metricLabel3',spin?'ROTATION OVERLAP':'ELLIPTIC CURVE RESIDUAL');
  text('coordinateLabel',spin?'NORMALIZED REPRESENTATIVE ψ':'MOVED PROJECTIVE REPRESENTATIVE');
  text('detailsTitle',spin?'What is the chosen spinor?':'Which twistor construction is shown?');
  text('details',spin?'The normalized pair is lifted to a two-component SU(2) spinor. The controls apply eⁱχ exp(−iθ n·σ/2). A 2π spatial rotation changes ψ to −ψ; 4π returns it. Common phase is an S¹ Hopf fiber coordinate. This chosen lift does not specify an intrinsic spinor bundle or Dirac operator on the elliptic surface.':'The ordered coordinates are paired as q₀ = X₀ + jX₁ and q₁ = X₂ + jX₃. This Euclidean real structure defines ℂℙ³ → ℍℙ¹ ≅ S⁴. Right quaternion multiplication moves within the ℂℙ¹ fiber and generally leaves the embedded elliptic curve Eᵣ. Its fiber is distinct from the two sheets of Eᵣ → ℂℙ¹. The reference fixes the largest complex component to a positive real number, so that local gauge can change at chart boundaries. This choice is not a canonical RH or Lorentzian twistor structure.');
  this.el.spinorActions.hidden=!spin;this.el.twistorActions.hidden=spin;
  for(const button of this.container.querySelectorAll('[data-rotation]'))button.classList.toggle('active',Math.abs((s.spinorRotation||0)-Number(button.dataset.rotation)*TAU)<1e-5);
  for(const button of this.container.querySelectorAll('[data-fiber-theta]'))button.classList.toggle('active',Math.abs((s.twistorFiberTheta||0)-Number(button.dataset.fiberTheta)*Math.PI)<1e-5);
  this.readouts();
 }
 readouts(){
  const p=this.snapshot?.point,s=this.state,text=(name,value)=>this.el[name].textContent=value;
  if(this.message||!p?.valid){
   text('status',this.message||'The source point is unresolved. Inspect a finite point with a defined projective state.');
   for(const name of ['metric1','metric2','metric3','coordinate','extra'])text(name,'—');return;
  }
  if(s.fiberMode==='spinor'){
   const n=vec(p.bloch),angle=s.spinorRotation||0;
   text('metric1',fmt(Math.abs(norm2(p.amplitudes)-1)));text('metric2',fmt(Math.abs(n.x*n.x+n.y*n.y+n.z*n.z-1)));
   text('metric3',complex(p.rotationOverlap||p.overlap));
   text('coordinate',`(${complex(p.amplitudes[0])}, ${complex(p.amplitudes[1])})`);
   text('extra',`χ = ${fmt((s.spinorPhase||0)/Math.PI)}π · θ = ${fmt(angle/Math.PI)}π about ${s.spinorAxis||'z'} · ⟨ψ₀,ψ⟩ = ${complex(p.overlap)}`+(p.sourceUnresolved?' · source diagnostic unresolved':''));
   text('status',Math.abs(angle-TAU)<1e-5?'One spatial turn: the Bloch point and frame return, while the spinor changes sign.':Math.abs(angle-2*TAU)<1e-5?'Two spatial turns: the spinor returns to its phase-adjusted reference.':'Common phase changes the representative. Spatial rotation moves its Bloch point through the SU(2) action.');
  }else{
   const x=p.s4||[],proj=p.projected;
   text('metric1',fmt(Math.abs(x.reduce((sum,v)=>sum+v*v,0)-1)));text('metric2',fmt(p.invarianceError));text('metric3',fmt(maxResidual(p.curveResiduals)));
   text('coordinate','['+(p.coordinates||[]).map(complex).join(' : ')+']');
   text('extra',`S⁴ = (${x.map(v=>fmt(v)).join(', ')}) · source Eᵣ residual ${fmt(maxResidual(p.sourceCurveResiduals))}`);
   const residual=maxResidual(p.curveResiduals),atAnchor=Math.abs(s.twistorFiberTheta||0)<1e-9;
   text('status',!proj?.valid?'This stereographic chart reaches its pole. Switch the S⁴ chart; the projective point remains defined.':atAnchor?'At Z: the fiber representative is the elliptic anchor. Moving along the fiber preserves the S⁴ base.':residual>1e-8?'The S⁴ base stays fixed. This fiber representative has left the elliptic curve Eᵣ.':'The S⁴ base stays fixed. The curve residual is a numerical check at this fiber point.');
  }
 }
 redraw(){
  if(this.container.hidden||!this.state)return;
  const main=context(this.el.mainCanvas),lift=context(this.el.liftCanvas);
  if(this.state.fiberMode==='spinor'){this.drawSpinor(main);this.drawAmplitudes(lift);}
  else{this.drawTwistorBase(main);this.drawTwistorFiber(lift);}
  if(this.message||!this.snapshot?.point?.valid){for(const {ctx,w,h} of [main,lift])placeholder(ctx,w,h,this.message?'Pause / Inspect to update':'Projective source unresolved');}
 }
 drawSpinor({ctx,w,h}){
  const cx=w*.5,cy=h*.49,r=Math.min(w*.33,h*.34);sphere(ctx,cx,cy,r);
  const point=this.snapshot?.point;if(!point?.valid)return;
  const n=vec(point.bloch);path3(ctx,this.snapshot.path,cx,cy,r,palette.purple,2,.9);
  const axis=vec(point.axis);if(finiteVec(axis)){
   const a=project({x:-axis.x*1.15,y:-axis.y*1.15,z:-axis.z*1.15},cx,cy,r),b=project({x:axis.x*1.15,y:axis.y*1.15,z:axis.z*1.15},cx,cy,r);
   ctx.setLineDash([4,4]);ctx.strokeStyle='#63768b';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.setLineDash([]);label(ctx,this.state.spinorAxis||'z',b.x+8,b.y,palette.muted);
  }
  const end=project(n,cx,cy,r);arrow(ctx,{x:cx,y:cy},end,palette.mint,1.7);dot(ctx,end,palette.mint,4.5);
  if(point.frame)for(const [name,color]of[['e1',palette.cyan],['e2',palette.orange]]){
   const e=vec(point.frame[name]);if(!finiteVec(e))continue;
   const tip=project({x:n.x+.34*e.x,y:n.y+.34*e.y,z:n.z+.34*e.z},cx,cy,r);arrow(ctx,end,tip,color,1.6);label(ctx,name==='e1'?'e₁':'e₂',tip.x+7,tip.y-5,color);
  }
  label(ctx,'n',end.x+10,end.y+13,palette.mint);label(ctx,'−ψ and ψ share this Bloch point',w/2,h-12,palette.muted);
 }
 drawAmplitudes({ctx,w,h}){
  const p=this.snapshot?.point,r=Math.min(w*.19,h*.21),cy=h*.42;
  circleAmplitude(ctx,w*.27,cy,r,p?.valid?p.amplitudes[0]:null,'ψ₀',palette.cyan,p?.baseAmplitudes?.[0]);
  circleAmplitude(ctx,w*.73,cy,r,p?.valid?p.amplitudes[1]:null,'ψ₁',palette.orange,p?.baseAmplitudes?.[1]);
  const left=w*.14,right=w*.86,y=h*.79;
  ctx.strokeStyle='#4d6175';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(left,y);ctx.lineTo(right,y);ctx.stroke();
  for(const [fraction,labelText,color]of[[0,'ψ',palette.mint],[.5,'−ψ',palette.purple],[1,'ψ',palette.mint]]){
   const x=left+(right-left)*fraction;dot(ctx,{x,y},color,3,true);label(ctx,labelText,x,y-11,color,{font:'13px Georgia, serif'});label(ctx,fraction===0?'0':fraction===.5?'2π':'4π',x,y+17);
  }
  const progress=Math.max(0,Math.min(1,(this.state.spinorRotation||0)/(2*TAU)));dot(ctx,{x:left+(right-left)*progress,y},palette.mint,4.5);
 }
 drawTwistorBase({ctx,w,h}){
  const p=this.snapshot?.point,coords=p?.projected?.coordinates,cx=w*.5,cy=h*.44,r=Math.min(w*.29,h*.28);
  if(!coords?.every(Number.isFinite)||!p.projected.valid){
   for(const [axis,name]of[[{x:1,y:0,z:0},'ρ₀'],[{x:0,y:1,z:0},'ρ₁'],[{x:0,y:0,z:1},'ρ₂']]){const end=project(axis,cx,cy,r);arrow(ctx,{x:cx,y:cy},end,palette.line,1);label(ctx,name,end.x+10,end.y);}
   if(p?.valid)label(ctx,'Chart pole · switch North / South',w/2,h*.73,palette.orange);return;
  }
  const extent=Math.max(1,...coords.slice(0,3).map(Math.abs));
  for(let a=-1;a<=1;a+=.5){const start=project({x:a,y:-1,z:0},cx,cy,r),end=project({x:a,y:1,z:0},cx,cy,r);ctx.strokeStyle='#23394b';ctx.beginPath();ctx.moveTo(start.x,start.y);ctx.lineTo(end.x,end.y);ctx.stroke();const b=project({x:-1,y:a,z:0},cx,cy,r),c=project({x:1,y:a,z:0},cx,cy,r);ctx.beginPath();ctx.moveTo(b.x,b.y);ctx.lineTo(c.x,c.y);ctx.stroke();}
  for(const [axis,name,color]of[[{x:1,y:0,z:0},'ρ₀',palette.cyan],[{x:0,y:1,z:0},'ρ₁',palette.orange],[{x:0,y:0,z:1},'ρ₂',palette.purple]]){
   const negative=project({x:-axis.x,y:-axis.y,z:-axis.z},cx,cy,r),positive=project(axis,cx,cy,r);
   arrow(ctx,negative,positive,color,.8);label(ctx,name,positive.x+9,positive.y-7,color);
  }
  const position={x:coords[0]/extent,y:coords[1]/extent,z:coords[2]/extent},q=project(position,cx,cy,r);
  ctx.setLineDash([3,4]);ctx.strokeStyle='#849da0';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(q.x,q.y);ctx.stroke();ctx.setLineDash([]);
  dot(ctx,q,palette.cyan,7,true);dot(ctx,q,palette.mint,3.6);label(ctx,'fixed base',q.x+12,q.y-8,palette.mint,{align:'left'});
  label(ctx,`axis ends ±${fmt(extent)}`,w/2,15);
  const bx=w*.16,by=h*.78,bw=w*.68;
  const gradient=ctx.createLinearGradient(bx,0,bx+bw,0);gradient.addColorStop(0,palette.purple);gradient.addColorStop(.5,'#4d6a7c');gradient.addColorStop(1,palette.orange);
  ctx.fillStyle=gradient;ctx.fillRect(bx,by,bw,4);
  const fourthScale=Math.max(1,Math.abs(coords[3])),pos=bx+bw*(.5+.5*coords[3]/fourthScale);
  dot(ctx,{x:pos,y:by+2},palette.mint,4);label(ctx,'ρ₃ = '+fmt(coords[3])+' · omitted spatial coordinate',w/2,by+23,palette.muted);
  label(ctx,'ρ = ('+coords.map(v=>fmt(v,3)).join(', ')+')',w/2,h-8,palette.muted,{font:'8px ui-monospace, monospace'});
 }
 drawTwistorFiber({ctx,w,h}){
  const cx=w*.5,cy=h*.46,r=Math.min(w*.31,h*.31);sphere(ctx,cx,cy,r);
  const p=this.snapshot?.point,top=project({x:0,y:0,z:1},cx,cy,r),bottom=project({x:0,y:0,z:-1},cx,cy,r);
  dot(ctx,top,palette.cyan,3.4);label(ctx,'Z',top.x+10,top.y-5,palette.cyan);
  dot(ctx,bottom,palette.orange,3.4);label(ctx,'JZ',bottom.x+13,bottom.y+13,palette.orange);
  if(p?.valid&&p.fiber?.bloch){const n=vec(p.fiber.bloch),end=project(n,cx,cy,r);arrow(ctx,{x:cx,y:cy},end,palette.mint,1.6);dot(ctx,end,palette.mint,4.5);label(ctx,'[c:d]',end.x+16,end.y-6,palette.mint);}
  label(ctx,'[cos(θ/2) : eⁱφ sin(θ/2)]',w/2,h-24,palette.muted);
  label(ctx,'Changing the fiber keeps the S⁴ base fixed.',w/2,h-9,palette.muted,{font:'8px ui-monospace, monospace'});
 }
}
