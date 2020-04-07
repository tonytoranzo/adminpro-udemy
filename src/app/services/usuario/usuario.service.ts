import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

import swal from 'sweetalert';

import { Usuario } from '../../models/usuario.model';
import { URL_SERVICIOS } from 'src/app/config/config';
import { SubirArchivoService } from '../subir-archivo/subir-archivo.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private usuarioSubject = new BehaviorSubject<Usuario>(null);
  usuario$ = this.usuarioSubject.asObservable();
  token: string;

  constructor( public http: HttpClient, public router: Router, public subirArchivoService: SubirArchivoService ) {
    this.cargarStorage();
  }

  estaLogueado() {
    return this.token.length > 5;
  }

  cargarStorage() {
    if (localStorage.getItem('token')) {
      this.token = localStorage.getItem('token');
      this.usuarioSubject.next(JSON.parse(localStorage.getItem('usuario')));
    } else {
      this.token = '';
      this.usuarioSubject.next(null);
    }
  }

  guardarStorage( id: string, token: string, usuario: Usuario ) {
    localStorage.setItem('id', id);
    localStorage.setItem('token', token);
    localStorage.setItem('usuario', JSON.stringify(usuario));

    this.usuarioSubject.next(usuario);
    this.token = token;
  }

  logout() {
    this.usuarioSubject.next(null);
    this.token = '';

    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    this.router.navigate(['/login']);
  }

  loginGoogle( token: string ) {

    const url = URL_SERVICIOS + '/login/google';

    return this.http
      .post( url, { token })
      .pipe(
        map( (resp: any) => {
          this.guardarStorage( resp.id, resp.token, resp.usuario);
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
          this.guardarStorage( resp.id, resp.token, resp.usuario);
          return true;
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
        })
      );
  }

  actualizarUsuario( usuario: Usuario ) {

    const url = URL_SERVICIOS + '/usuario/' + usuario._id + '?token=' + this.token;

    return this.http
          .put( url, usuario )
          .pipe(
            map( (resp: any) => {
              const usuarioDb: Usuario = resp.usuario;
              this.guardarStorage(usuarioDb._id, this.token, usuarioDb);
              swal('Usuario actualizado', usuarioDb.nombre, 'success');

              return true;
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

          this.guardarStorage(id, this.token, usuario);
        })
        .catch( resp => {
          console.log('Resp', resp);
        });
  }
}
