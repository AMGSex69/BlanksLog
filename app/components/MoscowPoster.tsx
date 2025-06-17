import React from "react";
import Image from "next/image";

interface DateInfo {
	date: string;
	timeStart: string;
	timeEnd: string;
}

interface TextContentProps {
	dates: {
		first: DateInfo;
		second: DateInfo;
	};
	phone: string;
}

export default function MoscowPoster({ dates, phone }: TextContentProps) {
	// Проверяем, идут ли даты подряд
	const areDatesConsecutive = (date1: string, date2: string) => {
		// Разбиваем строки дат на компоненты
		const [day1, month1] = date1.toLowerCase().split(' ');
		const [day2, month2] = date2.toLowerCase().split(' ');

		// Если месяцы разные, даты точно не последовательные
		if (month1 !== month2) return false;

		// Проверяем, что дни идут последовательно
		return parseInt(day2) - parseInt(day1) === 1;
	};

	// Проверяем, одинаковое ли время
	const isSameTime = () => {
		return dates.first.timeStart === dates.second.timeStart &&
			dates.first.timeEnd === dates.second.timeEnd;
	};

	// Генерируем контент для дат
	const generateDateContent = () => {
		if (isSameTime()) {
			const timeStr = `с ${dates.first.timeStart} до ${dates.first.timeEnd}`;

			if (areDatesConsecutive(dates.first.date, dates.second.date)) {
				// Если даты идут подряд
				return (
					<div
						className="absolute flex flex-col items-center"
						style={{
							width: '400px',
							left: '97px',
							top: '265px'
						}}
					>
						<div className="flex justify-center">
							<div className="relative font-bold text-[36px] leading-[44px] whitespace-nowrap">
								{dates.first.date.toLowerCase()}-{dates.second.date.toLowerCase()}
								<div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></div>
							</div>
						</div>
						<div
							className="flex justify-center text-[34px] leading-[41px] whitespace-nowrap"
							style={{
								marginTop: '20px'
							}}
						>
							{timeStr}
						</div>
					</div>
				);
			} else {
				// Если даты не подряд, но время одинаковое
				return (
					<div
						className="absolute flex flex-col items-center"
						style={{
							width: '400px',
							left: '97px',
							top: '265px'
						}}
					>
						<div className="flex justify-center">
							<div className="relative font-bold text-[36px] leading-[44px] whitespace-nowrap">
								{dates.first.date.toLowerCase()} и {dates.second.date.toLowerCase()}
								<div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></div>
							</div>
						</div>
						<div
							className="flex justify-center text-[34px] leading-[41px] whitespace-nowrap"
							style={{
								marginTop: '20px'
							}}
						>
							{timeStr}
						</div>
					</div>
				);
			}
		} else {
			// Если время разное
			return (
				<>
					{/* Контейнер для центрирования */}
					<div
						className="absolute"
						style={{
							width: '350px',
							left: '122px',
							top: '220px'
						}}
					>
						{/* Первая дата */}
						<div className="flex justify-center">
							<div
								className="font-bold text-[36px] leading-[44px] relative"
								style={{
									height: '26px',
								}}
							>
								<div className="relative whitespace-nowrap">
									{dates.first.date}
									<div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></div>
								</div>
							</div>
						</div>

						{/* Первое время */}
						<div
							className="flex justify-center text-[34px] leading-[41px]"
							style={{
								height: '25px',
								marginTop: '25px'
							}}
						>
							с {dates.first.timeStart} до {dates.first.timeEnd}
						</div>

						{/* Вторая дата */}
						<div
							className="flex justify-center"
							style={{
								marginTop: '10px'
							}}
						>
							<div
								className="font-bold text-[36px] leading-[44px] relative"
								style={{
									height: '26px',
								}}
							>
								<div className="relative whitespace-nowrap">
									{dates.second.date}
									<div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></div>
								</div>
							</div>
						</div>

						{/* Второе время */}
						<div
							className="flex justify-center text-[34px] leading-[41px]"
							style={{
								height: '25px',
								marginTop: '25px'
							}}
						>
							с {dates.second.timeStart} до {dates.second.timeEnd}
						</div>
					</div>
				</>
			);
		}
	};

	return (
		<div className="relative w-[595.3px] h-[841.89px]">
			<div className="absolute inset-0">
				<Image
					src="/images/header-reference.png"
					alt="Шаблон объявления"
					fill
					priority
					style={{ objectFit: 'contain' }}
				/>

				{generateDateContent()}

				{/* Основной текст */}
				<div className="absolute w-full top-[420px] text-center">
					<p className="text-[32px] leading-[39px]">
						состоятся поквартирные обходы
						<br />
						сотрудников платформы
						<br />
						Правительства Москвы
					</p>
					<p className="text-[32px] leading-[39px] mt-1">
						<span className="font-bold">«Электронный дом»</span>
						<br />
						с целью <span className="font-bold">сбора бюллетеней</span> в
						<br />
						рамках голосования на
						<br />
						<span className="font-bold">общем собрании собственников</span>
					</p>
				</div>

				{/* Телефон */}
				<div className="absolute w-[353px] left-[120.7px] top-[730.5px] text-center">
					<p className="text-[22px] leading-[27px]">
						По всем вопросам обращайтесь
						<br />
						по телефону:{" "}
						<span className="font-bold">{phone}</span>
					</p>
				</div>
			</div>
		</div>
	);
} 