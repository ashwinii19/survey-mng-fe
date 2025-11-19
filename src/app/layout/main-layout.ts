import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Sidebar } from './sidebar/sidebar';
import Header from './header/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css'],
  imports: [
    Sidebar,
    Header,
    RouterOutlet
  ]
})
export default class MainLayoutComponent {

  // IMPORTANT: this variable controls layout shift
  sidebarCollapsed = false;

}
