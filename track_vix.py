import yfinance as yf
import pandas as pd
import matplotlib
matplotlib.use('Agg') # Qt 오류 방지를 위해 Agg 백엔드 사용
import matplotlib.pyplot as plt
import os

def track_vix_index():
    """
    VIX 지수를 추적하고 25 돌파 또는 하루 20% 급등 시 경고합니다.
    또한, 최근 7일간의 VIX 지수 변화를 그래프로 시각화합니다.
    """
    ticker_symbol = "^VIX"  # VIX 지수 티커
    vix = yf.Ticker(ticker_symbol)

    # 최근 7일간의 데이터
    hist = vix.history(period="7d")

    if hist.empty or len(hist) < 2:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요. 또는 충분한 데이터가 없습니다.")
        return

    # 최신 데이터와 전일 데이터 가져오기
    latest_data = hist.iloc[-1]
    previous_data = hist.iloc[-2]

    current_vix = latest_data["Close"]
    previous_vix = previous_data["Close"]

    print("\n--- VIX 지수 추적 ---")
    print("최근 7일간 VIX 종가:")
    # 최근 7일간의 종가 출력 (날짜와 함께)
    for index, row in hist.tail(7).iterrows():
        print(f"  {index.strftime('%Y-%m-%d')}: {row['Close']:.2f}")

    print(f"전일 VIX 종가: {previous_vix:.2f}")
    print(f"현재 VIX 종가: {current_vix:.2f}")

    # 1. VIX 지수 25 돌파 여부 확인
    if current_vix > 25:
        print(f"\n[경고] VIX 지수가 25를 돌파했습니다! 현재 VIX: {current_vix:.2f}")
    else:
        print(f"\n[알림] VIX 지수는 25 미만입니다. 현재 VIX: {current_vix:.2f}")

    # 2. 하루 20% 급등 여부 확인
    if previous_vix > 0: # 0으로 나누는 오류 방지
        daily_change_pct = ((current_vix - previous_vix) / previous_vix) * 100
        print(f"일일 변동률: {daily_change_pct:.2f}%")

        if daily_change_pct >= 20:
            print(f"\n[경고] VIX 지수가 하루 만에 20% 이상 급등했습니다! ({daily_change_pct:.2f}% 상승)")
        else:
            print(f"\n[알림] VIX 지수의 일일 변동률은 20% 미만입니다.")
    else:
        print("\n[알림] 전일 VIX 지수 데이터가 0이어서 일일 변동률을 계산할 수 없습니다.")

    # VIX 지수 그래프 시각화
    try:
        plt.figure(figsize=(10, 6))
        plt.plot(hist.index, hist["Close"], marker='o', linestyle='-', color='blue')
        plt.title("VIX Index (Last 7 Days)")
        plt.xlabel("Date")
        plt.ylabel("Close Price")
        plt.grid(True)
        plt.xticks(rotation=45)
        plt.tight_layout()

        # 그래프 저장 경로 설정 (static 폴더에 저장)
        script_dir = os.path.dirname(__file__)
        static_dir = os.path.join(script_dir, 'static')
        os.makedirs(static_dir, exist_ok=True) # static 폴더가 없으면 생성
        
        chart_filename = "vix_chart.png"
        chart_path = os.path.join(static_dir, chart_filename)
        plt.savefig(chart_path)
        plt.close() # 그래프를 닫아 메모리 누수 방지

        # 웹에서 접근 가능한 상대 경로를 출력하여 app.py가 파싱할 수 있도록 함
        print(f"[VIX_CHART_PATH]:/static/{chart_filename}")

    except Exception as e:
        print(f"[오류] VIX 그래프 생성 중 오류 발생: {e}")

if __name__ == "__main__":
    track_vix_index()