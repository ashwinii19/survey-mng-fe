import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailLogDetails } from './email-log-details';

describe('EmailLogDetails', () => {
  let component: EmailLogDetails;
  let fixture: ComponentFixture<EmailLogDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmailLogDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmailLogDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
