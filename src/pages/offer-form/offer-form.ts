import { Component, OnInit, OnDestroy } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NavController, NavParams } from 'ionic-angular';

import { PaymentPage } from '../payment/payment';

import { JsonService } from '../../providers/json-service';
import { DatabaseService } from '../../providers/database-service';

@Component({
  selector: 'page-offer-form',
  templateUrl: 'offer-form.html'
})
export class OfferFormPage implements OnInit, OnDestroy {

  private offerId: number;
  private commonFields: any[];
  private specificFields: any[];
  private fields: any[];
  private features: any[];
  private FIELDS_NAME = {
    COMMON: 'commonFields',
    SPECIFIC: 'specificFields'
  };
  private offerForm: FormGroup;
  private frenchMonth: any[];
  private errorMessages: any;
  private price: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, private jsonService: JsonService, private databaseService: DatabaseService) {
    this.fields = [];
    this.features = [];
    this.frenchMonth = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
    this.offerId = this.navParams.get('id');
    this.commonFields = this.navParams.get('commonFields');
    this.specificFields = this.navParams.get('specificFields');
    this.price = this.navParams.get('price');
  }

  ngOnInit(): void {
    this.features = this.jsonService.getFeaturesByOffer(this.offerId);
    this.constructFields();
    this.generateFormControls();
  }

  ngOnDestroy(): void {
    for(let i = 0; i < this.features.length; i++) {
      this.features[i].selected = false;
    }
  }

  constructFields(): void {
    for(let field of this.commonFields) {
      field.formGroupName = this.FIELDS_NAME.COMMON;
      this.fields.push(field);
    }

    for(let field of this.specificFields) {
      field.formGroupName = this.FIELDS_NAME.SPECIFIC;
      this.fields.push(field);
    }
  }

  generateFormControls(): void {
    let commonFieldsFormGroup: any = {};
    let specificFieldsFormGroup: any = {}
    let defaultValue: any = null;
    for(let field of this.commonFields) {
      let validators: any = this.generateValidatorsForField(field);
      defaultValue = this.getDefaultValueForField(field);
      commonFieldsFormGroup[field.fieldId] = validators.length > 1 ? [defaultValue, Validators.compose(validators)] : [defaultValue, validators];
    }

    for(let field of this.specificFields) {
      let validators: any = this.generateValidatorsForField(field);
      defaultValue = this.getDefaultValueForField(field);
      specificFieldsFormGroup[field.fieldId] = validators.length > 1 ? [defaultValue, Validators.compose(validators)] : [defaultValue, validators];
    }

    this.offerForm = this.formBuilder.group({
      commonFields: this.formBuilder.group(commonFieldsFormGroup),
      specificFields: this.formBuilder.group(specificFieldsFormGroup)
    });
  }

  getDefaultValueForField(field: any): any {
    let valueToReturn: any = null;
    if(field.input === 'select' || field.input === 'radio') {
      if(field.params && field.params.choices && field.params.choices.length > 0) {
        for(let choice of field.params.choices) {
          if(choice.selected) {
            valueToReturn = choice.value;
          }
        }
      }
    }
    return valueToReturn;
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

  constructArrayFromObject(fields: any): any[] {
    let result: any[] = [];
    if(fields) {
      for(let property in fields) {
        result.push(fields[property]);
      }
    }
    return result;
  }

  updatePrice(feature: any): any {
    if(feature.selected) {
      this.price += feature.price;
    } else {
      this.price -= feature.price;
    }
  }

  constructFeatures(): string {
    let valueToReturn: any[] = [];
    for(let i: number = 0; i < this.features.length; i++) {
      if(this.features[i].selected) {
        valueToReturn.push(i);
      }
    }
    return valueToReturn.join();
  }

  submitForm(value: any): void {
    let commonFieldsArray: any[] = this.constructArrayFromObject(value.commonFields);
    let specificFieldsArray: any[] = this.constructArrayFromObject(value.specificFields);
    let featuresForDatabase: string = this.constructFeatures();
    this.navCtrl.push(PaymentPage, {
      commonFields: commonFieldsArray,
      specificFields: specificFieldsArray,
      offerId: this.offerId,
      features: featuresForDatabase,
      price: this.price
    });
  }

}
