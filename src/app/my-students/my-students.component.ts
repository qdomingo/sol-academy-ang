import { Component, OnInit } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { Student } from '../models/student.model';
import { StudentService } from '../services/student.service';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { SelectButtonModule } from 'primeng/selectbutton';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-my-students',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, TooltipModule, ConfirmDialogModule, 
    ToastModule, SelectButtonModule, FormsModule],
  providers: [ConfirmationService, MessageService],
  templateUrl: './my-students.component.html',
  styleUrl: './my-students.component.css'
})
export class MyStudentsComponent implements OnInit {

  studentList: Student[] = [];
  stateOptions: any[] = [{ label: 'List', value: 'list' },{ label: 'Expanded', value: 'expanded' }];
  value: string = 'list';

  constructor(private studentService: StudentService, private router: Router,
    private confirmationService: ConfirmationService, private messageService: MessageService) { }

  ngOnInit() {
    this.loadStudentList();
  }

  loadStudentList() {
    this.studentService.getStudentList().subscribe((data) => {
      this.studentList = data;
    });
  }

  addStudent() {
    this.router.navigateByUrl('/studentForm');
  }

  updateStudent(id: number) {
    this.router.navigateByUrl('/studentForm/' + id);
  }

  loadStudentPayments(id: number) {
    this.router.navigateByUrl('/studentPayments/' + id);
  }

  loadStudentTasks(id: number) {
    this.router.navigateByUrl('/studentTasks/' + id);
  }

  loadStudentResources(id: number) {
    this.router.navigateByUrl('/resources/' + id);
  }

  deleteStudent(id: number) {
    this.studentService.deleteStudent(id).subscribe(() => {
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Student deleted' });
      this.loadStudentList();
    });
  }

  confirm(event: Event, id: number) {
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Do you want to delete this record?',
        header: 'Delete Student',
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
          this.deleteStudent(id);
        },
        reject: () => {
            // No action
        },
    });
  }

}
