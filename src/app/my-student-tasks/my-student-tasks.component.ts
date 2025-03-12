import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../services/schedule.service';
import { StudentService } from '../services/student.service';
import { ConfirmationService } from 'primeng/api';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Schedule } from '../models/schedule.model';
import { Student } from '../models/student.model';
import { MyTask } from '../models/task.model';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';


@Component({
  selector: 'app-my-student-tasks',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, TagModule, ConfirmDialogModule, ToastModule,
    InputTextModule, TextareaModule, DialogModule, FormsModule, Select
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './my-student-tasks.component.html',
  styleUrl: './my-student-tasks.component.css'
})
export class MyStudentTasksComponent implements OnInit {

    listShcedule: Schedule[] = [];
    filteredlistShcedule: Schedule[] = [];
    studentList: Student[] = [];
    newTaskVisible = false;
    titleTask: string = '';
    descriptionTask: string = '';
    selectedTask: MyTask | undefined;
    selectedSchedule: Schedule | undefined;

    constructor(private scheduleService: ScheduleService, private studentService: StudentService,
      private confirmationService: ConfirmationService, private messageService: MessageService,
      private route: ActivatedRoute, private router: Router) {}
  
    ngOnInit() {
      // this.loadStudent(this.route.snapshot.params['id']);
      this.loadScheduleList(this.route.snapshot.params['id']);
    }

    loadStudent(id: number) {
      this.studentService.getStudentById(id).subscribe((data) => {
        this.studentList = data;
        console.log('Student loaded', this.studentList);

        // Asignar el valor de schedule.inicio a schedule_date en las tareas
        this.studentList.forEach((student: Student) => {
          if (student.tasks && student.tasks.length > 0) {
            student.tasks.forEach((task: MyTask) => {
                const schedule = this.listShcedule.find(s => s.id === task.schedule_id);
                if (schedule) {
                  task.schedule_date = schedule.inicio;
                }
            });
          }
        });
        
      });
    }

    loadScheduleList(id: number) {
      this.scheduleService.getScheduleByStudentId(id).subscribe((data) => {
        this.listShcedule = data.map(schedule => {
          schedule.id = schedule.id;
          schedule.title = schedule.title;
          schedule.student_id = schedule.student_id;
          schedule.outdated = new Date(schedule.fin) < new Date();
          schedule.inicio = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            //second: 'numeric'
          }).format(new Date(schedule.inicio));
          schedule.fin = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric'
          }).format(new Date(schedule.fin));
          return schedule;
        });
        this.loadStudent(this.route.snapshot.params['id']);
      });
    }

    onClickDeleteSchedule(id: number) {

      this.confirmationService.confirm({
        message: 'Do you want to delete this record?',
        header: 'Delete Schedule',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectButtonProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true,
        },
        acceptButtonProps: {
            label: 'Delete',
            severity: 'danger',
        },
  
        accept: () => {
          this.deleteSchedule(id); 
        },
        reject: () => {
            // No action
        },
    });
      
    }
    
    deleteSchedule(id: number) {
      this.scheduleService.deleteSchedule(id).subscribe((response) => {
        console.log('Event deleted from database', response);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Schedule deleted' });
        this.loadScheduleList(this.route.snapshot.params['id']);
      }, (error) => {
        console.error('Error deleting event from database', error);
      });
    }

    // Parte de TASKS

    onClickCreateTask() {
      this.newTaskVisible = true;
      // cargar filteredlistShcedule
      this.filteredlistShcedule = this.listShcedule.filter((schedule) => {
        return !schedule.task_id; 
      });
    }

    onClickEditTask(item: MyTask) {
      this.titleTask = item.title
      this.descriptionTask = item.description
      this.selectedTask = item;
      if(this.selectedTask.schedule_id) {
        this.listShcedule.filter((schedule)=> {
          if(this.selectedTask && schedule.id === this.selectedTask.schedule_id) {
            this.selectedSchedule = schedule;
          }
        })
      }
      this.newTaskVisible = true;
      // cargar filteredlistShcedule
      this.filteredlistShcedule = this.listShcedule.filter((schedule) => {
        return !schedule.task_id;
      })
    }

    saveTask() {
      if(this.selectedTask) {
        this.selectedTask.title = this.titleTask;
        this.selectedTask.description = this.descriptionTask;
        this.updateTask(this.selectedTask);
      } else {
        this.createTask();
      }
    }

    onClickChangeTask(item: MyTask) {

      if(item.confirmed === 1) {
        item.confirmed = 0;
      } else {
        item.confirmed = 1;
      }
      this.updateTask(item);
    }

    onClickDeleteTask(item: MyTask) {
      this.confirmationService.confirm({
          message: 'Do you want to delete this record?',
          header: 'Delete Task',
          icon: 'pi pi-info-circle',
          rejectLabel: 'Cancel',
          rejectButtonProps: {
              label: 'Cancel',
              severity: 'secondary',
              outlined: true,
          },
          acceptButtonProps: {
              label: 'Delete',
              severity: 'danger',
          },
  
          accept: () => {
            this.deleteTask(item);
          },
          reject: () => {
              // No action
          },
      });
    }

    // onHide
    onHide () {
      this.newTaskVisible = false;
      this.titleTask = '';
      this.descriptionTask = '';
      this.selectedTask = undefined;
      this.selectedSchedule = undefined;
    }

    // select button para seleccionar clase
    onChangeSelectSchedule() {
      
      if(this.selectedTask && this.selectedSchedule) {
        this.selectedTask.schedule_id = this.selectedSchedule.id;
      }
      console.log(this.selectedTask);
      
    }

    // llamadas a servicios

    createTask() {

      const task: MyTask = {
        id: 0,
        title: this.titleTask,
        description: this.descriptionTask,
        student_id: this.route.snapshot.params['id'],
        confirmed: 0
      }

      if(this.selectedSchedule) {
        task.schedule_id = this.selectedSchedule.id;
      }

      this.studentService.createTask(task).subscribe((response) => {
        console.log('Event created in database', response);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Task Created' });
        this.loadStudent(this.route.snapshot.params['id']);
        this.loadScheduleList(this.route.snapshot.params['id']);
      }, (error) => {
        console.error('Error creating event in database', error);
      });
      // limpieza campos
      this.newTaskVisible = false;
    }

    updateTask(item: MyTask) {
      this.studentService.updateTask(item).subscribe((response) => {
        console.log('Event updated in database', response);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Task Updated' });
        this.loadStudent(this.route.snapshot.params['id']);
        this.loadScheduleList(this.route.snapshot.params['id']);
      }, (error) => {
        console.error('Error updating event in database', error);
      });
      // limpieza
      this.newTaskVisible = false;
    }

    deleteTask(task: MyTask) {
      this.studentService.deleteTask(task).subscribe(() => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Task deleted' });
        this.loadStudent(this.route.snapshot.params['id']);
        this.loadScheduleList(this.route.snapshot.params['id']);
      });
    }

    back() {
      this.router.navigateByUrl('/students');
    }
}
