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

  const field = (name) => form('customer').elements[name];

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });
  describe('first name field', () => {
    const itRendersAsATextBox = (fieldName) => it('renders as a test box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });
    itRendersAsATextBox('firstName');

    const itIncludesTheExistingValue = () => it('includes the existing value', () => {
      render(<CustomerForm firstName="Ashley" />);

      expect(field('firstName').value).toEqual('Ashley');
    });
    itIncludesTheExistingValue();

    const labelFor = (formElement) => container.querySelector(`label[for="${formElement}"]`);
    const itRendersALabel = () => it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor('firstName')).not.toBeNull();
    });
    itRendersALabel();

    const itAssignsAnIdThatMatchesTheLabelId = () => it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field('firstName').id).toEqual('firstName');
    });
    itAssignsAnIdThatMatchesTheLabelId();

    const itSavesWhenSubmitted = () => it('saves when submitted', async () => {
      expect.hasAssertions();
      render(<CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) => expect(firstName).toEqual('Ashley')}
      />);
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
    itSavesWhenSubmitted();

    const itSavesNewWhenSubmitted = () => it('saves new when submitted', async () => {
      expect.hasAssertions();
      render(<CustomerForm
        firstName="Ashley"
        onSubmit={({ firstName }) => expect(firstName).toEqual('Jamie')}
      />);
		 await ReactTestUtils.Simulate.change(field('firstName'), {
        target: { value: 'Jamie' },
      });
      await ReactTestUtils.Simulate.submit(form('customer'));
    });
    itSavesNewWhenSubmitted();
  });
});
