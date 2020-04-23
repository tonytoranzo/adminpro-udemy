import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {

  constructor( public usuarioService: UsuarioService ) { }

  canActivate() {

    if ( this.usuarioService.usuario.role === 'ADMIN_ROLE' ) {
      return true;
    }

    console.log('Bloqueado por el ADMIN GUARD');
    this.usuarioService.logout();
    return false;
  }

}
