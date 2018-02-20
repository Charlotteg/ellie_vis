import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Http, Response } from '@angular/http';
import { nest } from 'd3-collection';
import { PapaParseService } from 'ngx-papaparse';

import 'rxjs/add/operator/map';

@Injectable()
export class DataService {
  private dataUrl = 'assets/data_180219.csv';

  constructor(private http: Http, private papa: PapaParseService) { }

  getData(): Observable<any> {
    return this.http
                .get(this.dataUrl)
                .map( res => {
                  const results = this.papa.parse(res['_body'] || '', { header: true }).data;
                  const filteredResults = results.filter(function(d){
                    return d.id !== '';
                  });

                  return filteredResults;
                });
  }

}
