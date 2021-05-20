import { HttpClient } from '@angular/common/http';
import { Injectable, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RawlsApiService {

  urlAPI: string = 'http://127.0.0.1:5001/';

  x: number;
  y: number;
  name_scene: string;
  list_scenes: string[] = [];
  up: string;
  image_path: string;
  statPixel: string;

  listSubject = new Subject<string[]>();
  upSubject = new Subject<string>();
  imageSubject = new Subject<string>();
  statPixelSubject = new Subject<string>();

  userAPI;

  constructor(private http: HttpClient) { }

  emitListScenes() {
    this.listSubject.next(this.list_scenes);
  }

  emitUp() {
    this.upSubject.next(this.up);
  }

  emitImage() {
    this.imageSubject.next(this.image_path);
  }

  emitStatPixel() {
    this.statPixelSubject.next(this.statPixel);
  }

  async getListOfScenes(){
    this.list_scenes = []
    await this.http.get<any>(this.urlAPI+'list').toPromise().then(data => {
            this.userAPI = data.rawls_folders;
            this.userAPI.forEach(element => {
              this.list_scenes.push(element)
            });
    })
    this.emitListScenes();
  }

  async getUp() {
    await this.http.get<any>(this.urlAPI+'up').toPromise().then(
      data => {
        this.up = data;
      }
    )
    this.emitUp();
  }

  async getImage(name_scene: string) {
    await this.http.get<any>(this.urlAPI+name_scene+'/png/ref').toPromise().then(
      data => {
        if (data.image_path) {
          this.image_path = data.image_path;
        } else {
          this.image_path = data.error;
        }
      }
    );
    this.emitImage();
  }

  async getStatPixel(name_scene: string, x: number, y: number) {
    await this.http.get<any>(this.urlAPI+name_scene+'/'+x+'/'+y).toPromise().then(
      data => {
        if (data.error) {
          this.statPixel = data.error;
        } else {
          this.statPixel = data;
        }
      }
    );
    this.emitStatPixel();
  }

  async getStatPixelWithSamples(name_scene: string, x: number, y: number, samples: number) {
    await this.http.get<any>(this.urlAPI+name_scene+'/'+x+'/'+y+'/'+samples).toPromise().then(
      data => {
        if (data.error) {
          this.statPixel = data.error;
        } else {
          this.statPixel = data;
        }
    });
    this.emitStatPixel();
  }

}
