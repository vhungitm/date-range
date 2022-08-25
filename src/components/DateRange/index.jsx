import React from 'react';
import './scss/_date-range.scss';

export const DateRange = () => {
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

	console.log(new Date('2022-08-26').getDay());
	return (
		<div className="date-range">
			<div className="date-range-header">
				<div className="date-range-header-item active">Ngày</div>
				<div className="date-range-header-item">Tuần</div>
				<div className="date-range-header-item">Tháng</div>
				<div className="date-range-header-item">Năm</div>
			</div>
			<div className="date-range-control">
				<div className="date-range-control-value">
					17.04.2022 đến 16.05.2022
				</div>
				<div className="date-range-control-icon"></div>
			</div>
			<div className="date-range-wrapper">
				<div className="date-range-wrapper-header">
					<div className="date-range-wrapper-header-btn btn-pre"></div>
					<div className="date-range-wrapper-header-value">
						<span>Tháng 5</span>
						<span>2022</span>
					</div>
					<div className="date-range-wrapper-header-btn btn-next"></div>
				</div>

				<div className="date-range-calendar">
					<div className="date-range-calendar-weekdays">
						{weekdays.map(item => (
							<div
								className="date-range-calendar-weekdays-item"
								key={item.name}
							>
								<div className="date-range-calendar-weekdays-item-value">
									{item.title}
								</div>
							</div>
						))}
					</div>

					<div className="date-range-calendar-week">
						<div className="date-range-calendar-day">
							<div className="date-range-calendar-day-value">1</div>
						</div>
						<div className="date-range-calendar-day start-day">
							<div className="date-range-calendar-day-value  active">2</div>
						</div>
						<div className="date-range-calendar-day active">
							<div className="date-range-calendar-day-value  active">3</div>
						</div>
						<div className="date-range-calendar-day end-day">
							<div className="date-range-calendar-day-value">4</div>
						</div>
						<div className="date-range-calendar-day">
							<div className="date-range-calendar-day-value">5</div>
						</div>
						<div className="date-range-calendar-day">
							<div className="date-range-calendar-day-value">6</div>
						</div>
						<div className="date-range-calendar-day">
							<div className="date-range-calendar-day-value">7</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
