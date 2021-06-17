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
  realSrc: string;

  error: boolean = false;

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
          }
        }  
      }
    );
    this.rawlsApiService.getImage(this.name_scene);
    this.rawlsApiService.emitImage();
    this.realSrc = this.rawlsApiService.urlAPI+this.name_scene+"/png/ref"
  }

  onHover() {
    var element = document.getElementsByClassName("ngxImageZoomFull");
      if (element[0]) {
        element[0].setAttribute("src",this.realSrc)
      }
  }

  onClick() {
    var element = document.getElementsByClassName("ngxImageZoomFullContainer ngxImageZoomLensEnabled");
    var border = 0;
    var reg = /border-radius: /
    border = this.searchElement(element,reg,(String(reg).length - 2))
    reg = /top: /
    var y = this.searchElement(element,reg,(String(reg).length - 2)) + border
    reg = /left: /
    var x = this.searchElement(element,reg,(String(reg).length - 2)) + border
    this.rawlsApiService.getStatPixel(this.name_scene,x,y);
    this.rawlsApiService.emitStatPixel();
    this.router.navigate(['/'+this.name_scene+'/'+x+'/'+y])
  }

  searchElement(element:HTMLCollectionOf<Element>,regexp: RegExp,lengthRegexp: number) {
    var a = element[0].getAttribute("style").search(regexp);
    if ( a == -1 ) { 
      alert("Refresh Page")
    } else { 
      var border: string = "";
      for (let index = a+lengthRegexp; index < element[0].getAttribute("style").length; index++) {
        const char = element[0].getAttribute("style")[index];
        if (char==="p") {
          break;
        } else {
          border += char;
        }
      }
      return Number(border); 
    }
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
