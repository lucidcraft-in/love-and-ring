import React, { useState } from "react";
import Axios from "@/axios/axios";

function PaymentComponent() {
  const [loading, setLoading] = useState(false);

  const displayPayUCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first to process payment.");
      return;
    }

    setLoading(true);

    try {
      // 1. Call backend to get generated PayU hash and parameters
      const response = await Axios.post(
        "/api/payu/checkout",
        { planId: "TEST_PLAN_ID" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const payuData = response.data;

      // 2. Dynamically create an HTML form to post parameters to PayU hosted gateway
      const form = document.createElement("form");
      form.method = "POST";
      form.action = payuData.action; // PayU gateway URL

      // Append all required PayU payload parameters to form fields
      Object.keys(payuData).forEach((key) => {
        if (key !== "action") {
          const input = document.createElement("input");
          input.type = "hidden";
          input.name = key;
          input.value = payuData[key];
          form.appendChild(input);
        }
      });

      document.body.appendChild(form);
      form.submit(); // Redirects user directly to PayU Gateway
    } catch (err: any) {
      alert(err.response?.data?.message || "Could not initiate PayU transaction.");
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>PayU Payment Integration</h2>
      <button
        onClick={displayPayUCheckout}
        disabled={loading}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
}

export default PaymentComponent;