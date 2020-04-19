import { Component, OnInit } from '@angular/core';
import { Medico } from '../../models/medico.model';
import { MedicoService } from 'src/app/services/service.index';

import swal from 'sweetalert';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: []
})
export class MedicosComponent implements OnInit {

  medicos: Medico[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public medicoService: MedicoService
  ) { }

  ngOnInit(): void {
    this.cargarMedicos();
  }

  cargarMedicos() {

    this.cargando = true;

    this.medicoService
        .cargarMedicos(this.desde)
        .subscribe( (resp: any) => {
          this.totalRegistros = resp.total;
          this.medicos = resp.medicos;

          this.cargando = false;
        });
  }

  cambiarDesde( valor: number) {
    const desde = this.desde + valor;

    if ( desde >= this.totalRegistros ) {
      return;
    }

    if ( desde < 0 ) {
      return;
    }

    this.desde += valor;
    this.cargarMedicos();
  }

  buscarMedico( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarMedicos();
      return;
    }

    this.cargando = true;

    this.medicoService
        .buscarMedicos(termino)
        .subscribe( (medicos: Medico[]) => {

            this.medicos = medicos;
            this.cargando = false;
        });
  }

  borrarMedico( medico: Medico ) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + medico.nombre,
      icon: 'warning',
      buttons: [ 'Cancelar', 'OK' ],
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {
        this.medicoService
            .borrarMedico(medico._id)
            .subscribe( borrado => {
              this.desde = 0;
              this.cargarMedicos();
            });
      }
    });

  }


}
