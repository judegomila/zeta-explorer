import test from 'node:test';
import assert from 'node:assert/strict';
import {normalizeProjective4,quaternionicStructure,quaternionRightAction,quaternionicHopf,projectS4,ellipticQuadricResiduals,twistorFromProjective} from '../dist/twistor.js';
import {torusPoint,torusLandmarks} from '../dist/elliptic.js';
import {torusProjective} from '../dist/projective.js';

const C=(re=0,im=0)=>({re,im});
const mul=(a,b)=>C(a.re*b.re-a.im*b.im,a.re*b.im+a.im*b.re);
const near=(a,b,t=5e-13)=>assert.ok(Math.abs(a-b)<t,`${a} != ${b}`);
const nearArray=(a,b)=>{assert.equal(a.length,b.length);a.forEach((v,i)=>near(v,b[i]));};
const flat=z=>z.flatMap(v=>[v.re,v.im]);
const Z=[C(.2,.3),C(-.7,.1),C(.5,-.2),C(.1,.8)];

test('quaternionic real structure is anti-linear, norm preserving, and squares to minus one',()=>{
  const J=quaternionicStructure(Z),JJ=quaternionicStructure(J),lambda=C(.7,.2);
  nearArray(flat(JJ),flat(Z.map(z=>C(-z.re,-z.im))));
  const expected=J.map(z=>mul(C(lambda.re,-lambda.im),z));
  nearArray(flat(quaternionicStructure(Z.map(z=>mul(lambda,z)))),flat(expected));
  near(Math.hypot(...flat(J)),Math.hypot(...flat(Z)));
});

test('twistor Hopf map descends through complex scaling and has unit S4 norm',()=>{
  const base=quaternionicHopf(Z);
  near(Math.hypot(...base.s4),1);
  for(const lambda of [C(2,-3),C(1e300,2e300),C(1e-300,-2e-300)])
    nearArray(quaternionicHopf(Z.map(z=>mul(z,lambda))).s4,base.s4);
  assert.equal(normalizeProjective4([C(),C(),C(),C()]).valid,false);
  assert.equal(normalizeProjective4([C(Infinity),C(Infinity),C(),C()]).valid,false);
  nearArray(quaternionicHopf([C(Infinity),C(),C(),C()]).s4,[0,0,0,0,1]);
});

test('common right SU2 action preserves S4 for general unit quaternions',()=>{
  const base=quaternionicHopf(Z).s4;
  for(const h of [{a:C(.3,.4),b:C(-.2,.7)},{a:C(0,1),b:C()},{a:C(),b:C(1)}]){
    const transformed=quaternionRightAction(Z,h);
    near(Math.hypot(...flat(transformed)),1);nearArray(quaternionicHopf(transformed).s4,base);
  }
});

test('full CP1 fiber varies in CP3 while the same S4 base is retained',()=>{
  const curve=torusProjective(torusPoint(.17,.31,{r:2,scale:24}),{r:2});
  const base=twistorFromProjective(curve);
  assert.ok(base.onSourceCurve&&base.onCurve);
  for(const theta of [0,.4,1.6,Math.PI])for(const phi of [0,.7,2.1,2*Math.PI]){
    const p=twistorFromProjective(curve,{theta,phi});
    assert.ok(p.valid);nearArray(p.s4,base.s4);assert.ok(p.invarianceError<1e-12);
    near(p.fiber.bloch.x,Math.sin(theta)*Math.cos(phi));
    near(p.fiber.bloch.y,Math.sin(theta)*Math.sin(phi));near(p.fiber.bloch.z,Math.cos(theta));
  }
  const moved=twistorFromProjective(curve,{theta:1.2,phi:.8});
  assert.equal(moved.onCurve,false);assert.ok(Math.max(...Object.values(moved.curveResiduals))>.01);
});

test('fiber controls use a homogeneous gauge and deck choice precedes the fiber action',()=>{
  const curve=torusProjective(torusPoint(.23,.19,{r:2}),{r:2});
  const options={theta:.8,phi:1.3,sheet:'minus'};
  const a=twistorFromProjective(curve,options);
  const lambda=C(-.7,.9),b=twistorFromProjective({...curve,coordinates:curve.coordinates.map(z=>mul(z,lambda))},options);
  nearArray(flat(a.coordinates),flat(b.coordinates));nearArray(a.s4,b.s4);
  const flipped={...curve,coordinates:curve.coordinates.map((z,i)=>i===3?C(-z.re,-z.im):z)};
  nearArray(twistorFromProjective(flipped,{theta:.8,phi:1.3}).s4,a.s4);
  assert.ok(a.sourceCurveResiduals.quadric1<1e-12&&a.sourceCurveResiduals.quadric2<1e-12);
});

test('S4 chart infinity is explicit and the other stereographic chart is regular',()=>{
  const north=[0,0,0,0,1],south=[0,0,0,0,-1];
  assert.equal(projectS4(north).status,'chart-infinity');
  nearArray(projectS4(north,{projection:'south'}).coordinates,[0,0,0,0]);
  assert.equal(projectS4(south,{projection:'south'}).status,'chart-infinity');
  nearArray(projectS4(south).coordinates,[0,0,0,0]);
  const point=quaternionicHopf(Z).s4,p=projectS4(point).coordinates,q=projectS4(point,{projection:'south'}).coordinates;
  const radius2=p.reduce((sum,x)=>sum+x*x,0);nearArray(p.map(x=>x/radius2),q);
  const close=projectS4([1e-200,0,0,0,1]);assert.ok(close.valid);near(close.coordinates[0]/2e200,1);
});

test('elliptic infinity and branch points retain geometric twistor coordinates',()=>{
  const r=2,landmarks=torusLandmarks({r});
  const points=[...landmarks.punctures,...landmarks.branches,{u:0,v:0},{u:.5,v:0}];
  for(const point of points){
    const curve=torusProjective(torusPoint(point.u,point.v,{r}),{r});
    const p=twistorFromProjective(curve,{theta:.6,phi:.9});
    assert.ok(p.valid);near(Math.hypot(...p.s4),1);assert.ok(p.invarianceError<1e-12);
    const res=ellipticQuadricResiduals(p.baseCoordinates,r);assert.ok(res.quadric1<1e-12&&res.quadric2<1e-12);
  }
});
