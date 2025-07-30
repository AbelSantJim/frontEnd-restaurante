import { Routes } from '@angular/router';
import { Login } from './componentes/login/login';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { Dashboard } from './componentes/dashboard/dashboard';
import { CrudProductos } from './componentes/crud-productos/crud-productos';
import { CrudUsuarios } from './componentes/crud-usuarios/crud-usuarios';
import { Pedidos } from './componentes/pedidos/pedidos';
import { Menu } from './componentes/menu/menu';
import { AcercaDe } from './componentes/acerca-de/acerca-de';
import { AdministracionOrdenes } from './componentes/administracion-ordenes/administracion-ordenes';
import { FormularioPago } from './componentes/formulario-pago/formulario-pago';
import { RecuperarContrasena } from './componentes/recuperar-contrasena/recuperar-contrasena';
import { NuevaContra } from './componentes/nueva-contra/nueva-contra';

export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full',
    },
    {
        path:'login',
        component:Login,
    },
    {
        path: 'dashboard',
        component: Dashboard,
    },
    {
        path: 'crud-productos',
        component:CrudProductos,
    },
    {
        path: 'crud-usuarios',
        component: CrudUsuarios,
    },
    {
        path: 'pedidos',
        component: Pedidos,
    },
    {
        path: 'menu',
        component: Menu,
    },
    {
        path: 'acercaDe',
        component: AcercaDe,
    },
    {
        path: 'admiOrden',
        component: AdministracionOrdenes,
    },
    {
        path: 'pago',
        component: FormularioPago,
    },
    {
        path: 'recuperar',
        component: RecuperarContrasena,
    },
    {
        path: 'nuevaCon',
        component: NuevaContra,
    },
];
