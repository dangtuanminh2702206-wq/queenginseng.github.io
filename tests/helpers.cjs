const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),ts=require('typescript');
const root=path.resolve(__dirname,'..');
function loadTs(entry,globals={}){
 const cache=new Map();
 const context=vm.createContext({console,URL,Response,Request,TextEncoder,TextDecoder,Uint8Array,AbortSignal,Event,crypto:globalThis.crypto,process:{env:{}},setTimeout,clearTimeout,...globals});
 function load(file){
  file=path.resolve(root,file);if(!path.extname(file))file+='.ts';
  if(cache.has(file))return cache.get(file).exports;
  const module={exports:{}};cache.set(file,module);
  const compiled=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
  const fn=vm.runInContext('(function(require,module,exports){'+compiled+'\n})',context,{filename:file});
  fn(id=>load(id.startsWith('@/')?id.slice(2):path.resolve(path.dirname(file),id)),module,module.exports);
  return module.exports;
 }
 return load(entry);
}
function storage(){const map=new Map();return {map,getItem:k=>map.get(k)||null,setItem:(k,v)=>map.set(k,String(v)),removeItem:k=>map.delete(k)};}
const input=()=>({productId:'g8',idempotencyKey:crypto.randomUUID(),customerName:'Khách kiểm thử',phone:'0900000001',email:'',province:'Hà Nội',ward:'Xuân Mai',address:'Địa chỉ kiểm thử',note:'',paymentMethod:'COD',quantity:1,website:''});
function sheetHarness({publicAccess=false,reverse=false,locked=false}={}){
 let fault=null;const tables={},props={SPREADSHEET_ID:'test-only',INTERNAL_KEY:'test-key',ORDERS_ENABLED:'true'};
 const rawWrites=[];
 function failure(name,stage){if(fault&&fault.name===name&&fault.stage===stage){fault=null;throw Error('SIMULATED_FAILURE');}}
 function makeSheet(name,headers){const rows=[headers];return {rows,getLastRow:()=>rows.length,getLastColumn:()=>headers.length,getRange(r,c,n=1,m=1){return {
  getValues:()=>Array.from({length:n},(_,i)=>Array.from({length:m},(_,j)=>rows[r-1+i]?.[c-1+j]??'')),
  setValues(values){failure(name,'before');rawWrites.push({name,values});values.forEach((row,i)=>{rows[r-1+i]??=Array(headers.length).fill('');row.forEach((v,j)=>rows[r-1+i][c-1+j]=typeof v==='string'&&v.startsWith("'")?v.slice(1):v);});failure(name,'after');},
  setValue(v){this.setValues([[v]]);}
 };}};}
 const context=vm.createContext({console:{error(){}},LockService:{getScriptLock:()=>({tryLock:()=>!locked,releaseLock(){}})},PropertiesService:{getScriptProperties:()=>({getProperty:k=>props[k]??null,setProperty:(k,v)=>{props[k]=v;},getProperties:()=>({...props}),deleteProperty:k=>delete props[k]})},DriveApp:{Access:{PRIVATE:'PRIVATE'},getFileById:()=>({getSharingAccess:()=>publicAccess?'ANYONE':'PRIVATE'})},SpreadsheetApp:{openById:()=>({getSheetByName:n=>tables[n]}),flush(){}},Utilities:{getUuid:()=>crypto.randomUUID(),formatDate:()=> '260927'},ContentService:{MimeType:{JSON:'json'},createTextOutput:s=>({setMimeType:()=>JSON.parse(s)})}});
 vm.runInContext(fs.readFileSync(path.join(root,'backend/apps-script/Code.gs'),'utf8'),context);
 const schemas=vm.runInContext('SCHEMA_',context);
 for(const [name,headers] of Object.entries(schemas))tables[name]=makeSheet(name,reverse?[...headers].reverse():[...headers]);
 const product={product_id:'g8',slug:'bot-tra-sam-nu-hoang-g8',legal_name:'BỘT TRÀ SÂM NỮ HOÀNG G8',display_name:'Sâm Nữ Hoàng G8 – Trà Sâm Hòa Tan',price_vnd:480000,currency:'VND',units_per_box:30,unit_weight_g:15,net_weight_g:450,is_public:true};
 tables.Products.rows.push(tables.Products.rows[0].map(k=>product[k]??''));
 return {tables,props,rawWrites,context,fail:(name,stage)=>{fault={name,stage};},call:p=>context.createOrder_(p,'a'.repeat(64)),post:(payload,key='test-key')=>context.doPost({postData:{contents:JSON.stringify({action:'createOrder',internalKey:key,visitorKey:'a'.repeat(64),payload})}})};
}
module.exports={loadTs,storage,input,sheetHarness};
