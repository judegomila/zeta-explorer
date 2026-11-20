/** Bounded, synchronous numerical experiments for the research worker.
 * No display normalization enters analytic derivatives or zero locations.
 * Computed contour margins and root tracks are diagnostics, not certificates.
 */
import {complex, heatJet, ZERO_HEIGHTS} from './math.js';
import {normalizeResearchConfig} from './research-state.js';

const {add,sub,mul,div,scale,abs}=complex;
const C=(re=0,im=0)=>({re,im});
const TAU=2*Math.PI, FRAME_COUNT=240;
const COLORS=['#73dcf6','#ffb86b','#b8f28b','#d2adff','#ff8fa7','#78e1bb'];
const finite=z=>Number.isFinite(z.re)&&Number.isFinite(z.im);
const format=(x,d=5)=>Number.isFinite(x)?Number(x.toPrecision(d)).toString():'unresolved';
const metric=(label,value)=>({label,value:typeof value==='number'?format(value):String(value)});
const result=(title,subtitle,formula,scope,metrics,plots,details,diagnostics={})=>({title,subtitle,formula,scope,metrics,plots,details,diagnostics});
const PRIMES=[];
for(let p=2;PRIMES.length<32;p++){if(PRIMES.every(q=>q*q>p||p%q!==0))PRIMES.push(p);}

/** Signed finite prime-power rows. This is an explicitly chosen oscillator
 * basis, not a convergent log-derivative series on the critical line. */
export function computePrimeModes(input={}){
  const c=normalizeResearchConfig(input),primes=PRIMES.slice(0,c.researchPrimeCount),powers=c.researchPrimePower;
  const time=c.researchFrame/8,gamma=c.researchT,lo=-c.researchSpan,hi=c.researchSpan,cols=129,rows=primes.length*powers;
  const values=[],labels=[],barValues=[],full=[],mixed=[],amplitudes=[];
  const active=i=>(c.researchPrimeSolo===0||c.researchPrimeSolo===i+1)&&c.researchPrimeMute!==i+1;
  const amplitude=(p,m)=>Math.log(p)*Math.pow(p,-m/2)*Math.cos(gamma*m*Math.log(p));
  const contribution=(p,m,u)=>amplitude(p,m)*Math.cos(gamma*u-m*Math.log(p)*time);
  for(let i=0;i<primes.length;i++){
    const p=primes[i];labels.push(String(p));let bar=0;
    for(let m=1;m<=powers;m++){
      amplitudes.push({prime:p,power:m,amplitude:amplitude(p,m),active:active(i)});
      bar+=active(i)?contribution(p,m,0):0;
      for(let k=0;k<cols;k++)values.push(active(i)?contribution(p,m,lo+(hi-lo)*k/(cols-1)):0);
    }
    barValues.push(bar);
  }
  for(let k=0;k<cols;k++){
    const t=lo+(hi-lo)*k/(cols-1);let all=0,on=0;
    for(let i=0;i<primes.length;i++)for(let m=1;m<=powers;m++){const v=contribution(primes[i],m,t);all+=v;if(active(i))on+=v;}
    full.push([t,all]);mixed.push([t,on]);
  }
  const enabled=primes.filter((_,i)=>active(i));
  return result('Prime-mode mixer',`Fixed γ = ${format(gamma)} · display time T = ${format(time)} · u = log x`,
    'A(p,m;γ) = log(p) p^(−m/2) cos(γ m log(p)); wave = A(p,m;γ) cos(γu − m log(p) T)',
    'Finite signed prime-power oscillators; these are not proved eigenmodes and do not locate ξ zeros.',
    [metric('Fixed spectral γ',gamma),metric('Display time T',time),metric('Active primes',enabled.length),metric('Prime-power rows',rows),metric('Instantaneous sum at u = 0',barValues.reduce((a,b)=>a+b,0))],
    [{kind:'heatmap',title:'Signed wave by prime and power',xLabel:'u = log x',yLabel:'row (prime index − 1) × powers + m',xMin:lo,xMax:hi,yMin:.5,yMax:rows+.5,cols,rows,values,palette:'diverging'},
      {kind:'bars',title:'Per-prime instantaneous totals at u = 0',labels,values:barValues},
      {kind:'lines',title:'Finite carrier synthesis',xLabel:'u = log x',yLabel:'signed amplitude',series:[{name:'all selected primes',color:'#728391',points:full},{name:'enabled mixture',color:COLORS[0],points:mixed}]}],
    [`Primes in row order: ${primes.join(', ')}. Each prime has powers m = 1…${powers}.`,
      `Solo and mute are 1-based prime indices; 0 means none. Enabled primes: ${enabled.join(', ')||'none'}.`,
      'The spectral height γ stays fixed during Play. T = frame/8 advances the chosen carrier phases; u spans the displayed logarithmic spatial window.',
      'The coefficients keep their signs. No absolute-value envelope or positive-energy substitution is applied.',
      'The prime-power carrier extension is a chosen finite oscillator basis. The Euler-product log-derivative expansion is not asserted to converge on the critical line.'],
    {gamma,time,primes,enabled,rows,amplitudes,instantaneous:barValues,certified:false});
}

