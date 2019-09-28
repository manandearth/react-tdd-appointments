import React from 'react';
import {
  createShallowRenderer, type, childrenOf, className, click, id,
} from './shallowHelpers';
import { App } from '../src/App';
import { AppointmentsDayViewLoader } from '../src/AppointmentsDayViewLoader';
import { CustomerForm } from '../src/CustomerForm';
import { AppointmentFormLoader } from '../src/AppointmentFormLoader';

describe('App', () => {
  let render;
  let elementMatching;
  let child;

  beforeEach(() => {
    ({
      render, elementMatching, child,
    } = createShallowRenderer());
  });

  const beginAddingCustomerAndAppointment = () => {
    render(<App />);
    click(elementMatching(id('addCustomer')));
  };

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
  it('has a button to initiate add customer and appointment action', () => {
    render(<App />);
    const buttons = childrenOf(
      elementMatching(className('button-bar'))
    );
    expect(buttons[0].type).toEqual('button');
    expect(buttons[0].props.children).toEqual('Add customer and appointment');
  });

  it('displays the CustomerForm when the button is clicked', () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(CustomerForm))).toBeDefined();
  });
  it('hides the AppointmentsDayViewLoader when button is clicked', () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(type(AppointmentsDayViewLoader))).not.toBeDefined();
  });
  it('hides the button bar when the button is clicked', async () => {
    beginAddingCustomerAndAppointment();
    expect(elementMatching(className('button-bar'))).not.toBeTruthy();
  });

  const saveCustomer = (customer) => elementMatching(type(CustomerForm)).props.onSave(customer);

  it('displays the AppointmentFormLoader after the CustomerForm is submitted', async () => {
    beginAddingCustomerAndAppointment();
    saveCustomer();
    expect(
      elementMatching(type(AppointmentFormLoader))
    ).toBeDefined();
  });
});
