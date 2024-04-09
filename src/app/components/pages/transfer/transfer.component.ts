import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Account } from 'src/app/models/account.model';
import { Client } from 'src/app/models/client.model';
import { AccountService } from 'src/app/services/account.service';
import { ClientService } from 'src/app/services/client.service';
import { OperationService } from 'src/app/services/operation.service';
import { UtilsService } from 'src/app/services/utils.service';
import { ValidationModalComponent } from '../../shared/validation-modal/validation-modal.component';

@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css'],
})
export class TransferComponent implements OnInit {
  accountFrom?: Account;
  accountTo?: Account;
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
    this.loadAccountFrom();
    this.loadClient().then(() => {
      this.loadAccounts(this.client.id);
    });
  }

  private loadAccountFrom(): void {
    this.route.queryParams.subscribe((params: Params) => {
      const accountIdString = params['accountId'];
      if (accountIdString) {
        const accountId = Number(accountIdString);
        this.accountService.getById(accountId).then((account: Account) => {
          this.accountFrom = account;
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
      this.accountFrom.balance - Number(this.amount) <
      -this.accountFrom.maxOverdraft
    ) {
      this.overdraftExceeded = true;
    } else {
      this.overdraftExceeded = false;
      const dialogRef = this.dialog.open(ValidationModalComponent, {
        data: {
          message: `Voulez vous transférer ${this.amount} € au compte ${
            this.accountTo.name
          } ?\n Le nouveau solde du compte ${this.accountFrom.name} sera de ${
            this.accountFrom.balance - Number(this.amount)
          } €.`,
        },
        width: '600px',
      });
      dialogRef.afterClosed().subscribe((result: boolean) => {
        if (result) {
          this.operationService
            .performTransfer(
              this.accountFrom.id,
              this.accountTo.id,
              Number(this.amount)
            )
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
      !this.accountFrom ||
      !this.accountTo ||
      this.accountFrom?.id === this.accountTo?.id ||
      !this.isAPositiveNumber(this.amount) ||
      this.amount === ''
    );
  }
}