function fft(real,imag,inverse=false){
  const n=real.length;
  for(let i=1,j=0;i<n;i++){
    let bit=n>>1;for(;j&bit;bit>>=1)j^=bit;j^=bit;
    if(i<j){[real[i],real[j]]=[real[j],real[i]];[imag[i],imag[j]]=[imag[j],imag[i]];}
  }
  for(let len=2;len<=n;len*=2){
    const angle=(inverse?1:-1)*TAU/len,wr0=Math.cos(angle),wi0=Math.sin(angle);
    for(let start=0;start<n;start+=len){let wr=1,wi=0;
      for(let j=0;j<len/2;j++){
        const a=start+j,b=a+len/2,tr=wr*real[b]-wi*imag[b],ti=wr*imag[b]+wi*real[b];
        real[b]=real[a]-tr;imag[b]=imag[a]-ti;real[a]+=tr;imag[a]+=ti;
        const next=wr*wr0-wi*wi0;wi=wr*wi0+wi*wr0;wr=next;
      }
    }
  }
  if(inverse)for(let i=0;i<n;i++){real[i]/=n;imag[i]/=n;}
}

function sourceJet(sigma,t,c){
  if(c.researchSource==='quadratic'){
    const z=C(sigma-.5,t);
    return {valid:true,value:add(mul(z,z),C(2*c.researchEpsilon)),derivative:scale(z,2),secondDerivative:C(2)};
  }
  return heatJet(sigma,t,c.researchSource==='heat'?c.researchTau:0);
}
const pulseCache=new Map();
function transferBins(c){
  const key=JSON.stringify([c.researchSource,c.researchTau,c.researchEpsilon,c.researchAlpha]);
  if(pulseCache.has(key))return pulseCache.get(key);
  const bins=[],alpha=c.researchAlpha;let unresolved=0,removable=0;
  for(let k=0;k<256;k++){
    const omega=TAU*(k<=128?k:k-256)/16;
    if(alpha===0){bins.push({omega,value:C(1)});continue;}
    const p=sourceJet(.5,omega,c);let numerator=sub(p.value,scale(p.derivative,alpha)),denominator=add(p.value,scale(p.derivative,alpha));
    if(abs(denominator)===0&&abs(numerator)===0){
      // Analytic removable limit, when the first differentiated quotient
      // resolves it; never replace an unresolved pole by a finite value.
      numerator=sub(p.derivative,scale(p.secondDerivative,alpha));denominator=add(p.derivative,scale(p.secondDerivative,alpha));removable++;
    }
    const value=abs(denominator)>0?div(numerator,denominator):C(NaN,NaN);
    if(!finite(value))unresolved++;
    bins.push({omega,value});
  }
  const out={bins,unresolved,removable};if(pulseCache.size>=8)pulseCache.delete(pulseCache.keys().next().value);pulseCache.set(key,out);return out;
}

/** A real, symmetric pulse sampled at periodic cell centres. The even input
 * has a zero Nyquist coefficient; no invented Nyquist phase is necessary. */
