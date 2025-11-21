import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogs } from './email-logs';

describe('EmailLogs', () => {
  let component: EmailLogs;
  let fixture: ComponentFixture<EmailLogs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailLogs]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailLogs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
