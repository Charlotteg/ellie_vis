import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { selectAll, select, selection } from 'd3-selection';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, Validators, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  selectedObj = 'All';
  filterForm: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.filterForm = this.fb.group({
      selectedObj: 'All'
    });

    this.onChanges();
  }

  onChanges(): void {
    this.filterForm.get('selectedObj').valueChanges
      .debounceTime(1000)
      .distinctUntilChanged()
      .subscribe(val => {
        if (val && val !== this.selectedObj) {
          console.log(val);
          selectAll('.dot').style('opacity', function(d) {
            if (val !== 'All') {
              if (d.Filter !== val) {
                return 0;
              } else {
                return 0.8;
              }
            } else {
              return 0.8;
            }
          });
          selectAll('.html-class').style('opacity', function(d) {
            const backgroundCircles = [13, 16, 17, 19, 20, 7, 26, 28, 29, 30];
            if (val !== 'All') {
              if (d.Filter !== val) {
                return 0;
              } else {
                return 1;
              }
            } else {
              if ( backgroundCircles.indexOf(+d.id) === -1) {
                return 1;
              } else {
                return 0;
              }
            }
          });

          this.selectedObj = val;
        }
      });
  }

}
