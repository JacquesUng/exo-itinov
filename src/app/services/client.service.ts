import { Injectable } from '@angular/core';
import { Client } from '../models/client.model';
import { db } from '../indexedDb/db';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  /**
   * Mock du compte connecté
   * @returns
   */
  async getFirst(): Promise<Client> {
    const clientCollection = db.clientTable.toCollection();
    return await clientCollection.first();
  }
}
