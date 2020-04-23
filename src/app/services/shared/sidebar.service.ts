import { Injectable } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class SidebarService {

  menu: any[] = [];

  constructor( public usuarioService: UsuarioService ) { }

  cargarMenu() {
    this.menu = this.usuarioService.menu;
  }
}
