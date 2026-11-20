import test from 'node:test';
import assert from 'node:assert/strict';
import {conormalFromProjective,ellipticConormalBasis,dualSourceFromProbe,
  DUAL_DEFAULTS,DUAL_ENUMS,normalizeDualConfig,createDualPresets} from '../dist/dual.js';

const C=(re=0,im=0)=>({re,im});
const add=(a,b)=>C(a.re+b.re,a.im+b.im);
const sub=(a,b)=>C(a.re-b.re,a.im-b.im);
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const scale=(a,n)=>C(a.re*n,a.im*n);
const div=(a,b)=>{const d=b.re*b.re+b.im*b.im;return C((a.re*b.re+a.im*b.im)/d,(a.im*b.re-a.re*b.im)/d);};
const conj=a=>C(a.re,-a.im);
const abs=a=>Math.hypot(a.re,a.im);
const dot=(a,b)=>a.reduce((sum,z,i)=>add(sum,mul(z,b[i])),C());
const norm=v=>Math.hypot(...v.flatMap(z=>[z.re,z.im]));
const sqrt=z=>{const m=abs(z),re=Math.sqrt(Math.max(0,(m+z.re)/2)),im=Math.sign(z.im||1)*Math.sqrt(Math.max(0,(m-z.re)/2));return C(re,im);};
const near=(a,b,tolerance=2e-12)=>assert.ok(Math.abs(a-b)<tolerance,`${a} != ${b}`);
const nearVector=(a,b)=>a.forEach((z,i)=>{near(z.re,b[i].re);near(z.im,b[i].im);});
function curveAt(w,r=2){
  const w2=mul(w,w),eta=sqrt(mul(add(w2,C(r*r)),add(w2,C(1/(r*r)))));
  return {valid:true,coordinates:[C(1),w,w2,eta],r,w,eta};
}
const state={torusR:2,chartScale:24,...DUAL_DEFAULTS,dualMode:'conormal'};

test('conormal members contain the source and an independently differentiated curve tangent',()=>{
  for(const r of [1.15,2,3])for(const w of [C(.3,.2),C(-.8,.7),C(2,-.4)]){
    const curve=curveAt(w,r),a=r*r+1/(r*r);
    // d/dw [1,w,w²,eta(w)], independently from the quartic equation.
    const derivative=[C(),C(1),scale(w,2),div(add(scale(mul(mul(w,w),w),2),scale(w,a)),curve.eta)];
    for(const theta of [0,.31,Math.PI/2,Math.PI])for(const phi of [0,.7,Math.PI/2,5.3]){
      const p=conormalFromProjective(curve,{theta,phi});assert.ok(p.valid,p.status);
      near(norm(p.sourceCoordinates),1);near(norm(p.dualCoordinates),1);near(norm(p.tangent),1);
      assert.ok(abs(dot(p.dualCoordinates,curve.coordinates))/norm(curve.coordinates)<2e-12);
      assert.ok(abs(dot(p.dualCoordinates,derivative))/norm(derivative)<2e-12);
      assert.ok(p.pointResidual<2e-12&&p.tangentResidual<2e-12&&p.horizontalResidual<2e-12);
      assert.ok(p.familySeparation>0);
    }
  }
});

test('the pairing is complex bilinear, not a Hermitian point test',()=>{
  const p=conormalFromProjective(curveAt(C(.4,.6)),{theta:1.1,phi:1.6});
  assert.ok(p.valid);assert.ok(abs(dot(p.dualCoordinates,p.sourceCoordinates))<1e-12);
  assert.ok(abs(dot(p.dualCoordinates.map(conj),p.sourceCoordinates))>.01);
});

test('independent source and family homogeneous gauges do not change the selected dual point',()=>{
  const curve=curveAt(C(.3,.7)),coefficients=[C(.3,.4),C(-.2,.8)];
  const base=conormalFromProjective(curve,{coefficients});assert.ok(base.valid);
  for(const lambda of [C(2,-3),C(1e280,2e280),C(1e-280,-2e-280)]){
    const scaled={...curve,coordinates:curve.coordinates.map(z=>mul(z,lambda))};
    const p=conormalFromProjective(scaled,{coefficients});assert.ok(p.valid);
    nearVector(p.sourceCoordinates,base.sourceCoordinates);nearVector(p.dualCoordinates,base.dualCoordinates);
    nearVector(p.tangent,base.tangent);
    const q=conormalFromProjective(curve,{coefficients:coefficients.map(z=>mul(z,lambda))});
    assert.ok(q.valid);nearVector(q.dualCoordinates,base.dualCoordinates);
  }
});

test('the CP1 family is nondegenerate and uses the specified quadric gradients',()=>{
  const curve=curveAt(C(.6,.2)),basis=ellipticConormalBasis(curve,2);
  const first=conormalFromProjective(curve,{coefficients:[C(1),C()]}),second=conormalFromProjective(curve,{coefficients:[C(),C(1)]});
  const overlap=abs(dot(first.dualCoordinates.map(conj),second.dualCoordinates));assert.ok(overlap<.999);
  const p=conormalFromProjective(curve,{theta:Math.PI/2,phi:Math.PI/2});
  near(p.family.sphere.x,0);near(p.family.sphere.y,1);near(p.family.sphere.z,0);
  const raw=basis.gradients[0].map((z,i)=>add(z,mul(C(0,1),basis.gradients[1][i])));
  near(abs(dot(p.dualCoordinates.map(conj),raw))/norm(raw),1);
});

