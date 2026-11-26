import test from 'node:test';
import assert from 'node:assert/strict';
import {ZERO_HEIGHTS} from '../dist/math.js';
import {DROP,R0_FM,MODES,nucleusConfig,dropEnergies,stiffness,massC2,modeEnergy,symmetricEigen,coupledModes,amplitudesAt,legendre,y0,shapeProfile,rotorEnergy,erf,SPACING_LAWS,uniformSpacings,smoothZeroCount,zeroSpacings,ksDistance} from '../dist/nucleus-model.js';
import {U238_DATA} from '../dist/nucleus-data.js';

const close=(a,b,tol=1e-9)=>assert.ok(Math.abs(a-b)<=tol,`${a} vs ${b}`);

test('liquid-drop energies of uranium-238 follow the stated coefficients',()=>{
  const d=dropEnergies(92,238);
  close(R0_FM,.6*DROP.e2/DROP.aC);close(d.R0,R0_FM*238**(1/3));
  close(d.Es,17.81*238**(2/3));close(d.Ec,.711*92*92/238**(1/3));
  // Coulomb energy of a uniformly charged sphere of that radius.
  close(d.Ec,.6*DROP.e2*92*92/d.R0,1e-9);
  close(d.fissility,(92*92/238)/d.criticalZ2A,1e-12);
  assert.ok(d.fissility>.70&&d.fissility<.72);close(d.criticalZ2A,2*17.81/.711);
});

test('the quadrupole stiffness vanishes exactly at fissility one',()=>{
  for(const [Z,A] of [[92,238],[100,250],[115,261],[126,316]]){
    const {Es,Ec,fissility}=dropEnergies(Z,A),s=stiffness(2,Z,A);
    close(s.C,(Es-Ec/2)/Math.PI,1e-9);close(s.C,Es*(1-fissility)/Math.PI,1e-9);
    assert.equal(s.C>0,fissility<1);assert.equal(modeEnergy(2,Z,A).stable,fissility<1);
  }
  // Higher multipoles are stiffer: surface grows like λ², Coulomb saturates.
  const C=MODES.map(l=>stiffness(l,92,238).C);for(let i=1;i<C.length;i++)assert.ok(C[i]>C[i-1]);
});

test('uncoupled energies use the irrotational mass',()=>{
  for(const lambda of MODES){
    const e=modeEnergy(lambda,92,238),expected=DROP.hbarc*Math.sqrt(stiffness(lambda,92,238).C/massC2(lambda,238));
    close(e.energy,expected,1e-12);assert.ok(e.stable);
  }
  close(massC2(2,238),3/(8*Math.PI)*238*DROP.amu*(R0_FM*238**(1/3))**2,1e-6);
  const e2=modeEnergy(2,92,238).energy;assert.ok(e2>1.2&&e2<1.35,`ħω₂ = ${e2}`);
});

test('the Jacobi solver diagonalises symmetric matrices',()=>{
  const {values,vectors}=symmetricEigen([[2,1,0],[1,2,1],[0,1,2]]);
  close(values[0],2-Math.SQRT2);close(values[1],2);close(values[2],2+Math.SQRT2);
  const m=[[4,1,-2,.5],[1,3,0,1],[-2,0,5,-1],[.5,1,-1,2]],e=symmetricEigen(m);
  e.vectors.forEach((v,k)=>{
    for(let i=0;i<4;i++){let mv=0;for(let j=0;j<4;j++)mv+=m[i][j]*v[j];close(mv,e.values[k]*v[i],1e-10);}
    e.vectors.forEach((u,j)=>close(v.reduce((s,x,i)=>s+x*u[i],0),j===k?1:0,1e-10));
  });
  assert.ok(vectors.length===3);
});

test('without coupling the normal modes are the multipoles',()=>{
  for(const input of [{coupling:0},{beta2:0,coupling:2}]){
    const modes=coupledModes(input),energies=modes.parts.map(p=>p.energy).sort((a,b)=>a-b);
    modes.normal.forEach((mode,k)=>close(mode.energy,energies[k],1e-9));assert.ok(modes.stable);
  }
});

test('coupling mixes equal parity only and can destabilise a stable drop',()=>{
  const modes=coupledModes({coupling:.5});
  for(let i=0;i<MODES.length;i++)for(let j=0;j<MODES.length;j++){
    const linked=Math.abs(MODES[i]-MODES[j])===2;
    if(i!==j)assert.equal(modes.K[i][j]!==0,linked);close(modes.K[i][j],modes.K[j][i]);
  }
  close(modes.K[0][2],.5*.286*Math.sqrt(modes.parts[0].C*modes.parts[2].C),1e-9);
  assert.ok(modes.stable);
  const strong=coupledModes({coupling:3,beta2:.6});
  assert.ok(strong.parts.every(p=>p.stable),'each multipole alone is stable');
  assert.equal(strong.stable,false);assert.ok(strong.normal[0].squared<0);
  assert.equal(coupledModes({Z:115,N:146}).stable,false,'past the liquid-drop threshold');
});