export function computePulse(input={}){
  const c=normalizeResearchConfig(input),n=256,length=16,dt=length/n,{bins,unresolved,removable}=transferBins(c);
  const times=[],initial=new Float64Array(n),real=new Float64Array(n),imag=new Float64Array(n);
  const box=t=>Math.abs(t)<c.researchPulseWidth/2?1:0;
  for(let j=0;j<n;j++){
    const t=-length/2+(j+.5)*dt;times.push(t);
    const v=c.researchPulseShape==='gaussian'?Math.exp(-.5*(t/c.researchPulseWidth)**2):c.researchPulseShape==='pair'?box(t-c.researchPulseSeparation/2)+box(t+c.researchPulseSeparation/2):box(t);
    initial[j]=real[j]=v;
  }
  fft(real,imag);
  for(let k=0;k<n;k++){
    const s=bins[k].value,r=real[k],i=imag[k];
    real[k]=r*s.re-i*s.im;imag[k]=r*s.im+i*s.re;
  }
  fft(real,imag,true);
  let inputNorm=0,outputNorm=0,tail=0,imaginaryMax=0,maxError=0;
  for(let j=0;j<n;j++){
    inputNorm+=initial[j]**2*dt;const e=(real[j]**2+imag[j]**2)*dt;outputNorm+=e;if(times[j]>c.researchPulseCutoff)tail+=e;
    imaginaryMax=Math.max(imaginaryMax,Math.abs(imag[j]));maxError=Math.max(maxError,Math.hypot(real[j]-initial[j],imag[j]));
  }
  const series=[{name:'input',color:'#728391',points:times.map((t,j)=>[t,initial[j]])},{name:'output Re',color:COLORS[0],points:times.map((t,j)=>[t,Number.isFinite(real[j])?real[j]:null])}];
  if(imaginaryMax>1e-10)series.push({name:'output Im',color:COLORS[1],points:times.map((t,j)=>[t,Number.isFinite(imag[j])?imag[j]:null])});
  return result('Pulse through the bridge',`${c.researchPulseShape} input · ${c.researchSource} · 256 samples on a period of 16`,
    'S(ω) = [F(½+iω) − αF′(½+iω)] / [F(½+iω) + αF′(½+iω)]; y = IDFT(S · DFT(x))',
    'Finite periodic Fourier experiment. A tail in this window is not a proof of infinite-line causality or half-plane contractivity.',
    [metric('Input squared norm',inputNorm),metric('Output squared norm',outputNorm),metric('Norm ratio',inputNorm?outputNorm/inputNorm:NaN),metric(`Tail t > ${format(c.researchPulseCutoff)}`,outputNorm?format(100*tail/outputNorm)+'%':'unresolved'),metric('Unresolved bins',unresolved),metric('Imaginary roundoff',imaginaryMax)],
    [{kind:'lines',title:'Periodic input and transformed output',xLabel:'time in [−8, 8)',yLabel:'amplitude',xMin:-8,xMax:8,series},
      {kind:'lines',title:'Sampled transfer phase',xLabel:'ω',yLabel:'arg S (radians)',series:[{name:'phase',color:COLORS[2],points:[...bins].sort((a,b)=>a.omega-b.omega).map(b=>[b.omega,finite(b.value)?Math.atan2(b.value.im,b.value.re):null])}]}],
    ['Fourier convention: the forward DFT uses exp(−iωt); the inverse uses exp(+iωt). The result wraps around this finite period.',
      'A pair is two equal real boxes centred at ±separation/2. Width is full box width, or the Gaussian standard deviation.',
      'On the symmetry line, real α gives a unit-modulus quotient where it is defined. This boundary fact alone does not establish a Schur function in a half-plane.',
      `α = 0 is the exact identity multiplier, including frequencies at zeros. Resolved common-zero limits: ${removable}.`,
      'Midpoint sampling makes the real even input Nyquist coefficient zero; any output imaginary component is reported.'],
    {inputNorm,outputNorm,tailNorm:tail,tailFraction:outputNorm?tail/outputNorm:null,imaginaryMax,identityError:maxError,unresolved,removable,period:length,samples:n,certified:false});
}

