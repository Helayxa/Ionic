import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { JsonService } from '../../providers/json-service';

@Component({
  selector: 'page-jsonDownload',
  templateUrl: 'JsonDownload.html'
})

export class JsonDownloadPage {
  url: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private jsonService: JsonService) {

  }

  urlVerifications()
  {

  }
}
