import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ProductListService } from 'src/app/services/product-list.service';
import { Product } from '../shared.model';

@Component({
  selector: 'sf-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  quantityForm: FormGroup = this.fb.group({
    quantities: this.fb.array([]),
  });

  cartList: Product[] = [];

  constructor(
    private productListService: ProductListService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cartList = this.productListService.getCartList();
    for (let cartItem of this.cartList) {
      this.quantities.push(
        this.fb.group({
          quantity: [cartItem.quantity],
        })
      );
    }
  }

  get quantities(): FormArray {
    return this.quantityForm.get('quantities') as FormArray;
  }

  quantityChange(productId: number, event: any) {
    const quantity = event.value;
    this.productListService.setQuantity(productId, quantity);
  }
}
