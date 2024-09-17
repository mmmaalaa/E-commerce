import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { authGuard } from './core/guards/auth.guard';
import { loggedGuard } from './core/guards/logged.guard';
import { NotFoundComponent } from './components/not-found/not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivate: [loggedGuard],
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent),
        title: 'Login',
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent),
        title: 'Register',
      },
      {
        path: 'forgotPass',
        loadComponent: () => import('./components/forgot-pass/forgot-pass.component').then(m => m.ForgotPassComponent),
      },
    ],
  },
  {
    path: '',
    component: BlankLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        loadComponent: () => import('./components/home/home.component').then(m => m.HomeComponent),
        title: 'Home',
      },
      {
        path: 'products',
        loadComponent: () => import('./components/products/products.component').then(m => m.ProductsComponent),
        title: 'Products',
      },
      {
        path: 'cart',
        loadComponent: () => import('./components/cart/cart.component').then(m => m.CartComponent),
        title: 'Cart',
      },
      {
        path: 'brands',
        loadComponent: () => import('./components/brands/brands.component').then(m => m.BrandsComponent),
        title: 'Brands',
      },
      {
        path: 'categories',
        loadComponent: () => import('./components/categories/categories.component').then(m => m.CategoriesComponent),
        title: 'Categories',
      },
      {
        path: 'wishlist',
        loadComponent: () => import('./components/wishlist/wishlist.component').then(m => m.WishlistComponent),
        title: 'WishList',
      },
      {
        path: 'details/:id',
        loadComponent: () => import('./components/details/details.component').then(m => m.DetailsComponent),
        title: 'Details',
      },
      {
        path: 'allorders',
        loadComponent: () => import('./components/all-orders/all-orders.component').then(m => m.AllOrdersComponent),
        title: 'All Orders',
      },
      {
        path: 'orders/:_id',
        loadComponent: () => import('./components/orders/orders.component').then(m => m.OrdersComponent),
        title: 'Orders',
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];
