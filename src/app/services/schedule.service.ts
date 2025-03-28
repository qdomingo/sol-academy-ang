import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Schedule } from '../models/schedule.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  baseUrl = environment.baseUrl;
  private resourceSCheduleUrl = this.baseUrl + 'api/schedules';

  constructor(private http: HttpClient) { }

  getScheduleList(): Observable<Schedule[]> {
    const scheduleList = this.http.get<Schedule[]>(`${this.resourceSCheduleUrl}/getAll`);
    return scheduleList;
  }

  getScheduleByStudentId(id: number): Observable<Schedule[]> {
    const scheduleList = this.http.get<Schedule[]>(`${this.resourceSCheduleUrl}/getScheduleByStudentId/${id}`);
    return scheduleList;
  }

  addSchedule(event: any): Observable<any> {
    const schedule: Schedule = {
      id: Number(event.id),
      title: String(event.title),
      inicio: String(event.start), 
      fin: String(event.end),
      student_id: event.student_id,
      weekly: event.weekly
    };      
    return this.http.post(`${this.resourceSCheduleUrl}/createSchedule`, schedule);
  }

  updateSchedule(schedule: any): Observable<any> {
    return this.http.post(`${this.resourceSCheduleUrl}/updateSchedule`, schedule);
  }

  updateScheduleSerie(schedule: any): Observable<any> {
    return this.http.post(`${this.resourceSCheduleUrl}/updateScheduleSerie`, schedule);
  }

  deleteSchedule(id: number): Observable<any> {
    return this.http.post(`${this.resourceSCheduleUrl}/deleteSchedule`, id);     
  }

  deleteScheduleSerie(schedule: Schedule): Observable<any> {
    return this.http.post(`${this.resourceSCheduleUrl}/deleteScheduleSerie`, schedule);     
  }
}
