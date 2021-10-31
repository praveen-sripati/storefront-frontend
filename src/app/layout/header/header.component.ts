import { Component, OnInit } from '@angular/core';
import { ProductListService } from 'src/app/services/product-list.service';

@Component({
  selector: 'sf-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit {
  numOfCartProducts: number = 0;

  constructor(private productList: ProductListService) { }

  ngOnInit(): void {
    this.numOfCartProducts = this.productList.cartList.length;
  }

}
