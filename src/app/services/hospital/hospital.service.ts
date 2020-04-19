import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { URL_SERVICIOS } from 'src/app/config/config';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import { Hospital } from '../../models/hospital.model';

declare var swal: any;

@Injectable({
  providedIn: 'root'
})
export class HospitalService {

  constructor( public http: HttpClient, public usuarioService: UsuarioService ) { }

  cargarHospitales( desde: number = 0, limit: number = 5 ) {

    const url = URL_SERVICIOS + '/hospital?desde=' + desde + '&limit=' + limit;

    return this.http.get( url );
  }

  buscarHospitales( termino: string ) {
    const url = URL_SERVICIOS + '/busqueda/coleccion/hospitales/' + termino;

    return this.http
               .get( url )
               .pipe(
                 map( (resp: any) => resp.hospitales )
               );
  }

  obtenerHospital( id: string ) {
    const url = URL_SERVICIOS + '/hospital/' + id;

    return this.http
      .get( url )
      .pipe(
        map( (resp: any) => resp.hospital )
      );
  }

  crearHospital( hospital: Hospital ) {
    const url = URL_SERVICIOS + '/hospital' + '?token=' + this.usuarioService.token;

    return this.http.post( url, hospital )
      .pipe(
        map( ( resp: any) => {
          swal('Hospital creado', hospital.nombre, 'success');
          return resp.hospital;
        })
      );
  }

  actualizarHospital( hospital: Hospital ) {
    const url = URL_SERVICIOS + '/hospital/' + hospital._id + '?token=' + this.usuarioService.token;

    return this.http
          .put( url, hospital )
          .pipe(
            map( (resp: any) => {
              swal('Hospital actualizado', hospital.nombre, 'success');
              return true;
            })
          );
  }

  borrarHospital( id: string ) {
    const url = URL_SERVICIOS + '/hospital/' + id + '?token=' + this.usuarioService.token;

    return this.http
    .delete( url )
    .pipe(
      map( resp => {
        swal('Hospital borrado', 'El hospital ha sido eliminado correctamente', 'success');
        return true;
      })
    );
  }


}
