import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../shared.model';
import { ProductListService } from '../../services/product-list.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'sf-product-list',
  templateUrl: './product-list.component.html',
})
export class ProductListComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  productList: Product[] = [];

  constructor(private productListService: ProductListService, private router: Router) {}

  ngOnInit(): void {
    this.sub = this.productListService.getProducts().subscribe((data) => {
      this.productList = data;
    });
    // this.productListService.getIsProductOrderedSubject().next(false);
  }

  onProductClicked(id: number): void {
    this.router.navigate([`product-details/${id}`]);
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
