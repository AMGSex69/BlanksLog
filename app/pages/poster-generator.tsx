import React, { useState } from 'react';
import MoscowPoster from '../components/MoscowPoster';

export default function PosterGenerator() {
	const [dates, setDates] = useState({
		firstDay: {
			date: '15 мая',
			timeStart: '18:30',
			timeEnd: '20:30'
		},
		secondDay: {
			date: '16 мая',
			timeStart: '16:00',
			timeEnd: '18:00'
		}
	});
	const [phone, setPhone] = useState('8 (499) 652-62-11');

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-7xl mx-auto px-4">
				<div className="flex gap-8">
					{/* Form */}
					<div className="w-1/3 bg-white rounded-lg p-6 shadow-lg">
						<h2 className="text-2xl font-bold mb-6">Параметры объявления</h2>

						{/* First day */}
						<div className="mb-6">
							<h3 className="font-bold mb-4">Первый день</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-1">Дата</label>
									<input
										type="text"
										value={dates.firstDay.date}
										onChange={(e) => setDates(prev => ({
											...prev,
											firstDay: { ...prev.firstDay, date: e.target.value }
										}))}
										className="w-full p-2 border rounded"
									/>
								</div>
								<div className="flex gap-4">
									<div>
										<label className="block text-sm font-medium mb-1">Время начала</label>
										<input
											type="text"
											value={dates.firstDay.timeStart}
											onChange={(e) => setDates(prev => ({
												...prev,
												firstDay: { ...prev.firstDay, timeStart: e.target.value }
											}))}
											className="w-full p-2 border rounded"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1">Время окончания</label>
										<input
											type="text"
											value={dates.firstDay.timeEnd}
											onChange={(e) => setDates(prev => ({
												...prev,
												firstDay: { ...prev.firstDay, timeEnd: e.target.value }
											}))}
											className="w-full p-2 border rounded"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Second day */}
						<div className="mb-6">
							<h3 className="font-bold mb-4">Второй день</h3>
							<div className="space-y-4">
								<div>
									<label className="block text-sm font-medium mb-1">Дата</label>
									<input
										type="text"
										value={dates.secondDay.date}
										onChange={(e) => setDates(prev => ({
											...prev,
											secondDay: { ...prev.secondDay, date: e.target.value }
										}))}
										className="w-full p-2 border rounded"
									/>
								</div>
								<div className="flex gap-4">
									<div>
										<label className="block text-sm font-medium mb-1">Время начала</label>
										<input
											type="text"
											value={dates.secondDay.timeStart}
											onChange={(e) => setDates(prev => ({
												...prev,
												secondDay: { ...prev.secondDay, timeStart: e.target.value }
											}))}
											className="w-full p-2 border rounded"
										/>
									</div>
									<div>
										<label className="block text-sm font-medium mb-1">Время окончания</label>
										<input
											type="text"
											value={dates.secondDay.timeEnd}
											onChange={(e) => setDates(prev => ({
												...prev,
												secondDay: { ...prev.secondDay, timeEnd: e.target.value }
											}))}
											className="w-full p-2 border rounded"
										/>
									</div>
								</div>
							</div>
						</div>

						{/* Phone */}
						<div className="mb-6">
							<label className="block text-sm font-medium mb-1">Телефон</label>
							<input
								type="text"
								value={phone}
								onChange={(e) => setPhone(e.target.value)}
								className="w-full p-2 border rounded"
							/>
						</div>

						<button
							onClick={() => window.print()}
							className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
						>
							Распечатать
						</button>
					</div>

					{/* Preview */}
					<div className="w-2/3">
						<div className="bg-white rounded-lg p-8 shadow-lg">
							<MoscowPoster dates={dates} phone={phone} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
} 