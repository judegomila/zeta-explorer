/** Numerical bridge workbench. Every plot reports its actual finite scope.
 * Sources and conventions: docs/BRIDGE-RESEARCH.md. No rendering or network I/O.
 */
import * as kernel from './math.js';
import {normalizeResearchConfig} from './research-state.js';

const PI=Math.PI,TAU=2*PI;
const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im),sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const conj=a=>C(a.re,-a.im),scale=(a,t)=>C(a.re*t,a.im*t),abs=a=>Math.hypot(a.re,a.im);
const finite=a=>a&&Number.isFinite(a.re)&&Number.isFinite(a.im);
const div=(a,b)=>{const m=Math.max(Math.abs(b.re),Math.abs(b.im));if(!(m>0)||!Number.isFinite(m))return C(NaN,NaN);const r=b.re/m,i=b.im/m,d=r*r+i*i;return C(((a.re/m)*r+(a.im/m)*i)/d,((a.im/m)*r-(a.re/m)*i)/d);};
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const wrap=x=>Math.atan2(Math.sin(x),Math.cos(x));
const fmt=(v,n=6)=>!Number.isFinite(v)?'undefined':v===0?'0':Math.abs(v)<1e-4||Math.abs(v)>1e5?v.toExponential(n-1):Number(v.toPrecision(n)).toString();
const complexText=z=>finite(z)?`${fmt(z.re)} ${z.im<0?'−':'+'} ${fmt(Math.abs(z.im))}i`:'undefined';
const colors=['#1ca6a1','#d9693b','#8070c2','#bca04d','#75a452','#de719d','#437dbb','#909caa'];
const metric=(label,value)=>({label,value});
const line=(name,points,color=colors[0])=>({name,color,points});
const result=(title,subtitle,formula,scope,metrics,plots,details=[])=>({title,subtitle,formula,scope,metrics,plots,details});
const config=input=>normalizeResearchConfig(input);
const sourceName=s=>s.researchSource==='quadratic'?'exact quadratic model':s.researchSource==='heat'?`theta heat Fτ, τ=${fmt(s.researchTau)}`:'evaluated ξ';

export function quadraticRecord(sigma,t,epsilon){
 const w=C(sigma-.5,t),value=add(mul(w,w),C(2*epsilon)),derivative=scale(w,2),m=abs(value);
 return {valid:true,re:value.re,im:value.im,logAbs:m?Math.log(m):-Infinity,arg:Math.atan2(value.im,value.re),q:div(derivative,value),derivative,secondDerivative:C(2),derivativeLogAbs:Math.log(abs(derivative))};
}
function sample(sigma,t,s){return s.researchSource==='quadratic'?quadraticRecord(sigma,t,s.researchEpsilon):kernel.evaluatePolar(sigma,t,s.researchSource==='heat'?'heat':'xi',s.researchTau,true);}
function first(sigma,t,s,p=sample(sigma,t,s)){
 if(p.derivative)return p.derivative;
 return kernel.derivative(sigma,t,s.researchSource==='heat'?'heat':'xi',s.researchTau);
}
function second(sigma,t,s){return s.researchSource==='quadratic'?C(2):kernel.secondDerivative(sigma,t,s.researchSource==='heat'?'heat':'xi',s.researchTau);}
function scaled(p,logScale){const a=Math.exp(p.logAbs-logScale);return C(a*Math.cos(p.arg),a*Math.sin(p.arg));}
function asinhExp(logValue){if(logValue>30)return logValue+Math.LN2;if(logValue<-745)return 0;return Math.asinh(Math.exp(logValue));}
export function finiteBridge(p,q){
 if(!p?.valid||!q?.valid)return null;
 if(p.logAbs===-Infinity&&q.logAbs===-Infinity)return null;
 if(p.logAbs===-Infinity)return -1;if(q.logAbs===-Infinity)return 1;
 return Math.tanh(p.logAbs-q.logAbs);
}
export function shearRecord(sigma,t,input={}){
 const s=config(input),p=sample(sigma,t,s),d=first(sigma,t,s,p),v=C(p.re,p.im);
 const raw=mul(d,conj(v)).re;
 const logShear=finite(p.q)?p.q.re:null;
 const sign=logShear===null?Math.sign(raw):Math.sign(logShear);
 const logAbsW=sign&&Number.isFinite(p.logAbs)?2*p.logAbs+Math.log(Math.abs(logShear??raw/Math.exp(2*p.logAbs))):-Infinity;
 return {sigma,t,valid:p.valid,W:raw,logAbsW,sign,logShear,phase:p.arg,value:v,derivative:d,polar:p};
}

function contourSegments(values,cols,rows,x0,x1,y0,y1){
 const segments=[],dx=(x1-x0)/(cols-1),dy=(y1-y0)/(rows-1);
 for(let y=0;y<rows-1;y++)for(let x=0;x<cols-1;x++){
  const ids=[y*cols+x,y*cols+x+1,(y+1)*cols+x+1,(y+1)*cols+x],v=ids.map(i=>values[i]);
  if(!v.every(Number.isFinite))continue;
  const points=[[x0+x*dx,y0+y*dy],[x0+(x+1)*dx,y0+y*dy],[x0+(x+1)*dx,y0+(y+1)*dy],[x0+x*dx,y0+(y+1)*dy]],cross=[];
  for(let k=0;k<4;k++){const j=(k+1)%4;if((v[k]<0)!==(v[j]<0)){const u=v[k]/(v[k]-v[j]);cross.push([points[k][0]+u*(points[j][0]-points[k][0]),points[k][1]+u*(points[j][1]-points[k][1])]);}}
  for(let k=0;k+1<cross.length;k+=2)segments.push([cross[k],cross[k+1]]);
 }
 return segments;
}
function numericalZeros(records,cols,rows,x0,x1,y0,y1,s){
 const found=[],dx=(x1-x0)/(cols-1),dy=(y1-y0)/(rows-1);
 for(let y=0;y<rows-1;y++)for(let x=0;x<cols-1;x++){
  const ids=[y*cols+x,y*cols+x+1,(y+1)*cols+x+1,(y+1)*cols+x];if(!ids.every(k=>records[k].valid))continue;
  const sum=ids.reduce((a,k,j)=>a+wrap(records[ids[(j+1)%4]].phase-records[k].phase),0);if(Math.abs(sum)<PI)continue;
  let sigma=x0+(x+.5)*dx,t=y0+(y+.5)*dy;
  for(let k=0;k<14;k++){const p=sample(sigma,t,s),d=first(sigma,t,s,p),step=div(C(p.re,p.im),d);if(!finite(step))break;const f=Math.min(1,Math.max(dx,dy)/Math.max(1e-300,abs(step)));sigma-=f*step.re;t-=f*step.im;if(abs(step)<1e-10)break;}
  const p=sample(sigma,t,s),correction=abs(div(C(p.re,p.im),first(sigma,t,s,p)));
  if(correction<1e-6&&sigma>=x0&&sigma<=x1&&t>=y0&&t<=y1&&!found.some(q=>Math.hypot(q.x-sigma,q.y-t)<1e-4))found.push({x:sigma,y:t,label:'numerical zero',color:'#101e25'});
 }
 return found;
}

