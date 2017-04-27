import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { OfferFormPage } from '../pages/offer-form/offer-form';
import { OffersListPage } from '../pages/offers-list/offers-list';
import { ServicePage } from '../pages/service/service';
import { PaymentPage } from '../pages/payment/payment';
import { AdministratorPage } from '../pages/administrator/administrator';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';

import { JsonService } from '../providers/json-service';
import { DatabaseService } from '../providers/database-service';
import { FileService } from '../providers/file-service';

import { MultipleCheckboxComponent } from '../components/multiple-checkbox/multiple-checkbox';

@NgModule({
  declarations: [
    MyApp,
    OfferFormPage,
    OffersListPage,
    ServicePage,
    PaymentPage,
    MultipleCheckboxComponent,
    AdministratorPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PaymentPage,
    OfferFormPage,
    OffersListPage,
    ServicePage,
    AdministratorPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    JsonService,
    DatabaseService,
    FileService,
    BarcodeScanner,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
