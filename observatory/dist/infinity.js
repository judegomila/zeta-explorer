import { evaluatePolar } from './math.js';
import { domainFor, withinDomain } from './domain.js';

/** Finite charts at the essential puncture. No routine evaluates q=0 or t=∞.
 * Values, logarithmic derivatives and boundary diagnostics always use the
 * original analytic field. Gaussian damping belongs only to the display.
 */
export const INFINITY_DEFAULTS=Object.freeze({
 infinityMode:'off',infinityLayout:'paired',infinityColor:'phase',
 infinityDisplay:'exact',infinityDampingScale:120,
 infinityTauMin:0,infinityTauMax:3.8,infinityTMin:8,infinityTMax:1800,
 infinitySigmaSpan:.5,infinityEnd:'upper',infinitySheet:'plus',
 infinityPartner:true,infinityResolution:'standard',
 infinityProbeU:.25,infinityProbeV:.35,
});
export const INFINITY_ENUMS=Object.freeze({
 infinityMode:['off','end','strip'],infinityLayout:['paired','cylinder','flat'],
 infinityColor:['phase','amplitude'],infinityDisplay:['exact','damped'],
 infinityEnd:['upper','lower'],infinitySheet:['plus','minus'],
 infinityResolution:['draft','standard','fine'],
});
export const INFINITY_LIMITS=Object.freeze({
 infinityDampingScale:[1,2000,1],infinityTauMin:[0,11.75,.05],infinityTauMax:[.25,12,.05],
 infinityTMin:[1,1e6,.01],infinityTMax:[1.1,1e7,.01],infinitySigmaSpan:[.05,8,.01],
 infinityProbeU:[0,1,.001],infinityProbeV:[0,1,.001],
});
const finite=Number.isFinite,TAU=2*Math.PI,clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const wrap=x=>((x%1)+1)%1;
export function normalizeInfinityConfig(input={}){
 const out={...INFINITY_DEFAULTS};
 for(const key of Object.keys(out)){
  const value=input[key];
  if(INFINITY_ENUMS[key]){if(INFINITY_ENUMS[key].includes(value))out[key]=value;}
  else if(INFINITY_LIMITS[key]&&typeof value==='number'&&finite(value))out[key]=clamp(value,...INFINITY_LIMITS[key]);
  else if(typeof out[key]==='boolean'&&typeof value==='boolean')out[key]=value;
 }
 if(out.infinityTauMax-out.infinityTauMin<.25)out.infinityTauMax=Math.min(12,out.infinityTauMin+.25);
 if(out.infinityTMax<out.infinityTMin*1.1)out.infinityTMax=out.infinityTMin*1.1;
 return out;
}
export function createInfinityPresets(defaults={}){
 const base={...defaults,...INFINITY_DEFAULTS,function:'xi',geometry:'klein',projective:false,
  extent:'extended',dynamicsMode:'off',researchMode:'off',channelsMode:'off',fiberMode:'off',
  playing:false,autoRotate:false,packets:false};
 return {
  infinityEnd:{settings:{...base,infinityMode:'end'},note:'Expand q=1−w into a finite cylindrical end. Inspect actual ξ values, both sheets and the Klein conjugate partner.'},
  stripEnds:{settings:{...base,infinityMode:'strip',infinityProbeU:.5,infinityProbeV:.25},note:'Keep σ−½ while comparing reciprocal-height and logarithmic charts of the upper or lower strip end.'},
 };
}
function settings(input){
 const config=normalizeInfinityConfig(input),L=typeof input.chartScale==='number'&&finite(input.chartScale)&&input.chartScale>0?input.chartScale:24;
 const kind=input.function==='heat'?'heat':'xi',tau=typeof input.tau==='number'&&finite(input.tau)?input.tau:0;
 return {config,L,kind,tau,domain:domainFor({...input,function:kind,tau})};
}

