import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';

import { ServicePage } from '../service/service';
import { OffersListPage } from '../offers-list/offers-list';
import { AdministratorPage } from '../administrator/administrator';
import { DatabasePage } from '../database/database';

import { JsonService } from '../../providers/json-service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  serviceTab: any = ServicePage;
  offersListTab: any = OffersListPage;
  administratorTab: any = AdministratorPage;
  databaseTab: any = DatabasePage;

  constructor(public loadingCtrl: LoadingController, private jsonService: JsonService) {

  }

  /* Récupère les données du fichier en faisant appel à la requête HTTP contenue dans le JsonService */
  ionViewDidLoad() {
    this.jsonService.getServiceFile().subscribe(
      data => {},
      error => {
        console.log("Erreur lors de la récupération du fichier");
      }
    );
  }
}
