# 위험 신호 확인 시스템

글로벌 금융 시장의 위험 신호를 실시간으로 모니터링하는 웹 애플리케이션입니다.

## 주요 기능

- **VIX 지수 추적**: 변동성 지수 모니터링 (25 이상 시 경고)
- **나스닥 연속 하락 감지**: 3% 이상 3일 연속 하락 시 경고
- **달러 인덱스(DXY) 1개월 추적**: 종합적인 달러 강세/약세 분석
- **엔화 강세 모니터링**: USD/JPY 환율 연속 강세 감지
- **10년 국채 금리 변동**: 급격한 금리 변동 감지
- **글로벌 시장 분석**: 주요 글로벌 시장의 일일 변동 추적
- **인터랙티브 차트**: VIX, Nasdaq, DXY 차트 시각화

## 기술 스택

### Frontend
- **HTML5**: 시맨틱 마크업
- **CSS3**: 반응형 디자인 및 모던 UI
- **JavaScript (ES6+)**: 모듈화된 구조
- **Chart.js**: 인터랙티브 차트 라이브러리
- **Axios**: HTTP 클라이언트

### Backend
- **Netlify Functions**: 서버리스 백엔드
- **Yahoo Finance API**: 실시간 금융 데이터

## 프로젝트 구조

```
├── index.html              # 메인 HTML 파일
├── styles.css              # 스타일시트
├── js/
│   ├── data-fetcher.js     # 데이터 가져오기 모듈
│   ├── analyzers.js        # 분석 로직 모듈
│   ├── chart-manager.js    # 차트 관리 모듈
│   └── app.js             # 메인 애플리케이션 로직
├── netlify/
│   └── functions/
│       └── fetch-finance-data.js  # Netlify Function
├── package.json            # Node.js 의존성
├── netlify.toml           # Netlify 설정
└── README.md              # 프로젝트 문서
```

## 모듈 구조

### 1. DataFetcher (`js/data-fetcher.js`)
- Yahoo Finance API 데이터 가져오기
- CORS 프록시 처리
- 샘플 데이터 생성 (폴백)

### 2. Analyzers (`js/analyzers.js`)
- VIX 지수 분석
- Nasdaq 하락 분석
- DXY 1개월 추적 분석
- JPY 환율 분석
- 10년 국채 분석
- 글로벌 시장 분석

### 3. ChartManager (`js/chart-manager.js`)
- Chart.js 차트 생성
- 차트별 색상 설정
- 데이터 유효성 검사

### 4. App (`js/app.js`)
- 메인 실행 로직
- UI 업데이트
- 결과 표시

## 설치 및 실행

### 로컬 개발
```bash
# 의존성 설치
npm install

# 로컬 서버 실행
npm run dev
```

### Netlify 배포
1. GitHub 저장소에 코드 푸시
2. Netlify에서 저장소 연결
3. 자동 배포 완료

## 데이터 소스

### 실시간 데이터
- **Netlify Functions**: Yahoo Finance API 프록시
- **CORS 우회**: 여러 공개 프록시 서비스 활용
- **폴백**: 최종 폴백 메커니즘

### 분석 지표
- **VIX**: 25 이상 시 위험 신호
- **Nasdaq**: 3% 이상 3일 연속 하락 시 위험 신호
- **DXY**: 1개월 5% 이상 변동 또는 3% 이상 추세 변화 시 위험 신호
- **JPY**: 3일 이상 연속 강세 시 위험 신호
- **10년 국채**: 3% 이상 변동률 시 위험 신호

## CORS 문제 해결

브라우저의 CORS 정책으로 인한 API 호출 제한을 해결하기 위해:

1. **Netlify Functions**: 서버 사이드 프록시
2. **공개 CORS 프록시**: 다중 백업 서비스
3. **샘플 데이터**: 최종 폴백 메커니즘

## 라이선스

MIT License

## 기여

이슈 리포트 및 풀 리퀘스트를 환영합니다. 