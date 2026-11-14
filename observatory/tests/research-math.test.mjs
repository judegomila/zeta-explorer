import test from 'node:test';
import assert from 'node:assert/strict';
import {evaluatePolar} from '../dist/math.js';
import {quadraticRecord,shearRecord,finiteBridge,modalModel,bridgeOmega,boundaryEnergy,
 hermitianSpectrum,schurComplement,bridgeGram,arithmeticBlock,thetaPhiTruncated,thetaLayerForm,
 ratioPath,computeShear,computeModal,computeEnergy,computeGram,computeTheta,computeRatio} from '../dist/research-math.js';

const C=(re=0,im=0)=>({re,im});
const near=(a,b,tol=1e-10)=>assert.ok(Math.abs(a-b)<=tol,`${a} != ${b} (tolerance ${tol})`);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const plus=(a,b)=>C(a.re+b.re,a.im+b.im);
const metrics=r=>Object.fromEntries(r.metrics.map(m=>[m.label,m.value]));
function simpson(f,a,b,n=16000){let total=f(a)+f(b);for(let i=1;i<n;i++)total+=(i%2?4:2)*f(a+(b-a)*i/n);return total*(b-a)/(3*n);}
function finiteTree(v,path='result'){
 if(typeof v==='number')assert.ok(Number.isFinite(v),`Non-finite number at ${path}`);
 else if(Array.isArray(v))v.forEach((x,i)=>finiteTree(x,`${path}[${i}]`));
 else if(v&&typeof v==='object')for(const [k,x] of Object.entries(v))finiteTree(x,`${path}.${k}`);
}

test('shear uses the analytic derivative and the finite bridge has the correct small-shift factor',()=>{
 const s={researchSource:'quadratic',researchEpsilon:-.25},sigma=.8,t=.3,a=1e-5;
 const r=shearRecord(sigma,t,s),w=sigma-.5;
 near(r.W,2*w*(w*w+t*t-.5));
 near(r.logShear,r.W/(r.value.re**2+r.value.im**2));
 const b=finiteBridge(quadraticRecord(sigma+a,t,-.25),quadraticRecord(sigma-a,t,-.25));
 near(b/(2*a),r.logShear,1e-8);
 const z={valid:true,logAbs:-Infinity},one={valid:true,logAbs:0};
 assert.equal(finiteBridge(z,z),null);assert.equal(finiteBridge(z,one),-1);assert.equal(finiteBridge(one,z),1);
 near(shearRecord(.5,14.7).W,0,1e-17);
});

test('the modal half-disk, first-mode diameter, roots and parity identity agree exactly',()=>{
 for(const epsilon of [-.8,-.25,0,.3])for(const x of [0,.15,.5])for(const y of [-.4,0,.8]){
  const m=modalModel(epsilon,x,y);
  near(m.W,x*m.normalized);near(m.difference,m.normalized);near(m.L1/2,m.normalized-2*x*x);
  for(const [re,im] of m.roots){const p=quadraticRecord(.5+re,im,epsilon);near(Math.hypot(p.re,p.im),0,5e-16);}
 }
 const e=-.25,R=Math.sqrt(-2*e);
 assert.ok(modalModel(e,.1,0).W<0);near(modalModel(e,0,0).W,0);
 near(modalModel(e,0,R).L1,0);assert.ok(modalModel(e,0,.99*R).L1<0);
 assert.equal(modalModel(-.8,.1,0).boundaryPSD,false);
});

test('the half-line boundary measure has its independent mass and second moment, including h=0',()=>{
 for(const [a,h] of [[1,0],[1,.35],[.5,.2]]){
  near(simpson(r=>bridgeOmega(a,h,r),0,16),1,3e-11);
  near(simpson(r=>r*r*bridgeOmega(a,h,r),0,16),a*a-h*h,3e-11);
 }
 assert.ok(Number.isNaN(bridgeOmega(.5,.5,.1)),'the endpoint is a point mass, not an ordinary density');
});

test('quadratic boundary reconstruction matches exact E± after the separately measured finite tail',()=>{
 for(const h of [0,.15,.5]){
  const t=.3,epsilon=-.25,e=boundaryEnergy({researchSource:'quadratic',researchT:t,researchEpsilon:epsilon,researchShift:h});
  near((e.even+e.tailProbeEven)*e.normalizer,2*(1+t*t+2*epsilon),2e-11);
  near((e.odd+e.tailProbeOdd)*e.normalizer,2*(1-h*h),2e-11);
  near(e.direct*e.normalizer,2*(t*t+h*h+2*epsilon),2e-14);
  near(e.residual+e.tailProbeDifference,0,2e-11);
 }
 const degenerate=boundaryEnergy({researchSource:'quadratic',researchT:0,researchEpsilon:-.5,researchShift:.15});
 assert.ok(degenerate.normalizer>1);finiteTree(degenerate);
});

