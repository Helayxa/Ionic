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
  openJsonRepository() : Promise<SQLiteObject> {
    return this.db.create({
      name: this.jsonRepoName,
      location: 'default'
    });
  }

  queryJsonRepository(query: string, args: any[]) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.openJsonRepository().then(tx => {
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

  createServiceFilesTableIfNotExists() {
    this.queryJsonRepository('create table if not exists service(hash TEXT, json TEXT);', []).then(data => {
      console.log("Table de service json créée");
    }).catch(error => {
      console.log("Impossible de créer la table de services json", error);
    });
  }

  getLastJsonEntry() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.queryJsonRepository("select * from service order by rowId desc limit 1", []).then(data => {
        if(data.rows.length > 0) {
          resolve(data.rows.item(0));
        } else {
          reject("ERROR : Aucune entrée dans la table JSON !!!")
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  saveJson(hash: string, json: any) {
    this.queryJsonRepository("insert into service(hash, json) values(?, ?)", [hash, JSON.stringify(json)]).then(data => {
      console.log("Json inséré dans la base de données");
    }).catch(error => {
      console.log(error);
    });
  }

  findAllJsonFiles() : Promise<any> {
    return new Promise((resolve, reject) => {
      this.queryJsonRepository('select * from service order by rowId desc;', []).then(data => {
        if(data.rows.length > 0) {
          let result: any[] = [];
          for(let i=0; i<data.rows.length; i++) {
            result.push(data.rows.item(i));
          }
          resolve(result);
        } else {
          reject("Aucun service enregistré");
        }
      }).catch(error => {
        reject(error);
      });
    });
  }

  openServiceDatabase(hash: string) : Promise<SQLiteObject> {
    return this.db.create({
      name: hash + '.db',
      location: 'default'
    });
  }

  queryServiceDatabase(query: string, args: any[], hash = this.jsonService.currentHash) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.openServiceDatabase(hash).then(tx => {
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
    this.queryServiceDatabase(this.buildCreateSubscriptionTableSqlStatement(), []).then(data => {
      console.log("Table souscription créée");
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

  findAllSubscriptions(hash: string) : Promise<any> {
    return new Promise((resolve, reject) => {
      this.queryServiceDatabase('select * from subscription;', [], hash).then(data => {
        if(data.rows.length > 0) {
          let result: any[] = [];
          for(let i=0; i<data.rows.length; i++) {
            result.push(data.rows.item(i));
          }
          resolve(result);
        } else {
          resolve([]);
        }
      }).catch(error => {
        reject(error);
      });
    });
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
    return this.queryServiceDatabase(query, values);
  }

}
