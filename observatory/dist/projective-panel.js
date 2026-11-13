import { evaluatePolar } from './math.js';
import { domainFor, withinDomain } from './domain.js';
import { torusInverse, torusPoint } from './elliptic.js';
import { domainProjective, pairSphereFromPolar, derivativeProjective, torusProjective } from './projective.js';

const TAU=2*Math.PI,$=id=>document.getElementById(id);
const COLORS={mint:'#d1f1a8',cyan:'#7bdeef',orange:'#f3b462',purple:'#c4acec',muted:'#8396ac',line:'#304457'};
const format=n=>!Number.isFinite(n)?'∞':Math.abs(n)<1e-11?'0':Math.abs(n)>=1e4||Math.abs(n)<.001?n.toExponential(3):Number(n.toPrecision(5)).toString();
const complex=z=>!z?'∞':Math.abs(z.im)<1e-11?format(z.re):`${format(z.re)} ${z.im<0?'−':'+'} ${format(Math.abs(z.im))}i`;
function canvasContext(canvas){
 const rect=canvas.getBoundingClientRect(),dpr=Math.min(window.devicePixelRatio||1,2),w=Math.max(1,rect.width),h=Math.max(1,rect.height);
 const W=Math.round(w*dpr),H=Math.round(h*dpr);if(canvas.width!==W||canvas.height!==H){canvas.width=W;canvas.height=H;}
 const ctx=canvas.getContext('2d');ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);return {ctx,w,h};
}
// A fixed orthographic camera. This is a view of the sphere, not extra
// projective dimensions: right/up/forward form an orthonormal frame.
function project(n,cx,cy,r){
 const yaw=.28,pitch=.22,s=Math.sin(yaw),c=Math.cos(yaw),sp=Math.sin(pitch),cp=Math.cos(pitch);
 const right=s*n.x+c*n.y,depth=c*n.x-s*n.y,up=cp*n.z-sp*depth;
 return {x:cx+r*right,y:cy-r*up,depth:cp*depth+sp*n.z};
}
function curve(ctx,points,cx,cy,r,color,width=1){
 for(const front of [false,true]){
  ctx.strokeStyle=color;ctx.lineWidth=width;ctx.globalAlpha=front?.8:.3;ctx.setLineDash(front?[]:[3,4]);ctx.beginPath();let active=false;
  for(const n of points){const p=project(n,cx,cy,r);if((p.depth>=0)!==front){active=false;continue;}if(active)ctx.lineTo(p.x,p.y);else ctx.moveTo(p.x,p.y);active=true;}
  ctx.stroke();
 }
 ctx.setLineDash([]);ctx.globalAlpha=1;
}
function wireSphere(ctx,cx,cy,r,tint=COLORS.cyan){
 const grad=ctx.createRadialGradient(cx-r*.3,cy-r*.35,r*.08,cx,cy,r);grad.addColorStop(0,'#243b47');grad.addColorStop(.75,'#122333');grad.addColorStop(1,'#0c1623');
 ctx.fillStyle=grad;ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.strokeStyle='#3e5965';ctx.lineWidth=.8;ctx.stroke();
 for(const z of [-.6,0,.6]){const rad=Math.sqrt(1-z*z);curve(ctx,Array.from({length:121},(_,i)=>({x:rad*Math.cos(i*TAU/120),y:rad*Math.sin(i*TAU/120),z})),cx,cy,r,z===0?tint:COLORS.line,z===0?1.1:.6);}
 for(const a of [0,Math.PI/2])curve(ctx,Array.from({length:121},(_,i)=>({x:Math.cos(a)*Math.cos(i*TAU/120),y:Math.sin(a)*Math.cos(i*TAU/120),z:Math.sin(i*TAU/120)})),cx,cy,r,COLORS.line,.7);
}
function marker(ctx,n,cx,cy,r,color,label,{radius=3,dx=6,dy=-5}={}){
 const p=project(n,cx,cy,r);ctx.globalAlpha=p.depth>=0?1:.6;
 ctx.beginPath();ctx.arc(p.x,p.y,radius,0,TAU);ctx.fillStyle=color;ctx.fill();ctx.strokeStyle='#0b1420';ctx.lineWidth=1;ctx.stroke();
 if(label){ctx.font='9px ui-monospace, monospace';ctx.fillStyle=color;ctx.textAlign='left';ctx.fillText(label,p.x+dx,p.y+dy);}
 ctx.globalAlpha=1;
}
function wSphere(re,im){const d=1+re*re+im*im;return {x:2*re/d,y:2*im/d,z:(re*re+im*im-1)/d};}
function domainSphere(d){return d?.valid?{x:d.sphere.x,y:-d.sphere.y,z:d.sphere.z}:null;}

