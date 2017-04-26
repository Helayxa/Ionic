import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JsonService } from './json-service';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';
import { AlertController } from 'ionic-angular';

@Injectable()
export class DatabaseService {

  private db: SQLite;

  constructor(private jsonService: JsonService, private alertController: AlertController) {
    this.db = new SQLite;
  }

  database() : Promise<SQLiteObject> {
    return this.db.create({
      name: this.jsonService.getServiceTitle(),
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

  createOfferTableSqlStatement() : string {
    let query = "create table if not exists offer(idClient,idOffer,";
    let cols: string[] = [];
    let offerCount = this.jsonService.getOffersList().length;
    for(let i=0; i<offerCount; i++) {
      for(let field of this.jsonService.getSpecificFieldsByOffer(i)) {
        let col: string = field.fieldId + " ";
        if (field.input == 'number')
          col += 'INTEGER';
        else
          col += 'TEXT';
        cols.push(col);
      }
    }
    query += cols.join(',') + ');';
    return query;
  }

  createTablesIfNotExist() : any {
    this.sql(this.createClientTableSqlStatement(), []).then(data => {
      console.log("Table client créée");
    }).catch(error => {
      console.log("Erreur création table", error);
    });
    this.sql(this.createOfferTableSqlStatement(), []).then(data => {
      console.log("Table offer créée");
    }).catch(error => {
      console.log("Erreur création table", error);
    });
  }

  createQuestionMarkList(length: number) : string {
    let a: string[] = [];
    for(let i=0; i<length; i++) {
      a.push('?');
    }
    return a.join(',');
  }

  createClient(commonFieldsValues: any[]) : Promise<any> {
    return this.sql("INSERT INTO client VALUES(" + this.createQuestionMarkList(commonFieldsValues.length) + ")", commonFieldsValues);
  }

  createOffer(idClient: number, idOffer: number, specificFieldsValues: any[]) {
    let args: any[] = [];
    args.push(idClient);
    args.push(idOffer);
    args.push(specificFieldsValues);
    return this.sql("INSERT INTO offer(idClient,idOffer," + this.jsonService.getSpecificFieldsIdsByOffer(idOffer).join(',') + ") VALUES(" + this.createQuestionMarkList(specificFieldsValues.length + 2) + ")", args);
  }

  subscribe(commonFieldsValues: any[], offerId: number, specificFieldsValues: any[]) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.createClient(commonFieldsValues).then(data => {
        console.log("client créé");
        this.createOffer(data.insertId, offerId, specificFieldsValues).then(data => {
          console.log("offre créée");
          resolve(data);
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

}
