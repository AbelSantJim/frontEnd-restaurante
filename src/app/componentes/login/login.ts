import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [RouterModule, FormsModule, HttpClientModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email: string = '';
  password: string = '';
  passwordVisible = false;

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; 
  }

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private router: Router) {}
    onSubmit() {
      const payload = {
        email: this.email,
        password: this.password
      };

      this.http.post<any>('http://172.20.10.2:8000/api/login/', payload).subscribe({
        next: (res) => {
          
          localStorage.setItem('token', res.token);
          localStorage.setItem('nombre', res.user_info.name);
          localStorage.setItem('rol', res.user_info.roles[0]);
          if(localStorage.getItem('rol')=="comensal"){
            this.router.navigate(['/menu']);
          }else if(localStorage.getItem('rol')=="admin"){
            this.router.navigate(['/menu']);
          }else if(localStorage.getItem('rol')=="mesero"){
            this.router.navigate(['/pedidos']);
          }
          console.log('Token recibido:', res.token);
          console.log(localStorage.getItem('rol'));
          console.log(localStorage.getItem('nombre'));
        },
        error: (err) => {
          console.error('Error al iniciar sesión:', err);
          alert('Credenciales inválidas');
      }
    });
  }
}
