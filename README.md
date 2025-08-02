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

## 데모 모드

현재 애플리케이션은 **데모 모드**로 실행됩니다. CORS (Cross-Origin Resource Sharing) 정책으로 인해 브라우저에서 Yahoo Finance API에 직접 접근할 수 없어, 실제 데이터 대신 샘플 데이터를 사용합니다.

### 실제 데이터 사용을 위한 대안

1. **백엔드 서버 구축**: Node.js, Python Flask, 또는 PHP로 백엔드 API 서버를 구축하여 Yahoo Finance 데이터를 프록시
2. **Netlify Functions**: Netlify의 서버리스 함수를 사용하여 CORS 문제 해결
3. **다른 금융 API 사용**: Alpha Vantage, IEX Cloud 등 CORS를 지원하는 API 사용

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

## CORS 문제 해결

현재 CORS 정책으로 인해 브라우저에서 Yahoo Finance API에 직접 접근할 수 없습니다. 이를 해결하기 위해 다음과 같은 방법들을 시도했습니다:

1. **CORS 프록시 사용**: 여러 공개 CORS 프록시 서비스 사용
2. **샘플 데이터 폴백**: API 호출 실패 시 현실적인 샘플 데이터 생성
3. **에러 처리**: 네트워크 오류에 대한 적절한 처리

## 라이선스

MIT License 