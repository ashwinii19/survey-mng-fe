import { Component, OnInit } from '@angular/core';
import { Auth } from '../../services/auth/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  name = '';
  email = '';
  department = '';
  role = '';
  profileImage: string | null = null;

  oldPassword = '';
  newPassword = '';

  constructor(private auth: Auth) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.auth.getLoggedInUser().subscribe((res) => {
      this.name = res.name;
      this.email = res.email;
      this.department = res.department;
      this.role = res.role;
      this.profileImage = res.profileImage;
    });
  }

  saveProfile() {
    this.auth.updateProfile({ name: this.name, email: this.email })
      .subscribe(() => alert("Profile Updated!"));
  }

  changePass() {
    this.auth.changePassword({
      oldPassword: this.oldPassword,
      newPassword: this.newPassword
    }).subscribe(() => alert("Password Changed!"));
  }

  getPhotoUrl() {
    if (!this.profileImage) {
      return 'assets/images/default-user.png';
    }
    return `${environment.apiBaseUrl.replace('/api', '')}/uploads/${this.profileImage}`;
  }

  uploadPhoto(event: any) {
    const file = event.target.files[0];
    this.auth.uploadImage(file).subscribe((res: any) => {
      this.profileImage = res.image;
    });
  }
}
