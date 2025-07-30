import { BarraNavegacion } from "../barra-navegacion/barra-navegacion";
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-acerca-de',
  imports: [],
  templateUrl: './acerca-de.html',
  styleUrl: './acerca-de.css'
})
export class AcercaDe implements OnInit {
  ngOnInit(): void {
  }
}
