import Dexie, { Table } from 'dexie';
import { Operation } from '../models/operation.model';
import { Account } from '../models/account.model';
import { Client } from '../models/client.model';
import { OperationType } from '../models/enum/operation-type.enum';

export class AppDB extends Dexie {
  accountTable!: Table<Account, number>;
  clientTable!: Table<Client, number>;
  operationTable!: Table<Operation, number>;

  constructor() {
    super('bank');
    this.version(3).stores({
      accountTable: '++id, clientId',
      clientTable: '++id',
      operationTable: '++id, accountId',
    });
    this.on('populate', () => this.populate());
  }

  async populate() {
    // Création des client
    const client: Client = {
      name: 'Jacques UNG',
      creationDate: new Date('2020-01-01'),
    };
    const clientId = await db.clientTable.add(client);

    // Création des comptes
    const currentAccount: Account = {
      name: 'Compte courant - ITINOV BANK - Jacques UNG',
      clientId,
      creationDate: new Date('2020-01-10'),
      balance: 850,
      maxOverdraft: 500,
    };
    const currentAccountId = await db.accountTable.add(currentAccount);

    const savingsAccount: Account = {
      name: "Compte d'épargne - ITINOV BANK - Jacques UNG",
      clientId,
      creationDate: new Date('2020-02-01'),
      balance: 10050,
      maxOverdraft: 0,
    };
    const savingsAccountId = await db.accountTable.add(savingsAccount);

    // Création des opérations

    const initialDepositCurrent: Operation = {
      amount: 1000,
      accountId: currentAccountId,
      balance: 1000,
      type: OperationType.DEPOSIT,
      creationDate: new Date('2020-01-02'),
    };
    await db.operationTable.add(initialDepositCurrent);

    const initialDepositSavings: Operation = {
      amount: 10000,
      accountId: savingsAccountId,
      balance: 10000,
      type: OperationType.DEPOSIT,
      creationDate: new Date('2020-01-12'),
    };
    await db.operationTable.add(initialDepositSavings);

    const fromCurrentToSavings: Operation = {
      amount: 50,
      accountId: savingsAccountId,
      balance: 10050,
      type: OperationType.TRANSFER,
      creationDate: new Date('2020-01-12'),
      otherAccountId: currentAccountId,
      otherAccountName: currentAccount.name,
    };

    // On redonde dans l'autre sens
    const toSavingsFromCurrent: Operation = {
      amount: -50,
      accountId: currentAccountId,
      balance: 950,
      type: OperationType.TRANSFER,
      creationDate: new Date('2020-01-12'),
      otherAccountId: savingsAccountId,
      otherAccountName: savingsAccount.name,
    };

    // Pas de redondance car autre banque
    const toCedric: Operation = {
      amount: -100,
      accountId: currentAccountId,
      balance: 850,
      type: OperationType.TRANSFER,
      creationDate: new Date('2020-03-01'),
      otherAccountName: 'Cédric MELO - VONITI BANK',
    };

    await db.operationTable.bulkAdd([
      fromCurrentToSavings,
      toSavingsFromCurrent,
      toCedric,
    ]);
  }
}

export const db = new AppDB();
