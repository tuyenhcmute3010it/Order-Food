import dishesApiRequest from "@/apiRequests/dish";
import { getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import DishDetail from "./dish-detail";

export default async function DishPage({
  params,
}: {
  params: Promise<{ slug: string }>; // Chỉnh kiểu của params thành Promise
}) {
  const { slug } = await params; // Dùng await để lấy giá trị thực của params
  const id = getIdFromSlugUrl(slug);
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;

  return <DishDetail dish={dish} />;
}
