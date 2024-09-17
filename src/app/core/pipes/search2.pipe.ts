import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search2',
  standalone: true
})
export class Search2Pipe implements PipeTransform {

  transform( products:any[] , term:string ): any[] {
    return products.filter((item)=> item.title.toLowerCase().includes(term.toLowerCase()) );
  }

}
