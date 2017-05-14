import { Component, ViewChild } from '@angular/core';
import { File } from '@ionic-native/file';
import { NavController, NavParams, ToastController, AlertController } from 'ionic-angular';
import { DatabaseService } from '../../providers/database-service';
import { JsonService } from '../../providers/json-service';
import { Chart } from 'chart.js';

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

  public nbSouscription: number;
  public totalPaid: number;
  public n_offersArray: number[];
  public s_offersArray: string[];
  public n_pricePaidArray: number[];
  public n_paymentWayArray: number[];
  public s_paymentWayArray: string[];

  constructor(public navCtrl: NavController, public navParams: NavParams, private databaseService: DatabaseService, private jsonService: JsonService, public toastCtrl: ToastController, private file: File, private alertCtrl: AlertController) {
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
        let paymentWayId = this.findPaymentWayId(data[i].paymentWay);
        if(paymentWayId !== -1) {
          this.n_paymentWayArray[paymentWayId] += 1;
        }
      }
      console.log(this.n_paymentWayArray);
      this.generateDetailsChart();
      this.generateMoneybyOffersChart();
      this.generatePaymentWayChart();
    }).catch(error => {
      console.log(error);
    });
  }

  findPaymentWayId(paymentWay: string): number {
    for(let i = 0; i < this.s_paymentWayArray.length; i++) {
      if(this.s_paymentWayArray[i] === paymentWay) {
        return i;
      }
    }
    return -1;
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
      console.log("*************************** Enregistrement dans fichier ***************************");

      this.file.writeFile(this.file.externalRootDirectory, Date.now() + ".json", JSON.stringify(data), true)
      .then(
        ok => {
          console.log('Fichier créé : ' + this.file.externalRootDirectory);
          this.toastCtrl.create({
            message: 'Fichier enregistré dans le dossier racine de la mémoire du téléphone.',
            duration: 2000
          }).present();
        }
      ).catch(
        err => {
          console.log('Erreur de création du fichier');
          this.alertCtrl.create({
            title: 'Création fichier',
            subTitle: 'Impossible de créer le fichier d\'export',
            buttons: ['Fermer']
          }).present();
        }
      );
    }).catch(error => {
      this.alertCtrl.create({
        title: 'Récupération données',
        subTitle: 'Impossible de récupérer les données de la base',
        buttons: ['Fermer']
      }).present();
      console.log(error);
    });
  }
}
