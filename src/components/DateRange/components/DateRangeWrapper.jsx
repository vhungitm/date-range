import React from 'react';
import { DateRangeCalendar } from './DateRangeCalendar';
import { DateRangeWrapperHeader } from './DateRangeWrapperHeader';

export const DateRangeWrapper = props => {
	const {
		type,
		calendar,
		calendarDate,
		weekdays,
		handleChangeValue,
		handleChangeMonth
	} = props;

	return (
		<div className="date-range-wrapper">
			<DateRangeWrapperHeader
				calendarDate={calendarDate}
				handleChangeMonth={handleChangeMonth}
			/>

			{/* Date range calendar */}
			{type === 0 || type === 1 ? (
				<DateRangeCalendar
					type={type}
					weekdays={weekdays}
					calendar={calendar}
					handleChangeValue={handleChangeValue}
				/>
			) : null}
		</div>
	);
};
