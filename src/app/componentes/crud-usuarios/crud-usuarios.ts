import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";

  stringIp  : "http://127.0.0.1:8001/api";
interface Usuario {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  editando?: boolean;
}


@Component({
  selector: 'app-crud-usuarios',
  imports: [CommonModule, HttpClientModule, RouterModule, FormsModule, BarraNavegacion],
  templateUrl: './crud-usuarios.html',
  styleUrl: './crud-usuarios.css'
})
export class CrudUsuarios implements OnInit {

  paginaActualUsuarios: number = 1;
elementosPorPaginaUsuarios: number = 5;

// Getter para obtener los usuarios paginados
get usuariosPaginados() {
  const inicio = (this.paginaActualUsuarios - 1) * this.elementosPorPaginaUsuarios;
  const fin = inicio + this.elementosPorPaginaUsuarios;
  return this.usuarios.slice(inicio, fin);
}

// Total de páginas
totalPaginasUsuarios(): number {
  return Math.ceil(this.usuarios.length / this.elementosPorPaginaUsuarios);
}

// Cambiar página
cambiarPaginaUsuarios(pagina: number) {
  if (pagina >= 1 && pagina <= this.totalPaginasUsuarios()) {
    this.paginaActualUsuarios = pagina;
  }
}

  usuarios: Usuario[] = [];
  copiaUsuarios: any = {}; 

  mostrarFormulario = false;

  nuevoEmpleado = {
    name: '',
    email: '',
    password: '',
    role: ''
  };

  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}
  
  ngOnInit(): void {
    this.obtenerUsuarios();
  }

  obtenerUsuarios(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<any>('stringIp/', { headers }) 
      .subscribe({
        next: (response) => {
          this.usuarios = response.data.map((u: Usuario) => ({ ...u, editando: false }));
          this.cdRef.detectChanges();
        },
        error: err => {
          console.error('Error al cargar usuarios:', err);
        }
      });
    }

  crearEmpleado() {
  const token = localStorage.getItem('token');

  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  });

  const empleadoData = {
    name: this.nuevoEmpleado.name,
    email: this.nuevoEmpleado.email,
    role: this.nuevoEmpleado.role,
    password: this.nuevoEmpleado.password
  };

  this.http.post<any>('stringIp/api/usuarios/', empleadoData, { headers })
    .subscribe({
      next: response => {
        console.log('Empleado creado:', response);
        this.obtenerUsuarios(); // recarga la tabla
        this.mostrarFormulario = false; // oculta el formulario
        this.nuevoEmpleado = { name: '', email: '', password: '', role: '' }; // limpia campos
      },
      error: err => console.error('Error al crear empleado:', err)
    });
  }

  editarUsuario(usuario: any) {
    usuario.editando = true;
    this.copiaUsuarios[usuario.id] = { ...usuario }; // copia temporal
  }

  cancelarEdicion(usuario: any) {
    const copia = this.copiaUsuarios[usuario.id];
    Object.assign(usuario, copia);
    usuario.editando = false;
  }

  guardarUsuario(usuario: any) {
    const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  this.http.put(`stringIp/usuarios/${usuario.id}`, usuario, { headers })      .subscribe({
        next: () => {
          usuario.editando = false;
          delete this.copiaUsuarios[usuario.id];
           this.cdRef.detectChanges(); 
        },
        error: err => console.error('Error al guardar usuario:', err)
      });
  }

  eliminarUsuario(id: number) {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.delete(`http://127.0.0.1:8001/api/usuarios/${id}`, { headers })
      .subscribe({
        next: () => {
          this.usuarios = this.usuarios.filter(u => u.id !== id);
          this.cdRef.detectChanges();
        },
          error: err => console.error('Error al eliminar usuario:', err)
      });
  }

}
