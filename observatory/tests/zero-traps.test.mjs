import test from 'node:test';
import assert from 'node:assert/strict';
import { trapDiscs, trapWinding, computeTraps, CERTIFIED_WITNESS } from '../dist/zero-traps.js';
import { sampleField } from '../dist/sampler.js';
import { fieldKey } from '../dist/field-cache.js';
import { ZERO_HEIGHTS } from '../dist/math.js';

test('trap discs are centred on the line, pairwise disjoint, and keep the witness radius',()=>{
  const discs=trapDiscs(ZERO_HEIGHTS);
  for(let i=1;i<discs.length;i++)assert.ok(discs[i-1].t+discs[i-1].radius<discs[i].t-discs[i].radius);
  assert.equal(discs[0].radius,CERTIFIED_WITNESS.radius);
});

test('winding counts one around a zero, zero around none, two around a pair',()=>{
  assert.deepEqual([trapWinding(ZERO_HEIGHTS[0],.35).count,trapWinding(17.5,.4).count],[1,0]);
  const mid=(ZERO_HEIGHTS[1]+ZERO_HEIGHTS[2])/2,wide=trapWinding(mid,2.5);
  assert.equal(wide.count,2);assert.ok(wide.resolved);
});

test('only the shipped witness disc is labelled certified, and only for small heat time',()=>{
  const traps=computeTraps(ZERO_HEIGHTS);
  assert.equal(traps[0].status,'certified');assert.equal(traps[0].certificateId,CERTIFIED_WITNESS.id);
  for(const trap of traps.slice(1)){assert.equal(trap.status,'count-one');assert.equal(trap.certificateId,null);}
  assert.equal(computeTraps(ZERO_HEIGHTS.slice(0,3),{kind:'heat',tau:.2})[0].status==='certified',false);
});

test('a disc holding two zeros is unresolved, never reported as a trap',()=>{
  const mid=(ZERO_HEIGHTS[1]+ZERO_HEIGHTS[2])/2;
  assert.equal(trapWinding(mid,2.5).count===1,false);
});

const base={function:'xi',tau:0,torusR:2,chartScale:24,resolution:'draft',extent:'extended',colorMode:'phase',bridgeA:.25,projective:true,sigmaMin:-1.5,sigmaMax:2.5,tMin:8,tMax:38};
test('layers are off by default and own their cache keys',()=>{
  const s={...base,geometry:'torus'},plain=sampleField(s);
  assert.deepEqual(plain.zeroTraps,[]);assert.deepEqual(plain.fallLines,[]);
  assert.notEqual(fieldKey({...s,traps:true}),fieldKey(s));assert.notEqual(fieldKey({...s,fall:true}),fieldKey(s));
  assert.equal(fieldKey({...s,traps:false,fall:false}),fieldKey(s));
});

for(const geometry of ['plane','torus','klein'])
test(`${geometry}: released particles end on critical-line zeros and trap rings are drawn`,()=>{
  const data=sampleField({...base,geometry,projective:geometry!=='plane',traps:true,fall:true});
  assert.ok(data.zeroTraps.length>0);
  for(const trap of data.zeroTraps){assert.ok(trap.rings.length>0);assert.notEqual(trap.status,'unresolved');}
  const arrived=data.fallLines.filter(line=>line.arrived);
  assert.ok(arrived.length>.9*data.fallLines.length,`${arrived.length}/${data.fallLines.length} arrived`);
  // The end point is reported, never snapped: it is checked against the line.
  for(const line of arrived){
    assert.ok(Math.abs(line.endSigma-.5)<.02,`ended at sigma ${line.endSigma}`);
    assert.ok(ZERO_HEIGHTS.some(z=>Math.abs(Math.abs(line.endT)-z)<.05),`ended at t ${line.endT}`);
  }
});

test('fall lines are coloured by the zero they reach, one colour per basin',()=>{
  const data=sampleField({...base,geometry:'torus',projective:true,fall:true});
  const arrived=data.fallLines.filter(p=>p.arrived);
  assert.ok(arrived.length>20);
  const byBasin=new Map();
  for(const path of arrived){
    assert.match(path.color,/^#[0-9a-f]{6}$/);
    if(byBasin.has(path.basin))assert.equal(byBasin.get(path.basin),path.color);
    byBasin.set(path.basin,path.color);
  }
  assert.ok(byBasin.size>1,'more than one basin is reached');
  assert.equal(new Set(byBasin.values()).size,byBasin.size,'basins have distinct colours');
  for(const path of data.fallLines.filter(p=>!p.arrived)){assert.equal(path.basin,null);assert.equal(path.color,'#6f86a6');}
});

test('the counted region is drawn only when a count height is set, and owns its cache key',()=>{
  const s={...base,geometry:'torus',projective:true};
  assert.equal(sampleField(s).countBox.length,0);
  assert.equal(fieldKey({...s,countT:0}),fieldKey(s));
  assert.notEqual(fieldKey({...s,countT:50}),fieldKey(s));
  assert.notEqual(fieldKey({...s,countT:50}),fieldKey({...s,countT:60}));
  const box=sampleField({...s,countT:50}).countBox;
  assert.ok(box.length>=4);
  for(const edge of box)assert.equal(edge.kind,'count-box');
});
