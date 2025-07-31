import { Router, RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";

interface Usuario {
  id: number;
  name: string;
  email: string;
  roles: string[]; // ← CAMBIO AQUÍ
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
  filtroRol: string = '';
terminoBusqueda: string = '';
  paginaActualUsuarios: number = 1;
elementosPorPaginaUsuarios: number = 5;
usuariosFiltrados: Usuario[] = [];
// Getter para obtener los usuarios paginados
get usuariosPaginados() {
  const inicio = (this.paginaActualUsuarios - 1) * this.elementosPorPaginaUsuarios;
  const fin = inicio + this.elementosPorPaginaUsuarios;
  return this.usuariosFiltrados.slice(inicio, fin);
}


  filtrarUsuariosPorRol(): void {
  const termino = this.terminoBusqueda.trim().toLowerCase();

  this.usuariosFiltrados = this.usuarios.filter(usuario => {
    const coincideNombre = usuario.name.toLowerCase().includes(termino);
    const coincideRol = this.filtroRol === '' || usuario.roles.includes(this.filtroRol);
    return coincideNombre && coincideRol;
  });

  this.paginaActualUsuarios = 1;
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

filtrarUsuarios(): void {
  this.filtrarUsuariosPorRol();
}
  obtenerUsuarios(): void {
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.get<any>('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/usuarios', { headers }) 
      .subscribe({
        next: (response) => {
          this.usuarios = response.data.map((u: Usuario) => ({ ...u, editando: false }));
          this.usuariosFiltrados = [...this.usuarios];  // ← llena lista filtrada
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

  this.http.post<any>('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/usuarios/', empleadoData, { headers })
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
  const datosActualizar = {
    name: usuario.name,
    email: usuario.email,
    role: usuario.roles[0]  // verifica que aquí el nombre del campo sea el que tu backend espera
  };
  this.http.put(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/usuarios/${usuario.id}`, datosActualizar, { headers })
    .subscribe({
      next: () => {
        usuario.editando = false;
        delete this.copiaUsuarios[usuario.id];
        this.cdRef.detectChanges(); 
      },
      error: err => console.error('Error al guardar usuario:', err)
    });
  }

  eliminarUsuario(id: number) {
  const usuarioSeleccionado = this.usuarios.find(u => u.id === id);

  if (!usuarioSeleccionado) {
    alert("Usuario no encontrado.");
    return;
  }

  // Verificamos si es admin
  if (usuarioSeleccionado.roles.includes('admin')) {
  alert("No tienes permisos para eliminar a un usuario administrador.");
  return;
}

  // Confirmación antes de eliminar
  const confirmacion = confirm(`¿Estás seguro de que deseas eliminar al usuario "${usuarioSeleccionado.name}"?`);
  if (!confirmacion) {
    return;
  }

  // Si pasa las validaciones, proceder a eliminar
  const token = localStorage.getItem('token');
  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.delete(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/usuarios/${id}`, { headers })
    .subscribe({
      next: () => {
        this.usuarios = this.usuarios.filter(u => u.id !== id);
        this.cdRef.detectChanges();
      },
      error: err => console.error('Error al eliminar usuario:', err)
    });
}


}
