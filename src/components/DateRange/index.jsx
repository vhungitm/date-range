import { add, format, sub } from 'date-fns';
import React, { useEffect, useState } from 'react';
import {
	DateRangeCalendar,
	DateRangeHeader,
	DateRangeWrapper,
	DateRangeWrapperHeader
} from './components';
import './scss/_date-range.scss';

export const DateRange = () => {
	// Value
	const [value, setValue] = useState({
		startDate: new Date('2022-8-10'),
		endDate: new Date('2022-8-28')
	});

	// Calendar
	const [calendarDate, setCalendarDate] = useState(value.startDate);
	const [calendar, setCalendar] = useState([]);
	const [showCalendar, setShowCalendar] = useState(true);
	// Weekdays
	const weekdays = [
		{
			name: 'monday',
			title: 'T2'
		},
		{
			name: 'tuesday',
			title: 'T3'
		},
		{
			name: 'wednesday',
			title: 'T4'
		},
		{
			name: 'thursday',
			title: 'T5'
		},
		{
			name: 'friday',
			title: 'T6'
		},
		{
			name: 'saturday',
			title: 'T7'
		},
		{
			name: 'sunday',
			title: 'CN'
		}
	];

	// Handle show, close calendar
	const handleShowCalendar = () => setShowCalendar(true);
	const handleCloseCalendar = () => setShowCalendar(false);

	// Type
	const types = [
		{ id: 0, title: 'Ngày' },
		{ id: 1, title: 'Tuần' },
		{ id: 2, title: 'Tháng' },
		{ id: 3, title: 'Năm' }
	];
	const [type, setType] = useState(0);

	// Effect update calendar
	useEffect(() => {
		// Fix value
		const startDateValue = new Date(format(value.startDate, 'yyyy-MM-dd'));
		const endDateValue = new Date(format(value.endDate, 'yyyy-MM-dd'));

		if (startDateValue - endDateValue > 0) {
			setValue({
				startDate:
					type === 0
						? endDateValue
						: sub(new Date(format(endDateValue, 'yyyy-MM-dd')), { days: 6 }),
				endDate:
					type === 0
						? endDateValue
						: add(new Date(format(startDateValue, 'yyyy-MM-dd')), { days: 6 })
			});
			return;
		}

		// Update calendar date
		const calendarYear = calendarDate.getFullYear();
		const calendarMonth = calendarDate.getMonth();

		const endDate = new Date(calendarYear, calendarMonth + 1, 0);
		let newCalendar = [];

		// Date min
		let dateMin = new Date(calendarYear, calendarMonth, 1).getDay();
		dateMin = dateMin === 0 ? -5 : 2 - dateMin;

		// Date max
		let dateMax =
			endDate.getDay() === 0
				? endDate.getDate()
				: endDate.getDate() + (7 - endDate.getDay());

		// Update calendar
		for (let i = dateMin; i <= dateMax; i++) {
			let newValue = new Date(calendarYear, calendarMonth, i);
			newValue = new Date(format(newValue, 'yyyy-MM-dd'));

			let type = i < 1 || i > endDate.getDate() ? 'disable' : '';
			type =
				newValue - startDateValue === 0 && newValue - endDateValue === 0
					? 'limit-date'
					: newValue - startDateValue === 0
					? 'start-date'
					: newValue - endDateValue === 0
					? 'end-date'
					: newValue - startDateValue > 0 && newValue - endDateValue < 0
					? 'active'
					: type;

			newCalendar = [...newCalendar, { type, value: newValue }];
		}

		setCalendar(newCalendar);
	}, [value, calendarDate]);

	// Type value change
	const [typeValueChange, setTypeValueChange] = useState('startDate');

	// Handle change value
	const handleChangeValue = (newValue, type = 0) => {
		setValue({
			startDate: typeValueChange === 'startDate' ? newValue : value.startDate,
			endDate:
				type === 0
					? typeValueChange === 'startDate'
						? newValue
						: newValue
					: add(new Date(format(newValue, 'yyyy-MM-dd')), { days: 6 })
		});

		setTypeValueChange(
			typeValueChange === 'startDate' ? 'endDate' : 'startDate'
		);
	};

	// Handle change month
	const handleChangeMonth = (type = 'pre') => {
		const calendarYear = calendarDate.getFullYear();
		let calendarMonth = calendarDate.getMonth();
		calendarMonth += type === 'pre' ? -1 : 1;

		setCalendarDate(new Date(calendarYear, calendarMonth, 1));
	};

	// Return JSX
	return (
		<div className={showCalendar ? 'date-range show-calendar' : 'date-range'}>
			{/* Date range header */}
			<DateRangeHeader types={types} type={type} setType={setType} />

			{/* Date range control */}
			<div
				className="date-range-control"
				onClick={() => setShowCalendar(!showCalendar)}
			>
				<div className="date-range-control-value">
					{format(value.startDate, 'dd.MM.yyyy')}
					{' đến '}
					{format(value.endDate, 'dd.MM.yyyy')}
				</div>
				<div className="date-range-control-icon"></div>
			</div>

			{/* Date range wrapper */}
			<DateRangeWrapper
				type={type}
				calendar={calendar}
				calendarDate={calendarDate}
				weekdays={weekdays}
				handleChangeValue={handleChangeValue}
				handleChangeMonth={handleChangeMonth}
			/>
		</div>
	);
};
