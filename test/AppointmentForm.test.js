import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer } from './domManipulators';
import { AppointmentForm } from '../src/AppointmentForm';

describe('AppointmentForm', () => {
  let render;
  let container;
  let field;
  let form;
  let labelFor;
  let change;
  let submit;

  const spy = () => {
    let receivedArguments;
    return {
      fn: (...args) => (receivedArguments = args),
      receivedArguments: () => receivedArguments,
      receivedArgument: (n) => receivedArguments[n],
    };
  };

  beforeEach(() => {
    ({
      render, container, field, form, labelFor, change, submit,
    } = createContainer());
  });
  const formId = 'appointment';

  it('renders a form', () => {
    render(<AppointmentForm />);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {
    const findOption = (dropdownNode, textContent) => {
      const options = Array.from(dropdownNode.childNodes);
      return options.find(
        (option) => option.textContent === textContent
      );
    };
    const fieldName = 'service';

    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field(formId, fieldName)).not.toBeNull();
      expect(field(formId, fieldName).tagName).toEqual('SELECT');
    });

    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field(formId, fieldName).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

    it('lists all salon services', () => {
      const selectableServices = [
        'Cut',
        'Blow-dry'];
      render(
        <AppointmentForm
          selectableServices={selectableServices}
        />
      );
      const optionNodes = Array.from(
        field(formId, fieldName).childNodes
      );
      const renderedServices = optionNodes.map((node) => node.textContent);
      expect(renderedServices).toEqual(
        expect.arrayContaining(selectableServices)
      );
    });

    it('preselects the existing value', () => {
      const services = ['Cut', 'Blow-dry'];
      render(<AppointmentForm
        selectedServices={services}
        service="Blow-dry"
      />);
      const option = findOption(field(formId, fieldName), 'Blow-dry');
      expect(option.selected).toBeTruthy();
    });

    it('renders a label', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />);
      expect(field(formId, fieldName).id).toEqual(fieldName);
    });

    it.only('saves existing value when submitted', async () => {
      const submitSpy = spy();

      render(<AppointmentForm
        service="Blow-dry"
        onSubmit={submitSpy.fn}
      />);
      submit(form('appointment'));
      expect(submitSpy.receivedArguments()).toBeDefined();
      expect(submitSpy.receivedArgument(0)[fieldName]).toEqual('Blow-dry');
    });

    it('saves a new value when submitted', async () => {
      expect.hasAssertions();
      render(<AppointmentForm
        service="Blow-dry"
        onSubmit={(props) => expect(props.service).toEqual('Beard trim')}
      />);
      change(field(formId, fieldName), { target: { value: 'Beard trim' } });
      submit(form('appointment'));
    });
  });

  describe('stylist field', () => {
    const findOption = (dropdownNode, textContent) => {
      const options = Array.from(dropdownNode.childNodes);
      return options.find(
        (option) => option.textContent === textContent
      );
    };
    const fieldName = 'stylist';

    const selectableStylists = [
      {
        name: 'Jon',
        services: ['Cut', 'Blow-dry', 'Beard trim', 'Cut & Beard trim'],
      },
      {
        name: 'Jane',
        services: ['Blow-dry', 'Extensions', 'Cut & color', 'Cut'],
      }];

    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field(formId, fieldName)).not.toBeNull();
      expect(field(formId, fieldName).tagName).toEqual('SELECT');
    });

    it('renders a label for the input field', () => {
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
    });

    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field(formId, fieldName).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

    it('lists all stylists', () => {
      render(
        <AppointmentForm
          selectableStylists={selectableStylists}
        />
      );
      const optionNodes = Array.from(
        field(formId, fieldName).childNodes
      );
      const renderedStylists = optionNodes.map((node) => node.textContent);
      expect(renderedStylists).toEqual(
        expect.arrayContaining(selectableStylists.map((s) => s.name))
      );
    });

    it('preselects the existing value', () => {
      const stylists = [{ name: 'Jon', services: ['Cut', 'Cut & color'] },
        { name: 'Jeff', services: ['Extensions', 'Cut'] }];
      render(<AppointmentForm
        selectableStylists={stylists}
        stylist="Jon"
      />);
      const option = findOption(field(formId, fieldName), 'Jon');
      expect(option.selected).toBeTruthy();
    });

    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />);
      expect(field(formId, fieldName).id).toEqual(fieldName);
    });

    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(<AppointmentForm
        stylist="Pepe"
        onSubmit={(props) => expect(props.stylist).toEqual('Pepe')}
      />);
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('saves a new value when submitted', async () => {
      expect.hasAssertions();
      render(<AppointmentForm
        stylist="Pepe"
        onSubmit={(props) => expect(props.stylist).toEqual('Sara')}
      />);
      change(field(formId, fieldName), { target: { value: 'Sara' } });
      submit(form('appointment'));
    });

    it('filters the services list according to stylist\'s services', () => {
      const stylist = 'Jon';
      const selectableServices = ['Cut', 'Beard trim', 'Cut & Beard trim', 'Blow-dry', 'Extensions', 'Cut & color'];
      render(<AppointmentForm
        stylist={stylist}
        selectableStylists={selectableStylists}
        selectableServices={selectableServices}
      />);
      const optionNodes = Array.from(
        field(formId, 'service').childNodes
      );
      const renderedServices = optionNodes.map((node) => node.textContent);
      expect(renderedServices).toEqual(expect.arrayContaining(
        selectableStylists.filter((s) => s.name = stylist)[0].services
      ));
    });
  });

  describe('time slot table', () => {
    const timeSlotTable = () => container.querySelector('table#time-slots');

    const startsAtField = (index) => container.querySelectorAll('input[name="startsAt"]') [
      index
    ];

    it('renders a table for timeslots', () => {
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });

    it('renders a time slot for every half an hour from open to close time', () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11} />);
      const timesOfDay = timeSlotTable().querySelectorAll(
        'tbody >* th'
      );
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header row', () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector('thead > tr');
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });

    it('renders a radio button for each available time slot', () => {
      const today = new Date();
      const availableTimeSlots = {
        Jon: [
          { startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) },
        ],
        Pepe: [{ startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) }],
      };
      render(<AppointmentForm
        availableTimeSlots={availableTimeSlots}
        today={today}
        stylist="Pepe"
      />);
      const cells = timeSlotTable().querySelectorAll('td');
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });

    it('renders no radio buttons for unavailable time slots', () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets radio button value to the index of the corresponding appointment', () => {
      const today = new Date();
      const availableTimeSlots = {
        Pepe: [
          { startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) },
        ],
      };
      const stylist = 'Pepe';
      render(<AppointmentForm
        availableTimeSlots={availableTimeSlots}
        today={today}
        stylist={stylist}
      />);
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[stylist][0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[stylist][1].startsAt.toString()
      );
    });

    it('preselects the existing value', () => {
      const today = new Date();
      const availableTimeSlots = {
        Pepe: [
          { startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) },
        ],
      };
      const stylist = 'Pepe';
      render(<AppointmentForm
        availableTimeSlots={availableTimeSlots}
        today={today}
        startsAt={availableTimeSlots[stylist][0].startsAt}
        stylist={stylist}
      />);
      expect(startsAtField(0).checked).toEqual(true);
    });

    it('saves existing value when submiting', async () => {
      const today = new Date();
      const availableTimeSlots = {
        Pepe: [
          { startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) },
        ],
      };
      const stylist = 'Pepe';
      expect.hasAssertions();
      render(<AppointmentForm
        today={today}
        availableTimeSlots={availableTimeSlots}
        startsAt={availableTimeSlots[stylist][0].startsAt}
        stylist={stylist}
        onSubmit={({ startsAt }) => expect(startsAt).toEqual(availableTimeSlots[stylist][0].startsAt)}
      />);
      await ReactTestUtils.Simulate.submit(form('appointment'));
    });

    it('saves new value when submitted', () => {
      expect.hasAssertions();
      const today = new Date();
      const availableTimeSlots = {
        Pepe: [
          { startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) },
        ],
      };
      const stylist = 'Pepe';
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[stylist][0].startsAt}
          onSubmit={({ startsAt }) => expect(startsAt).toEqual(availableTimeSlots[stylist][1].startsAt)}
          stylist={stylist}
        />
      );
      change(startsAtField(1), {
        target: {
          value: availableTimeSlots[stylist][1].startsAt.toString(),
          name: 'startsAt',
        },
      });
    	  submit(form('appointment'));
      expect(startsAtField(0).checked).toEqual(false);
    });

    it('renders an update timeslot table by stylist', () => {
      const today = new Date();
      const availableTimeSlots = {
        Pepe: [
          { startsAt: today.setHours(10, 0, 0, 0) },
          { startsAt: today.setHours(10, 30, 0, 0) },

        ],
        Paco: [
          { startsAt: today.setHours(9, 0, 0, 0) },
          { startsAt: today.setHours(9, 30, 0, 0) },

        ],
      };
      const stylist = 'Pepe';
      render(<AppointmentForm
        availableTimeSlots={availableTimeSlots}
        stylist={stylist}
        today={today}
      />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      const firstAvailable = Array.from(timesOfDay);
      expect(firstAvailable[0].value).toEqual(today.setHours(10, 0, 0, 0).toString());
    });
  });
});
