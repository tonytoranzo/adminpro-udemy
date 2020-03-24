import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  ajustes: Ajustes = {
    temaUrl: 'assets/css/colors/default-dark.css',
    tema: 'default'
  };

  // constructor (@Inject(DOCUMENT) private myDocument) {
  constructor() {
    this.cargarAjustes();
  }

  guardarAjustes() {
    // console.log('Guardado en el localStorage');
    localStorage.setItem('ajustes', JSON.stringify(this.ajustes));
  }

  cargarAjustes() {
    if ( localStorage.getItem('ajustes') ) {
      this.ajustes = JSON.parse(localStorage.getItem('ajustes'));
      // console.log('Cargando del localStorage');

      this.aplicarTema(this.ajustes.tema);
    } else {
      // console.log('Usando valores por defecto');
      this.aplicarTema(this.ajustes.tema);
    }
  }

  aplicarTema( tema: string ) {
    const url = `assets/css/colors/${ tema }.css`;
    // Javascript puro
    // this.myDocument.getElementById('tema').setAttribute('href', url);
    document.getElementById('tema').setAttribute('href', url);

    this.ajustes.tema = tema;
    this.ajustes.temaUrl = url;

    this.guardarAjustes();

  }

}

interface Ajustes {
  temaUrl: string;
  tema: string;
}
