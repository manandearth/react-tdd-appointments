import React, { useState } from 'react';

export const CustomerForm = ({
  firstName, lastName, phoneNumber, onSave,
}) => {
  const [error, setError] = useState(false);
  const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });
  const handleChangeText = ({ target }, field) => setCustomer((customer) => ({
    ...customer,
    [field]: target.value,
  }));
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    if (result && result.ok) {
      const customerWithId = await result.json();
      setError(false);
      onSave(customerWithId);
    } else {
      setError(true);
    }
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      { error ? <Error /> : null}
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

const Error = () => (
  <div className="error">An error occured during save</div>
);

CustomerForm.defaultProps = {
  fetch: async () => {},
  onSave: () => {},
};
