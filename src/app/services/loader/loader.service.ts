import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { LoaderState } from '../loader/loader';
import { BlockUI, NgBlockUI } from 'ng-block-ui';

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  @BlockUI() blockUI: NgBlockUI;
  loader;
  constructor() {
  }


  show() {    
    console.log('api start');
    this.loader && (this.loader.style.display = 'block');
  }
  hide() {
    this.loader && (this.loader.style.display = 'none');
    console.log('api end');
    

  }
}
