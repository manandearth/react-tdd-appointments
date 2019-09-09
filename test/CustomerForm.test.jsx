import React from 'react';
import ReactTestUtils, { act } from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError } from './spyHelpers.js';

describe('CustomerForm', () => {
  let render; let
    container;

  const fetchRequestBody = () => JSON.parse(fetchSpy.mock.calls[0][1].body);

  const originalFetch = window.fetch;
  let fetchSpy;

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = jest.fn(() => fetchResponseOk({}));
    window.fetch = fetchSpy;
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
    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchRequestBody()).toMatchObject({ [fieldName]: 'value' });
  });
  const itSavesNewWhenSubmitted = (fieldName, newValue) => it('saves new when submitted', async () => {
    render(<CustomerForm
      {...{ [fieldName]: 'existing value' }}
    />);
		 ReactTestUtils.Simulate.change(field(fieldName), {
      target: { value: newValue },
    });
    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchRequestBody()).toMatchObject({ [fieldName]: newValue });
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
      <CustomerForm />
    );
    ReactTestUtils.Simulate.submit(form('customer'));
    expect(fetchSpy).toHaveBeenCalledWith(
      '/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json' },
      })
    );
  });
  it('notifies onSave when form is submitted', async () => {
    const customer = { id: 123 };
    fetchSpy.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).toHaveBeenCalledWith(customer);
  });
  it('does not notify onSave if the POST request returns an error', async () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).not.toHaveBeenCalled();
  });
  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: preventDefaultSpy,
      });
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockReturnValue(Promise.resolve({ ok: false }));
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    const errorElement = container.querySelector('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occured');
  });
});