test('exact spectral infinity has regular geometry on both sheets and never receives an analytic value',()=>{
  const source=dualSourceFromProbe({...state,dualAnchor:'infinity'},{sigma:NaN,t:Infinity});
  assert.ok(source.valid&&source.spectralInfinity);assert.equal(source.spectralCoordinate,null);
  nearVector(source.coordinates,[C(1),C(1),C(1),C(2.5)]);
  for(const sheet of [1,-1])for(const theta of [0,.6,Math.PI]){
    const p=conormalFromProjective(source,{theta,phi:1.2,sheet});assert.ok(p.valid);
    assert.ok(p.sourceSpectralInfinity&&p.familySeparation>.1);
    assert.ok(p.pointResidual<1e-12&&p.tangentResidual<1e-12);
    assert.equal(p.fieldEvaluated,false);assert.equal(p.value,undefined);assert.equal(p.xi,undefined);
    assert.ok(Math.sign(p.sourceCoordinates[3].re/p.sourceCoordinates[0].re)===sheet);
  }
});

test('branch and reciprocal-chart anchors have the correct independent tangent directions',()=>{
  for(const anchor of ['branch','chartInfinity']){
    const source=dualSourceFromProbe({...state,dualAnchor:anchor});assert.ok(source.valid);
    for(const sheet of [1,-1]){
      const p=conormalFromProjective(source,{theta:1.4,phi:.7,sheet});assert.ok(p.valid);
      const tangent=anchor==='branch'?[C(),C(),C(),C(1)]:[C(),C(1),C(),C()];
      assert.ok(abs(dot(p.dualCoordinates,tangent))<1e-12);
      assert.equal(p.sourceSpectralInfinity,false);assert.ok(Number.isFinite(source.spectralCoordinate.sigma));
    }
  }
  const anti=dualSourceFromProbe({...state,dualAnchor:'antiBridge'});
  assert.deepEqual(anti.spectralCoordinate,{sigma:.5,t:0});assert.equal(anti.spectralInfinity,false);
});

test('finite inspection stays linked to the requested spectral coordinate and sheet exchange',()=>{
  for(const probe of [{sigma:.5,t:14.1347251417347},{sigma:.8,t:22},{sigma:-11.5,t:0}]){
    const source=dualSourceFromProbe(state,probe);assert.ok(source.valid,source.status);
    assert.deepEqual(source.spectralCoordinate,probe);
    const plus=conormalFromProjective(source,{theta:.7,phi:1.2}),minus=conormalFromProjective(source,{theta:.7,phi:1.2,sheet:-1});
    assert.ok(plus.valid&&minus.valid);
    const exchanged={...source,coordinates:source.coordinates.map((z,i)=>i===3?scale(z,-1):z)};
    nearVector(minus.dualCoordinates,conormalFromProjective(exchanged,{theta:.7,phi:1.2}).dualCoordinates);
    assert.equal(source.fieldEvaluated,false);
  }
});

test('invalid or singular sources are explicit and never manufacture a normal',()=>{
  assert.equal(conormalFromProjective({coordinates:[C(),C(),C(),C()],r:2}).valid,false);
  assert.equal(conormalFromProjective({coordinates:[C(Infinity),C(),C(),C()],r:2}).valid,false);
  assert.equal(conormalFromProjective({coordinates:[C(1),C(1),C(1),C(2.5)],r:1}).valid,false);
  assert.equal(conormalFromProjective(curveAt(C(.4,.1)),{coefficients:[C(),C()]}).valid,false);
  assert.equal(conormalFromProjective(curveAt(C(.4,.1)),{theta:NaN}).valid,false);
  assert.equal(conormalFromProjective(curveAt(C(.4,.1)),{sheet:0}).valid,false);
  assert.equal(conormalFromProjective({coordinates:[C(1),C(.1),C(.9),C(.8)],r:2}).status,'source-off-elliptic-curve');
  assert.equal(dualSourceFromProbe(state,{sigma:.5,t:Infinity}).status,'finite-probe-required');
});

test('shareable dual configuration validates values and the preset preserves the main geometry',()=>{
  assert.deepEqual(normalizeDualConfig({dualMode:'bad',dualTheta:NaN,dualPhi:Infinity,dualSheet:4,dualAnchor:'bad'}),DUAL_DEFAULTS);
  const clamped=normalizeDualConfig({dualMode:'conormal',dualTheta:-1,dualPhi:100,dualSheet:-1,dualAnchor:'infinity'});
  assert.equal(clamped.dualTheta,0);assert.equal(clamped.dualPhi,2*Math.PI);assert.equal(clamped.dualSheet,-1);
  assert.ok(DUAL_ENUMS.dualAnchor.includes(clamped.dualAnchor));
  const preset=createDualPresets({height:1.1}).dualTwistor.settings;
  assert.equal(preset.height,1.1);assert.equal(preset.geometry,'torus');assert.equal(preset.projective,true);
  assert.equal(preset.dualMode,'conormal');assert.equal(preset.playing,false);assert.equal(preset.fiberMode,'off');
});
