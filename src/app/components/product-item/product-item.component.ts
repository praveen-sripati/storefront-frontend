import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductListService } from 'src/app/services/product-list.service';
import { Product } from '../shared.model';

@Component({
  selector: 'sf-product-item',
  templateUrl: './product-item.component.html',
})
export class ProductItemComponent implements OnInit {
  // @ts-ignore
  @Input() product: Product = {};

  productItemForm: FormGroup = this.fb.group({
    quantity: [],
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private productListService: ProductListService
  ) {}

  ngOnInit(): void {
    this.productItemForm.get('quantity')?.setValue(this.product.quantity);
  }

  openProductDetails(product: Product) {
    this.productListService.setQuantity(
      product.id,
      this.productItemForm.get('quantity')?.value
    );
    this.router.navigate([`product-details/${product.id}`]);
  }

  addToCart(productId: number) {
    this.productListService.addToCart(productId);
  }

  quantityChange(productId: number, event: any) {
    const quantity = event.value;
    this.productListService.setQuantity(productId, quantity).subscribe();
    this.productListService.setQuantityCart(productId, quantity).subscribe();
  }
}
