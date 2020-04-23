import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UsuarioService } from 'src/app/services/service.index';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {

  usuario: Usuario;

  constructor(
    public usuarioService: UsuarioService,
    public router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

  buscar( termino: string ) {

    if ( !termino ) {
      return;
    }

    this.router.navigate(['/busqueda', termino]);
  }
}
