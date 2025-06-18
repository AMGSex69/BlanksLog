"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Download } from "lucide-react"

interface PosterData {
	date1: string
	date2: string
	phone: string
}

export default function Component() {
	const [posterData, setPosterData] = useState<PosterData>({
		date1: "15 мая",
		date2: "16 мая",
		phone: "8 (499) 652-62-11",
	})

	const [isGenerating, setIsGenerating] = useState(false)

	const handleInputChange = (field: keyof PosterData, value: string) => {
		setPosterData((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	const generateAndDownloadPDF = async () => {
		setIsGenerating(true)

		try {
			// Создаем PDF программно
			const pdfContent = await createPosterPDF(posterData)

			// Создаем blob и скачиваем
			const blob = new Blob([pdfContent], { type: "application/pdf" })
			const url = URL.createObjectURL(blob)

			const link = document.createElement("a")
			link.href = url
			link.download = `plakat-${posterData.date1}-${posterData.date2}.pdf`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)

			URL.revokeObjectURL(url)
		} catch (error) {
			console.error("Ошибка генерации PDF:", error)
			alert("Ошибка при генерации PDF")
		} finally {
			setIsGenerating(false)
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-4xl mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Генератор плакатов</h1>
					<p className="text-gray-600">Создание плакатов Правительства Москвы</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					{/* Форма редактирования */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Данные плаката
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							<div>
								<Label htmlFor="date1" className="text-base font-medium">
									Первая дата
								</Label>
								<Input
									id="date1"
									value={posterData.date1}
									onChange={(e) => handleInputChange("date1", e.target.value)}
									placeholder="15 мая"
									className="text-lg"
								/>
							</div>

							<div>
								<Label htmlFor="date2" className="text-base font-medium">
									Вторая дата
								</Label>
								<Input
									id="date2"
									value={posterData.date2}
									onChange={(e) => handleInputChange("date2", e.target.value)}
									placeholder="16 мая"
									className="text-lg"
								/>
							</div>

							<Separator />

							<div>
								<Label htmlFor="phone" className="text-base font-medium">
									Контактный телефон
								</Label>
								<Input
									id="phone"
									value={posterData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									placeholder="8 (499) 652-62-11"
									className="text-lg"
								/>
							</div>

							<div className="pt-4">
								<Button onClick={generateAndDownloadPDF} className="w-full" size="lg" disabled={isGenerating}>
									{isGenerating ? (
										<>
											<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
											Генерация PDF...
										</>
									) : (
										<>
											<Download className="w-4 h-4 mr-2" />
											Скачать PDF плакат
										</>
									)}
								</Button>
							</div>
						</CardContent>
					</Card>

					{/* Предварительный просмотр */}
					<Card>
						<CardHeader>
							<CardTitle>Предварительный просмотр</CardTitle>
						</CardHeader>
						<CardContent>
							<div
								className="bg-white border-4 border-orange-400 p-6 aspect-[210/297] text-center"
								style={{ fontSize: "12px", lineHeight: "1.4" }}
							>
								{/* Логотип */}
								<div className="flex items-start gap-2 mb-6">
									<div className="w-8 h-8 border-2 border-orange-400 rounded flex items-center justify-center">
										<div className="w-4 h-5 border border-orange-400 rounded-sm relative">
											<div className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-white border-t border-r border-orange-400"></div>
										</div>
									</div>
									<div className="text-orange-400 text-xs leading-tight">
										<div>ЭЛЕКТРОННЫЙ</div>
										<div>ДОМ</div>
									</div>
									<div className="w-px h-8 bg-orange-400 opacity-30 mx-2"></div>
									<div className="text-orange-400 text-xs leading-tight pt-1">
										<div>Проект</div>
										<div>Правительства</div>
										<div>Москвы</div>
									</div>
								</div>

								{/* Заголовок */}
								<h1 className="text-xl font-bold text-gray-700 mb-4">Уважаемые жители!</h1>

								{/* Даты */}
								<div className="mb-4 space-y-2">
									<div>
										<div className="text-base font-bold underline">{posterData.date1}</div>
										<div className="text-sm">с 18:30 до 20:30</div>
									</div>
									<div>
										<div className="text-base font-bold underline">{posterData.date2}</div>
										<div className="text-sm">с 16:00 до 18:00</div>
									</div>
								</div>

								{/* Основной текст */}
								<div className="text-sm mb-4 space-y-1">
									<div>Состоятся поквартирные обходы</div>
									<div>сотрудников платформы</div>
									<div>Правительства Москвы</div>
									<div className="font-bold">«Электронный дом»</div>
									<div>
										с целью <span className="font-bold">сбора бюллетеней</span> в
									</div>
									<div>рамках голосования на</div>
									<div className="font-bold">общем собрании собственников</div>
								</div>

								{/* Контакты */}
								<div className="text-xs">
									<div>По всем вопросам обращайтесь</div>
									<div>
										по телефону: <span className="font-bold">{posterData.phone}</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

// Функция создания PDF
async function createPosterPDF(data: PosterData): Promise<Uint8Array> {
	// Импортируем jsPDF динамически
	const { jsPDF } = await import("jspdf")

	const doc = new jsPDF({
		orientation: "portrait",
		unit: "mm",
		format: "a4",
	})

	// Настройки
	const pageWidth = 210
	const pageHeight = 297
	const margin = 20
	const contentWidth = pageWidth - margin * 2

	// Рамка
	doc.setDrawColor(232, 90, 79) // Оранжевый цвет
	doc.setLineWidth(4)
	doc.rect(10, 10, pageWidth - 20, pageHeight - 20)

	// Логотип (упрощенный)
	doc.setDrawColor(232, 90, 79)
	doc.setLineWidth(1)
	doc.rect(margin, margin + 10, 12, 12)

	doc.setTextColor(232, 90, 79)
	doc.setFontSize(8)
	doc.text("ЭЛЕКТРОННЫЙ", margin + 15, margin + 15)
	doc.text("ДОМ", margin + 15, margin + 20)

	doc.text("Проект", margin + 45, margin + 15)
	doc.text("Правительства", margin + 45, margin + 20)
	doc.text("Москвы", margin + 45, margin + 25)

	// Заголовок
	doc.setTextColor(0, 0, 0)
	doc.setFontSize(24)
	doc.setFont("helvetica", "bold")
	doc.text("Уважаемые жители!", pageWidth / 2, margin + 60, { align: "center" })

	// Даты
	doc.setFontSize(18)
	doc.setFont("helvetica", "bold")
	doc.text(data.date1, pageWidth / 2, margin + 85, { align: "center" })

	doc.setFontSize(14)
	doc.setFont("helvetica", "normal")
	doc.text("с 18:30 до 20:30", pageWidth / 2, margin + 95, { align: "center" })

	doc.setFontSize(18)
	doc.setFont("helvetica", "bold")
	doc.text(data.date2, pageWidth / 2, margin + 115, { align: "center" })

	doc.setFontSize(14)
	doc.setFont("helvetica", "normal")
	doc.text("с 16:00 до 18:00", pageWidth / 2, margin + 125, { align: "center" })

	// Основной текст
	doc.setFontSize(12)
	let yPos = margin + 150
	const lineHeight = 8

	const mainText = [
		"Состоятся поквартирные обходы",
		"сотрудников платформы",
		"Правительства Москвы",
		"«Электронный дом»",
		"с целью сбора бюллетеней в",
		"рамках голосования на",
		"общем собрании собственников",
	]

	mainText.forEach((line, index) => {
		if (index === 3 || line.includes("сбора бюллетеней") || index === 6) {
			doc.setFont("helvetica", "bold")
		} else {
			doc.setFont("helvetica", "normal")
		}
		doc.text(line, pageWidth / 2, yPos, { align: "center" })
		yPos += lineHeight
	})

	// Контакты
	yPos += 20
	doc.setFontSize(10)
	doc.setFont("helvetica", "normal")
	doc.text("По всем вопросам обращайтесь", pageWidth / 2, yPos, { align: "center" })

	yPos += 8
	doc.text(`по телефону: ${data.phone}`, pageWidth / 2, yPos, { align: "center" })

	return new Uint8Array(doc.output("arraybuffer"))
}
