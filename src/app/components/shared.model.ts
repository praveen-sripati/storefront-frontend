export const baseUrl: string = "http://localhost:3000";

export interface Product {
  id: number;
  name: string;
  price: number;
  url: string;
  description: string;
  quantity?: number;
}

export interface checkOutFormData {
  first_name: string;
  last_name: string;
  address: string;
  credit_card_num: string;
}
