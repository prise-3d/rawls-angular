import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-list-pixel-stat',
  templateUrl: './list-pixel-stat.component.html',
  styleUrls: ['./list-pixel-stat.component.scss']
})
export class ListPixelStatComponent implements OnInit, OnDestroy {

  listStatPixel: string;
  list_stat: string[];
  listStatPixelSubscription: Subscription;
  name_scene: string = this.router.url.split('/')[2];

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.listStatPixelSubscription = this.rawlsApiService.listStatPixelSubject.subscribe(
      (stat: string) => {
        if (stat !== undefined) {
          this.listStatPixel = stat;
          this.list_stat = this.listStatPixel.split(',');
        }
      }
    );
    this.rawlsApiService.emitListStatPixel();
    
  }

  onBack() {
    console.log("yes")
    this.router.navigate(['/'+this.name_scene+'/listPixelStatForm']);
  }

  ngOnDestroy(){
    this.listStatPixelSubscription.unsubscribe();
  }

}
