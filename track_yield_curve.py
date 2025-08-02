
import yfinance as yf
import pandas as pd

def track_yield_curve_inversion():
    """
    미국 2년물과 10년물 국채 금리를 추적하여 금리 역전 현상을 감지합니다.
    """
    ticker_2yr = "^FVX"  # 미국 2년물 국채 금리 티커
    ticker_10yr = "^TNX" # 미국 10년물 국채 금리 티커

    # 2년물 국채 금리 데이터 가져오기
    try:
        bond_2yr = yf.Ticker(ticker_2yr)
        hist_2yr = bond_2yr.history(period="1d")
        if hist_2yr.empty:
            print(f"티커 {ticker_2yr}에 대한 데이터를 가져올 수 없습니다.")
            return
        current_yield_2yr = hist_2yr.iloc[-1]["Close"]
    except Exception as e:
        print(f"2년물 국채 금리 데이터를 가져오는 중 오류 발생: {e}")
        return

    # 10년물 국채 금리 데이터 가져오기
    try:
        bond_10yr = yf.Ticker(ticker_10yr)
        hist_10yr = bond_10yr.history(period="1d")
        if hist_10yr.empty:
            print(f"티커 {ticker_10yr}에 대한 데이터를 가져올 수 없습니다.")
            return
        current_yield_10yr = hist_10yr.iloc[-1]["Close"]
    except Exception as e:
        print(f"10년물 국채 금리 데이터를 가져오는 중 오류 발생: {e}")
        return

    print("\n--- 미국 국채 금리 역전 추적 ---")
    print(f"미국 2년물 국채 금리: {current_yield_2yr:.3f}%")
    print(f"미국 10년물 국채 금리: {current_yield_10yr:.3f}%")

    if current_yield_2yr > current_yield_10yr:
        print("\n[경고] 금리 역전 현상 감지! 2년물 국채 금리가 10년물 국채 금리보다 높습니다.")
        print(f"차이: {current_yield_2yr - current_yield_10yr:.3f}%p")
    else:
        print("\n[알림] 금리 역전 현상이 감지되지 않았습니다. (2년물 < 10년물)")

if __name__ == "__main__":
    track_yield_curve_inversion()
