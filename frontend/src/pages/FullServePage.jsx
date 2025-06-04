import React, { useEffect, useState } from "react";
import customersData from "../data/customers.json";
import CustomerTable from "../components/CustomerTable";
import "../styles/FullServe.css";

const FullServePage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    setCustomers(customersData);
  }, []);

  const handleCall = (customer) => {
    console.log(`Calling ${customer.name} at ${customer.phone}`);
    // ACS call integration later
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
