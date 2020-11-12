import { Injectable } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class AppSpinnerService {

  config = {
    type: 'ball-clip-rotate',
    size: 'medium',
    bdColor: 'rgba(0, 0, 0, 0.7)',
    color: '#fff',
    fullScreen: false
  };

  constructor(private spinner: NgxSpinnerService) { }

  show(name = 'dashboard', config?: any): void {
    this.spinner.show(name, {
      type: 'ball-clip-rotate',
      size: 'medium',
      bdColor: 'rgba(0, 0, 0, 0.7)',
      color: '#fff',
      fullScreen: false
    });
  }

  hide(name = 'dashboard'): void {
    this.spinner.hide(name);
  }

}
