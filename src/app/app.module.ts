import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {HeaderComponent} from './components/header/header.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {ToastModule} from "primeng/toast";
import {Lab1Component} from './components/lab1/lab1.component';
import {Lab2Component} from './components/lab2/lab2.component';
import {MessageService} from "primeng/api";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {CardModule} from "primeng/card";
import {ButtonModule} from "primeng/button";
import {InputTextModule} from "primeng/inputtext";
import {StyleClassModule} from "primeng/styleclass";
import {ReactiveFormsModule} from "@angular/forms";
import {DialogModule} from "primeng/dialog";
import {TableModule} from "primeng/table";
import {GoogleSheetsService} from "./services/google-sheets.service";
import {HttpClientModule} from "@angular/common/http";
import {FileUploadModule} from "primeng/fileupload";
import {ProgressSpinnerModule} from "primeng/progressspinner";

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    Lab1Component,
    Lab2Component,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    RouterLinkActive,
    RouterLink,
    ReactiveFormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ToastModule,
    CardModule,
    ButtonModule,
    InputTextModule,
    StyleClassModule,
    DialogModule,
    TableModule,
    FileUploadModule,
    ProgressSpinnerModule
  ],
  providers: [MessageService, GoogleSheetsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
