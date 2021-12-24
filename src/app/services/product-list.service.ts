import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable } from 'rxjs';
import * as data from 'src/assets/data.json';
import { Product } from '../components/shared.model';

@Injectable({
  providedIn: 'root',
})
export class ProductListService {
  private cartListSubject$ = new BehaviorSubject<Product[]>([]);
  private totalPriceSubject$ = new BehaviorSubject<number>(0);
  private isProductOrderedSubject$ = new BehaviorSubject<boolean>(false);

  // snackbar settings
  durationInSeconds = 3;

  productList: Product[] = [];
  cartList: Product[] = [];

  constructor(private snackBar: MatSnackBar) {
    // @ts-ignore
    this.productList = data.default;
  }

  getProducts(): Product[] {
    return this.productList;
  }

  getCartList(): Observable<Product[]> {
    return this.cartListSubject$.asObservable();
  }

  getTotalPrice(): number {
    let totalPrice = 0;
    this.cartList.forEach(
      (product) =>
        (totalPrice +=
          product.price * (product.quantity ? product.quantity : 0))
    );
    return parseFloat(totalPrice.toFixed(2));
  }

  getTotalPriceSubject(): Observable<number> {
    return this.totalPriceSubject$.asObservable();
  }

  getIsProductOrderedSubject(): BehaviorSubject<boolean> {
    return this.isProductOrderedSubject$;
  }

  getIsProductOrderedStatus(): Observable<boolean> {
    return this.isProductOrderedSubject$.asObservable();
  }

  addToCart(productId: number): void {
    const cartProduct = this.cartList.filter(
      (product) => product.id === productId
    )[0];
    if (!cartProduct) {
      this.cartList.push(
        this.productList.filter((product) => product.id === productId)[0]
      );
      this.snackBar.open('Product added in cart.', '', {
        duration: this.durationInSeconds * 500,
      });
      this.cartListSubject$.next(this.cartList);
      this.totalPriceSubject$.next(this.getTotalPrice());
    } else {
      this.snackBar.open('Product already added in cart!', 'close', {
        duration: this.durationInSeconds * 1000,
      });
    }
  }

  removeFromCart(productId: number): void {
    if (this.cartList.length > 0) {
      let deletedProduct!: Product;
      this.cartList = this.cartList.filter((product) => {
        if (product.id === productId) {
          deletedProduct = product;
        }
        return product.id !== productId
      });
      this.cartListSubject$.next(this.cartList);
      this.totalPriceSubject$.next(this.getTotalPrice());
      this.snackBar.open(`Product ${deletedProduct?.name} has been removed from the cart!`, 'close', {
        duration: this.durationInSeconds * 1000,
      });
    } else {
      this.snackBar.open(`Cart is empty!`, '', {
        duration: this.durationInSeconds * 500,
      });
    }
  }

  emptyCart(): void {
    this.cartList = [];
    this.cartListSubject$.next(this.cartList);
  }

  setQuantity(id: number, quantity: number): void {
    this.productList.filter((product) => product.id === id)[0].quantity =
      quantity;
    this.totalPriceSubject$.next(this.getTotalPrice());
  }
}
