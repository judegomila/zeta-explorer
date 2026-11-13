/**
 * Lossless frame container. Typed-array bytes are copied verbatim, preserving
 * float64 values, NaNs and signed zero. JSON metadata uses tagged nonfinite
 * numbers, so geometric punctures survive a round trip without invented values.
 * Compression belongs to transport: decodeField expects decompressed bytes.
 */
export const CACHE_CODEC_VERSION=1;
const MAGIC='ZETAF001',PREFIX=16,TAG='__zetaFieldTag';
const encoder=new TextEncoder(),decoder=new TextDecoder();
const constructors={Float64Array,Float32Array,Uint8Array,Uint8ClampedArray,Int8Array,Uint16Array,Int16Array,Uint32Array,Int32Array};
const align8=n=>Math.ceil(n/8)*8;
const littleEndian=new Uint8Array(new Uint16Array([1]).buffer)[0]===1;

export function encodeField(data){
 if(!littleEndian)throw new Error('This frame format requires little-endian typed arrays.');
 const chunks=[];let payloadBytes=0;
 const json=JSON.stringify({version:CACHE_CODEC_VERSION,data},(key,value)=>{
  if(ArrayBuffer.isView(value)){
   const type=value.constructor.name;
   if(!constructors[type])throw new TypeError('Unsupported frame array: '+type);
   const offset=align8(payloadBytes),bytes=new Uint8Array(value.buffer,value.byteOffset,value.byteLength);
   chunks.push({offset,bytes});payloadBytes=offset+bytes.byteLength;
   return {[TAG]:'array',type,offset,length:value.length};
  }
  if(typeof value==='number'&&(!Number.isFinite(value)||Object.is(value,-0)))
   return {[TAG]:'number',value:Object.is(value,-0)?'-0':String(value)};
  return value;
 });
 const header=encoder.encode(json),payloadStart=align8(PREFIX+header.length);
 const bytes=new Uint8Array(payloadStart+payloadBytes),view=new DataView(bytes.buffer);
 bytes.set(encoder.encode(MAGIC),0);view.setUint32(8,header.length,true);view.setUint32(12,CACHE_CODEC_VERSION,true);
 bytes.set(header,PREFIX);
 for(const chunk of chunks)bytes.set(chunk.bytes,payloadStart+chunk.offset);
 return bytes;
}

export function decodeField(input){
 if(!littleEndian)throw new Error('This frame format requires little-endian typed arrays.');
 let bytes=input instanceof ArrayBuffer?new Uint8Array(input):input;
 if(!(bytes instanceof Uint8Array))throw new TypeError('Frame input must be an ArrayBuffer or Uint8Array.');
 // Views into a transport buffer may not start at an aligned byte offset.
 if(bytes.byteOffset%8)bytes=bytes.slice();
 if(bytes.byteLength<PREFIX||decoder.decode(bytes.subarray(0,8))!==MAGIC)throw new Error('Invalid field-frame signature.');
 const view=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);
 const headerLength=view.getUint32(8,true),version=view.getUint32(12,true),payloadStart=align8(PREFIX+headerLength);
 if(version!==CACHE_CODEC_VERSION||headerLength>bytes.byteLength-PREFIX||payloadStart>bytes.byteLength)
  throw new Error('Invalid or unsupported field-frame header.');
 const record=JSON.parse(decoder.decode(bytes.subarray(PREFIX,PREFIX+headerLength)),(key,value)=>{
  if(!value||typeof value!=='object'||!value[TAG])return value;
  if(value[TAG]==='number'){
   const special={'NaN':NaN,'Infinity':Infinity,'-Infinity':-Infinity,'-0':-0};
   if(!Object.hasOwn(special,value.value))throw new Error('Invalid special number in frame.');
   return special[value.value];
  }
  if(value[TAG]==='array'){
   const Type=constructors[value.type],offset=value.offset,length=value.length;
   if(!Type||!Number.isSafeInteger(offset)||!Number.isSafeInteger(length)||offset<0||length<0||offset%Type.BYTES_PER_ELEMENT)
    throw new Error('Invalid array descriptor in frame.');
   const size=length*Type.BYTES_PER_ELEMENT,start=payloadStart+offset;
   if(!Number.isSafeInteger(size)||start>bytes.byteLength||size>bytes.byteLength-start)
    throw new Error('Truncated typed array in frame.');
   return new Type(bytes.buffer,bytes.byteOffset+start,length);
  }
  throw new Error('Unknown field-frame metadata tag.');
 });
 if(record.version!==CACHE_CODEC_VERSION||!record.data)throw new Error('Invalid field-frame record.');
 return record.data;
}
