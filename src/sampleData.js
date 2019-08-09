const today = new Date();

const at = hours => today.setHours(hours, 0);

export const sampleAppointments = [
	{startAt: at(9), customer: { firstName: 'Charlie' } },
	{startAt: at(10), customer: { firstName: 'Frankie' } },
	{startAt: at(11), customer: { firstName: 'Casey' } },
	{startAt: at(12), customer: { firstName: 'Ashley' } },
	{startAt: at(13), customer: { firstName: 'Jordan' } },
	{startAt: at(14), customer: { firstName: 'Jay' } },
	{startAt: at(15), customer: { firstName: 'Alex' } },
	{startAt: at(16), customer: { firstName: 'Jules' } },
	{startAt: at(17), customer: { firstName: 'Stevie' } }
];
