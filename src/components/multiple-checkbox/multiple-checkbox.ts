import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';


@Component({
  selector: 'multiple-checkbox',
  templateUrl: 'multiple-checkbox.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultipleCheckboxComponent),
      multi: true
    }
  ]
})

export class MultipleCheckboxComponent implements ControlValueAccessor, OnInit {

  @Input('field') field: any;

  onChange: any = () => { };
  onTouched: any = () => { };

  private checkboxValues: any[];

  constructor() {
    this.checkboxValues = [];
  }

  ngOnInit(): void {

  }

  changeValue(event: any, id: number) {
    console.log(event.checked);
    console.log(id);
    this.onChange(event.checked);
  }

  writeValue(value) {

  }

  registerOnChange(fn) {
    this.onChange = fn;
  }

  registerOnTouched(fn) {
    this.onTouched = fn;
  }

}
