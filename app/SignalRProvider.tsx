"use client";
import React, { createContext, useContext, useEffect, useRef } from "react";
import * as signalR from "@microsoft/signalr";

const SignalRContext = createContext<signalR.HubConnection | null>(null);

export const SignalRProvider = ({ children }: { children: React.ReactNode }) => {
  const connectionRef = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    console.log(process.env.NEXT_PUBLIC_SIGNALR_URL);
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(process.env.NEXT_PUBLIC_SIGNALR_URL as string)
      .withAutomaticReconnect()
      .build();

    connection.start();
    connectionRef.current = connection;

    return () => {
      connection.stop();
    };
  }, []);

  return (
    <SignalRContext.Provider value={connectionRef.current}>
      {children}
    </SignalRContext.Provider>
  );
};

export const useSignalR = () => useContext(SignalRContext);