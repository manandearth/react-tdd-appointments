import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';

// two spies (single and multi args)
const singleArgumentSpy = () => {
  let receivedArgument;
  return {
    fn: (arg) => (receivedArgument = arg),
    receivedArgument: () => receivedArgument,
  };
};

const spy = () => {
  let receivedArguments;
  return {
    fn: (...args) => (receivedArguments = args),
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n],
  };
};

expect.extend({
  toHaveBeenCalled(received) {
    if (received.receivedArguments(0) === undefined) {
      return {
        pass: false,
        message: () => 'spy was not called',
      };
    }
    return { pass: true, message: () => 'spy was called' };
  },
});

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

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  const field = (name) => form('customer').elements[name];

  const itRendersAsATextBox = (fieldName) => it('renders as a test box', () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(field(fieldName));
  });
  const itIncludesTheExistingValue = (fieldName) => it('includes the existing value', () => {
    render(<CustomerForm {...{ [fieldName]: 'value' }} />);
    expect(field(fieldName).value).toEqual('value');
  });
  const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
  const itRendersALabel = (fieldName) => it('renders a label', () => {
    render(<CustomerForm />);
    expect(labelFor(fieldName)).not.toBeNull();
  });
  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
    render(<CustomerForm />);
    expect(field(fieldName).id).toEqual(fieldName);
  });
  const itSubmitsExistingValue = (fieldName) => it('saves existing value when submitted', async () => {
    const submitSpy = spy();

    render(<CustomerForm
      {...{ [fieldName]: 'value' }}
      onSubmit={submitSpy.fn}
    />);
    await ReactTestUtils.Simulate.submit(form('customer'));
    expect(submitSpy.receivedArguments()).toBeDefined();
    expect(submitSpy).toHaveBeenCalled();
    expect(submitSpy.receivedArgument(0)[fieldName]).toEqual('value');
  });
  const itSavesNewWhenSubmitted = (fieldName, newValue) => it('saves new when submitted', async () => {
    expect.hasAssertions();
    render(<CustomerForm
      {...{ [fieldName]: 'existing value' }}
      onSubmit={(props) => expect(props[fieldName]).toEqual(newValue)}
    />);
		 await ReactTestUtils.Simulate.change(field(fieldName), {
      target: { value: newValue },
    });
    await ReactTestUtils.Simulate.submit(form('customer'));
  });

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName');
    itAssignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName', 'Ashley');
    itSavesNewWhenSubmitted('firstName', 'aha!');
  });


  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName', 'Franklin');
    itSavesNewWhenSubmitted('lastName', 'aha!');
  });


  describe('phone number', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber', '12345678');
    itSavesNewWhenSubmitted('phoneNumber', '09876543');
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const SubmitButton = container.querySelector('input[type="submit"]');
    expect(SubmitButton).not.toBeNull();
  });
});
