import { ApplicationRef, Component } from '@angular/core';
import { PushService } from '../services/push.service';
import { OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  mensajes: OSNotificationPayload[] = [];

  userId = this.ps.userId;

  //inyectamos nuestro servicio de notificaciones
  //ApplicationRef nos permite volver a ejecutar el ciclo de cambios de angular manualmente
  constructor(
    private ps: PushService,
    private applicationRef: ApplicationRef) {

    ps.pushListener.subscribe(noti => {
      this.mensajes.unshift(noti)
      this.applicationRef.tick();
    })
  }

  async ionViewWillEnter() {

    this.mensajes = await this.ps.getMensajes();
  }

  async borrarMensajes() {
    await this.ps.borrarMensajes()
    this.mensajes = []; //Purgamos los mensajes locales
  }

}
