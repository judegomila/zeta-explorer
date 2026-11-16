import { evaluatePolar, heatXi, hardyZ, ZERO_HEIGHTS } from './math.js';
import { surfacePoint, inversePoint, liftPoint, wrap, sampleAxes, projectiveGuides } from './geometry.js';
import { domainFor, withinDomain, samplingDomain, insideHole } from './domain.js';
import { computeTraps } from './zero-traps.js';
import { computeCriticalSamples, computeLandmarkValues } from './critical-samples.js';
import { isQuotientGeometry } from './quotient.js';

const mag=z=>Math.hypot(z.re,z.im);
const finite=z=>Number.isFinite(z.re)&&Number.isFinite(z.im);
function inDomain(s,t,state){const d=state._domain||samplingDomain(state);return withinDomain(s,t,d)&&!insideHole(s,t,d.holeRadius??null)&&!(state.function==='zeta'&&Math.hypot(s-1,t)<.025);}
function val(s,t,state,withDerivative=false){return evaluatePolar(s,t,state.function,state.tau,withDerivative);}
function styledPoint(u,v,state,withDerivative=false){const p=surfacePoint(u,v,state);if(!p.valid||!inDomain(p.sigma,p.t,state))return null;const f=val(p.sigma,p.t,state,withDerivative);return f.valid?{...p,u,v,value:[f.re,f.im],logAbs:f.logAbs,arg:f.arg,q:f.q}:null;}
function append(lines,arr,meta){if(arr.length<2)return;lines.push({...meta,points:arr.map(p=>p.position),positions:arr.map(p=>p.position),normals:arr.map(p=>p.normal),values:arr.map(p=>p.value),logAbs:arr.map(p=>p.logAbs),arg:arr.map(p=>p.arg)});}
function periodicDistance(a,b,state){
 let x=Math.abs(a.u-b.u),y=Math.abs(a.v-b.v);if(state.geometry!=='plane')x=Math.min(x,1-x);if(state.geometry==='torus')y=Math.min(y,1-y);
 let distance=x*x+y*y;
 if(state.geometry==='klein'){const dx=Math.abs(a.u-wrap(.5-b.u)),dy=1-Math.abs(a.v-b.v);distance=Math.min(distance,Math.min(dx,1-dx)**2+dy*dy);}
 return distance;
}
function spectralLine(samples,state,meta){
 const lines=[],tracks=[];
 for(const [s,t] of samples){
  const roots=inversePoint(s,t,state);const used=new Set();
  if(!tracks.length){roots.forEach(p=>tracks.push({last:p,arr:[]}));}
  for(const track of tracks){let k=-1,d=Infinity;roots.forEach((q,i)=>{if(!used.has(i)){const v=periodicDistance(q,track.last,state);if(v<d){d=v;k=i;}}});
   if(k<0||d>.06){append(lines,track.arr,meta);track.arr=[];if(k<0)continue;}
   used.add(k);const q=roots[k],p=styledPoint(q.u,q.v,state);track.last=q;
   if(p)track.arr.push(p);else {append(lines,track.arr,meta);track.arr=[];}
  }
 }
 tracks.forEach(track=>append(lines,track.arr,meta));return lines;
}
/** The boundary circle |s-1/2| = radius, lifted to every sheet it meets. */
function holeRim(state){
 const radius=state._domain.holeRadius*(1-1e-9),n=({draft:360,standard:720,high:1080,ultra:1440})[state.resolution]||720;
 const samples=Array.from({length:n+1},(_,i)=>{const a=2*Math.PI*i/n;return [.5+radius*Math.cos(a),radius*Math.sin(a)];});
 return spectralLine(samples,state,{kind:'hole-rim',color:'#ffd27a'});
}
/** One symmetric disc per tracked zero, drawn as its boundary ring on every sheet. */
function zeroTraps(state){
 if(!state.traps)return [];
 const limit=state._domain.holeRadius?state._domain.holeRadius-1:120;
 const inWindow=t=>state.geometry!=='plane'||(t>state.tMin&&t<state.tMax);
 const traps=computeTraps(criticalRoots(state).filter(t=>t<=limit),{kind:state.function,tau:state.tau});
 const result=[];
 for(const trap of traps)for(const sign of state.geometry==='plane'?[1]:[-1,1]){
  if(!inWindow(trap.t))continue;
  const ring=Array.from({length:49},(_,i)=>{const a=2*Math.PI*i/48;return [.5+trap.radius*Math.cos(a),sign*trap.t+trap.radius*Math.sin(a)];});
  result.push({...trap,t:sign*trap.t,rings:spectralLine(ring,state,{kind:'trap',color:trap.color})});
 }
 return result;
}
/**
 * Fall lines: test particles released on a grid and moved by the Newton flow
 * ds/dT = -F/F'. Along a path arg F is constant and |F| decays, so each path
 * runs into a zero of F wherever that zero is. The particles are probes of
 * the fixed field; the zeros themselves do not move.
 */
