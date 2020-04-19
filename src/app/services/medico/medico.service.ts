import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { URL_SERVICIOS } from '../../config/config';
import { Medico } from '../../models/medico.model';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class MedicoService {

  constructor( public http: HttpClient, public usuarioService: UsuarioService ) { }

  cargarMedicos( desde: number = 0 ) {

    const url = URL_SERVICIOS + '/medico?desde=' + desde;

    return this.http.get( url );
  }

  cargarMedico( id: string ) {
    const url = URL_SERVICIOS + '/medico/' + id;

    return this.http
      .get( url )
      .pipe(
        map( (resp: any) => resp.medico )
      );
  }

  buscarMedicos( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/medicos/' + termino;

    return this.http
               .get( url )
               .pipe(
                 map( (resp: any) => resp.medicos )
               );
  }

  borrarMedico( id: string ) {
    const url = URL_SERVICIOS + '/medico/' + id + '?token=' + this.usuarioService.token;

    return this.http
               .delete( url )
               .pipe(
                  map( resp => {
                    swal('Médico borrado', 'El Médico ha sido eliminado correctamente', 'success');
                    return true;
                  })
               );
  }

  guardarMedico( medico: Medico ) {

    let url = URL_SERVICIOS + '/medico';

    // Médico existente
    if ( medico._id ) {
      url += '/' + medico._id + '?token=' + this.usuarioService.token;

      return this.http
                 .put( url, medico )
                 .pipe(
                    map( (resp: any) => {
                      swal('Médico Actualizado', medico.nombre, 'success');
                      return resp.medico;
                    })
                 );

    }

    // Nuevo médico
    url += '?token=' + this.usuarioService.token;

    return this.http
                .post( url, medico )
                .pipe(
                  map( (resp: any) => {
                    swal('Médico Creado', medico.nombre, 'success');
                    return resp.medico;
                  })
                );
  }
}
