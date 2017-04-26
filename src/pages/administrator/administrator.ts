import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';

@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html'
})

export class AdministratorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController) {

  }

  ionViewDidEnter() {
  
  }

}
