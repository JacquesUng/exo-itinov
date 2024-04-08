import { Component, Input, OnInit } from '@angular/core';
import { Account } from 'src/app/models/account.model';
import { Operation } from 'src/app/models/operation.model';
import { OperationService } from 'src/app/services/operation.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-account-summary',
  templateUrl: './account-summary.component.html',
  styleUrls: ['./account-summary.component.css'],
})
export class AccountSummaryComponent implements OnInit {
  @Input() account: Account;
  operations: Operation[] = [];

  constructor(
    protected operationService: OperationService,
    protected utils: UtilsService
  ) {}

  ngOnInit(): void {
    this.loadOperations(this.account.id!);
  }

  private loadOperations(accountId: number) {
    this.operationService
      .getByAccountId(accountId)
      .then((value: Operation[]) => {
        this.operations = value;
      });
  }

  isNegative(amount: number): boolean {
    return this.utils.isNegative(amount);
  }
}
