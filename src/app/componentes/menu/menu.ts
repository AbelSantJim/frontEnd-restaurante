import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";
import { Component, OnInit,  ChangeDetectorRef  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-menu',
  imports: [BarraNavegacion,RouterModule,CommonModule, HttpClientModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.css'
})
export class Menu implements OnInit {
platillos: any[] = []; // todos los platillos del API
platillosFiltrados: any[] = []; // se usará para mostrar solo los filtrados
terminoBusqueda: string = '';
constructor(private http: HttpClient) {}
currentPage: number = 1;
platillosPorPagina: number = 6;
paginatedPlatillos: any[] = [];
totalPages: number = 0;

ngOnInit(): void {
  this.obtenerPlatillos();
}

obtenerPlatillos(): void {
this.http.get<any[]>('http://127.0.0.1:8001/api/API/productos/').subscribe((data: any[]) => {
    this.platillos = data;
    this.filtrarPlatillos(); 
  });
}

filtrarPlatillos(): void {
  const termino = this.terminoBusqueda.toLowerCase().trim();
  this.platillosFiltrados = this.platillos.filter(p =>
    p.nombre.toLowerCase().includes(termino)
  );
  this.currentPage = 1;
  this.actualizarPaginacion();
}

actualizarPaginacion(): void {
  const inicio = (this.currentPage - 1) * this.platillosPorPagina;
  const fin = inicio + this.platillosPorPagina;
  this.totalPages = Math.ceil(this.platillosFiltrados.length / this.platillosPorPagina);
  this.paginatedPlatillos = this.platillosFiltrados.slice(inicio, fin);
}

cambiarPagina(pagina: number): void {
  if (pagina < 1 || pagina > this.totalPages) return;
  this.currentPage = pagina;
  this.actualizarPaginacion();
}


}
