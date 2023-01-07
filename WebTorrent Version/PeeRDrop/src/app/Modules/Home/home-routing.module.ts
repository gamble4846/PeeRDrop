import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OpenerComponent } from './Opener/opener.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: OpenerComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
