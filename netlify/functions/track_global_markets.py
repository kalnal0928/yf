
import yfinance as yf
import pandas as pd

def track_global_market_performance():
    """
    유럽, 중국 증시 및 나스닥의 일일 상승/하락을 추적합니다.
    """
    markets = {
        "Nasdaq": "^IXIC",
        "Europe (EURO STOXX 50)": "^STOXX50E",
        "China (Shanghai Composite)": "000001.SS"
    }

    print("\n--- 글로벌 증시 일일 변동 추적 ---")

    for market_name, ticker_symbol in markets.items():
        print(f"\n시장: {market_name} ({ticker_symbol})")
        try:
            market_data = yf.Ticker(ticker_symbol)
            hist = market_data.history(period="2d")

            if hist.empty or len(hist) < 2:
                print(f"  데이터를 가져올 수 없거나 충분한 데이터가 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요.")
                continue

            latest_data = hist.iloc[-1]
            previous_data = hist.iloc[-2]

            current_close = latest_data["Close"]
            previous_close = previous_data["Close"]

            change = current_close - previous_close
            change_percent = (change / previous_close) * 100

            print(f"  전일 종가: {previous_close:.2f}")
            print(f"  현재 종가: {current_close:.2f}")
            print(f"  변동: {change:.2f}")
            print(f"  변동률: {change_percent:.2f}%")

            if change > 0:
                print(f"  [상승] {market_name} 시장이 상승했습니다.")
            elif change < 0:
                print(f"  [하락] {market_name} 시장이 하락했습니다.")
            else:
                print(f"  [보합] {market_name} 시장이 보합세를 보였습니다.")

        except Exception as e:
            print(f"  {market_name} 시장 데이터를 가져오는 중 오류 발생: {e}")

if __name__ == "__main__":
    track_global_market_performance()
