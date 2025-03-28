import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { ToastModule } from 'primeng/toast';
import { User } from '../models/user.model';
import { MessageService } from 'primeng/api';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [    
    CommonModule, ReactiveFormsModule, InputTextModule, ToastModule, ButtonModule],
  providers: [ MessageService ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  username: string = '';
  password: string = '';

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router,
    private messageService: MessageService) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  login() {
    const form = this.loginForm.value;
    const usuario: User = {
      id: 0,
      username: form.username,
      password: form.password,
      enabled: 1
    };
    this.authService.login(usuario).subscribe(response => {
      // Handle successful login
      this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Login Correct' });
      this.router.navigate(['/calendar']);
    }, error => {
      // Handle login error
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Login Failed' });
      console.error('Login error', error);
    });
  }

  logout() {
    this.authService.logout();
    this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'Logout Correct' });
  }
}

