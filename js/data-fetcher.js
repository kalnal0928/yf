// 샘플 데이터 생성 함수
function generateSampleData(baseValue, volatility = 0.02, days = 7) {
    const data = [];
    const timestamps = [];
    let currentValue = baseValue;
    
    const now = new Date();
    for (let i = days - 1; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        timestamps.push(Math.floor(date.getTime() / 1000));
        
        // 랜덤 변동 생성 (더 현실적인 패턴)
        const change = (Math.random() - 0.5) * volatility * currentValue;
        currentValue = Math.max(currentValue + change, 0.01); // 최소값 보장
        data.push(parseFloat(currentValue.toFixed(2)));
    }
    
    return { 
        timestamp: timestamps, 
        timestamps: timestamps, // 호환성을 위해 두 가지 형태 제공
        closes: data,
        indicators: {
            quote: [{
                close: data
            }]
        }
    };
}

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
        
        // 모든 방법이 실패하면 샘플 데이터 사용
        return generateSampleDataForSymbol(symbol, period);
    }
}

// 심볼별 샘플 데이터 생성
function generateSampleDataForSymbol(symbol, period) {
    const days = period === "5d" ? 5 : period === "10d" ? 10 : period === "1mo" ? 30 : 7;
    
    switch(symbol) {
        case "^VIX":
            return generateSampleData(18.5, 0.15, days);
        case "^IXIC":
            return generateSampleData(21000, 0.03, days);
        case "DX-Y.NYB":
            return generateSampleData(98.5, 0.01, days);
        case "JPY=X":
            return generateSampleData(148.0, 0.02, days);
        case "^TNX":
            return generateSampleData(4.2, 0.05, days);
        case "^STOXX50E":
            return generateSampleData(5200, 0.025, days);
        case "000001.SS":
            return generateSampleData(3550, 0.02, days);
        default:
            return generateSampleData(100, 0.02, days);
    }
}

// 모듈 내보내기
window.DataFetcher = {
    fetchYahooFinanceData,
    generateSampleData,
    generateSampleDataForSymbol
}; 