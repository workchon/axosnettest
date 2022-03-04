import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from '../app/components/login/login.component'
import { RecibosComponent } from '../app/components/recibos/recibos.component'


const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'recibos/:id', component: RecibosComponent },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
}