function fallLines(state){
 if(!state.fall)return [];
 const paths=[],nU=state.geometry==='plane'?9:13,nV=state.geometry==='plane'?13:9,steps=260,h=.004;
 const quotient=state.geometry==='klein'||state.geometry==='annulus';
 const vel=(u,v)=>{
  if(state.geometry==='torus'){u=wrap(u);v=wrap(v);}else if(state.geometry==='sphere'){u=wrap(u);if(v<.007||v>.993)return null;}
  // As with phase flow, stop at a quotient edge instead of continuing a
  // direction field across the orientation-reversing transition.
  else if(quotient){u=wrap(u);if(v<0||v>1)return null;}
  else if(u<0||u>1||v<0||v>1)return null;
  const p=styledPoint(u,v,state,true);if(!p||!p.q||!finite(p.q))return null;
  if(p.logAbs===-Infinity)return {p,arrived:true};
  let a,b,c,e;
  if(state.geometry==='plane'){a=state.sigmaMax-state.sigmaMin;b=0;c=0;e=state.tMax-state.tMin;}
  else if(p.dsdu){a=p.dsdu.re;b=p.dsdv.re;c=p.dsdu.im;e=p.dsdv.im;}
  else {const d=1e-5,x=surfacePoint(u+d,v,state),y=surfacePoint(u,v+d,state);a=(x.sigma-p.sigma)/d;c=(x.t-p.t)/d;b=(y.sigma-p.sigma)/d;e=(y.t-p.t)/d;}
  const det=a*e-b*c;if(Math.abs(det)<1e-10)return null;
  // -F/F' = -1/q has the direction of -conj(q).
  const vs=-p.q.re,vt=p.q.im,du=(e*vs-b*vt)/det,dv=(-c*vs+a*vt)/det,speed=Math.hypot(du,dv);
  // Newton step length in s is 1/|q|; a tiny one means the zero is reached.
  const reach=1/Math.hypot(p.q.re,p.q.im);
  // du,dv are per |q| of spectral length. Never step past half a Newton
  // step, so a path settles onto its zero instead of orbiting it.
  const perLength=speed*reach,ds=Math.min(h/perLength,.5*reach);
  return speed>1e-10?{du:du*reach*ds,dv:dv*reach*ds,p,arrived:reach<2e-3}:null;
 };
 for(let j=0;j<nV;j++)for(let i=0;i<nU;i++){
  let u=(i+.37)/nU,v=(j+.61)/nV,arr=[],arrived=false;
  for(let k=0;k<steps;k++){
   const a=vel(u,v);if(!a)break;arr.push(a.p);if(a.arrived){arrived=true;break;}
   const b=vel(u+a.du/2,v+a.dv/2);if(!b||b.arrived){if(b){arr.push(b.p);arrived=true;}break;}
   u+=b.du;v+=b.dv;
   if(state.geometry!=='plane')u=wrap(u);if(state.geometry==='torus')v=wrap(v);
  }
  const end=arr[arr.length-1];
  append(paths,arr,{color:arrived?'#9be7ff':'#6f86a6',arrived,endSigma:end?.sigma,endT:end?.t});
 }
 return paths;
}
function ladder(state){
 if(!state.ladder&&!state.packets)return [];
 const limit=state._domain.tMax*.9999,lo=state.geometry==='plane'?state.tMin:-limit,hi=state.geometry==='plane'?state.tMax:limit;
 const n=state.geometry==='plane'?180:({draft:360,standard:720,high:1080,ultra:1440}[state.resolution]||720),lines=[];
 for(const sign of [-1,1]){
  const samples=Array.from({length:n+1},(_,i)=>[.5+sign*state.bridgeA,state.geometry==='plane'?lo+(hi-lo)*i/n:limit*Math.sinh(6*(2*i/n-1))/Math.sinh(6)]);
  lines.push(...spectralLine(samples,state,{kind:'rail',color:sign===1?'#f3b462':'#7bdeef',frequency:Math.log(2),phase:sign*Math.PI/3,amplitude:1}));
 }
 for(let k=1;k<8;k++){
  const t=state.geometry==='plane'?lo+(hi-lo)*k/8:Math.min(limit,48)*(k-4)/4;
  const samples=Array.from({length:25},(_,i)=>[.5-state.bridgeA+2*state.bridgeA*i/24,t]);
  lines.push(...spectralLine(samples,state,{kind:k===4?'bridge':'rung',color:k===4?'#d7f7ad':'#b3acdf'}));
 }
 return lines;
}
function flow(state){
 if(!state.vortices)return [];
 const paths=[],nU=11,nV=11,steps=80;
 const vel=(u,v)=>{
  if(state.geometry==='torus'){u=wrap(u);v=wrap(v);}else if(state.geometry==='sphere'){u=wrap(u);if(v<.007||v>.993)return null;}
  // Phase flow is shown in this local lift. Its direction conjugates across
  // the Klein transition, so terminate here rather than inventing a globally
  // oriented phase vector field on the nonorientable quotient.
  else if(isQuotientGeometry(state.geometry)){u=wrap(u);if(v<0||v>1)return null;}
  else if(u<0||u>1||v<0||v>1)return null;
  const p=styledPoint(u,v,state,true);if(!p||!p.q||!finite(p.q)||p.logAbs===-Infinity)return null;
  const qr=p.q.re,qi=p.q.im;
  let a,b,c,e;
  if(state.geometry==='plane'){a=state.sigmaMax-state.sigmaMin;b=0;c=0;e=state.tMax-state.tMin;}
  else if(p.dsdu){a=p.dsdu.re;b=p.dsdv.re;c=p.dsdu.im;e=p.dsdv.im;}
  else {const h=1e-5,x=surfacePoint(u+h,v,state),y=surfacePoint(u,v+h,state);a=(x.sigma-p.sigma)/h;c=(x.t-p.t)/h;b=(y.sigma-p.sigma)/h;e=(y.t-p.t)/h;}
  const det=a*e-b*c;if(Math.abs(det)<1e-10)return null;
  const du=(e*qi-b*qr)/det,dv=(-c*qi+a*qr)/det,speed=Math.hypot(du,dv);
  return speed>1e-10?{du:du/speed,dv:dv/speed,p}:null;
 };
 for(let j=0;j<nV;j++)for(let i=0;i<nU;i++){
  let u=(i+.43)/nU,v=(j+.57)/nV,arr=[];
  for(let k=0;k<steps;k++){
   const a=vel(u,v);if(!a)break;arr.push(a.p);
   const h=.0055,b=vel(u+a.du*h/2,v+a.dv*h/2);if(!b)break;
   u+=b.du*h;v+=b.dv*h;
   if(state.geometry!=='plane')u=wrap(u);if(state.geometry==='torus')v=wrap(v);
  }
  append(paths,arr,{color:'#edfbef'});
 }
 return paths;
}
/** Tracked critical-line heights: reference zeros, or sampled heat roots. */
function criticalRoots(state){
 let roots=[];
 if(state.function==='heat'&&Math.abs(state.tau)>1e-12){
   // Sample and bisect real-axis roots. This intentionally makes NO claim
   // about finding every root or excluding off-line zeros.
   let lastT=0,last=heatXi(.5,0,state.tau).re;
   for(let t=.15;t<=60;t+=.15){const f=heatXi(.5,t,state.tau).re;if(Number.isFinite(f)&&f*last<0){let a=lastT,b=t,fa=last;for(let n=0;n<38;n++){const m=(a+b)/2,fm=heatXi(.5,m,state.tau).re;if(fa*fm<=0)b=m;else{a=m;fa=fm;}}roots.push((a+b)/2);}last=f;lastT=t;}
 } else roots=ZERO_HEIGHTS.filter(x=>x<=120);
 return roots;
}
function rootMarkers(state){
 const roots=criticalRoots(state);
 const result=[];
 for(const t of roots)for(const sign of [-1,1])for(const p of liftPoint(.5,sign*t,state))result.push({...p,label:((state.function==='heat'&&state.tau!==0)?'Sampled Hτ real-axis root · ':'ζ zero · ')+(sign*t).toFixed(6),value:[0,0],kind:'zero'});
 if(state.function==='zeta'){
  for(let s=-2;s>=-12;s-=2)for(const p of liftPoint(s,0,state))result.push({...p,label:'Trivial zero · '+s,value:[0,0],kind:'zero'});
  for(const p of liftPoint(1,0,state))result.push({...p,label:'ζ pole · s=1',value:[0,0],kind:'pole'});
 }
 return result;
}
/** Exact 361-point critical-line inset, computed with the frame, never in Play. */
export function computeSlice(state){
 const lo=state.geometry==='plane'?state.tMin:0,hi=state.geometry==='plane'?state.tMax:60;
 let vals,scaleLog=0;
 if(state.function==='zeta'){
  vals=Float64Array.from({length:361},(_,i)=>hardyZ(lo+(hi-lo)*i/360));
 }else{
  const points=Array.from({length:361},(_,i)=>evaluatePolar(.5,lo+(hi-lo)*i/360,state.function,state.tau));
  scaleLog=Math.max(...points.filter(p=>p.valid).map(p=>p.logAbs));
  if(!Number.isFinite(scaleLog))scaleLog=0;
  vals=Float64Array.from(points,p=>p.valid?Math.exp(p.logAbs-scaleLog)*Math.cos(p.arg):NaN);
 }
 return {lo,hi,vals,scaleLog};
}

