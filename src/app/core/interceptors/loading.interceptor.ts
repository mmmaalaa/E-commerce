import { NgxSpinnerComponent, NgxSpinnerService } from 'ngx-spinner';
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

 const _NgxSpinnerService = inject(NgxSpinnerService)

 _NgxSpinnerService.show()

  return next(req).pipe( finalize(()=>{
    _NgxSpinnerService.hide()
  }))
};
