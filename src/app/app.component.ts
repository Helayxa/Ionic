import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { DatabaseService } from '../providers/database-service';
import { JsonService } from '../providers/json-service';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private databaseService: DatabaseService, private jsonService: JsonService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      this.databaseService.createServiceFilesTableIfNotExists();
      this.databaseService.getLastJson().then(json => {
        console.log(json);
        this.jsonService.setServiceData(JSON.parse(json));
      }).catch(error => {
        console.log(error);
      });

      splashScreen.hide();

    });

  }
}
