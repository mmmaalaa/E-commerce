import { Component, ElementRef, HostListener, inject, OnInit, ViewChild, viewChild } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MyTranslateService } from '../../core/services/my-translate.service';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-nav-blank',
  standalone: true,
  imports: [RouterLinkActive , RouterLink , TranslateModule],
  templateUrl: './nav-blank.component.html',
  styleUrl: './nav-blank.component.scss'
})
export class NavBlankComponent implements OnInit {

  private readonly _AuthService = inject(AuthService)
  private readonly _MyTranslateService = inject(MyTranslateService)
  readonly _TranslateService = inject(TranslateService)
  private readonly _CartService = inject(CartService)


  @ViewChild('nav') el!:ElementRef

  @HostListener('window:scroll') navScroll():void{
    if(scrollY > 0){
      this.el.nativeElement.style.paddingInline = '20px';
      this.el.nativeElement.style.paddingBlock = '12px';
    }
    else{
       this.el.nativeElement.style.paddingInline = '10px'
       this.el.nativeElement.style.paddingBlock = '10px';

    }
  }

  logout(){
    this._AuthService.logOut()
  }

  change(lang:string):void{
    this._MyTranslateService.changeLang(lang)
  }

  countNum!:number;

  ngOnInit(): void {

    this._CartService.getProductCart().subscribe({
      next:(res)=>{
        this._CartService.cartNum.next(res.numOfCartItems)
      }
    })

    this._CartService.cartNum.subscribe({
      next:(number)=>{
        this.countNum = number
      }
    })
  }
}
