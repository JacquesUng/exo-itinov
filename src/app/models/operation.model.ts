import { BaseEntity } from './base-entity.model';
import { OperationType } from './enum/operation-type.enum';

export interface Operation extends BaseEntity {
  amount: number;
  accountId: number;
  balance: number;
  type: OperationType;
  otherAccountId?: number; // undefined si de type dépôt/retrait ou si le virement/prélèvement est avec un compte d'une autre banque
  otherAccountName?: string; // undefined si de type dépôt/retrait
}
