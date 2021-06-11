import { HttpClient } from '@angular/common/http';
import { Injectable, Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';

import * as config from '../../assets/config.json';

@Injectable({
  providedIn: 'root'
})
//This service call API rawls to retrieve the information you want
export class RawlsApiService {

  urlAPI: string = config.urlAPI;

  x: number;
  y: number;
  name_scene: string;
  list_scenes: string[] = [];
  up: string;
  image_path: string;
  statPixel: string;
  listStatPixel: string;

  listSubject = new Subject<string[]>();
  listStatPixelSubject = new Subject<string>();
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

  emitListStatPixel() {
    this.listStatPixelSubject.next(this.listStatPixel);
  }
  //call api with : apiRoute + /list
  async getListOfScenes(){
    this.list_scenes = []
    await this.http.get<any>(this.urlAPI+'list').toPromise().then(data => {
            this.userAPI = data.rawls_folders;
            if (this.userAPI !== undefined) {
              this.userAPI.forEach(element => {
                this.list_scenes.push(element)
              });
            }
    })
    this.emitListScenes();
  }
  //call api with : apiRoute + /up
  async getUp() {
    await this.http.get<any>(this.urlAPI+'up').toPromise().then(
      data => {
        this.up = data.version;
      }
    )
    this.emitUp();
  }
  //call api with : apiRoute + /png/ref
  async getImage(name_scene: string) {
    await this.http.get<any>(this.urlAPI+name_scene+'/png/ref').toPromise().then(
      data => {
        this.image_path = data.error;
      }, reject => {
        this.image_path = this.urlAPI+name_scene+'/png/ref';
      }
    );
    this.emitImage();
  }
  //call api with : apiRoute + /x/y
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
  //call api with : apiRoute + /x/y/samples
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

  async postListStatPixel(name_scene: string, pixels: number[]) {
    console.log("In")
    console.log("list : ",pixels)
    const body=JSON.stringify(pixels)
    console.log("body = "+body)
    await this.http.post<any>(this.urlAPI+'stats_list/'+name_scene+'/20',{"pixels": pixels}).toPromise().then(
      data => {
        if (data.error) {
          this.listStatPixel = data.error;
        } else {
          this.listStatPixel = data;
        }
      }
    );
    this.emitListStatPixel();
  }

  async postListStatPixelWithSamples(name_scene: string, pixels: number[], samples: number) {
    await this.http.post<any>(this.urlAPI+'/stats_list/'+name_scene+'/'+samples,{"pixels": pixels}).toPromise().then(
      data => {
        if (data.error) {
          this.listStatPixel = data.error;
        } else {
          this.listStatPixel = data;
        }
    });
    this.emitListStatPixel();
  }

}
