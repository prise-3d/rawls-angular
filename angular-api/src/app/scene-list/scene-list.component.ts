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

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.list_scenesSubscription = this.rawlsApiService.listSubject.subscribe(
      (list_scenes: string[]) => {
        this.list_scenes = list_scenes;
      }
    );
    this.rawlsApiService.getListOfScenes();
    console.log("list : "+this.list_scenes);
    this.rawlsApiService.emitListScenes();
    console.log("list : "+this.list_scenes)
  }

  onShowImage(index: number) {
    const name_scene = this.list_scenes[index];
    this.router.navigate([name_scene,'png','ref']);
  }

  ngOnDestroy(){
    this.list_scenesSubscription.unsubscribe();
  }

}
