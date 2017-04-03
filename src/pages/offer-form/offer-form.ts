import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-offer-form',
  templateUrl: 'offer-form.html'
})
export class OfferFormPage {

  private fields: any[];
  offerForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.fields = this.navParams.data;
    this.generateFormControls();
  }

  generateFormControls(): void {
    let formBuilderContent: any = {};
    for(let field of this.fields) {
      formBuilderContent[field.fieldId] = [null, this.generateValidatorsForField(field)];
    }
    this.offerForm = this.formBuilder.group(formBuilderContent);
  }

  generateValidatorsForField(field: any): any[] {
    let validators: any[] = [];
    if(field.required) {
      validators.push(Validators.required);
    }
    return validators;
  }

  submitForm(): void {
    console.log(this.offerForm.value);
  }

}
