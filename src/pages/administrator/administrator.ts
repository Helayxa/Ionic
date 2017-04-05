import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html'
})
export class AdministratorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  ionViewDidLoad() {
    this.barcodeScanner.scan().then((barcodeData) => {
     // Success! Barcode data is here
    }, (err) => {
        // An error occurred
    });
  }

}
