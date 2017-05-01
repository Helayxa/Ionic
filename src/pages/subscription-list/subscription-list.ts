import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Chart } from 'chart.js';

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

  @ViewChild('subscriptionDetailsCanvas') subscriptionDetailsCanvas;
  suscriptionDetailsChart: any;

  @ViewChild('tendencyCanvas') tendencyCanvas;
  tendencyChart: any;

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad()
  {
    this.paymentWayChart = new Chart(this.paymentWayCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: ['PayPal', 'Carte de crédit', 'Virement bancaire'],
        datasets: [{
          label: 'Moyens de paiement',
          data: [10, 50, 40],
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ],
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56"
          ]
        }]
      },
      options: {
        legend: {
          position: 'bottom'
        }
      }
    });
    this.suscriptionDetailsChart = new Chart(this.subscriptionDetailsCanvas.nativeElement, {
      type: 'bar',
      data: {
        labels: ['Offre 1', 'Offre 2', 'Offre 3', 'Offre 4'],
        datasets: [{
          label: 'Nombre de suscription par offre',
          data: [10, 50, 25, 15],
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)'
          ],
          hoverBackgroundColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
          ]
        }]
      },
      options: {
        legend: {
          position: 'bottom'
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true
            }
          }]
        }
      }
    });
    this.tendencyChart = new Chart(this.tendencyCanvas.nativeElement, {
      type: 'line',
      data: {
        labels:['Free', 'SFR', 'Orange', 'Canal+'],
        datasets: [{
          label:'nombre de suscription',
          data: [{
              y: 120,
              x: 1
            },
            {
              y: 52,
              x: 2
            },
            {
              y: 684,
              x: 3
            },
            {
              y: 452,
              x: 4
            }
          ],
          backgroundColor:"#FF6384",
          hoverBackgroundColor: "#FF6384"
        }]
      },
      options: {
        scales: {
            xAxes: [{
                type: 'linear',
                position: 'bottom'
            }]
        }
      }
    });
  }
}
