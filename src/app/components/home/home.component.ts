import { ProductsService } from '../../core/services/products.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { IProduct } from '../../core/interfaces/iproduct';
import { Subscription } from 'rxjs';
import { CategoriesService } from '../../core/services/categories.service';
import { ICat } from '../../core/interfaces/icat';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, NgClass, UpperCasePipe } from '@angular/common';
import { TermTextPipe } from '../../core/pipes/term-text.pipe';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { WishlistService } from '../../core/services/wishlist.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CarouselModule , RouterLink , UpperCasePipe , CurrencyPipe, TranslateModule , TermTextPipe , SearchPipe , FormsModule , NgClass ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit , OnDestroy{

  private readonly _ProductsService = inject(ProductsService);
  private readonly _CategoriesService = inject(CategoriesService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService)
  private readonly _NgxSpinnerService = inject(NgxSpinnerService)
  private readonly _WishlistService = inject(WishlistService)



  customOptionsMain: OwlOptions = {
    loop: true,
    autoplay: true,
    autoplayTimeout:3000,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
   items:1,
   rtl:true
    
  }



  customOptionscat: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: false,
    navSpeed: 700,
    autoplay:true,
    autoplayTimeout: 2000 ,
    autoplayHoverPause: true,
    navText: ['<i class="fa-solid fa-angles-left"></i>', '<i class="fa-solid fa-angles-right"></i>'],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      },
      940: {
        items: 4
      }
    },
    nav: true,
    rtl:true
  }

 productsList:IProduct[] = []
 catList:ICat[] = []
 text:string = ''
 homeProductsSub!:Subscription
 catSub!:Subscription
 addProductSub!:Subscription
 isFavorited:Boolean = false
 wishListData: string[] = [];
 
  ngOnInit(): void {

    this._WishlistService.getLoggedUserWishlist().subscribe({
      next: (response) => {
        const newData = response.data.map((item: any) => item._id)//returns array but diff format
        this.wishListData = newData;
        console.log(response, 'd');
      }
    });

    this._NgxSpinnerService.show();
    this.homeProductsSub = this._ProductsService.getAllProducts().subscribe({
        next:(res)=>{
         
         
        this.productsList = res.data
        this._NgxSpinnerService.hide()
        },
       
      })
    
   this.catSub = this._CategoriesService.getAllCat().subscribe({
      next:(res)=>{
     
        this.catList = res.data
        
      },
     
    })
    }

      addCart(id:string){
       this.addProductSub = this._CartService.addProductToCart(id).subscribe({
          next: (res)=>{
              console.log(res);
              this._ToastrService.success(res.message , 'FreshCart' , {progressBar:true});
               this._CartService.cartNum.next(res.numOfCartItems)
               console.log(this._CartService.cartNum);
               

          },
         
        })
      }
      
      
      
      addFav(prodId: string): void {
        this._WishlistService.addProductToWishlist(prodId).subscribe({
          next: (response) => {
         
            this._ToastrService.success(response.message , 'FreshCart' , {progressBar:true});
            this.wishListData = response.data;
            this._WishlistService.wishListNumber.next(response.data.length)
          }
        })
      }

      removeFav(prodId: string ): void {
        this._WishlistService.removeItemFromWishlist(prodId).subscribe({
          next: (response) => {
            this._ToastrService.success(response.message);
            this.wishListData = response.data;
            this._WishlistService.wishListNumber.next(response.data.length)
          }
        })
      }

      ngOnDestroy(): void {
        this.homeProductsSub?.unsubscribe()
        this.catSub?.unsubscribe()
        this.addProductSub?.unsubscribe()

    }

    
}
