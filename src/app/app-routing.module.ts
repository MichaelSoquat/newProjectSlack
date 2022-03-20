import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainInterfaceComponent } from './main-interface/main-interface.component';

const routes: Routes = [
  { path: '', component: MainInterfaceComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
