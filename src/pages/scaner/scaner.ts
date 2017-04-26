import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { AlertController } from 'ionic-angular';
import { AdministratorPage } from '../administrator/administrator'
import { ServicePage } from '../service/service';

@Component({
  selector: 'page-scaner',
  templateUrl: 'scaner.html'
})

export class ScanerPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController) {

  }

  ionViewDidEnter()
  {
    this.barcodeScanner.scan().then((barcodeData) => {
      if(barcodeData.text == "Je suis administrateur")
      {
        this.navCtrl.push(AdministratorPage, );
      }
      else
      {
        let alert = this.alertCtrl.create({
          title: 'Ohhhhh',
          subTitle: 'Ce nest pas le bon code barre',
          buttons: ['OK']
          });
        alert.present();
        this.navCtrl.push(ServicePage, );
      }
    },
    (err) => {
      let alert = this.alertCtrl.create({
      title: 'Erreur',
      subTitle: 'Impossible de charger le lecteur de code barre !',
      buttons: ['OK']
      });
      alert.present();
    });
  }
}
