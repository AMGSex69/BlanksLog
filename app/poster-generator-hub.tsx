"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Download, Upload, FileText, Trash2, Eye, Info } from "lucide-react"

interface PosterData {
	date1: string
	time1Start: string
	time1End: string
	date2: string
	time2Start: string
	time2End: string
	phone: string
}

interface Template {
	id: string
	name: string
	file: File
	type: 'word' | 'pdf'
	fields: string[]
}

// Логотип Правительства Москвы
const MoscowLogo = () => (
	<div className="flex items-start gap-4">
		<div className="flex flex-col items-center">
			<div
				className="flex items-center justify-center mb-1"
				style={{
					width: "48px",
					height: "48px",
					border: "3px solid #E85A4F",
					borderRadius: "4px",
					backgroundColor: "white",
				}}
			>
				<div
					style={{
						width: "28px",
						height: "32px",
						border: "2px solid #E85A4F",
						borderRadius: "2px",
						backgroundColor: "white",
						position: "relative",
					}}
				>
					<div
						style={{
							position: "absolute",
							top: "-2px",
							right: "-2px",
							width: "8px",
							height: "8px",
							backgroundColor: "white",
							border: "2px solid #E85A4F",
							borderLeft: "none",
							borderBottom: "none",
							borderTopRightRadius: "2px",
						}}
					/>
				</div>
			</div>
			<div
				style={{
					color: "#E85A4F",
					fontSize: "8px",
					fontWeight: "bold",
					textAlign: "center",
					lineHeight: "1.1",
					letterSpacing: "0.5px",
				}}
			>
				<div>ЭЛЕКТРОННЫЙ</div>
				<div>ДОМ</div>
			</div>
		</div>
		<div
			style={{
				width: "1px",
				height: "60px",
				backgroundColor: "#E85A4F",
				opacity: 0.3,
			}}
		/>
		<div
			style={{
				color: "#E85A4F",
				fontSize: "14px",
				lineHeight: "1.2",
				fontWeight: "400",
				paddingTop: "8px",
			}}
		>
			<div>Проект</div>
			<div>Правительства</div>
			<div>Москвы</div>
		</div>
	</div>
)

