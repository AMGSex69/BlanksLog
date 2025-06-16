'use client';

import { useEffect, useState } from 'react';
import { getDesignTokens } from './lib/figma';
import MoscowPoster from "./components/MoscowPoster";

interface DesignTokens {
	colors?: {
		border?: string;
		text?: string;
	};
	typography?: Record<string, any>;
	spacing?: Record<string, any>;
}

export default function Home() {
	const defaultDates = {
		first: {
			date: "15 мая",
			time: "с 18:30 до 20:30"
		},
		second: {
			date: "16 мая",
			time: "с 16:00 до 18:00"
		}
	};

	const defaultPhone = "8 (499) 652-62-11";

	return (
		<div className="min-h-screen bg-gray-50 flex justify-center items-center">
			<MoscowPoster dates={defaultDates} phone={defaultPhone} />
		</div>
	);
}
