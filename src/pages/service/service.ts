import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { JsonService } from '../../providers/json-service';

@Component({
  selector: 'page-service',
  templateUrl: 'service.html'
})
export class ServicePage {

  service: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private jsonService: JsonService) {}

  /* Récupère les données du fichier en faisant appel à la requête HTTP contenue dans le JsonService */
  ionViewDidLoad() {
    this.jsonService.getServiceFile().subscribe(
      data => {
        this.service = data;
      },
      error => {
        console.log("Erreur lors de la récupération du fichier");
      }
    );
  }

  onSwipe(swipe: any): void {
    // Renvoie à la tab de droite
    if(swipe.direction === 2) {
      this.navCtrl.parent.select(1);
    }
  }

}
