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
    <table id="timeslots">
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
}) => {
  const dates = weeklyDateValues(today);
  const [appointment, setAppointment] = useState({
    service,
    startsAt,
  });
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


  return (
    <form id="appointment" onSubmit={() => onSubmit(appointment)}>
      <label htmlFor="service">Service</label>
      <select
        name="service"
        value={appointment.service}
        id="service"
        onChange={handleServiceChange}
        readOnly
      >
        <option />
        {selectableServices.map((s) => (<option key={s}>{s}</option>))}
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
};
