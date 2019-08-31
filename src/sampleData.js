import { name, phone, lorem } from 'faker';

Array.prototype.unique = function () {
  return this.filter((value, index, self) => self.indexOf(value) === index);
};

Array.prototype.pickRandom = function () {
  return this[Math.floor(Math.random() * this.length)];
};

const today = new Date();
const at = (hours) => today.setHours(hours, 0);

const stylists = [0, 1, 2, 3, 4, 5, 6]
  .map(() => name.firstName())
  .unique();

const services = [
  'Cut',
  'Blow-dry',
  'Cut & color',
  'Beard trim',
  'Cut & beard trim',
  'Extensions',
];

const generateFakeCustomer = () => ({
  firstName: name.firstName(),
  lastName: name.lastName(),
  phoneNumber: phone.phoneNumberFormat(1),
});

const generateFakeAppointment = () => ({
  customer: generateFakeCustomer(),
  stylist: stylists.pickRandom(),
  service: services.pickRandom(),
  notes: lorem.paragraph(),
});

export const sampleAppointments = [
  { startsAt: at(9), ...generateFakeAppointment() },
  { startsAt: at(10), ...generateFakeAppointment() },
  { startsAt: at(11), ...generateFakeAppointment() },
  { startsAt: at(12), ...generateFakeAppointment() },
  { startsAt: at(13), ...generateFakeAppointment() },
  { startsAt: at(14), ...generateFakeAppointment() },
  { startsAt: at(15), ...generateFakeAppointment() },
  { startsAt: at(16), ...generateFakeAppointment() },
  { startsAt: at(17), ...generateFakeAppointment() },
];

const pickMany = (items, number) => Array(number)
  .fill(1)
  .map(() => items.pickRandom());

export const sampleStylists = [
  { name: 'Jon', services: ['Cut', 'Beard trim', 'Cut & Beard trim'] },
  { name: 'Pepe', services: ['Cut', 'Beard trim', 'Cut & Beard trim'] },
  { name: 'Paul', services: ['Cut', 'Extensions', 'Cut & Color', 'Blow-dry'] },
  { name: 'Sara', services: ['Cut', 'Beard trim', 'Cut & Beard trim', 'Extensions', 'Blow-dry', 'Cut & color'] }];

const buildTimeSlots = () => {
  const today = new Date();
  const startTime = today.setHours(9, 0, 0, 0);
  const times = [...Array(7).keys()].map((day) => {
    const daysToAdd = day * 24 * 60 * 60 * 1000;
    return [...Array(20).keys()].map((halfHour) => {
      const halfHoursToAdd = halfHour * 30 * 60 * 1000;
      return {
        startsAt: startTime + daysToAdd + halfHoursToAdd,
      };
    });
  });
  return [].concat(...times);
};


const randomPicks = (n) => pickMany(
  buildTimeSlots(),
  n
);
export const sampleAvailableTimeSlots = sampleStylists.reduce((obj, item) => {
  obj[item.name] = randomPicks(50); return obj;
}, {});
