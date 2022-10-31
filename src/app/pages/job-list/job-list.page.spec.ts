import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JobListPage } from './job-list.page';

describe('JobListPage', () => {
  let component: JobListPage;
  let fixture: ComponentFixture<JobListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JobListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
