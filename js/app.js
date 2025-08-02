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
            if (result.chartData && (index === 0 || index === 1 || index === 2 || index === 3 || index === 4)) { // Added index === 4 for US10Y
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
        setTimeout(() => {
            results.forEach((result, index) => {
                if (result.chartData && (index === 0 || index === 1 || index === 2 || index === 3 || index === 4)) {
                    const canvasId = `chart-${index}`;
                    const titles = ['VIX Index', 'Nasdaq Composite', 'Dollar Index (DXY)', 'Japanese Yen', 'US 10-Year Treasury Yield']; // Added US 10-Year Treasury Yield
                    ChartManager.createChart(canvasId, result.chartData, titles[index]);
                }
            });
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