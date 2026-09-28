// Shared browser/Worker contract; Apps Script validates independently before writing.
export const MAX_QUANTITY = 99;
export const textLimits = { customerName:100, phone:24, province:100, ward:100, address:240, email:160, note:500 } as const;
export type OrderFields = {customerName:string;phone:string;province:string;ward:string;address:string;email?:string;note?:string;paymentMethod:'COD'|'BANK';quantity:number;website:string};
export type OrderRequest = OrderFields & {idempotencyKey:string};
export type FieldErrors = Partial<Record<keyof OrderFields,string>>;
export const cleanText=(value:string)=>value.replace(/[\r\n\t]+/g,' ').trim();
export function orderErrors(input:OrderFields):FieldErrors {
  const errors:FieldErrors={};
  for(const [key,max] of Object.entries(textLimits)){
    const field=key as keyof typeof textLimits,value=input[field];
    if(value!==undefined&&typeof value!=='string')errors[field]='Thông tin phải là văn bản.';
    else if((value?.length||0)>max)errors[field]=`Vui lòng nhập tối đa ${max} ký tự.`;
  }
  for(const field of ['customerName','phone','province','ward','address'] as const){
    if(typeof input[field]!=='string'||!cleanText(input[field]))errors[field]='Vui lòng điền thông tin này.';
  }
  if(typeof input.phone==='string'&&input.phone.trim()&&!/^(?:0\d{9}|\+84\d{9})$/.test(input.phone.replace(/[\s().-]/g,'')))errors.phone='Nhập số điện thoại Việt Nam gồm 10 số hoặc bắt đầu bằng +84.';
  if(input.email&&typeof input.email==='string'&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()))errors.email='Email chưa đúng định dạng.';
  if(!Number.isInteger(input.quantity)||input.quantity<1||input.quantity>MAX_QUANTITY)errors.quantity='Số lượng cần là số nguyên từ 1 đến 99 hộp.';
  if(!['COD','BANK'].includes(input.paymentMethod))errors.paymentMethod='Chọn phương thức thanh toán hợp lệ.';
  if(input.website!==''&&input.website!==undefined)errors.website='Yêu cầu không hợp lệ.';
  return errors;
}
export function normalizeFields(input:OrderFields):OrderFields {
  return {...input,customerName:cleanText(input.customerName),phone:input.phone.replace(/[\s().-]/g,'').replace(/^\+84/,'0'),province:cleanText(input.province),ward:cleanText(input.ward),address:cleanText(input.address),email:cleanText(input.email||''),note:cleanText(input.note||''),website:input.website||''};
}
export function validKey(value:unknown):value is string {return typeof value==='string'&&/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value);}
export type OrderReceipt={orderCode:string;orderStatus:'PENDING';subtotalVnd:number;shippingFeeVnd:null;totalVnd:null};
export function validReceipt(value:unknown,expectedSubtotal?:number):value is OrderReceipt {
  if(!value||typeof value!=='object')return false;
  const r=value as OrderReceipt;
  return typeof r.orderCode==='string'&&/^QGV-\d{6}-[0-9A-F]{12}$/.test(r.orderCode)&&r.orderStatus==='PENDING'&&Number.isSafeInteger(r.subtotalVnd)&&r.subtotalVnd>0&&(expectedSubtotal===undefined||r.subtotalVnd===expectedSubtotal)&&r.shippingFeeVnd===null&&r.totalVnd===null;
}