/** u is angle (end) or horizontal strip position. v is logarithmic radial
 * distance (end) or logarithmic |t| (strip). Reciprocal-height drawing uses
 * point.y, so keeping x is independent of the approach direction in q.
 */
export function infinityPoint(u,v,input={}){
 const {config:c,L}=settings(input);
 if(!finite(u)||!finite(v)||u<0||u>1||v<0||v>1)return {valid:false,status:'outside-chart'};
 if(c.infinityMode==='strip'){
  const rho=Math.log(c.infinityTMin)+v*Math.log(c.infinityTMax/c.infinityTMin),sign=c.infinityEnd==='lower'?-1:1;
  const t=sign*Math.exp(rho),x=c.infinitySigmaSpan*(2*u-1),sigma=.5+x;
  return {valid:true,sigma,t,x,y:1/t,rho,u,v,dsdu:{re:2*c.infinitySigmaSpan,im:0},dsdv:{re:0,im:t*Math.log(c.infinityTMax/c.infinityTMin)}};
 }
 const theta=TAU*u-Math.PI,tau=c.infinityTauMin+v*(c.infinityTauMax-c.infinityTauMin),radial=L*Math.exp(tau);
 const a=radial*Math.cos(theta),t=-radial*Math.sin(theta),sigma=(1-L)/2+a,qRadius=Math.exp(-tau);
 return {valid:finite(sigma)&&finite(t),sigma,t,u,v,theta,tau,
  q:{re:qRadius*Math.cos(theta),im:qRadius*Math.sin(theta)},
  dsdu:{re:TAU*t,im:-TAU*a},dsdv:{re:a*(c.infinityTauMax-c.infinityTauMin),im:t*(c.infinityTauMax-c.infinityTauMin)}};
}

export function infinityInverse(sigma,t,input={}){
 const {config:c,L}=settings(input);
 if(!finite(sigma)||!finite(t))return {valid:false,status:'nonfinite-spectral-point'};
 if(c.infinityMode==='strip'){
  const sign=c.infinityEnd==='lower'?-1:1;
  if(sign*t<=0)return {valid:false,status:'other-strip-end'};
  const u=((sigma-.5)/c.infinitySigmaSpan+1)/2,v=Math.log(Math.abs(t)/c.infinityTMin)/Math.log(c.infinityTMax/c.infinityTMin);
  return {valid:true,inView:u>=0&&u<=1&&v>=0&&v<=1,u,v,x:sigma-.5,y:1/t};
 }
 const re=sigma-(1-L)/2,mag=Math.hypot(re,t);
 if(mag===0)return {valid:false,status:'regular-reciprocal-chart',qInfinity:true};
 const theta=-Math.atan2(t,re),tau=Math.log(mag/L),u=wrap((theta+Math.PI)/TAU),v=(tau-c.infinityTauMin)/(c.infinityTauMax-c.infinityTauMin);
 return {valid:true,inView:v>=0&&v<=1,u,v,theta,tau,q:{re:L*re/(mag*mag),im:-L*t/(mag*mag)}};
}

/** A changes sheet and sends s to 1−conj(s). Its exact q action is
 * −conj(q)/(1−conj(q)), not a reversal of angle on a fixed cylinder. */
export function kleinInfinityPartner(point,input={}){
 const sigma=1-point.sigma,t=point.t;
 return {sigma,t,sheet:input.infinitySheet==='minus'?'plus':'minus',...infinityInverse(sigma,t,input)};
}
export function infinityDisplayLogAbs(logAbs,sigma,t,input={}){
 const c=normalizeInfinityConfig(input);
 if(c.infinityDisplay!=='damped')return logAbs;
 return logAbs-((sigma-.5)**2+t*t)/(c.infinityDampingScale*c.infinityDampingScale);
}
export function infinitySamplingKey(input={}){
 const {config:c,L,kind,tau,domain}=settings(input);
 return JSON.stringify({mode:c.infinityMode,min:c.infinityMode==='strip'?c.infinityTMin:c.infinityTauMin,
  max:c.infinityMode==='strip'?c.infinityTMax:c.infinityTauMax,span:c.infinitySigmaSpan,
  end:c.infinityEnd,resolution:c.infinityResolution,L,kind,tau,domain});
}

