import { Component, OnInit } from '@angular/core';
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
import { Student } from '../models/student.model';
import { MyTask } from '../models/task.model';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { Select } from 'primeng/select';
import { PipesModule } from '../pipes/pipes.modules';

@Component({
  selector: 'app-my-tasks',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, TagModule, ConfirmDialogModule, ToastModule,
    InputTextModule, TextareaModule, DialogModule, FormsModule, Select, PipesModule
  ],
  providers: [ConfirmationService, MessageService],
  templateUrl: './my-tasks.component.html',
  styleUrl: './my-tasks.component.css'
})
export class MyTasksComponent implements OnInit {

    studentList: Student[] = [];
    newTaskVisible = false;

    titleTask: string = '';
    descriptionTask: string = '';

    selectedTask: MyTask | undefined;

    constructor(private studentService: StudentService, private confirmationService: ConfirmationService, 
      private messageService: MessageService) {}
  
    ngOnInit() {
      this.loadStudent(-1);
    }

    loadStudent(id: number) {
      this.studentService.getStudentById(id).subscribe((data) => {
        this.studentList = data;      
      });
    }

    // Parte de TASKS

    onClickCreateTask() {
      this.newTaskVisible = true;
    }

    onClickEditTask(item: MyTask) {
      this.titleTask = item.title
      this.descriptionTask = item.description
      this.selectedTask = item;
      this.newTaskVisible = true;
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
    }

    // llamadas a servicios

    createTask() {   
      const task: MyTask = {
        id: 0,
        title: this.titleTask,
        description: this.descriptionTask,
        student_id: -1,
        confirmed: 0
      }

      this.studentService.createTask(task).subscribe((response) => {
        console.log('Event created in database', response);
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Task Created' });
        this.loadStudent(-1);
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
        this.loadStudent(-1);
      }, (error) => {
        console.error('Error updating event in database', error);
      });
      // limpieza
      this.newTaskVisible = false;
    }

    deleteTask(task: MyTask) {
      this.studentService.deleteTask(task).subscribe(() => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Task deleted' });
        this.loadStudent(-1);
      });
    }

}
