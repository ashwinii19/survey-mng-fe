// import { Component } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   imports: [CommonModule, RouterLink, RouterLinkActive],
//   templateUrl: './sidebar.html',
//   styleUrls: ['./sidebar.css']
// })
// export class Sidebar {}




// import { Component, EventEmitter, Output, HostBinding } from '@angular/core';
// import { RouterLink, RouterLinkActive } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { NgClass } from '@angular/common';

// @Component({
//   selector: 'app-sidebar',
//   standalone: true,
//   templateUrl: './sidebar.html',
//   styleUrls: ['./sidebar.css'],
//   imports: [
//     NgClass,        // <-- ADD THIS
//     RouterLink,
//     RouterLinkActive,
//     CommonModule
//   ]
// })
// export class Sidebar {

//   @HostBinding('class.collapsed') hostCollapsed = false;

//   @Output() collapseChange = new EventEmitter<boolean>();

//   isCollapsed = false;

//   toggleSidebar() {
//     this.isCollapsed = !this.isCollapsed;
//     this.hostCollapsed = this.isCollapsed;   

//     this.collapseChange.emit(this.isCollapsed);
//   }

//   logout() {
//     localStorage.clear();
//     location.href = "/login";
//   }
// }

















import { Component, EventEmitter, Output, HostBinding } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css'],
  imports: [
    NgClass,
    RouterLink,
    RouterLinkActive,
    CommonModule
  ]
})
export class Sidebar {

  @HostBinding('class.collapsed') hostCollapsed = false;

  @Output() collapseChange = new EventEmitter<boolean>();

  isCollapsed = false;
  isOnboardingExpanded = false; // Add this property

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
    this.hostCollapsed = this.isCollapsed;   
    
    // If collapsing sidebar, also collapse submenus
    if (this.isCollapsed) {
      this.isOnboardingExpanded = false;
    }

    this.collapseChange.emit(this.isCollapsed);
  }

  // Add this method for sub-menu toggle
  toggleOnboardingMenu() {
    this.isOnboardingExpanded = !this.isOnboardingExpanded;
  }

  logout() {
    localStorage.clear();
    location.href = "/login";
  }
}