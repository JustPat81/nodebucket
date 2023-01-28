// Title:  home.component.ts
// Author: Prof. Krasso
// Date:   15 January 2023
// Modified By: Patrick Wolff
// Description: Home.component file for node bucket application

import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../shared/services/task.service';
import { CookieService } from 'ngx-cookie-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Employee } from 'src/app/shared/models/employee.interface';
import { Item } from '../../shared/models/item.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  employee: Employee;
  todo: Item[];
  done: Item[];
  empId: number;

  taskForm: FormGroup = this.fb.group({
    task: [null, Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(35)])]
  })

  constructor(private taskService: TaskService, private cookieService: CookieService, private fb: FormBuilder) {
    this.employee = {} as Employee;
    this.todo = [];
    this.done = [];

    this.empId = parseInt(this.cookieService.get('session_user'), 10);

    this.taskService.findAllTasks(this.empId).subscribe({
      next: (res) => {
        this.employee = res;

        console.log('--Response from the findAllTasks service call.--')
        console.log(this.employee);
      },
      error: (e) => {
        console.log(e.message);
      },
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;

        console.log('onComplete() method from the home.component.ts file, findAllTasks() service call.')
        console.log(this.todo);
        console.log(this.done);
      }
    })
   }

  ngOnInit(): void {
  }

  createTask() {
    const newTask = this.taskForm.controls['task'].value;

    this.taskService.createTask(this.empId, newTask).subscribe({
      next: (res) => {
        this.employee = res;

        console.log('--This is the response from the createTask service call.')
        console.log(res);
      },
      error: (e) => {
        console.log(e.message);
      },
      complete: () => {
        this.todo = this.employee.todo;
        this.done = this.employee.done;

        console.log('--onComplete method from the home.component.ts file, createTask() service call--')
        console.log(this.todo);
        console.log(this.done);

        this.taskForm.controls['task'].setErrors({'incorrect': false});
      }
    })
  }
}
