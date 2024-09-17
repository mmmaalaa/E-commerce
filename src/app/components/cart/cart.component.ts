import { Icart } from './../../core/interfaces/icart';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { Subscription } from 'rxjs';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CurrencyPipe } from '@angular/common';
import Swal from 'sweetalert2';
import { Router, RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe , SweetAlert2Module , RouterLink , TranslateModule  ],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.scss'
})
export class CartComponent implements OnInit , OnDestroy{

  private readonly _CartService = inject(CartService)
  private readonly _Router= inject(Router)
  private readonly _ToastrService = inject(ToastrService)

  removeItemsub!:Subscription
  updateNumsub!:Subscription
  getProductSub!:Subscription
  title = 'sweetalert-demo';
  cartProducts: Icart = {} as Icart
  

 ngOnInit(): void {
  this.getProductSub = this._CartService.getProductCart().subscribe({
    next:(res)=>{
      console.log(res.data);
      this.cartProducts = res.data
    },
    error:(err)=>{
      console.log(err);
    }
  })
 }

 removeItem(id:string):void{
   this.removeItemsub =  this._CartService.removeSpecificCartItem(id).subscribe({
      next:(res)=>{
          console.log(res);
          this.cartProducts = res.data
          this._ToastrService.error('item is removed' , 'FreshCart' , {progressBar:true})
          this._CartService.cartNum.next(res.numOfCartItems)
      },
      error:(err)=>{
        console.log(err);
      }
    })
 }

 updateCount(id:string , newNumber:number):void{
     if(newNumber > 0){
      this.updateNumsub=  this._CartService.updateCartProductQuantity( id , newNumber).subscribe({
        next:(res)=>{
          console.log(res);
          this.cartProducts = res.data
        },
        error:(err)=>{
          console.log(err);
        }
      })
     }
 }

 clearCart():void{

  Swal.fire({
    title: "Are you sure?",
    text: "You want to clear cart!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#0AAD0A",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  }).then((result) => {
    if (result.isConfirmed) {
      this._CartService.clearUserCart().subscribe({
        next:(res)=>{
        
          if(res.message == 'success'){
            this.cartProducts = {} as Icart;}

            this._CartService.cartNum.next(res.numOfCartItems)
            },
            error:(err)=>{
              console.log(err);}
          });
     
      Swal.fire({
        title: "Deleted!",
        text: "Your cart has been deleted.",
        icon: "success"});

 
     
    }
    
  })
 }

 ngOnDestroy(): void {
     this.getProductSub?.unsubscribe();
     this.removeItemsub?.unsubscribe();
     this.updateNumsub?.unsubscribe();
     }

    
  }


