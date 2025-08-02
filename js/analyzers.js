// VIX 지수 분석
async function analyzeVIX() {
    try {
        const data = await DataFetcher.fetchYahooFinanceData("^VIX");
        if (!data) return { signals: 0, output: "데이터를 가져올 수 없습니다." };

        // 데이터 구조 안전하게 처리
        const timestamps = data.timestamp || data.timestamps || [];
        const closes = data.indicators?.quote?.[0]?.close || data.closes || [];
        
        if (timestamps.length === 0 || closes.length === 0) {
            return { signals: 0, output: "유효한 데이터가 없습니다." };
        }
        
        let output = "\n--- VIX 지수 추적 ---\n";
        output += "최근 7일간 VIX 종가:\n";
        
        for (let i = 0; i < Math.min(timestamps.length, 7); i++) {
            const date = new Date(timestamps[i] * 1000);
            const close = closes[i];
            output += `  ${date.toISOString().split('T')[0]}: ${close?.toFixed(2) || 'N/A'}\n`;
        }

        const currentVIX = closes[closes.length - 1];
        const previousVIX = closes[closes.length - 2];
        
        output += `전일 VIX 종가: ${previousVIX?.toFixed(2) || 'N/A'}\n`;
        output += `현재 VIX 종가: ${currentVIX?.toFixed(2) || 'N/A'}\n`;

        let signals = 0;
        
        if (currentVIX && currentVIX > 25) {
            output += `\n[경고] VIX 지수가 25를 돌파했습니다! 현재 VIX: ${currentVIX.toFixed(2)}\n`;
            signals++;
        } else {
            output += `\n[알림] VIX 지수는 25 미만입니다. 현재 VIX: ${currentVIX?.toFixed(2) || 'N/A'}\n`;
        }

        if (previousVIX && previousVIX > 0 && currentVIX) {
            const dailyChangePct = ((currentVIX - previousVIX) / previousVIX) * 100;
            output += `일일 변동률: ${dailyChangePct.toFixed(2)}%\n`;

            if (dailyChangePct >= 20) {
                output += `\n[경고] VIX 지수가 하루 만에 20% 이상 급등했습니다! (${dailyChangePct.toFixed(2)}% 상승)\n`;
                signals++;
            } else {
                output += `\n[알림] VIX 지수의 일일 변동률은 20% 미만입니다.\n`;
            }
        }

        return { signals, output, chartData: { timestamps, closes } };
    } catch (error) {
        return { signals: 0, output: `VIX 데이터 가져오기 실패: ${error.message}` };
    }
}

// Nasdaq 분석
async function analyzeNasdaq() {
    try {
        const data = await DataFetcher.fetchYahooFinanceData("^IXIC");
        if (!data) return { signals: 0, output: "데이터를 가져올 수 없습니다." };

        // 데이터 구조 안전하게 처리
        const timestamps = data.timestamp || data.timestamps || [];
        const closes = data.indicators?.quote?.[0]?.close || data.closes || [];
        
        if (timestamps.length === 0 || closes.length === 0) {
            return { signals: 0, output: "유효한 데이터가 없습니다." };
        }
        
        let output = "\n--- 나스닥 연속 하락 추적 ---\n";
        output += "최근 7일간 나스닥 종가:\n";
        
        for (let i = 0; i < Math.min(timestamps.length, 7); i++) {
            const date = new Date(timestamps[i] * 1000);
            const close = closes[i];
            output += `  ${date.toISOString().split('T')[0]}: ${close?.toFixed(2) || 'N/A'}\n`;
        }

        const currentNasdaq = closes[closes.length - 1];
        output += `현재 나스닥 종가: ${currentNasdaq?.toFixed(2) || 'N/A'}\n`;

        // 최근 3일간의 하락 여부 확인
        let consecutiveDropDays = 0;
        const dropThreshold = -3.0;

        for (let i = Math.max(1, timestamps.length - 3); i < timestamps.length; i++) {
            if (closes[i] && closes[i-1] && closes[i] < closes[i-1]) {
                const dailyChangePct = ((closes[i] - closes[i-1]) / closes[i-1]) * 100;
                if (dailyChangePct <= dropThreshold) {
                    consecutiveDropDays++;
                } else {
                    break;
                }
            } else {
                break;
            }
        }

        let signals = 0;
        if (consecutiveDropDays >= 3) {
            output += `\n[경고] 나스닥이 3% 이상 ${consecutiveDropDays}일 연속 하락했습니다!\n`;
            signals++;
        } else {
            output += `\n[알림] 나스닥이 3% 이상 3일 연속 하락하는 위험 신호는 감지되지 않았습니다. (연속 하락일: ${consecutiveDropDays}일)\n`;
        }

        return { signals, output, chartData: { timestamps, closes } };
    } catch (error) {
        return { signals: 0, output: `나스닥 데이터 가져오기 실패: ${error.message}` };
    }
}

