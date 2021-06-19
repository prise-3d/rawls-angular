import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
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
  previousStat: string;
  isLoaded: boolean;
  coordPixelTab: string[] = [];
  subtitleTab: string[] = [];
  hasSubtitle: boolean = false;
  statTab: number[][];
  imageGraphTab: string[] = [];

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router,
              private route: ActivatedRoute,
              private formBuilder: FormBuilder,
              private sanitizer: DomSanitizer) { 
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
          stat = stat.replace(/\\n/g, "\\n")  
               .replace(/\\'/g, "\\'")
               .replace(/\\"/g, '\\"')
               .replace(/\\&/g, "\\&")
               .replace(/\\r/g, "\\r")
               .replace(/\\t/g, "\\t")
               .replace(/\\b/g, "\\b")
               .replace(/\\f/g, "\\f");
            // remove non-printable and other non-valid JSON chars
          stat = stat.replace(/[\u0000-\u0019]+/g,""); 
          this.jsonStat = JSON.parse(stat);
          var x = 0;
          var row: number[];
          this.subtitleTab = [];
          this.coordPixelTab = [];
          this.hasSubtitle = false;
          this.jsonStat.forEach(element => {
            if(x === 3){
              var json = JSON.parse(JSON.stringify(element));
              this.imageGraphTab = json;
              for (let index = 0; index < this.imageGraphTab.length; index++) {
                this.imageGraphTab[index] = "data:image/png;base64,"+this.imageGraphTab[index]
              }
            }else{
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
            }
            x += 1;
          });
          if (stat === this.previousStat) {
            this.isLoaded = false;
          } else {
            this.isLoaded = true;
          }
        }
        this.previousStat = stat;
      }
    );
    this.rawlsApiService.emitStatPixel();
    console.log(this.isLoaded)
  }

  onChange(deviceValue) {
    if (deviceValue !== "") {
      this.rawlsApiService.getImage(deviceValue);
      this.rawlsApiService.emitImage();
      this.initForm();
      this.rawlsApiService.emitStatPixel();
      this.name_scene = deviceValue;
      var element = document.getElementsByClassName("ngxImageZoomFull");
      if (element[0]) {
        element[0].setAttribute("src",this.urlAPI+deviceValue+"/png/ref")
      }
    } else {
      this.image = undefined;
      this.statActive = false;
    }
  }

  transforme(image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(image);
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

  onImage(index) {
    var someElement= document.getElementById(index);
    if (someElement.style.maxWidth === "20%") {
      this.changeWidth(someElement,index);
    } else {
      var element = document.getElementsByClassName("col-xs-12")
      if (element.length == 2) {
        var a = document.getElementById("sceneSelect")
        a.setAttribute("style","display:static;");
        element[1].className = "col-xs-6";
        element = document.getElementsByClassName("col-xs-6")
        element[0].setAttribute("style","display:static;");
        element = document.getElementsByClassName("table table-striped")
        element[0].setAttribute("style","display:static;")
        this.changeWidth(someElement,index,true)
      } else {
        var a = document.getElementById("sceneSelect")
        a.setAttribute("style","display:none;");
        element = document.getElementsByClassName("col-xs-6")
        element[0].setAttribute("style","display:none;");
        element[1].className = "col-xs-12";
        element = document.getElementsByClassName("table table-striped")
        element[0].setAttribute("style","display:none;")
        this.changeWidth(someElement,index)
      }
    }
  }

  onClick() {
    var element = document.getElementsByClassName("ngxImageZoomFullContainer ngxImageZoomLensEnabled");
    console.log(element[0])
    console.log(element[0].getAttribute("style"))
    var border = 0;
    var reg = /border-radius: /
    border = this.searchElement(element,reg,(String(reg).length - 2))
    reg = /top: /
    var y = this.searchElement(element,reg,(String(reg).length - 2)) + border
    reg = /left: /
    var x = this.searchElement(element,reg,(String(reg).length - 2)) + border
    // this.rawlsApiService.getStatPixel(this.name_scene,x,y);
    // this.rawlsApiService.emitStatPixel();
    this.statPixelForm.get('x').setValue(x);
   this.statPixelForm.get('y').setValue(y);
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

  changeWidth(someElement: HTMLElement,index: string,all?: boolean) {
    if (all) {
        someElement= document.getElementById("0");
        someElement.setAttribute("style","max-width: 100%;");
        someElement= document.getElementById("1");
        someElement.setAttribute("style","max-width: 100%;");
        someElement= document.getElementById("2");
        someElement.setAttribute("style","max-width: 100%;");
    } else {
      if (index == "0") {
        someElement.setAttribute("style","max-width: 100%;");
        someElement= document.getElementById("1");
        someElement.setAttribute("style","max-width: 20%;");
        someElement= document.getElementById("2");
        someElement.setAttribute("style","max-width: 20%;");
        
      }else if(index == "1"){
        someElement.setAttribute("style","max-width: 100%;");
        someElement= document.getElementById("0");
        someElement.setAttribute("style","max-width: 20%;");
        someElement= document.getElementById("2");
        someElement.setAttribute("style","max-width: 20%;");
      }else {
        someElement.setAttribute("style","max-width: 100%;");
        someElement= document.getElementById("0");
        someElement.setAttribute("style","max-width: 20%;");
        someElement= document.getElementById("1");
        someElement.setAttribute("style","max-width: 20%;");
      }
    }
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
