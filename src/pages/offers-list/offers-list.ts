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

  }

  /* Récupère la liste des offres à l'initialisation du composant */
  ionViewDidLoad() {
    this.offersList = this.jsonService.getOffersList();
  }

  onSwipe(swipe: any): void {
    // Renvoie à la tab de gauche
    if(swipe.direction === 4) {
      this.navCtrl.parent.select(0);
    }
  }

  goToFormForOffer(offerId: number): void {
    this.navCtrl.push(OfferPage, this.jsonService.getFieldsByOffer(offerId));
  }

}
