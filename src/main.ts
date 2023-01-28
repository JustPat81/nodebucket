/**
 * Title: main.ts
 * Author: Prof. Krasso
 * Date: 15 January 2023
 * Modified By: Patrick Wolff
 * Description: main.ts file for nodebucket application
 */

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
