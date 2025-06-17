'use client';

import React, { useState } from 'react';
import MoscowPoster from "./components/MoscowPoster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";

export default function Home() {
	const [dates, setDates] = useState({
		first: {
			date: '15 мая',
			timeStart: '18:30',
			timeEnd: '20:30'
		},
		second: {
			date: '16 мая',
			timeStart: '16:00',
			timeEnd: '18:00'
		}
	});
	const [phone, setPhone] = useState('8 (499) 652-62-11');

	// Функция для форматирования даты
	const formatDate = (date: Date) => {
		return format(date, 'd MMMM', { locale: ru });
	};

	// Обработчик изменения даты
	const handleDateChange = (date: Date | undefined, dayKey: 'first' | 'second') => {
		if (date) {
			setDates(prev => ({
				...prev,
				[dayKey]: {
					...prev[dayKey],
					date: formatDate(date)
				}
			}));
		}
	};

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-gray-100 p-8">
			<div className="max-w-7xl mx-auto">
				<h1 className="text-3xl font-bold text-center mb-8">Генератор плакатов</h1>

				<div className="flex gap-8">
					{/* Форма */}
					<div className="w-1/3">
						<Card>
							<CardHeader>
								<CardTitle>Параметры объявления</CardTitle>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Первый день */}
								<div className="space-y-4">
									<h3 className="font-semibold">Первый день</h3>
									<div>
										<Label htmlFor="date1">Дата</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal"
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{dates.first.date}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													onSelect={(date) => handleDateChange(date, 'first')}
													locale={ru}
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="time1Start">Время начала</Label>
											<Input
												id="time1Start"
												type="time"
												value={dates.first.timeStart}
												onChange={(e) => setDates(prev => ({
													...prev,
													first: { ...prev.first, timeStart: e.target.value }
												}))}
											/>
										</div>
										<div>
											<Label htmlFor="time1End">Время окончания</Label>
											<Input
												id="time1End"
												type="time"
												value={dates.first.timeEnd}
												onChange={(e) => setDates(prev => ({
													...prev,
													first: { ...prev.first, timeEnd: e.target.value }
												}))}
											/>
										</div>
									</div>
								</div>

								{/* Второй день */}
								<div className="space-y-4">
									<h3 className="font-semibold">Второй день</h3>
									<div>
										<Label htmlFor="date2">Дата</Label>
										<Popover>
											<PopoverTrigger asChild>
												<Button
													variant="outline"
													className="w-full justify-start text-left font-normal"
												>
													<CalendarIcon className="mr-2 h-4 w-4" />
													{dates.second.date}
												</Button>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0">
												<Calendar
													mode="single"
													onSelect={(date) => handleDateChange(date, 'second')}
													locale={ru}
												/>
											</PopoverContent>
										</Popover>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="time2Start">Время начала</Label>
											<Input
												id="time2Start"
												type="time"
												value={dates.second.timeStart}
												onChange={(e) => setDates(prev => ({
													...prev,
													second: { ...prev.second, timeStart: e.target.value }
												}))}
											/>
										</div>
										<div>
											<Label htmlFor="time2End">Время окончания</Label>
											<Input
												id="time2End"
												type="time"
												value={dates.second.timeEnd}
												onChange={(e) => setDates(prev => ({
													...prev,
													second: { ...prev.second, timeEnd: e.target.value }
												}))}
											/>
										</div>
									</div>
								</div>

								{/* Телефон */}
								<div>
									<Label htmlFor="phone">Телефон</Label>
									<Input
										id="phone"
										value={phone}
										onChange={(e) => setPhone(e.target.value)}
										placeholder="8 (499) 652-62-11"
									/>
								</div>

								<Button onClick={handlePrint} className="w-full">
									<Printer className="w-4 h-4 mr-2" />
									Распечатать
								</Button>
							</CardContent>
						</Card>
					</div>

					{/* Предпросмотр */}
					<div className="w-2/3">
						<Card>
							<CardHeader>
								<CardTitle>Предпросмотр плаката</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="flex justify-center">
									<MoscowPoster dates={dates} phone={phone} />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
