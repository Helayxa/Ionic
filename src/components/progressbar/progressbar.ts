import { Component, Input } from '@angular/core';

@Component({
  selector: 'progressbar',
  templateUrl: 'progressbar.html'
})
export class ProgressbarComponent {

  @Input('progress') progress;
  @Input('progressDisplay') progressDisplay;

  constructor() {

  }

}
