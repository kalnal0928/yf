
import yfinance as yf
import pandas as pd

def track_vix_index():
    """
    VIX 지수를 추적하고 25 돌파 또는 하루 20% 급등 시 경고합니다.
    """
    ticker_symbol = "^VIX"  # VIX 지수 티커
    vix = yf.Ticker(ticker_symbol)

    # 최근 2일간의 데이터 (전일 대비 비교를 위해)
    hist = vix.history(period="2d")

    if hist.empty or len(hist) < 2:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요. 또는 충분한 데이터가 없습니다.")
        return

    # 최신 데이터와 전일 데이터 가져오기
    latest_data = hist.iloc[-1]
    previous_data = hist.iloc[-2]

    current_vix = latest_data["Close"]
    previous_vix = previous_data["Close"]

    print("\n--- VIX 지수 추적 ---")
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

if __name__ == "__main__":
    track_vix_index()
