import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

@Injectable()
export class FileService {

  constructor(public http: Http) {

  }

}
