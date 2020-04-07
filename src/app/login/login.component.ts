import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  email: string;
  recuerdame: boolean = false;

  auth2: any;

  constructor( public router: Router, public usuarioService: UsuarioService ) { }

  ngOnInit(): void {
    init_plugins();
    this.googleInit();

    this.email = localStorage.getItem('email') || '';
    if ( this.email.length > 1 ) {
      this.recuerdame = true;
    }
  }

  googleInit() {

    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id:  '683049862703-i2bgkdb256osfhq66rl2a58kdobcu6g9.apps.googleusercontent.com',
        cookiepolicy: 'single_host_origin',
        scope: 'profile email'
      });

      this.attachSignin( document.getElementById('btnGoogle') );

    });
  }

  attachSignin( elementG: any ) {

    this.auth2.attachClickHandler( elementG, {}, (googleUser: any) => {

      const profile = googleUser.getBasicProfile();
      const token = googleUser.getAuthResponse().id_token;

      console.log('Profile', profile);
      console.log('Token', token);

      this.usuarioService
          .loginGoogle(token)
          // .subscribe( () => this.router.navigate(['/dashboard']) );
          // Otra forma por si no funca el refresh bien de la página (el # es para que no recargue) :
          .subscribe( () => window.location.href = '#/dashboard' );
    });

  }

  ingresar( forma: NgForm ) {

    if ( forma.invalid ) {
      return;
    }

    const usuario = new Usuario(null, forma.value.email, forma.value.password);

    this.usuarioService
        .login( usuario, forma.value.recuerdame )
        .subscribe( () => this.router.navigate(['/dashboard']));
  }

}
