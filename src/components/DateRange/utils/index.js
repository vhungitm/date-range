export const getWeek = target => {
	var dayNr = (target.getDay() + 6) % 7;
	var firstThursday = target.valueOf();
	target.setDate(target.getDate() - dayNr + 3);
	target.setMonth(0, 1);
	if (target.getDay() !== 4) {
		target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
	}
	return 1 + Math.ceil((firstThursday - target) / 604800000);
};
