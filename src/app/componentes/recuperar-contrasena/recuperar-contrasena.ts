import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-recuperar-contrasena',
  imports: [FormsModule, CommonModule,HttpClientModule, RouterModule],
  templateUrl: './recuperar-contrasena.html',
  styleUrl: './recuperar-contrasena.css'
})
export class RecuperarContrasena {
  email: string = '';
  password: string = '';
  passwordVisible = false;
  

    constructor(private http: HttpClient, private cdRef: ChangeDetectorRef, private router: Router) {}
 togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible; 
  }
  onSubmit() {
  const payload = { email: this.email };
  console.log('Enviando:', payload);

  this.http.post('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/password/email', payload).subscribe({
    next: response => {
      alert('Correo enviado con éxito. Revise su bandeja de entrada.');
      this.router.navigate(['/nuevaCon']); // ruta que quieras mostrar
      console.log('Respuesta:', response);
    },
    error: error => {
      // Si es error de validación (Laravel responde con código 422)
      if (error.status === 422) {
        const mensaje = error.error?.errors?.email?.[0] || 'Error de validación.';
        alert(`Error: ${mensaje}`);
      } else {
        // Otros errores (500, etc.)
        alert('Error del servidor. Inténtalo más tarde.');
      }

      console.error('Error:', error);
    }
  });
}

}
