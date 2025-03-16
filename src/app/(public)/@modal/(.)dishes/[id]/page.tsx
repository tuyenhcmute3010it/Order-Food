import dishesApiRequest from "@/apiRequests/dish";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import DishDetail from "../../../dishes/[id]/dish-detail";
import Modal from "@/app/(public)/@modal/(.)dishes/[id]/modal";
export default async function DishPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
