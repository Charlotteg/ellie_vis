import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';

import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'app';
  bioData: any;

  constructor(
    private dataservice: DataService,
  ) { }

  ngOnInit() {
    // get the list of offices with lat longs
    this.dataservice.getData().take(1).subscribe((data: Array<any>) => {
      const newData = data.sort(this.order);
      console.log(newData);
      // const indexedData = newData.map((d) => {
      //   const index = newData.indexOf(d);
      //   console.log(index);
      //   d.index = index;
      //   return d;
      // });
      this.bioData = newData;
    });
  }

  order(a, b) {
    return +b.Population - +a.Population;
  }


}
