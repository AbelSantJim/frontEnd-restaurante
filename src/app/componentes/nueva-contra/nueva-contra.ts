import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-nueva-contra',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule, RouterModule],
  templateUrl: './nueva-contra.html',
  styleUrl: './nueva-contra.css'
})
export class NuevaContra {
  email: string = '';
  password: string = '';
  passwordConfirmar: string = '';
  token: string = ''; // ← deberías recibirlo por URL

  passwordVisible = false;

  constructor(private http: HttpClient, private router: Router) {}

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  onSubmit() {
    if (this.password !== this.passwordConfirmar) {
      alert("Las contraseñas no coinciden");
      return;
    }

    const payload = {
      email: this.email,
      token: this.token,
      password: this.password,
      password_confirmation: this.passwordConfirmar, // clave exacta que Laravel espera
    };

    this.http.post('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/password/reset', payload)
      .subscribe({
        next: (response: any) => {
          alert(response.message || 'Contraseña actualizada con éxito');
          this.router.navigate(['/login']); // o donde quieras redirigir
        },
        error: (error) => {
          console.error('Error al restablecer contraseña:', error);
          if (error.status === 422) {
            alert('Error de validación. Verifique los campos.');
          } else if (error.status === 500) {
            alert('Error del servidor. Intente más tarde.');
          }
        }
      });
  }
}
