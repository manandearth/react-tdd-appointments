import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer, withEvent } from './domManipulators';
import { CustomerForm } from '../src/CustomerForm';
import { fetchResponseOk, fetchResponseError, fetchRequestBody } from './spyHelpers.js';
import 'whatwg-fetch';

describe('CustomerForm', () => {
  let render;
  let container;
  let field;
  let form;
  let labelFor;
  let element;
  let change;
  let submit;
  beforeEach(() => {
    ({
      render, container, form, field, labelFor, element, change, submit,
    } = createContainer());
    window.fetch = window.fetch;
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk({}));
  });
  // It is important to reset any global variables that are replaced with spies, this is what this afterEach block does:
  afterEach(() => {
    window.fetch.mockRestore();
  });

  const expectToBeInputFieldOfTypeText = (formElement) => {
	  expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  const itRendersAsATextBox = (fieldName) => it('renders as a test box', () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(field('customer', fieldName));
  });
  const itIncludesTheExistingValue = (fieldName) => it('includes the existing value', () => {
    render(<CustomerForm {...{ [fieldName]: 'value' }} />);
    expect(field('customer', fieldName).value).toEqual('value');
  });
  const itRendersALabel = (fieldName) => it('renders a label', () => {
    render(<CustomerForm />);
    expect(labelFor(fieldName)).not.toBeNull();
  });
  const itAssignsAnIdThatMatchesTheLabelId = (fieldName) => it('assigns an id that matches the label id', () => {
    render(<CustomerForm />);
    expect(field('customer', fieldName).id).toEqual(fieldName);
  });
  const itSubmitsExistingValue = (fieldName) => it('saves existing value when submitted', async () => {
    render(<CustomerForm
      {...{ [fieldName]: 'value' }}
      fetch={window.fetch.fn}
    />);
    submit(form('customer'));
    expect(fetchRequestBody(window.fetch)).toMatchObject({ [fieldName]: 'value' });
  });
  const itSavesNewWhenSubmitted = (fieldName, newValue) => it('saves new when submitted', async () => {
    render(<CustomerForm
      {...{ [fieldName]: 'existing value' }}
    />);
    change(field('customer', fieldName),
      withEvent(fieldName, newValue));
    submit(form('customer'));
    expect(fetchRequestBody(window.fetch)).toMatchObject({ [fieldName]: newValue });
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
    const SubmitButton = element('input[type="submit"]');
    expect(SubmitButton).not.toBeNull();
  });
  it('calls fetch with the right properties when submitting data', async () => {
    render(
      <CustomerForm />
    );
    submit(form('customer'));
    expect(window.fetch).toHaveBeenCalledWith(
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
    window.fetch.mockReturnValue(fetchResponseOk(customer));
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));
    expect(saveSpy).toHaveBeenCalledWith(customer);
  });
  it('does not notify onSave if the POST request returns an error', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} />);
    await submit(form('customer'));
    expect(saveSpy).not.toHaveBeenCalled();
  });
  it('prevents the default action when submitting the form', async () => {
    const preventDefaultSpy = jest.fn();
    render(<CustomerForm />);
    await submit(form('customer'), {
      preventDefault: preventDefaultSpy,
    });
    expect(preventDefaultSpy).toHaveBeenCalled();
  });
  it('renders error message when fetch call fails', async () => {
    window.fetch.mockReturnValue(fetchResponseError());
    render(<CustomerForm />);
    await submit(form('customer'));
    const errorElement = element('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occured');
  });
  it('clears the error state when the form succeeds', async () => {
    window.fetch.mockReturnValueOnce(fetchResponseError());
    window.fetch.mockReturnValue(fetchResponseOk());
    render(<CustomerForm />);
    await submit(form('customer'));
    await submit(form('customer'));
    expect(element('.error')).toBeNull();
  });
});
