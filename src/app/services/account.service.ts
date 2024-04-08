import { Injectable } from '@angular/core';
import { db } from '../indexedDb/db';
import { Account } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  /**
   * Comptes associés à un client
   * @param clientId
   * @returns
   */
  async getByClientId(clientId: number): Promise<Account[]> {
    const accountCollection = db.accountTable.where({ clientId });
    return await accountCollection.toArray();
  }
}
