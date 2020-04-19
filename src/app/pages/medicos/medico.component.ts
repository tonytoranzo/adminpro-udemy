import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { MedicoService, HospitalService } from 'src/app/services/service.index';
import { Hospital } from '../../models/hospital.model';
import { Medico } from '../../models/medico.model';
import { ModalUploadService } from 'src/app/components/modal-upload/modal-upload.service';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: []
})
export class MedicoComponent implements OnInit {

  hospitales: Hospital[] = [];
  medico: Medico = new Medico('', '', '', '', '');
  hospital: Hospital = new Hospital('');

  constructor(
    public medicoService: MedicoService,
    public hospitalService: HospitalService,
    public modalUploadService: ModalUploadService,
    public router: Router,
    public activatedRoute: ActivatedRoute
  ) {

    this.activatedRoute.params.subscribe( params => {
      const id = params.id;

      if ( id !== 'nuevo' ) {
        this.cargarMedico(id);
      }
    });
  }

  ngOnInit(): void {

    this.hospitalService
        .cargarHospitales(0, 20)
        .subscribe( (resp: any) => this.hospitales = resp.hospitales );

    this.modalUploadService
        .notificacion
        .subscribe( (resp: any) => this.medico.img = resp.medico.img );
  }

  cargarMedico( id: string ) {
    this.medicoService
        .cargarMedico(id)
        .subscribe( medico => {

          this.medico = medico;
          this.medico.hospital = medico.hospital._id;
          this.cambioHospital( this.medico.hospital );
        });
  }

  guardarMedico( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    this.medicoService
        .guardarMedico( this.medico)
        .subscribe( medico => {
          this.medico._id = medico._id;
          this.router.navigate(['/medico', medico._id]);
        });
  }

  cambioHospital( id: string ) {

    this.hospitalService
        .obtenerHospital(id)
        .subscribe( hospital => this.hospital = hospital );
  }

  cambiarFoto() {
    this.modalUploadService.mostrarModal( 'medicos', this.medico._id );
  }
}
