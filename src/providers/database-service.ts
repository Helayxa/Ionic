import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JsonService } from './json-service';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite'
import { AlertController } from 'ionic-angular';

@Injectable()
export class DatabaseService {

  private db: SQLite;

  constructor(private jsonService: JsonService, private alertController: AlertController) {
    this.db = new SQLite;
  }

  database() : Promise<SQLiteObject> {
    return this.db.create({
      //name: this.jsonService.getServiceTitle(),
      name: 'test.db',
      location: 'default'
    });
  }

  sql(query: string, args: any[]) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.database().then(tx => {
        tx.executeSql(query, args).then(data => {
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  dropTables() {
    this.sql("DROP TABLE client", []).then(data => {
      this.log("Table supprimée", data);
    }).catch(error => {
      this.log("Erreur suppression", error);
    });
  }

  createClientTableSqlStatement() : string {
    let query = "create table if not exists client(";
    let cols: string[] = [];
    for(let field of this.jsonService.getCommonFields()) {
      let col: string = field.fieldId + " ";
      if(field.input == 'number')
        col += 'INTEGER';
      else
        col += 'TEXT'
        cols.push(col);
    }
    query += cols.join(',') + ');';
    return query;
  }

  createTablesIfNotExist() : any {
    this.sql(this.createClientTableSqlStatement(), []).then(data => {
      this.log("Table créée : ", data);
    }).catch(error => {
      this.log("Erreur création table", error);
    });
  }


  subscribe(commonFieldsValues: any[], offerId: number, specificFieldsValues: any[]) : boolean {
    return false;
  }

  log(title: string, content: any) {
    let alert = this.alertController.create({
      title: title,
      subTitle: JSON.stringify(content),
      buttons: ['FERMER']
    });
    alert.present();
  }

}
