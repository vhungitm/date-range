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
		handleChangePreviewValue,
		handleRemovePreviewValue,
		handleChangeCalendar
	} = props;

	const dateRangeCalendarJSX = (
		<DateRangeCalendar
			type={type}
			weeks={weeks}
			weekdays={weekdays}
			calendar={calendar}
			handleChangePreviewValue={handleChangePreviewValue}
			handleRemovePreviewValue={handleRemovePreviewValue}
			handleChangeValue={handleChangeValue}
		/>
	);

	const monthJSX = (
		<DateRangeMonth
			months={months}
			handleChangePreviewValue={handleChangePreviewValue}
			handleRemovePreviewValue={handleRemovePreviewValue}
			handleChangeValue={handleChangeValue}
		/>
	);

	const yearJSX = (
		<DateRangeYear
			value={value}
			handleChangePreviewValue={handleChangePreviewValue}
			handleRemovePreviewValue={handleRemovePreviewValue}
			handleChangeValue={handleChangeValue}
		/>
	);

	let className = 'date-range-wrapper';

	return (
		<div className={className}>
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
