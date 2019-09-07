import React, { useState } from 'react';

export const CustomerForm = ({
  firstName, lastName, phoneNumber, fetch,
}) => {
  const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });
  const handleChangeText = ({ target }, field) => setCustomer((customer) => ({
    ...customer,
    [field]: target.value,
  }));
  const handleSubmit = () => {
    fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input
        type="text"
        id="firstName"
        name="firstName"
        value={firstName}
        onChange={(e) => handleChangeText(e, 'firstName')}
      />
      <label htmlFor="lastName">Last Name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={(e) => handleChangeText(e, 'lastName')}
      />
      <label htmlFor="phoneNumber">Phone Number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onChange={(e) => handleChangeText(e, 'phoneNumber')}
      />

      <input type="submit" value="Add" />
    </form>
  );
};

CustomerForm.defaultProps = {
  fetch: async () => {},
};
