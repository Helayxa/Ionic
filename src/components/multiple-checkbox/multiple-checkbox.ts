import { Component } from '@angular/core';

@Component({
  selector: 'multiple-checkbox',
  templateUrl: 'multiple-checkbox.html'
})
export class MultipleCheckboxComponent {

  text: string;

  constructor() {
    console.log('Hello MultipleCheckbox Component');
    this.text = 'Hello World';
  }

}
