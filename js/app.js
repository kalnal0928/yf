// 메인 실행 함수
async function runCheck() {
    // UI 초기화
    document.getElementById('loading').style.display = 'block';
    document.getElementById('summary-title').style.display = 'none';
    document.getElementById('summary').style.display = 'none';
    document.getElementById('details-title').style.display = 'none';
    document.getElementById('details').innerHTML = '';

    try {
        const results = await Promise.all([
            Analyzers.analyzeVIX(),
            Analyzers.analyzeNasdaq(),
            Analyzers.analyzeDXY(),
            Analyzers.analyzeJPY(),
            Analyzers.analyzeUS10Y(),
            Analyzers.analyzeGlobalMarkets()
        ]);

        const totalSignals = results.reduce((sum, result) => sum + result.signals, 0);

        // 요약 섹션 표시
        document.getElementById('summary-title').style.display = 'block';
        const summaryDiv = document.getElementById('summary');
        summaryDiv.textContent = `총 감지된 위험 신호 수: ${totalSignals}개`;
        summaryDiv.style.display = 'block';

        // 상세 결과 섹션 표시
        document.getElementById('details-title').style.display = 'block';
        const detailsDiv = document.getElementById('details');

        const scriptNames = ['VIX 지수', '나스닥', '달러 인덱스', '엔화', '10년 국채', '글로벌 시장'];
        
        results.forEach((result, index) => {
            const scriptDetailDiv = document.createElement('div');
            scriptDetailDiv.className = 'script-detail-section';
            
            let chartHtml = '';
            if (result.chartData && (index === 0 || index === 1 || index === 2)) {
                const canvasId = `chart-${index}`;
                chartHtml = ChartManager.generateChartHTML(canvasId);
            }
            
            scriptDetailDiv.innerHTML = `
                <h3>${scriptNames[index]}</h3>
                <p>감지된 신호 수: <span class="signal-count">${result.signals}개</span></p>
                ${chartHtml}
                <pre>${result.output}</pre>
            `;
            detailsDiv.appendChild(scriptDetailDiv);
        });

        // 차트 생성
        setTimeout(async () => {
            results.forEach((result, index) => {
                if (result.chartData && (index === 0 || index === 1 || index === 2)) {
                    const canvasId = `chart-${index}`;
                    const titles = ['VIX Index', 'Nasdaq Composite', 'Dollar Index (DXY)'];
                    ChartManager.createChart(canvasId, result.chartData, titles[index]);
                }
            });

            // 엔화(USD/JPY) 환율 데이터 가져오기 및 그래프 그리기
            try {
                const jpyData = await DataFetcher.fetchExchangeRateData('FX_DAILY', 'USDJPY');
                if (jpyData) {
                    const jpyLabels = jpyData.map(item => item.date);
                    const jpyValues = jpyData.map(item => item.close);

                    ChartManager.createChart(
                        document.getElementById('jpyChart').getContext('2d'),
                        'line',
                        jpyLabels,
                        [{
                            label: 'USD/JPY Exchange Rate',
                            data: jpyValues,
                            borderColor: 'rgb(255, 99, 132)',
                            tension: 0.1,
                            fill: false
                        }],
                        'USD/JPY Exchange Rate (Daily)'
                    );
                }
            } catch (error) {
                console.error("Error creating JPY chart:", error);
            }

        }, 100);

    } catch (error) {
        document.getElementById('details').innerHTML = 
            `<div class="error-message">오류 발생: ${error.message}</div>`;
    } finally {
        document.getElementById('loading').style.display = 'none';
    }
}

// 전역 함수로 등록
window.runCheck = runCheck;