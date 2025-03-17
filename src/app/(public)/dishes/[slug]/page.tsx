import dishesApiRequest from "@/apiRequests/dish";
import { formatCurrency, getIdFromSlugUrl, wrapServerApi } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import DishDetail from "./dish-detail";

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

  return <DishDetail dish={dish} />;
}
