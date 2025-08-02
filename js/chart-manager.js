// 차트 생성 함수
function createChart(canvasId, data, title) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // 데이터 유효성 검사
    if (!data || !data.timestamps || !data.closes || data.timestamps.length === 0 || data.closes.length === 0) {
        console.error('Invalid chart data:', data);
        return;
    }
    
    const labels = data.timestamps.map(timestamp => 
        new Date(timestamp * 1000).toLocaleDateString()
    );
    
    // null/undefined 값 필터링
    const validData = data.closes.filter(value => value !== null && value !== undefined);
    const validLabels = labels.slice(0, validData.length);
    
    // 차트별 색상 설정
    let chartColor = 'rgb(75, 192, 192)';
    let backgroundColor = 'rgba(75, 192, 192, 0.2)';
    
    if (title.includes('DXY') || title.includes('Dollar')) {
        chartColor = 'rgb(255, 99, 132)';
        backgroundColor = 'rgba(255, 99, 132, 0.2)';
    } else if (title.includes('VIX')) {
        chartColor = 'rgb(255, 159, 64)';
        backgroundColor = 'rgba(255, 159, 64, 0.2)';
    } else if (title.includes('Nasdaq')) {
        chartColor = 'rgb(54, 162, 235)';
        backgroundColor = 'rgba(54, 162, 235, 0.2)';
    } else if (title.includes('Japanese Yen')) { // Added for Japanese Yen
        chartColor = 'rgb(153, 102, 255)';
        backgroundColor = 'rgba(153, 102, 255, 0.2)';
    }
    
    return new Chart(ctx, {
        type: 'line',
        data: {
            labels: validLabels,
            datasets: [{
                label: title,
                data: validData,
                borderColor: chartColor,
                backgroundColor: backgroundColor,
                borderWidth: 2,
                tension: 0.1,
                pointRadius: 3,
                pointHoverRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                title: {
                    display: true,
                    text: title,
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                },
                legend: {
                    display: true,
                    position: 'top'
                }
            },
            scales: {
                x: {
                    display: true,
                    title: {
                        display: true,
                        text: '날짜'
                    }
                },
                y: {
                    display: true,
                    title: {
                        display: true,
                        text:                               title.includes('Nasdaq') ? '지수' :
                              title.includes('DXY') ? '달러 인덱스' :
                              title.includes('Japanese Yen') ? '엔화' : '가격'
                    },
                    beginAtZero: false
                }
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

// 차트 HTML 생성 함수
function generateChartHTML(canvasId) {
    return `<div class="chart-container"><canvas id="${canvasId}"></canvas></div>`;
}

// 모듈 내보내기
window.ChartManager = {
    createChart,
    generateChartHTML
}; 