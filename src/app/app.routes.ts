import { Routes } from '@angular/router';
import { ChartsComponent } from './components/charts/charts.component';

export const routes: Routes = [
    {
        path: "",
        redirectTo: "movie",
        pathMatch: "full"
    },
    {
        path: "movie",
        component: ChartsComponent
    }
];
