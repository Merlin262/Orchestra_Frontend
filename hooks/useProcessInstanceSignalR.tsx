import { useSignalR } from "@/app/SignalRProvider";
import { useEffect } from "react";

export function useProcessInstanceSignalR(onProcessInstanceFetched: (instance: any) => void) {
  const connection = useSignalR();

  useEffect(() => {
    if (!connection) return;

    const handler = (instance: any) => {
      console.log("Sinal recebido do SignalR: ProcessInstanceFetched", instance);
      onProcessInstanceFetched(instance);
    };

    connection.on("ProcessInstanceFetched", handler);

    return () => {
      connection.off("ProcessInstanceFetched", handler);
    };
  }, [connection, onProcessInstanceFetched]);
}