/** Calibration F_tau(s)=P_{-tau}(−2i(s−½)), P_u=e^(u D_z²)[(z²−1)(z²−4)]. */
export function quarticHeatJet(sigma,t,tau){
  const u=-tau,z=C(2*t,-2*(sigma-.5)),z2=mul(z,z),a=12*u-5,b=12*u*u-10*u+4;
  const value=add(add(mul(z2,z2),scale(z2,a)),C(b));
  const pz=add(scale(mul(z2,z),4),scale(z,2*a)),pzz=add(scale(z2,12),C(2*a));
  return {valid:true,value,derivative:mul(C(0,-2),pz),secondDerivative:scale(pzz,-4)};
}
export function heatZeroVelocity(jet){return abs(jet.derivative)>0?scale(div(jet.secondDerivative,jet.derivative),-.25):C(NaN,NaN);}
const csqrt=z=>{const r=abs(z),a=Math.sqrt(Math.max(0,(r+z.re)/2)),b=Math.sqrt(Math.max(0,(r-z.re)/2));return C(a,z.im<0?-b:b);};
function quarticRoots(tau){
  const u=-tau,a=12*u-5,d=96*u*u-80*u+9,s=csqrt(C(d));
  // Start with the positive-height root at 1/2, then its conjugate. This
  // fixes the diagnostic contour at 1/2+i/2 for every frame of the model.
  const ys=[scale(sub(C(-a),s),.5),scale(add(C(-a),s),.5)],roots=[];
  for(let i=0;i<2;i++){const z=csqrt(ys[i]);for(const sign of [1,-1])roots.push({sigma:.5-sign*z.im/2,t:sign*z.re/2});}
  return roots;
}
const QUARTIC_COLLISION=-(10-Math.sqrt(46))/24;

function rootRecord(root,tau,jet){
  const derivativeAbs=abs(jet.derivative),condition=derivativeAbs/(derivativeAbs+abs(jet.secondDerivative)||1);
  const ratio=derivativeAbs&&condition>1e-7?div(jet.secondDerivative,jet.derivative):C(NaN,NaN),velocity=scale(ratio,-.25),x=root.sigma-.5;
  return {...root,tau,residual:derivativeAbs?abs(jet.value)/derivativeAbs:Infinity,derivativeAbs,condition,velocity,status:finite(velocity)?'simple':'multiple-or-ill-conditioned',
    D:x*x,M:finite(ratio)?x*ratio.re:null,Dprime:finite(ratio)?-x*ratio.re/2:null};
}
function correctRoot(seed,tau,maxMove=Infinity){
  let root={...seed};const start={...seed};
  for(let i=0;i<12;i++){
    if(root.sigma< -2||root.sigma>3||root.t<0||root.t>60)return {ok:false,reason:'root left the bounded tracking chart'};
    const jet=heatJet(root.sigma,root.t,tau);
    if(!jet.valid||abs(jet.derivative)===0)return {ok:false,reason:'zero derivative or failed theta evaluation'};
    const correction=div(jet.value,jet.derivative),error=abs(correction);
    if(!finite(correction))return {ok:false,reason:'non-finite Newton correction'};
    if(error<2e-9)return {ok:true,record:rootRecord(root,tau,jet)};
    // Full complex Newton. There is deliberately no projection to sigma=1/2.
    root.sigma-=correction.re;root.t-=correction.im;
    if(Math.hypot(root.sigma-start.sigma,root.t-start.t)>maxMove)return {ok:false,reason:'Newton correction exceeded the local branch radius'};
  }
  return {ok:false,reason:'Newton correction did not converge'};
}
function advanceRoot(start,target,branchRadius){
  let current=start,h=target-start.tau,attempts=0;
  while(Math.abs(target-current.tau)>1e-12){
    if(++attempts>48)return {ok:false,reason:'adaptive correction budget reached',at:current.tau};
    h=Math.sign(target-current.tau)*Math.min(Math.abs(h),Math.abs(target-current.tau));
    if(!finite(current.velocity))return {ok:false,reason:'multiple or ill-conditioned zero',at:current.tau};
    const predicted={sigma:current.sigma+h*current.velocity.re,t:current.t+h*current.velocity.im};
    const answer=correctRoot(predicted,current.tau+h,branchRadius);
    const displacement=answer.ok?Math.hypot(answer.record.sigma-current.sigma,answer.record.t-current.t):Infinity;
    if(answer.ok&&displacement<branchRadius&&answer.record.condition>1e-7){current=answer.record;h*=1.5;continue;}
    h*=.5;
    if(Math.abs(h)<1e-7)return {ok:false,reason:answer.reason||'unresolved near-collision conditioning',at:current.tau};
  }
  return {ok:true,record:current};
}
const trajectoryCache=new Map();
function heatTrajectories(c){
  const key=JSON.stringify([c.researchHeatModel,c.researchT,c.researchHeatCount,c.researchHeatEnd]);
  if(trajectoryCache.has(key))return trajectoryCache.get(key);
  const quartic=c.researchHeatModel==='quartic',failures=[],tracks=[],initialRoots=[];
  if(quartic){
    for(const root of quarticRoots(0)){initialRoots.push(root);tracks.push([]);}
    for(let frame=0;frame<=FRAME_COUNT;frame++){
      const tau=c.researchHeatEnd*frame/FRAME_COUNT;
      quarticRoots(tau).forEach((root,i)=>tracks[i].push(rootRecord(root,tau,quarticHeatJet(root.sigma,root.t,tau))));
    }
  }else{
    const heights=ZERO_HEIGHTS.filter(t=>t<60).sort((a,b)=>Math.abs(a-c.researchT)-Math.abs(b-c.researchT)).slice(0,c.researchHeatCount).sort((a,b)=>a-b);
    for(const t of heights){
      const corrected=correctRoot({sigma:.5,t},0,.1);initialRoots.push({sigma:.5,t});
      tracks.push(corrected.ok?[corrected.record]:[]);
      if(!corrected.ok)failures.push({branch:tracks.length-1,frame:0,tau:0,reason:corrected.reason});
    }
    for(let frame=1;frame<=FRAME_COUNT;frame++){
      const target=c.researchHeatEnd*frame/FRAME_COUNT;
      for(let i=0;i<tracks.length;i++){
        const track=tracks[i];if(track.length!==frame)continue;
        const start=track[track.length-1];let radius=.25;
        for(let j=0;j<tracks.length;j++)if(j!==i){const other=tracks[j][frame-1];if(other)radius=Math.min(radius,Math.hypot(start.sigma-other.sigma,start.t-other.t)/3);}
        const advanced=advanceRoot(start,target,radius);
        if(advanced.ok)track.push(advanced.record);else failures.push({branch:i,frame,tau:advanced.at??start.tau,reason:advanced.reason});
      }
    }
  }
  const out={tracks,initialRoots,failures,quartic};
  if(trajectoryCache.size>=3)trajectoryCache.delete(trajectoryCache.keys().next().value);trajectoryCache.set(key,out);return out;
}