test('actual ξ and theta heat satisfy the boundary identity and analytic endpoint limits',()=>{
 for(const source of ['xi','heat'])for(const h of [0,.15,.49,.5]){
  const e=boundaryEnergy({researchSource:source,researchTau:.1,researchA:.5,researchShift:h});
  near(e.difference,e.direct,2e-10);near(e.mass,1,2e-12);
  if(h===.5){assert.equal(e.endpoint,true);near(e.odd,0);near(e.even,e.direct);}
 }
 const wide=boundaryEnergy({researchSource:'xi',researchT:60,researchA:1,researchShift:.15});
 assert.ok(wide.tailProbeEven>1e-5&&wide.tailProbeOdd>1e-5);
 assert.ok(Math.abs(wide.tailProbeDifference)<1e-8,'small signed tail does not imply small individual tails');
 const negative=computeEnergy({researchSource:'heat',researchTau:-.2});
 assert.match(negative.scope,/PSD is not assumed/);
});

test('Hermitian eigenpairs retain complex off-diagonal information',()=>{
 const A=[[C(2),C(1,2)],[C(1,-2),C(-1)]],s=hermitianSpectrum(A);
 near(s.values[0],.5-Math.sqrt(7.25),1e-12);near(s.values[1],.5+Math.sqrt(7.25),1e-12);
 assert.equal(s.negative,1);
 for(let k=0;k<2;k++){
  const v=s.vectors[k];near(v.reduce((a,z)=>a+z.re*z.re+z.im*z.im,0),1,1e-12);
  for(let i=0;i<2;i++){const z=A[i].reduce((a,m,j)=>plus(a,mul(m,v[j])),C());near(z.re,s.values[k]*v[i].re,1e-12);near(z.im,s.values[k]*v[i].im,1e-12);}
 }
});

test('Schur elimination preserves negative inertia and rejects a singular frozen block',()=>{
 const A=[[C(-2),C(.5,.2),C(.1,-.1)],[C(.5,-.2),C(1),C(.7,.3)],[C(.1,.1),C(.7,-.3),C(-.3)]],s=schurComplement(A,1);
 assert.equal(s.valid,true);
 assert.equal(hermitianSpectrum(A).negative,hermitianSpectrum(s.frozen).negative+hermitianSpectrum(s.effective).negative);
 const singular=schurComplement([[C(1),C(1),C()],[C(1),C(1),C()],[C(),C(),C(2)]],2);
 assert.equal(singular.valid,false);assert.equal(singular.effective,null);assert.match(singular.reason,/singular/);
});

test('homogeneous bridge and ratio Pick agree up to congruence, also on the boundary',()=>{
 for(const x of [0,.15]){
  const b=bridgeGram({researchNodeImag:x,researchKernel:'bridge'}),p=bridgeGram({researchNodeImag:x,researchKernel:'pick'});
  assert.equal(b.valid,true);assert.equal(p.valid,true);
  const bs=hermitianSpectrum(b.matrix),ps=hermitianSpectrum(p.matrix);
  bs.values.forEach((v,i)=>near(v,ps.values[i],2e-10));
  for(const g of [b,p])for(let i=0;i<g.matrix.length;i++)for(let j=0;j<g.matrix.length;j++){
   near(g.matrix[i][j].re,g.matrix[j][i].re);near(g.matrix[i][j].im,-g.matrix[j][i].im);
  }
 }
 const boundary=bridgeGram({researchNodeImag:0}),nearby=bridgeGram({researchNodeImag:1e-5});
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){near(boundary.matrix[i][j].re,nearby.matrix[i][j].re,1e-4);near(boundary.matrix[i][j].im,nearby.matrix[i][j].im,1e-4);}
});

