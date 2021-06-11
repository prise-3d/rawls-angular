import { Component, OnDestroy, OnInit} from '@angular/core';
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

  error: boolean = false;

  mouseWheelDir: string = '';
  imgWidth: number;
  firstCoordinate: boolean = true;
  naturalWidth: number;
  naturalHeight: number;

  constructor(private route: ActivatedRoute,
              private rawlsApiService: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.imageSubscription = this.rawlsApiService.imageSubject.subscribe(
      (image_path: string) => {
        if(image_path !== undefined) {
          if (image_path.startsWith('ERROR :')) {
            this.error = true;
            this.image = image_path;
          } else {
            this.error = false;
            this.image = image_path;
            const img = new Image();
            img.src = this.image;
            img.onload = () => this.getWidth(img);
          }
        }  
      }
    );
    this.rawlsApiService.getImage(this.name_scene);
    this.rawlsApiService.emitImage();
  }

  getWidth(img){
    this.naturalWidth = img.naturalWidth;
    this.naturalHeight = img.naturalHeight;
    this.imgWidth = img.naturalWidth;
  }

  onImage(event) {
    console.log(event)
    console.log("(x,y) : "+event.offsetX+","+event.offsetY);
    var scale = this.imgWidth/this.naturalWidth;
    console.log("scale = "+scale);
    var pixelX = (event.offsetX - event.offsetX%scale)/scale;
    var pixelY = (event.offsetY - event.offsetY%scale)/scale;
    console.log("x, y"+pixelX+","+pixelY)
    this.rawlsApiService.getStatPixel(this.name_scene,pixelX,pixelY);
    this.rawlsApiService.emitStatPixel();
    this.router.navigate(['/'+this.name_scene+'/'+pixelX+'/'+pixelY])
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

  mouseWheelUpFunc() {
    this.imgWidth = this.imgWidth+50;
  }

  mouseWheelDownFunc() {
    if(this.imgWidth-50 > 10){
      this.imgWidth = this.imgWidth-50;
    }
  }

  yes() {
    console.log("image "+this.image)
  }


  ngOnDestroy(){
    this.imageSubscription.unsubscribe();
  }

}
