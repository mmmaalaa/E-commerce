import { CurrencyPipe } from '@angular/common';
import { Component, inject, OnInit, RendererFactory2 } from '@angular/core';
import { WishlistService } from '../../core/services/wishlist.service';
import { Iwishlist } from '../../core/interfaces/iwishlist';
import { Subscription } from 'rxjs';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CurrencyPipe , TranslateModule],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.scss'
})
export class WishlistComponent implements OnInit {

  private readonly _WishlistService = inject(WishlistService)
  private readonly _CartService = inject(CartService)
  private readonly _ToastrService = inject(ToastrService)
  private readonly _Renderer2 = inject(RendererFactory2).createRenderer(null,null)



  favList:Iwishlist[] = [];
  addProductSub!:Subscription;
  removeItemsub!:Subscription;
  wishListData: string = "";


  ngOnInit(): void {
      this._WishlistService.getLoggedUserWishlist().subscribe({
        next:(res)=>{
          console.log(res);
          this.favList = res.data       
         }
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


   removeItem(id:string ):void{
    this.removeItemsub =  this._WishlistService.removeItemFromWishlist(id).subscribe({
       next:(res)=>{
           console.log(res);
           this.wishListData = res.data
           this._ToastrService.error('item is removed' , 'FreshCart' , {progressBar:true})
           this._WishlistService.wishListNumber.next(res.data.length);

           const newProdData = this.favList.filter((item: any) => this.wishListData.includes(item._id));
   
           this.favList = newProdData;
           
       },
       error:(err)=>{
         console.log(err);
       }
     })
  }
}
