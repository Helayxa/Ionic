import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Chart } from 'chart.js';

import { DatabaseService } from '../../providers/database-service';

/*
  Generated class for the SubscriptionList page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-subscription-list',
  templateUrl: 'subscription-list.html'
})
export class SubscriptionListPage {

  @ViewChild('paymentWayCanvas') paymentWayCanvas;
  paymentWayChart: any;

  private hash: string;
  private json: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseService: DatabaseService) {
    this.hash = navParams.get('hash');
    this.json = navParams.get('json');
  }

  ionViewWillEnter() {
    this.databaseService.findAllSubscriptions(this.hash).then(data => {
      console.log(data);
    }).catch(error => {
      console.log(error);
    });
  }

  ionViewDidLoad()
  {
    this.paymentWayChart = new Chart(this.paymentWayCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['PayPal', 'Carte de crédit', 'Virement bancaire'],
        datasets: [{
          label: 'Moyens de paiement',
          data: ["10", "50", "40"],
          backgroundColor: [
            'rgb(244,67,54)',
            'rgb(33,150,243)',
            'rgb(238,238,238)'
          ],
          hoverBackgroundColor: [
            '#d32f2f',
            'rgb(25,118,210)',
            'rgb(238,238,238)'
          ]
        }]
      },
      options: {
        legend: {
          position: 'bottom'
        }
      }
    });
  }
}
