import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultListPage } from './result-list.page';

describe('ResultListPage', () => {
  let component: ResultListPage;
  let fixture: ComponentFixture<ResultListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
