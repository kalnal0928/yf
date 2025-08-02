document.getElementById('analyzeButton').addEventListener('click', async () => {
    const loadingDiv = document.getElementById('loading');
    const resultsDiv = document.getElementById('results');
    const totalSignalsDiv = document.getElementById('totalSignals');
    const detailsDiv = document.getElementById('details');
    const errorDiv = document.getElementById('error');

    loadingDiv.classList.remove('hidden');
    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');
    detailsDiv.innerHTML = '';

    try {
        const response = await fetch('/.netlify/functions/risk_analyzer');
        const data = await response.json();

        if (response.ok) {
            totalSignalsDiv.textContent = `총 감지된 위험 신호 수: ${data.total_risk_signals}개`;
            data.details.forEach(detail => {
                const p = document.createElement('p');
                p.textContent = `${detail.script_name} (${detail.signals}개 신호):
${detail.output}`;
                detailsDiv.appendChild(p);
            });
            resultsDiv.classList.remove('hidden');
        } else {
            errorDiv.textContent = `오류 발생: ${data.message || '알 수 없는 오류'}`;
            errorDiv.classList.remove('hidden');
        }
    } catch (error) {
        console.error('Fetch error:', error);
        errorDiv.textContent = `네트워크 오류 또는 서버 응답 없음: ${error.message}`;
        errorDiv.classList.remove('hidden');
    } finally {
        loadingDiv.classList.add('hidden');
    }
});