// DXY 분석
async function analyzeDXY() {
    try {
        const data = await DataFetcher.fetchYahooFinanceData("DX-Y.NYB", "1mo");
        if (!data) return { signals: 0, output: "데이터를 가져올 수 없습니다." };

        // 데이터 구조 안전하게 처리
        const timestamps = data.timestamp || data.timestamps || [];
        const closes = data.indicators?.quote?.[0]?.close || data.closes || [];
        
        if (timestamps.length === 0 || closes.length === 0) {
            return { signals: 0, output: "유효한 데이터가 없습니다." };
        }
        
        let output = "\n--- 달러 인덱스(DXY) 1개월 추적 ---\n";
        
        // 최근 5일 데이터 분석
        const recent5Days = closes.slice(-5).filter(price => price !== null && price !== undefined);
        output += `최근 5거래일 종가: ${recent5Days.map(price => price?.toFixed(2) || 'N/A').join(', ')}\n`;
        output += `5일 평균 종가: ${recent5Days.length > 0 ? (recent5Days.reduce((sum, price) => sum + (price || 0), 0) / recent5Days.length).toFixed(2) : 'N/A'}\n`;
        
        // 전체 1개월 데이터 분석
        const allValidData = closes.filter(price => price !== null && price !== undefined);
        output += `1개월 평균 종가: ${allValidData.length > 0 ? (allValidData.reduce((sum, price) => sum + (price || 0), 0) / allValidData.length).toFixed(2) : 'N/A'}\n`;
        output += `1개월 최고가: ${allValidData.length > 0 ? Math.max(...allValidData).toFixed(2) : 'N/A'}\n`;
        output += `1개월 최저가: ${allValidData.length > 0 ? Math.min(...allValidData).toFixed(2) : 'N/A'}\n`;

        let signals = 0;
        
        // 1개월 변동률 계산
        if (allValidData.length >= 2) {
            const firstPrice = allValidData[0];
            const lastPrice = allValidData[allValidData.length - 1];
            const monthlyChange = ((lastPrice - firstPrice) / firstPrice) * 100;
            output += `1개월 변동률: ${monthlyChange.toFixed(2)}%\n`;
            
            // 1개월 변동이 5% 이상이면 신호
            if (Math.abs(monthlyChange) >= 5) {
                output += `\n[경고] 달러 인덱스가 1개월간 ${Math.abs(monthlyChange).toFixed(2)}% ${monthlyChange > 0 ? '상승' : '하락'}했습니다!\n`;
                signals++;
            }
        }
        
        // 최근 5일 급변동 분석
        for (let i = 1; i < recent5Days.length; i++) {
            if (recent5Days[i] && recent5Days[i-1]) {
                const dailyChangePct = Math.abs((recent5Days[i] - recent5Days[i-1]) / recent5Days[i-1]) * 100;
                if (dailyChangePct >= 0.5) {
                    output += `\n[분석 결과] 최근 5일간 급변동 감지: ${dailyChangePct.toFixed(2)}% 변동\n`;
                    signals++;
                }
            }
        }

        // 1개월 추세 분석
        if (allValidData.length >= 10) {
            const firstHalf = allValidData.slice(0, Math.floor(allValidData.length / 2));
            const secondHalf = allValidData.slice(Math.floor(allValidData.length / 2));
            
            const firstHalfAvg = firstHalf.reduce((sum, price) => sum + price, 0) / firstHalf.length;
            const secondHalfAvg = secondHalf.reduce((sum, price) => sum + price, 0) / secondHalf.length;
            
            const trendChange = ((secondHalfAvg - firstHalfAvg) / firstHalfAvg) * 100;
            output += `\n1개월 추세 분석: ${trendChange > 0 ? '상승' : '하락'} 추세 (${trendChange.toFixed(2)}%)\n`;
            
            // 추세가 3% 이상이면 신호
            if (Math.abs(trendChange) >= 3) {
                output += `[분석 결과] 명확한 ${trendChange > 0 ? '상승' : '하락'} 추세가 감지되었습니다.\n`;
                signals++;
            }
        }

        return { signals, output, chartData: { timestamps, closes } };
    } catch (error) {
        return { signals: 0, output: `달러 인덱스 데이터 가져오기 실패: ${error.message}` };
    }
}

