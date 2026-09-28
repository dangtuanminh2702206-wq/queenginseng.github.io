"use client";
import Link from 'next/link';
import {FormEvent,useEffect,useRef,useState} from 'react';
import {useCart} from '@/components/cart-provider';
import {SiteHeader} from '@/components/site-header';
import {SiteFooter} from '@/components/site-footer';
import {Button} from '@/components/ui/button';
import {CommerceError,getCommerceConfig,requestKey,clearPendingRequest,submitOrder,type OrderReceipt} from '@/lib/commerce-api';
import {orderErrors,textLimits,type FieldErrors,type OrderFields} from '@/lib/order-validation';
import {g8Product,productPack,productWeight} from '@/lib/products';
import {formatVnd} from '@/lib/site';
const fields=[
 {name:'customerName',label:'Họ và tên',autoComplete:'name',required:true},
 {name:'phone',label:'Số điện thoại',autoComplete:'tel',required:true,type:'tel'},
 {name:'province',label:'Tỉnh/Thành phố',autoComplete:'address-level1',required:true},
 {name:'ward',label:'Phường/Xã',autoComplete:'address-level2',required:true},
 {name:'address',label:'Địa chỉ',autoComplete:'street-address',required:true},
 {name:'email',label:'Email (không bắt buộc)',autoComplete:'email',type:'email'},
 {name:'note',label:'Ghi chú (không bắt buộc)',autoComplete:'off'}
] as const;
export default function CheckoutPage(){
 const {quantity,setQuantity}=useCart();
 const [method,setMethod]=useState<'COD'|'BANK'>('COD'),[receipt,setReceipt]=useState<OrderReceipt|null>(null);
 const [error,setError]=useState(''),[errors,setErrors]=useState<FieldErrors>({});
 const [isSubmitting,setIsSubmitting]=useState(false),[availability,setAvailability]=useState<'loading'|'enabled'|'disabled'>('loading');
 const errorRef=useRef<HTMLDivElement>(null),successRef=useRef<HTMLHeadingElement>(null),submitting=useRef(false),quantityRef=useRef(quantity);
 quantityRef.current=quantity;
 useEffect(()=>{let active=true;getCommerceConfig().then(c=>{if(active)setAvailability(c.ordersEnabled?'enabled':'disabled');});return()=>{active=false;};},[]);
 useEffect(()=>{if(receipt)successRef.current?.focus();},[receipt]);
 function focusError(){requestAnimationFrame(()=>errorRef.current?.focus());}
 async function submit(event:FormEvent<HTMLFormElement>){
  event.preventDefault();if(submitting.current)return;
  setError('');setErrors({});
  if(availability!=='enabled'){setError('Bản trải nghiệm — chưa tiếp nhận đơn hàng thật. Vui lòng không chuyển tiền.');focusError();return;}
  const data=new FormData(event.currentTarget),values=Object.fromEntries(fields.map(f=>[f.name,String(data.get(f.name)||'')]));
  const input={...values,paymentMethod:method,quantity,website:String(data.get('website')||'')} as OrderFields;
  const invalid=orderErrors(input);
  if(Object.keys(invalid).length){setErrors(invalid);setError('Vui lòng kiểm tra thông tin bên dưới.');focusError();return;}
  submitting.current=true;setIsSubmitting(true);
  try{
   const idempotencyKey=await requestKey(input);
   const order=await submitOrder({...input,idempotencyKey});
   clearPendingRequest();setReceipt(order);
   // Preserve any additional items added in another tab during the request.
   setQuantity(Math.max(0,quantityRef.current-input.quantity));
  }catch(err){
   // Keep the same key after any failed retry: a previous timed-out attempt may
   // already have been saved even when this attempt is rate-limited/unavailable.
   setError(err instanceof CommerceError?err.message:'Chưa thể xác minh kết quả. Hãy thử lại cùng thông tin.');focusError();
  }finally{submitting.current=false;setIsSubmitting(false);}
 }
 return <main className="min-h-screen bg-background"><a href="#noi-dung" className="skip-link">Chuyển đến nội dung chính</a><SiteHeader/>
  <div id="noi-dung" className="container-wide py-8 sm:py-12">
   <div className="demo-notice mb-6" role="status">
    <strong>{availability==='enabled'?'Yêu cầu đặt hàng — chờ xác nhận':availability==='loading'?'Đang kiểm tra khả năng tiếp nhận đơn…':'Bản trải nghiệm — chưa tiếp nhận đơn hàng thật. Vui lòng không chuyển tiền.'}</strong>
    <p className="mt-1 text-sm">{availability==='enabled'?'Tồn kho, phí giao hàng và tổng thanh toán sẽ được xác nhận sau.':'Bạn có thể xem thông tin sản phẩm và giỏ hàng. Chức năng gửi đơn hiện chưa mở.'}</p>
   </div>
   {receipt?<section className="py-10 text-center"><h1 ref={successRef} tabIndex={-1} className="font-serif text-4xl">Đã tiếp nhận yêu cầu đặt hàng</h1><p className="mt-4">Mã đơn: <strong>{receipt.orderCode}</strong></p><p className="mt-2">Tạm tính tiền hàng: {formatVnd(receipt.subtotalVnd)}</p><p className="mt-4 text-muted-foreground">Queen Ginseng sẽ xác nhận tồn kho, phí giao hàng và hướng dẫn thanh toán sau.</p><Button asChild className="mt-6"><Link href={`/san-pham/${g8Product.slug}`}>Quay lại sản phẩm G8</Link></Button></section>
   :!quantity?<section className="py-12 text-center"><h1 className="font-serif text-4xl">Giỏ hàng đang trống</h1><p className="mt-4">Chọn sản phẩm để xem thông tin đặt hàng.</p><Button asChild className="mt-6 rounded-full"><Link href={`/san-pham/${g8Product.slug}`}>Xem sản phẩm G8</Link></Button></section>
   :<form onSubmit={submit} noValidate className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
    <div className="grid min-w-0 gap-6"><div><p className="eyebrow">Đặt hàng G8</p><h1 className="mt-3 font-serif text-4xl">Thông tin nhận hàng</h1></div>
     {error&&<div ref={errorRef} tabIndex={-1} role="alert" className="rounded-xl border border-destructive bg-white p-4 text-destructive"><p className="font-semibold">{error}</p>{Object.entries(errors).length>0&&<ul className="mt-2 list-inside list-disc">{Object.entries(errors).map(([field,message])=><li key={field}><a href={`#${field}`} onClick={e=>{e.preventDefault();document.getElementById(field)?.focus();}} className="underline">{fields.find(f=>f.name===field)?.label||'Đơn hàng'}: {message}</a></li>)}</ul>}</div>}
     <fieldset disabled={availability!=='enabled'||isSubmitting} className="rounded-2xl bg-white p-5 disabled:opacity-60 sm:p-8"><legend className="sr-only">Thông tin người nhận</legend><p className="mb-4 text-sm text-muted-foreground">Các trường có dấu * là bắt buộc.</p><div className="grid gap-4 sm:grid-cols-2">{fields.map(f=><label key={f.name} htmlFor={f.name} className={`form-label ${f.name==='address'?'sm:col-span-2':''}`}>{f.label}{'required' in f?' *':''}<input id={f.name} name={f.name} type={'type' in f?f.type:'text'} required={'required' in f} maxLength={textLimits[f.name]} autoComplete={f.autoComplete} className="form-input" aria-invalid={!!errors[f.name]} aria-describedby={errors[f.name]?`${f.name}-error`:undefined}/>{errors[f.name]&&<span id={`${f.name}-error`} className="text-sm font-normal text-destructive">{errors[f.name]}</span>}</label>)}</div></fieldset>
     <div hidden><label>Website<input name="website" tabIndex={-1} autoComplete="off"/></label></div>
     <fieldset disabled={availability!=='enabled'||isSubmitting} className="rounded-2xl bg-white p-5 disabled:opacity-60 sm:p-8"><legend className="px-2 font-serif text-2xl">Phương thức thanh toán</legend><div className="grid gap-3">{([{value:'COD',title:'COD — thanh toán khi nhận hàng'},{value:'BANK',title:'Chuyển khoản — chờ xác nhận đơn'}] as const).map(o=><label key={o.value} className={`flex min-h-14 items-center gap-3 rounded-xl border p-4 ${method===o.value?'border-primary bg-background':''}`}><input type="radio" name="payment" value={o.value} checked={method===o.value} onChange={()=>setMethod(o.value)} className="size-5 accent-primary"/><span>{o.title}</span></label>)}</div>{method==='BANK'&&<p className="demo-notice mt-4">Chưa chuyển tiền ở bước này. Hướng dẫn thanh toán chỉ được gửi sau khi xác nhận đơn, tồn kho và phí giao hàng.</p>}</fieldset>
    </div>
    <aside className="rounded-2xl bg-primary p-6 text-white lg:sticky lg:top-28"><h2 className="font-serif text-2xl">Sản phẩm đã chọn</h2><p className="mt-5">{g8Product.name} × {quantity}</p><p className="mt-2 text-sm text-white/80">{productPack(g8Product)} · {productWeight(g8Product)}</p><div className="mt-6 flex flex-wrap justify-between gap-2 border-t border-white/20 pt-5 font-semibold"><span>Tạm tính tiền hàng</span><span className="price">{formatVnd(quantity*g8Product.price)}</span></div><p className="mt-3 text-sm text-white/80">Phí giao hàng: Chưa xác nhận.</p><Button disabled={availability!=='enabled'||isSubmitting} className="mt-6 min-h-12 w-full rounded-full bg-accent text-accent-foreground hover:bg-[#D5B765]">{isSubmitting?'Đang gửi yêu cầu…':availability==='enabled'?'Gửi yêu cầu đặt hàng':'Chưa mở nhận đơn'}</Button><Link href="/gio-hang" className="mt-4 flex min-h-11 items-center justify-center text-sm text-white underline">Chỉnh sửa giỏ hàng</Link></aside>
   </form>}
  </div><SiteFooter/></main>;
}
