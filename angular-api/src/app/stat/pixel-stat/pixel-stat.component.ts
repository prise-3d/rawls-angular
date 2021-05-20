import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-pixel-stat',
  templateUrl: './pixel-stat.component.html',
  styleUrls: ['./pixel-stat.component.scss']
})
export class PixelStatComponent implements OnInit {

  statPixel: string;
  statPixelSubscription: Subscription;
  name_scene: string = this.router.url.split('/')[1];

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.statPixelSubscription = this.rawlsApiService.statPixelSubject.subscribe(
      (stat: string) => {
        this.statPixel = stat;
      }
    );
    this.rawlsApiService.emitStatPixel();
  }

  onBack() {
    this.router.navigate(['/'+this.name_scene+'/pixelStatForm']);
  }

  ngOnDestroy(){
    this.statPixelSubscription.unsubscribe();
  }

}
