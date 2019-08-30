import React, { useState, useCallback } from 'react';

const timeIncrement = (numTimes, startTime, increment) => Array(numTimes)
  .fill([startTime])
  .reduce((acc, _, i) => acc.concat([startTime + (i * increment)]));


const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
  const totalSlots = (salonClosesAt - salonOpensAt) * 2;
  const startTime = new Date().setHours(salonOpensAt, 0, 0, 0);
  const increment = 30 * 60 * 1000;
  return timeIncrement(totalSlots, startTime, increment);
};

const weeklyDateValues = (startDate) => {
  const midnight = new Date(startDate).setHours(0, 0, 0, 0);
  const increment = 24 * 60 * 60 * 1000;
  return timeIncrement(7, midnight, increment);
};

const toTimeValue = (timestamp) => new Date(timestamp).toTimeString().substring(0, 5);

const toShortDate = (timeStamp) => {
  const [day, , dayOfMonth] = new Date(timeStamp)
    .toDateString()
    .split(' ');
  return `${day} ${dayOfMonth}`;
};

const mergeDateAndTime = (date, timeSlot) => {
  const time = new Date(timeSlot);
  return new Date(date).setHours(
    time.getHours(),
    time.getMinutes(),
    time.getSeconds(),
    time.getMilliseconds()
  );
};


const RadioButtonIfAvailable = ({
  availableTimeSlots, date, timeSlot, checkedTimeSlot, handleChange,
}) => {
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some((a) => a.startsAt === startsAt)) {
    const isChecked = startsAt === checkedTimeSlot;
    return (
      <input
        name="startsAt"
        type="radio"
        value={startsAt}
        onChange={handleChange}
        checked={isChecked}
      />
    );
  }
  return null;
};

const TimeSlotTable = ({
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  checkedTimeSlot,
  handleChange,
}) => {
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);
  return (
    <table id="time-slots">
      <thead>
        <tr>
          <th />
          {dates.map((d) => (
            <th key={d}>{toShortDate(d)}</th>))}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          <tr key={timeSlot}>
            <th>{toTimeValue(timeSlot)}</th>
            {dates.map((date) => (
              <td key={date}>
                <RadioButtonIfAvailable
                  availableTimeSlots={availableTimeSlots}
                  date={date}
                  timeSlot={timeSlot}
                  checkedTimeSlot={checkedTimeSlot}
                  handleChange={handleChange}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export const AppointmentForm = ({
  selectableServices,
  service,
  onSubmit,
  salonOpensAt,
  salonClosesAt,
  today,
  availableTimeSlots,
  startsAt,
  selectableStylists,
  stylist,
}) => {
  const dates = weeklyDateValues(today);
  const [appointment, setAppointment] = useState({
    stylist,
    service,
    startsAt,
  });
  const handleStylistChange = ({ target: { value } }) => setAppointment(
    {
      ...appointment,
      stylist: value,
    }
  );
  const handleServiceChange = ({ target: { value } }) => setAppointment(
    {
      ...appointment,
      service: value,
    }
  );
  const handleStartsAtChange = useCallback(
    ({ target: { value } }) => setAppointment((appointment) => ({
      ...appointment,
      startsAt: parseInt(value),
    })), []
  );

  const renderableServices = (stylist) => {
    const selectedStylist = selectableStylists.filter((s) => (
      s.name === stylist));
    return selectedStylist.services;
  };

  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>

      <label htmlFor="stylist">Stylist</label>
      <select
        name="stylist"
        value={appointment.stylist}
        id="stylist"
        onChange={handleStylistChange}
      >
        <option />
        {selectableStylists.map((s) => (<option key={s.name}>{s.name}</option>))}
      </select>

      <label htmlFor="service">Service</label>
      <select
        name="service"
        value={appointment.service}
        id="service"
        onChange={handleServiceChange}
      >
        <option />
        {appointment.stylist
          ? selectableStylists.filter((s) => s.name === appointment.stylist)[0].services.map((service) => <option key={service}>{service}</option>)
          : selectableServices.map((t) => <option key={t}>{t}</option>)}
      </select>

      <TimeSlotTable
        salonOpensAt={salonOpensAt}
        salonClosesAt={salonClosesAt}
        today={today}
        availableTimeSlots={availableTimeSlots}
        checkedTimeSlot={appointment.startsAt}
        handleChange={handleStartsAtChange}
      />
      <input type="submit" value="Add" />
    </form>
  );
};
AppointmentForm.defaultProps = {
  availableTimeSlots: [],
  today: new Date(),
  salonOpensAt: 9,
  salonClosesAt: 19,
  selectableServices: [
    'Cut',
    'Blow-dry',
    'Cut & color',
    'Beard trim',
    'Cut & beard trim',
    'Extensions',
  ],
  selectableStylists: [
    { name: 'Jon', services: ['Cut', 'Beard trim', 'Cut & Beard trim'] },
    { name: 'Pepe', services: ['Cut', 'Beard trim', 'Cut & Beard trim'] },
    { name: 'Paul', services: ['Cut', 'Extensions', 'Cut & Color', 'Blow-dry'] },
    { name: 'Sara', services: ['Cut', 'Beard trim', 'Cut & Beard trim', 'Extensions', 'Blow-dry', 'Cut & color'] }],
};
