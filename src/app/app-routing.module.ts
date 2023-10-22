import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Lab1Component} from "./components/lab1/lab1.component";
import {Lab2Component} from "./components/lab2/lab2.component";

const routes: Routes = [
  {path: '', redirectTo: '/lab1', pathMatch: 'full'},
  {path: 'lab1', component: Lab1Component},
  {path: 'lab2', component: Lab2Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
