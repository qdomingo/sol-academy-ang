import { Component, OnInit } from '@angular/core';
import { StudentService } from '../services/student.service';
import { MessageService } from 'primeng/api';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { Student } from '../models/student.model';
import { Payment } from '../models/payment.model';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { PipesModule } from '../pipes/pipes.modules';


@Component({
  selector: 'app-my-student-payments',
  standalone: true,
  imports: [CommonModule, DataViewModule, ButtonModule, TagModule, ToastModule,
      InputTextModule, FormsModule, Select, PipesModule],
  providers: [MessageService],
  templateUrl: './my-student-payments.component.html',
  styleUrl: './my-student-payments.component.css'
})
export class MyStudentPaymentsComponent implements OnInit {

    paymentsList: Payment[] = [];
    filteredPaymentsList: Payment[] = [];
    studentList: Student[] = [];
    
    studentTotClasses: number = 0;
    studentTotClassesPaid: number = 0;
    studentTotHours: number = 0;
    studentTotalAmount: number = 0;
    studentTotalAmountPaid: number = 0;

    studentMonthlyClasses: number = 0;
    studentMonthlyClassesPaid: number = 0;
    studentMonthlyHours: number = 0;
    studentMonthlyAmount: number = 0;
    studentMonthlyAmountPaid: number = 0;
    studentClassesDone: number = 0;
    studentHoursDone: number = 0;

    rate = 0;

    actualDate = new Date();
    actualMonth = this.actualDate.getMonth();
    actualYear = this.actualDate.getFullYear();
    selectedMonth: number = this.actualMonth;
    months = [
      { label: 'January', value: 0 },
      { label: 'February', value: 1 },
      { label: 'March', value: 2 },
      { label: 'April', value: 3 },
      { label: 'May', value: 4 },
      { label: 'June', value: 5 },
      { label: 'July', value: 6 },
      { label: 'August', value: 7 },
      { label: 'September', value: 8 },
      { label: 'October', value: 9 },
      { label: 'November', value: 10 },
      { label: 'December', value: 11 }
    ];

    constructor(private studentService: StudentService, private messageService: MessageService,
      private route: ActivatedRoute, private router: Router ) {}
  
    ngOnInit() {
      this.loadStudent(this.route.snapshot.params['id']);
      this.loadPaymentList(this.route.snapshot.params['id']);
    }

    loadStudent(id: number) {
      this.studentService.getStudentById(id).subscribe((data) => {
        this.studentList = data;
        console.log('Student loaded', this.studentList);       
      });
    }

    loadPaymentList(id: number) {
      this.studentService.getPaymentsByStudentId(id).subscribe((data) => {
        this.paymentsList = data.map(payment => {
          payment.schecule_id = payment.schecule_id;
          payment.title = payment.title;
          payment.student_id = payment.student_id;
          payment.outdated = new Date(payment.fin) < new Date();
          payment.duration = payment.duration;
          payment.paid = payment.paid;
          payment.rate = payment.rate;
          payment.inicioZ = payment.inicio;
          payment.finZ = payment.fin;
          payment.schedule_month = new Date(payment.inicio).getMonth();
          payment.schedule_year = new Date(payment.inicio).getFullYear();
          payment.inicio = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            //second: 'numeric'
          }).format(new Date(payment.inicio));
          payment.fin = new Intl.DateTimeFormat('es-ES', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric'
          }).format(new Date(payment.fin));
          return payment;
        });
        // this.loadStudent(this.route.snapshot.params['id']);
        // llamamamos a los metodos para calcular los valores de los pagos
        this.filterPaymentsByMonth();
        this.rate = this.paymentsList[0].rate;
      });
    }

    filterPaymentsByMonth() {
      this.filteredPaymentsList = this.paymentsList.filter(payment => payment.schedule_month === this.selectedMonth && 
        payment.schedule_year === this.actualYear);
      this.mensualPayments();
    }

    onClickChangePayment(item: Payment) {
    
          if(item.paid === 1) {
            item.paid = 0;
          } else {
            item.paid = 1;
          }
          this.updatePayment(item);
        }

    updatePayment(payment: Payment) {
      if(payment.inicioZ && payment.finZ) {
        payment.inicio = payment.inicioZ;
        payment.fin = payment.finZ;
      }
      this.studentService.updatePayment(payment).subscribe(() => {
        this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Payment updated' });
        this.loadPaymentList(this.route.snapshot.params['id']);
      });
    }

    // Metodos para calcular los valores de los pagos

    onClickChangeAllUnpaid() {
      this.filteredPaymentsList.forEach((payment) => {
        payment.paid = 0;
        this.updatePayment(payment);
      });
    }

    mensualPayments() {
      this.studentMonthlyClasses = this.filteredPaymentsList.length;
      this.studentMonthlyHours = this.studentMonthHours();
      this.studentMonthlyClassesPaid = this.studentMonthClassesPaid();
      this.studentMonthlyAmount = this.studentMonthlyHours*this.filteredPaymentsList[0].rate;
      this.studentMonthlyAmountPaid= this.studentMonthPaid();
      this.studentClassesDone = this.studentClassDone();
      this.studentHoursDone = this.studHoursDone();
    }



    studentMonthPaid() {
      return this.filteredPaymentsList.reduce((acc, payment) => {
        if(payment.paid) {
          return acc + payment.rate * payment.duration/60;
        } else {
          return acc;
        }
      }, 0);
    }

    studentMonthClassesPaid() {
      return this.filteredPaymentsList.reduce((acc, payment) => {
        if(payment.paid) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    }

    studentMonthHours() {
      return this.filteredPaymentsList.reduce((acc, payment) => {
          return acc + payment.duration/60
      }, 0);
    }

    studentClassDone() {
      return this.filteredPaymentsList.reduce((acc, payment) => {
        if(payment.outdated) {
          return acc + 1;
        } else {
          return acc;
        }
      }, 0);
    }

    studHoursDone() {
      return this.filteredPaymentsList.reduce((acc, payment) => {
        if(payment.outdated) {
          return acc + payment.duration/60;
        } else {
          return acc;
        }
      }, 0);
    }

    onClickChangeAllPaid() {
      this.filteredPaymentsList.forEach((payment) => {
        payment.paid = 1;
        this.updatePayment(payment);
      });
    }

    back() {
      this.router.navigateByUrl('/students');
    }

}
