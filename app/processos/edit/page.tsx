import BpmnEditor from "@/components/bpmn-editor"

export default function EditarProcessoPage({ params }: { params: { id: string } }) {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Processo</h1>
      <BpmnEditor processoId={params.id} />
    </div>
  )
}
