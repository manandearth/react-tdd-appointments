import React from 'react';
import { createShallowRenderer, type } from './shallowHelpers';
import { App } from '../src/App';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';

describe('App', () => {
  let render; let
    elementMatching;

  beforeEach(() => {
    ({ render, elementMatching } = createShallowRenderer());
  });

  it('initially shows the DayViewLoader', () => {
    render(<App />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });
});
