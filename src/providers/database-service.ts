import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JsonService } from './json-service';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite'

@Injectable()
export class DatabaseService {

  private db: SQLite;

  constructor(private jsonService: JsonService) {
    this.db = new SQLite;
  }

  echoTest() : any {
    this.db.echoTest().then(data => {
        return 'data';
      }).catch(error => {
        return 'error';
      });
      return 'mon cul';
  }

  createDatabase() : any {
    this.db.create({
      name: this.jsonService.getServiceTitle()
    }).then((db: SQLiteObject) => {
      db.executeSql('CREATE TABLE IF NOT EXISTS CLIENT(' + this.jsonService.getCommonFieldsIds().join(',') + ');', {});
      db.executeSql('CREATE TABLE IF NOT EXISTS OFFER(idClient,idOffer,' + this.jsonService.getAllSpecificFieldsIds().join(',') + ');', {});
      return 'SQL Executed successfully';
    }).catch(e => { return e });
  }

  subscribe(commonFieldsValues: any[], offerId: number, specificFieldsValues: any[]) : boolean {




    return false;
  }

}
