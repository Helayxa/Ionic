import { Injectable } from '@angular/core';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { JsonService } from './json-service';

import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class DatabaseService {

  private jsonRepoName: string = "json_files.db";

  private db: SQLite;

  constructor(private jsonService: JsonService) {
    this.db = new SQLite;
  }

  /*
    JSON repositoty functions
  */
  jsonRepo() : Promise<SQLiteObject> {
    return this.db.create({
      name: this.jsonRepoName,
      location: 'default'
    });
  }

  createServiceFilesTableIfNotExists() {
    this.jsonRepo().then(tx => {
      tx.executeSql("create table if not exists service(json TEXT);", {}).then(data => {
        console.log("Table de service json créée");
      }).catch(error => {
        console.log("Impossible de créer la table de services json", error);
      });
    }).catch(error => {
      console.log(error);
    });
  }

  getLastJson() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.jsonRepo().then(tx => {
        tx.executeSql("select * from service order by rowId desc limit 1", {}).then(data => {
          if(data.rows.length > 0) {
            resolve(data.rows.item(0).json);
          } else {
            reject("ERROR : Aucune entrée dans la table JSON !!!")
          }
        }).catch(error => {
          reject(error);
        });
      }).catch(error => {
        reject(error);
      });
    });
  }

  saveJson(json: any) {
    this.jsonRepo().then(tx => {
      tx.executeSql("insert into service values(?)", [JSON.stringify(json)]).then(data => {
        console.log("Json inséré dans la base de données");
      }).catch(error => {
        console.log(error);
      });
    }).catch(error => {
      console.log(error);
    });
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

  buildCreateSubscriptionTableSqlStatement() : string {
    let query: string = 'create table if not exists subscription(';
    let cols: string[] = [];
    for(let field of this.jsonService.getCommonFields()) {
      let col: string = field.fieldId + ' ';
      if(field.input == 'number')
        col += 'INTEGER';
      else
        col += 'TEXT'
      cols.push(col);
    }
    cols.push('offerId INTEGER');
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

  createSubscriptionTableIfNotExists() : any {
    this.sql(this.buildCreateSubscriptionTableSqlStatement(), []).then(data => {
      console.log("Table souscription créée");
    }).catch(error => {
      console.log("Erreur création table", error);
    });
    /*
    this.sql(this.createOfferTableSqlStatement(), []).then(data => {
      console.log("Table offer créée");
    }).catch(error => {
      console.log("Erreur création table", error);
    });
    */
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
    let comma: string = '';
    if(this.jsonService.getSpecificFieldsIdsByOffer(idOffer) && this.jsonService.getSpecificFieldsIdsByOffer(idOffer).length > 0) {
      comma = ',';
    }
    return this.sql("INSERT INTO offer(idClient,idOffer" + comma + this.jsonService.getSpecificFieldsIdsByOffer(idOffer).join(',') + ") VALUES(" + this.createQuestionMarkList(specificFieldsValues.length + 2) + ")", args);
  }

  createSubscription(commonFieldsValues: any[], offerId: number, specificFieldsValues: any[]) : Promise<any> {
    let query: string = 'insert into subscription(';
    let fieldsToFill: string[] = [];
    let values: any[] = [];
    for(let field of this.jsonService.getCommonFields()) {
      fieldsToFill.push(field.fieldId);
    }
    fieldsToFill.push('offerId');
    for(let field of this.jsonService.getSpecificFieldsByOffer(offerId)) {
      fieldsToFill.push(field.fieldId);
    }
    query += fieldsToFill.join(',') + ') values(' + this.createQuestionMarkList(fieldsToFill.length) + ');';
    values = values.concat(commonFieldsValues);
    values.push(offerId);
    values = values.concat(specificFieldsValues);
    return this.sql(query, values);


/*
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
    */
  }

}
