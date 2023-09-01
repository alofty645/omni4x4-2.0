// "use client";

// import supabase from "@/supabase/createclient";
// import { useState, useEffect } from "react";

// export default function Home() {
//   const [products, setProducts] = useState([]);

//   async function getProducts() {
//     let { data: product }: any = await supabase.from("product").select("*");
//     setProducts(product);
//     console.log(product);
//   }

//   useEffect(() => {
//     getProducts();
//   }, []);

//   return (
//     <div className="m-4  h-3/4 rounded-3xl">
//       <div className="m-10 text-center">
//         <h1 className="text-5xl m-3">Omni4x4</h1>
//         <div></div>
//       </div>
//     </div>
//   );
// }
