import { Component, forwardRef, Input, AfterViewInit } from '@angular/core';
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

export class MultipleCheckboxComponent implements ControlValueAccessor, AfterViewInit {

  @Input('field') field: any;

  onChange: any = () => { };
  onTouched: any = () => { };

  private checkboxValues: any[];

  constructor() {
    this.checkboxValues = [];
  }

  ngAfterViewInit() {
    let choices: any = this.field.params.choices;
    if(choices) {
      for(let i = 0; i < choices.length; i++ ) {
        if(choices[i].selected) {
          this.changeValue(true, i);
        }
      }
    }
  }

  changeValue(event: any, id: number) {
    let choice: any = this.field.params.choices[id];
    this.checkboxValues[choice.value] = event;
    let valueToEmit: any = this.constructValueToEmit();
    this.onChange(valueToEmit);
  }

  constructValueToEmit(): any {
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
