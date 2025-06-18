"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, Download, Upload, Eye, FileDown } from "lucide-react"

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

	const [originalPdf, setOriginalPdf] = useState<File | null>(null)
	const [editedPdfUrl, setEditedPdfUrl] = useState<string | null>(null)
	const [isProcessing, setIsProcessing] = useState(false)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleInputChange = (field: keyof PosterData, value: string) => {
		setPosterData((prev) => ({
			...prev,
			[field]: value,
		}))
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file && file.type === "application/pdf") {
			setOriginalPdf(file)
			setEditedPdfUrl(null)
		} else {
			alert("Пожалуйста, загрузите PDF файл")
		}
	}

	const processPDF = async () => {
		if (!originalPdf) {
			alert("Сначала загрузите оригинальный PDF")
			return
		}

		setIsProcessing(true)

		try {
			// Читаем оригинальный PDF
			const arrayBuffer = await originalPdf.arrayBuffer()

			// Импортируем PDF-lib
			const { PDFDocument, rgb, StandardFonts } = await import("pdf-lib")

			// Загружаем PDF документ
			const pdfDoc = await PDFDocument.load(arrayBuffer)
			const pages = pdfDoc.getPages()
			const firstPage = pages[0]
			const { width, height } = firstPage.getSize()

			// Используем шрифт, который поддерживает кириллицу
			const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

			// Заменяем данные в PDF
			// Очищаем старые данные (рисуем белые прямоугольники поверх)
			firstPage.drawRectangle({
				x: width / 2 - 60,
				y: height - 220,
				width: 120,
				height: 25,
				color: rgb(1, 1, 1), // белый
			})

			firstPage.drawRectangle({
				x: width / 2 - 60,
				y: height - 300,
				width: 120,
				height: 25,
				color: rgb(1, 1, 1),
			})

			firstPage.drawRectangle({
				x: width / 2 - 120,
				y: 40,
				width: 240,
				height: 20,
				color: rgb(1, 1, 1),
			})

			// Добавляем новые данные (транслитерируем кириллицу)
			const transliterateDate1 = transliterate(posterData.date1)
			const transliterateDate2 = transliterate(posterData.date2)
			const transliteratePhone = transliterate(`po telefonu: ${posterData.phone}`)

			firstPage.drawText(transliterateDate1, {
				x: width / 2 - 40,
				y: height - 210,
				size: 18,
				font: font,
				color: rgb(0, 0, 0),
			})

			firstPage.drawText(transliterateDate2, {
				x: width / 2 - 40,
				y: height - 290,
				size: 18,
				font: font,
				color: rgb(0, 0, 0),
			})

			firstPage.drawText(transliteratePhone, {
				x: width / 2 - 100,
				y: 50,
				size: 12,
				font: font,
				color: rgb(0, 0, 0),
			})

			// Сохраняем измененный PDF
			const pdfBytes = await pdfDoc.save()

			// Создаем URL для просмотра
			const blob = new Blob([pdfBytes], { type: "application/pdf" })
			const url = URL.createObjectURL(blob)
			setEditedPdfUrl(url)
		} catch (error) {
			console.error("Ошибка обработки PDF:", error)
			alert("Ошибка при обработке PDF. Попробуйте другой подход.")
		} finally {
			setIsProcessing(false)
		}
	}

	// Альтернативный метод - создание нового PDF с данными
	const createNewPDF = async () => {
		setIsProcessing(true)

		try {
			// Создаем новый PDF с русским текстом
			const { jsPDF } = await import("jspdf")

			const doc = new jsPDF({
				orientation: "portrait",
				unit: "mm",
				format: "a4",
			})

			const pageWidth = 210
			const pageHeight = 297
			const margin = 15

			// Рамка
			doc.setDrawColor(232, 90, 79)
			doc.setLineWidth(8)
			doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, "S")

			// Логотип
			doc.setDrawColor(232, 90, 79)
			doc.setLineWidth(1)
			doc.rect(margin + 10, margin + 15, 15, 15, "S")

			// Текст логотипа
			doc.setTextColor(232, 90, 79)
			doc.setFontSize(6)
			doc.text("ELEKTRONNYJ", margin + 30, margin + 20)
			doc.text("DOM", margin + 30, margin + 25)

			// Разделительная линия
			doc.line(margin + 55, margin + 15, margin + 55, margin + 35)

			// Текст "Проект Правительства Москвы"
			doc.setFontSize(8)
			doc.text("Proekt", margin + 60, margin + 20)
			doc.text("Pravitelstva", margin + 60, margin + 25)
			doc.text("Moskvy", margin + 60, margin + 30)

			// Заголовок
			doc.setTextColor(100, 100, 100)
			doc.setFontSize(24)
			doc.setFont("helvetica", "bold")
			doc.text("Uvazhaemye zhiteli!", pageWidth / 2, margin + 70, { align: "center" })

			// Даты
			doc.setTextColor(0, 0, 0)
			doc.setFontSize(18)
			doc.setFont("helvetica", "bold")
			doc.text(posterData.date1, pageWidth / 2, margin + 100, { align: "center" })

			doc.setFontSize(12)
			doc.setFont("helvetica", "normal")
			doc.text("s 18:30 do 20:30", pageWidth / 2, margin + 110, { align: "center" })

			doc.setFontSize(18)
			doc.setFont("helvetica", "bold")
			doc.text(posterData.date2, pageWidth / 2, margin + 130, { align: "center" })

			doc.setFontSize(12)
			doc.setFont("helvetica", "normal")
			doc.text("s 16:00 do 18:00", pageWidth / 2, margin + 140, { align: "center" })

			// Основной текст
			doc.setFontSize(11)
			let yPos = margin + 165
			const lineHeight = 6

			const mainText = [
				"sostoyatsya pokvartirnyye obkhody",
				"sotrudnikov platformy",
				"Pravitelstva Moskvy",
				"«Elektronnyj dom»",
				"s tselyu sbora byulletenej v",
				"ramkakh golosovaniya na",
				"obshchem sobranii sobstvennikov",
			]

			mainText.forEach((line, index) => {
				if (index === 3 || line.includes("sbora byulletenej") || index === 6) {
					doc.setFont("helvetica", "bold")
				} else {
					doc.setFont("helvetica", "normal")
				}
				doc.text(line, pageWidth / 2, yPos, { align: "center" })
				yPos += lineHeight
			})

			// Контакты
			yPos += 15
			doc.setFontSize(9)
			doc.setFont("helvetica", "normal")
			doc.text("Po vsem voprosam obrashchajtes", pageWidth / 2, yPos, { align: "center" })

			yPos += 6
			doc.text(`po telefonu: ${posterData.phone}`, pageWidth / 2, yPos, { align: "center" })

			const pdfBytes = new Uint8Array(doc.output("arraybuffer"))

			// Создаем URL для просмотра
			const blob = new Blob([pdfBytes], { type: "application/pdf" })
			const url = URL.createObjectURL(blob)
			setEditedPdfUrl(url)
		} catch (error) {
			console.error("Ошибка создания PDF:", error)
			alert("Ошибка при создании PDF")
		} finally {
			setIsProcessing(false)
		}
	}

	const downloadPDF = () => {
		if (!editedPdfUrl) return

		const link = document.createElement("a")
		link.href = editedPdfUrl
		link.download = `plakat-${posterData.date1.replace(" ", "-")}-${posterData.date2.replace(" ", "-")}.pdf`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)
	}

	const exportToWord = async () => {
		try {
			// Создаем Word документ с данными плаката
			const docContent = `
ПЛАКАТ ПРАВИТЕЛЬСТВА МОСКВЫ

Уважаемые жители!

${posterData.date1}
с 18:30 до 20:30

${posterData.date2}  
с 16:00 до 18:00

Состоятся поквартирные обходы
сотрудников платформы
Правительства Москвы
«Электронный дом»
с целью сбора бюллетеней в
рамках голосования на
общем собрании собственников

По всем вопросам обращайтесь
по телефону: ${posterData.phone}
      `

			const blob = new Blob([docContent], {
				type: "text/plain;charset=utf-8",
			})

			const url = URL.createObjectURL(blob)
			const link = document.createElement("a")
			link.href = url
			link.download = `plakat-${posterData.date1.replace(" ", "-")}.txt`
			document.body.appendChild(link)
			link.click()
			document.body.removeChild(link)
			URL.revokeObjectURL(url)
		} catch (error) {
			console.error("Ошибка экспорта:", error)
			alert("Ошибка при экспорте")
		}
	}

	return (
		<div className="min-h-screen bg-gray-50 p-4">
			<div className="max-w-7xl mx-auto">
				<div className="mb-8 text-center">
					<h1 className="text-3xl font-bold text-gray-800 mb-2">Редактор PDF плакатов</h1>
					<p className="text-gray-600">Загрузите PDF или создайте новый с вашими данными</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
					{/* Левая колонка - Редактирование */}
					<div className="space-y-6">
						{/* Загрузка PDF */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Upload className="w-5 h-5" />
									Загрузить оригинальный PDF
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									<input type="file" accept=".pdf" onChange={handleFileUpload} ref={fileInputRef} className="hidden" />
									<Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
										<Upload className="w-4 h-4 mr-2" />
										Выбрать PDF файл
									</Button>

									{originalPdf && (
										<div className="p-3 bg-green-50 border border-green-200 rounded-lg">
											<div className="flex items-center gap-2">
												<FileText className="w-4 h-4 text-green-600" />
												<span className="text-sm text-green-800">Загружен: {originalPdf.name}</span>
											</div>
										</div>
									)}
								</div>
							</CardContent>
						</Card>

						{/* Редактирование данных */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<FileText className="w-5 h-5" />
									Данные плаката
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<div>
									<Label htmlFor="date1">Первая дата</Label>
									<Input
										id="date1"
										value={posterData.date1}
										onChange={(e) => handleInputChange("date1", e.target.value)}
										placeholder="15 мая"
									/>
								</div>

								<div>
									<Label htmlFor="date2">Вторая дата</Label>
									<Input
										id="date2"
										value={posterData.date2}
										onChange={(e) => handleInputChange("date2", e.target.value)}
										placeholder="16 мая"
									/>
								</div>

								<div>
									<Label htmlFor="phone">Телефон</Label>
									<Input
										id="phone"
										value={posterData.phone}
										onChange={(e) => handleInputChange("phone", e.target.value)}
										placeholder="8 (499) 652-62-11"
									/>
								</div>

								<div className="space-y-2">
									<Button onClick={processPDF} className="w-full" disabled={!originalPdf || isProcessing}>
										{isProcessing ? (
											<>
												<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Обработка...
											</>
										) : (
											<>
												<FileText className="w-4 h-4 mr-2" />
												Редактировать PDF
											</>
										)}
									</Button>

									<Button onClick={createNewPDF} className="w-full" disabled={isProcessing} variant="outline">
										{isProcessing ? (
											<>
												<div className="w-4 h-4 mr-2 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
												Создание...
											</>
										) : (
											<>
												<FileText className="w-4 h-4 mr-2" />
												Создать новый PDF
											</>
										)}
									</Button>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Правая колонка - Результат */}
					<div className="space-y-6">
						{/* Скачивание */}
						<Card>
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<Download className="w-5 h-5" />
									Скачать результат
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-4">
								<Button
									onClick={downloadPDF}
									className="w-full"
									disabled={!editedPdfUrl}
									variant={editedPdfUrl ? "default" : "secondary"}
								>
									<Download className="w-4 h-4 mr-2" />
									Скачать PDF
								</Button>

								<Button onClick={exportToWord} className="w-full" disabled={!editedPdfUrl} variant="outline">
									<FileDown className="w-4 h-4 mr-2" />
									Экспорт текста
								</Button>

								{editedPdfUrl && (
									<div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
										<div className="flex items-center gap-2 mb-2">
											<Eye className="w-4 h-4 text-blue-600" />
											<span className="text-sm font-medium text-blue-800">PDF готов</span>
										</div>
										<p className="text-xs text-blue-600">Можете скачать или распечатать</p>
									</div>
								)}
							</CardContent>
						</Card>

						{/* Предварительный просмотр */}
						{editedPdfUrl && (
							<Card>
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Eye className="w-5 h-5" />
										Предварительный просмотр
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="w-full h-96 border rounded-lg overflow-hidden">
										<iframe src={editedPdfUrl} className="w-full h-full" title="PDF Preview" />
									</div>
									<div className="mt-4 flex gap-2 justify-center">
										<Button onClick={downloadPDF}>
											<Download className="w-4 h-4 mr-2" />
											Скачать
										</Button>
										<Button onClick={() => window.print()} variant="outline">
											Печать
										</Button>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

// Функция транслитерации для обхода проблем с кириллицей
function transliterate(text: string): string {
	const map: { [key: string]: string } = {
		а: "a",
		б: "b",
		в: "v",
		г: "g",
		д: "d",
		е: "e",
		ё: "yo",
		ж: "zh",
		з: "z",
		и: "i",
		й: "j",
		к: "k",
		л: "l",
		м: "m",
		н: "n",
		о: "o",
		п: "p",
		р: "r",
		с: "s",
		т: "t",
		у: "u",
		ф: "f",
		х: "h",
		ц: "c",
		ч: "ch",
		ш: "sh",
		щ: "sch",
		ъ: "",
		ы: "y",
		ь: "",
		э: "e",
		ю: "yu",
		я: "ya",
	}

	return text
		.toLowerCase()
		.split("")
		.map((char) => map[char] || char)
		.join("")
}
