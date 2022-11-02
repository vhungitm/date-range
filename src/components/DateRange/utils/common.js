import {
	eachDayOfInterval,
	endOfWeek,
	isAfter,
	isBefore,
	isSameDay,
	startOfWeek
} from 'date-fns';
import {
	eachMonthOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval
} from 'date-fns/esm';

export const isAfterOrSame = (dateLeft, dateRight) =>
	isAfter(dateLeft, dateRight) || isSameDay(dateLeft, dateRight);
export const isBeforeOrSame = (dateLeft, dateRight) =>
	isBefore(dateLeft, dateRight) || isSameDay(dateLeft, dateRight);
export const isBetween = (date, dateInterval) =>
	isBeforeOrSame(date, dateInterval.end) &&
	isAfterOrSame(date, dateInterval.start);

export const getStartOfWeek = date => startOfWeek(date, { weekStartsOn: 1 });
export const getEndOfWeek = date => endOfWeek(date, { weekStartsOn: 1 });

export const getDayQuantity = (startDate, endDate) =>
	eachDayOfInterval({ start: startDate, end: endDate }).length;
export const getWeekQuantity = (startDate, endDate) =>
	eachWeekOfInterval({ start: startDate, end: endDate }, { weekStartsOn: 1 })
		.length;
export const getMonthQuantity = (startDate, endDate) =>
	eachMonthOfInterval({ start: startDate, end: endDate }).length;
export const getYearQuantity = (startDate, endDate) =>
	eachYearOfInterval({ start: startDate, end: endDate }).length;
