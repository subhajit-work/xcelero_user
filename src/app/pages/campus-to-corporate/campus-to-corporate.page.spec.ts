import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampusToCorporatePage } from './campus-to-corporate.page';

describe('CampusToCorporatePage', () => {
  let component: CampusToCorporatePage;
  let fixture: ComponentFixture<CampusToCorporatePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampusToCorporatePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampusToCorporatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
