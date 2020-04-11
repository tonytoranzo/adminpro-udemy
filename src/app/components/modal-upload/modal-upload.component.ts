import { Component, OnInit } from '@angular/core';
import { SubirArchivoService } from 'src/app/services/service.index';
import { ModalUploadService } from './modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-modal-upload',
  templateUrl: './modal-upload.component.html',
  styles: []
})
export class ModalUploadComponent implements OnInit {

  imagenSubir: File;
  imagenTemp: string;

  constructor( public subirArchivoService: SubirArchivoService, public modalUploadService: ModalUploadService ) {}

  ngOnInit(): void {
  }

  seleccionImagen( archivo: File ) {

    if ( !archivo ) {
      this.imagenSubir = null;
      return;
    }

    if ( !archivo.type.includes('image') ) {
      swal('Solo imágenes', 'El archivo seleccionado no es una imagen', 'error');
      this.imagenSubir = null;
      return;
    }

    this.imagenSubir = archivo;

    const reader = new FileReader();
    reader.readAsDataURL(archivo);
    reader.onloadend = () => this.imagenTemp = reader.result as string;

  }

  subirImagen() {
    this.subirArchivoService
        .subirArchivo( this.imagenSubir, this.modalUploadService.tipo, this.modalUploadService.id )
        .then( resp => {
          this.modalUploadService.notificacion.emit( resp );
          this.cerrarModal();
        })
        .catch( err => {
          console.log('Error en la carga...a');
        });
  }

  cerrarModal() {
    this.imagenTemp = null;
    this.imagenSubir = null;
    this.modalUploadService.ocultarModal();
  }
}
