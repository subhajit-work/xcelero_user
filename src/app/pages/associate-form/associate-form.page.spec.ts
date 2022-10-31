import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateFormPage } from './associate-form.page';

describe('AssociateFormPage', () => {
  let component: AssociateFormPage;
  let fixture: ComponentFixture<AssociateFormPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssociateFormPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateFormPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
