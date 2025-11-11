import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  template: `
  <header class="header">
    <div class="search"><input placeholder="Search surveys, departments..." /></div>
    <div class="profile">Jane Doe ▾</div>
  </header>
  `,
  styles: [`
    .header{height:64px;background:white;padding:0 24px;display:flex;align-items:center;justify-content:space-between;box-shadow:0 1px 2px rgba(0,0,0,0.04)}
    .search input{padding:8px;border-radius:8px;border:1px solid #e6eef6;width:420px}
  `]
})
export class Header {}
