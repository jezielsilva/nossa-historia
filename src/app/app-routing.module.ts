import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultPageComponent } from './default-page/default-page.component';
import { AlbunsComponent } from './albuns/albuns.component';
import { HomeComponent } from './home/home.component';
import { FotosComponent } from './fotos/fotos.component';

const routes: Routes = [

  {path:'', component: DefaultPageComponent, children:[
    {path: 'home', component: HomeComponent},
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'index', redirectTo:'home', pathMatch:'full'},
    {path: 'albuns', component: AlbunsComponent},
    {path: 'fotos/:albumNome', component: FotosComponent}
  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
