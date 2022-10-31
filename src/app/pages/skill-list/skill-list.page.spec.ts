import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkillListPage } from './skill-list.page';

describe('SkillListPage', () => {
  let component: SkillListPage;
  let fixture: ComponentFixture<SkillListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SkillListPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SkillListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
