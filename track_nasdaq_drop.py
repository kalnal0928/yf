import yfinance as yf
import pandas as pd
import matplotlib
matplotlib.use('Agg') # Qt 오류 방지를 위해 Agg 백엔드 사용
import matplotlib.pyplot as plt
import os

def track_nasdaq_consecutive_drop():
    """
    나스닥(Nasdaq Composite)이 3% 이상 3일 연속 하락하는지 확인하고,
    최근 7일간의 나스닥 지수 변화를 그래프로 시각화합니다.
    """
    ticker_symbol = "^IXIC"  # Nasdaq Composite Index 티커
    nasdaq = yf.Ticker(ticker_symbol)

    # 지난 7일간의 데이터
    hist = nasdaq.history(period="7d")

    if hist.empty or len(hist) < 3:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없거나 충분한 데이터가 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요.")
        return

    # 최근 3거래일 데이터만 사용 (연속 하락 감지 로직용)
    recent_3_days = hist.tail(3).copy()

    print("\n--- 나스닥 연속 하락 추적 ---")
    print("최근 7일간 나스닥 종가:")
    # 최근 7일간의 종가 출력 (날짜와 함께)
    for index, row in hist.tail(7).iterrows():
        print(f"  {index.strftime('%Y-%m-%d')}: {row['Close']:.2f}")

    print(f"현재 나스닥 종가: {hist.iloc[-1]['Close']:.2f}")

    consecutive_drop_days = 0
    drop_threshold = -3.0 # 3% 하락

    # 일일 변동률 계산
    recent_3_days["Daily_Change_Pct"] = recent_3_days["Close"].pct_change() * 100

    # 역순으로 최근 3일간의 하락 여부 확인
    for i in range(len(recent_3_days) - 1, 0, -1):
        if recent_3_days["Close"].iloc[i] < recent_3_days["Close"].iloc[i-1] and \
           recent_3_days["Daily_Change_Pct"].iloc[i] <= drop_threshold:
            consecutive_drop_days += 1
        else:
            break

    if consecutive_drop_days >= 3:
        print(f"\n[경고] 나스닥이 3% 이상 {consecutive_drop_days}일 연속 하락했습니다!")
    else:
        print(f"\n[알림] 나스닥이 3% 이상 3일 연속 하락하는 위험 신호는 감지되지 않았습니다. (연속 하락일: {consecutive_drop_days}일)")

    # 나스닥 지수 그래프 시각화
    try:
        plt.figure(figsize=(10, 6))
        plt.plot(hist.index, hist["Close"], marker='o', linestyle='-', color='purple')
        plt.title("Nasdaq Composite Index (Last 7 Days)")
        plt.xlabel("Date")
        plt.ylabel("Close Price")
        plt.grid(True)
        plt.xticks(rotation=45)
        plt.tight_layout()

        # 그래프 저장 경로 설정 (static 폴더에 저장)
        script_dir = os.path.dirname(__file__)
        static_dir = os.path.join(script_dir, 'static')
        os.makedirs(static_dir, exist_ok=True)
        
        chart_filename = "nasdaq_chart.png"
        chart_path = os.path.join(static_dir, chart_filename)
        plt.savefig(chart_path)
        plt.close() # 그래프를 닫아 메모리 누수 방지

        # 웹에서 접근 가능한 상대 경로를 출력하여 app.py가 파싱할 수 있도록 함
        print(f"[NASDAQ_CHART_PATH]:/static/{chart_filename}")

    except Exception as e:
        print(f"[오류] 나스닥 그래프 생성 중 오류 발생: {e}")

if __name__ == "__main__":
    track_nasdaq_consecutive_drop()