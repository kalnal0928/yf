// Yahoo Finance API를 사용하여 데이터를 가져오는 함수들 (Netlify Functions 사용)
async function fetchYahooFinanceData(symbol, period = "7d") {
    try {
        // Netlify Functions 사용
        const functionUrl = `/.netlify/functions/fetch-finance-data?symbol=${encodeURIComponent(symbol)}&period=${period}`;
        const response = await axios.get(functionUrl, {
            timeout: 10000
        });
        
        if (response.data && response.data.chart && response.data.chart.result) {
            return response.data.chart.result[0];
        } else {
            throw new Error('Invalid data format');
        }
        
    } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        
        // Netlify Functions가 실패하면 CORS 프록시 시도
        try {
            const proxies = [
                `https://api.allorigins.win/raw?url=`,
                `https://cors-anywhere.herokuapp.com/`,
                `https://thingproxy.freeboard.io/fetch/`
            ];
            
            const yahooUrl = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=${period}`;
            
            for (const proxy of proxies) {
                try {
                    const proxyResponse = await axios.get(proxy + yahooUrl, {
                        timeout: 5000
                    });
                    if (proxyResponse.data && proxyResponse.data.chart && proxyResponse.data.chart.result) {
                        return proxyResponse.data.chart.result[0];
                    }
                } catch (proxyError) {
                    console.log(`Proxy ${proxy} failed for ${symbol}`);
                    continue;
                }
            }
        } catch (proxyError) {
            console.log('All proxies failed');
        }
        
        // 모든 방법이 실패하면 에러를 던짐
        throw new Error(`Failed to fetch data for ${symbol}: All API methods failed`);
    }
}

// 모듈 내보내기
window.DataFetcher = {
    fetchYahooFinanceData,
    fetchExchangeRateData: async function(timeSeriesFunction, currencyPair) {
        try {
            const response = await axios.get(`/.netlify/functions/fetch-finance-data?function=${timeSeriesFunction}&symbol=${currencyPair}`, {
                timeout: 10000
            });
            
            if (response.data) {
                return response.data;
            } else {
                throw new Error('Invalid exchange rate data format');
            }
        } catch (error) {
            console.error(`Error fetching exchange rate data for ${currencyPair}:`, error);
            throw error;
        }
    }
}; 