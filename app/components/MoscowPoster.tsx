import React from "react";
import Image from "next/image";

interface TextContentProps {
	dates: {
		first: { date: string; time: string };
		second: { date: string; time: string };
	};
	phone: string;
}

export default function MoscowPoster({ dates, phone }: TextContentProps) {
	return (
		<div className="relative w-[595.3px] h-[841.89px]">
			<div className="absolute inset-0">
				<Image
					src="/images/header-reference.png"
					alt="Шаблон объявления"
					fill
					style={{ objectFit: 'contain' }}
				/>

				{/* Даты */}
				{/* Первая дата */}
				<div
					className="absolute flex items-center font-bold text-[36px] leading-[44px]"
					style={{
						width: '119px',
						height: '26px',
						left: '237.7px',
						top: '244.5px'
					}}
				>
					<div className="relative">
						{dates.first.date}
						<div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></div>
					</div>
				</div>

				{/* Первое время */}
				<div
					className="absolute flex items-center text-[34px] leading-[41px]"
					style={{
						width: '273px',
						height: '25px',
						left: '160.7px',
						top: '290.5px'
					}}
				>
					{dates.first.time}
				</div>

				{/* Вторая дата */}
				<div
					className="absolute flex items-center font-bold text-[36px] leading-[44px]"
					style={{
						width: '120px',
						height: '26px',
						left: '237.7px',
						top: '325.5px'
					}}
				>
					<div className="relative">
						{dates.second.date}
						<div className="absolute bottom-[-4px] left-0 w-full h-[2px] bg-black"></div>
					</div>
				</div>

				{/* Второе время */}
				<div
					className="absolute flex items-center text-[34px] leading-[41px]"
					style={{
						width: '267px',
						height: '25px',
						left: '160.7px',
						top: '371.5px'
					}}
				>
					{dates.second.time}
				</div>

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