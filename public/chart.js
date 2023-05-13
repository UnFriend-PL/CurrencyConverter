let chart = null;

async function generateChart(from, to) {
    try {
        let responseFrom, responseTo;

        if (from === 'PLN') {
            responseFrom = {
                rates: Array(30).fill({ mid: 1, effectiveDate: new Date() })
            };
        } else {
            responseFrom = await fetch(`http://api.nbp.pl/api/exchangerates/rates/A/${from}/last/30/?format=json`);
            responseFrom = await responseFrom.json();
        }

        if (to === 'PLN') {
            responseTo = {
                rates: Array(30).fill({ mid: 1, effectiveDate: new Date() })
            };
        } else {
            responseTo = await fetch(`http://api.nbp.pl/api/exchangerates/rates/A/${to}/last/30/?format=json`);
            responseTo = await responseTo.json();
        }

        // Transform the dates into local date strings
        const labels = responseFrom.rates.map(rate => new Date(rate.effectiveDate).toLocaleDateString());
        const fromData = responseFrom.rates.map(rate => rate.mid);
        const toData = responseTo.rates.map(rate => rate.mid);

        // Calculate the exchange rate of 'from' currency to 'to' currency
        const exchangeRateData = fromData.map((rate, i) => rate / toData[i]);

        const data = {
            labels: labels,
            datasets: [{
                label: `${from}/${to}`,
                data: exchangeRateData,
                borderColor: 'rgb(255, 99, 132)',
                fill: false
            }]
        };
        const config = {
            type: 'line',
            data: data,
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: `Exchange rates of ${from} to ${to} in the last 30 days`
                    }
                }
            }
        };

        if (chart) {
            chart.destroy();
        }

        chart = new Chart(document.getElementById('currencyChart'), config);
    } catch (error) {
        console.error(error);
    }
}