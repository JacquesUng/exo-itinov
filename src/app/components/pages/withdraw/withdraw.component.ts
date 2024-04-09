import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { Client } from 'src/app/models/client.model';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ValidationModalComponent } from '../../shared/validation-modal/validation-modal.component';
import { OperationService } from 'src/app/services/operation.service';

@Component({
  selector: 'app-withdraw',
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css'],
})
export class WithdrawComponent implements OnInit {
  account?: Account;
  client?: Client;
  accounts: Account[] = [];
  amount: string = '';
  overdraftExceeded: boolean = false;

  constructor(
    protected accountService: AccountService,
    protected clientService: ClientService,
    protected dialog: MatDialog,
    protected operationService: OperationService,
    protected route: ActivatedRoute,
    protected router: Router,
    protected utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadAccount();
    this.loadClient().then(() => {
      this.loadAccounts(this.client.id);
    });
  }

  private loadAccount(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const accountIdString = params['accountId'];
      if (accountIdString) {
        const accountId = Number(accountIdString);
        this.accountService.getById(accountId).then((account: Account) => {
          this.account = account;
        });
      }
    });
  }

  accountComparisonFunction(option: Account, value: Account): boolean {
    return option?.id === value?.id;
  }

  private async loadClient(): Promise<void> {
    this.client = await this.clientService.getFirst();
  }

  private async loadAccounts(clientId: number): Promise<void> {
    this.accounts = await this.accountService.getByClientId(clientId);
  }

  onClickOnDashboard(): void {
    this.router.navigateByUrl('dashboard');
  }

  onChangeAmountField(event: any): void {
    this.amount = event.target.value;
  }

  onClickOnValidate(): void {
    console.log('Trying to withdraw: ', this.amount);

    // On contrôle que le découvert ne sera pas dépassé
    if (
      this.account.balance - Number(this.amount) <
      -this.account.maxOverdraft
    ) {
      this.overdraftExceeded = true;
    } else {
      this.overdraftExceeded = false;
      const dialogRef = this.dialog.open(ValidationModalComponent, {
        data: {
          message: `Voulez vous transférer ${
            this.amount
          } € ?\n Le nouveau solde du compte ${this.account.name} sera de ${
            this.account.balance - Number(this.amount)
          } €.`,
        },
        width: '600px',
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.operationService
            .performWithdrawal(this.account.id, Number(this.amount))
            .then(() => {
              this.router.navigateByUrl('dashboard');
            });
        }
      });
    }
  }

  isNegative(amount: number): boolean {
    return this.utils.isNegative(amount);
  }

  isAPositiveNumber(value: string) {
    return this.utils.isANumber(value) && Number(value) >= 0;
  }

  get validationIsDisabled(): boolean {
    return (
      !this.account ||
      !this.isAPositiveNumber(this.amount) ||
      this.amount === ''
    );
  }
}
