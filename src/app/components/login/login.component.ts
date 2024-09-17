import { Component, inject } from '@angular/core';
import { NavAuthComponent } from "../nav-auth/nav-auth.component";
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { error } from 'console';
import { NgClass } from '@angular/common';
import { routes } from '../../app.routes';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule , RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {



  private readonly _AuthService= inject(AuthService)
 private readonly _FormBuilder = inject(FormBuilder)
 private readonly _Router = inject(Router)


 errMsg:string = ""
 isLoading:boolean = false
 msgSucces:boolean = false


//  loginForm:FormGroup = this._FormBuilder.group({

//    name: [null , Validators.required ,  [ Validators.required , Validators.minLength(3) , Validators.maxLength(20)]],

//    email: [null , [Validators.required , Validators.email] ],

//    password: [null , [Validators.required , Validators.pattern(/^\w{6,}$/)]],

//    rePassword: [null],

//    phone: [null , [Validators.required , Validators.required , Validators.pattern(/^01[0125][0-9]{8}$/)] ]
 
//  } , {validators: this.confirmPassword} )

  loginForm:FormGroup = new FormGroup({


    email: new FormControl(null , [Validators.required , Validators.email]),

    password: new FormControl(null  , [Validators.required , Validators.pattern(/^\w{6,}$/)]),



  } )



  loginSubmit():void{
    if(this.loginForm.valid){

      this.isLoading = true
      this._AuthService.setLoginForm(this.loginForm.value).subscribe({
        next:(res)=>{
          this.msgSucces = res.message
          if(res.message == 'success'){

            localStorage.setItem('userToken' , res.token)

            this._AuthService.saveUserData()

           setTimeout(() => {
            this._Router.navigate( ['/home'] )
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
      this.loginForm.setErrors({missmatch:true})
      this.loginForm.markAllAsTouched()
    }
  }
}
