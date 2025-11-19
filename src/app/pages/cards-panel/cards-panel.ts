// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { DashboardResponse } from '../../models/dashboard-response';

// @Component({
//   selector: 'app-cards-panel',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './cards-panel.html',
//   styleUrls: ['./cards-panel.css']
// })
// export class CardsPanel {
//   @Input() dashboard?: DashboardResponse;
// }

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardResponse } from '../../models/dashboard';

@Component({
  selector: 'app-cards-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards-panel.html',
  styleUrls: ['./cards-panel.css']
})
export class CardsPanel {
  @Input() dashboard?: DashboardResponse;

  get total() { return this.dashboard?.totalEmployees ?? 0; }
  get submitted() { return this.dashboard?.totalSubmitted ?? 0; }
  get remaining() { return this.dashboard?.totalPending ?? 0; }
  get rate() {
    const t = this.total;
    return t ? Math.round((this.submitted / t) * 100) : 0;
  }
}
