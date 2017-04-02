import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-offer',
  templateUrl: 'offer.html'
})
export class OfferPage {

  fields: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.fields = [];
  }

  ionViewDidLoad() {
    this.fields = this.navParams.data;
  }

}
