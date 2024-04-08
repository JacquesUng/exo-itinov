import { BaseEntity } from './base-entity.model';

export interface Account extends BaseEntity {
  name: string;
  clientId: number;
  balance: number;
  maxOverdraft: number;
}
