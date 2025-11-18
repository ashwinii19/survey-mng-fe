// import { Component, Input } from '@angular/core';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-submitted-table',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './submitted-table.html',
//   styleUrls: ['./submitted-table.css']
// })
// export default class SubmittedTable {
//   @Input() submitted: any[] = [];
// }

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-submitted-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './submitted-table.html',
  styleUrls: ['./submitted-table.css']
})
export default class SubmittedTable {
  @Input() submitted: string[] = [];
}