test('the plucked amplitude starts from rest, rings and decays',()=>{
  const free=coupledModes({coupling:0,width:0,pluck:2}),E=free.parts[0].energy;
  assert.deepEqual(amplitudesAt(free,0,.1).map(x=>+x.toFixed(12)),[.1,0,0,0,0]);
  for(const t of [.4,1.7,9]){close(amplitudesAt(free,t,.1)[0],.1*Math.cos(E*t),1e-12);}
  const damped=coupledModes({coupling:0,width:.2,pluck:3});
  close(amplitudesAt(damped,5,.1)[1],.1*Math.cos(damped.parts[1].energy*5)*Math.exp(-.5),1e-12);
  // Coupled, undamped: energy ½ ȧᵀBȧ + ½ aᵀKa is conserved; parity is preserved.
  const coupled=coupledModes({coupling:.8,width:0,pluck:2});
  const energy=t=>{const h=1e-5,a=amplitudesAt(coupled,t),b=amplitudesAt(coupled,t+h),c=amplitudesAt(coupled,t-h);let total=0;
    for(let i=0;i<5;i++){const v=(b[i]-c[i])/(2*h);total+=.5*coupled.parts[i].massC2/DROP.hbarc**2*v*v;for(let j=0;j<5;j++)total+=.5*a[i]*coupled.K[i][j]*a[j];}return total;};
  const e0=energy(0);for(const t of [1,4.2,11])close(energy(t)/e0,1,1e-5);
  for(const t of [1,4.2,11]){const a=amplitudesAt(coupled,t);close(a[1],0,1e-12);close(a[3],0,1e-12);assert.ok(Math.abs(a[2])>1e-5);}
});

test('shape profiles conserve volume and use orthonormal axial harmonics',()=>{
  close(legendre(2,.3),(3*.09-1)/2);close(legendre(4,.5),(35*.0625-30*.25+3)/8);close(y0(0,.7),1/Math.sqrt(4*Math.PI));
  // ∫ Y_l0 Y_k0 dΩ = δ_lk
  const overlap=(l,k)=>{let s=0;const n=4000;for(let i=0;i<n;i++){const x=-1+2*(i+.5)/n;s+=y0(l,x)*y0(k,x)*2/n;}return 2*Math.PI*s;};
  close(overlap(2,2),1,1e-6);close(overlap(2,4),0,1e-6);close(overlap(3,3),1,1e-6);
  for(const [beta2,a] of [[0,[0,0,0,0,0]],[.286,[0,0,0,0,0]],[.286,[.1,-.05,.03,0,.02]]]){
    const r=shapeProfile(beta2,a,400);let v=0;
    for(let i=0;i<=400;i++){const th=Math.PI*i/400;v+=(i===0||i===400?.5:1)*r[i]**3*Math.sin(th)*Math.PI/400;}
    close(v,2,1e-9);
  }
  const prolate=shapeProfile(.286,[0,0,0,0,0],96);assert.ok(prolate[0]>prolate[48],'β₂ > 0 is longer along the axis');
});

test('the measured ground band is close to, and softer than, a rigid rotor',()=>{
  const band=U238_DATA.groundBand,e2=band[0].energy;
  close(rotorEnergy(2,e2),e2);close(rotorEnergy(4,e2)/e2,10/3);
  close(band[1].energy/e2,3.3035,2e-3);          // E(4+)/E(2+), rotor limit 3.333
  for(const level of band.slice(1))assert.ok(level.energy<rotorEnergy(level.J,e2));
  for(let i=1;i<band.length;i++)assert.ok(band[i].energy>band[i-1].energy&&band[i].J===band[i-1].J+2);
});

test('spacing laws are normalised distributions with unit mean',()=>{
  close(erf(0),0);close(erf(1),.8427007929,2e-7);close(erf(-.5),-.5204998778,2e-7);
  for(const name of ['poisson','goe','gue']){
    const law=SPACING_LAWS[name];close(law(0),0,1e-9);close(law(12),1,1e-5);
    let mean=0,previous=0;const n=24000;
    for(let i=1;i<=n;i++){const s=12*i/n,f=law(s);assert.ok(f>=previous-2e-7);mean+=(1-(f+previous)/2)*12/n;previous=f;}
    close(mean,1,2e-4);
  }
  assert.ok(SPACING_LAWS.gue(.2)<SPACING_LAWS.goe(.2)&&SPACING_LAWS.goe(.2)<SPACING_LAWS.poisson(.2),'repulsion: GUE > GOE > none');
});

test('resonances and zeros repel; neither sample looks Poisson',()=>{
  const levels=U238_DATA.resonances;
  assert.equal(levels.length,100);for(let i=1;i<levels.length;i++)assert.ok(levels[i]>levels[i-1]);
  const resonances=uniformSpacings(levels);close(resonances.reduce((a,b)=>a+b,0)/resonances.length,1,1e-12);
  close((levels.at(-1)-levels[0])/99,21.681,1e-3);
  assert.ok(ksDistance(resonances,SPACING_LAWS.goe)<.12);assert.ok(ksDistance(resonances,SPACING_LAWS.poisson)>.2);
  const zeros=zeroSpacings(ZERO_HEIGHTS);assert.equal(zeros.length,ZERO_HEIGHTS.length-1);
  close(zeros.reduce((a,b)=>a+b,0)/zeros.length,1,.05);
  close(smoothZeroCount(ZERO_HEIGHTS[0]),.5,.6);
  assert.ok(ksDistance(zeros,SPACING_LAWS.gue)<ksDistance(zeros,SPACING_LAWS.poisson));
  close(ksDistance([.5],s=>s),.5);
});

test('quoted data are internally consistent',()=>{
  // SF partial half-life implied by the branching: about 8.2e15 years.
  close(U238_DATA.halfLifeYears/(U238_DATA.spontaneousFissionPercent/100)/1e15,8.2,.05);
  assert.ok(U238_DATA.fissionBarriers.inner>U238_DATA.fissionBarriers.outer);
  assert.deepEqual(nucleusConfig({}),{Z:92,N:146,beta2:.286,coupling:.5,width:.05,pluck:2});
  assert.deepEqual(nucleusConfig({Z:500,N:-3,beta2:9,pluck:7}),{Z:130,N:80,beta2:.6,coupling:.5,width:.05,pluck:2});
});
