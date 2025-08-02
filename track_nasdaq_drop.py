
import yfinance as yf
import pandas as pd

def track_nasdaq_consecutive_drop():
    """
    나스닥(Nasdaq Composite)이 3% 이상 3일 연속 하락하는지 확인합니다.
    """
    ticker_symbol = "^IXIC"  # Nasdaq Composite Index 티커
    nasdaq = yf.Ticker(ticker_symbol)

    # 지난 5일간의 데이터 (3일 연속 하락 확인을 위해 충분한 데이터 확보)
    hist = nasdaq.history(period="5d")

    if hist.empty or len(hist) < 3:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없거나 충분한 데이터가 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요.")
        return

    # 최근 3거래일 데이터만 사용
    recent_3_days = hist.tail(3)

    print("\n--- 나스닥 연속 하락 추적 ---")
    print(recent_3_days[["Open", "Close"]])

    consecutive_drop_days = 0
    drop_threshold = -3.0 # 3% 하락

    # 일일 변동률 계산
    recent_3_days["Daily_Change_Pct"] = recent_3_days["Close"].pct_change() * 100

    # 역순으로 최근 3일간의 하락 여부 확인
    # 가장 최근 날짜부터 이전 날짜로 확인
    for i in range(len(recent_3_days) - 1, 0, -1):
        # 현재 날짜의 종가가 이전 날짜의 종가보다 낮고, 변동률이 drop_threshold 이하인지 확인
        if recent_3_days["Close"].iloc[i] < recent_3_days["Close"].iloc[i-1] and \
           recent_3_days["Daily_Change_Pct"].iloc[i] <= drop_threshold:
            consecutive_drop_days += 1
        else:
            # 연속 하락이 끊기면 중단
            break

    if consecutive_drop_days >= 3:
        print(f"\n[경고] 나스닥이 3% 이상 {consecutive_drop_days}일 연속 하락했습니다!")
    else:
        print(f"\n[알림] 나스닥이 3% 이상 3일 연속 하락하는 위험 신호는 감지되지 않았습니다. (연속 하락일: {consecutive_drop_days}일)")

if __name__ == "__main__":
    track_nasdaq_consecutive_drop()
