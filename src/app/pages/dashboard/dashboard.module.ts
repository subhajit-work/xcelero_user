import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { SharedModule } from '../../shared/shared.module';
import { DashboardPage } from './dashboard.page';

// Import ng-circle-progress
import { NgCircleProgressModule } from 'ng-circle-progress';

const routes: Routes = [
  {
    path: '',
    component: DashboardPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes),
    // Specify ng-circle-progress as an import
    NgCircleProgressModule.forRoot()
  ],
  declarations: [DashboardPage]
})
export class DashboardPageModule {}
