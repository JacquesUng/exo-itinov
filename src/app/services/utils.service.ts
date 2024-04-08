import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  isNegative(amount: number): boolean {
    return amount <= 0;
  }

  isANumber(value: string): boolean {
    return !isNaN(Number(value));
  }
}
