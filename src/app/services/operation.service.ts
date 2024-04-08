import { Injectable } from '@angular/core';
import { Operation } from '../models/operation.model';
import { db } from '../indexedDb/db';
import { Account } from '../models/account.model';
import { OperationType } from '../models/enum/operation-type.enum';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  /**
   * Opérations les plus récentes associées à un client
   * @param clientId
   * @param limit
   * @returns
   */
  async getByClientId(
    clientId: number,
    limit: number = 10
  ): Promise<Operation[]> {
    const accountCollection = db.accountTable.where({ clientId });
    const accounts = await accountCollection.toArray();
    const accountIds = accounts.map((account: Account) => account.clientId);
    const operationCollection = db.operationTable
      .filter((operation: Operation) =>
        accountIds.includes(operation.accountId)
      )
      .limit(limit);
    return await operationCollection.toArray();
  }

  /**
   * Opérations les plus récentres associées à un compte
   * @param accountId
   * @param limit
   * @returns
   */
  async getByAccountId(
    accountId: number,
    limit: number = 10
  ): Promise<Operation[]> {
    const operationCollection = db.operationTable
      .where({ accountId })
      .limit(limit);
    return await operationCollection.toArray();
  }

  async performWithdrawal(accountId: number, amount: number): Promise<number> {
    const account = await db.accountTable.get(accountId);
    const newBalance = account.balance - amount;
    const allowed = newBalance > -account.maxOverdraft;
    if (!allowed) {
      throw new Error('You are not allowed to withdraw this amount of money');
    } else {
      // Modification du solde du compte
      await db.accountTable.update(accountId, { balance: newBalance });

      // Création d'une nouvelle opération
      const now = new Date();
      return db.operationTable.add({
        amount: -amount,
        accountId,
        balance: newBalance,
        type: OperationType.WITHDRAWAL,
        creationDate: now,
      });
    }
  }

  async performTransfer(
    accountFromId: number,
    accountToId: number,
    amount: number
  ): Promise<number> {
    const accountFrom = await db.accountTable.get(accountFromId);
    const newBalanceFrom = accountFrom.balance - amount;
    const allowed = newBalanceFrom > -accountFrom.maxOverdraft;
    if (!allowed) {
      throw new Error('You are not allowed to transfer this amount of money');
    } else {
      const now = new Date();
      const accountTo = await db.accountTable.get(accountToId);
      const newBalanceTo = accountTo.balance + amount;

      // Modification du solde du compte émetteur
      await db.accountTable.update(accountFromId, { balance: newBalanceFrom });

      // Nouvelle opération du compte émetteur
      const operationId = await db.operationTable.add({
        amount: -amount,
        accountId: accountFromId,
        balance: newBalanceFrom,
        type: OperationType.TRANSFER,
        creationDate: now,
        otherAccountId: accountToId,
        otherAccountName: accountTo.name,
      });

      // Modification du solde du compte destinataire
      await db.accountTable.update(accountToId, { balance: newBalanceTo });

      // Nouvelle opération du compte destinataire
      await db.operationTable.add({
        amount,
        accountId: accountToId,
        balance: newBalanceTo,
        type: OperationType.TRANSFER,
        creationDate: now,
        otherAccountId: accountFromId,
        otherAccountName: accountFrom.name,
      });

      return operationId;
    }
  }
}
