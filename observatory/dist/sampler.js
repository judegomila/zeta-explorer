import { evaluatePolar, heatXi, hardyZ, ZERO_HEIGHTS } from './math.js';
import { surfacePoint, inversePoint, liftPoint, wrap, sampleAxes, projectiveGuides } from './geometry.js';
import { domainFor, withinDomain } from './domain.js';
import { computeCriticalSamples, computeLandmarkValues } from './critical-samples.js';

const mag=z=>Math.hypot(z.re,z.im);
const finite=z=>Number.isFinite(z.re)&&Number.isFinite(z.im);
function inDomain(s,t,state){return withinDomain(s,t,state._domain||domainFor(state))&&!(state.function==='zeta'&&Math.hypot(s-1,t)<.025);}
function val(s,t,state,withDerivative=false){return evaluatePolar(s,t,state.function,state.tau,withDerivative);}
function styledPoint(u,v,state,withDerivative=false){const p=surfacePoint(u,v,state);if(!p.valid||!inDomain(p.sigma,p.t,state))return null;const f=val(p.sigma,p.t,state,withDerivative);return f.valid?{...p,u,v,value:[f.re,f.im],logAbs:f.logAbs,arg:f.arg,q:f.q}:null;}
function append(lines,arr,meta){if(arr.length<2)return;lines.push({...meta,points:arr.map(p=>p.position),positions:arr.map(p=>p.position),normals:arr.map(p=>p.normal),values:arr.map(p=>p.value),logAbs:arr.map(p=>p.logAbs),arg:arr.map(p=>p.arg)});}
function periodicDistance(a,b,state){let x=Math.abs(a.u-b.u),y=Math.abs(a.v-b.v);if(state.geometry!=='plane')x=Math.min(x,1-x);if(state.geometry==='torus')y=Math.min(y,1-y);return x*x+y*y;}
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
  if(state.geometry==='torus'){u=wrap(u);v=wrap(v);}else if(state.geometry==='sphere'){u=wrap(u);if(v<.007||v>.993)return null;}else if(u<0||u>1||v<0||v>1)return null;
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
function rootMarkers(state){
 let roots=[];
 if(state.function==='heat'&&Math.abs(state.tau)>1e-12){
   // Sample and bisect real-axis roots. This intentionally makes NO claim
   // about finding every root or excluding off-line zeros.
   let lastT=0,last=heatXi(.5,0,state.tau).re;
   for(let t=.15;t<=60;t+=.15){const f=heatXi(.5,t,state.tau).re;if(Number.isFinite(f)&&f*last<0){let a=lastT,b=t,fa=last;for(let n=0;n<38;n++){const m=(a+b)/2,fm=heatXi(.5,m,state.tau).re;if(fa*fm<=0)b=m;else{a=m;fa=fm;}}roots.push((a+b)/2);}last=f;lastT=t;}
 } else roots=ZERO_HEIGHTS.filter(x=>x<=120);
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
  state._domain=domainFor(state);
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
  const data={nx,ny,uvs,uAxis:axes.u,vAxis:axes.v,coords,values,logAbs,arg,rawRepresentable,sampleWeights,basePositions,normals,valid,bridge,domain:state._domain,kind:state.function,zeroPoints:rootMarkers(state),ladderLines:ladder(state),flowLines:flow(state),criticalSamples:computeCriticalSamples(state,state._domain,axes),landmarkValues:computeLandmarkValues(state,state._domain),slice:computeSlice(state),validCount:count,logOnlyCount,maxSampleT,ms:performance.now()-start};
  if(state.projective)data.projectiveGuides=projectiveGuides(state);
  return data;
}
