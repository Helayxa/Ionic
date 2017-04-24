import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
//import { FormGroup } from '@angular/forms';
import { JsonService } from '../../providers/json-service';

@Component({
  selector: 'page-payment',
  templateUrl: 'payment.html'
})
export class PaymentPage implements OnInit {

  cardCVC: number;
  cardName: string;
  cardExp: string;
  cardNumber: number;
  private errorMessages: any;
  paymentList: any;
  radioPayment: string;
  //paymentForm: FormGroup;

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService) {
    this.paymentList = [];
  }

  ngOnInit(): void {
    this.paymentList = this.jsonService.getPaymentWays();
    console.log(this.paymentList);
  }

  onRadioChange(payment : string): void{
    console.log(this.radioPayment);
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
    console.log("success");
  }

}
