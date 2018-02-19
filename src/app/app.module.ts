import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ClarityModule } from '@clr/angular';
import { DataService } from './services/data.service';
import { HttpModule, JsonpModule } from '@angular/http';
import { PapaParseModule } from 'ngx-papaparse';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { ChartComponent } from './chart/chart.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ChartComponent
  ],
  imports: [
    BrowserModule,
    ClarityModule,
    HttpModule,
    PapaParseModule,
    ReactiveFormsModule,
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
