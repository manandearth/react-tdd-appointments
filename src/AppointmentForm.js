import React, { useState } from 'react';

export const AppointmentForm = ({ selectableServices, service, onSubmit }) => {
  const [selected, setSelected] = useState({ service });
  const handleServiceChange = ({ target }) => setSelected(target.value);
  return (
    <form id="appointment" onSubmit={() => onSubmit(selected)}>
      <label htmlFor="service">Service</label>
      <select
        name="service"
        value={selected.service}
        id="service"
        onChange={(e) => handleServiceChange(e)}
        readOnly
      >
        <option />
        {selectableServices.map((s) => (<option key={s}>{s}</option>))}
      </select>
    </form>
  );
};

AppointmentForm.defaultProps = {
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard trim',
    'Extensions',
  ],
};
