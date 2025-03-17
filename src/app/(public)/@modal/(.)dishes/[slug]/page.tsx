import dishesApiRequest from "@/apiRequests/dish";
import { formatCurrency, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "../../../dishes/[slug]/dish-detail";
import Modal from "@/app/(public)/@modal/(.)dishes/[slug]/modal";
export default async function DishPage({
  params: { slug },
}: {
  params: {
    slug: string;
  };
}) {
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;
  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
