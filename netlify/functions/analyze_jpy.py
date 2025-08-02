
import yfinance as yf
import pandas as pd

def analyze_jpy_strength():
    """
    엔화(JPY)가 미국 달러(USD) 대비 3일 이상 강세를 지속했는지 점검합니다.
    """
    ticker_symbol = "JPY=X"  # USD/JPY 환율 티커
    jpy = yf.Ticker(ticker_symbol)

    # 지난 10일간의 데이터 (충분한 거래일 확보를 위해)
    hist = jpy.history(period="10d")

    if hist.empty:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요.")
        return

    # 최근 거래일 데이터만 사용
    # USD/JPY 환율이 하락하면 엔화 강세입니다.
    recent_data = hist.sort_index(ascending=True)

    print("\n--- USD/JPY 환율 지난 거래일 데이터 ---")
    print(recent_data[["Open", "Close", "High", "Low"]])

    consecutive_strength_days = 0
    strength_detected = False

    # 종가 기준으로 엔화 강세(USD/JPY 하락) 연속 일수 계산
    for i in range(1, len(recent_data)):
        if recent_data["Close"].iloc[i] < recent_data["Close"].iloc[i-1]:
            consecutive_strength_days += 1
            if consecutive_strength_days >= 3:
                strength_detected = True
                break # 3일 이상 강세가 확인되면 더 이상 확인할 필요 없음
        else:
            consecutive_strength_days = 0 # 강세가 끊기면 초기화

    if strength_detected:
        print(f"\n[분석 결과] 엔화가 미국 달러 대비 최소 3일 이상 강세를 지속했습니다. (연속 강세일: {consecutive_strength_days}일)")
    else:
        print("\n[분석 결과] 엔화가 미국 달러 대비 3일 이상 연속 강세를 보이지는 않았습니다.")

if __name__ == "__main__":
    analyze_jpy_strength()
