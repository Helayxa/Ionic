import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { OffersListPage } from '../offers-list/offers-list';
import { JsonService } from '../../providers/json-service';

import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { AdministratorPage } from '../administrator/administrator'

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})
export class ServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService, private barcodeScanner: BarcodeScanner, private alertCtrl: AlertController) {

  }

  pushOffersPage(e): void{
    this.navCtrl.push(OffersListPage);
  }

  onSettingsButtonClicked() {
    this.barcodeScanner.scan().then(
      barcodeData=> {
        if(barcodeData.text == "Je suis administrateur") {
          this.navCtrl.push(AdministratorPage);
        } else {
          this.alertCtrl.create({
            title: 'Accès refusé',
            subTitle: 'Veuillez scanner le code-barre administrateur.',
            buttons: ['Fermer']
          }).present();
        }
      },
      err => {
        this.alertCtrl.create({
          title: 'Erreur',
          subTitle: 'Impossible de charger le lecteur de code-barre !',
          buttons: ['Fermer']
        }).present();
      }
    );
  }

}
