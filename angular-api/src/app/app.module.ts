import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { SceneListComponent } from './scene-list/scene-list.component';
import { ImageSceneComponent } from './scene-list/image-scene/image-scene.component';
import { PixelStatComponent } from './stat/pixel-stat/pixel-stat.component';
import { ListPixelStatComponent } from './stat/list-pixel-stat/list-pixel-stat.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http'
import { RouterModule, Routes } from '@angular/router';
import { RawlsApiService } from './services/rawls-api.service';
import { UpComponent } from './up/up.component';
import { PixelStatFormComponent } from './stat/pixel-stat/pixel-stat-form/pixel-stat-form.component';
import { ListPixelStatFormComponent } from './stat/list-pixel-stat/list-pixel-stat-form/list-pixel-stat-form.component';

// link between path Angular and component
const appRoutes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'list', component: SceneListComponent },
  { path: 'up', component: UpComponent},
  { path: 'stats_list/:name_scene', component: ListPixelStatComponent },
  { path: 'stats_list/:name_scene/:nb_samples', component: ListPixelStatComponent },
  { path: ':name_scene/listPixelStatForm', component: ListPixelStatFormComponent },
  { path: ':name_scene/png/ref', component: ImageSceneComponent },
  { path: ':name_scene/pixelStatForm', component: PixelStatFormComponent },
  { path: ':name_scene/:x/:y', component: PixelStatComponent },
  { path: ':name_scene/:x/:y/:nb_samples', component: PixelStatComponent },
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: '**', redirectTo: 'list'}
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SceneListComponent,
    ImageSceneComponent,
    PixelStatComponent,
    ListPixelStatComponent,
    HomeComponent,
    UpComponent,
    PixelStatFormComponent,
    ListPixelStatFormComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [
    RawlsApiService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