export function computeShear(input={}){
 const s=config(input),cols=49,rows=73,x0=-.5,x1=1.5,y0=s.researchT-s.researchSpan,y1=s.researchT+s.researchSpan,records=[];
 const logs=[];for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const r=shearRecord(x0+(x1-x0)*x/(cols-1),y0+(y1-y0)*y/(rows-1),s);records.push(r);if(Number.isFinite(r.logAbsW))logs.push(r.logAbsW);}
 logs.sort((a,b)=>a-b);const logReference=logs.length?logs[Math.floor(logs.length/2)]:0;
 const values=records.map(r=>!r.valid?null:s.researchLayer==='phase'?r.phase:s.researchLayer==='logShear'?(Number.isFinite(r.logShear)?clamp(r.logShear,-12,12):null):r.sign*asinhExp(r.logAbsW-logReference));
 const contours=[];
 if(s.researchShowContours){
  contours.push({name:'Re F = 0',color:'#f5f2df',level:0,segments:contourSegments(records.map(r=>Math.cos(r.phase)),cols,rows,x0,x1,y0,y1)});
  contours.push({name:'Im F = 0',color:'#1f333f',level:0,segments:contourSegments(records.map(r=>Math.sin(r.phase)),cols,rows,x0,x1,y0,y1)});
 }
 const vectors=[];
 if(s.researchShowVectors)for(let y=3;y<rows;y+=7)for(let x=3;x<cols;x+=6){const r=records[y*cols+x],q=r.polar.q;if(finite(q)){const m=abs(q);if(m>0)vectors.push({x:r.sigma,y:r.t,dx:.09*q.im/m,dy:.09*q.re/m});}}
 const zeros=numericalZeros(records,cols,rows,x0,x1,y0,y1,s),probe=shearRecord(s.researchSigma,s.researchT,s),horizontal=[],finiteShift=[],vertical=[];
 for(let k=0;k<=160;k++){
  const sigma=x0+(x1-x0)*k/160,r=shearRecord(sigma,s.researchT,s),b=finiteBridge(sample(sigma+s.researchA,s.researchT,s),sample(sigma-s.researchA,s.researchT,s));
  horizontal.push(Number.isFinite(r.logShear)?[sigma,clamp(r.logShear,-25,25)]:null);finiteShift.push(b===null?null:[sigma,b/(2*s.researchA)]);
  const t=y0+(y1-y0)*k/160,z=shearRecord(s.researchSigma,t,s);vertical.push(Number.isFinite(z.logShear)?[t,clamp(z.logShear,-25,25)]:null);
 }
 const b=finiteBridge(sample(s.researchSigma+s.researchA,s.researchT,s),sample(s.researchSigma-s.researchA,s.researchT,s));
 return result('Bridge shear','Signed transverse response and the finite-shift comparison',
  'W = Re(F′ F̄) = ½∂σ|F|²; W/|F|² = Re(F′/F); Bₐ/(2a) → Re(F′/F)',
  `${sourceName(s)}; finite grid, analytic derivatives, numerical contour detections.`,
  [metric('Probe',`${fmt(s.researchSigma)} + ${fmt(s.researchT)}i`),metric('Raw W',fmt(probe.W)),metric('Re(F′/F)',fmt(probe.logShear)),metric('Finite Bₐ',b===null?'undefined':fmt(b)),metric('log shear reference',fmt(logReference)),metric('Detected zeros',zeros.length)],
  [{kind:'heatmap',title:s.researchLayer==='phase'?'Phase with zero contours':s.researchLayer==='logShear'?'Logarithmic shear · clipped at ±12':'Signed shear · asinh(W / exp(reference))',xLabel:'σ',yLabel:'t',xMin:x0,xMax:x1,yMin:y0,yMax:y1,cols,rows,values,palette:s.researchLayer==='phase'?'phase':'diverging',contours,vectors,points:[...zeros,{x:s.researchSigma,y:s.researchT,label:'probe',color:colors[1]}]},
   {kind:'lines',title:'Horizontal slice through the probe',xLabel:'σ',yLabel:'logarithmic slope',xMin:x0,xMax:x1,series:[line('analytic Re(F′/F), clipped ±25',horizontal),line('finite Bₐ/(2a)',finiteShift,colors[1])]},
   {kind:'lines',title:'Height slice at the selected σ',xLabel:'t',yLabel:'Re(F′/F), clipped ±25',series:[line('analytic slice',vertical)]}],
  ['The shear map uses one positive reference scale and an odd display compression; its sign is unchanged. The display scale is never differentiated.',
   'The finite bridge is Bₐ=(|F(s+a)|²−|F(s−a)|²)/(|F(s+a)|²+|F(s−a)|²). It agrees with the derivative only in the small-shift limit away from zeros.',
   'Arrows show the phase-gradient direction. Contour intersections and winding-cell Newton refinements are numerical diagnostics, not a complete zero count.',
   'On σ=½, W vanishes by symmetry. A positive or negative transverse limit is a different statement.']);
}

