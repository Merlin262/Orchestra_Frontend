"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, Code, BarChart2, Users, Clock, Zap, FileText, ChevronRight, Star } from "lucide-react"
import { useEnvironment } from "@/hooks/use-environment"

// Componente de animação para fade-in
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
      {children}
    </motion.div>
  )
}

// Componente de card de recurso
const FeatureCard = ({
  icon,
  title,
  description,
  delay = 0,
}: {
  icon: React.ReactNode
  title: string
  description: string
  delay?: number
}) => {
  return (
    <FadeIn delay={delay}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow p-6 border border-gray-100 dark:border-gray-700 h-full">
        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-400 mb-4">
          {icon}
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>
    </FadeIn>
  )
}

// Componente de depoimento
const Testimonial = ({
  quote,
  author,
  role,
  company,
  avatar,
  delay = 0,
}: {
  quote: string
  author: string
  role: string
  company: string
  avatar: string
  delay?: number
}) => {
  return (
    <FadeIn delay={delay}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center mb-4">
          <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
            <Image src={avatar || "/placeholder.svg"} alt={author} fill className="object-cover" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white">{author}</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {role}, {company}
            </p>
          </div>
        </div>
        <blockquote className="text-gray-700 dark:text-gray-300 italic">"{quote}"</blockquote>
      </div>
    </FadeIn>
  )
}

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)
  const { isDevelopment, logEnvironment, appName, appVersion } = useEnvironment()

  useEffect(() => {
    setIsVisible(true)
    // Log do ambiente apenas em desenvolvimento
    logEnvironment()
  }, [logEnvironment])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 pt-20 pb-16 md:pt-32 md:pb-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute left-0 right-0 top-0 h-[500px] bg-gradient-to-br from-blue-50 via-blue-100/20 to-transparent dark:from-blue-900/20 dark:via-blue-800/5 dark:to-transparent transform -rotate-12 translate-y-[-30%] translate-x-[-10%] rounded-full opacity-60"></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                Modelagem de Processos BPMN
                <span className="text-blue-600 dark:text-blue-400"> Simplificada</span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                Crie, edite e gerencie seus diagramas de processos de negócio de forma simples e eficiente. Uma
                plataforma completa para transformar suas ideias em fluxos de trabalho estruturados.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/processos"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Começar agora
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/processos/novo"
                className="inline-flex items-center justify-center gap-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-gray-750 font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Criar novo processo
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="mt-12"
            >
              <div className="relative mx-auto max-w-4xl rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-700">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
                <Image
                  src="/placeholder.svg?height=600&width=1200"
                  alt="Dashboard da plataforma BPMN"
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <p className="text-white text-lg font-medium">Visualize, edite e compartilhe seus processos</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Estatísticas */}
      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          {isDevelopment && (
            <div className="mb-8 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <div className="flex items-center justify-center gap-2 text-yellow-800 dark:text-yellow-200">
                <span className="text-sm font-medium">🔧 Ambiente de Desenvolvimento</span>
                <span className="text-xs">({appName} v{appVersion})</span>
              </div>
            </div>
          )}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <FadeIn delay={0.1}>
              <div className="p-4">
                <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">+500</p>
                <p className="text-gray-600 dark:text-gray-400">Processos Modelados</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="p-4">
                <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">98%</p>
                <p className="text-gray-600 dark:text-gray-400">Satisfação dos Usuários</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="p-4">
                <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">+50</p>
                <p className="text-gray-600 dark:text-gray-400">Empresas Atendidas</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="p-4">
                <p className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">30%</p>
                <p className="text-gray-600 dark:text-gray-400">Aumento de Eficiência</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Recursos Poderosos</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Tudo o que você precisa para modelar, analisar e otimizar seus processos de negócio em um só lugar.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Code size={24} />}
              title="Modelagem BPMN 2.0"
              description="Editor completo com suporte ao padrão BPMN 2.0, permitindo criar diagramas profissionais com facilidade."
              delay={0.1}
            />
            <FeatureCard
              icon={<Users size={24} />}
              title="Colaboração em Tempo Real"
              description="Trabalhe com sua equipe simultaneamente nos mesmos diagramas, com controle de versão e comentários."
              delay={0.2}
            />
            <FeatureCard
              icon={<BarChart2 size={24} />}
              title="Análise de Processos"
              description="Identifique gargalos e oportunidades de melhoria com ferramentas analíticas avançadas."
              delay={0.3}
            />
            <FeatureCard
              icon={<Clock size={24} />}
              title="Simulação de Processos"
              description="Teste seus processos antes de implementá-los, com simulações baseadas em dados reais."
              delay={0.4}
            />
            <FeatureCard
              icon={<Zap size={24} />}
              title="Automação Inteligente"
              description="Transforme seus modelos em fluxos de trabalho automatizados com poucos cliques."
              delay={0.5}
            />
            <FeatureCard
              icon={<FileText size={24} />}
              title="Documentação Automática"
              description="Gere documentação completa dos seus processos em diversos formatos com um único clique."
              delay={0.6}
            />
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <FadeIn>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Como Funciona</h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Um processo simples e intuitivo para transformar suas ideias em modelos de processos eficientes.
              </p>
            </FadeIn>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <FadeIn delay={0.1}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold mx-auto mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Crie seu Processo</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Comece do zero ou use um dos nossos templates para modelar seu processo de negócio.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold mx-auto mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Colabore e Refine</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Compartilhe com sua equipe, colete feedback e aprimore seu modelo de processo.
                </p>
              </div>
            </FadeIn>

            <FadeIn delay={0.3}>
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold mx-auto mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Implemente e Monitore</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Coloque seu processo em ação e acompanhe seu desempenho em tempo real.
                </p>
              </div>
            </FadeIn>
          </div>

          <FadeIn delay={0.4}>
            <div className="text-center mt-12">
              <Link
                href="/processos/novo"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Comece seu primeiro processo
                <ArrowRight size={20} />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
