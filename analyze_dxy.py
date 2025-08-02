
import yfinance as yf
import pandas as pd

def analyze_dxy():
    """
    달러 인덱스(DXY)의 지난 5일간 데이터를 가져와 약세 또는 급변동을 분석합니다.
    """
    ticker_symbol = "DX-Y.NYB"
    dxy = yf.Ticker(ticker_symbol)

    # 지난 7일간의 데이터 (주말 포함하여 5거래일 확보)
    hist = dxy.history(period="7d")

    if hist.empty:
        print(f"티커 {ticker_symbol}에 대한 데이터를 가져올 수 없습니다. 티커를 확인하거나 네트워크 연결을 확인하세요.")
        return

    # 최근 5거래일 데이터만 사용 (copy()를 사용하여 SettingWithCopyWarning 방지)
    recent_5_days = hist.tail(5).copy()

    print("\n--- 달러 인덱스(DXY) 지난 5거래일 데이터 ---")
    # 요약 정보만 출력 (전체 DataFrame 대신)
    print(f"최근 5거래일 종가: {', '.join([f'{price:.2f}' for price in recent_5_days['Close'].tolist()])}")
    print(f"평균 종가: {recent_5_days['Close'].mean():.2f}")

    if len(recent_5_days) < 5:
        print("\n데이터가 5거래일 미만입니다. 충분한 데이터가 없습니다.")
        return

    # 약세 분석: 5일 동안 종가가 지속적으로 하락했는지 확인
    is_bearish = True
    for i in range(1, len(recent_5_days)):
        if recent_5_days["Close"].iloc[i] >= recent_5_days["Close"].iloc[i-1]:
            is_bearish = False
            break

    if is_bearish:
        print("\n[분석 결과] 지난 5거래일 동안 달러 인덱스가 지속적인 약세를 보였습니다.")
    else:
        print("\n[분석 결과] 지난 5거래일 동안 달러 인덱스가 지속적인 약세를 보이지는 않았습니다.")

    # 급변동 분석: 일일 변동률이 특정 임계치를 초과하는지 확인
    # 여기서는 일일 종가 변동률이 0.5%를 초과하면 급변동으로 간주합니다.
    recent_5_days["Daily_Change_Pct"] = recent_5_days["Close"].pct_change() * 100
    significant_change_threshold = 0.5 # 0.5% 이상 변동 시 급변동으로 간주

    sudden_changes = recent_5_days[abs(recent_5_days["Daily_Change_Pct"]) >= significant_change_threshold]

    if not sudden_changes.empty:
        print(f"\n[분석 결과] 지난 5거래일 동안 급변동(일일 변동률 {significant_change_threshold:.1f}% 이상)이 감지되었습니다:")
        for idx, row in sudden_changes.iterrows():
            print(f"  {idx.strftime('%Y-%m-%d')}: {row['Close']:.2f} ({row['Daily_Change_Pct']:+.2f}%)")
    else:
        print(f"\n[분석 결과] 지난 5거래일 동안 급변동(일일 변동률 {significant_change_threshold:.1f}% 이상)은 감지되지 않았습니다.")

if __name__ == "__main__":
    analyze_dxy()
