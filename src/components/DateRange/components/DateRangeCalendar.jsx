import { isSameDay } from 'date-fns';

export const DateRangeCalendar = props => {
	const { type, weeks, weekdays, calendar, handleChangeValue } = props;

	const className =
		type === 0
			? 'date-range-calendar'
			: type === 1
			? 'date-range-calendar week'
			: type === 2
			? 'date-range-calendar month'
			: 'date-range-calendar year';

	return (
		<div className={className}>
			{type === 1 && (
				<div className="date-range-calendar-weeks">
					{weeks.map((item, id) => (
						<div
							key={id}
							className={`date-range-calendar-weeks-item ${item.type}`}
							onClick={() => handleChangeValue(item.value)}
						>
							{item.title}
						</div>
					))}
				</div>
			)}

			<div className="date-range-calendar-days">
				<div className="date-range-calendar-weekdays">
					{weekdays.map(item => (
						<div className="date-range-calendar-weekdays-item" key={item}>
							<div className="date-range-calendar-weekdays-item-value">
								{item}
							</div>
						</div>
					))}
				</div>

				{calendar.map((item, id) => {
					let className =
						id % 7 === 0
							? `date-range-calendar-day start-week ${item.type}`
							: (id + 1) % 7 === 0
							? `date-range-calendar-day end-week ${item.type}`
							: `date-range-calendar-day ${item.type}`;

					return (
						<div key={item.value} className={className}>
							<div
								className="date-range-calendar-day-value"
								onClick={() => handleChangeValue(item.value)}
							>
								{isSameDay(item.value, new Date()) && (
									<div className="date-range-now" />
								)}

								{item.value.getDate()}
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
};
