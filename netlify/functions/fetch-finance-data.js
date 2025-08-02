const axios = require('axios');

exports.handler = async function(event, context) {
  // CORS 헤더 설정
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // OPTIONS 요청 처리 (preflight)
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    };
  }

  try {
            const { function: timeSeriesFunction, symbol: currencyPair } = event.queryStringParameters;
        const API_KEY = process.env.FINANCE_API_KEY; // Ensure this is set in Netlify environment variables

        if (!timeSeriesFunction || !currencyPair) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Function and symbol parameters are required." })
            };
        }

        if (!API_KEY) {
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "API Key not configured." })
            };
        }

        try {
            const url = `https://www.alphavantage.co/query?function=${timeSeriesFunction}&from_symbol=${currencyPair.substring(0, 3)}&to_symbol=${currencyPair.substring(3, 6)}&outputsize=full&apikey=${API_KEY}`;
            const response = await fetch(url);
            const data = await response.json();

            if (data["Error Message"]) {
                return {
                    statusCode: 400,
                    body: JSON.stringify({ error: data["Error Message"] })
                };
            }

            // Extract daily adjusted close prices for FX_DAILY
            const timeSeries = data["Time Series FX (Daily)"];
            if (!timeSeries) {
                return {
                    statusCode: 404,
                    body: JSON.stringify({ error: "No time series data found." })
                };
            }

            const formattedData = Object.keys(timeSeries).map(date => ({
                date: date,
                close: parseFloat(timeSeries[date]["4. close"])
            })).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date ascending

            return {
                statusCode: 200,
                body: JSON.stringify(formattedData)
            };
        } catch (error) {
            console.error("Error fetching finance data:", error);
            return {
                statusCode: 500,
                body: JSON.stringify({ error: "Failed to fetch finance data." })
            };
        }
    
    if (!symbol) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Symbol parameter is required' })
      };
    }

    const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${period}`;
    
    const response = await axios.get(yahooUrl, {
      timeout: 10000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(response.data)
    };

  } catch (error) {
    console.error('Error fetching finance data:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to fetch finance data',
        message: error.message 
      })
    };
  }
}; 