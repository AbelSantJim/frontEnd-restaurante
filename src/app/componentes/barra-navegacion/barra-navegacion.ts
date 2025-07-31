import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-barra-navegacion',
  imports: [RouterModule, NgIf, HttpClientModule],
  templateUrl: './barra-navegacion.html',
  styleUrl: './barra-navegacion.css'
})
export class BarraNavegacion implements OnInit{

  rol: string | null = null;
  estaLogeado: boolean = false;
  nombre: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.rol = localStorage.getItem('rol');
    this.estaLogeado = !!this.rol;
    this.nombre = localStorage.getItem('nombre');
  }

  cerrarSesion(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/logout', {}, { headers })
      .subscribe({
        next: () => {
          console.log('Sesión cerrada correctamente.');
          localStorage.clear();
          window.location.href = '/login';

        },
        error: err => {
          console.error('Error al cerrar sesión:', err);
          localStorage.clear();
          window.location.href = '/login';
      }
    });

  }
}