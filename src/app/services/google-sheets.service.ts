import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class GoogleSheetsService {

  constructor(private http: HttpClient) {
  }

  saveToSheet(data: any): Observable<any> {
    return this.http.post('http://127.0.0.1:5000/save', data);
  }
}