export function modalModel(epsilon,x,y,a=1){
 const radius=epsilon<0?Math.sqrt(-2*epsilon):0;
 const even=2*(a*a+y*y+2*epsilon),odd=2*(a*a-x*x);
 return {W:2*x*(x*x+y*y+2*epsilon),normalized:2*(x*x+y*y+2*epsilon),L1:4*y*y+8*epsilon,even,odd,difference:even-odd,radius,
  roots:epsilon<0?[[radius,0],[-radius,0]]:epsilon>0?[[0,Math.sqrt(2*epsilon)],[0,-Math.sqrt(2*epsilon)]]:[[0,0]],boundaryPSD:a*a+2*epsilon>=0};
}
export function computeModal(input={}){
 const s=config(input),epsilon=s.researchEpsilon,x=s.researchShift,y=s.researchModalY??0,m=modalModel(epsilon,x,y),cols=65,rows=65,values=[];
 const bound=Math.max(1.5,m.radius*1.15),real=[],imag=[];
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const X=-bound+2*bound*i/(cols-1),Y=-bound+2*bound*j/(rows-1);values.push(modalModel(epsilon,X,Y).normalized);real.push(X*X-Y*Y+2*epsilon);imag.push(2*X*Y);}
 const modal=[],slice=[];for(let j=0;j<=200;j++){const Y=-bound+2*bound*j/200,p=modalModel(epsilon,x,Y);modal.push([Y,p.L1]);slice.push([Y,p.normalized]);}
 const contours=[{name:'Re F = 0',color:'#f4e6a9',segments:contourSegments(real,cols,rows,-bound,bound,-bound,bound)},{name:'Im F = 0',color:'#152a35',segments:contourSegments(imag,cols,rows,-bound,bound,-bound,bound)}];
 return result('Modal sign switching','One exact collision, three linked readings','Fε(w)=w²+2ε; W=2x(x²+y²+2ε); L₁=4y²+8ε; W/x→L₁/2',
  'Exact quadratic model in local coordinates; its off-axis roots are not asserted for undeformed ξ.',
  [metric('Collision offset ε',fmt(epsilon)),metric('Probe (x,y)',`(${fmt(x)}, ${fmt(y)})`),metric('W at probe',fmt(m.W)),metric('W/x, continuously extended',fmt(m.normalized)),metric('First mode L₁',fmt(m.L1)),metric('Negative diameter',m.radius?`${fmt(-m.radius)} < y < ${fmt(m.radius)}`:'none'),metric('Boundary a=1 is PSD',m.boundaryPSD?'yes':'no')],
  [{kind:'heatmap',title:'Continuous W/x · the diameter is a limit, not negative W on the axis',xLabel:'local transverse x',yLabel:'local height y',xMin:-bound,xMax:bound,yMin:-bound,yMax:bound,cols,rows,values,palette:'diverging',contours,points:[...m.roots.map(([x,y])=>({x,y,label:epsilon===0?'double zero':'model zero',color:'#17252e'})),{x,y,label:'probe',color:colors[1]}]},
   {kind:'lines',title:'The same selected height and transverse shift',xLabel:'local height y',yLabel:'signed mode',series:[line('L₁(y)',modal),line(`W(${fmt(x)},y)/${fmt(x)} (continuous limit at 0)`,slice,colors[1])],points:[{x:y,y:m.L1,label:'selected L₁',color:colors[0]}]},
   {kind:'bars',title:'Exact boundary parity forms at a=1',labels:['even E+','odd E−','E+ − E−'],values:[m.even,m.odd,m.difference]}],
  ['For ε<0 the negative right-shear region is the open half-disk x>0, x²+y²<−2ε. Its open diameter is the negative first-modal interval.',
   'W(0,y)=0. The plotted axis color is the continuous W/x limit. The endpoints of the negative diameter are excluded.',
   'The enclosing winding remains two before, at, and after the collision; the zero count alone does not pin roots to an axis.',
   'The exact energies are E+=2(1+y²+2ε), E−=2(1−h²). Their nonnegativity needs a positive starting boundary; this can fail for the most negative ε settings.']);
}

