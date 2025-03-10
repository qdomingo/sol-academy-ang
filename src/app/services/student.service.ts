import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { MyTask } from '../models/task.model';
import { environment } from '../../environments/environment';
import { Payment } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  baseUrl = environment.baseUrl;
  private resourceStudentUrl = this.baseUrl + 'api/students';

  constructor(private http: HttpClient) { }

  // Student services
  
  getStudentList(): Observable<Student[]> {
    const studentList = this.http.get<Student[]>(`${this.resourceStudentUrl}/getAll`);
    return studentList;
  }

  getStudentById(id: number): Observable<Student[]> {
    const studentList = this.http.get<Student[]>(`${this.resourceStudentUrl}/getStudentById/${id}`);
    return studentList;
  }

  addStudent(student: Student): Observable<any> {    
    return this.http.post(`${this.resourceStudentUrl}/createStudent`, student);
  }
  
  updateStudent(student: Student): Observable<any> {
    return this.http.post(`${this.resourceStudentUrl}/updateStudent`, student);
  }

  deleteStudent(id: number): Observable<any> {
    return this.http.post(`${this.resourceStudentUrl}/deleteStudent`, id);     
  }

  // Task services

  createTask(task: MyTask): Observable<any> {    
    return this.http.post(`${this.resourceStudentUrl}/createTask`, task);
  }
  
  updateTask(task: MyTask): Observable<any> {
    return this.http.post(`${this.resourceStudentUrl}/updateTask`, task);
  }

  deleteTask(id: number): Observable<any> {
    return this.http.post(`${this.resourceStudentUrl}/deleteTask`, id);     
  }

  // Payment services
  getPaymentsByStudentId(id: number): Observable<Payment[]> {
    const paymentList = this.http.get<Payment[]>(`${this.resourceStudentUrl}/getPaymentsByStudentId/${id}`);
    return paymentList;
  }

  updatePayment(payment: Payment): Observable<any> {
    return this.http.post(`${this.resourceStudentUrl}/updatePayment`, payment);
  }
  
}
