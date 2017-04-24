import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { TabsPage } from '../pages/tabs/tabs';
import { OfferFormPage } from '../pages/offer-form/offer-form';
import { OffersListPage } from '../pages/offers-list/offers-list';
import { ServicePage } from '../pages/service/service';
import { AdministratorPage } from '../pages/administrator/administrator';
import { DatabasePage } from '../pages/database/database';
import { PaymentPage } from '../pages/payment/payment';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { JsonService } from '../providers/json-service';
import { DatabaseService } from '../providers/database-service';
import { FileService } from '../providers/file-service';

import { SuperTabsModule } from 'ionic2-super-tabs';

import { MultipleCheckboxComponent } from '../components/multiple-checkbox/multiple-checkbox';

@NgModule({
  declarations: [
    MyApp,
    TabsPage,
    OfferFormPage,
    OffersListPage,
    ServicePage,
    AdministratorPage,
    DatabasePage,
    PaymentPage,
    MultipleCheckboxComponent
  ],
  imports: [
    SuperTabsModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PaymentPage,
    OfferFormPage,
    OffersListPage,
    ServicePage,
    AdministratorPage,
    TabsPage,
    DatabasePage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    JsonService,
    DatabaseService,
    FileService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
