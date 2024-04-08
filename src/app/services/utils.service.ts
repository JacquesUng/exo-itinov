import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  isNegative(amount: number): boolean {
    return amount <= 0;
  }
}
