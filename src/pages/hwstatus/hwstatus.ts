import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Chart } from 'chart.js';

declare var chrome: any;

@Component({
  selector: 'page-hwstatus',
  templateUrl: 'hwstatus.html'
})
export class HwstatusPage {

  @ViewChild('cpuCanvas') cpuCanvas;

  cpuChart: any;

  public cpuUsage: number;
  public ramUsage: number;

  constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {

  }

  ionViewWillEnter() {
    this.reloadData();
  }

  onRefreshButtonClicked() {
    this.toastCtrl.create({
      message: 'Actualisation des données',
      duration: 2000
    }).present();
    this.reloadData();
  }

  reloadData() {
    chrome.system.cpu.getInfo(info => {
      let userTime: number = 0;
      let kernelTime: number = 0;
      let idleTime: number = 0;
      let totalTime: number = 0;
      for(let i=0; i<info.numOfProcessors; i++) {
        userTime   += info.processors[i].usage.user;
        kernelTime += info.processors[i].usage.kernel;
        idleTime   += info.processors[i].usage.idle;
        totalTime  += info.processors[i].usage.total;
      }

      let userPercentage = Math.round((userTime / totalTime * 100) * 100) / 100;
      let kernelPercentage = Math.round((kernelTime / totalTime * 100) * 100) / 100;
      let idlePercentage = Math.round((idleTime / totalTime * 100) * 100) / 100;

      this.cpuUsage = Math.round((userPercentage + kernelPercentage) * 100) / 100;
      this.cpuChart = new Chart(this.cpuCanvas.nativeElement, {
        type: 'doughnut',
        data: {
          labels: ['Kernel', 'User', 'Idle'],
          datasets: [{
            label: 'Utilisation CPU',
            data: [kernelPercentage, userPercentage, idlePercentage],
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
    });

    chrome.system.memory.getInfo(info => {
      console.log(info);

      let conversionValue: number = 1073741824;
      let totalCapacity: number = info.capacity / conversionValue;
      let freeSpace: number = info.availableCapacity / conversionValue;
      let busySpace: number = totalCapacity - freeSpace;
      let percentUse: number = (busySpace * 100 ) / totalCapacity;

      percentUse = Math.round(percentUse * 100) / 100;
      totalCapacity = Math.round(totalCapacity * 100) / 100;
      freeSpace = Math.round(freeSpace * 100) / 100;
      busySpace = Math.round(busySpace * 100) / 100;

      this.ramUsage = percentUse;
    });
  }

}
