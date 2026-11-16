import test from 'node:test';
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import fs from 'node:fs/promises';
import vm from 'node:vm';

// A VM-linked numerical module actively throws if the UI renderer attempts
// analytic evaluation. The child flag is needed by Node's module-linking API;
// ordinary `npm test` remains sufficient to run the guard.
if(typeof vm.SourceTextModule!=='function'){
  test('cached render/play paths perform no analytic evaluation and preserve cached inputs',{timeout:90000},()=>{
    const env={...process.env};delete env.NODE_TEST_CONTEXT;
    const child=spawnSync(process.execPath,['--experimental-vm-modules',fileURLToPath(import.meta.url)],{encoding:'utf8',timeout:80000,env});
    assert.equal(child.status,0,[child.error?.message,child.stdout,child.stderr].filter(Boolean).join('\n'));
  });
}else{
  const THREE=await import('../dist/vendor/three.module.js');
  const {sampleField}=await import('../dist/sampler.js');
  const {NUMERICS}=await import('../dist/math.js');
  const DISPLAY=await import('../dist/display-field.js');
  const {continueMaskedHeights}=await import('../dist/geometry.js');
  let evaluations=0;
  const reject=()=>{evaluations++;throw Error('Analytic evaluation on render/play path');};
  async function linkedRenderer(filename){
    const numerical=new vm.SyntheticModule(['evaluate','evaluatePolar','NUMERICS'],function(){this.setExport('evaluate',reject);this.setExport('evaluatePolar',reject);this.setExport('NUMERICS',NUMERICS);});
    // continueMaskedHeights is pure grid arithmetic (no evaluation), so the real one is linked.
    const geometry=new vm.SyntheticModule(['liftPoint','continueMaskedHeights'],function(){this.setExport('liftPoint',reject);this.setExport('continueMaskedHeights',continueMaskedHeights);});
    const three=new vm.SyntheticModule(Object.keys(THREE),function(){for(const[k,v]of Object.entries(THREE))this.setExport(k,v);});
    const controls=new vm.SyntheticModule(['OrbitControls'],function(){this.setExport('OrbitControls',class{});});
    const display=new vm.SyntheticModule(Object.keys(DISPLAY),function(){for(const[k,v]of Object.entries(DISPLAY))this.setExport(k,v);});
    const module=new vm.SourceTextModule(await fs.readFile(new URL('../dist/'+filename,import.meta.url),'utf8'));
    const dependencies={'./math.js':numerical,'./geometry.js':geometry,'./vendor/OrbitControls.js':controls,
      './vendor/three.module.js':three,'./display-field.js':display};
    await module.link(spec=>{assert.ok(dependencies[spec],`Unmocked renderer dependency ${spec}`);return dependencies[spec];});
    await module.evaluate();return module.namespace;
  }
  for(const mode of [{geometry:'torus',projective:false,resolution:'standard'},
    {geometry:'sphere',projective:true,resolution:'draft'},
    {geometry:'torus',projective:true,resolution:'draft'},
    {geometry:'klein',projective:true,resolution:'draft'}])
  test(`${mode.projective?'projective':'ordinary'} ${mode.geometry}: cached Play/Pause and styles do not evaluate`,{timeout:70000},async()=>{
    evaluations=0;
    const state={geometry:'torus',resolution:'standard',function:'heat',tau:.2,extent:'extended',chartScale:24,torusR:1.6,bridgeA:.25,
      colorMode:'phase',heightMode:'log',height:.55,opacity:.98,contours:true,critical:true,zeros:false,seams:false,ladder:true,packets:false,vortices:false,
      sigmaMin:-2,sigmaMax:3,tMin:8,tMax:38,heightLocked:true,heightLogReference:0,heightReference:1,playing:true,...mode,seams:mode.projective};
    const data=sampleField(state),original=structuredClone(data);
    assert.equal(data.criticalSamples.length,['sphere','klein'].includes(state.geometry)?1:2);
    assert.equal(data.landmarkValues.length,state.geometry==='klein'?6:state.projective?(state.geometry==='sphere'?8:10):8);
    if(state.projective)assert.ok(data.projectiveGuides.length>0,'sampled chart guides are available during playback');
    const statuses=[];
    const {CanvasZetaScene}=await linkedRenderer('canvas-renderer.js');
    const cpu=Object.create(CanvasZetaScene.prototype);
    Object.assign(cpu,{state:{},width:900,heightPixels:650,yaw:.62,pitch:.73,zoom:1,panX:0,panY:0,onStatus:s=>statuses.push(s),probeCoordinates:{sigma:.5,t:14.13}});
    cpu.setData(data,state);
    const movingFaces=cpu.faces;
    assert.equal(cpu.fullDetailPrepared,false);assert.equal(cpu.faces,cpu.motionFaces);assert.equal(cpu.probes.length,0);
    assert.equal(cpu.criticalSamples(),data.criticalSamples);
    cpu.yaw=1.234;cpu.zoom=1.45;const savedCamera=cpu.getCameraState();
    cpu.setData(data,state);
    assert.equal(cpu.faces,movingFaces);assert.deepEqual(cpu.getCameraState(),savedCamera);assert.equal(statuses.at(-1).preparedCacheHit,true);
    cpu.updateStyle({playing:false});
    assert.equal(cpu.fullDetailPrepared,true);assert.ok(cpu.faces.length>=movingFaces.length,'Pause retains at least the full selected detail');
    if(mode.resolution==='standard')assert.ok(cpu.faces.length>movingFaces.length,'Pause restores full standard detail');
    assert.equal(statuses.at(-1).motionDetail,false);assert.equal(statuses.at(-1).meshStride,cpu.stride);assert.equal(cpu.probes.length,0);
    cpu.updateStyle({height:.65,ladder:false,colorMode:'real'});
    assert.equal(cpu.probes.length,0,'An automatic redraw must not evaluate the old inspection point');
    cpu.updateStyle({colorMode:'phase'});
    const plainCPUColors=cpu.faces.filter(face=>!face.masked).map(face=>face.color);
    cpu.updateStyle({displayDamping:true,displayDampingScale:30});
    assert.ok(cpu.faces.filter(face=>!face.masked).some((face,i)=>face.color!==plainCPUColors[i]),'display damping actually changes cached face colors');
    for(let i=0;i<data.valid.length;i++)for(let axis=0;axis<3;axis++)assert.equal(cpu.raised[i][axis],data.basePositions[3*i+axis],'smooth display uses the exact base surface');
    assert.equal(cpu.sampleLogs,data.logAbs);assert.equal(cpu.sampleArgs,data.arg,'original phases remain the shared diagnostic buffer');
    cpu.updateStyle({displayDamping:false});
    assert.deepEqual(cpu.faces.filter(face=>!face.masked).map(face=>face.color),plainCPUColors,'turning display damping off restores the original colors');

    const {ZetaScene}=await linkedRenderer('renderer.js');
    const gpu=Object.create(ZetaScene.prototype);
    Object.assign(gpu,{state:{},renderer:{},surfaceGroup:new THREE.Group(),overlayGroup:new THREE.Group(),guideGroup:new THREE.Group(),probeGroup:new THREE.Group(),controls:{},
      buildGuides(){},addZero(){},resetCamera(){},onStatus:s=>statuses.push(s),probeCoordinates:{sigma:.5,t:14.13}});
    gpu.setData(data,state);const geometryBuffer=gpu.surface.geometry;
    gpu.setData(data,state);assert.equal(gpu.surface.geometry,geometryBuffer);assert.equal(gpu.criticalSamples(),data.criticalSamples);
    gpu.updateStyle({playing:false,height:.7,colorMode:'imag'});assert.equal(gpu.probeGroup.children.length,0);
    gpu.updateStyle({colorMode:'phase'});
    const plainGPUColors=gpu.surface.geometry.getAttribute('color').array.slice();
    gpu.updateStyle({displayDamping:true,displayDampingScale:30});
    assert.ok(gpu.surface.geometry.getAttribute('color').array.some((value,i)=>data.valid[Math.floor(i/3)]&&value!==plainGPUColors[i]),'display damping actually changes cached vertex colors');
    assert.deepEqual(gpu.raised,data.basePositions,'GPU smooth display preserves the exact base embedding');
    assert.equal(gpu.sampleLogs,data.logAbs);assert.equal(gpu.sampleArgs,data.arg);
    gpu.updateStyle({displayDamping:false});
    assert.deepEqual(gpu.surface.geometry.getAttribute('color').array,plainGPUColors,'GPU display damping is reversible without resampling');
    assert.equal(evaluations,0,'No zeta/xi/theta evaluation or inverse inspection is allowed while applying cached frames');
    assert.deepEqual(data,original,'Renderer styling and frame reuse must not mutate shared cached fields');
    // Prove the throwing guard is active: explicitly requesting fresh inspection
    // while paused does call the permitted evaluator and reaches our sentinel.
    assert.throws(()=>cpu.setProbe(.5,14.1),/Analytic evaluation/);
    assert.equal(evaluations,1);
  });
}


