import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/pages/dashboard/dashboard.component';
import { WithdrawComponent } from './components/pages/withdraw/withdraw.component';
import { TransferComponent } from './components/pages/transfer/transfer.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'withdraw', component: WithdrawComponent },
  { path: 'transfer', component: TransferComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