/** Pure synchronous field sampler, shared by browser workers and offline packs. */
export function sampleField(inputState,{onProgress=()=>{}}={}){
 const state={...inputState},start=performance.now();
  if(isQuotientGeometry(state.geometry)&&!['xi','heat'].includes(state.function))throw new RangeError('Real quotients require the completed xi or heat field; raw zeta does not obey the conjugated transition.');
  state._domain=samplingDomain(state);
  const axes=sampleAxes(state),nx=axes.u.length-1,ny=axes.v.length-1,n=(nx+1)*(ny+1);
  const coords=new Float64Array(2*n),uvs=new Float64Array(2*n),values=new Float64Array(2*n),logAbs=new Float64Array(n),arg=new Float64Array(n),sampleWeights=new Float64Array(n),rawRepresentable=new Uint8Array(n),basePositions=new Float32Array(3*n),normals=new Float32Array(3*n),valid=new Uint8Array(n),bridge=new Float32Array(n);
  values.fill(NaN);logAbs.fill(NaN);arg.fill(NaN);bridge.fill(NaN);
  let count=0,logOnlyCount=0,maxSampleT=0;
  for(let j=0;j<=ny;j++)for(let i=0;i<=nx;i++){
   if(i===0&&j%8===0)onProgress('Evaluating '+(state.function==='heat'?'heat field':'complex field')+' · '+Math.floor(100*j/(ny+1))+'%');
   const k=j*(nx+1)+i,u=axes.u[i],v=axes.v[j],p=surfacePoint(u,v,state);
   uvs[2*k]=u;uvs[2*k+1]=v;
   const ul=i?(axes.u[i-1]+u)/2:0,ur=i<nx?(u+axes.u[i+1])/2:1,vl=j?(axes.v[j-1]+v)/2:0,vr=j<ny?(v+axes.v[j+1])/2:1;
   sampleWeights[k]=(ur-ul)*(state.geometry==='sphere'?Math.cos(Math.PI*vl)-Math.cos(Math.PI*vr):state.geometry==='torus'?3.65*(vr-vl)+1.38/(2*Math.PI)*(Math.sin(2*Math.PI*vr)-Math.sin(2*Math.PI*vl)):vr-vl);
   basePositions.set(p.position,k*3);normals.set(p.normal,k*3);coords[2*k]=p.sigma;coords[2*k+1]=p.t;
   if(!p.valid||!inDomain(p.sigma,p.t,state))continue;
   const f=val(p.sigma,p.t,state,state.colorMode==='shear');if(!f.valid)continue;
   values[k*2]=f.re;values[k*2+1]=f.im;logAbs[k]=f.logAbs;arg[k]=f.arg;rawRepresentable[k]=f.rawRepresentable?1:0;valid[k]=1;count++;if(!f.rawRepresentable)logOnlyCount++;maxSampleT=Math.max(maxSampleT,Math.abs(p.t));
   if(state.colorMode==='shear')bridge[k]=f.q&&Number.isFinite(f.q.re)&&f.logAbs!==-Infinity?Math.tanh(f.q.re):NaN;
   if(state.colorMode==='bridge'){
    const kind=state.function==='heat'?'heat':'xi';
    if(!withinDomain(p.sigma-state.bridgeA,p.t,state._domain)||!withinDomain(p.sigma+state.bridgeA,p.t,state._domain))continue;
    const A=evaluatePolar(p.sigma+state.bridgeA,p.t,kind,state.tau),B=evaluatePolar(p.sigma-state.bridgeA,p.t,kind,state.tau);
    bridge[k]=A.valid&&B.valid&&!(A.logAbs===-Infinity&&B.logAbs===-Infinity)?Math.tanh(A.logAbs-B.logAbs):NaN;
   }
  }
  onProgress('Tracing geometry');
  const data={nx,ny,uvs,uAxis:axes.u,vAxis:axes.v,coords,values,logAbs,arg,rawRepresentable,sampleWeights,basePositions,normals,valid,bridge,domain:state._domain,kind:state.function,zeroPoints:rootMarkers(state),zeroTraps:zeroTraps(state),fallLines:fallLines(state),ladderLines:ladder(state),flowLines:flow(state),criticalSamples:computeCriticalSamples(state,state._domain,axes),landmarkValues:computeLandmarkValues(state,state._domain),slice:computeSlice(state),validCount:count,logOnlyCount,maxSampleT,ms:performance.now()-start};
  if(state.projective)data.projectiveGuides=projectiveGuides(state);
  if(state._domain.holeRadius)data.hole={radius:state._domain.holeRadius,rim:holeRim(state)};
  return data;
}
