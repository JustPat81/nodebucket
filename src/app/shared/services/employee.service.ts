// Title: employee.service.ts
// Author: Prof. Krasso
// Date: 15 January 2023
// Modified By: Patrick Wolff
// Attribution: WEB450 Live Meetings

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  findEmployeeById(empId: number): Observable<any> {
    return this.http.get('/api/employees/' + empId);
  }
}
