import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobApplyListPage } from './job-apply-list.page';

describe('JobApplyListPage', () => {
  let component: JobApplyListPage;
  let fixture: ComponentFixture<JobApplyListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobApplyListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobApplyListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
