
import yfinance as yf
import pandas as pd

def track_us10y_bond_yield():
    """
    미국 10년물 국채 금리를 추적하고 경고합니다.
    """
    ticker_symbol = "^TNX"  # 미국 10년물 국채 금리 티커
    bond_yield = yf.Ticker(ticker_symbol)

    # 최근 2일간의 데이터 (전일 대비 비교를 위해)
    hist = bond_yield.history(period="2d")

    if hist.empty or len(hist) < 2:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요. 또는 충분한 데이터가 없습니다.")
        return

    # 최신 데이터와 전일 데이터 가져오기
    latest_data = hist.iloc[-1]
    previous_data = hist.iloc[-2]

    current_yield = latest_data["Close"]
    previous_yield = previous_data["Close"]

    print("\n--- 미국 10년물 국채 금리 추적 ---")
    print(f"전일 종가: {previous_yield:.3f}%")
    print(f"현재 종가: {current_yield:.3f}%")

    # 변동률 계산
    change = current_yield - previous_yield
    change_percent = (change / previous_yield) * 100

    print(f"변동: {change:.3f}%p")
    print(f"변동률: {change_percent:.2f}%")

    # 경고 조건 설정
    # 예시: 전일 대비 0.05%p (5bp) 이상 변동 시 경고
    warning_threshold_abs = 0.05 # 절대값 기준 (예: 0.05%p)
    warning_threshold_pct = 1.0 # 백분율 기준 (예: 1.0% 변동)

    if abs(change) >= warning_threshold_abs or abs(change_percent) >= warning_threshold_pct:
        print("\n[경고] 미국 10년물 국채 금리가 크게 변동했습니다!")
        if change > 0:
            print(f"금리가 {change:.3f}%p ({change_percent:.2f}%) 상승했습니다.")
        else:
            print(f"금리가 {abs(change):.3f}%p ({abs(change_percent):.2f}%) 하락했습니다.")
    else:
        print("\n[알림] 미국 10년물 국채 금리에 특이 변동이 감지되지 않았습니다.")

if __name__ == "__main__":
    track_us10y_bond_yield()
