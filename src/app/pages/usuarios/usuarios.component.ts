import { Component, OnInit } from '@angular/core';
import { Usuario } from 'src/app/models/usuario.model';
import { UsuarioService } from 'src/app/services/service.index';
import { ModalUploadService } from '../../components/modal-upload/modal-upload.service';

declare var swal: any;

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: []
})
export class UsuariosComponent implements OnInit {

  usuarios: Usuario[] = [];
  desde: number = 0;

  totalRegistros: number = 0;
  cargando: boolean = true;

  constructor(
              public usuarioService: UsuarioService,
              public modalUploadService: ModalUploadService ) { }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.modalUploadService.notificacion.subscribe( resp => this.cargarUsuarios());
  }

  mostrarModal( id: string ) {
    this.modalUploadService.mostrarModal( 'usuarios', id );
  }

  cargarUsuarios() {

    this.cargando = true;

    this.usuarioService
        .cargarUsuarios(this.desde)
        .subscribe( (resp: any) => {
          this.totalRegistros = resp.total;
          this.usuarios = resp.usuarios;

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
    this.cargarUsuarios();
  }

  buscarUsuario( termino: string ) {
    console.log('termino:', termino);

    if ( termino.length <= 0 ) {
      this.cargarUsuarios();
      return;
    }

    this.cargando = true;

    this.usuarioService
        .buscarUsuarios(termino)
        .subscribe( (usuarios: Usuario[]) => {

            this.usuarios = usuarios;
            this.cargando = false;
        });
  }

  borrarUsuario( usuario: Usuario ) {

    if ( usuario._id === this.usuarioService.usuario._id ) {
      swal('No puede borrar usuario', 'No se puede borrar a si mismo', 'error');
      return;
    }

    swal({
      title: '¿Está seguro?',
      text: 'Está a punto de borrar a ' + usuario.nombre,
      icon: 'warning',
      buttons: [ 'Cancelar', 'OK' ],
      dangerMode: true,
    })
    .then( borrar => {
      console.log('borrar', borrar);

      if (borrar) {

        this.usuarioService
            .borrarUsuario(usuario._id)
            .subscribe( borrado => {
              console.log('borrado', borrado);

              this.desde = 0;
              this.cargarUsuarios();
            });
      }
    });

  }

  guardarUsuario( usuario: Usuario ) {

    this.usuarioService.actualizarUsuario(usuario).subscribe();

  }

}
