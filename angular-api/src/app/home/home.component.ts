import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from '../services/rawls-api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  list_scenes: string[];
  list_scenesSubscription: Subscription
  image: string;
  imageSubscription: Subscription;
  urlAPI: string;

  error: boolean = false;
  statActive: boolean = false;

  statPixelForm: FormGroup;
  statPixelSubscription: Subscription;
  list_stat: string[];
  name_scene: string;

  statPixel: string;

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder) { 
                this.urlAPI = rawlsApiService.urlAPI;
              }

  ngOnInit(): void {
    this.list_scenesSubscription = this.rawlsApiService.listSubject.subscribe(
      (list_scenes: string[]) => {
        if(list_scenes !== undefined){
          this.list_scenes = list_scenes;
          if(list_scenes[0] !== undefined) {
            this.onChange(list_scenes[0]);
          }
        }
      }
    );
    this.rawlsApiService.getListOfScenes();
    this.rawlsApiService.emitListScenes();

    this.imageSubscription = this.rawlsApiService.imageSubject.subscribe(
      (image_path: string) => {
        if (image_path !== undefined) {
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

    this.statPixelSubscription = this.rawlsApiService.statPixelSubject.subscribe(
      (stat: string) => {
        if (stat !== undefined) {
          this.statPixel = stat;
          this.list_stat = this.statPixel.split(',');
        }
      }
    );
    
  }

  onChange(deviceValue) {
    if (deviceValue !== "") {
      this.rawlsApiService.getImage(deviceValue);
      this.rawlsApiService.emitImage();
      this.initForm();
      this.rawlsApiService.emitStatPixel();

      this.name_scene = deviceValue;
    } else {
      this.image = undefined;
      this.statActive = false;
    }
  }

  initForm() {
    this.statPixelForm = this.formBuilder.group({
      x: [, Validators.required],
      y: [, Validators.required],
      samples: []
    });
  }

  onSubmit(){
    const x = this.statPixelForm.get('x').value;
    const y = this.statPixelForm.get('y').value;
    const samples = this.statPixelForm.get('samples').value;
    if (samples) {
      this.rawlsApiService.getStatPixelWithSamples(this.name_scene,x,y,samples);
      this.rawlsApiService.emitStatPixel();
    } else {
      this.rawlsApiService.getStatPixel(this.name_scene,x,y);
      this.rawlsApiService.emitStatPixel();
    }
    this.statActive = true;
  }

  onClick() {
    this.router.navigate([this.name_scene,'png','ref'])
  }

  ngOnDestroy(){
    this.list_scenesSubscription.unsubscribe();
    this.imageSubscription.unsubscribe();
    this.statPixelSubscription.unsubscribe();
  }

}
