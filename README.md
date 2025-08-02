# 위험 신호 확인 시스템

글로벌 금융 시장의 위험 신호를 실시간으로 모니터링하는 웹 애플리케이션입니다.

## 기능

- **VIX 지수 모니터링**: 25 돌파 및 20% 급등 감지
- **나스닥 연속 하락**: 3% 이상 3일 연속 하락 감지
- **달러 인덱스(DXY) 분석**: 급변동 감지
- **엔화 강세**: 3일 이상 연속 강세 감지
- **10년 국채 금리**: 급변동 감지
- **글로벌 시장**: 주요 시장 하락 감지

## 기술 스택

- HTML5
- CSS3
- JavaScript (ES6+)
- Chart.js (차트 시각화)
- Axios (HTTP 클라이언트)
- Yahoo Finance API

## 배포

이 프로젝트는 Netlify에 배포되어 있습니다.

### 로컬 개발

1. 프로젝트를 클론합니다:
```bash
git clone <repository-url>
cd yf
```

2. 로컬 서버를 실행합니다:
```bash
# Python의 내장 HTTP 서버 사용
python -m http.server 8000
```

3. 브라우저에서 `http://localhost:8000`으로 접속합니다.

### Netlify 배포

1. GitHub에 코드를 푸시합니다.
2. Netlify에 로그인하고 "New site from Git"을 선택합니다.
3. GitHub 저장소를 연결합니다.
4. 빌드 설정:
   - Build command: (비워둠)
   - Publish directory: `.`
5. "Deploy site"를 클릭합니다.

## API 사용

이 애플리케이션은 Yahoo Finance API를 사용하여 실시간 금융 데이터를 가져옵니다:

- VIX 지수: `^VIX`
- 나스닥: `^IXIC`
- 달러 인덱스: `DX-Y.NYB`
- USD/JPY: `JPY=X`
- 10년 국채: `^TNX`
- 유럽 STOXX 50: `^STOXX50E`
- 상해 종합: `000001.SS`

## 라이선스

MIT License 