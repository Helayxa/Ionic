import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { OfferFormPage } from '../offer-form/offer-form';

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
    this.navCtrl.push(OfferFormPage, {
      id: offerId,
      commonFields: this.jsonService.getCommonFieldsByOffer(offerId),
      specificFields: this.jsonService.getSpecificFieldsByOffer(offerId),
      price: this.offersList[offerId].price
    });
  }

}
