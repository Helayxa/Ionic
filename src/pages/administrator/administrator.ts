import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { JsonDownloadPage } from '../jsonDownload/jsonDownload';

@Component({
  selector: 'page-administrator',
  templateUrl: 'administrator.html'
})

export class AdministratorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {

  }

  goToJsonPage()
  {
    this.navCtrl.push(JsonDownloadPage, );
  }

}
