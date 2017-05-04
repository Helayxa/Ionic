import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DatabaseService } from '../../providers/database-service';
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

  private hash: string;
  private json: any;

  public nbSouscription: number;
  public n_offersArray: number[];
  public s_offersArray: String[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseService: DatabaseService) {
    this.hash = navParams.get('hash');
    this.json = navParams.get('json');
    this.s_offersArray = [];
    this.n_offersArray = [];
  }

  ionViewWillEnter() {
    for(let i=0; i<this.json.offers.length; i++){
      this.s_offersArray[i] = this.json.offers[i].title;
      this.n_offersArray[i] = 0;
    }

    this.databaseService.findAllSubscriptions(this.hash).then(data => {
      this.nbSouscription = data.length;
      for(let i=0; i<data.length; i++){
        this.n_offersArray[data[i].offerId] += 1;
      }
      this.generateDetailsChart();
    }).catch(error => {
      console.log(error);
    });
  }

  generateDetailsChart(): void{
    this.suscriptionDetailsChart = new Chart(this.subscriptionDetailsCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: this.s_offersArray,
        datasets: [{
          data: this.n_offersArray,
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
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 1
            }
          }]
        },
        title:{
          display: true,
          text: 'Nombre de souscription par offre'
        },
        legend:{
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
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
