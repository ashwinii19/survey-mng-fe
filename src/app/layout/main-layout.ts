import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Sidebar } from './sidebar/sidebar';
import Header from './header/header';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    Sidebar,
    Header
  ],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export default class MainLayout {}
