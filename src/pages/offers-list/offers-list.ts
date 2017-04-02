import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OfferPage } from '../offer/offer';

import { JsonService } from '../../providers/json-service';


@Component({
  selector: 'page-offers-list',
  templateUrl: 'offers-list.html'
})
export class OffersListPage {

  offersList: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService) {
    this.offersList = [];
  }

  /* Récupère la liste des offres à l'initialisation du composant */
  ionViewWillEnter() {
    this.offersList = this.jsonService.getOffersList();
  }

  goToFormForOffer(offerId: number): void {
    this.navCtrl.push(OfferPage, this.jsonService.getFieldsByOffer(offerId));
  }

}
