import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from '../services/rawls-api.service';

@Component({
  selector: 'app-up',
  templateUrl: './up.component.html',
  styleUrls: ['./up.component.scss']
})
export class UpComponent implements OnInit, OnDestroy {

  up: string;
  
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
  }

  ngOnDestroy(){
    this.upSubscription.unsubscribe();
  }

}
