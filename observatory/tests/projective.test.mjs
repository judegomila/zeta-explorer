import test from 'node:test';
import assert from 'node:assert/strict';
import {homogeneousSphere,pairSphereFromPolar,domainProjective,derivativeProjective,torusProjective} from '../dist/projective.js';
import {evaluatePolar} from '../dist/math.js';
import {torusPoint,torusLandmarks} from '../dist/elliptic.js';

const C=(re=0,im=0)=>({re,im});
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const near=(a,b,tol=3e-13)=>assert.ok(Math.abs(a-b)<=tol*(1+Math.abs(b)),`${a} != ${b}`);
const nearC=(a,b,tol)=>{assert.ok(a);near(a.re,b.re,tol);near(a.im,b.im,tol);};
const sphereNear=(a,b)=>{near(a.x,b.x);near(a.y,b.y);near(a.z,b.z);};
const polar=(logAbs,arg=0)=>({valid:true,reliable:true,logAbs,arg});

test('homogeneous sphere has the specified orientation and projective invariance',()=>{
  sphereNear(homogeneousSphere(C(1),C(0,1)).sphere,{x:0,y:1,z:0});
  const U=C(2,-3),V=C(-4,.7),phase=C(-.32,.91);
  const p=homogeneousSphere(U,V),q=homogeneousSphere(mul(U,phase),mul(V,phase));
  sphereNear(p.sphere,q.sphere);near(Math.hypot(...Object.values(p.sphere)),1);
  const scale=x=>C(x.re*1e300,x.im*1e300);
  sphereNear(p.sphere,homogeneousSphere(scale(U),scale(V)).sphere);
  sphereNear(homogeneousSphere(C(Number.MIN_VALUE),C(Number.MIN_VALUE)).sphere,{x:1,y:0,z:0});
  nearC(p.affine,mul(U,C(V.re/(V.re**2+V.im**2),-V.im/(V.re**2+V.im**2))));
  assert.ok(Math.hypot(p.coordinate.re,p.coordinate.im)<=1+1e-15);
});

test('coordinate infinity is regular but [0:0] and unresolved double infinity are not',()=>{
  sphereNear(homogeneousSphere(C(1),C()).sphere,{x:0,y:0,z:1});
  sphereNear(homogeneousSphere(C(),C(Infinity)).sphere,{x:0,y:0,z:-1});
  assert.equal(homogeneousSphere(C(),C()).status,'simultaneous-zero');
  assert.equal(homogeneousSphere(C(Infinity),C(Infinity)).valid,false);
  assert.equal(homogeneousSphere(C(NaN),C(1)).valid,false);
});

test('log-polar pairs retain amplitude and phase through simultaneous raw underflow',()=>{
  const a=pairSphereFromPolar(polar(-1200,.3),polar(-1200,.3+Math.PI/2));
  sphereNear(a.sphere,{x:0,y:1,z:0});
  const b=pairSphereFromPolar(polar(1300,.3),polar(1300+Math.log(2),.8));
  const ref=homogeneousSphere(C(Math.cos(.3),Math.sin(.3)),C(2*Math.cos(.8),2*Math.sin(.8)));
  sphereNear(b.sphere,ref.sphere);
  assert.equal(pairSphereFromPolar(polar(-Infinity),polar(-Infinity)).status,'simultaneous-zero');
  assert.equal(pairSphereFromPolar(polar(0),{valid:false,logAbs:0,arg:0}).valid,false);
  assert.equal(pairSphereFromPolar(polar(-1000),polar(0)).roundedToPole,true);
});

test('projective domain handles special points, lens, involution and huge finite coordinates',()=>{
  sphereNear(domainProjective(.5,0).sphere,{x:-1,y:0,z:0});
  sphereNear(domainProjective(0,0).sphere,{x:0,y:0,z:1});
  sphereNear(domainProjective(1,0).sphere,{x:0,y:0,z:-1});
  sphereNear(domainProjective(.5,Infinity).sphere,{x:1,y:0,z:0});
  assert.equal(domainProjective(0,0).chartInfinity,true);
  assert.equal(domainProjective(.5,Infinity).spectralInfinity,true);
});

test('projective domain functional map and scaled critical circle',()=>{
  const p=domainProjective(.7,14,24),q=domainProjective(.3,-14,24);
  nearC(mul(p.w,q.w),C(1));
  sphereNear(q.sphere,{x:p.sphere.x,y:-p.sphere.y,z:-p.sphere.z});
  const literal=domainProjective(.5+(20-.5)/24,300/24);
  sphereNear(literal.sphere,domainProjective(20,300,24).sphere);
  for(const t of [0,1,14.134725141734693,1e300])near(domainProjective(.5,t).sphere.z,0);
  const huge=domainProjective(Number.MAX_VALUE,Number.MAX_VALUE);
  assert.ok(huge.valid);near(Math.hypot(...Object.values(huge.sphere)),1);
  assert.equal(domainProjective(.5,0,0).valid,false);
});

