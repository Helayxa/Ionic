import { Component } from '@angular/core';
import { NavController, NavParams} from 'ionic-angular';
import { JsonService } from '../../providers/json-service';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})
export class ServicePage {

  service: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService) {}

  ionViewWillEnter() {
    this.service = this.jsonService.getServiceData();
  }

}
