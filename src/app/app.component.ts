import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { MyStudentsComponent } from './my-students/my-students.component';
import { MyResourcesComponent } from './my-resources/my-resources.component';
import { MyStudentFormComponent } from './my-student-form/my-student-form.component';
import { MyStudentTasksComponent } from './my-student-tasks/my-student-tasks.component';
import { MyStudentPaymentsComponent } from './my-student-payments/my-student-payments.component';
import { LoginComponent } from './login/login.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuItem } from 'primeng/api';
import { AuthService } from './services/auth.service'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, MyCalendarComponent, MyStudentsComponent, MyResourcesComponent,
    MyStudentFormComponent, MyStudentTasksComponent, MyStudentPaymentsComponent, LoginComponent,
    MyTasksComponent,
    PanelMenuModule
  ],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  itemsMenu: MenuItem[] = []; 

  constructor(private authService: AuthService) {}
  
  ngOnInit() { 
      this.itemsMenu = [ 
          { 
              label:  'Schedule',
              escape: false,
              routerLink: '/calendar'
          }, 
          { 
              label:  'Students',  
              escape: false,
              routerLink: '/students'
          },
          { 
            label:  'Resources',  
            escape: false,
            routerLink: '/resources'
          },
          { 
            label:  'My Tasks',  
            escape: false,
            routerLink: '/myTasks'
          },
          { 
            label:  'Login',  
            escape: false,
            routerLink: '/login'
          }
      ]; 
  } 
}
