import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleStoryComponent } from './single-story.component';

describe('SingleStoryComponent', () => {
  let component: SingleStoryComponent;
  let fixture: ComponentFixture<SingleStoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SingleStoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
