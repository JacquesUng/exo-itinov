import { Component, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account.model';
import { Client } from 'src/app/models/client.model';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  client?: Client;
  accounts: Account[] = [];

  constructor(
    protected accountService: AccountService,
    protected clientService: ClientService
  ) {}

  ngOnInit(): void {
    this.loadClient().then(() => {
      this.loadAccounts(this.client.id);
    });
  }

  private async loadClient(): Promise<void> {
    this.client = await this.clientService.getFirst();
  }

  private async loadAccounts(clientId: number): Promise<void> {
    this.accounts = await this.accountService.getByClientId(clientId);
  }
}
