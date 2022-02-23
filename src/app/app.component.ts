import { Component } from '@angular/core';
import { PushService } from './services/push.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  //inyectamos nuestro servicio de notificaciones lo más arriba que podamos del programa (aquí)
  constructor(
    private pushService: PushService
  ) {
    //iniciamos la configuracion de las
    this.pushService.configuracionInicial()
  }
}
