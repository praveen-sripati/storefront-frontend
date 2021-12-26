# MyStore

MyStore is Angular application that allows users to view a list of available products to purchase, add them to a shopping cart, and ultimately complete the checkout process.

## Technologies

- Angular Framework
- Json Server

## Components, Services and Routes used in this project

- product-list component used to display list of products - Route `/`
- product-item component used to display individual product.
- product-item-detail component used to display individual product with brief content in a different route - Route `/product-detail/:productId`
- cart component used to display products that are added in cart - Route `/cart`
- product-list service used to manage data between all these components.

## Installation

To get started developing right away:

- install all project dependencies with `npm install`.
- start the development front-end server with `npm start` or `ng serve`.
- start the development json-server for demo REST JSON services using command `npm run server`.
- for production build use `npm run build`.

## References

- Angular.io
- [Angular material](https://material.angular.io/)
- [W3Schools](https://www.w3schools.com/)
- [CSS Tricks](https://css-tricks.com/)
- [LottieFiles](https://lottiefiles.com/) for animations.
- For **Light/Dark Theme** implementation I've used [angular.io](https://github.com/angular/angular) **git repo** as a reference.
- And many more..

## License

[Udacity](LICENSE.md)
