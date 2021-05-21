import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-image-scene',
  templateUrl: './image-scene.component.html',
  styleUrls: ['./image-scene.component.scss']
})
export class ImageSceneComponent implements OnInit, OnDestroy {

  image: string;
  imageSubscription: Subscription;
  name_scene: string = this.route.snapshot.params['name_scene'];
  urlAPI: string;

  error: boolean = false;

  constructor(private route: ActivatedRoute,
              private rawlsApiService: RawlsApiService,
              private router: Router) { 
                this.urlAPI = rawlsApiService.urlAPI;
              }

  ngOnInit(): void {
    this.imageSubscription = this.rawlsApiService.imageSubject.subscribe(
      (image_path: string) => {
        if(image_path !== undefined) {
          if (image_path.startsWith('ERROR :')) {
            this.error = true;
            this.image = image_path;
          } else {
            this.error = false;
            this.image = this.urlAPI + image_path;
          }
        }
        
      }
    );
    this.rawlsApiService.getImage(this.name_scene);
    this.rawlsApiService.emitImage();
  }

  onList() {
    this.router.navigate(['/list']);
  }

  onStat() {
    this.router.navigate([this.name_scene+'/pixelStatForm']);
  }

  onStatList() {
    this.router.navigate([this.name_scene+'/listPixelStatForm']);
  }

  ngOnDestroy(){
    this.imageSubscription.unsubscribe();
  }

}
