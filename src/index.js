import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './AppointmentsDayView';
import { CustomerForm } from './CustomerForm';
import { sampleAvailableTimeSlots, sampleStylists } from './sampleData';
import { AppointmentForm } from './AppointmentForm';

ReactDOM.render(
  // <AppointmentsDayView appointments={sampleAppointments} />,
  // <AppointmentForm
  //   availableTimeSlots={sampleAvailableTimeSlots}
  //   selectableStylists={sampleStylists}
  // />,
  <CustomerForm />,
  document.getElementById('root')
);
