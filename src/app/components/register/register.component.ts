import { Component, inject, OnDestroy } from '@angular/core';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { NgClass } from '@angular/common';
import { routes } from '../../app.routes';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { subscribe } from 'diagnostics_channel';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [NavAuthComponent,ReactiveFormsModule , NgClass],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent  {

 private readonly _AuthService= inject(AuthService)
 private readonly _FormBuilder = inject(FormBuilder)
 private readonly _Router = inject(Router)


 errMsg:string = ""
 isLoading:boolean = false
 msgSucces:boolean = false
 registerSub!:Subscription


//  registerForm:FormGroup = this._FormBuilder.group({

//    name: [null , Validators.required ,  [ Validators.required , Validators.minLength(3) , Validators.maxLength(20)]],

//    email: [null , [Validators.required , Validators.email] ],

//    password: [null , [Validators.required , Validators.pattern(/^\w{6,}$/)]],

//    rePassword: [null],

//    phone: [null , [Validators.required , Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)] ]
 
//  } , {validators: this.confirmPassword} )

  registerForm:FormGroup = new FormGroup({

    name: new FormControl(null , [ Validators.required , Validators.minLength(3) , Validators.maxLength(20)]),

    email: new FormControl(null , [Validators.required , Validators.email]),

    password: new FormControl(null  , [Validators.required , Validators.pattern(/^\w{6,}$/)]),

    rePassword: new FormControl(null  , [Validators.required , Validators.pattern(/^\w{6,}$/)]),

    phone: new FormControl(null  , [Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)]),

  } , this.confirmPassword)



  registerSubmit():void{
    if(this.registerForm.valid){

      this.isLoading = true
      this.registerSub =  this._AuthService.setRegisterForm(this.registerForm.value).subscribe({
        next:(res)=>{
          this.msgSucces = res.message

          if(res.message == 'success'){

           setTimeout(() => {
            this._Router.navigate( ['/login'] )
           }, 2000);
              

          }
          console.log(res);
          
      this.isLoading = false
        },
        error:(err:HttpErrorResponse)=>{
          this.errMsg = err.error.message
          this.msgSucces = false
          console.log(err);
          
      this.isLoading = false
          
        }
      })
    }else{
      this.registerForm.setErrors({missmatch:true})
      this.registerForm.markAllAsTouched()
    }
  }



  ngOnDestroy(): void {
    this.registerSub?.unsubscribe()
  }

  confirmPassword( g:AbstractControl){
    if( g.get('password')?.value === g.get('rePassword')?.value){
      return null
    }else{
      return {missmatch:true}
    }
  }
}
