import React, { useState } from 'react';
import Axios from '@/axios/axios';

function PaymentComponent() {
  const [loading, setLoading] = useState(false);

  // Helper function to load Razorpay SDK script
  const loadScript = (src: string) => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const displayRazorpay = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert('Please login first to process payment.');
      return;
    }

    const res = await loadScript('https://checkout.razorpay.com/v1/checkout.js');
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    setLoading(true);

    try {
      // 1. Fetch Key ID
      const keyResponse = await Axios.get('/api/razorpay/key', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const razorpayKey = keyResponse.data.key;

      // 2. Call backend to create an order (use a valid planId for testing)
      const response = await Axios.post('/api/razorpay/checkout', 
        { planId: 'TEST_PLAN_ID' },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const orderData = response.data;
      setLoading(false);

      // 3. Set up Razorpay Checkout Options
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Love & Ring',
        description: 'Membership Purchase Test',
        order_id: orderData.id,
        handler: async function (paymentRes: any) {
          try {
            const verifyResponse = await Axios.post('/api/razorpay/verify', 
              {
                razorpay_order_id: paymentRes.razorpay_order_id,
                razorpay_payment_id: paymentRes.razorpay_payment_id,
                razorpay_signature: paymentRes.razorpay_signature,
                planId: 'TEST_PLAN_ID',
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            alert(verifyResponse.data.message || 'Payment Successful!');
          } catch (verifyError: any) {
            alert(verifyError.response?.data?.message || 'Payment Verification Failed.');
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'johndoe@example.com',
          contact: '9999999999',
          method: 'upi',
        },
        theme: {
          color: '#E11D48',
        },
      };

      const paymentObject = new (window as any).Razorpay(options);
      paymentObject.open();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Could not initiate Razorpay transaction.');
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>Razorpay Integration Test</h2>
      <button 
        onClick={displayRazorpay} 
        disabled={loading}
        style={{ padding: '10px 20px', fontSize: '16px', cursor: 'pointer' }}
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </div>
  );
}

export default PaymentComponent;