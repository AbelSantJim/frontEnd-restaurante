import { RouterModule } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpHeaders } from '@angular/common/http';
import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";

@Component({
  selector: 'app-crud-productos',
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule, BarraNavegacion],
  templateUrl: './crud-productos.html',
  styleUrl: './crud-productos.css'
})
export class CrudProductos implements OnInit {
terminoBusqueda: string = '';
todosLosPlatillos: any[] = [];
  paginaActual: number = 1;
elementosPorPagina: number = 5;

// Getter para obtener los platillos en la página actual
get platillosPaginados() {
  const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
  const fin = inicio + this.elementosPorPagina;
  return this.platillos.slice(inicio, fin);
}

// Devuelve el número total de páginas
totalPaginas(): number {
  return Math.ceil(this.platillos.length / this.elementosPorPagina);
}

// Cambiar de página
cambiarPagina(pagina: number) {
  if (pagina >= 1 && pagina <= this.totalPaginas()) {
    this.paginaActual = pagina;
  }
}

  nuevoPlatillo = {
    nombre: '',
    descripcion: '',
    precio: 0
  };
  platillos: any[] = [];
  constructor(private http: HttpClient, private cdRef: ChangeDetectorRef) {}

  mostrarFormulario = false;

  toggleFormulario(): void {
    this.mostrarFormulario = !this.mostrarFormulario;
  }
  ngOnInit(): void {
    this.obtenerPlatillos();
  }

  obtenerPlatillos(): void {
  this.http.get<any[]>('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/API/productos')
    .subscribe({
      next: datos => {
        this.todosLosPlatillos = datos.map(p => ({ ...p, editando: false }));
        this.platillos = [...this.todosLosPlatillos]; // copia inicial
        this.cdRef.detectChanges();
      },
      error: err => {
        console.error('Error al cargar los platillos:', err);
      }
    });
}
  filtrarPlatillos(): void {
  const termino = this.terminoBusqueda.trim().toLowerCase();

  if (!termino) {
    this.platillos = [...this.todosLosPlatillos];
  } else {
    this.platillos = this.todosLosPlatillos.filter(p =>
      p.nombre.toLowerCase().includes(termino)
    );
  }

  // Reiniciar paginación al inicio
  this.paginaActual = 1;
}
  editarPlatillo(index: number): void {
    
    this.platillos[index].editando = true;
  }

  guardarPlatillo(index: number): void {
    const confirmar = confirm("¿Estás seguro que desea guardar los datos?");
  if (!confirmar) {
    return; // Cancelar si el usuario no confirma
  }
    const platillo = this.platillos[index];
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
    });

    console.log('Enviando PUT a API con ID:', platillo.id);
    console.log('Datos enviados:', platillo);
    
    this.http.put(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/productos/${platillo.id}`, platillo, { headers }).subscribe({
      next: () => {
        platillo.editando = false;
        this.cdRef.detectChanges();
        alert('Se modificó el registro');
      },
      error: err => {
      console.error('Error al guardar cambios:', err);
      }
      });
    }

  eliminarPlatillo(id: number): void {
    const confirmar = confirm("¿Estás seguro de que deseas eliminar este platillo?");
  if (!confirmar) {
    return; // Cancelar si el usuario no confirma
  }
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
        'Authorization': `Bearer ${token}`
      });
                      
    this.http.delete(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/productos/${id}`, { headers }).subscribe({      next: () => {
         this.obtenerPlatillos();
      },
    error: err => {
        console.error('Error al eliminar platillo:', err);
      }
    });
  }

  crearPlatillo(): void {
    const token = localStorage.getItem('token');
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
    console.log('Enviando:', this.nuevoPlatillo);
    this.http.post('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/productos', this.nuevoPlatillo, { headers }).subscribe({
      next: (res) => {
        console.log('Platillo creado:', res);
        this.obtenerPlatillos(); 
        this.nuevoPlatillo = { nombre: '', descripcion: '', precio: 0 }; 
      },
      error: (err) => {
        console.error('Error al crear platillo:', err);
      }
    });
  }
}
