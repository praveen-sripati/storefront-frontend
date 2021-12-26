import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of, Subject, Subscription } from 'rxjs';
import { Product, baseUrl } from '../components/shared.model';

@Injectable({
  providedIn: 'root',
})
export class ProductListService implements OnDestroy {
  loader$ = new BehaviorSubject<boolean>(false);
  isProductOrderedSubject$ = new BehaviorSubject<boolean>(false);
  sub!: Subscription;
  sub2!: Subscription;
  sub3!: Subscription;

  cartListLength = 0;
  cartListLength$ = new BehaviorSubject<number>(0);

  // snackbar settings
  durationInSeconds = 3;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(baseUrl + '/products/' + +id);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(baseUrl + '/products');
  }

  getCartList(): Observable<Product[]> {
    return this.http.get<Product[]>(baseUrl + '/cart');
  }

  addToCartObs(product: Product): Observable<Product> {
    return this.http.post<Product>(baseUrl + '/cart', product);
  }

  removeFromCartObs(productId: number): Observable<Product> {
    return this.http.delete<Product>(baseUrl + '/cart/' + productId);
  }

  addToCart(productId: number): void {
    let cartProduct!: Product;
    this.sub = this.getCartList().subscribe((cartProducts) => {
      cartProduct = cartProducts.filter(
        (product) => product.id === productId
      )[0];
      if (!cartProduct) {
        this.sub = this.getProduct(productId).subscribe((data) => {
          const product: Product = data;
          this.sub = this.addToCartObs(product).subscribe();
          this.sub = this.getCartList().subscribe((cartList) => {
            this.cartListLength = cartList.length;
            this.cartListLength$.next(this.cartListLength);
          });
          this.snackBar.open('Product added in cart.', '', {
            duration: this.durationInSeconds * 500,
          });
        });
      } else {
        this.snackBar.open('Product already added in cart!', 'close', {
          duration: this.durationInSeconds * 1000,
        });
      }
    });
  }

  emptyCart(): void {
    this.sub3 = this.getCartList().subscribe((productList) => {
      productList.forEach((product) => {
        this.removeFromCartObs(product.id).subscribe();
      });
    });
  }

  setQuantity(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(baseUrl + '/products/' + +id, {
      quantity,
    });
  }

  setQuantityCart(id: number, quantity: number): Observable<Product> {
    return this.http.patch<Product>(baseUrl + '/cart/' + +id, {
      quantity,
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
    this.sub3.unsubscribe();
  }
}
