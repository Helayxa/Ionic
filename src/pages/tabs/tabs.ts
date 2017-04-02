import { Component } from '@angular/core';

import { ServicePage } from '../service/service';
import { OffersListPage } from '../offers-list/offers-list';
import { AdministratorPage } from '../administrator/administrator';
//import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  serviceTab: any = ServicePage;
  offersListTab: any = OffersListPage;
  administratorTab: any = AdministratorPage;

  constructor() {

  }
}