const gaussCache=new Map();
function gauss(n){
 if(gaussCache.has(n))return gaussCache.get(n);const nodes=[];
 for(let j=1;j<=n;j++){
  let x=Math.cos(PI*(j-.25)/(n+.5)),derivative;
  for(let iter=0;iter<30;iter++){let p0=1,p1=x;for(let k=2;k<=n;k++){const p=((2*k-1)*x*p1-(k-1)*p0)/k;p0=p1;p1=p;}derivative=n*(x*p1-p0)/(x*x-1);const step=p1/derivative;x-=step;if(Math.abs(step)<2e-15)break;}
  nodes.push([x,2/((1-x*x)*derivative*derivative)]);
 }
 nodes.sort((a,b)=>a[0]-b[0]);gaussCache.set(n,nodes);return nodes;
}
export function bridgeOmega(a,h,r){
 if(!(a>0)||h<0||h>a||r<0)return NaN;if(h===a)return NaN;if(r===0)return 0;
 const u=PI*r/a,eta=h/a,delta=1-eta;
 const ls=eta===0?Math.log(PI):eta<=.5?Math.log(PI)+Math.log(Math.sin(PI*eta)/(PI*eta)):Math.log(Math.sin(PI*delta))-Math.log(eta);
 const e=Math.exp(-u),d=(-Math.expm1(-u))**2+4*Math.sin(PI*delta/2)**2*e;
 return Math.exp(Math.log(2*PI)+Math.log(r)-2*Math.log(a)+ls-u+Math.log(-Math.expm1(-2*u))-2*Math.log(d));
}
function boundaryKernel(x,y,a,s,normalizer=1){
 const u=sample(.5+a,x,s),v=sample(.5+a,y,s);
 if(Math.abs(y-x)<1e-9)return mul(first(.5+a,x,s,u),conj(C(u.re,u.im))).re/(a*normalizer);
 return (u.re*v.im-u.im*v.re)/(a*(y-x)*normalizer);
}
export function boundaryEnergy(input={},order=24){
 const s=config(input),a=s.researchSource==='quadratic'?1:Math.max(.5,s.researchA),h=Math.min(a,s.researchShift),t=s.researchT;
 const at=boundaryKernel(t,t,a,s),boundary=sample(.5+a,t,s),jetScale=abs(first(.5+a,t,s,boundary))**2+(boundary.re**2+boundary.im**2)/(a*a);
 const normalizer=Math.max(1e-300,Math.abs(at)>1e-14*jetScale?Math.abs(at):jetScale);
 let direct;
 if(h===0){const p=sample(.5,t,s),v=C(p.re,p.im),d=first(.5,t,s,p),d2=second(.5,t,s);direct=(abs(d)**2+mul(d2,conj(v)).re)/normalizer;}
 else{const p=sample(.5+h,t,s);direct=mul(first(.5+h,t,s,p),conj(C(p.re,p.im))).re/(h*normalizer);}
 if(h===a)return {a,h,t,even:at/normalizer,odd:0,difference:at/normalizer,direct,normalizer,mass:1,residual:at/normalizer-direct,tailProbeEven:0,tailProbeOdd:0,tailProbeDifference:0,endpoint:true,cumulative:[[0,at/normalizer,0,at/normalizer]],density:[]};
 const gap=Math.max(1e-5,a-h),cuts=[0,gap/2,gap,2*gap,4*gap,8*gap,.1,.25,.5,1,2,4,6,8].filter(x=>x>=0&&x<=8).sort((a,b)=>a-b).filter((v,i,a)=>i===0||v-a[i-1]>1e-10);
 let even=0,odd=0,mass=0;const cumulative=[[0,0,0,0]],density=[];
 for(let j=1;j<cuts.length;j++){
  const mid=(cuts[j]+cuts[j-1])/2,half=(cuts[j]-cuts[j-1])/2;
  for(const [node,weight] of gauss(order)){
   const r=mid+half*node,w=bridgeOmega(a,h,r),dm=boundaryKernel(t-r,t-r,a,s,normalizer),dp=boundaryKernel(t+r,t+r,a,s,normalizer),cross=boundaryKernel(t-r,t+r,a,s,normalizer);
   const ep=(dm+dp+2*cross)/4,em=(dm+dp-2*cross)/4,q=half*weight*w;
   even+=q*ep;odd+=q*em;mass+=q;cumulative.push([r,even,odd,even-odd]);density.push([r,w]);
  }
 }
 let tailProbeEven=0,tailProbeOdd=0;
 // A separate finite tail probe is evidence, never an infinite-tail bound.
 for(const [node,weight] of gauss(order)){
  const r=10+2*node,w=bridgeOmega(a,h,r),dm=boundaryKernel(t-r,t-r,a,s,normalizer),dp=boundaryKernel(t+r,t+r,a,s,normalizer),cross=boundaryKernel(t-r,t+r,a,s,normalizer),q=2*weight*w;
  tailProbeEven+=q*(dm+dp+2*cross)/4;tailProbeOdd+=q*(dm+dp-2*cross)/4;
 }
 return {a,h,t,even,odd,difference:even-odd,direct,normalizer,mass,residual:even-odd-direct,tailProbeEven,tailProbeOdd,tailProbeDifference:tailProbeEven-tailProbeOdd,endpoint:false,cumulative,density};
}
export function computeEnergy(input={}){
 const s=config(input),e=boundaryEnergy(s,24),coarse=boundaryEnergy(s,12),sum=e.even+e.odd;
 const positive=s.researchSource==='quadratic'?e.a*e.a+2*s.researchEpsilon>=0:s.researchSource!=='heat'||s.researchTau>=0;
 return result('Even & odd boundary energy','Reconstruct the inward shear from the outer boundary','Pₕ(t,t)=Wₕ(t)/h=E+−E−; E±=∫₀∞ ωₐ,ₕ(r) e±(t,r) dr',
  `${sourceName(s)}. ${positive?'The chosen starting boundary has the stated PSD justification.':'Boundary PSD is not assumed for this parameter choice; these are signed boundary forms.'} Finite quadrature, not an interval certificate.`,
  [metric('Boundary a',fmt(e.a)),metric('Inward shift h',fmt(e.h)),metric('Even E+',fmt(e.even)),metric('Odd E−',fmt(e.odd)),metric('Reconstructed difference',fmt(e.difference)),metric('Direct Wₕ/h',fmt(e.direct)),metric('Identity residual',fmt(e.residual)),metric('24 vs 12 node change',fmt(e.difference-coarse.difference)),metric('Tail probe [8,12] · even',fmt(e.tailProbeEven)),metric('Tail probe [8,12] · odd',fmt(e.tailProbeOdd)),metric('Tail probe [8,12] · difference',fmt(e.tailProbeDifference)),metric('Integrated weight mass',fmt(e.mass)),metric('Signed balance',sum>0?fmt(e.difference/sum):'undefined'),metric('Boundary measure',e.endpoint?'point mass δ₀':'half-line density')],
  [{kind:'bars',title:'Normalized boundary forms',labels:['even E+','odd E−','difference','direct target'],values:[e.even,e.odd,e.difference,e.direct]},
   {kind:'lines',title:e.endpoint?'Endpoint measure: no density integration':'Cumulative half-line quadrature',xLabel:'half-separation r',yLabel:'normalized energy',series:[line('even',e.cumulative.map(p=>[p[0],p[1]])),line('odd',e.cumulative.map(p=>[p[0],p[2]]),colors[1]),line('even − odd',e.cumulative.map(p=>[p[0],p[3]]),colors[2]),line('direct target',[[0,e.direct],[8,e.direct]],'#5d6870')]},
   ...(e.endpoint?[]:[{kind:'lines',title:'The probability weight on r≥0',xLabel:'r',yLabel:'ωₐ,ₕ(r)',series:[line('half-line density',e.density,colors[3])]}])],
  [`Both forms and the direct target are divided by the same positive scale ${fmt(e.normalizer)}. This is |Pₐ(t,t)| unless that value is numerically zero; then |F′|²+|F|²/a² at the boundary provides a nonzero scale. No negative sign is clipped.`,
   'For h=0 the direct value uses analytic second derivatives: |F′|²+Re(F″F̄). For h=a the measure is the point mass at r=0; the interior density is not substituted at that endpoint.',
   'Interior reconstruction uses 24-point Gauss–Legendre quadrature on an adaptively split finite interval [0,8], compared with 12-point quadrature. Separate even/odd and signed tail contributions are sampled on [8,12]. The difference and finite tail probe are not certified bounds on the omitted infinite tail.',
   'The real-axis boundary entries are evaluated from the completed function and its derivative, not from a product that assumes RH.',
   'For heat τ<0, or a quadratic model with a²+2ε<0, the identity remains a sign comparison but positivity of the starting boundary is not asserted.']);
}

