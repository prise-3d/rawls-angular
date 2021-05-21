import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-list-pixel-stat-form',
  templateUrl: './list-pixel-stat-form.component.html',
  styleUrls: ['./list-pixel-stat-form.component.scss']
})
export class ListPixelStatFormComponent implements OnInit, OnDestroy {

  listStatPixelForm: FormGroup;
  listStatPixelSubscription: Subscription;
  name_scene: string = this.router.url.split('/')[1]

  listStatPixel: string;

  constructor(private formBuilder: FormBuilder,
              private rawlsApiService: RawlsApiService,
              private router: Router) {
                this.listStatPixelForm = this.formBuilder.group({
                  pixels: this.formBuilder.array([])
               });
              }

  ngOnInit(): void {
    this.listStatPixelSubscription = this.rawlsApiService.listStatPixelSubject.subscribe(
      (stat: string) => {
        this.listStatPixel = stat;
      }
    );
    this.rawlsApiService.emitStatPixel();
    this.initForm();
  }

  initForm() {
    this.listStatPixelForm = this.formBuilder.group({
      samples: [],
      pixels: this.formBuilder.array([])
    });
  }

  onSubmit(){
    const formValue = this.listStatPixelForm.value;
    const pixels =  formValue['pixels'] ? formValue['pixels'] : []
    const samples = formValue['samples'];
    console.log("pixels : "+pixels)
    // if (samples) {
    //   this.rawlsApiService.postListStatPixelWithSamples(this.name_scene,pixels,samples);
    //   this.rawlsApiService.emitListStatPixel();
    //   this.router.navigate(['/stats_list/'+this.name_scene+'/'+samples])
    // } else {
    //   this.rawlsApiService.postListStatPixel(this.name_scene,pixels);
    //   this.rawlsApiService.emitListStatPixel();
    //   this.router.navigate(['/stats_list/'+this.name_scene])
    // }
    
  }

  getPixels(){
    return this.listStatPixelForm.get('pixels') as FormArray;
  }

  onAddPixel(){
    // const newXControl = this.formBuilder.control('', [Validators.required, Validators.minLength(0)]);
    // const newYControl = this.formBuilder.control('', [Validators.required, Validators.minLength(0)]);
    // const newPixelControl = [newXControl, newYControl]
    // this.getPixels().controls(newPixelControl);
    const group = new FormGroup({
      x: new FormControl('',[Validators.required, Validators.minLength(0)]),
      y: new FormControl('',[Validators.required, Validators.minLength(0)])
    });
    this.getPixels().push(group)
  }

  ngOnDestroy() {
    this.listStatPixelSubscription.unsubscribe();
  }

}
