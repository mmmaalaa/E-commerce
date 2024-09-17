import { ProductsService } from './../../core/services/products.service';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { IProduct } from '../../core/interfaces/iproduct';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CurrencyPipe } from '@angular/common';


@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CarouselModule , CurrencyPipe],
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent implements OnInit , OnDestroy {
    private readonly _ActivatedRoute = inject(ActivatedRoute)
    private readonly _ProductsService = inject(ProductsService)

    activateSub!:Subscription
    productsSub!:Subscription

    detailsProduct:IProduct| null = null 

    // customOptionsDet: OwlOptions = {
    //   loop: true,
    //   autoplay: true,
    //   autoplayTimeout:3000,
    //   mouseDrag: true,
    //   touchDrag: true,
    //   pullDrag: false,
    //   dots: true,
    //   navSpeed: 700,
    //  items:1,
      
    // }

    ngOnInit(): void {
      this.activateSub = this._ActivatedRoute.paramMap.subscribe({
          next:(p)=>{
           let productId = p.get('id');

           this.productsSub = this._ProductsService.getSpecficProducts(productId).subscribe({
            next:(res)=>{
              this.detailsProduct=res.data
              console.log(res.data);
              
            },
            error:(err)=>{
              console.log(err);
              
            }
           })
          }
        })
    }

    ngOnDestroy(): void {
        this.activateSub.unsubscribe()
        this.productsSub.unsubscribe()
    }
}
