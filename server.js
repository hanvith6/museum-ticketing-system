const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming JSON requests
app.use(express.json());

// Dummy payment endpoint to simulate payment processing
app.post('/pay', (req, res) => {
    const { amount, paymentMethod } = req.body;

    // Simulate payment success for amounts under 1000, otherwise failure
    if (amount <= 1000) {
        res.json({ success: true, message: 'Payment successful', amount });
    } else {
        res.json({ success: false, message: 'Payment failed', amount });
    }
});

// Serve a simple welcome message on the root URL
app.get('/', (req, res) => {
    res.send('Welcome to the Dummy Payment Gateway');
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
