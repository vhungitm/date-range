import React, { useEffect, useState } from 'react';
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

	const [calendar, setCalendar] = useState();

	useEffect(() => {
		if (!calendar) {
			const now = new Date();
			const nowYear = now.getFullYear();
			const nowMonth = now.getMonth();
			const nowDate = now.getDate();
			const nowDay = now.getDay();
			console.log(nowDay);

			const endDate = new Date(nowYear, nowMonth, 0);

			let newCalendar = [];

			console.log(new Date(nowYear, nowMonth, 1).getDay());

			for (
				let i = 2 - new Date(nowYear, nowMonth, 1).getDay();
				i < 7 - -endDate.getDay() + endDate.getDate();
				i++
			) {
				newCalendar = [...newCalendar, new Date(nowYear, nowMonth, i)];
			}
			setCalendar(newCalendar);
		}
	}, []);

	console.log(calendar);

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
						{calendar &&
							calendar.map(item => (
								<div key={item} className="date-range-calendar-day">
									<div className="date-range-calendar-day-value">
										{item.getDate()}
									</div>
								</div>
							))}
					</div>
				</div>
			</div>
		</div>
	);
};
