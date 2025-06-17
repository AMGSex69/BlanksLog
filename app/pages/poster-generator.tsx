'use client';

import React, { useState } from 'react';
import MoscowPoster from '@/app/components/MoscowPoster';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer } from "lucide-react";

export default function PosterGenerator() {
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

	const handlePrint = () => {
		window.print();
	};

	return (
		<div className="min-h-screen bg-gray-100 py-8">
			<div className="max-w-7xl mx-auto px-4">
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
										<Input
											id="date1"
											value={dates.first.date}
											onChange={(e) => setDates(prev => ({
												...prev,
												first: { ...prev.first, date: e.target.value }
											}))}
											placeholder="15 мая"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="time1Start">Время начала</Label>
											<Input
												id="time1Start"
												value={dates.first.timeStart}
												onChange={(e) => setDates(prev => ({
													...prev,
													first: { ...prev.first, timeStart: e.target.value }
												}))}
												placeholder="18:30"
											/>
										</div>
										<div>
											<Label htmlFor="time1End">Время окончания</Label>
											<Input
												id="time1End"
												value={dates.first.timeEnd}
												onChange={(e) => setDates(prev => ({
													...prev,
													first: { ...prev.first, timeEnd: e.target.value }
												}))}
												placeholder="20:30"
											/>
										</div>
									</div>
								</div>

								{/* Второй день */}
								<div className="space-y-4">
									<h3 className="font-semibold">Второй день</h3>
									<div>
										<Label htmlFor="date2">Дата</Label>
										<Input
											id="date2"
											value={dates.second.date}
											onChange={(e) => setDates(prev => ({
												...prev,
												second: { ...prev.second, date: e.target.value }
											}))}
											placeholder="16 мая"
										/>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="time2Start">Время начала</Label>
											<Input
												id="time2Start"
												value={dates.second.timeStart}
												onChange={(e) => setDates(prev => ({
													...prev,
													second: { ...prev.second, timeStart: e.target.value }
												}))}
												placeholder="16:00"
											/>
										</div>
										<div>
											<Label htmlFor="time2End">Время окончания</Label>
											<Input
												id="time2End"
												value={dates.second.timeEnd}
												onChange={(e) => setDates(prev => ({
													...prev,
													second: { ...prev.second, timeEnd: e.target.value }
												}))}
												placeholder="18:00"
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
								<CardTitle>Предпросмотр</CardTitle>
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