export default function PosterGeneratorHub() {
	const [posterData, setPosterData] = useState<PosterData>({
		date1: "",
		time1Start: "",
		time1End: "",
		date2: "",
		time2Start: "",
		time2End: "",
		phone: "",
	})

	const [templates, setTemplates] = useState<Template[]>([])
	const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
	const [isGenerating, setIsGenerating] = useState(false)
	const [showBuiltIn, setShowBuiltIn] = useState(true)
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleInputChange = (field: keyof PosterData, value: string) => {
		setPosterData(prev => ({
			...prev,
			[field]: value
		}))
	}

	const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (!file) return

		const fileType = file.type
		let templateType: 'word' | 'pdf'

		if (fileType.includes('word') || fileType.includes('document') || file.name.endsWith('.docx')) {
			templateType = 'word'
		} else if (fileType === 'application/pdf' || file.name.endsWith('.pdf')) {
			templateType = 'pdf'
		} else {
			alert('Поддерживаются только файлы Word (.docx) и PDF (.pdf)')
			return
		}

		const newTemplate: Template = {
			id: Date.now().toString(),
			name: file.name,
			file: file,
			type: templateType,
			fields: ['DATE1', 'TIME1_START', 'TIME1_END', 'DATE2', 'TIME2_START', 'TIME2_END', 'PHONE'] // Стандартные поля
		}

		setTemplates(prev => [...prev, newTemplate])
		setSelectedTemplate(newTemplate)
	}

	const handleRemoveTemplate = (templateId: string) => {
		setTemplates(prev => prev.filter(t => t.id !== templateId))
		if (selectedTemplate?.id === templateId) {
			setSelectedTemplate(null)
		}
	}

	const handleGenerateFromTemplate = async () => {
		if (!selectedTemplate) {
			alert('Выберите шаблон для генерации')
			return
		}

		setIsGenerating(true)

		try {
			if (selectedTemplate.type === 'word') {
				await generateWordDocument(selectedTemplate, posterData)
			} else if (selectedTemplate.type === 'pdf') {
				await generatePdfDocument(selectedTemplate, posterData)
			}
		} catch (error) {
			console.error("Ошибка генерации:", error)
			alert("Ошибка при генерации документа")
		} finally {
			setIsGenerating(false)
		}
	}

	const handleGenerateBuiltIn = async () => {
		setIsGenerating(true)

		try {
			const pdfBytes = await createMoscowMeetingsPDF(posterData)

			const blob = new Blob([pdfBytes], { type: "application/pdf" })
			const url = URL.createObjectURL(blob)

			const link = document.createElement("a")
			link.href = url
			link.download = `plakat-${posterData.date1.replace(/\s+/g, '-')}-${posterData.date2.replace(/\s+/g, '-')}.pdf`
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
			<div className="max-w-7xl mx-auto">
				{/* Заголовок */}
				<div className="mb-8 text-center">
					<h1 className="text-4xl font-bold text-gray-800 mb-4">Генератор плакатов</h1>
					<p className="text-lg text-gray-600">Работа с готовыми шаблонами Word и PDF</p>
				</div>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
					{/* Управление шаблонами */}
					<Card className="lg:col-span-1">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Upload className="w-5 h-5" />
								Шаблоны
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							{/* Встроенный шаблон */}
							<div className="space-y-2">
								<Label className="text-sm font-medium">Встроенный шаблон</Label>
								<div className="p-3 border rounded-lg">
									<div className="flex items-center justify-between">
										<div className="flex items-center gap-2">
											<FileText className="w-4 h-4 text-blue-600" />
											<span className="text-sm">Плакат Правительства Москвы</span>
										</div>
										<Button
											size="sm"
											variant={showBuiltIn ? "default" : "outline"}
											onClick={() => setShowBuiltIn(true)}
										>
											{showBuiltIn ? "Выбран" : "Выбрать"}
										</Button>
									</div>
								</div>
							</div>

							<Separator />

							{/* Загрузка шаблонов */}
							<div className="space-y-2">
								<Label className="text-sm font-medium">Загрузить шаблон</Label>
								<div>
									<input
										type="file"
										accept=".docx,.pdf"
										onChange={handleFileUpload}
										ref={fileInputRef}
										className="hidden"
									/>
									<Button
										onClick={() => fileInputRef.current?.click()}
										variant="outline"
										className="w-full"
									>
										<Upload className="w-4 h-4 mr-2" />
										Загрузить Word/PDF
									</Button>
								</div>
							</div>

							{/* Список загруженных шаблонов */}
							{templates.length > 0 && (
								<div className="space-y-2">
									<Label className="text-sm font-medium">Загруженные шаблоны</Label>
									<div className="space-y-2">
										{templates.map(template => (
											<div key={template.id} className="p-2 border rounded-lg">
												<div className="flex items-center justify-between">
													<div className="flex items-center gap-2">
														<FileText className={`w-4 h-4 ${template.type === 'word' ? 'text-blue-600' : 'text-red-600'}`} />
														<span className="text-xs truncate max-w-32" title={template.name}>
															{template.name}
														</span>
													</div>
													<div className="flex gap-1">
														<Button
															size="sm"
															variant={selectedTemplate?.id === template.id ? "default" : "outline"}
															onClick={() => {
																setSelectedTemplate(template)
																setShowBuiltIn(false)
															}}
														>
															{selectedTemplate?.id === template.id ? "Выбран" : "Выбрать"}
														</Button>
														<Button
															size="sm"
															variant="ghost"
															onClick={() => handleRemoveTemplate(template.id)}
														>
															<Trash2 className="w-3 h-3" />
														</Button>
													</div>
												</div>
											</div>
										))}
									</div>
								</div>
							)}

							{/* Инструкция */}
							<Alert>
								<Info className="w-4 h-4" />
								<AlertDescription className="text-xs">
									В шаблоне используйте поля: DATE1, TIME1_START, TIME1_END, DATE2, TIME2_START, TIME2_END, PHONE
								</AlertDescription>
							</Alert>
						</CardContent>
					</Card>

					{/* Форма редактирования */}
					<Card className="lg:col-span-1">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<FileText className="w-5 h-5" />
								Данные плаката
							</CardTitle>
						</CardHeader>
						<CardContent className="space-y-6">
							{/* Первая дата */}
							<div className="space-y-4">
								<div>
									<Label htmlFor="date1" className="text-base font-medium">Первая дата</Label>
									<Input
										id="date1"
										value={posterData.date1}
										onChange={(e) => handleInputChange("date1", e.target.value)}
										placeholder="дд/мм"
										className="text-lg"
									/>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<Label htmlFor="time1Start" className="text-sm">С какого времени</Label>
										<Input
											id="time1Start"
											value={posterData.time1Start}
											onChange={(e) => handleInputChange("time1Start", e.target.value)}
											placeholder="--:--"
										/>
									</div>
									<div>
										<Label htmlFor="time1End" className="text-sm">По какое время</Label>
										<Input
											id="time1End"
											value={posterData.time1End}
											onChange={(e) => handleInputChange("time1End", e.target.value)}
											placeholder="--:--"
										/>
									</div>
								</div>
							</div>

							<Separator />

							{/* Вторая дата */}
							<div className="space-y-4">
								<div>
									<Label htmlFor="date2" className="text-base font-medium">Вторая дата</Label>
									<Input
										id="date2"
										value={posterData.date2}
										onChange={(e) => handleInputChange("date2", e.target.value)}
										placeholder="дд/мм"
										className="text-lg"
									/>
								</div>
								<div className="grid grid-cols-2 gap-2">
									<div>
										<Label htmlFor="time2Start" className="text-sm">С какого времени</Label>
										<Input
											id="time2Start"
											value={posterData.time2Start}
											onChange={(e) => handleInputChange("time2Start", e.target.value)}
											placeholder="--:--"
										/>
									</div>
									<div>
										<Label htmlFor="time2End" className="text-sm">По какое время</Label>
										<Input
											id="time2End"
											value={posterData.time2End}
											onChange={(e) => handleInputChange("time2End", e.target.value)}
											placeholder="--:--"
										/>
									</div>
								</div>
							</div>

							<Separator />

							{/* Контактный телефон */}
							<div>
								<Label htmlFor="phone" className="text-base font-medium">Контактный телефон</Label>
								<Input
									id="phone"
									value={posterData.phone}
									onChange={(e) => handleInputChange("phone", e.target.value)}
									placeholder="8 (499) 652-62-11"
									className="text-lg"
								/>
							</div>

							<Separator />

							{/* Кнопки генерации */}
							<div className="space-y-3">
								{showBuiltIn ? (
									<Button
										onClick={handleGenerateBuiltIn}
										className="w-full"
										size="lg"
										disabled={isGenerating}
									>
										{isGenerating ? (
											<>
												<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Создание PDF...
											</>
										) : (
											<>
												<Download className="w-4 h-4 mr-2" />
												Скачать встроенный PDF
											</>
										)}
									</Button>
								) : selectedTemplate ? (
									<Button
										onClick={handleGenerateFromTemplate}
										className="w-full"
										size="lg"
										disabled={isGenerating}
									>
										{isGenerating ? (
											<>
												<div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
												Обработка шаблона...
											</>
										) : (
											<>
												<Download className="w-4 h-4 mr-2" />
												Скачать из шаблона ({selectedTemplate.type.toUpperCase()})
											</>
										)}
									</Button>
								) : (
									<Button className="w-full" size="lg" disabled>
										Выберите шаблон
									</Button>
								)}
							</div>
						</CardContent>
					</Card>

					{/* Предварительный просмотр */}
					<Card className="lg:col-span-1">
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Eye className="w-5 h-5" />
								Предварительный просмотр
							</CardTitle>
						</CardHeader>
						<CardContent>
							{showBuiltIn ? (
								<div className="flex justify-center">
									<div
										className="bg-white shadow-lg"
										style={{
											border: "8px solid #E85A4F",
											width: "280px",
											height: "390px",
											padding: "16px",
											fontSize: "10px",
											lineHeight: "1.3",
											fontFamily: "Arial, sans-serif",
											transform: "scale(0.9)",
											transformOrigin: "top",
										}}
									>
										{/* Логотип */}
										<div className="mb-4" style={{ transform: "scale(0.8)", transformOrigin: "top left" }}>
											<MoscowLogo />
										</div>

										{/* Заголовок */}
										<h1 className="text-center mb-6" style={{ fontSize: "18px", fontWeight: "bold", color: "#333" }}>
											Уважаемые жители!
										</h1>

										{/* Даты и время */}
										<div className="text-center mb-5 space-y-3">
											<div>
												<div style={{ fontSize: "14px", fontWeight: "bold", textDecoration: "underline", marginBottom: "2px" }}>
													{posterData.date1 || "дд/мм"}
												</div>
												<div style={{ fontSize: "11px" }}>
													с {posterData.time1Start || "--:--"} до {posterData.time1End || "--:--"}
												</div>
											</div>
											{(posterData.date2 || posterData.time2Start || posterData.time2End) && (
												<div>
													<div style={{ fontSize: "14px", fontWeight: "bold", textDecoration: "underline", marginBottom: "2px" }}>
														{posterData.date2 || "дд/мм"}
													</div>
													<div style={{ fontSize: "11px" }}>
														с {posterData.time2Start || "--:--"} до {posterData.time2End || "--:--"}
													</div>
												</div>
											)}
										</div>

										{/* Основной текст */}
										<div className="text-center mb-6" style={{ fontSize: "10px", lineHeight: "1.3" }}>
											<div className="mb-1">Состоятся поквартирные обходы</div>
											<div className="mb-1">сотрудников платформы</div>
											<div className="mb-1">Правительства Москвы</div>
											<div className="mb-2" style={{ fontWeight: "bold" }}>
												«Электронный дом»
											</div>
											<div className="mb-1">
												с целью <span style={{ fontWeight: "bold" }}>сбора бюллетеней</span> в
											</div>
											<div className="mb-1">рамках голосования на</div>
											<div style={{ fontWeight: "bold" }}>общем собрании собственников</div>
										</div>

										{/* Контакты */}
										<div className="text-center" style={{ fontSize: "9px" }}>
											<div className="mb-1">По всем вопросам обращайтесь</div>
											<div>
												по телефону: <span style={{ fontWeight: "bold" }}>{posterData.phone || "8 (499) 652-62-11"}</span>
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="text-center p-8 text-gray-500">
									<FileText className="w-12 h-12 mx-auto mb-4" />
									<p className="text-sm">Предварительный просмотр</p>
									<p className="text-sm">доступен только для</p>
									<p className="text-sm">встроенного шаблона</p>
								</div>
							)}
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	)
}

