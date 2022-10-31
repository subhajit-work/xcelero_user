import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { StudentRegisterPage } from './student-register.page';

const routes: Routes = [
  {
    path: '',
    component: StudentRegisterPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [StudentRegisterPage]
})
export class StudentRegisterPageModule {}
