import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletedProfileComponent } from './deleted-profile.component';

describe('DeletedProfileComponent', () => {
  let component: DeletedProfileComponent;
  let fixture: ComponentFixture<DeletedProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeletedProfileComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeletedProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
