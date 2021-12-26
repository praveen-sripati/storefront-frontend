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
  sub!: Subscription;
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
  ) {}

  ngOnInit(): void {
    this.sub = this.productListService.getCartList().subscribe((cartList) => {
      this.cartList = cartList;
      if (this.quantities.length <= 0) {
        for (let cartItem of this.cartList) {
          this.quantities.push(
            this.fb.group({
              quantity: [cartItem.quantity],
            })
          );
        }
      }
    });
  }

  get quantities(): FormArray {
    return this.quantityForm.get('quantities') as FormArray;
  }

  quantityChange(productId: number, event: any) {
    const quantity = event.value;
    this.productListService.setQuantity(productId, quantity).subscribe();
    this.productListService.setQuantityCart(productId, quantity).subscribe();
    this.totalPrice = this.productListService.getTotalPrice();
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
    this.sub = this.productListService
      .removeFromCart(id)
      .subscribe((cartList) => (this.cartList = cartList));
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
