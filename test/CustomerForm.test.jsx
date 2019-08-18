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
  const itSavesWhenSubmitted = (fieldName, value) => it('saves when submitted', async () => {
    expect.hasAssertions();
    render(<CustomerForm
      {...{ [fieldName]: value }}
      onSubmit={(props) => expect(props[fieldName]).toEqual(value)}
    />);
    await ReactTestUtils.Simulate.submit(form('customer'));
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
    itSavesWhenSubmitted('firstName', 'Ashley');
    itSavesNewWhenSubmitted('firstName', 'aha!');
  });
});
