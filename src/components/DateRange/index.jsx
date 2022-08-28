import {
	add,
	addMonths,
	addYears,
	getDay,
	getWeek,
	isSameDay,
	lastDayOfMonth,
	lastDayOfYear,
	set,
	sub
} from 'date-fns';
import { isLastDayOfMonth } from 'date-fns/esm';
import { useEffect, useState } from 'react';
import {
	DateRangeControl,
	DateRangeHeader,
	DateRangeWrapper
} from './components';
import './scss/_date-range.scss';

export const DateRange = props => {
	// Props
	const { value: valueProp, setValue: setValueProp } = props;

	// Value
	const [value, setValue] = useState({
		startDate: valueProp?.startDate || new Date(),
		endDate: valueProp?.endDate || new Date()
	});
	const [calendarDate, setCalendarDate] = useState(value.startDate);
	const [calendar, setCalendar] = useState([]);
	const [showWrapper, setShowWrapper] = useState(false);
	const [typeValueChange, setTypeValueChange] = useState('startDate');
	const [months, setMonths] = useState([]);
	const [weeks, setWeeks] = useState([]);
	const weekdays = [
		{ name: 'monday', title: 'T2' },
		{ name: 'tuesday', title: 'T3' },
		{ name: 'wednesday', title: 'T4' },
		{ name: 'thursday', title: 'T5' },
		{ name: 'friday', title: 'T6' },
		{ name: 'saturday', title: 'T7' },
		{ name: 'sunday', title: 'CN' }
	];
	const types = [
		{ id: 0, title: 'Ngày' },
		{ id: 1, title: 'Tuần' },
		{ id: 2, title: 'Tháng' },
		{ id: 3, title: 'Năm' }
	];
	const [type, setType] = useState(0);

	// Handle change type
	const handleChangeType = newType => {
		setShowWrapper(true);
		setType(newType);
		setCalendarDate(value.startDate);
	};

	// Handle close wrapper calendar
	const handleCloseWrapper = () => {
		setTypeValueChange('startDate');
		setShowWrapper(false);
	};

	// Effect update wrapper content
	useEffect(() => {
		// Check start date end end date
		if (value.startDate - value.endDate > 0) {
			setValue({
				startDate: value.endDate,
				endDate: value.startDate
			});

			return;
		}

		if (type === 0 || type === 1) {
			if (type === 1) {
				// Check start date value for week type
				const startDateWeekday = getDay(value.startDate);
				if (type === 1 && startDateWeekday !== 1) {
					setValue({
						startDate: sub(value.startDate, {
							days: startDateWeekday === 0 ? 6 : startDateWeekday - 1
						}),
						endDate: value.endDate
					});

					return;
				}

				// Check end date value for week type
				const endDateWeekday = getDay(value.endDate);
				if (type === 1 && endDateWeekday !== 0) {
					setValue({
						startDate: value.startDate,
						endDate: add(value.endDate, {
							days: 7 - endDateWeekday
						})
					});

					return;
				}
			}

			// Calendar date min
			let calendarDateMin = set(calendarDate, { date: 1 }).getDay();
			calendarDateMin = calendarDateMin === 0 ? -5 : 2 - calendarDateMin;

			// Calendar date max
			const endDateOfMonth = lastDayOfMonth(calendarDate);
			let calendarDateMax =
				endDateOfMonth.getDay() !== 0
					? endDateOfMonth.getDate() - endDateOfMonth.getDay() + 7
					: endDateOfMonth.getDate();

			// New data
			let newCalendar = [];
			let newWeeks = [];

			// Update calendar
			for (let i = calendarDateMin; i <= calendarDateMax; i++) {
				// New day value
				let newDayValue = set(calendarDate, { date: i });

				// Update weeks
				if (getDay(newDayValue) === 1) {
					const newWeekValueType =
						isSameDay(newDayValue, value.startDate) &&
						isSameDay(newDayValue, value.endDate)
							? 'limit-week'
							: isSameDay(newDayValue, value.startDate)
							? 'start-week'
							: isSameDay(add(newDayValue, { days: 6 }), value.endDate)
							? 'end-week'
							: newDayValue - value.startDate > 0 &&
							  newDayValue - value.endDate < 0
							? 'active'
							: '';

					const newWeekValueTitle = getWeek(newDayValue, { weekStartsOn: 1 });

					newWeeks = [
						...newWeeks,
						{
							type: newWeekValueType,
							title: `Tuần ${newWeekValueTitle}`,
							value: newDayValue
						}
					];
				}

				// New day type
				let newDayType = i < 1 || i > endDateOfMonth.getDate() ? 'disable' : '';
				newDayType =
					type === 0
						? isSameDay(newDayValue, value.startDate) &&
						  isSameDay(newDayValue, value.endDate)
							? 'limit-date'
							: isSameDay(newDayValue, value.startDate)
							? 'start-date'
							: isSameDay(newDayValue, value.endDate)
							? 'end-date'
							: newDayValue - value.startDate > 0 &&
							  newDayValue - value.endDate < 0
							? 'active'
							: newDayType
						: newDayValue - value.startDate >= 0 &&
						  newDayValue - value.endDate <= 0
						? 'active'
						: newDayType;

				newCalendar = [
					...newCalendar,
					{ type: newDayType, value: newDayValue }
				];
			}

			setCalendar(newCalendar);
			setWeeks(newWeeks);
		}

		if (type === 2) {
			// Check start date for month type
			if (value.startDate.getDate() !== 1) {
				setValue({
					...value,
					startDate: set(value.startDate, { date: 1 })
				});

				return;
			}

			// Check end date for month type
			if (!isLastDayOfMonth(value.endDate)) {
				setValue({
					...value,
					endDate: set(value.endDate, {
						date: lastDayOfMonth(value.endDate).getDate()
					})
				});

				return;
			}

			// New months
			let newMonths = [];
			for (let i = 0; i < 12; i++) {
				const newDayValue = set(calendarDate, { month: i, date: 1 });

				const newMonthType =
					isSameDay(value.startDate, newDayValue) &&
					isSameDay(set(value.endDate, { date: 1 }), newDayValue)
						? 'limit-month'
						: isSameDay(value.startDate, newDayValue)
						? 'start-month'
						: isSameDay(set(value.endDate, { date: 1 }), newDayValue)
						? 'end-month'
						: value.startDate < newDayValue && newDayValue < value.endDate
						? 'active'
						: '';

				newMonths = [
					...newMonths,
					{
						type: newMonthType,
						value: newDayValue
					}
				];
			}

			// Update new months
			setMonths(newMonths);
		}

		if (type === 3) {
			// Check start date for year type
			if (
				!isSameDay(value.startDate, set(value.startDate, { month: 0, date: 1 }))
			) {
				setValue({
					startDate: set(value.startDate, { month: 0, date: 1 }),
					endDate: value.endDate
				});

				return;
			}

			// Check end date for year type
			if (!isSameDay(value.endDate, lastDayOfYear(value.endDate))) {
				setValue({
					startDate: value.startDate,
					endDate: lastDayOfYear(value.endDate)
				});

				return;
			}
		}

		// Update value prop
		if (setValueProp) setValueProp(value);
	}, [value, type, calendarDate, setValueProp]);

	// Handle change value
	const handleChangeValue = (newValue, typeProp) => {
		if (type === 3) {
			newValue = {
				...value,
				startDate: typeProp === 'startDate' ? newValue : value.startDate,
				endDate: typeProp === 'endDate' ? newValue : value.endDate
			};
		} else {
			newValue = {
				...value,
				startDate: typeValueChange === 'startDate' ? newValue : value.startDate,
				endDate: newValue
			};

			// Update new type value change
			setTypeValueChange(
				typeValueChange === 'startDate' ? 'endDate' : 'startDate'
			);
		}

		// Update new value
		setValue(newValue);
	};

	// Handle change calendar date
	const handleChangeCalendar = isPre => {
		console.log('type', type);
		setCalendarDate(
			type === 0 || type === 1
				? addMonths(calendarDate, isPre ? -1 : 1)
				: addYears(calendarDate, isPre ? -1 : 1)
		);
	};

	// Return JSX
	return (
		<>
			<div className={showWrapper ? 'date-range show' : 'date-range'}>
				{/* Date range header */}
				<DateRangeHeader
					types={types}
					type={type}
					handleChangeType={handleChangeType}
				/>

				{/* Date range control */}
				<DateRangeControl
					type={type}
					value={value}
					showWrapper={showWrapper}
					setShowWrapper={setShowWrapper}
				/>

				{/* Date range wrapper */}
				<DateRangeWrapper
					type={type}
					value={value}
					calendar={calendar}
					calendarDate={calendarDate}
					months={months}
					weeks={weeks}
					weekdays={weekdays}
					handleChangeValue={handleChangeValue}
					handleChangeCalendar={handleChangeCalendar}
				/>
			</div>
			<div
				className={
					showWrapper
						? 'date-range-calendar-over show'
						: 'date-range-calendar-over'
				}
				onClick={handleCloseWrapper}
			/>
		</>
	);
};