// JPY 분석
async function analyzeJPY() {
    try {
        const data = await DataFetcher.fetchYahooFinanceData("JPY=X", "10d");
        if (!data) return { signals: 0, output: "데이터를 가져올 수 없습니다." };

        // 데이터 구조 안전하게 처리
        const timestamps = data.timestamp || data.timestamps || [];
        const closes = data.indicators?.quote?.[0]?.close || data.closes || [];
        
        if (timestamps.length === 0 || closes.length === 0) {
            return { signals: 0, output: "유효한 데이터가 없습니다." };
        }
        
        let output = "\n--- USD/JPY 환율 지난 거래일 데이터 ---\n";
        const recent10Days = closes.slice(-10).filter(price => price !== null && price !== undefined);
        output += `최근 10거래일 종가: ${recent10Days.map(price => price?.toFixed(2) || 'N/A').join(', ')}\n`;
        output += `평균 종가: ${recent10Days.length > 0 ? (recent10Days.reduce((sum, price) => sum + (price || 0), 0) / recent10Days.length).toFixed(2) : 'N/A'}\n`;

        let consecutiveStrengthDays = 0;
        let signals = 0;

        for (let i = 1; i < closes.length; i++) {
            if (closes[i] && closes[i-1] && closes[i] < closes[i-1]) {
                consecutiveStrengthDays++;
                if (consecutiveStrengthDays >= 3) {
                    output += `\n[분석 결과] 엔화가 미국 달러 대비 최소 3일 이상 강세를 지속했습니다. (연속 강세일: ${consecutiveStrengthDays}일)\n`;
                    signals++;
                    break;
                }
            } else {
                consecutiveStrengthDays = 0;
            }
        }

        return { signals, output, chartData: { timestamps, closes } };
    } catch (error) {
        return { signals: 0, output: `JPY 데이터 가져오기 실패: ${error.message}` };
    }
}

// 10년 국채 분석
async function analyzeUS10Y() {
    try {
        const data = await DataFetcher.fetchYahooFinanceData("^TNX", "1mo");
        if (!data) return { signals: 0, output: "데이터를 가져올 수 없습니다." };

        // 데이터 구조 안전하게 처리
        const timestamps = data.timestamp || data.timestamps || [];
        const closes = data.indicators?.quote?.[0]?.close || data.closes || [];
        
        if (timestamps.length === 0 || closes.length === 0) {
            return { signals: 0, output: "유효한 데이터가 없습니다." };
        }
        
        const currentRate = closes[closes.length - 1];
        const previousRate = closes[closes.length - 2];
        
        let output = "\n--- 미국 10년물 국채 금리 추적 ---\n";
        output += `전일 종가: ${previousRate?.toFixed(3) || 'N/A'}%\n`;
        output += `현재 종가: ${currentRate?.toFixed(3) || 'N/A'}%\n`;

        let signals = 0;
        if (currentRate && previousRate && previousRate > 0) {
            const change = currentRate - previousRate;
            const changePercent = (change / previousRate) * 100;
            
            output += `변동: ${change.toFixed(3)}%p\n`;
            output += `변동률: ${changePercent.toFixed(2)}%\n`;

            if (Math.abs(changePercent) > 3) {
                output += `\n[경고] 미국 10년물 국채 금리가 크게 변동했습니다!\n`;
                output += `금리가 ${change.toFixed(3)}%p (${changePercent.toFixed(2)}%) ${change > 0 ? '상승' : '하락'}했습니다.\n`;
                signals++;
            }
        }

        return { signals, output, chartData: { timestamps, closes } };
    } catch (error) {
        return { signals: 0, output: `US10Y 데이터 가져오기 실패: ${error.message}` };
    }
}

// 글로벌 시장 분석
async function analyzeGlobalMarkets() {
    try {
        const markets = [
            { name: "Nasdaq", symbol: "^IXIC" },
            { name: "Europe (EURO STOXX 50)", symbol: "^STOXX50E" },
            { name: "China (Shanghai Composite)", symbol: "000001.SS" }
        ];

        let output = "\n--- 글로벌 증시 일일 변동 추적 ---\n";
        let totalSignals = 0;

        for (const market of markets) {
            const data = await DataFetcher.fetchYahooFinanceData(market.symbol, "2d");
            if (!data) continue;

            // 데이터 구조 안전하게 처리
            const closes = data.indicators?.quote?.[0]?.close || data.closes || [];
            
            if (closes.length < 2) continue;
            
            const currentClose = closes[closes.length - 1];
            const previousClose = closes[closes.length - 2];

            if (!currentClose || !previousClose) continue;

            const change = currentClose - previousClose;
            const changePercent = (change / previousClose) * 100;

            output += `\n시장: ${market.name} (${market.symbol})\n`;
            output += `  전일 종가: ${previousClose?.toFixed(2)}\n`;
            output += `  현재 종가: ${currentClose?.toFixed(2)}\n`;
            output += `  변동: ${change?.toFixed(2)}\n`;
            output += `  변동률: ${changePercent?.toFixed(2)}%\n`;

            if (change < 0) {
                output += `  [하락] ${market.name} 시장이 하락했습니다.\n`;
                totalSignals++;
            } else if (change > 0) {
                output += `  [상승] ${market.name} 시장이 상승했습니다.\n`;
            } else {
                output += `  [보합] ${market.name} 시장이 보합세를 보였습니다.\n`;
            }
        }

        return { signals: totalSignals, output };
    } catch (error) {
        return { signals: 0, output: `글로벌 시장 데이터 가져오기 실패: ${error.message}` };
    }
}

// 모듈 내보내기
window.Analyzers = {
    analyzeVIX,
    analyzeNasdaq,
    analyzeDXY,
    analyzeJPY,
    analyzeUS10Y,
    analyzeGlobalMarkets
}; 