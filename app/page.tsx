'use client';

import React, { useState, useEffect } from 'react';
import MoscowPoster from "./components/MoscowPoster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RotateCcw, X, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


export default function Home() {
	const [dates, setDates] = useState({
		first: {
			date: '',
			timeStart: '',
			timeEnd: ''
		},
		second: {
			date: '',
			timeStart: '',
			timeEnd: ''
		}
	});
	const [phone, setPhone] = useState('8 (499) 652-62-11');

	// Загрузка сохраненного состояния при монтировании компонента
	useEffect(() => {
		const savedData = localStorage.getItem('posterGeneratorData');
		if (savedData) {
			try {
				const parsedData = JSON.parse(savedData);
				if (parsedData.dates) {
					setDates(parsedData.dates);
				}
				if (parsedData.phone) {
					setPhone(parsedData.phone);
				}
			} catch (error) {
				console.error('Ошибка при загрузке сохраненных данных:', error);
			}
		}
	}, []);

	// Сохранение состояния при изменении данных
	useEffect(() => {
		const dataToSave = {
			dates,
			phone
		};
		localStorage.setItem('posterGeneratorData', JSON.stringify(dataToSave));
	}, [dates, phone]);

	// Обработчик быстрого выбора времени
	const handleQuickTimeSelect = (dayKey: 'first' | 'second', timeType: 'start' | 'end', value: string) => {
		const timeKey = timeType === 'start' ? 'timeStart' : 'timeEnd';
		setDates(prev => ({
			...prev,
			[dayKey]: {
				...prev[dayKey],
				[timeKey]: value
			}
		}));
	};

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

	// Обработчик очистки даты и времени
	const clearDateAndTime = (dayKey: 'first' | 'second') => {
		setDates(prev => ({
			...prev,
			[dayKey]: {
				date: '',
				timeStart: '',
				timeEnd: ''
			}
		}));
	};

	// Обработчик сброса всех полей
	const resetAllFields = () => {
		setDates({
			first: {
				date: '',
				timeStart: '',
				timeEnd: ''
			},
			second: {
				date: '',
				timeStart: '',
				timeEnd: ''
			}
		});
		setPhone('8 (499) 652-62-11');
		// Очищаем сохраненные данные
		localStorage.removeItem('posterGeneratorData');
	};

	// Функция для экспорта в PDF
	const handleExportPDF = async () => {
		const posterElement = document.querySelector('.moscow-poster-container');
		if (!posterElement) return;

		try {
			// Временно добавляем классы для экспорта в PDF
			const dateElements = posterElement.querySelectorAll('.poster-date-underline');
			posterElement.classList.add('pdf-export-mode');

			dateElements.forEach((el) => {
				el.classList.add('pdf-export-mode');
			});

			const canvas = await html2canvas(posterElement as HTMLElement, {
				scale: 3,
				useCORS: true,
				allowTaint: true,
				backgroundColor: '#ffffff',
				logging: false,
				width: posterElement.scrollWidth,
				height: posterElement.scrollHeight,
				scrollX: 0,
				scrollY: 0,
				foreignObjectRendering: false
			});

			// Убираем временные классы
			posterElement.classList.remove('pdf-export-mode');
			dateElements.forEach((el) => {
				el.classList.remove('pdf-export-mode');
			});

			const imgData = canvas.toDataURL('image/png');
			const pdf = new jsPDF({
				orientation: 'portrait',
				unit: 'mm',
				format: 'a4'
			});

			const pageWidth = 210; // A4 width in mm
			const pageHeight = 297; // A4 height in mm

			// Рассчитываем размеры так, чтобы плакат поместился на одну страницу
			const canvasRatio = canvas.width / canvas.height;
			const pageRatio = pageWidth / pageHeight;

			let imgWidth, imgHeight;

			if (canvasRatio > pageRatio) {
				// Изображение шире - масштабируем по ширине
				imgWidth = pageWidth - 2; // Оставляем отступы 1мм с каждой стороны
				imgHeight = imgWidth / canvasRatio;
			} else {
				// Изображение выше - масштабируем по высоте
				imgHeight = pageHeight - 2; // Оставляем отступы 1мм сверху и снизу
				imgWidth = imgHeight * canvasRatio;
			}

			// Центрируем изображение на странице
			const x = (pageWidth - imgWidth) / 2;
			const y = (pageHeight - imgHeight) / 2;

			// Добавляем изображение только на одну страницу
			pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

			pdf.save('плакат-москва.pdf');
		} catch (error) {
			console.error('Ошибка при создании PDF:', error);
			alert('Произошла ошибка при создании PDF файла');

			// Убираем классы в случае ошибки
			const posterElement = document.querySelector('.moscow-poster-container');
			if (posterElement) {
				posterElement.classList.remove('pdf-export-mode');
				const dateElements = posterElement.querySelectorAll('.poster-date-underline');
				dateElements.forEach((el) => {
					el.classList.remove('pdf-export-mode');
				});
			}
		}
	};



	// Функция для экспорта в PNG высокого качества
	const handleExportPNG = async () => {
		const element = document.getElementById('moscow-poster');

		if (!element) {
			alert('Элемент плаката не найден!');
			return;
		}

		try {
			// Временно добавляем классы для экспорта в PNG
			const dateElements = element.querySelectorAll('.poster-date-underline');
			const posterContainer = element.querySelector('.moscow-poster-container');

			if (posterContainer) {
				posterContainer.classList.add('export-mode');
			}

			dateElements.forEach((el) => {
				el.classList.add('export-mode');
			});

			// Создаем canvas с высоким разрешением для качественной печати
			const canvas = await html2canvas(element, {
				scale: 2, // Высокое разрешение для качественной печати
				useCORS: true,
				allowTaint: true,
				backgroundColor: '#ffffff',
				width: element.offsetWidth,
				height: element.offsetHeight,
			});

			// Убираем временные классы
			if (posterContainer) {
				posterContainer.classList.remove('export-mode');
			}
			dateElements.forEach((el) => {
				el.classList.remove('export-mode');
			});

			// Создаем ссылку для скачивания
			const link = document.createElement('a');
			link.download = 'плакат-москва.png';
			link.href = canvas.toDataURL('image/png');

			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error('Ошибка при экспорте PNG:', error);
			alert('Ошибка при создании PNG: ' + (error instanceof Error ? error.message : String(error)));

			// Убираем классы в случае ошибки
			const posterContainer = element.querySelector('.moscow-poster-container');
			const dateElements = element.querySelectorAll('.poster-date-underline');

			if (posterContainer) {
				posterContainer.classList.remove('export-mode');
			}
			dateElements.forEach((el) => {
				el.classList.remove('export-mode');
			});
		}
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
								<div className="flex items-center justify-between">
									<CardTitle>Параметры объявления</CardTitle>
									<Button
										variant="outline"
										size="sm"
										onClick={resetAllFields}
										className="text-gray-600 hover:text-gray-800"
									>
										<RotateCcw className="w-4 h-4" />
									</Button>
								</div>
							</CardHeader>
							<CardContent className="space-y-6">
								{/* Первый день */}
								<div className="space-y-4">
									<h3 className="font-semibold">Первый день</h3>
									<div>
										<Label htmlFor="date1">Дата</Label>
										<div className="flex gap-2">
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="flex-1 justify-start text-left font-normal"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{dates.first.date || "дд/мм"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														onSelect={(date) => handleDateChange(date, 'first')}
														locale={ru}
														today={new Date()}
														showOutsideDays={true}
													/>
												</PopoverContent>
											</Popover>
											{(dates.first.date || dates.first.timeStart || dates.first.timeEnd) && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => clearDateAndTime('first')}
													className="w-10 h-10 p-0"
												>
													<X className="w-4 h-4" />
												</Button>
											)}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="time1Start">Время начала</Label>
											<div className="flex gap-2">
												<Input
													id="time1Start"
													type="time"
													value={dates.first.timeStart}
													onChange={(e) => setDates(prev => ({
														...prev,
														first: { ...prev.first, timeStart: e.target.value }
													}))}
													className="flex-1"
												/>
												<Select onValueChange={(value) => handleQuickTimeSelect('first', 'start', value)}>
													<SelectTrigger className="w-20">
														<Clock className="w-4 h-4" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="15:00">15:00</SelectItem>
														<SelectItem value="15:30">15:30</SelectItem>
														<SelectItem value="16:00">16:00</SelectItem>
														<SelectItem value="16:30">16:30</SelectItem>
														<SelectItem value="17:00">17:00</SelectItem>
														<SelectItem value="17:30">17:30</SelectItem>
														<SelectItem value="18:00">18:00</SelectItem>
														<SelectItem value="18:30">18:30</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div>
											<Label htmlFor="time1End">Время окончания</Label>
											<div className="flex gap-2">
												<Input
													id="time1End"
													type="time"
													value={dates.first.timeEnd}
													onChange={(e) => setDates(prev => ({
														...prev,
														first: { ...prev.first, timeEnd: e.target.value }
													}))}
													className="flex-1"
												/>
												<Select onValueChange={(value) => handleQuickTimeSelect('first', 'end', value)}>
													<SelectTrigger className="w-20">
														<Clock className="w-4 h-4" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="18:00">18:00</SelectItem>
														<SelectItem value="18:30">18:30</SelectItem>
														<SelectItem value="19:00">19:00</SelectItem>
														<SelectItem value="19:30">19:30</SelectItem>
														<SelectItem value="20:00">20:00</SelectItem>
														<SelectItem value="20:30">20:30</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</div>
								</div>

								{/* Второй день */}
								<div className="space-y-4">
									<h3 className="font-semibold">Второй день</h3>
									<div>
										<Label htmlFor="date2">Дата</Label>
										<div className="flex gap-2">
											<Popover>
												<PopoverTrigger asChild>
													<Button
														variant="outline"
														className="flex-1 justify-start text-left font-normal"
													>
														<CalendarIcon className="mr-2 h-4 w-4" />
														{dates.second.date || "дд/мм"}
													</Button>
												</PopoverTrigger>
												<PopoverContent className="w-auto p-0">
													<Calendar
														mode="single"
														onSelect={(date) => handleDateChange(date, 'second')}
														locale={ru}
														today={new Date()}
														showOutsideDays={true}
													/>
												</PopoverContent>
											</Popover>
											{(dates.second.date || dates.second.timeStart || dates.second.timeEnd) && (
												<Button
													variant="outline"
													size="sm"
													onClick={() => clearDateAndTime('second')}
													className="w-10 h-10 p-0"
												>
													<X className="w-4 h-4" />
												</Button>
											)}
										</div>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div>
											<Label htmlFor="time2Start">Время начала</Label>
											<div className="flex gap-2">
												<Input
													id="time2Start"
													type="time"
													value={dates.second.timeStart}
													onChange={(e) => setDates(prev => ({
														...prev,
														second: { ...prev.second, timeStart: e.target.value }
													}))}
													className="flex-1"
												/>
												<Select onValueChange={(value) => handleQuickTimeSelect('second', 'start', value)}>
													<SelectTrigger className="w-20">
														<Clock className="w-4 h-4" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="15:00">15:00</SelectItem>
														<SelectItem value="15:30">15:30</SelectItem>
														<SelectItem value="16:00">16:00</SelectItem>
														<SelectItem value="16:30">16:30</SelectItem>
														<SelectItem value="17:00">17:00</SelectItem>
														<SelectItem value="17:30">17:30</SelectItem>
														<SelectItem value="18:00">18:00</SelectItem>
														<SelectItem value="18:30">18:30</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div>
											<Label htmlFor="time2End">Время окончания</Label>
											<div className="flex gap-2">
												<Input
													id="time2End"
													type="time"
													value={dates.second.timeEnd}
													onChange={(e) => setDates(prev => ({
														...prev,
														second: { ...prev.second, timeEnd: e.target.value }
													}))}
													className="flex-1"
												/>
												<Select onValueChange={(value) => handleQuickTimeSelect('second', 'end', value)}>
													<SelectTrigger className="w-20">
														<Clock className="w-4 h-4" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="18:00">18:00</SelectItem>
														<SelectItem value="18:30">18:30</SelectItem>
														<SelectItem value="19:00">19:00</SelectItem>
														<SelectItem value="19:30">19:30</SelectItem>
														<SelectItem value="20:00">20:00</SelectItem>
														<SelectItem value="20:30">20:30</SelectItem>
													</SelectContent>
												</Select>
											</div>
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

								<div className="grid grid-cols-2 gap-3">
									<Button onClick={handleExportPNG} variant="outline">
										<Download className="w-4 h-4 mr-2" />
										PNG
									</Button>
									<Button onClick={handleExportPDF}>
										<Download className="w-4 h-4 mr-2" />
										PDF
									</Button>
								</div>
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
									<div id="moscow-poster" className="moscow-poster-container">
										<MoscowPoster dates={dates} phone={phone} />
									</div>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
