import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TradesComponent } from './trades/trades.component';
import { MarketComponent } from './market/market.component';


export const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'trades', component: TradesComponent},
    {path: 'market', component: MarketComponent},
];
