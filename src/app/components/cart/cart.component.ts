import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListService } from 'src/app/services/product-list.service';
import { Product } from '../shared.model';

@Component({
  selector: 'sf-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  cartSub: Subscription;
  totalPriceSub: Subscription;
  cartList: Product[] = [];
  totalPrice: number = 0;
  isProductOrdered: boolean = false;

  quantityForm: FormGroup = this.fb.group({
    quantities: this.fb.array([]),
  });
  checkOutForm: FormGroup = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    address: ['', Validators.required],
    creditCardNum: [, [Validators.required, Validators.pattern(/^[\d\s]*$/)]],
  });

  constructor(
    private productListService: ProductListService,
    private fb: FormBuilder,
    private router: Router
  ) {
    this.cartSub = this.productListService
      .getCartList()
      .subscribe((cartList) => {
        if (cartList) {
          this.cartList = cartList;
        } else {
          this.cartList = [];
        }
      });

    this.totalPriceSub = this.productListService
      .getTotalPriceSubject()
      .subscribe((totalPrice) => {
        if (totalPrice) {
          this.totalPrice = totalPrice;
        } else {
          this.totalPrice = 0;
        }
      });
  }

  ngOnInit(): void {
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

  creditCardTrimmedLength(creditCartNum: HTMLInputElement): number {
    return creditCartNum.value.replace(/\s+/g, '').length;
  }

  orderProduct(): void {
    this.productListService.emptyCart();
    this.router.navigate(['/']);
  }

  onCheckoutSubmit(): void {
    this.isProductOrdered = true;
    this.productListService
      .getIsProductOrderedSubject()
      .next(this.isProductOrdered);
  }

  removeFromCart(id: number): void {
    this.productListService.removeFromCart(id);
  }

  ngOnDestroy(): void {
    this.cartSub.unsubscribe();
    this.totalPriceSub.unsubscribe();
  }
}