// Функция для работы с Word шаблонами
async function generateWordDocument(template: Template, data: PosterData) {
	try {
		// Читаем файл шаблона
		const arrayBuffer = await template.file.arrayBuffer()

		// Импортируем библиотеки
		const { createReport } = await import('docx-templates')

		// Подготавливаем данные для замены
		const templateData = {
			DATE1: data.date1,
			TIME1_START: data.time1Start,
			TIME1_END: data.time1End,
			DATE2: data.date2,
			TIME2_START: data.time2Start,
			TIME2_END: data.time2End,
			PHONE: data.phone,
			// Дополнительные варианты названий полей
			date1: data.date1,
			time1Start: data.time1Start,
			time1End: data.time1End,
			date2: data.date2,
			time2Start: data.time2Start,
			time2End: data.time2End,
			phone: data.phone,
		}

		// Обрабатываем шаблон
		const report = await createReport({
			template: arrayBuffer,
			data: templateData,
			cmdDelimiter: ['{', '}'], // Используем {FIELD_NAME} в документе
		})

		// Скачиваем результат
		const blob = new Blob([report as any], {
			type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
		})
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url
		link.download = `plakat-${data.date1.replace(/\s+/g, '-')}-${data.date2.replace(/\s+/g, '-')}.docx`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		URL.revokeObjectURL(url)

		alert('Word документ успешно создан и скачан!')

	} catch (error) {
		console.error('Ошибка обработки Word шаблона:', error)

		// Если не получилось через шаблоны, попробуем простую замену текста
		try {
			await generateWordDocumentSimple(template, data)
		} catch (simpleError) {
			console.error('Ошибка простой обработки:', simpleError)
			alert('Ошибка при обработке Word шаблона. Убедитесь, что в документе используются поля {DATE1}, {TIME1_START} и т.д.')
		}
	}
}

