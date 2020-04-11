import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import swal from 'sweetalert';

import { UsuarioService } from '../services/service.index';
import { Usuario } from '../models/usuario.model';

declare function init_plugins();

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./login.component.css']
})
export class RegisterComponent implements OnInit {

  forma: FormGroup;

  constructor( public usuarioService: UsuarioService, public router: Router ) { }

  sonDistintos( campo1: string, campo2: string ) {


    return ( group: FormGroup ) => {

      const pass1 = group.controls[campo1].value;
      const pass2 = group.controls[campo2].value;

      if ( pass1 === pass2 ) {
        return null;
      }

      return {
        sonDistintos: true
      };

    };

  }

  ngOnInit(): void {
    init_plugins();

    this.forma = new FormGroup({
      nombre: new FormControl( null, Validators.required ),
      correo: new FormControl( null, [ Validators.required, Validators.email ] ),
      password: new FormControl( null, Validators.required ),
      password2: new FormControl( null, Validators.required ),
      condiciones: new FormControl( false )
    }, { validators: this.sonDistintos( 'password', 'password2' ) });

    this.forma.setValue({
      nombre: 'Test ',
      correo: 'test@prueba.com',
      password: '123',
      password2: '123',
      condiciones: true
    });
  }

  registrarUsuario() {
    if ( this.forma.invalid ) {
      return;
    }

    if ( !this.forma.value.condiciones ) {
      console.log('Debe aceptar las condiciones');
      swal('Importante', 'Debe aceptar las condiciones', 'success');
      return;
    }

    const usuario = new Usuario(
      this.forma.value.nombre,
      this.forma.value.correo,
      this.forma.value.password
    );

    this.usuarioService.crearUsuario(usuario)
      .subscribe( resp => {
        console.log(resp);
        this.router.navigate(['/login']);
      });

  }

}