function samplePoint(point,input,evaluate=evaluatePolar){
 const {kind,tau,domain}=settings(input);
 if(!point?.valid||!withinDomain(point.sigma,point.t,domain)||(kind==='heat'&&Math.abs(tau)>domain.heatTauMax))return {valid:false,status:'outside-domain',logAbs:NaN,arg:NaN,phaseDefined:false,phaseStable:false};
 const f=evaluate(point.sigma,point.t,kind,tau,true);
 if(!f?.valid||f.reliable===false)return {...f,valid:false,phaseDefined:false,phaseStable:false};
 const zero=f.logAbs===-Infinity,condition=8*Number.EPSILON*Math.max(1,Math.hypot(point.sigma,point.t));
 const phaseStable=!zero&&finite(f.arg)&&finite(f.q?.re)&&finite(f.q?.im)
  &&!(finite(f.derivativeLogAbs)&&f.logAbs-f.derivativeLogAbs<=Math.log(condition));
 return {...f,phaseDefined:!zero&&finite(f.arg),phaseStable};
}
export function infinityProbe(input={},options={}){
 const {config:c,L,kind,tau,domain}=settings(input),p=infinityPoint(c.infinityProbeU,c.infinityProbeV,input);
 const value=samplePoint(p,input,options.evaluate),partner=kleinInfinityPartner(p,input);
 const partnerValue=samplePoint({...partner,valid:finite(partner.sigma)&&finite(partner.t)},input,options.evaluate);
 let conjugacy=null;
 if(value.valid&&partnerValue.valid){
  if(value.logAbs===-Infinity||partnerValue.logAbs===-Infinity)conjugacy=value.logAbs===partnerValue.logAbs?0:1;
  else{
   const m=Math.max(value.logAbs,partnerValue.logAbs),a=Math.exp(value.logAbs-m),b=Math.exp(partnerValue.logAbs-m);
   conjugacy=Math.hypot(a*Math.cos(value.arg)-b*Math.cos(partnerValue.arg),a*Math.sin(value.arg)+b*Math.sin(partnerValue.arg));
  }
 }
 const q=value.q;
 const current=value.phaseStable&&q?(c.infinityMode==='strip'?{coordinate:'x',value:q.im}:{coordinate:'θ',value:-(q.re*(p.sigma-(1-L)/2)-q.im*p.t)}):null;
 return {kind,tau,domain,point:p,value,partner,partnerValue,conjugacy,current};
}

function boundary(data,row,input){
 const {config:c,L}=settings(input),outer=row===data.ny,sign=outer?1:-1;
 const start=row*(data.nx+1),points=[];
 for(let i=0;i<=data.nx;i++){
  const k=start+i,valid=!!data.valid[k],sigma=data.sigma[k],t=data.t[k],q={re:data.qRe[k],im:data.qIm[k]};
  let flux=NaN,current=NaN;
  if(valid&&data.logAbs[k]===-Infinity)flux=0;
  else if(valid&&finite(q.re)&&finite(q.im)){
   if(c.infinityMode==='strip'){flux=-sign*(c.infinityEnd==='lower'?-1:1)*q.im;current=q.im;}
   else{const a=sigma-(1-L)/2;flux=sign*(q.re*a-q.im*t);current=-(q.re*a-q.im*t);}
  }
  points.push({u:i/data.nx,valid,sigma,t,logAbs:data.logAbs[k],flux,current,phaseStable:!!data.phaseStable[k]});
 }
 const usable=points.filter(p=>p.valid&&finite(p.logAbs)),M=usable.length?Math.max(...usable.map(p=>p.logAbs)):null;
 const length=c.infinityMode==='strip'?2*c.infinitySigmaSpan:TAU,step=length/data.nx;
 let covered=0,fluxScaled=0,phaseIntegral=0,phaseCovered=0;
 for(let i=0;i<data.nx;i++){
  const a=points[i],b=points[i+1];
  if(a.valid&&b.valid&&finite(a.flux)&&finite(b.flux)&&M!==null){
   const f=p=>p.logAbs===-Infinity?0:Math.exp(2*(p.logAbs-M))*p.flux;
   fluxScaled+=(f(a)+f(b))*step/2;covered+=step;
  }
  if(a.phaseStable&&b.phaseStable&&finite(a.current)&&finite(b.current)){phaseIntegral+=(a.current+b.current)*step/2;phaseCovered+=step;}
 }
 return {outer,points,coverage:covered/length,complete:covered>=length*(1-1e-10),
  fluxScaled:M===null?null:fluxScaled,fluxLogScale:M===null?null:2*M,
  phaseIntegral:phaseCovered>=length*(1-1e-10)?phaseIntegral:null,
  minLogAbs:usable.length?Math.min(...usable.map(p=>p.logAbs)):null,maxLogAbs:M};
}

