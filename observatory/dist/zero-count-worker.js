import { completeZeroCount } from './zero-count.js';

self.onmessage=event=>{
 const {id,T}=event.data;
 try{self.postMessage({id,result:completeZeroCount(T)});}
 catch(error){self.postMessage({id,error:error.message});}
};
