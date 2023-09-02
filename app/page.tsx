import { Product, columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import supabase from "@/supabase/createclient";
import { Navmenu } from "./nav/navigation";

async function getData(): Promise<Product[]> {
  try {
    let { data: products, error } = await supabase
      .from("product")
      .select("*, price(*)");

    if (error) {
      throw error;
    }

    if (products) {
      return products;
    }

    // Return an empty array if no products are found
    return [];
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle the error as needed
    throw error;
  }
}

(async () => {
  try {
    const products = await getData();
    console.log(products);
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();

export default async function DemoPage() {
  const data = await getData();

  return (
    <div className="container mx-auto py-10">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Omni4x4
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        4WD Supacentre have different sales everyday. This tool is to figure out
        if the current deals are good deals.
      </p>
      {/* <div className="flex justify-end">
        <Navmenu></Navmenu>
      </div> */}

      <DataTable columns={columns} data={data} />
    </div>
  );
}
