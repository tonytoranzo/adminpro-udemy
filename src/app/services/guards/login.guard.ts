import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {

  constructor( public usuarioService: UsuarioService, public router: Router ) {}

  canActivate(): boolean {

    if (this.usuarioService.estaLogueado()) {
      return true;
    }

    this.router.navigate(['/login']);
    return false;
  }

}
