import React, { useState } from 'react';

export const CustomerForm = ({
  firstName, lastName, phoneNumber, onSubmit,
}) => {
  const [customer, setCustomer] = useState({ firstName, lastName, phoneNumber });
  const handleChangeText = ({ target }, field) => setCustomer((customer) => ({
    ...customer,
    [field]: target.value,
  }));

  return (
    <form id="customer" onSubmit={() => onSubmit(customer)}>
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
        readOnly
      />


    </form>
  );
};
