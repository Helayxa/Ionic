import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { JsonService } from '../../providers/json-service';
import { DatabaseService} from '../../providers/database-service';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage implements OnInit {

  private errorMessages: any;
  paymentList: any;
  globalForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService, private formBuilder : FormBuilder, private databaseService: DatabaseService) {
    this.paymentList = [];
  }

  ngOnInit(): void {
    this.paymentList = this.jsonService.getPaymentWays();
    this.initFormControls();
  }

  initFormControls(): void{
    this.globalForm = this.formBuilder.group({
      radioPayment: [null, Validators.required],
      bankForm: this.formBuilder.group({
        bic: ['', Validators.required],
        iban: ['', Validators.required]
      }),
      paypalForm: this.formBuilder.group({
        numPaypal: ['', Validators.required]
      }),
      creditCardForm: this.formBuilder.group({
        cardNumber: ['', Validators.compose([Validators.required, Validators.minLength(16), Validators.maxLength(16)])],
        cardName: ['', Validators.required],
        cardExp: ['', Validators.required],
        cardCVC: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(3)])]
      })
    });
    this.modifyFormControls();
    this.globalForm.patchValue({radioPayment: this.paymentList[0]});
  }

  modifyFormControls(): void {
    this.globalForm.get('radioPayment').valueChanges.subscribe(
      payment => {
        console.log("modification du formulaire");
        if (payment === 'creditCard') {
          this.globalForm.get('creditCardForm').get('cardNumber').setValidators(Validators.required);
          this.globalForm.get('creditCardForm').get('cardName').setValidators(Validators.required);
          this.globalForm.get('creditCardForm').get('cardExp').setValidators(Validators.required);
          this.globalForm.get('creditCardForm').get('cardCVC').setValidators(Validators.required);
          this.globalForm.get('paypalForm').get('numPaypal').setValidators([]);
          this.globalForm.get('bankForm').get('bic').setValidators([]);
          this.globalForm.get('bankForm').get('iban').setValidators([]);
        }
        else if (payment === 'paypal') {
          this.globalForm.get('creditCardForm').get('cardNumber').setValidators([]);
          this.globalForm.get('creditCardForm').get('cardName').setValidators([]);
          this.globalForm.get('creditCardForm').get('cardExp').setValidators([]);
          this.globalForm.get('creditCardForm').get('cardCVC').setValidators([]);
          this.globalForm.get('paypalForm').get('numPaypal').setValidators(Validators.required);
          this.globalForm.get('bankForm').get('bic').setValidators([]);
          this.globalForm.get('bankForm').get('iban').setValidators([]);
        }
        else if (payment === 'bankTransfer'){
          this.globalForm.get('creditCardForm').get('cardNumber').setValidators([]);
          this.globalForm.get('creditCardForm').get('cardName').setValidators([]);
          this.globalForm.get('creditCardForm').get('cardExp').setValidators([]);
          this.globalForm.get('creditCardForm').get('cardCVC').setValidators([]);
          this.globalForm.get('paypalForm').get('numPaypal').setValidators([]);
          this.globalForm.get('bankForm').get('bic').setValidators(Validators.required);
          this.globalForm.get('bankForm').get('iban').setValidators(Validators.required);
        }
          this.globalForm.get('creditCardForm').get('cardNumber').updateValueAndValidity();
          this.globalForm.get('creditCardForm').get('cardNumber').updateValueAndValidity();
          this.globalForm.get('creditCardForm').get('cardName').updateValueAndValidity();
          this.globalForm.get('creditCardForm').get('cardExp').updateValueAndValidity();
          this.globalForm.get('creditCardForm').get('cardCVC').updateValueAndValidity();
          this.globalForm.get('paypalForm').get('numPaypal').updateValueAndValidity();
          this.globalForm.get('bankForm').get('bic').updateValueAndValidity();
          this.globalForm.get('bankForm').get('iban').updateValueAndValidity();
      }
    );
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
    let commonFieldsValue: any[] = this.navParams.get('commonFields');
    let specificFieldsValue: any[] = this.navParams.get('specificFields');
    let offerId: number = this.navParams.get('offerId');
    this.databaseService.createSubscription(commonFieldsValue, offerId, specificFieldsValue).then(
      success => {
        
      }
    ).catch(
      error => {

      }
    );
  }

}