test('derivative projective Cayley sign follows the Hermitian balance',()=>{
  for(const q of [C(2,3),C(-2,3),C(2e200,3e200)]){
    const p=derivativeProjective({...polar(-1000),q,derivativeLogAbs:-1000+Math.log(Math.hypot(q.re,q.im))},.7);
    assert.ok(p.valid);assert.equal(p.diskSign,Math.sign(q.re));
    assert.equal(Math.sign(p.diskMargin),Math.sign(q.re));
    const [U,V]=p.homogeneous;
    const ref=homogeneousSphere(C(U.re-V.re,U.im-V.im),C(U.re+V.re,U.im+V.im));
    nearC(p.cayley,ref.affine);
  }
  const pole=derivativeProjective({...polar(0),q:C(-1),derivativeLogAbs:0});
  assert.equal(pole.cayleyPole,true);assert.equal(pole.cayley,null);
  assert.equal(pole.diskRegion,'outside');
  const boundary=derivativeProjective({...polar(0),q:C(0,2),derivativeLogAbs:Math.log(2)});
  assert.equal(boundary.unresolved,true);assert.equal(boundary.diskSign,0);
});

test('function zeros and missing derivative phases are explicit',()=>{
  const zero=derivativeProjective({...polar(-Infinity),q:C(NaN,NaN),derivativeLogAbs:-30});
  assert.ok(zero.valid);sphereNear(zero.sphere,{x:0,y:0,z:-1});nearC(zero.cayley,C(-1));
  assert.equal(zero.unresolved,true);
  assert.equal(derivativeProjective({...polar(-Infinity),derivativeLogAbs:-Infinity}).valid,false);
  assert.equal(derivativeProjective({...polar(-30),q:C(NaN,NaN),derivativeLogAbs:-5}).valid,false);
  assert.equal(derivativeProjective(polar(-30)).valid,false);
});

test('derivative state consumes actual extended xi data without raw decoding',()=>{
  for(const [sigma,t] of [[.5,0],[.65,14.14],[2,1600]]){
    const p=evaluatePolar(sigma,t,'xi',0,true),d=derivativeProjective(p,.3);
    assert.ok(p.valid);assert.ok(d.valid);
    const expected=homogeneousSphere(C(1),C(.3*p.q.re,.3*p.q.im));
    sphereNear(d.sphere,expected.sphere);
    if(t===1600)assert.equal(p.status,'underflow');
  }
});

test('elliptic homogeneous coordinates satisfy both quadrics on finite and puncture charts',()=>{
  for(const r of [1.1,1.6,2,5]){
    const landmarks=torusLandmarks({r,scale:24});
    for(const p of [torusPoint(.1,.1,{r}),torusPoint(.47,.88,{r}),...landmarks.punctures.map(a=>torusPoint(a.u,a.v,{r}))]){
      const h=torusProjective(p,{r});assert.ok(h.valid);
      assert.ok(h.residuals.quadric1<1e-12);assert.ok(h.residuals.quadric2<2e-11);
      near(Math.hypot(...h.coordinates.flatMap(z=>[z.re,z.im])),1);
    }
  }
});

test('chart infinity retains the two distinct elliptic points',()=>{
  const pt=torusPoint(0,0,{r:2,scale:1});
  const unknown=torusProjective({w:pt.w,eta:pt.eta},{r:2});
  assert.equal(unknown.valid,false);assert.equal(unknown.candidates.length,2);
  const plus=torusProjective(pt,{r:2,infinitySign:1}),minus=torusProjective(pt,{r:2,infinitySign:-1});
  assert.ok(plus.valid&&minus.valid);assert.equal(plus.spectralInfinity,false);
  near(plus.coordinates[3].re,-minus.coordinates[3].re);
  near(plus.coordinates[0].re,0);near(plus.coordinates[2].re,1/Math.sqrt(2));
  const automatic=torusProjective(pt,{r:2});
  assert.equal(automatic.infinitySignSource,'analytic-derivative');
  near(automatic.coordinates[3].re,1/Math.sqrt(2));
  const second=torusProjective(torusPoint(.5,0,{r:2,scale:24}),{r:2});
  near(second.coordinates[3].re,-1/Math.sqrt(2));
});
