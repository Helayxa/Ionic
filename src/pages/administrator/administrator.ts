import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, ToastController, LoadingController } from 'ionic-angular';

import { JsonService } from '../../providers/json-service';
import { DatabaseService } from '../../providers/database-service';

import { SubscriptionListPage } from '../subscription-list/subscription-list';
import { Md5 } from 'ts-md5/dist/md5';

@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html'
})

export class AdministratorPage {

  public url: string = "Canal.json";

  public services: any[];

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public loadingCtrl: LoadingController, public navParams: NavParams, private jsonService: JsonService, private databaseService: DatabaseService, private alertController: AlertController) {

  }

  ionViewWillEnter() {
    this.databaseService.findAllJsonFiles().then(data => {
      this.services = data;
    }).catch(error => {
      console.log('Impossible de charger la liste des fichiers json');
    });
  }

  downloadJson(url: string) {
    let loader: any = this.loadingCtrl.create({
      content: 'Téléchargement ...'
    });
    loader.present();
    this.jsonService.downloadJson(url).subscribe(
      data => {
        //TODO check data validity here and show alert if not valid (don't add to database) /!\
        let hash: string = Md5.hashStr(JSON.stringify(data)) as string;
        this.jsonService.setServiceData(data);
        this.jsonService.currentHash = hash;
        this.databaseService.saveJson(hash, data);
        this.databaseService.createSubscriptionTableIfNotExists();
        loader.dismiss();
        this.navCtrl.pop();
        this.toastCtrl.create({
          message: 'Nouveau service chargé',
          duration: 2000
        }).present();
      },
      error => {
        loader.dismiss();
        this.alertController.create({
          title: 'Erreur',
          subTitle: 'Erreur pendant le téléchargement',
          buttons: ['Fermer']
        }).present();
      }
    );
  }

  onListItemSelected(service: any) {
    this.navCtrl.push(SubscriptionListPage, {
      hash: service.hash,
      json: service.json
    });
  }

  subscriptionList() {
    this.databaseService.findAllSubscriptions(this.jsonService.currentHash).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
    this.navCtrl.push(SubscriptionListPage);
  }

}
