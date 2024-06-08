import { Category, FetchProductsResponse } from "../types";

export const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch("https://dummyjson.com/products/categories");
  return response.json();
};

export const fetchProductsByCategory = async (
  category: string,
): Promise<FetchProductsResponse> => {
  const response = await fetch(
    `https://dummyjson.com/products/category/${category}`,
  );
  return response.json();
};
