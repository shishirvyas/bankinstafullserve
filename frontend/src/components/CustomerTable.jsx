import React from "react";

const CustomerTable = ({ customers, onCall }) => (
  <div className="table-container">
    <table className="customer-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Phone</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {customers.map((customer) => (
          <tr key={customer.id}>
            <td>{customer.id}</td>
            <td>{customer.name}</td>
            <td>{customer.phone}</td>
            <td>
              <button onClick={() => onCall(customer)} className="call-button">
                Call
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default CustomerTable;
