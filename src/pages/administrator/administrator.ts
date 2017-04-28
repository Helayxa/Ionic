import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, ToastController } from 'ionic-angular';

import { JsonService } from '../../providers/json-service';
import { DatabaseService } from '../../providers/database-service';

import { SubscriptionListPage } from '../subscription-list/subscription-list';

@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html'
})

export class AdministratorPage {

  public url: string = "http://files.clemscode.ovh/file2.json";

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public navParams: NavParams, private jsonService: JsonService, private databaseService: DatabaseService, private alertController: AlertController) {

  }

  downloadJson(url: string) {
    this.jsonService.downloadJson(url).subscribe(
      data => {
        //TODO check data validity here and show alert if not valid (don't add to database) /!\
        this.jsonService.setServiceData(data);
        this.databaseService.saveJson(data);
        this.databaseService.createSubscriptionTableIfNotExists();
        this.navCtrl.pop();
        this.toastCtrl.create({
          message: 'Nouveau service chargé',
          duration: 2000
        }).present();
      },
      error => {
        this.alertController.create({
          title: 'Erreur',
          subTitle: 'L\'URL fournie est injoignable !',
          buttons: ['Fermer']
        }).present();
      }
    );
  }

  subscriptionList() {
    this.databaseService.findAllSubscriptions().then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
    this.navCtrl.push(SubscriptionListPage);
  }

}
