"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileUp } from "lucide-react"

export default function CarregarProcessoPage() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [arrastando, setArrastando] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setArrastando(true)
  }

  const handleDragLeave = () => {
    setArrastando(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setArrastando(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".bpmn") || file.name.endsWith(".xml")) {
        setArquivo(file)
      } else {
        alert("Por favor, selecione um arquivo BPMN válido (.bpmn ou .xml)")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.name.endsWith(".bpmn") || file.name.endsWith(".xml")) {
        setArquivo(file)
      } else {
        alert("Por favor, selecione um arquivo BPMN válido (.bpmn ou .xml)")
      }
    }
  }

  const handleImportar = () => {
    if (arquivo) {
      // Aqui você implementaria a lógica para importar o arquivo
      alert(`Arquivo "${arquivo.name}" importado com sucesso!`)
      // Redirecionar para a página de edição do processo importado
    }
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Carregar Processo</h1>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center ${
          arrastando ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="p-3 bg-gray-100 rounded-full">
            <Upload size={36} className="text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-700">
            {arquivo ? arquivo.name : "Arraste e solte seu arquivo BPMN aqui"}
          </h3>
          <p className="text-sm text-gray-500">{arquivo ? `${(arquivo.size / 1024).toFixed(2)} KB` : "ou"}</p>

          {!arquivo && (
            <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors">
              Selecionar Arquivo
              <input type="file" accept=".bpmn,.xml" className="hidden" onChange={handleFileChange} />
            </label>
          )}

          {arquivo && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleImportar}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              >
                <FileUp size={18} />
                Importar Processo
              </button>
              <button
                onClick={() => setArquivo(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Formatos Suportados</h2>
        <ul className="list-disc list-inside text-gray-600 space-y-2">
          <li>Arquivos BPMN (.bpmn)</li>
          <li>Arquivos XML (.xml) contendo definições BPMN</li>
        </ul>
      </div>
    </div>
  )
}
