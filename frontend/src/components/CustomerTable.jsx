import React, { useState } from "react";
import { CallClient } from "@azure/communication-calling";
import { AzureCommunicationTokenCredential } from "@azure/communication-common";

const CustomerTable = ({ customers }) => {
  const [ongoingCall, setOngoingCall] = useState(null);
  const [callAgent, setCallAgent] = useState(null);
  const [callInstance, setCallInstance] = useState(null);
  const [micStatus, setMicStatus] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  let ringtone = null;

  const handleCall = async (customer) => {
    try {
      console.log("📡 Fetching token...");
      const response = await fetch("http://192.168.80.161:3001/htoken");
      const data = await response.json();
      const token = data.token;

      console.log("✅ Token received:", data.userId);
      const credential = new AzureCommunicationTokenCredential(token);

      const callClient = new CallClient();
      const agent = await callClient.createCallAgent(credential, {
        displayName: "Operator",
      });

      const userToCall = { communicationUserId: customer.acsUserId };
      const call = await agent.startCall([userToCall]);

      setCallAgent(agent);
      setCallInstance(call);
      setOngoingCall(customer);
      setIsCalling(true);

      // Ringing sound
      ringtone = new Audio();
      ringtone.src = "/sounds/ringtone.mp3";
      ringtone.type = "audio/mpeg";
      ringtone.loop = true;
      ringtone.play().catch((e) => console.warn("Audio play failed:", e));


      // Call state change
      call.on("stateChanged", () => {
        console.log("📞 Call state changed:", call.state);

        if (call.state === "Connected") {
          ringtone?.pause();
          ringtone.currentTime = 0;
        }

        if (call.state === "Disconnected") {
          ringtone?.pause();
          ringtone.currentTime = 0;
          setOngoingCall(null);
          setCallInstance(null);
          setMicStatus(false);
          setIsCalling(false);
        }
      });

      // Mic Status
      const micEnabled = call.localAudioStreams.length > 0;
      setMicStatus(micEnabled);
    } catch (error) {
      console.error("❌ Failed to start call:", error);
      alert("Unable to start the call.");
    }
  };

  const handleHangUp = async () => {
    if (callInstance) {
      await callInstance.hangUp();
      console.log("📴 Call ended by operator");
    }
  };

  return (
    <>
      <table className="min-w-full bg-white rounded-xl shadow-md">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Phone</th>
            <th className="py-2 px-4 border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={index}>
              <td className="py-2 px-4 border-b">{customer.name}</td>
              <td className="py-2 px-4 border-b">{customer.phone}</td>
              <td className="py-2 px-4 border-b">
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                  onClick={() => handleCall(customer)}
                  disabled={isCalling}
                >
                  {isCalling ? "Calling..." : "Call"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal */}
      {ongoingCall && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-6 transform transition-all duration-300">
            <h2 className="text-lg font-semibold text-gray-800 mb-2 text-center">
              📞 In Call With
            </h2>
            <p className="text-center text-xl font-bold text-blue-700 mb-1">
              {ongoingCall.name}
            </p>
            <p className="text-center text-gray-600 text-sm mb-4">
              {ongoingCall.phone}
            </p>
            <p className="text-center mb-4">
              {micStatus ? (
                <span className="text-green-600">🎤 Mic On</span>
              ) : (
                <span className="text-red-600">🔇 Mic Off</span>
              )}
            </p>
            <div className="flex justify-center">
              <button
                onClick={handleHangUp}
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-full shadow-md"
              >
                Hang Up
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CustomerTable;
