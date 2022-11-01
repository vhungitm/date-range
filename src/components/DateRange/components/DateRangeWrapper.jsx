import { DateRangeCalendar } from './DateRangeCalendar';
import { DateRangeMonth } from './DateRangeMonth';
import { DateRangeWrapperHeader } from './DateRangeWrapperHeader';
import { DateRangeYear } from './DateRangeYear';

export const DateRangeWrapper = props => {
	const {
		type,
		value,
		calendar,
		calendarDate,
		months,
		weeks,
		weekdays,
		handleChangeValue,
		handleChangeCalendar
	} = props;

	const dateRangeCalendarJSX = (
		<DateRangeCalendar
			type={type}
			weeks={weeks}
			weekdays={weekdays}
			calendar={calendar}
			handleChangeValue={handleChangeValue}
		/>
	);

	const monthJSX = (
		<DateRangeMonth months={months} handleChangeValue={handleChangeValue} />
	);

	const yearJSX = (
		<DateRangeYear value={value} handleChangeValue={handleChangeValue} />
	);

	return (
		<div className="date-range-wrapper">
			<DateRangeWrapperHeader
				type={type}
				calendarDate={calendarDate}
				handleChangeCalendar={handleChangeCalendar}
			/>

			{type === 0 || type === 1
				? dateRangeCalendarJSX
				: type === 2
				? monthJSX
				: yearJSX}
		</div>
	);
};
