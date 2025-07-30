import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaContra } from './nueva-contra';

describe('NuevaContra', () => {
  let component: NuevaContra;
  let fixture: ComponentFixture<NuevaContra>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevaContra]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevaContra);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
