import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TextSelectorService {

  customerUpdate$: Observable<any>;

  private customerUpdateSubject = new BehaviorSubject<any>(null);
  

  constructor() { 
    this.customerUpdate$ = this.customerUpdateSubject.asObservable();
  }

  updatedCustomer(dataAsParams) {
    this.customerUpdateSubject.next(dataAsParams);
  }
}
