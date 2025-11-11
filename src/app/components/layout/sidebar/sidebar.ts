import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
  <aside class="sidebar">
    <div class="brand">Survey Admin</div>
    <nav>
      <a routerLink="/dashboard" class="nav">Dashboard</a>
      <a routerLink="/create-survey" class="nav">Create Survey</a>
      <a routerLink="/reminders" class="nav">Reminders</a>
      <a routerLink="/employees" class="nav">Employees</a>
    </nav>
    <div class="logout"><a routerLink="/login">Logout</a></div>
  </aside>
  `,
  styles: [`
    .sidebar { width:240px; background:#0f172a; color:white; height:100vh; padding:20px; box-sizing:border-box; position:fixed; left:0; top:0; }
    .brand{font-weight:700;color:#14b8a6;margin-bottom:24px}
    .nav{display:block;padding:12px;color:#cbd5e1;text-decoration:none;border-radius:6px;margin-bottom:6px}
    .nav:hover{background:#0b1320}
    .logout{position:absolute;bottom:20px}
  `]
})
export class Sidebar {}
