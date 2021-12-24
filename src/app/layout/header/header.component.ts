import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListService } from 'src/app/services/product-list.service';

@Component({
  selector: 'sf-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  cartSub: Subscription;
  isProductOrderedSub: Subscription;
  isProductOrdered: boolean = false;

  numOfCartProducts: number = 0;

  constructor(private productList: ProductListService, private router: Router) {
    this.cartSub = this.productList.getCartList().subscribe((cartList) => {
      this.numOfCartProducts = cartList ? cartList.length : 0;
    });
    this.isProductOrderedSub = this.productList
      .getIsProductOrderedStatus()
      .subscribe((isProductOrdered) => {
        if (isProductOrdered) {
          this.isProductOrdered = isProductOrdered;
        }
      });
  }

  ngOnInit(): void {}

  onProductList(): void {
    if (this.isProductOrdered) {
      this.productList.emptyCart();
    }
    this.router.navigate(['']);
  }

  ngOnDestroy() {
    this.cartSub.unsubscribe();
    this.isProductOrderedSub.unsubscribe();
  }
}
