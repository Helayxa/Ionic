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

  public url: string = 'http://files.clemscode.ovh/file2.json';

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
        loader.dismiss();
        let hash: string = Md5.hashStr(JSON.stringify(data)) as string;
        this.databaseService.isHashExisting(hash).then(exists => {
          if(exists) {
            this.alertController.create({
              title: 'Conflit détecté',
              subTitle: 'Ce service a déjà été téléchargé auparavant. Voulez-vous conserver les anciennes données ?',
              buttons: [{
                text: 'Effacer',
                handler: () => { this.onEraseButtonClicked(data, hash); }
              },{
                text: 'Conserver',
                handler: () => { this.onKeepButtonClicked(data, hash); }
              }]
            }).present();
          } else {
            this.setCurrentService(data, hash);
            this.exitSuccess();
          }
        }).catch(error => {
          console.log('Cannot check if hash exists ...');
        });
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

  onEraseButtonClicked(data: any, hash: string) {
    this.databaseService.deleteServiceDatabase(hash).then(d1 => {
      this.databaseService.deleteJsonEntry(hash).then(d2 => {
        this.setCurrentService(data, hash);
        this.exitSuccess();
      }).catch(error => {
        console.log('cannot deleteJsonEntry', error);
      });
    }).catch(error => {
      console.log('cannot delete database', error);
    })
  }

  onKeepButtonClicked(data: any, hash: string) {
    this.databaseService.deleteJsonEntry(hash).then(success => {
      this.setCurrentService(data, hash);
      this.exitSuccess();
    }).catch(error => {
      console.log('cannot deleteJsonEntry', error);
    });
  }

  setCurrentService(data: any, hash: string) {
    this.jsonService.setServiceData(data);
    this.jsonService.currentHash = hash;
    this.databaseService.saveJson(hash, data);
    this.databaseService.createSubscriptionTableIfNotExists();
  }

  onListItemSelected(service: any) {
    this.navCtrl.push(SubscriptionListPage, {
      hash: service.hash,
      json: service.json
    });
  }

  exitSuccess() {
    this.navCtrl.pop();
    this.toastCtrl.create({
      message: 'Nouveau service chargé',
      duration: 2000
    }).present();
  }

}
