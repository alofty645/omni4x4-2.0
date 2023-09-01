import { Product, columns } from "./table/columns";
import { DataTable } from "./table/data-table";
import supabase from "@/supabase/createclient";

async function getData(): Promise<Product[]> {
  try {
    let { data: products, error } = await supabase.from("product").select("*");

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
      <h1 className="text-center">Omni4x4</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
