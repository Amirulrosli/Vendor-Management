import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditSlotComponent } from './edit-slot.component';

describe('EditSlotComponent', () => {
  let component: EditSlotComponent;
  let fixture: ComponentFixture<EditSlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditSlotComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditSlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
