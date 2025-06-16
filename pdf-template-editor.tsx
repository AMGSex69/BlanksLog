"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Download, RefreshCw } from "lucide-react"

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

  const generatePDFFromTemplate = async () => {
    setIsGenerating(true)

    try {
      // Создаем PDF на основе шаблона с заменой данных
      const pdfBytes = await createPosterPDF(posterData)

      // Создаем blob и скачиваем
      const blob = new Blob([pdfBytes], { type: "application/pdf" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `plakat-${posterData.date1.replace(" ", "-")}-${posterData.date2.replace(" ", "-")}.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Ошибка обработки PDF:", error)
      alert("Ошибка при создании PDF")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Генератор плакатов</h1>
          <p className="text-gray-600">Создание плакатов на основе готового шаблона</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Редактор данных */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Данные плаката
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <RefreshCw className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">Шаблон готов</span>
                </div>
                <p className="text-xs text-green-600">Система создаст PDF на основе вашего оригинального дизайна</p>
              </div>

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
                <Button onClick={generatePDFFromTemplate} className="w-full" size="lg" disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Создание PDF...
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
                className="bg-white shadow-lg mx-auto"
                style={{
                  border: "12px solid #E85A4F",
                  width: "300px",
                  height: "424px",
                  padding: "20px",
                  fontSize: "11px",
                  lineHeight: "1.3",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {/* Логотип */}
                <div className="flex items-start gap-3 mb-6">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex items-center justify-center mb-1"
                      style={{
                        width: "32px",
                        height: "32px",
                        border: "2px solid #E85A4F",
                        borderRadius: "3px",
                        backgroundColor: "white",
                      }}
                    >
                      <div
                        style={{
                          width: "20px",
                          height: "24px",
                          border: "1.5px solid #E85A4F",
                          borderRadius: "1px",
                          backgroundColor: "white",
                          position: "relative",
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            top: "-1.5px",
                            right: "-1.5px",
                            width: "6px",
                            height: "6px",
                            backgroundColor: "white",
                            border: "1.5px solid #E85A4F",
                            borderLeft: "none",
                            borderBottom: "none",
                            borderTopRightRadius: "1px",
                          }}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        color: "#E85A4F",
                        fontSize: "6px",
                        fontWeight: "bold",
                        textAlign: "center",
                        lineHeight: "1.1",
                      }}
                    >
                      <div>ЭЛЕКТРОННЫЙ</div>
                      <div>ДОМ</div>
                    </div>
                  </div>

                  <div
                    style={{
                      width: "1px",
                      height: "40px",
                      backgroundColor: "#E85A4F",
                      opacity: 0.3,
                    }}
                  />

                  <div
                    style={{
                      color: "#E85A4F",
                      fontSize: "10px",
                      lineHeight: "1.2",
                      paddingTop: "4px",
                    }}
                  >
                    <div>Проект</div>
                    <div>Правительства</div>
                    <div>Москвы</div>
                  </div>
                </div>

                {/* Заголовок */}
                <h1 className="text-center mb-6" style={{ fontSize: "20px", fontWeight: "bold", color: "#666" }}>
                  Уважаемые жители!
                </h1>

                {/* Даты */}
                <div className="text-center mb-6 space-y-3">
                  <div>
                    <div
                      style={{ fontSize: "16px", fontWeight: "bold", textDecoration: "underline", marginBottom: "2px" }}
                    >
                      {posterData.date1}
                    </div>
                    <div style={{ fontSize: "12px" }}>с 18:30 до 20:30</div>
                  </div>
                  <div>
                    <div
                      style={{ fontSize: "16px", fontWeight: "bold", textDecoration: "underline", marginBottom: "2px" }}
                    >
                      {posterData.date2}
                    </div>
                    <div style={{ fontSize: "12px" }}>с 16:00 до 18:00</div>
                  </div>
                </div>

                {/* Основной текст */}
                <div className="text-center mb-6" style={{ fontSize: "11px", lineHeight: "1.4" }}>
                  <div className="mb-1">состоятся поквартирные обходы</div>
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
                    по телефону: <span style={{ fontWeight: "bold" }}>{posterData.phone}</span>
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

// Функция создания PDF на основе шаблона
async function createPosterPDF(data: PosterData): Promise<Uint8Array> {
  const { jsPDF } = await import("jspdf")

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  })

  const pageWidth = 210
  const pageHeight = 297
  const margin = 15

  // Рамка (оранжевая)
  doc.setDrawColor(232, 90, 79)
  doc.setFillColor(232, 90, 79)
  doc.setLineWidth(8)
  doc.rect(margin, margin, pageWidth - margin * 2, pageHeight - margin * 2, "S")

  // Логотип (упрощенный квадрат)
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

  // Первая дата
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(data.date1, pageWidth / 2, margin + 100, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("с 18:30 до 20:30", pageWidth / 2, margin + 110, { align: "center" })

  // Вторая дата
  doc.setFontSize(18)
  doc.setFont("helvetica", "bold")
  doc.text(data.date2, pageWidth / 2, margin + 130, { align: "center" })

  doc.setFontSize(12)
  doc.setFont("helvetica", "normal")
  doc.text("с 16:00 до 18:00", pageWidth / 2, margin + 140, { align: "center" })

  // Основной текст
  doc.setFontSize(11)
  let yPos = margin + 165
  const lineHeight = 6

  const mainText = [
    "состоятся поквартирные обходы",
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