/** Jacobi eigenpairs of a real symmetric matrix. */
function symmetricSpectrum(matrix){
 const a=matrix.map(r=>r.slice()),n=a.length,v=Array.from({length:n},(_,i)=>Array.from({length:n},(_,j)=>+(i===j)));
 for(let iter=0;iter<100*n*n;iter++){
  let p=0,q=1,m=0;for(let i=0;i<n;i++)for(let j=i+1;j<n;j++)if(Math.abs(a[i][j])>m){m=Math.abs(a[i][j]);p=i;q=j;}
  if(m<1e-13*Math.max(1,...a.map((r,i)=>Math.abs(r[i]))))break;
  const angle=.5*Math.atan2(2*a[p][q],a[q][q]-a[p][p]),c=Math.cos(angle),s=Math.sin(angle),pp=a[p][p],qq=a[q][q],pq=a[p][q];
  a[p][p]=c*c*pp-2*s*c*pq+s*s*qq;a[q][q]=s*s*pp+2*s*c*pq+c*c*qq;a[p][q]=a[q][p]=0;
  for(let k=0;k<n;k++){if(k!==p&&k!==q){const ap=a[k][p],aq=a[k][q];a[k][p]=a[p][k]=c*ap-s*aq;a[k][q]=a[q][k]=s*ap+c*aq;}const vp=v[k][p],vq=v[k][q];v[k][p]=c*vp-s*vq;v[k][q]=s*vp+c*vq;}
 }
 return a.map((r,i)=>({value:r[i],vector:v.map(row=>row[i])})).sort((a,b)=>a.value-b.value);
}
export function hermitianSpectrum(matrix){
 const n=matrix.length;if(!n)return {values:[],vectors:[],negative:0,zero:0,tolerance:1e-10};
 const real=Array.from({length:2*n},()=>new Array(2*n).fill(0));
 for(let i=0;i<n;i++)for(let j=0;j<n;j++){const z=matrix[i][j];real[i][j]=z.re;real[i][j+n]=-z.im;real[i+n][j]=z.im;real[i+n][j+n]=z.re;}
 const pairs=symmetricSpectrum(real),values=[],vectors=[];
 for(let k=0;k<2*n;k+=2){values.push((pairs[k].value+pairs[k+1].value)/2);const v=pairs[k].vector;vectors.push(Array.from({length:n},(_,i)=>C(v[i],v[i+n])));}
 const tolerance=1e-9*Math.max(1,...values.map(Math.abs));
 return {values,vectors,negative:values.filter(x=>x<-tolerance).length,zero:values.filter(x=>Math.abs(x)<=tolerance).length,tolerance};
}
function inverseMatrix(A){
 const n=A.length,a=A.map((row,i)=>[...row.map(z=>({...z})),...Array.from({length:n},(_,j)=>C(+(i===j)))]);
 for(let k=0;k<n;k++){
  let pivot=k;for(let i=k+1;i<n;i++)if(abs(a[i][k])>abs(a[pivot][k]))pivot=i;
  if(abs(a[pivot][k])<1e-11)return null;[a[k],a[pivot]]=[a[pivot],a[k]];const d=a[k][k];a[k]=a[k].map(z=>div(z,d));
  for(let i=0;i<n;i++)if(i!==k){const f=a[i][k];for(let j=0;j<2*n;j++)a[i][j]=sub(a[i][j],mul(f,a[k][j]));}
 }
 return a.map(r=>r.slice(n));
}
export function schurComplement(matrix,frozenCount){
 const n=matrix.length,k=clamp(Math.floor(frozenCount),0,Math.max(0,n-1));
 if(k===0)return {valid:true,frozen:[],effective:matrix.map(r=>r.map(z=>({...z}))),reason:'No frozen block'};
 const frozen=matrix.slice(0,k).map(r=>r.slice(0,k)),spec=hermitianSpectrum(frozen);
 if(spec.values.some(v=>Math.abs(v)<=spec.tolerance))return {valid:false,frozen,effective:null,reason:'Frozen block is singular or numerically unresolved'};
 const inv=inverseMatrix(frozen);if(!inv)return {valid:false,frozen,effective:null,reason:'Frozen inverse is numerically unresolved'};
 const effective=Array.from({length:n-k},(_,i)=>Array.from({length:n-k},(_,j)=>{
  let z=matrix[i+k][j+k];for(let u=0;u<k;u++)for(let v=0;v<k;v++)z=sub(z,mul(mul(matrix[i+k][u],inv[u][v]),matrix[v][j+k]));return z;
 }));
 return {valid:true,frozen,effective,reason:'Invertible frozen block; no regularization added'};
}
export function bridgeGram(input={}){
 const s=config(input),nodes=s.researchNodes.split(',').map(Number),x=s.researchNodeImag,a=s.researchA;
 if(s.researchKernel==='logPick'){
  if(nodes.some(v=>!(v>0))||nodes.some((v,i)=>nodes.some((u,j)=>j<i&&Math.abs(v-u)<1e-10)))return {valid:false,reason:'Log-derivative Pick nodes must be distinct positive real numbers (at least two).',nodes,data:[],matrix:[]};
  const data=nodes.map(x=>({x,p:sample(.5+x,0,s)}));
  if(data.some(({p})=>!p.valid||!finite(p.q)||abs(p.q)>1e12||Math.abs(p.q.im)>1e-10*Math.max(1,Math.abs(p.q.re))))return {valid:false,reason:'A logarithmic derivative is singular or numerically unresolved at a real node.',nodes,data,matrix:[]};
  let matrix=data.map((p,i)=>data.map((q,j)=>C((p.p.q.re+q.p.q.re)/(nodes[i]+nodes[j]))));
  const weights=matrix.map((r,i)=>1/Math.sqrt(Math.max(1e-14,Math.abs(r[i].re))));
  matrix=matrix.map((r,i)=>r.map((z,j)=>scale(z,weights[i]*weights[j])));
  return {valid:true,nodes,data,matrix,weights};
 }
 const data=nodes.map(n=>{const t=s.researchT+n,U=sample(.5+x+a,t,s),V=sample(.5+x-a,t,s),m=Math.max(U.logAbs,V.logAbs);return {t,U,V,u:scaled(U,m),v:scaled(V,m),scale:m};});
 const singularPick=s.researchKernel==='pick'&&data.some(p=>!Number.isFinite(p.U.logAbs)||abs(p.u)<1e-13);
 if(singularPick)return {valid:false,reason:'A Pick denominator vanishes or is numerically unresolved; use the homogeneous bridge kernel.',nodes,data,matrix:[]};
 let matrix=data.map((p,i)=>data.map((q,j)=>{
  const den=C(2*x,p.t-q.t);
  if(s.researchKernel==='pick'){
   const rp=div(p.v,p.u),rq=div(q.v,q.u);
   if(abs(den)<1e-12)return C(-mul(sub(p.V.q,p.U.q),mul(rp,conj(rp))).re);
   return div(sub(C(1),mul(rp,conj(rq))),den);
  }
  if(abs(den)<1e-12){const du=scale(first(.5+x+a,p.t,s,p.U),Math.exp(-p.scale)),dv=scale(first(.5+x-a,p.t,s,p.V),Math.exp(-p.scale));return C((mul(du,conj(p.u)).re-mul(dv,conj(p.v)).re)/(2*PI));}
  return scale(div(sub(mul(p.u,conj(q.u)),mul(p.v,conj(q.v))),den),1/(2*PI));
 }));
 if(matrix.some(r=>r.some(z=>!finite(z))))return {valid:false,reason:'A kernel entry is unresolved at this configuration.',nodes,data,matrix:[]};
 // Remove roundoff antisymmetry, then apply only positive diagonal congruence.
 matrix=matrix.map((r,i)=>r.map((z,j)=>scale(add(z,conj(matrix[j][i])),.5)));
 const weights=matrix.map((r,i)=>1/Math.sqrt(Math.max(1e-14,Math.abs(r[i].re))));
 matrix=matrix.map((r,i)=>r.map((z,j)=>scale(z,weights[i]*weights[j])));
 return {valid:true,nodes,data,matrix,weights};
}
export function computeGram(input={}){
 const s=config(input),g=bridgeGram(s),isLog=s.researchKernel==='logPick';
 const formula=isLog?'X(z)=F(½+z); L=X′/X; Kij=(L(xi)+L(xj))/(xi+xj); Qeff=A−BC⁻¹B*':s.researchKernel==='pick'?'R=V/U; Kᴾ(u,v)=(1−R(u)R̄(v))/(u+v̄); Qeff=A−BC⁻¹B*':'U=F(½+u+a), V=F(½+u−a); Kᵇ=(UU*−VV*)/[2π(u+v̄)]; Qeff=A−BC⁻¹B*';
 if(!g.valid)return result('Gram & Schur inspector','The selected nodes do not give a resolved matrix',formula,sourceName(s),[metric('Status',g.reason)],[],['A singular quotient is not silently assigned a finite matrix value.']);
 const spectrum=hermitianSpectrum(g.matrix),schur=schurComplement(g.matrix,s.researchFrozen),frozen=hermitianSpectrum(schur.frozen),effective=schur.valid?hermitianSpectrum(schur.effective):null,labels=g.nodes.map((n,i)=>`${i+1}: ${fmt(isLog?n:s.researchT+n,4)}`),weak=spectrum.vectors[0];
 const plots=[{kind:'matrix',title:'Normalized Hermitian Gram · real part',values:g.matrix.map(r=>r.map(z=>z.re)),labels},
  {kind:'matrix',title:'Normalized Hermitian Gram · imaginary part',values:g.matrix.map(r=>r.map(z=>z.im)),labels},
  {kind:'bars',title:'Full eigenvalue spectrum',labels:spectrum.values.map((_,i)=>`λ${i+1}`),values:spectrum.values},
  {kind:'lines',title:'Weakest normalized combination',xLabel:'sample number',yLabel:'coefficient',series:[line('real coefficient',weak.map((z,i)=>[i+1,z.re])),line('imaginary coefficient',weak.map((z,i)=>[i+1,z.im]),colors[1])]}];
 if(schur.valid&&s.researchFrozen){plots.push({kind:'matrix',title:'Effective live form · real part',values:schur.effective.map(r=>r.map(z=>z.re)),labels:labels.slice(s.researchFrozen)});plots.push({kind:'bars',title:'Schur-reduced spectrum',labels:effective.values.map((_,i)=>`μ${i+1}`),values:effective.values});}
 if(isLog){
  const b=weak.map((z,i)=>scale(z,g.weights[i])),maxU=Math.min(50,Math.max(10,8/Math.min(...g.nodes))),profileRe=[],profileIm=[],rationalRe=[],rationalIm=[];
  for(let k=0;k<=200;k++){
   const u=maxU*k/200,z=4*k/200;let h=C(),v=C();
   for(let i=0;i<b.length;i++){h=add(h,scale(b[i],Math.exp(-g.nodes[i]*u)));v=add(v,scale(b[i],1/(z+g.nodes[i])));}
   profileRe.push([u,h.re]);profileIm.push([u,h.im]);rationalRe.push([z,v.re]);rationalIm.push([z,v.im]);
  }
  plots.push({kind:'lines',title:'Weak-mode Laplace profile · coefficients restored before normalization',xLabel:'u ≥ 0',yLabel:'h(u)=Σ bᵢ exp(−xᵢu)',series:[line('Re h',profileRe),line('Im h',profileIm,colors[1])]});
  plots.push({kind:'lines',title:'The same weak-mode rational probe',xLabel:'real z ≥ 0',yLabel:'V(z)=Σ bᵢ/(z+xᵢ)',series:[line('Re V',rationalRe),line('Im V',rationalIm,colors[1])]});
 }
 return result('Gram & Schur inspector','Coupled values reveal directions absent from a single diagonal sample',
  formula,
  `${sourceName(s)}. ${isLog?'Finite positive-real-node logarithmic-derivative checkpoint.':'Finite bridge/ratio Hermitian checkpoint.'} Numerical eigenvalues and positive diagonal normalization; no global positivity certificate.`,
  [metric('Kernel',isLog?'log-derivative Pick':s.researchKernel==='pick'?'ratio Pick':'homogeneous bridge'),metric('Number of points',g.nodes.length),...isLog?[]:[metric('Right-half-plane offset',fmt(s.researchNodeImag))],metric('Smallest eigenvalue',fmt(spectrum.values[0])),metric('Negative index · full',spectrum.negative),metric('Unresolved near-zero eigenvalues',spectrum.zero),metric('Frozen prefix',s.researchFrozen),metric('Schur status',schur.reason),metric('Negative index · frozen',frozen.negative),metric('Negative index · effective',effective?effective.negative:'unavailable'),metric('Inertia account',effective?`${spectrum.negative} = ${frozen.negative} + ${effective.negative}`:'unavailable')],plots,
  [isLog?'The CSV entries are distinct positive real x values, evaluated at s=½+x with t=0. Height, shift a and the complex-node offset do not enter this checkpoint.':'Coordinates are u=x+i(T+node), F(s)=ξ(s) or the selected model. The node-offset control is Re u, not Im u; zero selects the boundary.',
   isLog?'The real logarithmic derivative is evaluated analytically. Nodes at a zero are rejected. This checkpoint is distinct from the finite-shift ratio Pick matrix.':'Boundary diagonal entries use the analytic derivative limit. Repeated nodes can produce singular Gram blocks.',
   'The displayed matrix is normalized by positive diagonal congruence, preserving inertia. Complex off-diagonal entries are retained in the eigensolver; the real-part picture alone is not the tested matrix.',
   ...isLog?['The profile and rational probe use bᵢ=dᵢvᵢ, where dᵢ is the positive congruence weight and v is the unit weakest eigenvector of the displayed matrix. Thus their coefficients refer to the original unnormalized kernel. An eigenvector has arbitrary common phase.']:[],
   'The first requested points are the frozen C block. A singular or numerically unresolved C is rejected; no pseudoinverse or hidden positive repair is used.',
   'Schur reduction preserves the negative-index account when C is invertible. It cannot erase a negative mode. Numeric signs near the displayed tolerance remain unresolved.']);
}