/** Numerical contour evidence only. Values at finitely many nodes cannot
 * establish a zero-free boundary or a rigorous Rouche bound between nodes. */
function sampledContour(center,radius,tau,jetFunction){
  const initial=[],current=[],n=128;let minimum=Infinity,difference=0,referenceScale=0,displayScale=0;
  for(let j=0;j<n;j++){
    const a=TAU*j/n,sigma=center.sigma+radius*Math.cos(a),t=center.t+radius*Math.sin(a);
    const f0=jetFunction(sigma,t,0).value,f=jetFunction(sigma,t,tau).value;
    initial.push(f0);current.push(f);minimum=Math.min(minimum,abs(f0));difference=Math.max(difference,abs(sub(f,f0)));referenceScale=Math.max(referenceScale,abs(f0));displayScale=Math.max(displayScale,abs(f),abs(f0));
  }
  const winding=values=>{let angle=0,maxJump=0,min=Infinity;for(let j=0;j<n;j++){
    const a=values[j],b=values[(j+1)%n];min=Math.min(min,abs(a));const d=Math.atan2(a.re*b.im-a.im*b.re,a.re*b.re+a.im*b.im);angle+=d;maxJump=Math.max(maxJump,Math.abs(d));
  }return {estimate:min>0?angle/TAU:null,maxJump,min};};
  const now=winding(current),before=winding(initial),points=values=>[...values,values[0]].map(z=>[z.re/(displayScale||1),z.im/(displayScale||1)]);
  return {initialWinding:before.estimate,winding:now.estimate,maxPhaseJump:now.maxJump,
    minimumModulus:now.min,normalizedMinimum:displayScale?now.min/displayScale:0,roucheMargin:referenceScale?(minimum-difference)/referenceScale:null,
    initialPoints:points(initial),currentPoints:points(current),center,radius,samples:n,certified:false};
}

