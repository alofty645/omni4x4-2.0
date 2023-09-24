"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type PriceItem = {
  product_price: string;
  shipping_price: string;
  created_at: string;
};

export type Product = {
  id: string;
  product_name: string;
  product_link: string;
  created_at: string;
  price: PriceItem[]; // Specify the type for price array
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product_name",
    id: "Product Name",
    header: "Product Name",
    cell: ({ row }) => {
      const productLink = row.original.product_link;

      // Create a link to the product using the product_link data
      return (
        <a
          className="text-right w-2"
          href={productLink}
          target="_blank"
          rel="blank"
        >
          {row.original.product_name}
        </a>
      );
    },
  },
  {
    accessorKey: "product_price",
    id: " Current Product Price",
    header: "Current Product Price",
    cell: ({ row }) => {
      const priceArray = row.original.price; // Assuming price is an array of objects within the row data

      // Initialize with an empty string
      let latestProductPrice: any = "";

      priceArray.forEach((priceObj) => {
        const productPrice = parseFloat(priceObj.product_price);

        if (!isNaN(productPrice)) {
          latestProductPrice = productPrice;
        }
      });

      // Format the latest product price to AUD
      const formattedLatestProductPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(latestProductPrice);

      return <div className="text-left">{formattedLatestProductPrice}</div>;
    },
  },
  {
    accessorKey: "shipping_price",
    id: "Current Shipping Price",
    header: "Current Shipping Price",
    cell: ({ row }) => {
      const priceArray = row.original.price; // Assuming price is an array of objects within the row data

      // Initialize with an empty string
      let latestShippingPrice: any = "";

      priceArray.forEach((priceObj) => {
        const shippingPrice = parseFloat(priceObj.shipping_price);

        if (!isNaN(shippingPrice)) {
          latestShippingPrice = shippingPrice;
        }
      });

      // Format the latest shipping price to AUD
      const formattedLatestShippingPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(latestShippingPrice);

      return <div className="text-left">{formattedLatestShippingPrice}</div>;
    },
  },

  {
    accessorKey: "total_price", // Add a new accessor key
    header: "Current Total Price",
    id: "Current Total Price",
    cell: ({ row }) => {
      const priceArray = row.original.price; // Assuming price is an array of objects within the row data

      // Initialize with the latest values
      let latestProductPrice = 0;
      let latestShippingPrice = 0;

      priceArray.forEach((priceObj) => {
        const productPrice = parseFloat(priceObj.product_price);
        const shippingPrice = parseFloat(priceObj.shipping_price);

        if (!isNaN(productPrice)) {
          latestProductPrice = productPrice;
        }

        if (!isNaN(shippingPrice)) {
          latestShippingPrice = shippingPrice;
        }
      });

      const totalPrice = latestProductPrice + latestShippingPrice;

      // Format the total price to AUD
      const formattedTotalPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(totalPrice);

      return <div className="text-left">{formattedTotalPrice}</div>;
    },
  },

  {
    accessorKey: "lowest_seen_price",
    id: "Lowest Seen Price - Date",
    header: "Lowest Seen Price - Date",
    cell: ({ row }) => {
      const priceArray = row.original.price; // Assuming price is an array of objects within the row data

      // Find the object with the lowest total price
      let lowestTotalPrice = Infinity; // Initialize with a high value
      let lowestCreatedAt = ""; // Initialize with an empty string

      priceArray.forEach((priceObj) => {
        const productPrice = parseFloat(priceObj.product_price);
        const shippingPrice = parseFloat(priceObj.shipping_price);
        const totalPrice = productPrice + shippingPrice;

        if (!isNaN(totalPrice) && totalPrice < lowestTotalPrice) {
          lowestTotalPrice = totalPrice;
          lowestCreatedAt = priceObj.created_at;
        }
      });

      // Format the lowest price to AUD
      const formattedLowestPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(lowestTotalPrice);

      // Format the created_at date to display only the date part
      const formattedCreatedAt = new Date(lowestCreatedAt).toLocaleDateString(
        "en-AU"
      );

      return (
        <div className="text-left">
          {formattedLowestPrice} - {formattedCreatedAt}
        </div>
      );
    },
  },

  // {
  //   id: "actions",
  //   cell: ({ row }) => {
  //     const product = row.original;

  //     return (
  //       <DropdownMenu>
  //         <DropdownMenuTrigger asChild>
  //           <Button variant="ghost" className="h-8 w-8 p-0">
  //             <span className="sr-only">Open menu</span>
  //             <MoreHorizontal className="h-4 w-4" />
  //           </Button>
  //         </DropdownMenuTrigger>
  //         <DropdownMenuContent align="end">
  //           <DropdownMenuLabel>Actions</DropdownMenuLabel>
  //           <DropdownMenuItem
  //             onClick={() => navigator.clipboard.writeText(product.id)}
  //           >
  //             Copy product ID
  //           </DropdownMenuItem>
  //           <DropdownMenuSeparator />
  //           <DropdownMenuItem>View customer</DropdownMenuItem>
  //           <DropdownMenuItem>View product details</DropdownMenuItem>
  //         </DropdownMenuContent>
  //       </DropdownMenu>
  //     );
  //   },
  // },
  // ...
];
