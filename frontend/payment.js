document.addEventListener('DOMContentLoaded', () => {
    console.log('payment.js loaded');
    const planNameEl = document.getElementById('plan-name');
    const planAmountEl = document.getElementById('plan-amount');
    const payNowBtn = document.getElementById('pay-now-btn');

    const urlParams = new URLSearchParams(window.location.search);
    const plan = urlParams.get('plan');
    console.log('Plan from URL:', plan);

    const paymentPlans = {
        basic: { amount: 49, name: 'Basic Access' },
        premium: { amount: 99, name: 'Premium Verified' },
        enterprise: { amount: 499, name: 'Factory/Enterprise' }
    };

    const planDetails = paymentPlans[plan];
    console.log('Plan details:', planDetails);

    if (planDetails) {
        planNameEl.textContent = planDetails.name;
        planAmountEl.textContent = planDetails.amount;
    } else {
        // Handle case where plan is not specified or invalid
        console.log('Invalid plan, redirecting to index.html');
        window.location.href = 'index.html';
    }

    payNowBtn.addEventListener('click', () => {
        console.log('Pay Now button clicked');
        initiatePayment(plan);
    });

    async function initiatePayment(plan) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            alert('Please login to subscribe.');
            window.location.href = 'login.html';
            return;
        }

        const planDetails = paymentPlans[plan];

        const orderDetails = {
            amount: planDetails.amount,
            currency: 'INR',
            receipt: `receipt_order_${new Date().getTime()}`
        };

        try {
            const order = await fetch('http://localhost:8000/payment/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderDetails)
            }).then(res => res.json());

            const options = {
                key: 'YOUR_KEY_ID', // Replace with your Key ID
                amount: order.amount,
                currency: order.currency,
                name: 'Shramik Seva',
                description: `${planDetails.name} Subscription`,
                order_id: order.id,
                handler: async function (response) {
                    const verificationData = {
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    const result = await fetch('http://localhost:8000/payment/payment-verification', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(verificationData)
                    }).then(res => res.json());

                    if (result.status === 'success') {
                        alert('Payment successful! You are now subscribed.');
                        window.location.href = 'index.html';
                    } else {
                        alert('Payment verification failed. Please contact support.');
                    }
                },
                prefill: {
                    name: user.name,
                    email: user.email
                },
                theme: {
                    color: '#059669'
                }
            };

            const rzp = new Razorpay(options);
            rzp.open();
        } catch (error) {
            alert('Error creating order. Please try again.');
        }
    }
});
