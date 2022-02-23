import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

//importacion para el modulo de notificaciones push
import { OneSignal } from '@awesome-cordova-plugins/onesignal/ngx';

//Modulo para guardar localmente    
import { IonicStorageModule } from '@ionic/storage-angular';

//Modulo para guardar localmente informacion
import { Storage } from '@ionic/storage-angular';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot()],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, OneSignal],
  bootstrap: [AppComponent],
})
export class AppModule { }
