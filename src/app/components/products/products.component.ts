import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ProductsService } from '../../core/services/products.service';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { TermTextPipe } from '../../core/pipes/term-text.pipe';
import { CurrencyPipe, UpperCasePipe } from '@angular/common';
import { SearchPipe } from '../../core/pipes/search.pipe';
import { Search2Pipe } from '../../core/pipes/search2.pipe';
import { FormsModule, NgModel } from '@angular/forms';
import { CartService } from '../../core/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [TermTextPipe , UpperCasePipe  , CurrencyPipe , Search2Pipe , FormsModule],
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit , OnDestroy{

  private readonly _ProductsService=inject(ProductsService);
  private readonly _CartService = inject(CartService);
  private readonly _ToastrService = inject(ToastrService)

  productSub!:Subscription;
  productList: IProduct[] = []
  textterm:string = ''

  ngOnInit(): void {
   this.productSub = this._ProductsService.getAllProducts().subscribe({
    next:(res)=>{
      console.log(res.data);
      this.productList = res.data
      
    },error:(err)=>{
      console.log(err);
    }
   })
    
  }

  addCart(id:string):void{
      this._CartService.addProductToCart(id).subscribe({
        next:(res)=>{
          console.log(res);

          this._ToastrService.success(res.message , 'FreshCart' , {progressBar:true})
        },
        error:(err)=>{
          console.log(err);
        }
      })
  }

  ngOnDestroy(): void {
      this.productSub?.unsubscribe()
  }

}
