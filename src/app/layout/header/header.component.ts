import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListService } from 'src/app/services/product-list.service';

@Component({
  selector: 'sf-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  numOfCartProducts: number = 0;

  constructor(
    private productListService: ProductListService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.productListService.getCartList().subscribe((cartList) => {
      this.numOfCartProducts = cartList ? cartList.length : 0;
    });
    this.productListService.cartListLength$.subscribe((value) => {
      this.numOfCartProducts = value;
    });
    this.productListService.isProductOrderedSubject$.subscribe((isOrdered) => {
      if (isOrdered) this.numOfCartProducts = 0;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
