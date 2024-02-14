import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {Lab1Component} from "./components/lab1/lab1.component";
import {Lab2Component} from "./components/lab2/lab2.component";

const routes: Routes = [
  {path: '', redirectTo: '/project1', pathMatch: 'full'},
  {path: 'project1', component: Lab1Component},
  {path: 'project2', component: Lab2Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
