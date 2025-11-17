import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrls: ['./toast.css']
})
export class Toast {

  static instance: Toast;

  message = '';
  visible = false;

  constructor() {
    Toast.instance = this;
  }

  show(msg: string) {
    this.message = msg;
    this.visible = true;
    setTimeout(() => this.visible = false, 2500);
  }
}
