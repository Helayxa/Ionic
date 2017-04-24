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
    this.databaseService.dropTables();
    this.databaseService.createTablesIfNotExist();
  }

  select() {
    this.databaseService.sql("SELECT * FROM client", []).then(data => {
      let users: any[];
      this.databaseService.log("Data length", data.rows);
      for(let i=0; i<data.rows.length; i++) {
        users.push({
          clientSurname: data.rows.item(i).clientSurname,
          clientName: data.rows.item(i).clientName
        });
      }
      this.databaseService.log("Select OK :", users);
    }).catch(error => {
      this.databaseService.log("Select error : ", error);
    });
  }

  testInsert() {
    this.databaseService.sql("INSERT INTO client(clientSurname, clientName, clientMail, clientAge) VALUES('Ruffin', 'Clément', 'ruffin.cle@gmail.com', 21)", []).then(data => {
      this.databaseService.log("Insert OK", data);
    }).catch(error => {
      this.databaseService.log("Insert Error", error);
    });
  }

}
