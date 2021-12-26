import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ProductListService } from 'src/app/services/product-list.service';
import { Product } from '../shared.model';

@Component({
  selector: 'sf-product-item',
  templateUrl: './product-item.component.html',
})
export class ProductItemComponent implements OnInit {
  // @ts-ignore
  @Input() product: Product = {};
  @Output() productClicked = new EventEmitter();
  productItemForm: FormGroup = this.fb.group({
    quantity: [],
  });

  constructor(
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
    this.productClicked.emit(product.id);
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
