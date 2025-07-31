import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http'; 
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http'; // Importa HttpResponse
import { Router } from '@angular/router'; // Para la redirección
import { ActivatedRoute } from '@angular/router'; // Descomentar si vas a obtener pedidoId de la ruta

// !!! RUTA DE IMPORTACIÓN DEL ENTORNO !!!
// Ajusta esta ruta si tu archivo 'environment.ts' no está exactamente en 'src/environments/'
// Por ejemplo, si tu componente está en 'src/app/mi-modulo/componentes/formulario-pago/'
// podrías necesitar más '../' como '../../../../../environments/environment'
//import { environment } from '../../../environments/environment'; // Esta es la ruta más común si tu componente está anidado.


@Component({
  selector: 'app-formulario-pago',
  standalone: true, // Si estás en Angular 14+ y es un componente standalone.
                     // Si no estás usando 'standalone', quita esta línea
                     // y asegúrate de que este componente esté declarado
                     // en un NgModule (ej. AppModule) y que FormsModule, CommonModule
                     // y HttpClientModule estén en los 'imports' de ese NgModule.
  imports: [
    FormsModule,     // Necesario para el two-way data binding con ngModel en el HTML
    CommonModule ,    // Necesario para directivas comunes de Angular como ngFor, ngIf
    HttpClientModule //NO se importa aquí. Se importa una única vez en tu AppModule o módulo raíz.

  ],
  templateUrl: './formulario-pago.html',
  styleUrl: './formulario-pago.css'
})
export class FormularioPago {
  cvv: string = '';
mesExpiracion: string = '';
anioExpiracion: string = '';
  metodoEnvio: string = '';
  meses = [
    { value: '01', name: '01 - Ene' },
    { value: '02', name: '02 - Feb' },
    { value: '03', name: '03 - Mar' },
    { value: '04', name: '04 - Abr' },
    { value: '05', name: '05 - May' },
    { value: '06', name: '06 - Jun' },
    { value: '07', name: '07 - Jul' },
    { value: '08', name: '08 - Ago' },
    { value: '09', name: '09 - Sep' },
    { value: '10', name: '10 - Oct' },
    { value: '11', name: '11 - Nov' },
    { value: '12', name: '12 - Dic' },
  ];
correoCliente: string = '';
  anios: number[] = [];
  numeroTarjeta = ''; // Usado con ngModel en el HTML para el campo del número de tarjeta

  nombre: string = '';
  pedidoId: number | null = null;

  constructor(
    private http: HttpClient, // Inyección del servicio HttpClient para hacer peticiones HTTP
    private router: Router    // Inyección del servicio Router para navegación
    // private route: ActivatedRoute // Descomentar si vas a usar ActivatedRoute para obtener el ID de la URL
  ) {
    const storedId = localStorage.getItem('pedidoId');
    // Inicializa el array de años para el selector (dropdown) de la fecha de expiración
    const añoActual = new Date().getFullYear();
    for (let i = 0; i < 10; i++) {
      this.anios.push(añoActual + i);
    }

  
  }

  /**
   * Método para procesar el pago y solicitar el ticket en formato PDF.
   */
  
  pagar(): void {
  const nombreValido = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,45}$/.test(this.nombre);

  if (!nombreValido) {
    alert('El nombre solo debe contener letras y espacios, máximo 45 caracteres.');
    return;
  }

  const storedId = localStorage.getItem('pedidoId');

  if (storedId) {
    const parsedId = Number(storedId);
    if (!isNaN(parsedId)) {
      this.pedidoId = parsedId;
    } else {
      console.warn('El pedidoId en localStorage no es un número válido.');
      alert('ID de pedido inválido.');
      return;
    }
  } else {
    console.warn('No se encontró pedidoId en localStorage.');
    alert('No se encontró pedidoId.');
    return;
  }

  const token = localStorage.getItem('token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'Accept': 'application/pdf'
  });
  console.log(this.metodoEnvio);
  // FLUJO SEGÚN EL MÉTODO DE ENVÍO
  if (this.metodoEnvio === 'imprimir') {
     const body = {
      estado: 'pagado',
      metodo_envio_ticket: 'descargar'
    };

    this.http.put(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/pedidos/${this.pedidoId}`, body, {
      headers: headers,
      observe: 'response',
      responseType: 'blob'
    }).subscribe({
      next: (response: HttpResponse<Blob>) => {
        const blob = new Blob([response.body!], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `ticket_pedido_${this.pedidoId}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);

        this.router.navigate(['/pedidos']);
      },
      error: (error) => {
        console.error('Error al procesar el pago o descargar el ticket:', error);
        alert('Hubo un problema al procesar el pago.');
      }
    });

  } else {
    // Envío por correo
    
    const body = {
  estado: 'pagado',
  metodo_envio_ticket: 'email',
  cliente_email: this.correoCliente
};

    this.http.put(`https://backend-restaurante-8d68ca64ed92.herokuapp.com/api/pedidos/${this.pedidoId}`, body, {
      headers: headers
    }).subscribe({
      next: (response) => {
        console.log('Ticket enviado por correo');
        alert('El ticket fue enviado al correo.');
        this.router.navigate(['/pedidos']);
      },
      error: (error) => {
        console.error('Error al enviar el ticket por correo:', error);
        alert('Hubo un problema al enviar el ticket por correo.');
      }
    });
    console.log("hola");
  }

}

  formatearTarjeta(event: Event) {
    const input = event.target as HTMLInputElement;
    // Eliminar todo lo que no sea dígito
    let valor = input.value.replace(/\D/g, '');

    // Limitar a 16 dígitos (o el máximo que tu sistema acepte, ej. 19 para Amex)
    valor = valor.substring(0, 16);

    // Insertar un espacio cada 4 dígitos
    const bloques = valor.match(/.{1,4}/g); // Encuentra secuencias de 1 a 4 dígitos
    if (bloques) {
      valor = bloques.join(' '); // Une los bloques con espacios
    }

    this.numeroTarjeta = valor; // Actualiza la propiedad del componente (para ngModel)
    input.value = valor;       // Actualiza el valor directamente en el input (para la vista inmediata)
  }

  formularioValido(): boolean {
  return (
    this.numeroTarjeta.replace(/\s/g, '').length === 16 &&
    /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{1,45}$/.test(this.nombre) &&
    /^\d{3,4}$/.test(this.cvv) &&
    this.mesExpiracion !== '' &&
    this.anioExpiracion !== ''
  );
}
}