import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	eachDayOfInterval,
	eachMonthOfInterval,
	eachWeekOfInterval,
	eachYearOfInterval,
	endOfMonth,
	endOfWeek,
	endOfYear,
	getISOWeek,
	getMonth,
	getYear,
	isFirstDayOfMonth,
	isLastDayOfMonth,
	isMonday,
	isSameDay,
	isSameMonth,
	isSunday,
	lastDayOfMonth,
	lastDayOfWeek,
	lastDayOfYear,
	set,
	setDate,
	setMonth,
	startOfMonth,
	startOfWeek,
	startOfYear,
	subDays,
	subMonths,
	subWeeks,
	subYears
} from 'date-fns';
import { useEffect, useRef, useState } from 'react';
import {
	DateRangeControl,
	DateRangeHeader,
	DateRangeWrapper
} from './components';
import { defaultWeekdays, types } from './datas';
import './scss/_date-range.scss';

export const DateRange = props => {
	// Props
	const {
		value: valueProp,
		handleChangeValue: handleChangeValueProp,
		type: typeProp,
		handleChangeType: handleChangeTypeProp,
		weekdays: weekdaysProp,
		minDate,
		maxDate,
		maxDayQuantity,
		maxWeekQuantity,
		maxMonthQuantity,
		maxYearQuantity
	} = props;

	// Value
	const [value, setValue] = useState({
		startDate: valueProp?.startDate || new Date(),
		endDate: valueProp?.endDate || new Date()
	});
	const [calendarDate, setCalendarDate] = useState(value.startDate);
	const [calendar, setCalendar] = useState([]);
	const [showWrapper, setShowWrapper] = useState(false);
	const [isStartDate, setIsStartDate] = useState(true);
	const [months, setMonths] = useState([]);
	const [weeks, setWeeks] = useState([]);
	const [weekdays] = useState(weekdaysProp || defaultWeekdays);
	const [type, setType] = useState(typeProp || 0);

	// Handle change type
	const handleChangeType = newType => {
		setShowWrapper(true);
		setType(newType);
		setCalendarDate(value.startDate);

		if (handleChangeTypeProp) handleChangeTypeProp(newType);
	};

	// Effect close wrapper
	const ref = useRef();

	useEffect(() => {
		const handleCloseWrapper = e => {
			if (ref.current.contains(e.target)) return;
			setShowWrapper(false);
		};

		document.body.addEventListener('click', e => handleCloseWrapper(e));

		return () =>
			document.body.removeEventListener('click', e => handleCloseWrapper(e));
	}, []);

	// Effect update wrapper content
	useEffect(() => {
		// Check time line
		if (value.startDate > value.endDate) {
			setValue({ startDate: value.endDate, endDate: value.startDate });
			setCalendarDate(value.endDate);
			return;
		}

		// Day and week type
		if (type === 0 || type === 1) {
			// Check day type
			if (type === 0) {
				// Check min date
				if (minDate && value.startDate < minDate) {
					setValue({ ...value, startDate: minDate });
					setCalendarDate(minDate);
					return;
				}

				// Check max date
				if (maxDate && value.endDate > maxDate) {
					setValue({ ...value, endDate: maxDate });
					return;
				}

				// Check max day quantity
				if (maxDayQuantity > 0) {
					const dayQuantity = eachDayOfInterval({
						start: value.startDate,
						end: value.endDate
					}).length;

					if (dayQuantity > maxDayQuantity) {
						setValue({
							...value,
							endDate: addDays(value.startDate, maxDayQuantity - 1)
						});
						return;
					}
				}
			}

			// Check week type
			if (type === 1) {
				// Check start date
				const startWeek = startOfWeek(value.startDate, { weekStartsOn: 1 });

				if (!isMonday(value.startDate)) {
					setValue({ ...value, startDate: startWeek });
					setCalendarDate(startWeek);
					return;
				}

				// Check min date
				if (minDate) {
					const minDateByWeek = startOfWeek(minDate, { weekStartsOn: 1 });

					if (value.startDate < minDateByWeek) {
						setValue({ ...value, startDate: minDateByWeek });
						setCalendarDate(minDateByWeek);
						return;
					}
				}

				// Check end date
				if (!isSunday(value.endDate)) {
					setValue({
						...value,
						endDate: endOfWeek(value.endDate, { weekStartsOn: 1 })
					});
					return;
				}

				// Check max date
				if (maxDate) {
					const maxDateByWeek = endOfWeek(maxDate, { weekStartsOn: 1 });

					if (value.endDate > maxDateByWeek) {
						setValue({ ...value, endDate: maxDateByWeek });
						return;
					}
				}

				// Check max week quantity
				if (maxWeekQuantity > 0) {
					const weekQuantity = eachWeekOfInterval(
						{ start: value.startDate, end: value.endDate },
						{ weekStartsOn: 1 }
					).length;

					if (weekQuantity > maxWeekQuantity) {
						setValue({
							...value,
							endDate: addWeeks(value.startDate, maxWeekQuantity - 1)
						});
						return;
					}
				}
			}

			// New calendar
			let newCalendar = [];
			let newWeeks = [];

			// Date range
			eachDayOfInterval({
				start: startOfWeek(startOfMonth(calendarDate), { weekStartsOn: 1 }),
				end: lastDayOfWeek(endOfMonth(calendarDate), { weekStartsOn: 1 })
			}).forEach(item => {
				// Update weeks
				if (isMonday(item)) {
					const newWeekValueType =
						isSameDay(item, value.startDate) &&
						isSameDay(endOfWeek(item, { weekStartsOn: 1 }), value.endDate)
							? 'limit-week'
							: isSameDay(item, value.startDate)
							? 'start-week'
							: isSameDay(endOfWeek(item, { weekStartsOn: 1 }), value.endDate)
							? 'end-week'
							: item > value.startDate && item < value.endDate
							? 'active'
							: minDate &&
							  startOfWeek(item, { weekStartsOn: 1 }) <
									startOfWeek(minDate, { weekStartsOn: 1 })
							? 'block'
							: maxDate &&
							  endOfWeek(item, { weekStartsOn: 1 }) >
									endOfWeek(maxDate, { weekStartsOn: 1 })
							? 'block'
							: '';
					const newWeekValueTitle = getISOWeek(item, { weekStartsOn: 1 });

					newWeeks = [
						...newWeeks,
						{
							type: newWeekValueType,
							title: `Tuần ${newWeekValueTitle}`,
							value: item
						}
					];
				}

				// New day type
				let newDayType = !isSameMonth(item, calendarDate) ? 'disable' : '';
				newDayType =
					type === 0
						? isSameDay(item, value.startDate) && isSameDay(item, value.endDate)
							? 'limit-date'
							: isSameDay(item, value.startDate)
							? 'start-date'
							: isSameDay(item, value.endDate)
							? 'end-date'
							: item > value.startDate && item < value.endDate
							? 'active'
							: minDate && item < minDate
							? 'block'
							: maxDate && item > maxDate
							? 'block'
							: newDayType
						: item >= value.startDate && item <= value.endDate
						? 'active'
						: minDate &&
						  startOfWeek(item, { weekStartsOn: 1 }) <
								startOfWeek(minDate, { weekStartsOn: 1 })
						? 'block'
						: maxDate &&
						  endOfWeek(item, { weekStartsOn: 1 }) >
								endOfWeek(maxDate, { weekStartsOn: 1 })
						? 'block'
						: newDayType;

				newCalendar = [...newCalendar, { type: newDayType, value: item }];
			});

			setCalendar(newCalendar);
			setWeeks(newWeeks);
		}

		// Month type
		if (type === 2) {
			// Check start date
			if (!isFirstDayOfMonth(value.startDate)) {
				setValue({ ...value, startDate: startOfMonth(value.startDate) });
				setCalendarDate(startOfMonth(value.startDate));
				return;
			}

			// Check min date
			if (minDate) {
				if (value.startDate < startOfMonth(minDate)) {
					setValue({ ...value, startDate: startOfMonth(minDate) });
					setCalendarDate(startOfMonth(minDate));
					return;
				}
			}

			// Check end date
			if (!isLastDayOfMonth(value.endDate)) {
				setValue({ ...value, endDate: lastDayOfMonth(value.endDate) });
				return;
			}

			// Check max date
			if (maxDate) {
				if (value.endDate > lastDayOfMonth(maxDate)) {
					setValue({ ...value, endDate: lastDayOfMonth(maxDate) });
					return;
				}
			}

			// Check max month quantity
			if (maxMonthQuantity > 0) {
				const valueMonthQuantity = eachMonthOfInterval({
					start: value.startDate,
					end: value.endDate
				}).length;

				if (valueMonthQuantity > maxMonthQuantity) {
					setValue({
						...value,
						endDate: addMonths(value.startDate, maxMonthQuantity - 1)
					});
					return;
				}
			}

			// New months
			let newMonths = [];
			for (let i = 0; i < 12; i++) {
				let newMonthValue = startOfMonth(setMonth(calendarDate, i));

				const newMonthType =
					isSameDay(value.startDate, newMonthValue) &&
					isSameDay(endOfMonth(value.endDate), newMonthValue)
						? 'limit-month'
						: isSameDay(value.startDate, newMonthValue)
						? 'start-month'
						: isSameDay(set(value.endDate, { date: 1 }), newMonthValue)
						? 'end-month'
						: value.startDate < newMonthValue && newMonthValue < value.endDate
						? 'active'
						: minDate && newMonthValue < startOfMonth(minDate)
						? 'block'
						: maxDate && newMonthValue > endOfMonth(maxDate)
						? 'block'
						: '';

				newMonths = [
					...newMonths,
					{ type: newMonthType, value: newMonthValue }
				];
			}

			// Update new months
			setMonths(newMonths);
		}

		// Year type
		if (type === 3) {
			// Check start date
			if (!isSameDay(value.startDate, startOfYear(value.startDate))) {
				setValue({ ...value, startDate: startOfYear(value.startDate) });
				setCalendarDate(startOfYear(value.startDate));
				return;
			}

			// Check min date
			if (minDate && value.startDate < startOfYear(minDate)) {
				setValue({ ...value, startDate: startOfYear(minDate) });
				setCalendarDate(startOfYear(minDate));
				return;
			}

			// Check end date
			if (!isSameDay(value.endDate, lastDayOfYear(value.endDate))) {
				setValue({ ...value, endDate: lastDayOfYear(value.endDate) });
				return;
			}

			// Check max date
			if (maxDate && value.endDate > endOfYear(maxDate)) {
				setValue({ ...value, endDate: endOfYear(maxDate) });
				return;
			}

			// Check max year quantity
			if (maxYearQuantity) {
				const yearQuantity = eachYearOfInterval({
					start: value.startDate,
					end: value.endDate
				}).length;

				if (yearQuantity > maxYearQuantity) {
					setValue({
						...value,
						endDate: addYears(value.startDate, maxYearQuantity - 1)
					});
				}
			}
		}

		// Update value prop
		if (handleChangeValueProp) handleChangeValueProp(value);
	}, [
		value,
		type,
		calendarDate,
		minDate,
		maxDate,
		maxDayQuantity,
		maxWeekQuantity,
		maxMonthQuantity,
		maxYearQuantity,
		handleChangeValueProp
	]);

	// Handle change value
	const handleChangeValue = (newValue, isStartDateProp) => {
		if (type === 0) {
			// New value
			let newStartDate = isStartDate ? newValue : value.startDate;
			let newEndDate = newValue;

			// Check time line
			let timeLineInvalid = false;

			if (newStartDate > newEndDate) {
				const tempDate = newStartDate;
				newStartDate = newEndDate;
				newEndDate = tempDate;
				timeLineInvalid = true;
			}

			// Check min and max date
			if (minDate && newStartDate < minDate) return;
			if (maxDate && newEndDate > maxDate) return;

			// Check max day quantity
			if (!isStartDate && maxDayQuantity > 0) {
				const dayQuantity = eachDayOfInterval({
					start: newStartDate,
					end: newEndDate
				});

				if (dayQuantity > maxDayQuantity) {
					if (timeLineInvalid) {
						newStartDate = subDays(newEndDate, maxDayQuantity - 1);
					} else {
						newEndDate = addDays(newStartDate, maxDayQuantity - 1);
					}
				}
			}

			// Update new value and type change
			setValue({ startDate: newStartDate, endDate: newEndDate });
			setIsStartDate(!isStartDate);
		} else if (type === 1) {
			// New value
			let newStartDate = isStartDate
				? startOfWeek(newValue, { weekStartsOn: 1 })
				: value.startDate;
			let newEndDate = endOfWeek(newValue, { weekStartsOn: 1 });

			// Check time line
			let timeLineInvalid = false;

			if (newStartDate > newEndDate) {
				const tempDate = newStartDate;
				newStartDate = startOfWeek(newEndDate, { weekStartsOn: 1 });
				newEndDate = endOfWeek(tempDate, { weekStartsOn: 1 });
				timeLineInvalid = true;
			}

			// Check min and max date
			if (minDate && newStartDate < startOfWeek(minDate, { weekStartsOn: 1 }))
				return;
			if (maxDate && newEndDate > endOfWeek(maxDate, { weekStartsOn: 1 }))
				return;

			// Check max week quantity
			if (!isStartDate && maxWeekQuantity > 0) {
				const weekQuantity = eachWeekOfInterval(
					{ start: newStartDate, end: newEndDate },
					{ weekStartsOn: 1 }
				).length;

				if (weekQuantity > maxWeekQuantity) {
					if (timeLineInvalid) {
						newStartDate = subWeeks(newEndDate, maxWeekQuantity - 1);
						newStartDate = startOfWeek(newStartDate, { weekStartsOn: 1 });
					} else {
						newEndDate = addWeeks(newStartDate, maxWeekQuantity - 1);
						newEndDate = endOfWeek(newEndDate, { weekStartsOn: 1 });
					}
				}
			}

			// Update new value and type change
			setValue({ startDate: newStartDate, endDate: newEndDate });
			setIsStartDate(!isStartDate);
		} else if (type === 2) {
			// New value
			let newStartDate = isStartDate ? setDate(newValue, 1) : value.startDate;
			let newEndDate = endOfMonth(newValue);

			// Check time line
			let timeLineInvalid = false;

			if (newStartDate > newEndDate) {
				const tempDate = newStartDate;
				newStartDate = setDate(newEndDate, 1);
				newEndDate = endOfMonth(tempDate);
				timeLineInvalid = true;
			}

			// Check min and max date
			if (minDate && newStartDate < startOfMonth(minDate)) return;
			if (maxDate && newEndDate > endOfMonth(maxDate)) return;

			// Check max month quantity
			if (!isStartDate && maxMonthQuantity > 0) {
				const monthQuantity = eachMonthOfInterval({
					start: newStartDate,
					end: newEndDate
				}).length;

				if (monthQuantity > maxMonthQuantity) {
					if (timeLineInvalid) {
						newStartDate = subMonths(newEndDate, maxMonthQuantity - 1);
						newStartDate = setDate(newStartDate, 1);
					} else {
						newEndDate = addMonths(newStartDate, maxMonthQuantity - 1);
						newEndDate = endOfMonth(newEndDate);
					}
				}
			}

			// Update new value end type change
			setValue({ startDate: newStartDate, endDate: newEndDate });
			setIsStartDate(!isStartDate);
		} else {
			// New value
			let newStartDate = isStartDateProp
				? startOfYear(newValue)
				: value.startDate;
			let newEndDate = isStartDateProp ? value.endDate : endOfYear(newValue);

			// Check min and max date
			if (minDate && newStartDate < startOfYear(minDate)) return;
			if (maxDate && newEndDate > endOfYear(maxDate)) return;

			// Check max year quantity
			if (maxYearQuantity > 0) {
				if (isStartDateProp) {
					newEndDate = addYears(newStartDate, maxYearQuantity - 1);
					newEndDate = endOfYear(newEndDate);
				} else {
					newStartDate = subYears(newEndDate, maxYearQuantity - 1);
					newStartDate = startOfYear(newStartDate);
				}
			}

			// Update new value
			setValue({ startDate: newStartDate, endDate: newEndDate });
		}
	};

	// Handle change calendar date
	const handleChangeCalendar = isPre => {
		if (isPre) {
			if (type === 0 || type === 1) {
				const newCalendarDate = subMonths(calendarDate, 1);

				if (
					minDate &&
					getYear(newCalendarDate) <= getYear(minDate) &&
					getMonth(newCalendarDate) < getMonth(minDate)
				)
					return;

				setCalendarDate(newCalendarDate);
			} else {
				const newCalendarDate = subYears(calendarDate, 1);

				if (minDate && getYear(newCalendarDate) < getYear(minDate)) return;
				setCalendarDate(newCalendarDate);
			}
		} else {
			if (type === 0 || type === 1) {
				const newCalendarDate = addMonths(calendarDate, 1);

				if (
					maxDate &&
					getYear(newCalendarDate) >= getYear(maxDate) &&
					getMonth(newCalendarDate) > getMonth(maxDate)
				)
					return;

				setCalendarDate(newCalendarDate);
			} else {
				const newCalendarDate = addYears(calendarDate, 1);

				if (maxDate && getYear(newCalendarDate) > getYear(maxDate)) return;
				setCalendarDate(newCalendarDate);
			}
		}
	};

	// Return JSX
	return (
		<div
			ref={ref}
			className={showWrapper ? 'itm-date-range show' : 'itm-date-range'}
		>
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
				setShowWrapper={() => setShowWrapper(!showWrapper)}
			/>

			{/* Date range wrapper */}
			<DateRangeWrapper
				type={type}
				value={value}
				calendar={calendar}
				calendarDate={calendarDate}
				months={months}
				weeks={weeks}
				weekdays={Object.values(weekdays)}
				handleChangeValue={handleChangeValue}
				handleChangeCalendar={handleChangeCalendar}
			/>
		</div>
	);
};
