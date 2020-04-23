import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import swal from 'sweetalert';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  usuario: Usuario;
  token: string;
  menu: any = [];

  constructor(
    public http: HttpClient,
    public router: Router,
    public subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return this.token.length > 5;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuario = JSON.parse(localStorage.getItem('usuario'));
      this.menu = JSON.parse(localStorage.getItem('menu'));
    } else {
      this.token = '';
      this.usuario = null;
      this.menu = [];
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario, menu: any ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));
    localStorage.setItem('menu', JSON.stringify(menu));

    this.usuario = usuario;
    this.token = token;
    this.menu = menu;
  }

  logout() {
    this.usuario = null;
    this.token = '';
    this.menu = [];

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('menu');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http
      .post( url, { token })
      .pipe(
        map( (resp: any) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        })
      );
  }

  login( usuario: Usuario, recordar = false ) {

    const url = URL_SERVICIOS + '/login';

    if (recordar) {
      localStorage.setItem('email', usuario.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http
      .post( url, usuario )
      .pipe(
        map( (resp: any) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario, resp.menu);
          return true;
        }),
        catchError( err => {
          swal( 'Error en el login', err.error.mensaje.split('-')[0], 'error' );
          return throwError( err );
        })
      );
  }

  crearUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario';

    return this.http.post( url, usuario )
      .pipe(
        map( ( resp: any) => {
          swal('Usuario creado', usuario.email, 'success');
          return resp.usuario;
        }),
        catchError( err => {
          swal( err.error.mensaje, err.error.errors.message, 'error' );
          return throwError( err );
        })
      );
  }

  actualizarUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;

    return this.http
          .put( url, usuario )
          .pipe(
            map( (resp: any) => {
              if ( usuario._id === this.usuario._id ) {
                const usuarioDb: Usuario = resp.usuario;
                this.guardarStorage(usuarioDb._id, this.token, usuarioDb, this.menu);
              }

              swal('Usuario actualizado', usuario.nombre, 'success');

              return true;
            }),
            catchError( err => {
              swal( err.error.mensaje, err.error.errors.message, 'error' );
              return throwError( err );
            })
          );
  }

  cambiarImagen( archivo: File, id: string ) {

    this.subirArchivoService
        .subirArchivo( archivo, 'usuarios', id )
        .then( (resp: any) => {
          const usuario: Usuario = JSON.parse(localStorage.getItem('usuario'));
          usuario.img = resp.usuario.img;

          swal('Imagen Actualizada', usuario.nombre, 'success');

          this.guardarStorage(id, this.token, usuario, this.menu);
        })
        .catch( resp => {
          console.log('Resp', resp);
        });
  }

  cargarUsuarios( desde: number = 0 ) {
    const url = URL_SERVICIOS + '/usuario?desde=' + desde;

    return this.http.get( url );
  }

  buscarUsuarios( termino: string ) {

    const url = URL_SERVICIOS + '/busqueda/coleccion/usuarios/' + termino;

    return this.http
               .get( url )
               .pipe(
                 map( (resp: any) => resp.usuarios )
               );
  }

  borrarUsuario( idUsuario: string ) {

    const url = URL_SERVICIOS + '/usuario/' + idUsuario + '?token=' + this.token;

    return this.http
               .delete( url )
               .pipe(
                 map( resp => {
                   swal('Usuario borrado', 'El usuario ha sido eliminado correctamente', 'success');
                   return true;
                 })
               );
  }
}
