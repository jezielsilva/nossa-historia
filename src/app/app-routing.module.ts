import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultPageComponent } from './default-page/default-page.component';

const routes: Routes = [

  {path:'', component: DefaultPageComponent, children:[
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'index', redirectTo:'home', pathMatch:'full'}

  ]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
