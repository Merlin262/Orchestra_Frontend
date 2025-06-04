"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileUp, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useProfile } from "@/components/profile-context"

export default function ImportarProcessoPage() {
  const [arquivo, setArquivo] = useState<File | null>(null)
  const [arrastando, setArrastando] = useState(false)
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [mensagem, setMensagem] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const { profile } = useProfile()

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
        setStatus("idle")
        setMensagem("")
      } else {
        setStatus("error")
        setMensagem("Por favor, selecione um arquivo BPMN válido (.bpmn ou .xml)")
      }
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.name.endsWith(".bpmn") || file.name.endsWith(".xml")) {
        setArquivo(file)
        setStatus("idle")
        setMensagem("")
      } else {
        setStatus("error")
        setMensagem("Por favor, selecione um arquivo BPMN válido (.bpmn ou .xml)")
      }
    }
  }

  const handleImportar = async () => {
    if (!arquivo) return;
  
    try {
      setStatus("uploading");
      setMensagem("Enviando arquivo...");
  
      const formData = new FormData();
      formData.append("file", arquivo);
      formData.append("userId", profile.Id);
  
      const response = await fetch("https://localhost:7073/api/Bpmn/upload", {
        method: "POST",
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao enviar arquivo: ${response.status} ${response.statusText}`);
      }
  
      const data = await response.json();
  
      setStatus("success");
      setMensagem("Arquivo importado com sucesso!");
  
      // Redirecionar após 2 segundos
      setTimeout(() => {
        router.push("/processos");
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar arquivo:", error);
      setStatus("error");
      setMensagem(error instanceof Error ? error.message : "Erro ao enviar arquivo");
    }
  }

  const handleClickUpload = () => {
    fileInputRef.current?.click()
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Importar Processo BPMN</h1>

      <div
        className={`border-2 border-dashed rounded-lg p-12 text-center transition-colors ${
          arrastando
            ? "border-blue-500 bg-blue-50 dark:bg-blue-900"
            : status === "success"
              ? "border-green-500 bg-green-50 dark:bg-green-900"
              : status === "error"
                ? "border-red-500 bg-red-50 dark:bg-red-900"
                : "border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900"
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-4">
          {status === "idle" && (
            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-full">
              <Upload size={36} className="text-gray-500 dark:text-gray-400" />
            </div>
          )}

          {status === "uploading" && (
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Loader2 size={36} className="text-blue-500 dark:text-blue-400 animate-spin" />
            </div>
          )}

          {status === "success" && (
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <CheckCircle size={36} className="text-green-500 dark:text-green-300" />
            </div>
          )}

          {status === "error" && (
            <div className="p-3 bg-red-100 dark:bg-red-900 rounded-full">
              <AlertCircle size={36} className="text-red-500 dark:text-red-300" />
            </div>
          )}

          <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
            {arquivo && status !== "error" ? arquivo.name : "Arraste e solte seu arquivo BPMN aqui"}
          </h3>

          {arquivo && status !== "error" && (
            <p className="text-sm text-gray-500 dark:text-gray-400">{`${(arquivo.size / 1024).toFixed(2)} KB`}</p>
          )}

          {status === "error" && <p className="text-sm text-red-500 dark:text-red-300">{mensagem}</p>}

          {status === "success" && <p className="text-sm text-green-500 dark:text-green-300">{mensagem}</p>}

          {status === "uploading" && <p className="text-sm text-blue-500 dark:text-blue-400">{mensagem}</p>}

          {!arquivo && status !== "uploading" && (
            <>
              <p className="text-sm text-gray-500 dark:text-gray-400">ou</p>
              <button
                onClick={handleClickUpload}
                className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
              >
                Selecionar Arquivo
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".bpmn,.xml"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </button>
            </>
          )}

          {arquivo && status !== "uploading" && status !== "success" && (
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleImportar}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center gap-2"
              >
                <FileUp size={18} />
                Importar Processo
              </button>
              <button
                onClick={() => {
                  setArquivo(null)
                  setStatus("idle")
                  setMensagem("")
                }}
                className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-md transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Informações Importantes</h2>
        <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
          <li>Formatos suportados: BPMN (.bpmn) e XML (.xml) contendo definições BPMN</li>
          <li>Tamanho máximo do arquivo: 10MB</li>
          <li>O processo importado estará disponível na sua lista de processos após o upload</li>
        </ul>
      </div>
    </div>
  )
}
