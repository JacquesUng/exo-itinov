import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  constructor(protected router: Router) {}

  ngOnInit(): void {}

  onClickOnWithdraw(): void {
    this.router.navigateByUrl('withdraw');
  }

  onClickOnTransfer(): void {
    this.router.navigateByUrl('transfer');
  }
}