// Альтернативная функция для простой замены текста в Word
async function generateWordDocumentSimple(template: Template, data: PosterData) {
	try {
		// Читаем файл как текст (простая замена)
		const arrayBuffer = await template.file.arrayBuffer()
		const PizZip = (await import('pizzip')).default

		const zip = new PizZip(arrayBuffer)

		// Извлекаем document.xml
		const documentXml = zip.file('word/document.xml')?.asText()

		if (!documentXml) {
			throw new Error('Не удалось прочитать содержимое документа')
		}

		// Простая функция для логирования
		const log = (message: string) => {
			console.log(`[Word Processor] ${message}`);
		};

		log('Начинаем обработку документа...');

		// Сначала выводим содержимое для отладки
		log('Текущее содержимое документа:');
		log(documentXml.substring(0, 500) + '...');

		let modifiedXml = documentXml;

		// Простые прямые замены
		const replacements = [
			['DATE1', data.date1],
			['TIME1_START', data.time1Start],
			['TIME1_END', data.time1End],
			['DATE2', data.date2],
			['TIME2_START', data.time2Start],
			['TIME2_END', data.time2End],
			['PHONE', data.phone]
		];

		// Выполняем замены и логируем результаты
		replacements.forEach(([find, replace]) => {
			const count = (modifiedXml.match(new RegExp(find, 'g')) || []).length;
			if (count > 0) {
				log(`Найдено ${count} вхождений "${find}"`);
				modifiedXml = modifiedXml.replace(new RegExp(find, 'g'), replace);
			} else {
				log(`Поле "${find}" не найдено в документе`);
			}
		});

		// Проверяем изменения
		const hasChanges = modifiedXml !== documentXml;
		if (hasChanges) {
			log('✅ Документ успешно обновлен!');
		} else {
			log('⚠️ Замены не произведены. Проверьте формат полей в документе.');
		}

		// Обновляем файл в архиве
		zip.file('word/document.xml', modifiedXml);

		return zip.generate({
			type: 'nodebuffer',
			compression: 'DEFLATE'
		});
	} catch (error) {
		console.error('Ошибка при обработке Word документа:', error);
		throw error;
	}
}

