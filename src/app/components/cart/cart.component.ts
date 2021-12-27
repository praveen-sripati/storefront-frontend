import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductListService } from 'src/app/services/product-list.service';
import { checkOutFormData, Product } from '../shared.model';

@Component({
  selector: 'sf-cart',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit, OnDestroy {
  loader = false;
  sub!: Subscription;
  cartList: Product[] = [];
  totalPrice = 0;
  isProductOrdered = false;
  checkOutFormData!: checkOutFormData;
  userFirstName: string = '';
  userLastName: string = '';
  userAddress: string = '';
  creditCardNumber: number = 0;

  quantityForm: FormGroup = this.fb.group({
    quantities: this.fb.array([]),
  });

  constructor(
    private productListService: ProductListService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.sub = this.productListService.getCartList().subscribe((cartList) => {
      this.cartList = cartList;
      this.getTotalPrice(0, 0);
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

    this.productListService.loader$.subscribe(
      (loader) => (this.loader = loader)
    );
  }

  getTotalPrice(productId?: number, quantity?: number): void {
    this.totalPrice = 0;
    this.cartList.forEach((product) => {
      if (product.id === productId) {
        this.totalPrice += product.price * (quantity ? quantity : 0);
      } else {
        this.totalPrice +=
          product.price * (product.quantity ? product.quantity : 0);
      }
    });
  }

  get quantities(): FormArray {
    return this.quantityForm.get('quantities') as FormArray;
  }

  quantityChange(productId: number, event: any) {
    const quantity = event.value;
    this.sub = this.productListService
      .setQuantity(productId, quantity)
      .subscribe(() => {
        this.getTotalPrice(productId, quantity);
      });
    this.sub = this.productListService
      .setQuantityCart(productId, quantity)
      .subscribe(() => {
        this.getTotalPrice(productId, quantity);
      });
  }

  creditCardTrimmedLength(creditCartNum: HTMLInputElement): number {
    return creditCartNum.value.replace(/\s+/g, '').length;
  }

  orderProduct(): void {
    this.productListService.emptyCart();
    this.router.navigate(['/']);
  }

  onCheckoutSubmit(checkOutFormData: checkOutFormData): void {
    this.isProductOrdered = true;
    this.productListService.isProductOrderedSubject$.next(
      this.isProductOrdered
    );
    this.productListService.emptyCart();
    this.checkOutFormData = checkOutFormData;
  }

  removeFromCart(id: number): void {
    this.productListService.removeFromCartObs(id).subscribe(() => {
      this.sub = this.productListService.getCartList().subscribe((cartList) => {
        let cartListLength = 0;
        this.cartList = cartList;
        this.getTotalPrice(0, 0);
        cartListLength = cartList.length;
        this.productListService.cartListLength$.next(cartListLength);
      });
    });
  }

  valueChanged(inputName: string, event: any): void {
    switch (inputName) {
      case 'firstName':
        this.userFirstName = event;
        break;
      case 'lastName':
        this.userLastName = event;
        break;
      case 'address':
        this.userAddress = event;
        break;
      case 'creditCardNum':
        this.creditCardNumber = event;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
