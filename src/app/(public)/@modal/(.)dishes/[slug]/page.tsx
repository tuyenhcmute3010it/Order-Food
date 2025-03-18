import dishesApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "../../../dishes/[slug]/dish-detail";
import Modal from "./modal"; // Giữ nguyên đường dẫn nếu đúng

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Chỉnh kiểu params thành Promise
}) {
  const { slug } = await params; // Sử dụng await
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;

  return (
    <Modal>
      <DishDetail dish={dish} />
    </Modal>
  );
}
