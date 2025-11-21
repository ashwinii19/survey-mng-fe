import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeEligibility } from './employee-eligibility';

describe('EmployeeEligibility', () => {
  let component: EmployeeEligibility;
  let fixture: ComponentFixture<EmployeeEligibility>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmployeeEligibility]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmployeeEligibility);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
