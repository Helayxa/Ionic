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
  errorMessage: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, private barcodeScanner: BarcodeScanner, public alertCtrl: AlertController) {
    this.errorMessage = "";
  }

  ionViewDidEnter()
  {
    this.barcodeScanner.scan({
      "prompt" : "Placez le QR Code dans le cadre." + this.errorMessage,
      "showTorchButton" : true
    }).then((barcodeData) => {
      if(barcodeData.text == "Je suis administrateur")
      {
        this.navCtrl.push(AdministratorPage, );
      }
      else
      {
        if(barcodeData.text != "")
        {
          this.errorMessage = " QR Code incorrect !"
          this.navCtrl.setRoot(ScanerPage);
        }
        else
        {
          this.navCtrl.setRoot(ServicePage);
        }


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
