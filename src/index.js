import React from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayView } from './AppointmentsDayView';
import { CustomerForm } from './CustomerForm';
import { sampleAppointments } from './sampleData';
import { AppointmentForm } from './AppointmentForm';

ReactDOM.render(
  // <AppointmentsDayView appointments={sampleAppointments} />,
  <AppointmentForm />,
  document.getElementById('root')
);