export function computeHeatTrajectories(input={}){
  const c=normalizeResearchConfig(input),stored=heatTrajectories(c),frame=c.researchFrame,tau=c.researchHeatEnd*frame/FRAME_COUNT;
  const jet=stored.quartic?quarticHeatJet:heatJet,roots=[];
  for(let i=0;i<stored.tracks.length;i++){
    const record=stored.tracks[i][frame];if(!record)continue;
    let refinedResidual=record.residual;
    if(!stored.quartic){const refined=heatJet(record.sigma,record.t,tau,{steps:768});refinedResidual=abs(refined.derivative)?abs(refined.value)/abs(refined.derivative):Infinity;}
    roots.push({...record,branch:i,refinedResidual});
  }
  const center=stored.initialRoots.find(r=>r.t>0)??stored.initialRoots[0]??{sigma:.5,t:c.researchT};
  const contour=sampledContour(center,c.researchContourRadius,tau,jet),unresolved=stored.failures.filter(f=>f.frame<=frame);
  const collisions=stored.quartic&&tau<=QUARTIC_COLLISION?[{tau:QUARTIC_COLLISION,sigma:.5,t:Math.sqrt(Math.sqrt(46)/4)/2},{tau:QUARTIC_COLLISION,sigma:.5,t:-Math.sqrt(Math.sqrt(46)/4)/2}]:[];
  const prefix=stored.tracks.map((track,i)=>({name:`root ${i+1}`,color:COLORS[i%COLORS.length],points:track.slice(0,frame+1).map(r=>[r.sigma,r.t])}));
  const markers=roots.map(r=>({x:r.sigma,y:r.t,label:`${r.branch+1}`,color:COLORS[r.branch%COLORS.length]}));
  for(const collision of collisions)markers.push({x:collision.sigma,y:collision.t,label:'double zero',color:'#ff738a'});
  const all=stored.tracks.flat(),xs=all.map(r=>r.sigma),ys=all.map(r=>r.t);
  let xMin=Math.min(0,...xs),xMax=Math.max(1,...xs),yMin=Math.min(...ys),yMax=Math.max(...ys);
  if(!Number.isFinite(yMin)){yMin=c.researchT-.5;yMax=c.researchT+.5;}
  if(c.researchShowContours){xMin=Math.min(xMin,center.sigma-c.researchContourRadius);xMax=Math.max(xMax,center.sigma+c.researchContourRadius);yMin=Math.min(yMin,center.t-c.researchContourRadius);yMax=Math.max(yMax,center.t+c.researchContourRadius);}
  const yMargin=.05+.06*(yMax-yMin);yMin-=yMargin;yMax+=yMargin;
  prefix.push({name:'Re s = ½',color:'#667684',points:[[.5,yMin],[.5,yMax]]});
  if(c.researchShowContours)prefix.push({name:'fixed spectral contour',color:'#d2adff',points:Array.from({length:129},(_,j)=>[center.sigma+c.researchContourRadius*Math.cos(TAU*j/128),center.t+c.researchContourRadius*Math.sin(TAU*j/128)])});
  const plots=[{kind:'complex',title:stored.quartic?'Exact quartet through collision':'Numerically continued theta-heat zeros',xLabel:'Re s',yLabel:'Im s',xMin,xMax,yMin,yMax,series:prefix,points:markers},
    {kind:'lines',title:'Height displacement along each branch',xLabel:'τ',yLabel:'Im ρ(τ) − Im ρ(0)',series:stored.tracks.map((track,i)=>({name:`root ${i+1}`,color:COLORS[i%COLORS.length],points:track.slice(0,frame+1).map(r=>[r.tau,r.t-track[0].t])}))},
    {kind:'lines',title:'Squared distance from the critical line',xLabel:'τ',yLabel:'D = (Re ρ − ½)²',series:stored.tracks.map((track,i)=>({name:`root ${i+1}`,color:COLORS[i%COLORS.length],points:track.slice(0,frame+1).map(r=>[r.tau,r.D])}))}];
  if(c.researchShowVectors){
    const scaleLength=.03;const vectors=roots.filter(r=>finite(r.velocity)).map(r=>({name:`ρ′τ, root ${r.branch+1}`,color:COLORS[r.branch%COLORS.length],points:[[r.sigma,r.t],[r.sigma+scaleLength*r.velocity.re,r.t+scaleLength*r.velocity.im]]}));
    plots[0].series.push(...vectors);
  }
  if(c.researchShowContours)plots.push({kind:'complex',title:'Image of one fixed contour (sampled)',xLabel:'Re F / common scale',yLabel:'Im F / common scale',series:[{name:'τ = 0',color:'#728391',points:contour.initialPoints},{name:`τ = ${format(tau)}`,color:COLORS[0],points:contour.currentPoints}],points:[{x:0,y:0,label:'0',color:'#ffffff'}]});
  const maxResidual=roots.length?Math.max(...roots.map(r=>Math.max(r.residual,r.refinedResidual))):NaN,minCondition=roots.length?Math.min(...roots.map(r=>r.condition)):NaN,first=roots[0];
  const metrics=[metric('Heat parameter τ',tau),metric('Resolved roots',`${roots.length}/${stored.tracks.length}`),metric('Max |F/F′|',maxResidual),metric('Min derivative conditioning',minCondition),metric('First-root M',first?.M??NaN),metric('First-root D′τ',first?.Dprime??NaN),metric('Sampled winding',contour.winding??NaN),metric('Sampled Rouché margin',contour.roucheMargin??NaN),metric('Unresolved branches',unresolved.length),metric('Unresolved velocities',roots.filter(r=>!finite(r.velocity)).length)];
  const details=[
    'τ increases in the standard de Bruijn–Newman direction: ∂τF = Fss/4. Reversing playback parameter direction reverses D′, not the displayed formula.',
    'M = (Re ρ − ½) Re(Fss/Fs), so D′τ = −M/2 at a simple zero. Conditioning ≤ 10⁻⁷ marks velocity, M and D′ unresolved near a multiple zero; a zero value on the line is not a no-escape theorem.',
    'Root positions use the analytic function and its derivatives, with no projection onto Re s = ½. Value/derivative residuals estimate positional error; small raw |F| alone is not accepted as capture.',
    `Contour: centre ${format(center.sigma)} + ${format(center.t)}i, radius ${format(c.researchContourRadius)}, ${contour.samples} nodes. Its minimum, winding, and Rouché margin are sampled, uncertified quantities.`,
    'A positive sampled margin does not control the arcs between samples. A rigorous one-zero, reflection-symmetric disk would confine that zero to the critical line while its hypotheses hold.',
    'Velocity arrows show forward-τ velocity multiplied by 0.03; they are not particle circulation or an inertial escape speed.'
  ];
  if(stored.quartic)details.push(`Exact calibration: Fτ(s) = P−τ(−2i(s−½)), Pᵤ(z) = z⁴ + (12u−5)z² + 12u²−10u+4. First collision τ = ${format(QUARTIC_COLLISION,10)}. All four branches are shown; the requested theta root count is not used.`,
    'At τ = −¼ the zeros are ¼ ± i√5/4 and ¾ ± i√5/4. Fτ(½) ≥ 23/12 throughout. Symmetry and total winding survive the departure. This polynomial is a calibration model, not ξ.');
  else details.push('The initial candidates are known ξ heights near the selected t, refined at τ = 0. Complex predictor/Newton steps are adaptive; the chart is −2 ≤ Re s ≤ 3 and 0 ≤ Im s ≤ 60. A failed or ambiguous continuation ends that branch visibly.',
    'The theta-integral second derivative uses 4(u+iα)² on the shifted contour. A doubled 768-interval evaluation checks the current residual; it is not an interval certificate.');
  for(const failure of unresolved)details.push(`Root ${failure.branch+1} unresolved near τ = ${format(failure.tau)}: ${failure.reason}.`);
  return result(stored.quartic?'Heat-zero collision calibration':'Actual theta-heat zero motion',`${stored.quartic?'Exact quartic':'Theta integral'} · frame ${frame}/240 · τ = ${format(tau)}`,
    'ρ′τ = −Fss/(4Fs); D = (Re ρ−½)²; D′τ = −½ (Re ρ−½) Re(Fss/Fs)',
    stored.quartic?'Exact symmetric polynomial heat model; a counterexample to generic topological confinement, not a claim about ξ.':'Numerical continuation of the actual theta heat family. No critical-line constraint, no RH claim, and no certified contour barrier.',
    metrics,plots,details,{tau,frame,model:stored.quartic?'quartic':'theta',roots,collisions,unresolved,sampledContour:{...contour,initialPoints:undefined,currentPoints:undefined},certified:false});
}
