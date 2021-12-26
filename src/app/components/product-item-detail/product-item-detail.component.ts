import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListService } from '../../services/product-list.service';
import { Product } from '../shared.model';

@Component({
  selector: 'sf-product-item-detail',
  templateUrl: './product-item-detail.component.html',
})
export class ProductItemDetailComponent implements OnInit, OnDestroy {
  sub!: Subscription;
  // @ts-ignore
  product: Product = {};
  productId: number = 0;

  productItemDetailForm: FormGroup = this.fb.group({
    quantity: [],
  });

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private productListService: ProductListService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.productId = parseInt(params.id);
    });
    this.sub = this.productListService
      .getProduct(this.productId)
      .subscribe((data) => {
        this.product = data;
        this.productItemDetailForm
          .get('quantity')
          ?.setValue(this.product.quantity);
      });
  }

  addToCart(productId: number) {
    this.productListService.addToCart(productId);
  }

  quantityChange(productId: number, event: any) {
    const quantity = event.value;
    this.productListService.setQuantity(productId, quantity).subscribe();
    this.productListService.setQuantityCart(productId, quantity).subscribe();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe()
  }
}
