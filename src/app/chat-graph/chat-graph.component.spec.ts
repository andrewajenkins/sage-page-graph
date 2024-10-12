import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatGraphComponent } from './chat-graph.component';

describe('ChatGraphComponent', () => {
  let component: ChatGraphComponent;
  let fixture: ComponentFixture<ChatGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatGraphComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
