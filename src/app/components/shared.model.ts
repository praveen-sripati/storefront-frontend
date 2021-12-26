export const baseUrl: string = "http://localhost:3000";

export interface Product {
  id: number;
  name: string;
  price: number;
  url: string;
  description: string;
  quantity?: number;
}
