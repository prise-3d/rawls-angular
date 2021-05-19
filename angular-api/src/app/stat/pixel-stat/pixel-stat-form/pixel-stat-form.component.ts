import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-pixel-stat-form',
  templateUrl: './pixel-stat-form.component.html',
  styleUrls: ['./pixel-stat-form.component.scss']
})

export class PixelStatFormComponent implements OnInit {

  statPixelForm: FormGroup;
  statPixelSubscription: Subscription;

  statPixel: string;

  constructor(private formBuilder: FormBuilder,
              private rawlsApiService: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    this.statPixelSubscription = this.rawlsApiService.statPixelSubject.subscribe(
      (stat: string) => {
        this.statPixel = stat;
      }
    );
    this.rawlsApiService.emitStatPixel();
    this.initForm();
  }

  initForm() {
    this.statPixelForm = this.formBuilder.group({
      x: [, Validators.required],
      y: [, Validators.required],
      samples: []
    });
  }

  onSubmit(){
    const name_scene = this.router.url.split('/')[1]
    const x = this.statPixelForm.get('x').value;
    const y = this.statPixelForm.get('y').value;
    const samples = this.statPixelForm.get('samples').value;
    if (samples) {
      this.rawlsApiService.getStatPixelWithSamples(name_scene,x,y,samples);
      this.rawlsApiService.emitStatPixel();
      this.router.navigate(['/'+name_scene+'/'+x+'/'+y+'/'+samples])
    } else {
      this.rawlsApiService.getStatPixel(name_scene,x,y);
      this.rawlsApiService.emitStatPixel();
      this.router.navigate(['/'+name_scene+'/'+x+'/'+y])
    }
    
  }

}
