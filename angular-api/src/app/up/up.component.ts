import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RawlsApiService } from '../services/rawls-api.service';

import { versionInfo } from '../version-info';
import * as version from '../../../git-version.json';

@Component({
  selector: 'app-up',
  templateUrl: './up.component.html',
  styleUrls: ['./up.component.scss']
})
export class UpComponent implements OnInit, OnDestroy {

  up: string;
  versionAngular: string;
  
  upSubscription: Subscription;

  constructor(private rawlsApiService: RawlsApiService) { }

  ngOnInit(): void {
    this.upSubscription = this.rawlsApiService.upSubject.subscribe(
      (up: string) => {
        this.up = up;
      }
    );
    this.rawlsApiService.getUp();
    this.rawlsApiService.emitUp();
    this.versionAngular = version.tag;
  }

  ngOnDestroy(){
    this.upSubscription.unsubscribe();
  }

}
