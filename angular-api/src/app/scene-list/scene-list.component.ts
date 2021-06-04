import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from '../services/rawls-api.service';

@Component({
  selector: 'app-scene-list',
  templateUrl: './scene-list.component.html',
  styleUrls: ['./scene-list.component.scss']
})
export class SceneListComponent implements OnInit, OnDestroy {

  list_scenes: string[];
  list_scenesSubscription: Subscription;

  image: string;
  error: boolean;
  imageSubscription: Subscription;

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.list_scenesSubscription = this.rawlsApiService.listSubject.subscribe(
      (list_scenes: string[]) => {
        this.list_scenes = list_scenes;
      }
    );
    this.rawlsApiService.getListOfScenes();
    this.rawlsApiService.emitListScenes();
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
  }

  onShowImage(name_scene: string) {
    // const name_scene = this.list_scenes[index];
    this.router.navigate([name_scene,'png','ref']);
  }

  // async getSrcImage(name_scene: string) {
  //   if(name_scene !== undefined){  
  //     this.rawlsApiService.getImage(name_scene);
  //     this.rawlsApiService.emitImage();
  //     console.log(this.image)
  //     return this.image;
  //   }
  // }

  ngOnDestroy(){
    this.list_scenesSubscription.unsubscribe();
  }

}
