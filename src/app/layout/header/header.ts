import { Component, HostListener, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth/auth';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export default class Header {
  @Input() title = '';
  dropdownOpen = false;

  admin: any = {
    name: '',
    profileImage: ''
  };

  baseUrl = environment.apiBaseUrl.replace('/api', '');

  constructor(private auth: Auth, private router: Router) {}

  ngOnInit() {
    this.loadHeaderUser();
  }

  loadHeaderUser() {
    this.auth.getLoggedInUser().subscribe({
      next: (data) => {
        this.admin = {
          name: data.name,
          profileImage: data.profileImage
            ? `${this.baseUrl}/uploads/${data.profileImage}`
            : 'assets/images/default-user.png'
        };
      },
      error: () => {
        this.admin = {
          name: 'Admin',
          profileImage: 'assets/images/default-user.png'
        };
      }
    });
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: any) {
    if (!event.target.closest('.profile-section')) {
      this.dropdownOpen = false;
    }
  }

  goToProfile() {
    this.router.navigate(['/app/profile']);
    this.dropdownOpen = false;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
