import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  constructor(private http: HttpClient) { }

  findEmployeeId(empId: number): Observable<any> {
    return this.http.get('/api/employees/' + empId);
  }
}
