import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

  constructor(private _HttpClient:HttpClient) { }

  wishListNumber: BehaviorSubject<number> = new BehaviorSubject(0);


  addProductToWishlist(id:string):Observable<any>{
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist` , 
      {
         "productId": id
      }
    )
  }

  getLoggedUserWishlist():Observable<any>{
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`)
  }

  removeItemFromWishlist(id:string):Observable<any>{
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${id}`)
  }
}
