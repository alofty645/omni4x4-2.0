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

export type Product = {
  id: string;
  product_price: number;
  product_name: string;
  product_link: string;
  created_at: string;
  shipping_price: number;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "product_name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Product Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "product_price",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Current Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const shipping_price = parseFloat(row.getValue("shipping_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(shipping_price);

      return <div className="text-centre font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "shipping_price",
    header: () => <div className="text-centre">Shipping Price</div>,
    cell: ({ row }) => {
      const shipping_price = parseFloat(row.getValue("shipping_price"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(shipping_price);

      return <div className="text-centre font-medium">{formatted}</div>;
    },
  },

  {
    accessorKey: "",
    header: "Total Price",
    cell: ({ row }) => {
      const product_price = parseFloat(row.getValue("product_price"));
      const shipping_price = parseFloat(row.getValue("shipping_price"));

      const totalPrice = product_price + shipping_price;

      const formattedTotalPrice = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "AUD",
      }).format(totalPrice);

      return (
        <div className="text-centre font-medium">{formattedTotalPrice}</div>
      );
    },
  },

  {
    accessorKey: "",
    header: "Lowest Seen Total Price",
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const product = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(product.id)}
            >
              Copy product ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View product details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  // ...
];
