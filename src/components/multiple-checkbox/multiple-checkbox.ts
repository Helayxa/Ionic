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
    for(let choice of this.field.params.choices) {
      if(choice.selected) {
        this.checkboxValues[choice.value] = true;
      }
    }
  }

  changeValue(event: any, id: number) {
    let choice: any = this.field.params.choices[id];
    this.checkboxValues[choice.value] = event.checked;
    console.log(this.checkboxValues);
    let valueToEmit: any = this.constructValueToEmit();
    console.log(valueToEmit);
    this.onChange(valueToEmit);
  }

  constructValueToEmit(): any{
    let valueToReturn: any[] = [];
    for(let key in this.checkboxValues) {
      if(this.checkboxValues[key] === true) {
        valueToReturn.push(key);
      }
    }
    if(valueToReturn.length > 0) {
      return valueToReturn.toString();
    } else {
      return null;
    }
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