function factorize(n){const out=[];for(let p=2;p*p<=n;p++){if(n%p)continue;let k=0;while(n%p===0){n/=p;k++;}out.push([p,k]);}if(n>1)out.push([n,1]);return out;}
export function arithmeticBlock(N,frequency){
 N=Math.max(1,Math.floor(N));const divisors=[];for(let d=1;d<=N;d++)if(N%d===0)divisors.push(d);
 const terms=divisors.map(d=>Math.cos(frequency*Math.log(d/Math.sqrt(N))/2));
 const factors=factorize(N).map(([p,k])=>({p,k,value:Array.from({length:k+1},(_,j)=>Math.cos(frequency*Math.log(p)*(j-k/2)/2)).reduce((a,b)=>a+b,0)}));
 return {divisors,terms,sum:terms.reduce((a,b)=>a+b,0),product:factors.reduce((a,b)=>a*b.value,1),factors};
}
export function thetaPhiTruncated(u,terms=12){
 u=Math.abs(u);const e4=Math.exp(4*u),e5=Math.exp(5*u),e9=Math.exp(9*u);let sum=0;
 for(let n=1;n<=terms;n++){const n2=n*n,e=Math.exp(-PI*n2*e4);if(e===0)break;sum+=(2*PI*PI*n2*n2*e9-3*PI*n2*e5)*e;}
 return sum;
}
export function thetaLayerForm(midpoint,terms=12){
 const c=[-2,9,-19,24,-19,9,-2],spacing=.15;let q=0;
 for(let j=0;j<c.length;j++)for(let k=0;k<c.length;k++){const d=spacing*(j-k);q+=c[j]*c[k]*thetaPhiTruncated((midpoint+d)/4,terms)*thetaPhiTruncated((midpoint-d)/4,terms);}
 return q;
}
export function computeTheta(input={}){
 const s=config(input),N=s.researchBlock,xi=s.researchFrequency,M=s.researchThetaCutoff,block=arithmeticBlock(N,xi),sum=[],product=[];
 for(let i=0;i<=240;i++){const x=20*i/240,b=arithmeticBlock(N,x);sum.push([x,b.sum]);product.push([x,b.product]);}
 const phi=[],reference=[],signed=[],cumulative=[],steps=384,du=1.5/steps;let integral=0;
 const f=u=>thetaPhiTruncated(u,M)*Math.cos(xi*u);
 for(let i=0;i<=steps;i++){const u=i*du;phi.push([u,thetaPhiTruncated(u,M)]);reference.push([u,thetaPhiTruncated(u,24)]);signed.push([u,f(u)]);if(i>0&&i%2===0)integral+=du/3*(f(u-2*du)+4*f(u-du)+f(u));if(i%2===0)cumulative.push([u,integral]);}
 const direct=kernel.evaluatePolar(.5,xi/2,'xi',0,false).re/8,layer=[],weighted=[],layerIntegral=[],da=4/256,x=s.researchA;let total=0;
 const weightedAt=a=>2*a*Math.sinh(x*a)*thetaLayerForm(a,M);
 for(let i=0;i<=256;i++){const a=i*da,q=thetaLayerForm(a,M);layer.push([a,q]);weighted.push([a,2*a*Math.sinh(x*a)*q]);if(i>0&&i%2===0)total+=da/3*(weightedAt(a-2*da)+4*weightedAt(a-da)+weightedAt(a));if(i%2===0)layerIntegral.push([a,total]);}
 return result('Theta & arithmetic cancellation','Finite divisor interference and signed contributions from the theta family',
  'D_N(ξ)=Σd|N cos[(ξ/2)log(d/√N)]=∏pᵏ||N Σj=0ᵏ cos[(ξ log p/2)(j−k/2)]',
  'Exact finite arithmetic identity; truncated theta sums and finite quadrature diagnostics. The layer experiment uses the saved seven-point stencil.',
  [metric('Integer block N',N),metric('Frequency ξ',fmt(xi)),metric('Divisor sum',fmt(block.sum)),metric('Prime-factor product',fmt(block.product)),metric('Arithmetic residual',fmt(block.sum-block.product)),metric('Theta terms retained',M),metric('Cosine integral',fmt(integral)),metric('Direct ξ(½+iξ/2)/8',fmt(direct)),metric('Fourier comparison residual',fmt(integral-direct)),metric('Seven-point layer at a=1/20',fmt(thetaLayerForm(.05,M))),metric('Integrated seven-point form',fmt(total)),metric('Mellin tilt x',fmt(x))],
  [{kind:'lines',title:`Arithmetic block N=${N}`,xLabel:'frequency ξ',yLabel:'D_N',series:[line('divisor sum',sum),line('finite prime-factor product',product,colors[1])],points:[{x:xi,y:block.sum,label:'selected frequency',color:colors[2]}]},
   {kind:'bars',title:'Signed divisor contributions',labels:block.divisors.map(d=>`d=${d}`),values:block.terms},
   {kind:'lines',title:'Theta kernel and oscillatory integrand',xLabel:'theta coordinate u',yLabel:'value',series:[line(`Φ with ${M} terms`,phi),line('24-term reference',reference,colors[3]),line('Φ cos(ξu)',signed,colors[1])]},
   {kind:'lines',title:'Cumulative cosine-transform cancellation',xLabel:'upper integration limit u',yLabel:'integral',series:[line('finite integral',cumulative),line('direct target',[[0,direct],[1.5,direct]],colors[2])]},
   {kind:'lines',title:'Seven-point layer: individual signs and their weighted sum',xLabel:'midpoint a',yLabel:'quadratic form',series:[line('layer Q(a)',layer),line('2a sinh(xa) Q(a)',weighted,colors[1]),line('cumulative weighted integral',layerIntegral,colors[2])]}],
  ['The prime-factor formula is evaluated as finite cosine sums, so removable sine-quotient singularities never become 0/0.',
   'The positive theta-variable u is Mellin-dual to the spectral coordinate. It is not the torus angle or the spectral height t.',
   'The cosine transform uses Simpson quadrature on [0,1.5]. The 24-term reference and direct completed-function comparison are numerical checks, not rigorous infinite-tail bounds.',
   'The layer stencil has b_j=0.15j and c=(−2,9,−19,24,−19,9,−2), with κ(u)=Φ(u/4). Its layer at a=1/20 has a separate full-theta interval certificate in PR43; the values recomputed here use floating-point arithmetic.',
   'Finite theta sums are computed on u≥0 and reflected as Φ_M(|u|) for the layer experiment. This defines an even approximation; an unreflected individual partial theta series is not itself globally even. The full theta kernel is even by its modular identity.',
   'An individual layer can have a negative direction while the integrated family gives a positive value for that direction. This does not prove positivity for all directions.']);
}

