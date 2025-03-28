import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Student } from '../models/student.model';
import { MessageService } from 'primeng/api';
import { StudentService } from '../services/student.service';


@Component({
  selector: 'app-my-student-form',
  standalone: true,
  imports: [    
    CommonModule,
    ReactiveFormsModule,
    InputTextModule,
    ButtonModule,
    TextareaModule,
    ToastModule],
  providers: [MessageService],
  templateUrl: './my-student-form.component.html',
  styleUrl: './my-student-form.component.css'
})

export class MyStudentFormComponent implements OnInit {
  studentForm: FormGroup = new FormGroup({});
  studentList: Student[] = [];

  constructor(private fb: FormBuilder, private route: ActivatedRoute, 
    private messageService: MessageService, private router: Router, 
    private studentService: StudentService) {}

  ngOnInit() {
    this.studentForm = this.fb.group({
      nickname: ['', Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rate: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      comments: ['']
    });
    if (this.route.snapshot.params['id']) {
      this.loadStudent(this.route.snapshot.params['id'])
    }
    
  }

  onSubmit() {
    if (this.studentForm.valid) {
      if (this.studentList[0] && this.studentList[0].id) {
        const form = this.studentForm.value;
        const student: Student = {
          id: this.studentList[0].id,
          nickname: form.nickname,
          name: form.name, 
          email: form.email,
          comments: form.comments,
          rate: form.rate,
          tasks: []
        }
        this.studentService.updateStudent(student).subscribe(() => {
          console.log('Student updated');
          this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Student updated' });
        });
      } else {
        const form = this.studentForm.value;
        const student: Student = {
          id: 0,
          nickname: form.nickname,
          name: form.name, 
          email: form.email,
          comments: form.comments,
          rate: form.rate,
          tasks: []
        }
        this.studentService.addStudent(student).subscribe(() => {
          console.log('Student added');
          this.router.navigateByUrl('/students');
        });
      }
    }
  }

  loadStudent(id: number) {
    this.studentService.getStudentById(id).subscribe((data) => {
      this.studentList = data;
      this.studentForm.patchValue(this.studentList[0]);
    });
  }

  back() {
    this.router.navigateByUrl('/students');
  }
}