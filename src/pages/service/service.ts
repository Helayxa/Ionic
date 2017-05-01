import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { OffersListPage } from '../offers-list/offers-list';
import { JsonService } from '../../providers/json-service';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AdministratorPage } from '../administrator/administrator';
import { HwstatusPage } from '../hwstatus/hwstatus';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})
export class ServicePage {

  service: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController) {

  }

  ionViewWillEnter(): void {
    console.log("ici");
    this.service = this.jsonService.getServiceData();
  }

  pushOffersPage(e): void{
    this.navCtrl.push(OffersListPage);
  }

  onSettingsButtonClicked() {
  /*  this.barcodeScanner.scan({
      "prompt" : "Placez le QR Code dans le cadre.",
      "showTorchButton" : true,
      "showFlipCameraButton" : true
    }).then(
      barcodeData=> {
        if(barcodeData.text == "Je suis administrateur")
        {*/
          this.navCtrl.push(AdministratorPage);
        /*}
        else
        {
          if(barcodeData.text != "")
          {
            this.onSettingsButtonClicked();
          }
          else
          {
            this.navCtrl.setRoot(ServicePage);
          }
        }
      },
      err => {
        this.alertCtrl.create({
          title: 'Erreur',
          subTitle: 'Impossible de charger le lecteur de code-barre !',
          buttons: ['Fermer']
        }).present();
      }
    );*/
  }

  onHwstatusButtonClicked() {
    this.navCtrl.push(HwstatusPage);
  }

}