// Функция для работы с PDF шаблонами
async function generatePdfDocument(template: Template, data: PosterData) {
	try {
		const PDFLib = await import('pdf-lib')

		// Читаем PDF шаблон
		const arrayBuffer = await template.file.arrayBuffer()
		const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer)

		// Получаем форму (если есть)
		const form = pdfDoc.getForm()
		const fields = form.getFields()

		// Мапим наши данные на поля формы
		const fieldMapping = {
			'DATE1': data.date1,
			'TIME1_START': data.time1Start,
			'TIME1_END': data.time1End,
			'DATE2': data.date2,
			'TIME2_START': data.time2Start,
			'TIME2_END': data.time2End,
			'PHONE': data.phone,
		}

		// Заполняем поля
		fields.forEach(field => {
			const fieldName = field.getName()
			const mappedValue = fieldMapping[fieldName as keyof typeof fieldMapping]

			if (mappedValue && field.constructor.name === 'PDFTextField') {
				(field as any).setText(mappedValue)
			}
		})

		// Сохраняем PDF
		const pdfBytes = await pdfDoc.save()

		// Скачиваем результат
		const blob = new Blob([pdfBytes], { type: 'application/pdf' })
		const url = URL.createObjectURL(blob)

		const link = document.createElement('a')
		link.href = url
		link.download = `plakat-${data.date1.replace(/\s+/g, '-')}-${data.date2.replace(/\s+/g, '-')}.pdf`
		document.body.appendChild(link)
		link.click()
		document.body.removeChild(link)

		URL.revokeObjectURL(url)
	} catch (error) {
		console.error('Ошибка обработки PDF шаблона:', error)
		alert('Ошибка при обработке PDF шаблона. Проверьте наличие заполняемых полей.')
	}
}

