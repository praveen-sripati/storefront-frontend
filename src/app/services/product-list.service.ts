import { Injectable } from '@angular/core';
import * as data from 'src/assets/data.json';
import { Product } from '../components/shared.model';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {

  productList: Product[] = [];
  cartList: Product[] = [];

  constructor() {
    // @ts-ignore
    this.productList = data.default;
  }

  getProducts(): Product[] {
    return this.productList;
  }

  getCartList(): Product[] {
    return this.cartList;
  }

  addToCart(productId: number): void {
    const cartProduct = this.cartList.filter((product) => product.id === productId)[0]
    if (!cartProduct) {
      this.cartList.push(
        this.productList.filter((product) => product.id === productId)[0]
      );
    } else {
      alert('Product already added in cart!');
    }
  }

  setQuantity(id: number, quantity: number): void {
    this.productList.filter((product) => product.id === id)[0].quantity =
      quantity;
  }
}
