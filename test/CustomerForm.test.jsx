import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
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
  let returnValue;
  return {
    fn: (...args) => {
      receivedArguments = args;
      return returnValue;
    },
    stubReturnValue: (value) => returnValue = value,
    receivedArguments: () => receivedArguments,
    receivedArgument: (n) => receivedArguments[n],
  };
};

const fetchResponseOk = (body) => Promise.resolve({
  ok: true,
  json: () => Promise.resolve(body),
});

const fetchResponseError = () => {
  Promise.resolve({ ok: false });
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

  const originalFetch = window.fetch;
  let fetchSpy;

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = spy();
    window.fetch = fetchSpy.fn;
    fetchSpy.stubReturnValue(fetchResponseOk({}));
  });
  // It is important to reset any global variables that are replaced with spies, this is what this afterEach block does:
  afterEach(() => {
    window.fetch = originalFetch;
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
    render(<CustomerForm
      {...{ [fieldName]: 'value' }}
      fetch={fetchSpy.fn}
    />);
    await ReactTestUtils.Simulate.submit(form('customer'));
    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual('value');
  });
  const itSavesNewWhenSubmitted = (fieldName, newValue) => it('saves new when submitted', async () => {
    render(<CustomerForm
      {...{ [fieldName]: 'existing value' }}
      fetch={fetchSpy.fn}
    />);
		 ReactTestUtils.Simulate.change(field(fieldName), {
      target: { value: newValue },
    });
    ReactTestUtils.Simulate.submit(form('customer'));
    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(JSON.parse(fetchOpts.body)[fieldName]).toEqual(newValue);
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
  it('calls fetch with the right properties when submitting data', async () => {
    render(
      <CustomerForm fetch={fetchSpy.fn} onSubmit={() => {}} />
    );
    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchSpy).toHaveBeenCalled();
    expect(fetchSpy.receivedArgument(0)).toEqual('/customers');
    const fetchOpts = fetchSpy.receivedArgument(1);
    expect(fetchOpts.method).toEqual('POST');
    expect(fetchOpts.credentials).toEqual('same-origin');
    expect(fetchOpts.headers).toEqual({ 'Content-Type': 'application/json' });
  });
  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    fetchSpy.stubReturnValue(fetchResponseOk(customer));
    const saveSpy = spy();
    render(<CustomerForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy.receivedArgument(0)).toEqual(customer);
  });
  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.stubReturnValue(fetchResponseError());
    const saveSpy = spy();
    render(<CustomerForm onSave={saveSpy.fn} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });
});
