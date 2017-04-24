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
    this.databaseService.createTablesIfNotExist();
    this.databaseService.subscribe(['Clement', 'Ruffin', 'ruffin.Cle@gmail.Com', 21], 2, [4]).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  select() {

  }



}
