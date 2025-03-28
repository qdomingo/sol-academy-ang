import { Routes } from '@angular/router';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { MyStudentsComponent } from './my-students/my-students.component';
import { MyResourcesComponent } from './my-resources/my-resources.component';
import { MyStudentFormComponent } from './my-student-form/my-student-form.component';
import { MyStudentTasksComponent } from './my-student-tasks/my-student-tasks.component';
import { MyStudentPaymentsComponent } from './my-student-payments/my-student-payments.component';
import { LoginComponent } from './login/login.component';
import { MyTasksComponent } from './my-tasks/my-tasks.component';

export const routes: Routes = [
    {
        path: '',
        // redirectTo: 'calendar',
        redirectTo: '/login', 
        pathMatch: 'full'
    },
    { 
        path: 'login', 
        component: LoginComponent 
    },
    {
        path: 'calendar',
        component: MyCalendarComponent,
    },
    {
        path: 'students',
        component: MyStudentsComponent,
    },
    {
        path: 'resources',
        component: MyResourcesComponent,
    },
    {
        path: 'resources/:id',
        component: MyResourcesComponent,
    },
    {
        path: 'studentForm',
        component: MyStudentFormComponent,
    },
    {
        path: 'studentForm/:id',
        component: MyStudentFormComponent,
    },
    {
        path: 'studentTasks/:id',
        component: MyStudentTasksComponent,
    },
    {
        path: 'myTasks',
        component: MyTasksComponent,
    },
    {
        path: 'studentPayments/:id',
        component: MyStudentPaymentsComponent,
    }
];
