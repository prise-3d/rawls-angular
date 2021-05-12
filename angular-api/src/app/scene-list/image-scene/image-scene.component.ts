import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RawlsApiService } from 'src/app/services/rawls-api.service';

@Component({
  selector: 'app-image-scene',
  templateUrl: './image-scene.component.html',
  styleUrls: ['./image-scene.component.scss']
})
export class ImageSceneComponent implements OnInit {

  image: string;

  constructor(private route: ActivatedRoute,
              private rawlsApi: RawlsApiService,
              private router: Router) { }

  ngOnInit(): void {
    const name_scene = this.route.snapshot.params['name_scene'];
    this.image = this.rawlsApi.getImageRef(name_scene)
  }

  onBack() {
    this.router.navigate(['/list']);
  }

}
