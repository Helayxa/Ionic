import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class JsonService {

  private filePath: string = "service.json";
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

  getOffersList(): any[] {
    if(this.serviceData && this.serviceData.offers) {
      this.offersList = this.serviceData.offers;
      return this.offersList;
    } else {
      return null;
    }
  }

  getFieldsByOffer(offerId: number): any[] {
    let fields: any[] = [];
    if(this.serviceData) {
      for(let field of this.serviceData.commonFields) {
        fields.push(field);
      }
      if(this.offersList && this.offersList[offerId]) {
        let offer: any = this.offersList[offerId];
        if(offer.specificFields) {
          for(let field of offer.specificFields) {
            fields.push(field);
          }
        }
      }
    }
    return fields;
  }

}