test('positive-real log-Pick nodes use their own analytic kernel and restore weak-mode coefficients',()=>{
 const input={researchKernel:'logPick',researchSource:'quadratic',researchEpsilon:.25,researchNodes:'.15,.35,.7,1.2'},g=bridgeGram(input);
 assert.equal(g.valid,true);
 for(let i=0;i<4;i++)for(let j=0;j<4;j++){
  const x=g.nodes[i],y=g.nodes[j],expected=(2*x/(x*x+.5)+2*y/(y*y+.5))/(x+y);
  near(g.matrix[i][j].re/(g.weights[i]*g.weights[j]),expected,1e-12);
 }
 const view=computeGram(input),spec=hermitianSpectrum(g.matrix),b=spec.vectors[0].map((z,i)=>C(z.re*g.weights[i],z.im*g.weights[i]));
 const profile=view.plots.find(p=>p.title.startsWith('Weak-mode Laplace'));
 near(profile.series[0].points[0][1],b.reduce((s,z)=>s+z.re,0));
 near(profile.series[1].points[0][1],b.reduce((s,z)=>s+z.im,0));
 assert.equal(bridgeGram({...input,researchNodes:'-.1,.2'}).valid,false);
 assert.equal(bridgeGram({...input,researchNodes:'.2,.2'}).valid,false);
 assert.equal(bridgeGram({...input,researchEpsilon:-.25,researchNodes:`${Math.sqrt(.5)},1`}).valid,false);
});

test('arithmetic divisor sums equal prime-power products, including removable sine quotients',()=>{
 for(let N=1;N<=120;N++)for(const frequency of [0,.17,4,20]){const b=arithmeticBlock(N,frequency);near(b.sum,b.product,2e-13);}
 for(const N of [2,4,8,16,32,64]){const b=arithmeticBlock(N,4*Math.PI/Math.log(2));near(b.sum,b.product,2e-13);assert.ok(Number.isFinite(b.product));}
 assert.equal(arithmeticBlock(1,9).sum,1);
});

test('the theta transform and signed seven-point layer reproduce independent saved reference values',()=>{
 near(thetaPhiTruncated(.3,12),thetaPhiTruncated(-.3,12),0);
 near(thetaLayerForm(.05,12),-.000908036036923,2e-11);
 const m=metrics(computeTheta({researchThetaCutoff:12,researchA:.25,researchFrequency:4}));
 assert.ok(Math.abs(Number(m['Fourier comparison residual']))<1e-12);
 near(Number(m['Integrated seven-point form']),.0016193669682471258,6e-9);
 assert.ok(Number(m['Seven-point layer at a=1/20'])<0);
 assert.ok(Number(m['Integrated seven-point form'])>0);
});

test('the ratio uses direct evaluated values and caches paths independently of frame',()=>{
 const input={researchSigma:.65,researchT:14.2,researchA:.25,researchFrame:120},path=ratioPath(input),p=path.points[120];
 const U=evaluatePolar(.9,14.2,'xi',0,false),V=evaluatePolar(.4,14.2,'xi',0,false),d=U.re*U.re+U.im*U.im;
 near(p.value.re,(V.re*U.re+V.im*U.im)/d,1e-12);near(p.value.im,(V.im*U.re-V.re*U.im)/d,1e-12);
 assert.equal(path,ratioPath({...input,researchFrame:17}));
 assert.notEqual(path,ratioPath({...input,researchT:14.3}));
 const circle=computeRatio({...input,researchPath:'circle',researchSpan:.5,researchRadius:1});
 near(circle.plots[0].yMin,13.2);near(circle.plots[0].yMax,15.2);
});

test('ghost zeros are marked synthetic and common shifted factors are not reported as poles',()=>{
 const input={researchSigma:.5,researchT:.7,researchA:.25,researchDelta:.25,researchGhost:true,researchFrame:120},view=computeRatio(input),p=ratioPath(input).points[120];
 assert.match(view.scope,/explicitly synthetic/);assert.equal(p.valid,false);assert.match(p.status,/common zero/);
 const marker=view.plots[0].points.find(q=>q.label==='common factor cancels'&&Math.abs(q.x-.5)<1e-12&&Math.abs(q.y-.7)<1e-12);
 assert.ok(marker);assert.equal(marker.order,0);
 const heat=computeRatio({researchSource:'heat'});assert.equal(heat.plots[0].points.length,1,'no undeformed ξ zero markers are relabeled as heat zeros');
});

test('all six public plot results contain finite numeric data or explicit masks',()=>{
 for(const fn of [computeShear,computeModal,computeEnergy,computeGram,computeTheta,computeRatio]){
  const view=fn();assert.ok(view.title&&view.scope&&view.formula);assert.ok(view.plots.length>=3);finiteTree(view);
 }
 finiteTree(computeEnergy({researchSource:'quadratic',researchT:0,researchEpsilon:-.5}));
 finiteTree(computeShear({researchSource:'quadratic',researchT:0,researchEpsilon:0}));
});
