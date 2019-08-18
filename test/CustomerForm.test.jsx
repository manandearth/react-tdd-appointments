import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

describe('CustomerForm', () => {
  let render; let
    container;

  beforeEach(() => {
    ({ render, container } = createContainer());
  });
  const form = (id) => container.querySelector(`form[id="${id}"]`);

  const expectToBeInputFieldOfTypeText = (formElement) => {
	  expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const firstNameField = () => form('customer').elements.firstName;

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });
  describe('first name field', () => {
    it('renders the first name as a test box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(firstNameField());
    });
    it('includes the existing value', () => {
      render(<CustomerForm firstName="Ashley" />);

      expect(firstNameField().value).toEqual('Ashley');
    });

    const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor('firstName')).not.toBeNull();
    });
    it('assigns an id that matches the label id for the first name field', () => {
      render(<CustomerForm />);
      expect(firstNameField().id).toEqual('firstName');
    });
    it('saves when submitted', async () => {
      expect.hasAssertions();
      render(<CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) => expect(firstName).toEqual('Ashley')}
      />);
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
    it('saves new name when submitted', async () => {
      expect.hasAssertions();
      render(<CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) => expect(firstName).toEqual('Jamie')}
      />);
		 await ReactTestUtils.Simulate.change(firstNameField(), {
        target: { value: 'Jamie' },
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
  });
});
