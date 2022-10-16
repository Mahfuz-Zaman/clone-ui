import { NgModule } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';
import {NgxSsrCacheModule} from '@ngx-ssr/cache';

@NgModule({
  imports: [
    AppModule,
    NgxSsrCacheModule.configLruCache({ maxAge: 10 * 60_000, maxSize: 50 }),
    ServerModule,
  ],
  bootstrap: [AppComponent],
})
export class AppServerModule {}
