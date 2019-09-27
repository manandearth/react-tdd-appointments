import React from 'react';
import { createShallowRenderer, type } from './shallowHelpers';
import { App } from '../src/App';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';

describe('App', () => {
  let render; let
    elementMatching;
  let child;

  beforeEach(() => {
    ({ render, elementMatching, child } = createShallowRenderer());
  });

  it('initially shows the DayViewLoader', () => {
    render(<App />);
    expect(
      elementMatching(type(AppointmentsDayViewLoader))
    ).toBeDefined();
  });
  it('has a button bar as the first element', () => {
    render(<App />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });
});
