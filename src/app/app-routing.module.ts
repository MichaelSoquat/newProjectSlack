import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication/authentication.component';
import { MainInterfaceComponent } from './main-interface/main-interface.component';

const routes: Routes = [
  { path: '', component: AuthenticationComponent },
  { path: 'main', component: MainInterfaceComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
