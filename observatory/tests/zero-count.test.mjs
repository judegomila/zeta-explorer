import test from 'node:test';
import assert from 'node:assert/strict';
import { stripZeroCount, lineZeroCount, completeZeroCount } from '../dist/zero-count.js';
import { ZERO_HEIGHTS } from '../dist/math.js';

test('strip count matches the known number of zeros below several heights',()=>{
  // 10 zeros below 50, 29 below 100, 79 below 200 (classical tables).
  for(const [T,expected] of [[20,1],[50,10],[100,29],[200,79]]){
    const r=stripZeroCount(T);
    assert.equal(r.count,expected,`N(${T})`);assert.ok(r.resolved);assert.ok(r.residual<.01,`residual ${r.residual}`);
  }
});

test('strip count steps by one across each reference zero',()=>{
  for(const t of ZERO_HEIGHTS.slice(0,8))assert.equal(stripZeroCount(t+.05).count-stripZeroCount(t-.05).count,1,`zero at ${t}`);
});

test('line count agrees with the strip count, so the count is complete to T',()=>{
  for(const T of [50,100,200]){
    const r=completeZeroCount(T);
    assert.equal(r.line,r.strip);assert.equal(r.complete,true);
  }
  assert.equal(lineZeroCount(100).count,29);
});

test('a too-coarse line scan is reported as incomplete, never as agreement',()=>{
  const r=completeZeroCount(200,{step:3});
  assert.ok(r.line<r.strip);assert.equal(r.complete,false);
});

test('heights outside the evaluated range are rejected',()=>{
  assert.throws(()=>stripZeroCount(0),RangeError);assert.throws(()=>completeZeroCount(5000),RangeError);
});
