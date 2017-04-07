import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JsonService {

  private filePath: string = "Canal.json";
  private serviceData: any;
  private offersList: any[];

  constructor(public http: Http) {
    this.offersList = [];
  }

  getServiceFile(): Observable<any> {
    return this.http.get(this.filePath)
      .map(res => {
        this.serviceData = res.json();
        return this.serviceData;
      })
      .catch((error: any) => Observable.throw(error.json() || 'Server error'));
  }

  getServiceData(): any {
    return this.serviceData;
  }

  getServiceTitle(): any {
    return this.serviceData.title;
  }

  getOffersList(): any[] {
    if(this.serviceData && this.serviceData.offers) {
      this.offersList = this.serviceData.offers;
      return this.offersList;
    } else {
      return null;
    }
  }

  getCommonFieldsByOffer(offerId: number): any[] {
    let fields: any[] = [];
    if(this.serviceData) {
      for(let field of this.serviceData.commonFields) {
        fields.push(field);
      }
    }
    return fields;
  }

  getSpecificFieldsByOffer(offerId: number): any[] {
    let fields: any[] = [];
    if(this.offersList && this.offersList[offerId]) {
      let offer: any = this.offersList[offerId];
      if(offer.specificFields) {
        for(let field of offer.specificFields) {
          fields.push(field);
        }
      }
    }
    return fields;
  }

  getCommonFieldsIds(): Array<string> {
    var commonFieldsIds = new Array();
    if(this.serviceData) {
      for(let field of this.serviceData.commonFields) {
        commonFieldsIds.push(field.fieldId);
      }
    }
    return commonFieldsIds;
  }

  getSpecificFieldsIdsByOffer(offerId: number): Array<string> {
    var specificFieldsIds = new Array();
    var offers = this.getOffersList();
    if(offers && offers[offerId] && offers[offerId].specificFields) {
      for(let field of offers[offerId].specificFields) {
        specificFieldsIds.push(field.fieldId);
      }
    }
    return specificFieldsIds;
  }

  getAllSpecificFieldsIds() : Array<Array<string>> {
    var specificFieldsIds = new Array();
    var size = this.getOffersList().length;
    for(let i=0; i<size; i++) {
      specificFieldsIds.push(this.getSpecificFieldsIdsByOffer(i));
    }
    return specificFieldsIds;
  }

}
