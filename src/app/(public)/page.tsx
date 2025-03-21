import dishesApiRequest from "@/apiRequests/dish";
import {
  formatCurrency,
  generateSlugUrl,
  htmlToTextForDescription,
} from "@/lib/utils";
import { DishListResType } from "@/schemaValidations/dish.schema";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Metadata } from "next";
import envConfig from "@/config";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("HomePage");
  return {
    title: t("title"),
    description: htmlToTextForDescription(t("description")),
    alternates: {
      canonical: envConfig.NEXT_PUBLIC_URL,
    },
  };
}
export default async function Home() {
  const t = await getTranslations("HomePage");
  let dishList: DishListResType["data"] = [];
  try {
    const result = await dishesApiRequest.list();
    const {
      payload: { data },
    } = result;
    dishList = data;
  } catch (error) {
    console.log(error);
    return <div>Something went wrong</div>;
  }
  return (
    <div className="w-full space-y-4">
      <div className="relative z-10">
        <span className="absolute top-0 left-0 w-full h-full bg-black opacity-50 z-10"></span>
        <Image
          src="/banner.png"
          width={400}
          height={200}
          quality={100}
          alt="Banner"
          className="absolute top-0 left-0 w-full h-full object-cover"
        />
        <div className="z-20 relative py-10 md:py-20 px-4 sm:px-10 md:px-20">
          <h1 className="text-center text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold">
            {t("title")}
          </h1>
          <p className="text-center text-sm sm:text-base mt-4">
            Vị ngon, trọn khoảnh khắc
          </p>
        </div>
      </div>
      <section className="space-y-10 py-16">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishList.map((dish) => (
            <div className="flex gap-4 w" key={dish.id}>
              <div className="flex-shrink-0">
                <Link
                  href={`/dishes/${generateSlugUrl({
                    name: dish.name,
                    id: dish.id,
                  })}`}
                  className="flex items-center gap-2 text-lg font-semibold md:text-base"
                >
                  <Image
                    src={dish.image}
                    width={150}
                    height={150}
                    quality={100}
                    alt={dish.name}
                    className="object-cover w-[150px] h-[150px] rounded-md"
                  />
                </Link>
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="">{dish.description}</p>
                <p className="font-semibold">{formatCurrency(dish.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