function* fieldRows(input={},options={}){
 const {config:c,L,kind,tau,domain}=settings(input),mode=c.infinityMode==='strip'?'strip':'end';
 const sizes={draft:[56,36],standard:[96,64],fine:[144,100]},base=sizes[c.infinityResolution];
 const nx=kind==='heat'?Math.min(base[0],48):base[0],ny=kind==='heat'?Math.min(base[1],40):base[1],n=(nx+1)*(ny+1);
 const data={mode,L,kind,tau,domain,nx,ny,valid:new Uint8Array(n),phaseStable:new Uint8Array(n),phaseWarning:new Uint8Array(n),
  sigma:new Float64Array(n),t:new Float64Array(n),logAbs:new Float64Array(n),arg:new Float64Array(n),qRe:new Float64Array(n),qIm:new Float64Array(n),
  validCount:0,zeroCount:0,phaseWarningCount:0,key:infinitySamplingKey(input)};
 for(const key of ['logAbs','arg','qRe','qIm'])data[key].fill(NaN);
 for(let j=0;j<=ny;j++){
  if(options.cancelled?.())return null;
  for(let i=0;i<=nx;i++){
   const k=j*(nx+1)+i,p=infinityPoint(i/nx,j/ny,input),f=samplePoint(p,input,options.evaluate);
   data.sigma[k]=p.sigma;data.t[k]=p.t;
   if(!f.valid)continue;
   data.valid[k]=1;data.validCount++;data.logAbs[k]=f.logAbs;data.arg[k]=f.arg;
   if(f.logAbs===-Infinity)data.zeroCount++;
   data.qRe[k]=f.q?.re??NaN;data.qIm[k]=f.q?.im??NaN;data.phaseStable[k]=f.phaseStable?1:0;
   if(f.phaseStable){
    const phaseU=Math.abs(f.q.re*p.dsdu.im+f.q.im*p.dsdu.re)/nx;
    const phaseV=Math.abs(f.q.re*p.dsdv.im+f.q.im*p.dsdv.re)/ny;
    if(Math.max(phaseU,phaseV)>Math.PI*.7){data.phaseWarning[k]=1;data.phaseWarningCount++;}
   }
  }
  yield {row:j,progress:(j+1)/(ny+1)};
 }
 data.boundaries=[boundary(data,0,input),boundary(data,ny,input)];
 data.probe=infinityProbe(input,options);
 return data;
}
export function sampleInfinityField(input={},options={}){
 const rows=fieldRows(input,options);let next;
 do{next=rows.next();if(!next.done)options.onProgress?.(next.value.progress);}while(!next.done);
 return next.value;
}
export async function sampleInfinityFieldAsync(input={},options={}){
 const rows=fieldRows(input,options);let next;
 do{next=rows.next();if(!next.done){options.onProgress?.(next.value.progress);await new Promise(resolve=>setTimeout(resolve,0));}}while(!next.done);
 return next.value;
}
