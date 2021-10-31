import { Component, OnInit } from '@angular/core';
import { Product } from '../shared.model';
import { ProductListService } from '../../services/product-list.service';

@Component({
  selector: 'sf-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit {
  productList: Product[] = []

  constructor(private productListService: ProductListService) { }

  ngOnInit(): void {
    this.productList = this.productListService.getProducts()
  }

}