// Функция создания встроенного PDF
async function createMoscowMeetingsPDF(data: PosterData): Promise<Uint8Array> {
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
	doc.setFillColor(232, 90, 79)
	doc.setLineWidth(8)
	doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, "S")

	// Логотип
	doc.setDrawColor(232, 90, 79)
	doc.setLineWidth(1)
	doc.rect(margin + 10, margin + 15, 15, 15, "S")

	// Текст логотипа
	doc.setTextColor(232, 90, 79)
	doc.setFontSize(6)
	doc.text("ЭЛЕКТРОННЫЙ", margin + 30, margin + 20)
	doc.text("ДОМ", margin + 30, margin + 25)

	// Разделительная линия
	doc.setDrawColor(232, 90, 79)
	doc.setLineWidth(0.5)
	doc.line(margin + 55, margin + 15, margin + 55, margin + 35)

	// Текст "Проект Правительства Москвы"
	doc.setFontSize(8)
	doc.text("Проект", margin + 60, margin + 20)
	doc.text("Правительства", margin + 60, margin + 25)
	doc.text("Москвы", margin + 60, margin + 30)

	// Заголовок
	doc.setTextColor(100, 100, 100)
	doc.setFontSize(24)
	doc.setFont("helvetica", "bold")
	doc.text("Уважаемые жители!", pageWidth / 2, margin + 70, { align: "center" })

	// Проверяем, есть ли вторая дата
	const hasSecondDate = data.date2 && data.date2.trim() !== "" && data.time2Start && data.time2End

	// Первая дата
	doc.setTextColor(0, 0, 0)
	doc.setFontSize(18)
	doc.setFont("helvetica", "bold")
	doc.text(data.date1, pageWidth / 2, margin + 100, { align: "center" })

	doc.setFontSize(12)
	doc.setFont("helvetica", "normal")
	doc.text(`с ${data.time1Start} до ${data.time1End}`, pageWidth / 2, margin + 110, { align: "center" })

	// Вторая дата (только если она заполнена)
	if (hasSecondDate) {
		doc.setFontSize(18)
		doc.setFont("helvetica", "bold")
		doc.text(data.date2, pageWidth / 2, margin + 130, { align: "center" })

		doc.setFontSize(12)
		doc.setFont("helvetica", "normal")
		doc.text(`с ${data.time2Start} до ${data.time2End}`, pageWidth / 2, margin + 140, { align: "center" })
	}

	// Основной текст
	doc.setFontSize(11)
	let yPos = hasSecondDate ? margin + 165 : margin + 135 // Поднимаем текст, если нет второй даты
	const lineHeight = 6

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
	yPos += 15
	doc.setFontSize(9)
	doc.setFont("helvetica", "normal")
	doc.text("По всем вопросам обращайтесь", pageWidth / 2, yPos, { align: "center" })

	yPos += 6
	doc.text(`по телефону: ${data.phone}`, pageWidth / 2, yPos, { align: "center" })

	return new Uint8Array(doc.output("arraybuffer"))
} 