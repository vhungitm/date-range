import { format, getWeek, getWeekYear } from 'date-fns';
import React from 'react';

export const DateRangeCalendar = props => {
	const { type, weekdays, calendar, handleChangeValue } = props;

	// Class name
	const className =
		type === 0
			? 'date-range-calendar'
			: type === 1
			? 'date-range-calendar week'
			: type === 2
			? 'date-range-calendar month'
			: 'date-range-calendar year';
	// Return JSX
	return (
		<div className={className}>
			{/* Calendar weeks */}
			{type === 1 && (
				<div className="date-range-calendar-weeks">
					{calendar.map(
						(item, id) =>
							id % 7 === 0 && (
								<div
									className="date-range-calendar-weeks-item"
									key={id}
									onClick={() => handleChangeValue(item.value, 1)}
								>
									Tuần {getWeek(new Date(item.value), 'yyyy-MM-dd')}
								</div>
							)
					)}
				</div>
			)}

			{/* Calendar days */}
			<div className="date-range-calendar-days">
				{/* Calendar weekdays */}
				<div className="date-range-calendar-weekdays">
					{weekdays.map(item => (
						<div className="date-range-calendar-weekdays-item" key={item.name}>
							<div className="date-range-calendar-weekdays-item-value">
								{item.title}
							</div>
						</div>
					))}
				</div>

				{calendar.map((item, id) => {
					// Update class name
					let className = 'date-range-calendar-day';

					if (id === 0 || id % 7 === 0) className = `${className} start-week`;
					if ((id + 1) % 7 === 0) className = `${className} end-week`;
					className = `${className} ${item.type}`;

					// Return JSX
					return (
						<div key={item.value} className={className}>
							<div
								className="date-range-calendar-day-value"
								onClick={() => handleChangeValue(item.value)}
							>
								{item.value.getDate()}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