/** Inspector calculations run only on an explicit paused-point update.
 * Redraw/hold paths consume geometry and the last record; no analytic work.
 */
export class ProjectivePanel {
 constructor(){this.state=null;this.probe=null;this.snapshot=null;this.message='';}
 hold(state,probe,message){
  this.state={...state};this.probe={...probe};this.snapshot=null;this.message=message;
  if(state.projective)this.redraw();
 }
 update(state,probe){
  this.state={...state};this.probe={...probe};this.message='';
  if(!state.projective)return;
  if(state.playing){this.hold(state,probe,'Buffered playback · pause to inspect');return;}
  const domain=domainProjective(probe.sigma,probe.t,state.chartScale),kind=state.function==='heat'?'heat':'xi';
  const d=domainFor({...state,function:kind});
  const evaluate=(sigma,derivative=false)=>withinDomain(sigma,probe.t,d)?evaluatePolar(sigma,probe.t,kind,state.tau,derivative):null;
  let point=null;
  if(state.projectiveChannel==='domain')point=domain;
  else if(state.projectiveChannel==='bridge')point=pairSphereFromPolar(evaluate(probe.sigma+state.bridgeA),evaluate(probe.sigma-state.bridgeA));
  else point=derivativeProjective(evaluate(probe.sigma,true),state.derivativeScale);
  // Both torus lifts share w. The first exact inverse supplies a local CP3
  // coordinate; the sheet-exchanged point is [X0:X1:X2:-X3].
  const roots=torusInverse(probe.sigma,probe.t,{r:state.torusR,scale:state.chartScale});
  const lifted=roots[0]?torusPoint(roots[0].u,roots[0].v,{r:state.torusR,scale:state.chartScale}):null;
  const curvePoint=lifted?torusProjective(lifted,{r:state.torusR}):null;
  this.snapshot={domain,point,curvePoint,kind,roots};this.redraw();
 }
 redraw(){
  if(!this.state?.projective)return;
  this.drawState();this.drawCover();this.readouts();
 }
 readouts(){
  const s=this.state,channel=s.projectiveChannel,snap=this.snapshot,p=snap?.point;
  const G=s.function==='heat'?'Fτ':'ξ';
  $('projectiveStateTitle').textContent=channel==='domain'?'DOMAIN · ℂℙ¹':channel==='bridge'?'SHIFTED PAIR · ℂℙ¹':'DERIVATIVE · CAYLEY DISK';
  $('projectiveStateBadge').textContent=this.message?'PAUSED READOUT':channel==='derivative'?'NUMERICAL SIGN':'LINKED POINT';
  $('projectiveStateNote').textContent=channel==='domain'?'[s₀−1:s₀] includes w=∞ in the reciprocal chart. The point s=∞ lies at w=1.':channel==='bridge'?`U=${G}(s+a), V=${G}(s−a). The sphere keeps relative phase and amplitude; its vertical coordinate is the bridge balance.`:`C=(${G}−ℓ${G}′)/(${G}+ℓ${G}′). Inside |C|<1 corresponds to Re(${G}′/${G})>0 where defined. A zero maps to C=−1 regardless of its location.`;
  if(this.message){
   $('projectiveCoordinate').textContent='—';$('projectiveStatus').textContent=this.message;
   $('projectiveDomainCoordinate').textContent='—';$('projectiveCurveCoordinate').textContent='Pause to update the linked coordinates.';return;
  }
  if(!p?.valid){$('projectiveCoordinate').textContent='Unresolved projective state';$('projectiveStatus').textContent=p?.status==='simultaneous-zero'?'Both homogeneous channels vanish; local analysis is needed.':'The requested function samples are outside numerical coverage or unresolved.';}
  else if(channel==='domain'){
   $('projectiveCoordinate').textContent=(p.chart==='reciprocal'?'1/w = ':'w = ')+complex(p.coordinate);
   $('projectiveStatus').textContent=p.chartInfinity?'w = ∞ · finite spectral point':`s₀ = ${complex(p.s0)} · ${p.chart} chart`;
  }else if(channel==='bridge'){
   const reciprocalSafe=p.chart==='affine';
   $('projectiveCoordinate').textContent=(reciprocalSafe?'1/R = ':'R = ')+complex(p.coordinate);
   $('projectiveStatus').textContent=`R=V/U · balance = ${format(p.sphere.z)} · relative phase ${p.reciprocal?format(Math.atan2(p.reciprocal.im,p.reciprocal.re)/Math.PI)+'π':'undefined at channel zero'}`;
  }else{
   $('projectiveCoordinate').textContent=p.cayley?'C = '+complex(p.cayley):p.cayleyPole?'C = ∞ · reciprocal chart':'C unresolved';
   $('projectiveStatus').textContent=p.unresolved?(p.status==='function-zero'?'Function zero: C=−1; logarithmic derivative undefined.':'Boundary or ill-conditioned sign · numerical result unresolved.'):`${p.diskRegion==='inside'?'Inside':p.diskRegion==='outside'?'Outside':'On'} the unit disk · Re(${G}′/${G}) = ${format(p.q?.re)}`;
  }
  const d=snap?.domain;
  $('projectiveDomainCoordinate').textContent=d?.valid?`s = ${complex({re:this.probe.sigma,im:this.probe.t})} · ${d.chart==='reciprocal'?'1/w':'w'} = ${complex(d.coordinate)}`:'Domain coordinate unresolved';
  const cp=snap?.curvePoint;
  $('projectiveCurveCoordinate').textContent=cp?.valid?`[X₀:X₁:X₂:X₃] = [${cp.coordinates.map(complex).join(' : ')}]`:cp?.chartInfinity?'Quartic infinity: [0:0:1:±1] · finite s':'[1:w:w²:η] · η²=(w²+r²)(w²+r⁻²)';
 }
 drawState(){
  const {ctx,w,h}=canvasContext($('projectiveStateCanvas')),s=this.state;
  if(s.projectiveChannel==='derivative'){this.drawDisk(ctx,w,h);return;}
  const cx=w/2,cy=h/2+2,r=Math.min(w*.31,h*.40),isDomain=s.projectiveChannel==='domain';
  wireSphere(ctx,cx,cy,r,isDomain?COLORS.mint:COLORS.cyan);
  if(isDomain){
   marker(ctx,{x:1,y:0,z:0},cx,cy,r,COLORS.orange,'p · ∞');
   marker(ctx,{x:-1,y:0,z:0},cx,cy,r,COLORS.purple,'q · ½',{dx:-42,dy:13});
   marker(ctx,{x:0,y:0,z:1},cx,cy,r,COLORS.muted,'w=∞',{dy:-6});
   marker(ctx,{x:0,y:0,z:-1},cx,cy,r,COLORS.muted,'w=0',{dy:13});
  }else{
   marker(ctx,{x:0,y:0,z:1},cx,cy,r,COLORS.orange,'U only');
   marker(ctx,{x:0,y:0,z:-1},cx,cy,r,COLORS.cyan,'V only',{dy:13});
   ctx.font='9px ui-monospace, monospace';ctx.fillStyle=COLORS.muted;ctx.textAlign='center';ctx.fillText('equator: |U| = |V|',cx,12);
  }
  const point=this.snapshot?.point,n=isDomain?domainSphere(point):point?.sphere;
  if(n){const p=project(n,cx,cy,r);ctx.setLineDash([2,3]);ctx.strokeStyle=COLORS.mint;ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(p.x,p.y);ctx.stroke();ctx.setLineDash([]);marker(ctx,n,cx,cy,r,COLORS.mint,'s',{radius:4.5,dx:8,dy:14});}
  if(this.message)this.placeholder(ctx,w,h);
 }
 drawDisk(ctx,w,h){
  const p=this.snapshot?.point,c=p?.cayley,mag=c?Math.hypot(c.re,c.im):Infinity;
  // A fixed 1.65-unit field keeps the unit circle meaningful. Large values
  // receive a radial edge arrow with their value retained in the readout.
  const limit=1.65,r=Math.max(12,Math.min((w/2-24)/limit,(h/2-24)/limit)),cx=w/2,cy=h/2+2;
  ctx.fillStyle='#153028';ctx.beginPath();ctx.arc(cx,cy,r,0,TAU);ctx.fill();ctx.strokeStyle='#94bba2';ctx.lineWidth=1;ctx.stroke();
  ctx.strokeStyle=COLORS.line;ctx.beginPath();ctx.moveTo(cx-limit*r,cy);ctx.lineTo(cx+limit*r,cy);ctx.moveTo(cx,cy-limit*r);ctx.lineTo(cx,cy+limit*r);ctx.stroke();
  ctx.font='9px ui-monospace, monospace';ctx.fillStyle=COLORS.muted;ctx.textAlign='center';ctx.fillText('−1',cx-r,cy+14);ctx.fillText('+1',cx+r,cy+14);ctx.fillText('|C| = 1',cx,h-4);
  if(c){
   const scale=mag>limit?limit/mag:1,x=cx+r*c.re*scale,y=cy-r*c.im*scale;
   ctx.strokeStyle=COLORS.mint;ctx.setLineDash([2,3]);ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(x,y);ctx.stroke();ctx.setLineDash([]);
   ctx.fillStyle=p.unresolved?COLORS.orange:p.diskSign>0?COLORS.mint:COLORS.purple;
   ctx.beginPath();ctx.arc(x,y,4,0,TAU);ctx.fill();
   if(mag>limit){const a=Math.atan2(-c.im,c.re);ctx.beginPath();ctx.moveTo(x+6*Math.cos(a),y+6*Math.sin(a));ctx.lineTo(x+6*Math.cos(a+2.5),y+6*Math.sin(a+2.5));ctx.lineTo(x+6*Math.cos(a-2.5),y+6*Math.sin(a-2.5));ctx.closePath();ctx.fill();ctx.fillStyle=COLORS.muted;ctx.fillText('|C| = '+format(mag)+' · beyond view',cx,12);}
  }else if(p?.cayleyPole){ctx.fillStyle=COLORS.orange;ctx.fillText('C = ∞ · use reciprocal chart',cx,12);}
  if(this.message)this.placeholder(ctx,w,h);
 }
 drawCover(){
  const {ctx,w,h}=canvasContext($('projectiveCoverCanvas')),r=Math.min(w*.19,h*.34),cy=h*.48,cx=[w*.25,w*.75],R=this.state.torusR;
  const base=this.snapshot?.domain??domainProjective(this.probe.sigma,this.probe.t,this.state.chartScale),selected=domainSphere(base);
  cx.forEach((x,i)=>{
   wireSphere(ctx,x,cy,r,i?COLORS.orange:COLORS.cyan);
   for(const sign of [-1,1]){
    const points=Array.from({length:65},(_,j)=>wSphere(0,sign*Math.exp(Math.log(1/R)+2*Math.log(R)*j/64)));
    curve(ctx,points,x,cy,r,sign>0?COLORS.orange:COLORS.purple,3);
    for(const q of [1/R,R])marker(ctx,wSphere(0,sign*q),x,cy,r,sign>0?COLORS.orange:COLORS.purple,'',{radius:2.3});
   }
   marker(ctx,{x:1,y:0,z:0},x,cy,r,COLORS.orange,'p'+(i?'−':'+'),{dx:5,dy:-6});
   marker(ctx,{x:-1,y:0,z:0},x,cy,r,COLORS.purple,'q'+(i?'−':'+'),{dx:-19,dy:12});
   if(selected&&!this.message)marker(ctx,selected,x,cy,r,COLORS.mint,'',{radius:3.5});
   ctx.textAlign='center';ctx.font='9px ui-monospace, monospace';ctx.fillStyle=i?COLORS.orange:COLORS.cyan;ctx.fillText('SHEET '+(i?'B':'A'),x,h-18);
  });
  ctx.setLineDash([2,3]);ctx.strokeStyle='#698296';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(cx[0]+r*.9,cy-12);ctx.bezierCurveTo(w*.48,cy-22,w*.52,cy+22,cx[1]-r*.9,cy+12);ctx.moveTo(cx[0]+r*.9,cy+12);ctx.bezierCurveTo(w*.48,cy+22,w*.52,cy-22,cx[1]-r*.9,cy-12);ctx.stroke();ctx.setLineDash([]);
  ctx.fillStyle=COLORS.muted;ctx.textAlign='center';ctx.font='8px ui-monospace, monospace';ctx.fillText('crosswise',w/2,cy+r*.72);ctx.fillText('w = ±i/r, ±ir · r = '+R.toFixed(2),w/2,h-3);
 }
 placeholder(ctx,w,h){ctx.fillStyle='#0a1424aa';ctx.fillRect(0,0,w,h);ctx.fillStyle=COLORS.muted;ctx.font='10px ui-monospace, monospace';ctx.textAlign='center';ctx.fillText('Pause / Inspect to update',w/2,h/2);}
}
