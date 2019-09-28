import React, { useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { AppointmentsDayViewLoader } from './AppointmentsDayViewLoader';
import { CustomerForm } from './CustomerForm';
import { AppointmentFormLoader } from './AppointmentFormLoader';

export const App = () => {
  const [view, setView] = useState('dayView');
  const transitionToAddCustomer = useCallback(
    () => setView('addCustomer'), []
  );
  const transitionToAddAppointment = useCallback(() => setView('addAppointment'),
    []);

  switch (view) {
    case 'addCustomer':
      return (
        <CustomerForm onSave={transitionToAddAppointment} />);
    case 'addAppointment':
      return (
        <AppointmentFormLoader />);
    default:
      return (
        <>
          <div className="button-bar">
            <button
              type="button"
              id="addCustomer"
              onClick={transitionToAddCustomer}
            >
      Add customer and appointment
            </button>
            <AppointmentsDayViewLoader />
          </div>
        </>
      );
  }
};
