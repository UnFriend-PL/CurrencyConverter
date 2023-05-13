const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const port = 3000;
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '/index.html'));
});
app.get('/convert', async (req, res) => {
    const { from, to, amount } = req.query;

    try {
        let fromRate = 1;
        let toRate = 1;
        if (from !== 'PLN') {
            const response = await axios.get(`http://api.nbp.pl/api/exchangerates/rates/A/${from}/?format=json`);
            fromRate = response.data.rates[0].mid;
        }
        if (to !== 'PLN') {
            const response = await axios.get(`http://api.nbp.pl/api/exchangerates/rates/A/${to}/?format=json`);
            toRate = response.data.rates[0].mid;
        }
        const convertedAmount = (amount / fromRate) * toRate;
        const rate = toRate / fromRate;

        res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>Currency Converter Result</title>
            <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css">
        </head>
        <body>
            <div class="container">
                <h1 class="my-4">Conversion Result</h1>
                <p class="lead">The exchange rate of ${from} to ${to} is: ${rate.toFixed(2)}. For ${amount} ${to} you will get ${convertedAmount.toFixed(2)}. ${from}</p>
                <a href="/" class="btn btn-primary">Convert More</a>
            </div>
        </body>
        </html>
        `);
    } catch (error) {
        res.status(500).send('Wystąpił błąd podczas przetwarzania Twojego żądania');
    }
});

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, '404page.html'));
});
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});