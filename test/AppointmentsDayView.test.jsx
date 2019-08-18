import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import { Appointment, AppointmentsDayView } from '../src/AppointmentsDayView';

describe('Appointment', () => {
 	let customer = {};
  let container;
	  beforeEach(() => {
    container = document.createElement('div');
  });
  const render = (component) => ReactDOM.render(component, container);

  const appointmentTable = () => container.querySelector('#appointmentView > table');

  it('renders a table', () => {
    render(<Appointment customer={customer} />);
    expect(appointmentTable()).not.toBeNull();
  });

  it('renders the customer first name', () => {
    customer = { firstName: 'Ashley' };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch('Ashley');
  });
  it('rendersss another customer first name', () => {
    customer = { firstName: 'Jordan' };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch('Jordan');
  });
  it('renders the customer last name', () => {
    customer = { firstName: 'Jordan', lastName: 'Butler' };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch('Butler');
  });
  it('renders the customer phone number', () => {
    customer = { phoneNumber: '(554)338-1814' };
    render(<Appointment customer={customer} />);
    expect(appointmentTable().textContent).toMatch('(554)338-1814');
  });
  it('renders the service ordered', () => {
    customer = { customer };
    render(<Appointment customer={customer} service="Cut" />);
    expect(appointmentTable().textContent).toMatch('Cut');
  });
  it('renders the stylists name', () => {
    customer = { customer };
    render(<Appointment customer={customer} service="Cut" stylist="Jane" />);
    expect(appointmentTable().textContent).toMatch('Jane');
  });
  it('renders the appointment notes', () => {
    customer = { customer };
    const notes = 'Give Jordan his hat he forgot here last week';
    render(<Appointment customer={customer} notes={notes} />);
    expect(appointmentTable().textContent).toMatch('Give Jordan his hat he forgot here last week');
  });
  it('renders the appointment time as heading', () => {
    customer = { customer };
    const today = new Date();
    const startsAt = today.setHours(12, 0);
    render(<Appointment customer={customer} startsAt={startsAt} />);
    expect(container.querySelector('h3').textContent).toMatch('12:00');
  });
});

describe('AppointmentsDayView', () => {
  let container;
  const render = (component) => ReactDOM.render(component, container);
  const today = new Date();
  const appointments = [
    { startsAt: today.setHours(12, 0), customer: { firstName: 'Ashley' } },
    { startsAt: today.setHours(13, 0), customer: { firstName: 'Jordan' } }];
  beforeEach(() => {
    container = document.createElement('div');
  });

  it('renders a div with the right id', () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.querySelector('div#appointmentsDayView')).not.toBeNull();
  });

  it('renders multiple appointments in an ol element', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelector('ol')).not.toBeNull();
    expect(container.querySelector('ol').children).toHaveLength(2);
  });

  it('renders each appointment in an li', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0].textContent).toEqual('12:00');
    expect(container.querySelectorAll('li')[1].textContent).toEqual('13:00');
  });

  it('initially shows a message saying there are no appointments', () => {
    render(<AppointmentsDayView appointments={[]} />);
    expect(container.textContent).toMatch('There are no appointments scheduled for today.');
  });
  it('selects the first appointment by default', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.textContent).toMatch('Ashley');
  });
  it('has a button element in every li', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    expect(container.querySelectorAll('li > button')).toHaveLength(2);
    expect(container.querySelectorAll('li > button')[0].type).toEqual('button');
  });
  it('renders another appointment when selected', () => {
    render(<AppointmentsDayView appointments={appointments} />);
    const button = container.querySelectorAll('button')[1];
    ReactTestUtils.Simulate.click(button);
    expect(container.textContent).toMatch('Jordan');
  });
});
