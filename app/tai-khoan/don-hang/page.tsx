import { privateMetadata } from "@/lib/private-metadata";
export const metadata = privateMetadata("Đơn hàng thử nghiệm");
import { OrdersView } from "@/components/account-views"; export default function Page(){return <OrdersView/>}
