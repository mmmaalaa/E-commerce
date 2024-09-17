import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { BrandsService } from '../../core/services/brands.service';
import { Subscription } from 'rxjs';
import { Ibrands } from '../../core/interfaces/ibrands';
import Swal from 'sweetalert2';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [SweetAlert2Module],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent implements OnInit , OnDestroy {

  private readonly _BrandsService = inject(BrandsService);

  allBrandsSub!:Subscription;
  brandsList: Ibrands[] = []

  ngOnInit(): void {
     this.allBrandsSub = this._BrandsService.getAllBrands().subscribe({
        next:(res)=>{
          console.log(res.data);
          this.brandsList = res.data
        },
        error:(err)=>{
          console.log(err);
          
        }
      })
  }

  getOneBrand(id:string){
    this._BrandsService.getSpecificBrands(id).subscribe({
      next:(res)=>{
        Swal.fire({
          text: res.data.createdAt, //better than name for design
          imageUrl: res.data.image
        });
      },
      error:(err)=>{
        console.log(err);
      }
     
    })
  }

  ngOnDestroy(): void {
      this.allBrandsSub.unsubscribe()
  }

}
