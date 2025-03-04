import { Routes } from '@angular/router';
import { MyCalendarComponent } from './my-calendar/my-calendar.component';
import { MyStudentsComponent } from './my-students/my-students.component';
import { MyResourcesComponent } from './my-resources/my-resources.component';
import { MyStudentFormComponent } from './my-student-form/my-student-form.component';
import { MyStudentTasksComponent } from './my-student-tasks/my-student-tasks.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'calendar',
        pathMatch: 'full'
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
    }
];
