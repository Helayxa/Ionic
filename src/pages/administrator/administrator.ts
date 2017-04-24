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
    this.barcodeScanner.scan().then((barcodeData) => {
      let alert = this.alertCtrl.create({
      title: 'Yeesssss !!',
      subTitle: 'Le code barre est détecté !',
      buttons: ['OK']
      });
      alert.present();
    }, (err) => {
      let alert = this.alertCtrl.create({
      title: 'New Friend!',
      subTitle: 'Your friend, Obi wan Kenobi, just accepted your friend request!',
      buttons: ['OK']
      });
      alert.present();
    });
  }

}
