import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Student } from '../models/student.model';
import { MyTask } from '../models/task.model';
import { environment } from '../../environments/environment';
import { Payment } from '../models/payment.model';
import { CacheService } from './cache.service';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  baseUrl = environment.baseUrl;
  private resourceStudentUrl = this.baseUrl + 'api/students';

  constructor(private http: HttpClient, private cacheService: CacheService) { }

  // Student services no cahce
  
  // getStudentList(): Observable<Student[]> {
  //   const studentList = this.http.get<Student[]>(`${this.resourceStudentUrl}/getAll`);
  //   return studentList;
  // }

  // getStudentById(id: number): Observable<Student[]> {
  //   const studentList = this.http.get<Student[]>(`${this.resourceStudentUrl}/getStudentById/${id}`);
  //   return studentList;
  // }

  // addStudent(student: Student): Observable<any> {    
  //   return this.http.post(`${this.resourceStudentUrl}/createStudent`, student);
  // }
  
  // updateStudent(student: Student): Observable<any> {
  //   return this.http.post(`${this.resourceStudentUrl}/updateStudent`, student);
  // }

  // deleteStudent(id: number): Observable<any> {
  //   return this.http.post(`${this.resourceStudentUrl}/deleteStudent`, id);     
  // }

  // Student services
  
  getStudentList(): Observable<Student[]> {
    const cacheKey = 'studentList';
    const cachedData = this.cacheService.get(cacheKey);
    if (cachedData) {
      return of(cachedData);
    } else {
      return this.http.get<Student[]>(`${this.resourceStudentUrl}/getAll`).pipe(
        tap(data => this.cacheService.set(cacheKey, data))
      );
    }
  }

  getStudentById(id: number): Observable<Student[]> {
    const studentList = this.http.get<Student[]>(`${this.resourceStudentUrl}/getStudentById/${id}`);
    return studentList;
  }

  addStudent(student: Student): Observable<any> {    
    this.cacheService.clear('studentList'); // Clear cache on modification
    return this.http.post(`${this.resourceStudentUrl}/createStudent`, student);
  }
  
  updateStudent(student: Student): Observable<any> {
    this.cacheService.clear('studentList'); // Clear cache on modification
    return this.http.post(`${this.resourceStudentUrl}/updateStudent`, student);
  }

  deleteStudent(id: number): Observable<any> {
    this.cacheService.clear('studentList'); // Clear cache on modification
    return this.http.post(`${this.resourceStudentUrl}/deleteStudent`, id);     
  }

  // Task services

  createTask(task: MyTask): Observable<any> {    
    this.cacheService.clear('studentList'); // Clear cache on modification
    return this.http.post(`${this.resourceStudentUrl}/createTask`, task);
  }
  
  updateTask(task: MyTask): Observable<any> {
    this.cacheService.clear('studentList'); // Clear cache on modification
    return this.http.post(`${this.resourceStudentUrl}/updateTask`, task);
  }

  deleteTask(task: MyTask): Observable<any> {
    this.cacheService.clear('studentList'); // Clear cache on modification
    return this.http.post(`${this.resourceStudentUrl}/deleteTask`, task);     
  }

  // Payment services no cache
  getPaymentsByStudentId(id: number): Observable<Payment[]> {
    const paymentList = this.http.get<Payment[]>(`${this.resourceStudentUrl}/getPaymentsByStudentId/${id}`);
    return paymentList;
  }

  updatePayment(payment: Payment): Observable<any> {
    return this.http.post(`${this.resourceStudentUrl}/updatePayment`, payment);
  }
    
}
