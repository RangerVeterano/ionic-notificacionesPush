import { Injectable, EventEmitter } from '@angular/core';


//importamos el plugin de onesignal
import { OneSignal, OSNotification, OSNotificationPayload } from '@awesome-cordova-plugins/onesignal/ngx';

import { Storage } from '@ionic/storage-angular';


@Injectable({
  providedIn: 'root'
})
export class PushService {

  private _storage: Storage | null = null;

  mensajes: OSNotificationPayload[] = [
    // {
    //   title: 'Titulo de la push',
    //   body: 'Este es el cuerpo de la notificacion',
    //   date: new Date()
    // }
  ];

  private _userId: string;

  get userId(): string {
    return this._userId;
  }

  pushListener = new EventEmitter<OSNotificationPayload>();

  constructor(
    private oneSignal: OneSignal,
    private storage: Storage) {

    this.init();
  }

  async init() {
    // If using, define drivers here: await this.storage.defineDriver(/*...*/);
    const storage = await this.storage.create();
    this._storage = storage;

    this.cargarMensajes();
  }


  configuracionInicial() {

    this.oneSignal.startInit('2cc81f9a-0877-403b-a472-3f8c7fab5b0c', '689624457372');

    this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);

    this.oneSignal.handleNotificationReceived().subscribe((noti) => {
      // do something when notification is received
      console.log('Notificacióin recibida', noti);
      this.notificacionRecibida(noti)
    });

    this.oneSignal.handleNotificationOpened().subscribe(async (noti) => {
      // do something when a notification is opened
      console.log('Notificacion abierta', noti.notification);
      await this.notificacionRecibida(noti.notification)
    });

    this.oneSignal.handleInAppMessageClicked().subscribe(noti => {
      console.log('Notificacion en app clicada', JSON.stringify(noti));
    })

    //Obtener el id del subscriptor
    this.oneSignal.getIds()
      .then(info => {
        this._userId = info.userId
        console.log(this._userId);
      })

    this.oneSignal.endInit();
  }

  //metodo para manejar las notificaciones
  async notificacionRecibida(noti: OSNotification) {

    await this.cargarMensajes();//Cargamos todos los mensajes

    const payload = noti.payload;

    //Comprobamos para que no se inserte dos veces la misma notificacion
    const existePush = this.mensajes.find(mensaje => mensaje.notificationID === payload.notificationID)

    if (existePush) {
      return;
    }

    this.mensajes.unshift(payload);
    this.pushListener.emit(payload);

    await this.guardarMensajes();
  }

  guardarMensajes() {

    this._storage.set('mensajes', this.mensajes)
  }

  async borrarMensajes() {
    await this._storage.clear();
    this.mensajes = [];
    this.guardarMensajes();
  }

  async getMensajes() {
    await this.cargarMensajes();
    return [...this.mensajes]
  }

  async cargarMensajes() {
    this.mensajes = await this._storage.get('mensajes') || [];
    return this.mensajes;
  }
}
