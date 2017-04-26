import { Component } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { ServicePage } from '../service/service';
import { OffersListPage } from '../offers-list/offers-list';
import { ScanerPage } from '../scaner/scaner';
import { DatabasePage } from '../database/database';

import { JsonService } from '../../providers/json-service';
import { DatabaseService } from '../../providers/database-service';

@Component({
  selector: 'page-tabs',
  templateUrl: 'tabs.html'
})
export class TabsPage {
  serviceTab: any = ServicePage;
  offersListTab: any = OffersListPage;
  scanerTab: any = ScanerPage;
  databaseTab: any = DatabasePage;

  constructor(public loadingCtrl: LoadingController, private alertCtrl: AlertController) {

  }

  /* Récupère les données du fichier en faisant appel à la requête HTTP contenue dans le JsonService */
  ionViewWillLoad() {
    //this.loadLastJson();
  }

}
