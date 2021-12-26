import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { Product, baseUrl } from '../components/shared.model';

@Injectable({
  providedIn: 'root',
})
export class ProductListService implements OnDestroy {
  sub!: Subscription;

  private totalPriceSubject$ = new BehaviorSubject<number>(0);
  private isProductOrderedSubject$ = new BehaviorSubject<boolean>(false);
  totalPrice: number = 0;
  cartList: Product[] = [];

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

  getTotalPriceSubject(): Observable<number> {
    return this.totalPriceSubject$.asObservable();
  }

  getTotalPrice(): number {
    let totalPrice: number = 0;
    // console.log(this.getCartList().length)
    // this.getCartList().map((productObs) => {
    //   productObs.subscribe((product) => {
    //     totalPrice +=
    //       product.price * (product.quantity ? product.quantity : 0)
    //     console.log(totalPrice, "totalPrice")
    //   });
    // });
    return parseFloat(totalPrice.toFixed(2));
  }

  getIsProductOrderedSubject(): BehaviorSubject<boolean> {
    return this.isProductOrderedSubject$;
  }

  getIsProductOrderedStatus(): Observable<boolean> {
    return this.isProductOrderedSubject$.asObservable();
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
          this.addToCartObs(product).subscribe();
          this.snackBar.open('Product added in cart.', '', {
            duration: this.durationInSeconds * 500,
          });
        });
        // this.totalPriceSubject$.next(this.getTotalPrice());
      } else {
        this.snackBar.open('Product already added in cart!', 'close', {
          duration: this.durationInSeconds * 1000,
        });
      }
    });
  }

  removeFromCart(productId: number): Observable<Product[]> {
    this.sub = this.removeFromCartObs(productId).subscribe(() => {
      this.getCartList().subscribe((cartList) => {
        if (cartList.length > 0) {
          this.snackBar.open(
            `Product ${productId} has been removed from the cart!`,
            'close',
            {
              duration: this.durationInSeconds * 1000,
            }
          );
        } else {
          this.snackBar.open(`Cart is empty!`, '', {
            duration: this.durationInSeconds * 500,
          });
        }
      });
    });
    return this.getCartList();
  }

  emptyCart(): void {
    this.sub = this.getCartList().subscribe((productList) => {
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
  }
}