function ghostFactor(sigma,t,s){
 const w=C(sigma-.5,t),roots=[C(s.researchDelta,s.researchT),C(-s.researchDelta,s.researchT),C(s.researchDelta,-s.researchT),C(-s.researchDelta,-s.researchT)];
 let value=C(1);for(const r of roots)value=mul(value,sub(w,r));return value;
}
function ratioSample(sigma,t,a,s){
 const base=(x)=>{const p=sample(x,t,s);if(!s.researchGhost)return p;const g=ghostFactor(x,t,s),m=abs(g);return {...p,logAbs:p.logAbs+Math.log(m),arg:wrap(p.arg+Math.atan2(g.im,g.re))};};
 const U=base(sigma+a),V=base(sigma-a);
 if(!U.valid||!V.valid)return {valid:false,status:'unresolved field'};
 if(U.logAbs===-Infinity&&V.logAbs===-Infinity)return {valid:false,status:'common zero; quotient needs cancellation'};
 if(U.logAbs===-Infinity)return {valid:false,status:'pole',logAbs:Infinity};
 if(V.logAbs===-Infinity)return {valid:true,status:'zero',logAbs:-Infinity,arg:0,value:C()};
 const logAbs=V.logAbs-U.logAbs,arg=wrap(V.arg-U.arg),r=Math.exp(logAbs);
 return {valid:Number.isFinite(r),status:Number.isFinite(r)?'finite':'outside affine chart',logAbs,arg,value:C(r*Math.cos(arg),r*Math.sin(arg)),balance:Math.tanh(U.logAbs-V.logAbs)};
}
function syntheticMarkers(a,s){
 const roots=[];
 if(s.researchSource==='quadratic'){
  const r=Math.sqrt(Math.abs(2*s.researchEpsilon));if(s.researchEpsilon<0)roots.push(C(.5-r,0),C(.5+r,0));else if(s.researchEpsilon>0)roots.push(C(.5,r),C(.5,-r));else roots.push(C(.5,0),C(.5,0));
 }else if(s.researchSource==='xi')for(const t of kernel.ZERO_HEIGHTS)if(Math.abs(t-s.researchT)<=s.researchSpan+s.researchRadius)roots.push(C(.5,t));
 if(s.researchGhost)for(const x of [-s.researchDelta,s.researchDelta])for(const y of [-s.researchT,s.researchT])roots.push(C(.5+x,y));
 const candidates=[];
 for(const r of roots){candidates.push({x:r.re+a,y:r.im,order:1});candidates.push({x:r.re-a,y:r.im,order:-1});}
 const groups=[];for(const p of candidates){let g=groups.find(q=>Math.hypot(q.x-p.x,q.y-p.y)<1e-9);if(!g){g={x:p.x,y:p.y,order:0,count:0};groups.push(g);}g.order+=p.order;g.count++;}
 return groups.map(g=>({x:g.x,y:g.y,label:g.order>0?`zero order ${g.order}`:g.order<0?`pole order ${-g.order}`:'common factor cancels',color:g.order>0?colors[0]:g.order<0?colors[1]:'#969b9b',order:g.order}));
}
const ratioCache=new Map();
export function ratioPath(input={}){
 const s=config(input),key=JSON.stringify([s.researchSource,s.researchTau,s.researchEpsilon,s.researchSigma,s.researchT,s.researchSpan,s.researchA,s.researchPath,s.researchRadius,s.researchGhost,s.researchDelta]);
 if(ratioCache.has(key))return ratioCache.get(key);
 const points=[];
 for(let i=0;i<=240;i++){
  const u=i/240;let sigma=s.researchSigma,t=s.researchT,a=s.researchA;
  if(s.researchPath==='circle'){sigma+=s.researchRadius*Math.cos(TAU*u);t+=s.researchRadius*Math.sin(TAU*u);}
  else if(s.researchPath==='bridgeSweep')a=.005+(s.researchA-.005)*u;
  else t+=s.researchSpan*(2*u-1);
  points.push({sigma,t,a,parameter:u,...ratioSample(sigma,t,a,s)});
 }
 const cached={points};ratioCache.set(key,cached);if(ratioCache.size>12)ratioCache.delete(ratioCache.keys().next().value);return cached;
}
export function computeRatio(input={}){
 const s=config(input),path=ratioPath(s).points,index=s.researchFrame,current=path[index],prefix=path.slice(0,index+1),markers=syntheticMarkers(current.a,s);
 const zpoints=prefix.map(p=>p.valid&&finite(p.value)&&abs(p.value)<=6?[p.value.re,p.value.im]:null),allpoints=path.map(p=>p.valid&&finite(p.value)&&abs(p.value)<=6?[p.value.re,p.value.im]:null);
 const plots=[{kind:'lines',title:'Spectral path and shifted zero / pole markers',xLabel:'σ',yLabel:'t',series:[line('full path',path.map(p=>[p.sigma,p.t]),'#9aa5aa'),line('traced path',prefix.map(p=>[p.sigma,p.t]))],points:[...markers,{x:current.sigma,y:current.t,label:'current sample',color:colors[2]}],xMin:Math.min(-.6,...path.map(p=>p.sigma)),xMax:Math.max(1.6,...path.map(p=>p.sigma)),yMin:Math.min(s.researchT-s.researchSpan,...path.map(p=>p.t)),yMax:Math.max(s.researchT+s.researchSpan,...path.map(p=>p.t))},
  {kind:'complex',title:'Rₐ=F(s−a)/F(s+a) · unit-circle comparison',xLabel:'Re R',yLabel:'Im R',unitCircle:true,xMin:-2,xMax:2,yMin:-2,yMax:2,series:[line('full image (|R|>6 omitted)',allpoints,'#9aa5aa'),line('traced image',zpoints)],points:current.valid&&finite(current.value)&&abs(current.value)<=6?[{x:current.value.re,y:current.value.im,label:'current ratio',color:colors[2]}]:[]},
  {kind:'lines',title:'Log modulus and phase along the path',xLabel:'path fraction',yLabel:'log modulus / phase',series:[line('log |R|',path.map(p=>Number.isFinite(p.logAbs)?[p.parameter,p.logAbs]:null)),line('arg R',path.map(p=>p.valid&&Number.isFinite(p.arg)?[p.parameter,p.arg]:null),colors[1])]}];
 return result('Ratio & pole trajectories','Follow a shifted pair through the spectral plane and its projective ratio','Rₐ(s)=F(s−a)/F(s+a); zeros shift by +a, poles by −a, common factors must cancel',
  `${sourceName(s)}${s.researchGhost?' multiplied by an explicitly synthetic even quartet':' without inserted off-axis zeros'}. A finite path is not a global Schur test.`,
  [metric('Path progress',`${index}/240`),metric('Current s',`${fmt(current.sigma)} + ${fmt(current.t)}i`),metric('Current shift a',fmt(current.a)),metric('Rₐ(s)',current.valid?complexText(current.value):current.status),metric('log |R|',Number.isFinite(current.logAbs)?fmt(current.logAbs):current.status),metric('Disk status',current.valid?abs(current.value)<1?'inside':abs(current.value)>1?'outside':'on boundary':'affine chart unresolved'),metric('Synthetic quartet',s.researchGhost?`δ=${fmt(s.researchDelta)}; γ=${fmt(s.researchT)}`:'off'),metric('Cancelled marker sites',markers.filter(p=>p.order===0).length)],plots,
  ['The path uses the current evaluator directly, with a common log-polar ratio. Camera rotations and phase-color shifts are absent from this calculation.',
   'The ghost toggle multiplies the function by [(w−iγ)²−δ²][(w+iγ)²−δ²], w=s−½. It changes the function and is a synthetic counterexample control, not a discovery of an off-axis ξ zero.',
   'Common synthetic shifted factors are combined before zero/pole markers are shown. At an exactly common zero the sampled unreduced quotient remains explicitly unresolved.',
   'For ξ, displayed ordinary markers use known zero heights as reference locations. Heat mode does not reuse those heights as heat zeros.',
   'Large affine ratios are omitted from the complex plot without joining across the gap; the log-modulus plot retains finite logarithmic information. Path samples are cached independently of animation frame.']);
}
