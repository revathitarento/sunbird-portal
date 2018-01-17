import { Component } from '@angular/core';
//import * as appConfig from './config/appConfig.json'
import { config } from './config/config';

// console.log(appConfig.config);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
}
