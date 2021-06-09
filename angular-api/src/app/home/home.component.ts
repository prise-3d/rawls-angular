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
  name_scene: string;

  jsonStat;
  coordPixelTab: string[] = [];
  subtitleTab: string[] = [];
  hasSubtitle: boolean = false;
  statTab: number[][];

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
          this.hasSubtitle = false;
          console.log("here")
          this.jsonStat = JSON.parse(stat);
          var x = 0;
          var row: number[];
          this.subtitleTab = [];
          this.coordPixelTab = [];
          this.jsonStat.forEach(element => {
            console.log(element)
            this.coordPixelTab.push(element[0]);
            var json = JSON.parse(JSON.stringify(element[1]));
            var stat = json,key;
            row = [];
            for (key in stat) {
              if (stat.hasOwnProperty(key)) {
                if (!this.hasSubtitle) {
                  this.subtitleTab.push(key);
                }
                row.push(stat[key]);
              }
            }
            if (!this.hasSubtitle) {
              this.statTab = this.create2DArray(this.subtitleTab.length,3, (row, column) => 0);
            }
            for (let index = 0; index < row.length; index++) {
              this.statTab[index][x] = row[index];
            }
            this.hasSubtitle = true;
            x += 1;
          });
        }
      }
    );
    this.rawlsApiService.emitStatPixel();
    
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

  create2DArray(rows, columns, value = (x, y) => 0) {
    var array = new Array(rows);
    for (var i = 0; i < rows; i++) {
      array[i] = new Array(columns);
      for (var j = 0; j < columns; j++) {
        array[i][j] = value(i, j);
      }
    }
  
    return array;
  }

  ngOnDestroy(){
    this.list_scenesSubscription.unsubscribe();
    this.imageSubscription.unsubscribe();
    this.statPixelSubscription.unsubscribe();
  }

}
