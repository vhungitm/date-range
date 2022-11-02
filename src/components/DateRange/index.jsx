import {
	addDays,
	addMonths,
	addWeeks,
	addYears,
	eachDayOfInterval,
	endOfMonth,
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
	lastDayOfYear,
	set,
	setDate,
	setMonth,
	startOfMonth,
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

import './index.scss';
import {
	getDayQuantity,
	getEndOfWeek,
	getMonthQuantity,
	getStartOfWeek,
	getWeekQuantity,
	getYearQuantity,
	isBetween
} from './utils';

export const DateRange = props => {
	const {
		value: valueProp,
		handleChangeValue: handleChangeValueProp,
		type: typeProp,
		handleChangeType: handleChangeTypeProp,
		weekdays: weekdaysProp,
		minDate,
		maxDate,
		minDayQuantity,
		maxDayQuantity,
		minWeekQuantity,
		maxWeekQuantity,
		minMonthQuantity,
		maxMonthQuantity,
		minYearQuantity,
		maxYearQuantity
	} = props;

	const [previewValue, setPreviewValue] = useState();
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

	const handleChangeType = newType => {
		setShowWrapper(true);
		setType(newType);
		setCalendarDate(value.startDate);

		if (handleChangeTypeProp) handleChangeTypeProp(newType);
	};

	// Effect close wrapper
	const ref = useRef();
	useEffect(() => {
		const handleCloseWrapper = e =>
			!ref?.current?.contains(e.target) && setShowWrapper(false);

		document.addEventListener('click', handleCloseWrapper);
		return () => document.removeEventListener('click', handleCloseWrapper);
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

				// Check min day quantity
				if (minDayQuantity > 1) {
					const dayQuantity = getDayQuantity(value.startDate, value.endDate);

					if (dayQuantity < minDayQuantity) {
						setValue({
							...value,
							endDate: addDays(value.startDate, minDayQuantity - 1)
						});
						return;
					}
				}

				// Check max day quantity
				if (maxDayQuantity > 0) {
					const dayQuantity = getDayQuantity(value.startDate, value.endDate);

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

				if (!isMonday(value.startDate)) {
					const startWeek = getStartOfWeek(value.startDate);

					setValue({ ...value, startDate: startWeek });
					setCalendarDate(startWeek);
					return;
				}

				// Check min date
				if (minDate) {
					const minDateByWeek = getStartOfWeek(minDate);

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
						endDate: getEndOfWeek(value.endDate)
					});
					return;
				}

				// Check max date
				if (maxDate) {
					const maxDateByWeek = getEndOfWeek(maxDate);

					if (value.endDate > maxDateByWeek) {
						setValue({ ...value, endDate: maxDateByWeek });
						return;
					}
				}

				// Check min week quantity
				if (minWeekQuantity > 0) {
					const weekQuantity = getWeekQuantity(value.startDate, value.endDate);

					if (weekQuantity < minWeekQuantity) {
						setValue({
							...value,
							endDate: getEndOfWeek(
								addWeeks(value.startDate, minWeekQuantity - 1),
								{
									weekStartsOn: 1
								}
							)
						});
						return;
					}
				}

				// Check max week quantity
				if (maxWeekQuantity > 0) {
					const weekQuantity = getWeekQuantity(value.startDate, value.endDate);

					if (weekQuantity > maxWeekQuantity) {
						setValue({
							...value,
							endDate: getEndOfWeek(
								addWeeks(value.startDate, maxWeekQuantity - 1),
								{
									weekStartsOn: 1
								}
							)
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
				start: getStartOfWeek(startOfMonth(calendarDate)),
				end: getEndOfWeek(endOfMonth(calendarDate))
			}).forEach(item => {
				// Update weeks
				if (isMonday(item)) {
					let newWeekValueType =
						isSameDay(item, value.startDate) &&
						isSameDay(getEndOfWeek(item), value.endDate)
							? ' limit-week'
							: isSameDay(item, value.startDate)
							? ' start-week'
							: isSameDay(getEndOfWeek(item), value.endDate)
							? ' end-week'
							: item > value.startDate && item < value.endDate
							? ' active'
							: minDate && getStartOfWeek(item) < getStartOfWeek(minDate)
							? ' block'
							: maxDate && getEndOfWeek(item) > getEndOfWeek(maxDate)
							? ' block'
							: '';

					if (previewValue) {
						newWeekValueType +=
							isSameDay(item, previewValue.startDate) &&
							isSameDay(getEndOfWeek(item), previewValue.endDate)
								? ' limit-week-preview'
								: isSameDay(item, previewValue.startDate)
								? ' start-week-preview'
								: isSameDay(getEndOfWeek(item), previewValue.endDate)
								? ' end-week-preview'
								: item > previewValue.startDate && item < previewValue.endDate
								? ' active-preview'
								: '';
					}

					const newWeekValueTitle = getISOWeek(item);

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
				let newDayType = !isSameMonth(item, calendarDate) ? ' disable' : '';

				newDayType =
					type === 0
						? isSameDay(item, value.startDate) && isSameDay(item, value.endDate)
							? ' limit-date'
							: isSameDay(item, value.startDate)
							? ' start-date'
							: isSameDay(item, value.endDate)
							? ' end-date'
							: item > value.startDate && item < value.endDate
							? ' active'
							: minDate && item < minDate
							? ' block'
							: maxDate && item > maxDate
							? ' block'
							: newDayType
						: isBetween(item, { start: value.startDate, end: value.endDate })
						? ' active'
						: minDate && getStartOfWeek(item) < getStartOfWeek(minDate)
						? ' block'
						: maxDate && getEndOfWeek(item) > getEndOfWeek(maxDate)
						? ' block'
						: newDayType;

				if (previewValue) {
					newDayType +=
						type === 0
							? isSameDay(item, previewValue.startDate) &&
							  isSameDay(item, previewValue.endDate)
								? ' limit-date-preview'
								: isSameDay(item, previewValue.startDate)
								? ' start-date-preview'
								: isSameDay(item, previewValue.endDate)
								? ' end-date-preview'
								: item > previewValue.startDate && item < previewValue.endDate
								? ' active-preview'
								: ''
							: type === 1
							? isBetween(item, {
									start: previewValue.startDate,
									end: previewValue.endDate
							  })
								? ' active-preview'
								: ''
							: '';
				}

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

			// Check min month quantity
			if (minMonthQuantity > 0) {
				const valueMonthQuantity = getMonthQuantity(
					value.startDate,
					value.endDate
				);

				if (valueMonthQuantity < minMonthQuantity) {
					setValue({
						...value,
						endDate: addMonths(value.startDate, minMonthQuantity - 1)
					});
					return;
				}
			}

			// Check max month quantity
			if (maxMonthQuantity > 0) {
				const valueMonthQuantity = getMonthQuantity(
					value.startDate,
					value.endDate
				);

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

				let newMonthType =
					isSameDay(value.startDate, newMonthValue) &&
					isSameDay(value.endDate, endOfMonth(newMonthValue))
						? ' limit-month'
						: isSameDay(value.startDate, newMonthValue)
						? ' start-month'
						: isSameDay(set(value.endDate, { date: 1 }), newMonthValue)
						? ' end-month'
						: value.startDate < newMonthValue && newMonthValue < value.endDate
						? ' active'
						: minDate && newMonthValue < startOfMonth(minDate)
						? ' block'
						: maxDate && newMonthValue > endOfMonth(maxDate)
						? ' block'
						: '';

				if (previewValue) {
					newMonthType +=
						isSameDay(previewValue.startDate, newMonthValue) &&
						isSameDay(previewValue.endDate, endOfMonth(newMonthValue))
							? ' limit-month-preview'
							: isSameDay(previewValue.startDate, newMonthValue)
							? ' start-month-preview'
							: isSameDay(set(previewValue.endDate, { date: 1 }), newMonthValue)
							? ' end-month-preview'
							: previewValue.startDate < newMonthValue &&
							  newMonthValue < previewValue.endDate
							? ' active-preview'
							: '';
				}

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

			// // Check min year quantity
			if (minYearQuantity > 1) {
				const yearQuantity = getYearQuantity(value.startDate, value.endDate);

				if (yearQuantity < minYearQuantity) {
					setValue({
						...value,
						startDate: subYears(value.endDate, minYearQuantity - 1)
					});
				}
			}

			// Check max year quantity
			if (maxYearQuantity > 1) {
				const yearQuantity = getYearQuantity(value.startDate, value.endDate);

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
		previewValue,
		type,
		calendarDate,
		minDate,
		maxDate,
		minDayQuantity,
		maxDayQuantity,
		minWeekQuantity,
		maxWeekQuantity,
		minMonthQuantity,
		maxMonthQuantity,
		minYearQuantity,
		maxYearQuantity,
		handleChangeValueProp
	]);

	const checkNewValue = (newValue, isStartDateProp) => {
		let newStartDate, newEndDate;

		if (type === 0) {
			// New value
			newStartDate = isStartDate ? newValue : value.startDate;
			newEndDate = newValue;

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

			// Check min day quantity
			if (minDayQuantity > 0) {
				const dayQuantity = getDayQuantity(newStartDate, newEndDate);

				if (dayQuantity < minDayQuantity) {
					if (timeLineInvalid)
						newStartDate = subDays(newEndDate, minDayQuantity - 1);
					else newEndDate = addDays(newStartDate, minDayQuantity - 1);
				}
			}

			// Check max day quantity
			if (maxDayQuantity > 0) {
				const dayQuantity = getDayQuantity(newStartDate, newEndDate);

				if (dayQuantity > maxDayQuantity) {
					if (timeLineInvalid)
						newStartDate = subDays(newEndDate, maxDayQuantity - 1);
					else newEndDate = addDays(newStartDate, maxDayQuantity - 1);
				}
			}
		} else if (type === 1) {
			// New value
			newStartDate = isStartDate ? getStartOfWeek(newValue) : value.startDate;
			newEndDate = getEndOfWeek(newValue);

			// Check time line
			let timeLineInvalid = false;

			if (newStartDate > newEndDate) {
				const tempDate = newStartDate;
				newStartDate = getStartOfWeek(newEndDate);
				newEndDate = getEndOfWeek(tempDate);
				timeLineInvalid = true;
			}

			// Check min and max date
			if (minDate && newStartDate < getStartOfWeek(minDate)) return;
			if (maxDate && newEndDate > getEndOfWeek(maxDate)) return;

			// Check min week quantity
			if (minWeekQuantity > 0) {
				const weekQuantity = getWeekQuantity(newStartDate, newEndDate);

				if (weekQuantity < minWeekQuantity) {
					if (timeLineInvalid) {
						newStartDate = subWeeks(newEndDate, minWeekQuantity - 1);
						newStartDate = getStartOfWeek(newStartDate);
					} else {
						newEndDate = addWeeks(newStartDate, minWeekQuantity - 1);
						newEndDate = getEndOfWeek(newEndDate);
					}
				}
			}

			// Check max week quantity
			if (maxWeekQuantity > 0) {
				const weekQuantity = getWeekQuantity(newStartDate, newEndDate);

				if (weekQuantity > maxWeekQuantity) {
					if (timeLineInvalid) {
						newStartDate = subWeeks(newEndDate, maxWeekQuantity - 1);
						newStartDate = getStartOfWeek(newStartDate);
					} else {
						newEndDate = addWeeks(newStartDate, maxWeekQuantity - 1);
						newEndDate = getEndOfWeek(newEndDate);
					}
				}
			}
		} else if (type === 2) {
			// New value
			newStartDate = isStartDate ? setDate(newValue, 1) : value.startDate;
			newEndDate = endOfMonth(newValue);

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

			// Check min month quantity
			if (minMonthQuantity > 0) {
				const monthQuantity = getMonthQuantity(newStartDate, newEndDate);

				if (monthQuantity < minMonthQuantity) {
					if (timeLineInvalid) {
						newStartDate = subMonths(newEndDate, minMonthQuantity - 1);
						newStartDate = setDate(newStartDate, 1);
					} else {
						newEndDate = addMonths(newStartDate, minMonthQuantity - 1);
						newEndDate = endOfMonth(newEndDate);
					}
				}
			}

			// Check max month quantity
			if (maxMonthQuantity > 0) {
				const monthQuantity = getMonthQuantity(newStartDate, newEndDate);

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
		} else {
			// New value
			newStartDate = isStartDateProp ? startOfYear(newValue) : value.startDate;
			newEndDate = isStartDateProp ? value.endDate : endOfYear(newValue);

			// Check min and max date
			if (minDate && newStartDate < startOfYear(minDate)) return;
			if (maxDate && newEndDate > endOfYear(maxDate)) return;

			// Check min year quantity
			if (minYearQuantity > 0) {
				const yearQuantity = getYearQuantity(newStartDate, newEndDate);

				if (yearQuantity < minYearQuantity)
					if (isStartDateProp) newEndDate = addYears(newEndDate, 1);
					else newStartDate = subYears(newStartDate, 1);
			}

			// Check max year quantity
			if (maxYearQuantity > 0) {
				const yearQuantity = getYearQuantity(newStartDate, newEndDate);

				if (yearQuantity > maxYearQuantity) {
					if (isStartDateProp) newEndDate = subYears(newEndDate, 1);
					else newStartDate = addYears(newStartDate, 1);
				}
			}
		}

		return { startDate: newStartDate, endDate: newEndDate };
	};

	const handleChangePreviewValue = params => {
		const newValue = checkNewValue(params);
		if (newValue) setPreviewValue(newValue);
	};

	const handleRemovePreviewValue = () => {
		setPreviewValue(null);
	};

	const handleChangeValue = (params, isStartDateProp) => {
		const newValue = checkNewValue(params, isStartDateProp);
		if (newValue) {
			setValue(newValue);
			setIsStartDate(!isStartDate);
			setPreviewValue(null);
		}
	};

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

	return (
		<div
			ref={ref}
			className={showWrapper ? 'itm-date-range show' : 'itm-date-range'}
		>
			<DateRangeHeader
				types={types}
				type={type}
				handleChangeType={handleChangeType}
			/>
			<DateRangeControl
				type={type}
				value={value}
				showWrapper={showWrapper}
				setShowWrapper={() => setShowWrapper(!showWrapper)}
			/>
			<DateRangeWrapper
				type={type}
				value={value}
				calendar={calendar}
				calendarDate={calendarDate}
				months={months}
				weeks={weeks}
				weekdays={Object.values(weekdays)}
				handleChangeValue={handleChangeValue}
				handleChangePreviewValue={handleChangePreviewValue}
				handleRemovePreviewValue={handleRemovePreviewValue}
				handleChangeCalendar={handleChangeCalendar}
			/>
		</div>
	);
};
