import { Component, OnDestroy, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-pixel-stat',
  templateUrl: './pixel-stat.component.html',
  styleUrls: ['./pixel-stat.component.scss']
})
export class PixelStatComponent implements OnInit, OnDestroy {

  jsonStat;
  coordPixelTab: string[] = [];
  imageGraphTab: string[] = [];
  subtitleTab: string[] = [];
  hasSubtitle: boolean = false;
  statTab: any[][];
  statPixelSubscription: Subscription;
  name_scene: string = this.router.url.split('/')[1];

  constructor(private rawlsApiService: RawlsApiService,
              private router: Router,
              private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
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
        }
      }
    );
    this.rawlsApiService.emitStatPixel();
  }

  transforme(image) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(image);
  }

  onBack() {
    this.router.navigate(['/'+this.name_scene+'/pixelStatForm']);
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
    this.statPixelSubscription.unsubscribe();
  }

}
