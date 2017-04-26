import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { OffersListPage } from '../offers-list/offers-list';
import { JsonService } from '../../providers/json-service';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})
export class ServicePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService) {}

  goToOfferList(e): void{
    this.navCtrl.setRoot(OffersListPage);
  }

}
