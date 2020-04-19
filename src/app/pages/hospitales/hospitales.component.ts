import { Component, OnInit } from '@angular/core';

import { Hospital } from '../../models/hospital.model';
import { HospitalService } from '../../services/hospital/hospital.service';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';
import swal from 'sweetalert';

// declare var swal: any;

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: []
})
export class HospitalesComponent implements OnInit {

  hospitales: Hospital[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService
  ) { }

  ngOnInit(): void {
    this.cargarHospitales();

    this.modalUploadService.notificacion.subscribe( () => this.cargarHospitales());
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal( 'hospitales', id );
  }

  cargarHospitales() {

    this.cargando = true;

    this.hospitalService
        .cargarHospitales(this.desde)
        .subscribe( (resp: any) => {
          this.totalRegistros = resp.total;
          this.hospitales = resp.hospitales;

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
    this.cargarHospitales();
  }

  buscarHospital( termino: string ) {

    if ( termino.length <= 0 ) {
      this.cargarHospitales();
      return;
    }

    this.cargando = true;

    this.hospitalService
        .buscarHospitales(termino)
        .subscribe( (hospitales: Hospital[]) => {

            this.hospitales = hospitales;
            this.cargando = false;
        });
  }

  borrarHospital( hospital: Hospital ) {

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + hospital.nombre,
      icon: 'warning',
      buttons: [ 'Cancelar', 'OK' ],
      dangerMode: true,
    })
    .then( borrar => {

      if (borrar) {

        this.hospitalService
            .borrarHospital(hospital._id)
            .subscribe( borrado => {
              this.desde = 0;
              this.cargarHospitales();
            });
      }
    });

  }

  crearHospital() {

    swal({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      content: { element: 'input' },
      icon: 'info',
      buttons: [ 'Cancelar', 'OK' ],
      dangerMode: true,
    })
    .then( (nombreIngresado: string) => {
      console.log('nombre nuevo hospital a guardar', nombreIngresado);

      if ( !nombreIngresado || nombreIngresado.length === 0) {
        return;
      }

      const hospital = new Hospital(nombreIngresado);

      this.hospitalService
          .crearHospital(hospital)
          .subscribe( hospitalDb => {
            this.desde = 0;
            this.cargarHospitales();
          });

    });

  }

  guardarHospital( hospital: Hospital ) {

    this.hospitalService.actualizarHospital(hospital).subscribe();

  }

}
