import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { AboutPage } from '../pages/about/about';
import { ContactPage } from '../pages/contact/contact';
import { HomePage } from '../pages/home/home';
import { TabsPage } from '../pages/tabs/tabs';
import { OfferPage } from '../pages/offer/offer';
import { OffersListPage } from '../pages/offers-list/offers-list';
import { ServicePage } from '../pages/service/service';
import { AdministratorPage } from '../pages/administrator/administrator';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { JsonService } from '../providers/json-service';

import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    TabsPage,
    OfferPage,
    OffersListPage,
    ServicePage,
    AdministratorPage
  ],
  imports: [
    SuperTabsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    ContactPage,
    HomePage,
    OfferPage,
    OffersListPage,
    ServicePage,
    AdministratorPage,
    TabsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    JsonService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
