"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { FileText, Printer } from "lucide-react"

interface PosterData {
  date1: string
  time1Start: string
  time1End: string
  date2: string
  time2Start: string
  time2End: string
  phone: string
}

// Точный логотип как в референсе
const ExactMoscowLogo = () => (
  <div className="flex items-start gap-4">
    {/* Логотип с текстом под ним */}
    <div className="flex flex-col items-center">
      {/* Иконка документа */}
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
          {/* Уголок документа */}
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
      {/* Текст под иконкой */}
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

    {/* Разделительная линия */}
    <div
      style={{
        width: "1px",
        height: "60px",
        backgroundColor: "#E85A4F",
        opacity: 0.3,
      }}
    />

    {/* Текст справа */}
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

  const [showReference, setShowReference] = useState(true)

  const handleInputChange = (field: keyof PosterData, value: string) => {
    setPosterData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Генератор плакатов</h1>
          <p className="text-gray-600">Точная копия по референсу</p>
        </div>

        <div className="mb-4 flex justify-center">
          <Button variant={showReference ? "default" : "outline"} onClick={() => setShowReference(!showReference)}>
            {showReference ? "Скрыть референс" : "Показать референс"}
          </Button>
        </div>

        {/* Референсное изображение */}
        {showReference && (
          <div className="mb-8 flex justify-center">
            <div className="max-w-md">
              <h3 className="text-center text-lg font-semibold mb-4">Референс (верхняя часть)</h3>
              <img
                src="/images/header-reference.png"
                alt="Референсное изображение верхней части плаката"
                className="w-full h-auto rounded-lg shadow-lg border"
              />
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Форма редактирования */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Редактор данных
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="time1Start" className="text-xs">
                      Начало
                    </Label>
                    <Input
                      id="time1Start"
                      value={posterData.time1Start}
                      onChange={(e) => handleInputChange("time1Start", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time1End" className="text-xs">
                      Конец
                    </Label>
                    <Input
                      id="time1End"
                      value={posterData.time1End}
                      onChange={(e) => handleInputChange("time1End", e.target.value)}
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
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="time2Start" className="text-xs">
                      Начало
                    </Label>
                    <Input
                      id="time2Start"
                      value={posterData.time2Start}
                      onChange={(e) => handleInputChange("time2Start", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="time2End" className="text-xs">
                      Конец
                    </Label>
                    <Input
                      id="time2End"
                      value={posterData.time2End}
                      onChange={(e) => handleInputChange("time2End", e.target.value)}
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
                />
              </div>

              <Button onClick={handlePrint} className="w-full" size="lg">
                <Printer className="w-4 h-4 mr-2" />
                Печать плаката
              </Button>
            </CardContent>
          </Card>

          {/* Точная копия плаката */}
          <div className="flex flex-col items-center">
            <h3 className="text-lg font-semibold mb-4 text-center text-gray-700">Точная копия</h3>
            <div className="poster-preview">
              <div
                className="bg-white shadow-xl max-w-sm mx-auto print:max-w-none print:shadow-none"
                style={{
                  border: "18px solid #E85A4F", // Точный цвет из референса
                  aspectRatio: "210/297",
                  padding: "36px",
                  fontFamily: "'Arial', sans-serif",
                }}
              >
                {/* Точный логотип */}
                <div className="mb-8">
                  <ExactMoscowLogo />
                </div>

                {/* Заголовок точно как в референсе */}
                <h1
                  className="text-center mb-8"
                  style={{
                    fontSize: "32px",
                    fontWeight: "900",
                    color: "#000000",
                    lineHeight: "1.1",
                    letterSpacing: "-0.5px",
                  }}
                >
                  Уважаемые жители!
                </h1>

                {/* Даты и время */}
                <div className="text-center mb-8 space-y-5">
                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#000000",
                        textDecoration: "underline",
                        textDecorationThickness: "2px",
                        textUnderlineOffset: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {posterData.date1}
                    </div>
                    <div style={{ fontSize: "18px", color: "#000000" }}>
                      с {posterData.time1Start} до {posterData.time1End}
                    </div>
                  </div>

                  <div>
                    <div
                      style={{
                        fontSize: "24px",
                        fontWeight: "bold",
                        color: "#000000",
                        textDecoration: "underline",
                        textDecorationThickness: "2px",
                        textUnderlineOffset: "4px",
                        marginBottom: "4px",
                      }}
                    >
                      {posterData.date2}
                    </div>
                    <div style={{ fontSize: "18px", color: "#000000" }}>
                      с {posterData.time2Start} до {posterData.time2End}
                    </div>
                  </div>
                </div>

                {/* Основной текст */}
                <div
                  className="text-center mb-8"
                  style={{
                    fontSize: "17px",
                    lineHeight: "1.35",
                    color: "#000000",
                  }}
                >
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
                <div
                  className="text-center"
                  style={{
                    fontSize: "14px",
                    color: "#000000",
                    lineHeight: "1.4",
                  }}
                >
                  <div className="mb-1">По всем вопросам обращайтесь</div>
                  <div>
                    по телефону: <span style={{ fontWeight: "bold" }}>{posterData.phone}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .poster-preview, .poster-preview * {
            visibility: visible;
          }
          .poster-preview {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background: white;
          }
          .poster-preview > div {
            max-width: none !important;
            width: 210mm !important;
            height: 297mm !important;
            border-width: 24px !important;
            padding: 48px !important;
          }
        }
      `}</style>
    </div>
  )
}
