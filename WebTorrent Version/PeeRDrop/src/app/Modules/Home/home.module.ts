import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { OpenerComponent } from './Opener/opener.component';
import { FormsModule } from '@angular/forms';

import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzUploadModule } from 'ng-zorro-antd/upload';


@NgModule({
  declarations: [
    OpenerComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    NzInputModule,
    FormsModule,
    NzButtonModule,
    NzUploadModule
  ]
})
export class HomeModule { }
