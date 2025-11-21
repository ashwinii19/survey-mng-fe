import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchEmailLogs } from './batch-email-logs';

describe('BatchEmailLogs', () => {
  let component: BatchEmailLogs;
  let fixture: ComponentFixture<BatchEmailLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BatchEmailLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BatchEmailLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
