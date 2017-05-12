import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { DatabaseService } from '../../providers/database-service';
import { JsonService } from '../../providers/json-service';
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

  @ViewChild('moneyByOffersCanvas') moneyByOffersCanvas;
  moneyByOffersChart: any;

  private hash: string;
  private json: any;
  private subs: any;

  public nbSouscription: number;
  public totalPaid: number;
  public n_offersArray: number[];
  public s_offersArray: String[];
  public n_pricePaidArray: number[];
  public n_paymentWayArray: number[];
  public s_paymentWayArray: String[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseService: DatabaseService, private jsonService: JsonService, public toastCtrl: ToastController) {
    this.hash = navParams.get('hash');
    this.json = navParams.get('json');
    this.s_offersArray = [];
    this.n_offersArray = [];
    this.n_pricePaidArray = [];
    this.n_paymentWayArray = [];
    this.totalPaid = 0;
  }

  ionViewWillEnter() {
    for(let i=0; i<this.json.offers.length; i++){
      this.s_offersArray[i] = this.json.offers[i].title;
      this.n_offersArray[i] = 0;
      this.n_pricePaidArray[i] = 0;
    }
    this.s_paymentWayArray = this.json.paymentWays;
    for(let i=0; i<this.s_paymentWayArray.length; i++){
      this.n_paymentWayArray[i] = 0;
    }
    this.databaseService.findAllSubscriptions(this.hash).then(data => {
      console.log(data);
      this.nbSouscription = data.length;
      for(let i=0; i<data.length; i++){
        this.n_offersArray[data[i].selectedOffer.id] += 1;
        this.n_pricePaidArray[data[i].selectedOffer.id] += data[i].pricePaid;
        this.totalPaid += data[i].pricePaid;
        this.n_paymentWayArray[data[i].selectedOffer.id] += 1;
      }
      this.generateDetailsChart();
      this.generateMoneybyOffersChart();
      this.generatePaymentWayChart();
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
             'rgba(75, 192, 192, 0.2)',
             'rgba(153, 102, 255, 0.2)',
             'rgba(255, 159, 64, 0.2)'
          ],
          hoverBackgroundColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
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

  generateMoneybyOffersChart(): void{
    this.moneyByOffersChart = new Chart(this.moneyByOffersCanvas.nativeElement, {
      type: 'horizontalBar',
      data: {
        labels: this.s_offersArray,
        datasets: [{
          data: this.n_pricePaidArray,
          backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)',
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'

          ],
          hoverBackgroundColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)',
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'

          ]
        }]
      },
      options: {
        scales: {
          xAxes: [{
            ticks: {
              beginAtZero: true,
              stepSize: 20
            }
          }]
        },
        title:{
          display: true,
          text: 'Gain par offres en €'
        },
        legend:{
          display: false
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }

  generatePaymentWayChart(): void{
    this.paymentWayChart = new Chart(this.paymentWayCanvas.nativeElement, {
      type: 'doughnut',
      data: {
        labels: this.s_paymentWayArray,
        datasets: [{
          label: 'Moyens de paiement',
          data: this.n_paymentWayArray,
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
        title:{
          display: true,
          text: 'Repartition des moyens de paiement'
        },
        legend: {
          position: 'bottom'
        }
      }
    });
  }

  exportAllSubscriptions(): void{
    this.databaseService.findAllSubscriptions(this.hash).then(data => {
      console.log("*************************** Version String ***************************");
      console.log(JSON.stringify(data));

      this.toastCtrl.create({
        message: 'Données enregistrées dans le fichier',
        duration: 2000
      }).present();
    }).catch(error => {
      console.log(error);
    });


  }
}
