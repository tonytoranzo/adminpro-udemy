import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-promesas',
  templateUrl: './promesas.component.html',
  styles: []
})
export class PromesasComponent implements OnInit {

  constructor() {

    this.contarTres()
      .then( (mensaje) => console.log('Terminó', mensaje) )
      .catch( error => console.error('Error en la promesa', error) );
  }

  ngOnInit(): void {
  }

  contarTres(): Promise<boolean> {
    return new Promise<boolean>( (resolve, reject) => {

      let contador = 0;

      const intervalo = setInterval( () => {
        contador += 1;

        if (contador === 3) {
          resolve(true);
          // reject('Hubo un error');
          clearInterval(intervalo);
        }

      }, 1000 );

    });
  }

}
