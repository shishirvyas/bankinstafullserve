import React, { useEffect, useState } from "react";
import customersData from "../data/customers.json";
import CustomerTable from "../components/CustomerTable";
import "../styles/FullServe.css";

import {
  CallClient,
  CallAgent,
  CommunicationUserIdentifier,
} from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const FullServePage = () => {
  const [customers, setCustomers] = useState([]);
  const [callAgent, setCallAgent] = useState(null);

  useEffect(() => {
    setCustomers(customersData);
    initCallAgent();
  }, []);

  const initCallAgent = async () => {
    try {
      const response = await fetch("https://http://192.168.80.161:3001/token"); // 🔁 Replace with your deployed backend URL
      const data = await response.json();

      const tokenCredential = new AzureCommunicationTokenCredential(data.token);
      const callClient = new CallClient();
      const agent = await callClient.createCallAgent(tokenCredential, {
        displayName: "Agent",
      });

      setCallAgent(agent);
    } catch (err) {
      console.error("Failed to init call agent:", err);
    }
  };

  const handleCall = async (customer) => {
    if (!callAgent) {
      console.warn("Call agent not initialized");
      return;
    }

    const userId = prompt("Enter communicationUserId of customer to call:");
    if (!userId) return;

    try {
      const callee = { communicationUserId: userId }; // Assuming backend gives this ID to the user you want to call
      const call = await callAgent.startCall([callee], { videoOptions: { localVideoStreams: [] } });
      console.log("Call started:", call);
    } catch (err) {
      console.error("Error starting call:", err);
    }
  };

  return (
    <div className="fullserve-container">
      <header className="fullserve-header">Full Serve</header>
      <main className="fullserve-body">
        <CustomerTable customers={customers} onCall={handleCall} />
      </main>
    </div>
  );
};

export default FullServePage;
