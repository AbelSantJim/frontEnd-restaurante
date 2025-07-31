import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";
import { Router } from '@angular/router';

@Component({
  selector: 'app-administracion-ordenes',
  imports: [RouterModule, CommonModule, HttpClientModule, FormsModule, BarraNavegacion],
  templateUrl: './administracion-ordenes.html',
  styleUrl: './administracion-ordenes.css'
})
export class AdministracionOrdenes implements OnInit {
  filtroEstado: string = '';
  pedidosFiltrados: any[] = [];
  pedidos: any[] = [];
  paginatedPedidos: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 6;
  totalPages: number = 1;
  rol: string = 'mesero';

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerPedidos();
  }


  obtenerPedidos() {
    this.rol = localStorage.getItem('rol') || 'mesero';
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any[]>('https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/pedidos', { headers })
      .subscribe({
        next: (data) => {
          this.pedidos = data;
          this.filtrarPedidos(); 
        },
        error: (err) => {
          console.error('Error al obtener pedidos:', err);
        }
      });
  }

  filtrarPedidos() {
  if (!this.filtroEstado) {
    this.pedidosFiltrados = [...this.pedidos];
  } else {
    this.pedidosFiltrados = this.pedidos.filter(p => p.estado === this.filtroEstado);
  }
  this.currentPage = 1;
  this.totalPages = Math.ceil(this.pedidosFiltrados.length / this.itemsPerPage);
  this.updatePaginatedPedidos();
}


  updatePaginatedPedidos() {
  const start = (this.currentPage - 1) * this.itemsPerPage;
  const end = start + this.itemsPerPage;
  this.paginatedPedidos = this.pedidosFiltrados.slice(start, end);
  }

  cambiarPagina(nuevaPagina: number) {
    if (nuevaPagina >= 1 && nuevaPagina <= this.totalPages) {
      this.currentPage = nuevaPagina;
      this.updatePaginatedPedidos();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedPedidos();
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedPedidos();
    }
  }

  accionPedido(pedido: any) {
    if (pedido.estado === 'pendiente') {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      this.http.put(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/pedidos/${pedido.id}`, 
        { estado: 'entregado' }, 
        { headers }
      ).subscribe({
        next: (response) => {
          pedido.estado = 'entregado';
        },
        error: (err) => {
          console.error('Error al actualizar el pedido:', err);
        }
      });
    } else if (pedido.estado === 'entregado') {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      this.http.put(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/mesas/${pedido.mesa_id}`, 
        { estado: 'disponible' }, 
        { headers }
      ).subscribe({
        next: (mesaResponse) => {
          localStorage.setItem('pedidoId', pedido.id.toString());
          this.router.navigate(['/pago']);
        },
        error: (mesaError) => {
          console.error('Error al actualizar la mesa:', mesaError);
        }
      });
    } else if (pedido.estado === 'pagado' && this.rol === 'admin') {
      // lógica de cancelación
    }
  }
  
}
