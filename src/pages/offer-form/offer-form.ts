import { Component } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-offer-form',
  templateUrl: 'offer-form.html'
})
export class OfferFormPage {

  private fields: any[];
  private offerForm: FormGroup;
  private frenchMonth: any[];
  private errorMessages: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder) {
    this.fields = this.navParams.data;
    this.frenchMonth = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    this.generateFormControls();
  }

  generateFormControls(): void {
    let formBuilderContent: any = {};
    for(let field of this.fields) {
      let validators: any = this.generateValidatorsForField(field);
      let defaultValue: any = field.input === 'check' ? false : null;
      formBuilderContent[field.fieldId] = validators.length > 1 ? [defaultValue, Validators.compose(validators)] : [defaultValue, validators];
    }
    this.offerForm = this.formBuilder.group(formBuilderContent);
  }

  generateValidatorsForField(field: any): any[] {
    let validators: any[] = [];
    if(field.required) {
      validators.push(Validators.required);
    }
    if(field.params && field.params.minLength) {
      validators.push(Validators.minLength(field.params.minLength));
    }
    if(field.params && field.params.maxLength) {
      validators.push(Validators.maxLength(field.params.maxLength));
    }
    if(field.params && field.params.regex) {
      validators.push(Validators.pattern(field.params.regex));
    }
    return validators;
  }

  getErrorMessage(fieldErrors: any): string {
    let errorMessage: string = '';
    if(fieldErrors) {
      this.errorMessages = {
        required: 'Ce champ est obligatoire',
        minlength: fieldErrors.minlength ? 'Longueur minimale : ' + fieldErrors.minlength.requiredLength : '',
        maxlength: fieldErrors.maxlength ? 'Longueur maximale : ' + fieldErrors.maxlength.requiredLength : '',
        pattern: 'Ce champ ne respecte pas le pattern requis'
      };
      for(let attribute in fieldErrors) {
        errorMessage += `${this.errorMessages[attribute]}\n`;
      }
    }
    return errorMessage;
  }

  submitForm(): void {
    console.log(this.offerForm.value);
  }

}
