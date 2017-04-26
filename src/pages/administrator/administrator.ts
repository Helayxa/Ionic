import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { JsonService } from '../../providers/json-service';
import { DatabaseService } from '../../providers/database-service';

@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html'
})

export class AdministratorPage {

  public url: string = "http://files.clemscode.ovh/file2.json";

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService, private databaseService: DatabaseService, private alertController: AlertController) {

  }

  downloadJson(url: string) {
    this.jsonService.downloadJson(url).subscribe(
      data => {
        //TODO check data validity here and show alert if not valid (don't add to database) /!\
        this.jsonService.setServiceData(data);
        this.databaseService.saveJson(data);
        this.databaseService.createSubscriptionTableIfNotExists();
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

}
