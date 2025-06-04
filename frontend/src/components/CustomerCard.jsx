import React from "react";

const CustomerCard = ({ customer, onCall }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md flex justify-between items-center mb-4">
      <div>
        <h2 className="text-lg font-semibold">{customer.name}</h2>
        <p className="text-gray-600">{customer.phone}</p>
      </div>
      <button
        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        onClick={() => onCall(customer)}
      >
        Call
      </button>
    </div>
  );
};

export default CustomerCard;
