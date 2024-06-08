export interface Category {
  slug: string;
  name: string;
  url: string;
}

export interface FetchProductsResponse {
  limit:number;
  products: Product[];
  skip: number;
  total: number;
}
export interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
}
