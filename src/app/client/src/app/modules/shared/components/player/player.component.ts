import { WindowScrollService, ConfigService } from './../../services';

import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, Input, OnDestroy, Output, EventEmitter, OnChanges } from '@angular/core';
import * as _ from 'lodash';
import * as $ from 'jquery';
import {PlayerConfig} from './../../interfaces';

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnInit, OnChanges {
  @Input() playerConfig: PlayerConfig;
  @Output() contentProgressEvent = new EventEmitter<any>();
  @ViewChild('contentIframe') contentIframe: ElementRef;
  constructor(public configService: ConfigService) { }
  /**
   * showPlayer method will be called
   */
  ngOnInit() {
    this.showPlayer();
  }

  ngOnChanges() {
    this.showPlayer();
  }
  /**
   * Initializes player with given config and emits player telemetry events
   * Emits event when content starts playing and end event when content was played/read completely
   */
  showPlayer () {
    const iFrameSrc = this.configService.appConfig.PLAYER_CONFIG.baseURL;
    setTimeout(() => {
      this.contentIframe.nativeElement.src = iFrameSrc;
      this.contentIframe.nativeElement.onload = () => {
        this.adjustPlayerHeight();
        this.contentIframe.nativeElement.contentWindow.initializePreview(this.playerConfig);
      };
    }, 0);
    this.contentIframe.nativeElement.addEventListener('renderer:telemetry:event', (event: any) => {
      if (event.detail.telemetryData.eid && (event.detail.telemetryData.eid === 'START' || event.detail.telemetryData.eid === 'END')) {
        this.contentProgressEvent.emit(event);
      }
    });
  }
  /**
   * Adjust player height after load
   */
  adjustPlayerHeight () {
    const playerWidth = $('#contentPlayer').width();
    if (playerWidth) {
      const height = playerWidth * (9 / 16);
      $('#contentPlayer').css('height', height + 'px');
    }
  }
}
