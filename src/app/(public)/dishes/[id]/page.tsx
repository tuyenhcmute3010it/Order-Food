import dishesApiRequest from "@/apiRequests/dish";
import { formatCurrency, wrapServerApi } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default async function DishPage({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const data = await wrapServerApi(() => dishesApiRequest.getDish(Number(id)));
  const dish = data?.payload?.data;
  if (!dish)
    return (
      <div>
        <h1 className="text-2xl lg:text-3xl font-semibold">
          Món Ăn Không Tồn Tại
        </h1>
      </div>
    );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl lg:text-3xl font-semibold">{dish.name}</h1>
      <div className="font-semibold">Gia : {formatCurrency(dish.price)}</div>
      <Image
        src={dish.image}
        alt={dish.name}
        height={700}
        width={700}
        quality={100}
        className="object-cover w-full h-[1080px] rounded-md"
      />
      <p>{dish.description}</p>
    </div>
  );
}
