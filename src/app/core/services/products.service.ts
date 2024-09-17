import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

 _HttpClient = inject(HttpClient)

 getAllProducts():Observable<any>{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`)
 }

 getSpecficProducts(id:any):Observable<any>{
  return this._HttpClient.get(`${environment.baseUrl}/api/v1/products/${id}` )
 }
}
