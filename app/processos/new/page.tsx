import BpmnEditor from "@/components/bpmn-editor"

export default function NovoProcessoPage() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Novo Processo</h1>
      <BpmnEditor />
    </div>
  )
}
