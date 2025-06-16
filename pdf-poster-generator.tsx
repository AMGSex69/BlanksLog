"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, Upload, Eye } from "lucide-react"

interface PosterData {
  date1: string
  time1Start: string
  time1End: string
  date2: string
  time2Start: string
  time2End: string
  phone: string
}

export default function Component() {
  const [posterData, setPosterData] = useState<PosterData>({
    date1: "15 мая",
    time1Start: "18:30",
    time1End: "20:30",
    date2: "16 мая",
    time2Start: "16:00",
    time2End: "18:00",
    phone: "8 (499) 652-62-11",
  })

  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [generatedPdfUrl, setGeneratedPdfUrl] = useState<string | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
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
      setPdfFile(file)
    } else {
      alert("Пожалуйста, загрузите PDF файл")
    }
  }

  const generatePDF = async () => {
    if (!pdfFile) {
      alert("Сначала загрузите PDF шаблон")
      return
    }

    setIsGenerating(true)

    try {
      // Здесь будет логика работы с PDF
      // Пока создаем демо-версию
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // В реальной версии здесь будет:
      // 1. Чтение PDF файла
      // 2. Поиск и замена текстовых полей
      // 3. Генерация нового PDF

      alert("PDF сгенерирован! (Демо-версия)")
    } catch (error) {
      console.error("Ошибка генерации PDF:", error)
      alert("Ошибка при генерации PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">PDF Генератор плакатов</h1>
          <p className="text-gray-600">Работа с готовыми PDF шаблонами</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Панель управления */}
          <div className="space-y-6">
            {/* Загрузка PDF шаблона */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Upload className="w-5 h-5" />
                  PDF Шаблон
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleFileUpload}
                      ref={fileInputRef}
                      className="hidden"
                    />
                    <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="w-full">
                      <Upload className="w-4 h-4 mr-2" />
                      Загрузить PDF шаблон
                    </Button>
                  </div>

                  {pdfFile && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-800">Загружен: {pdfFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Редактор данных */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Данные для замены
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date1">Первая дата</Label>
                    <Input
                      id="date1"
                      value={posterData.date1}
                      onChange={(e) => handleInputChange("date1", e.target.value)}
                      placeholder="15 мая"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="time1Start" className="text-xs">
                        Начало (день 1)
                      </Label>
                      <Input
                        id="time1Start"
                        value={posterData.time1Start}
                        onChange={(e) => handleInputChange("time1Start", e.target.value)}
                        placeholder="18:30"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time1End" className="text-xs">
                        Конец (день 1)
                      </Label>
                      <Input
                        id="time1End"
                        value={posterData.time1End}
                        onChange={(e) => handleInputChange("time1End", e.target.value)}
                        placeholder="20:30"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label htmlFor="date2">Вторая дата</Label>
                    <Input
                      id="date2"
                      value={posterData.date2}
                      onChange={(e) => handleInputChange("date2", e.target.value)}
                      placeholder="16 мая"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="time2Start" className="text-xs">
                        Начало (день 2)
                      </Label>
                      <Input
                        id="time2Start"
                        value={posterData.time2Start}
                        onChange={(e) => handleInputChange("time2Start", e.target.value)}
                        placeholder="16:00"
                      />
                    </div>
                    <div>
                      <Label htmlFor="time2End" className="text-xs">
                        Конец (день 2)
                      </Label>
                      <Input
                        id="time2End"
                        value={posterData.time2End}
                        onChange={(e) => handleInputChange("time2End", e.target.value)}
                        placeholder="18:00"
                      />
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <Label htmlFor="phone">Контактный телефон</Label>
                  <Input
                    id="phone"
                    value={posterData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="8 (499) 652-62-11"
                  />
                </div>

                <div className="space-y-2 pt-4">
                  <Button onClick={generatePDF} className="w-full" size="lg" disabled={!pdfFile || isGenerating}>
                    {isGenerating ? (
                      <>
                        <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Генерация...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4 mr-2" />
                        Сгенерировать PDF
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Предварительный просмотр и инструкции */}
          <div className="space-y-6">
            {/* Инструкции */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Как это работает
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      1
                    </div>
                    <div>
                      <strong>Загрузите PDF шаблон</strong> - ваш готовый плакат в формате PDF
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                    <div>
                      <strong>Введите новые данные</strong> - даты, время, телефон
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                    <div>
                      <strong>Сгенерируйте новый PDF</strong> - система автоматически заменит данные в шаблоне
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Поля для замены */}
            <Card>
              <CardHeader>
                <CardTitle>Поля для замены в PDF</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-blue-600">{"{{ date1 }}"}</span>
                    <span>→ {posterData.date1}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-blue-600">{"{{ time1 }}"}</span>
                    <span>
                      → с {posterData.time1Start} до {posterData.time1End}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-blue-600">{"{{ date2 }}"}</span>
                    <span>→ {posterData.date2}</span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-blue-600">{"{{ time2 }}"}</span>
                    <span>
                      → с {posterData.time2Start} до {posterData.time2End}
                    </span>
                  </div>
                  <div className="flex justify-between p-2 bg-gray-50 rounded">
                    <span className="font-mono text-blue-600">{"{{ phone }}"}</span>
                    <span>→ {posterData.phone}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Статус */}
            <Card>
              <CardHeader>
                <CardTitle>Статус</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${pdfFile ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-sm">PDF шаблон {pdfFile ? "загружен" : "не загружен"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${generatedPdfUrl ? "bg-green-500" : "bg-gray-300"}`} />
                    <span className="text-sm">Готовый PDF {generatedPdfUrl ? "сгенерирован" : "не готов"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
