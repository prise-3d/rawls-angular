import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RawlsApiService {

  x: number;
  y: number;
  name_scene: string;
  list_scenes: string[] = ['first scene', 'second scene', 'third scene'];

  listSubject = new Subject<string[]>();

  constructor() { }

  emitListScenes() {
    this.listSubject.next(this.list_scenes);
  }

  listOfScenes(){
    // call function list() in api
    this.emitListScenes();
  }

  getImageRef(name_scene: string) {
    return name_scene + '.png';
  }

}
