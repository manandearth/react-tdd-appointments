const today = new Date();

const at = hours => today.setHours(hours, 0);

export const sampleAppointments = [
	{startsAt: at(9), customer: {
		firstName: 'Charlie' ,
		lastName: 'Nimrod'} },
	{startsAt: at(10), customer: {
		firstName: 'Frankie',
		lastName: 'Kenneddy'} },
	{startsAt: at(11), customer: {
		firstName: 'Casey',
		lastName: 'Chaplin' } },
	{startsAt: at(12), customer: {
		firstName: 'Ashley',
	lastName: 'Smith'} },
	{startsAt: at(13), customer: {
		firstName: 'Jordan',
	lastName: 'Air'} },
	{startsAt: at(14), customer: {
		firstName: 'Jay',
	lastName: 'Lohr'} },
	{startsAt: at(15), customer: {
		firstName: 'Alex',
	lastName: 'Knight'} },
	{startsAt: at(16), customer: {
		firstName: 'Jules',
	lastName: 'Joplin'} },
	{startsAt: at(17), customer: {
		firstName: 'Stevie',
	lastName: 'Ray Vaughn'} }
];

