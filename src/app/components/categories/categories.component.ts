import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CategoriesService } from '../../core/services/categories.service';
import { Subscription } from 'rxjs';
import { Icart } from '../../core/interfaces/icart';
import { ICat } from '../../core/interfaces/icat';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [ TranslateModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit , OnDestroy {
      private readonly _CategoriesService = inject(CategoriesService)

    getAllCatSub!:Subscription;
    productsCat: ICat[] = [];
    sups:any[] = []

    
      ngOnInit():void{
       this.getAllCatSub = this._CategoriesService.getAllCat().subscribe({
          next:(res)=>{
            console.log(res.data);
            this.productsCat = res.data
          },
          error:(err)=>{
            console.log(err);
          }
        })
      }

      getCat(id:string):void{
        this._CategoriesService.getSubCat(id).subscribe({
          next:(res)=>{
            console.log(res.data);
            this.sups = res.data
            
          }
          
        })
      }

      ngOnDestroy(): void {
          this.getAllCatSub?.unsubscribe()
      }
}
