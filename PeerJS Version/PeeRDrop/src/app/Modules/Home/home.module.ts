import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { OpenerComponent } from './Opener/opener.component';
import { FormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    OpenerComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule
  ]
})
export class HomeModule { }
