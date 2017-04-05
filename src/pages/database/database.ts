import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { DatabaseService } from '../../providers/database-service';

@Component({
  selector: 'page-database',
  templateUrl: 'database.html'
})
export class DatabasePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private alertController: AlertController, private databaseService: DatabaseService) {

  }

  ionViewDidLoad() {
    let ret = this.databaseService.echoTest();
    this.log(ret);
  }

  log(message: any) {
    this.alertController.create({
      title: message
    }).present();
  }

}
