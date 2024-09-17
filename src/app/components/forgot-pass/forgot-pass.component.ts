import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-pass',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgot-pass.component.html',
  styleUrl: './forgot-pass.component.scss'
})
export class ForgotPassComponent {

  private readonly _AuthService = inject(AuthService)
  private readonly _Router = inject(Router)

  isLoading:boolean = false
  step:number = 1;

  verifyEmail:FormGroup = new FormGroup({
    email: new FormControl(null , [ Validators.required , Validators.email])
  })

  verifyCode:FormGroup = new FormGroup({
    resetCode: new FormControl(null , [ Validators.required , Validators.pattern(/^\w{6,}$/)])
  })

   resetPassword:FormGroup = new FormGroup({
    email: new FormControl(null , [ Validators.required , Validators.email]),
    newPassword: new FormControl(null , [ Validators.required , Validators.pattern(/^\w{6,}$/)])
  })

  verifyEmailSubmit():void{

      
    this.isLoading = true
    this._AuthService.setVerifyEmail(this.verifyEmail.value).subscribe({
      next:(res)=>{
        
        if(res.statusMsg === 'success'){
          this.isLoading = false
          this.step = 2
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }


  verifyCodeSubmit():void{
    this.isLoading = true
    this._AuthService.setVerifyCode(this.verifyCode.value).subscribe({
      next:(res)=>{
        if(res.status === 'Success'){
          this.isLoading = false
          
          console.log(res.status);
          
          this.step = 3
        }
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }

  resetPassSubmit():void{
    this.isLoading = true
    this._AuthService.setResetPass(this.resetPassword.value).subscribe({
      next:(res)=>{
       
          localStorage.setItem('userToken' , res.token);

          this._AuthService.saveUserData();

          this._Router.navigate(['/home']);
      },
      error:(err)=>{
        console.log(err);
      }
    })
  }
}
