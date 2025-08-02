
import subprocess
import os

def run_and_check_signal(script_path, signal_keywords):
    """
    주어진 파이썬 스크립트를 실행하고, 출력에서 특정 키워드를 찾아 신호 수를 반환합니다.
    """
    print(f"\n--- {os.path.basename(script_path)} 실행 중 ---")
    try:
        # 스크립트 실행 및 출력 캡처
        result = subprocess.run(
            ["python", script_path],
            capture_output=True,
            text=True,
            check=False  # 에러가 발생해도 예외를 발생시키지 않음
        )
        output = result.stdout + result.stderr
        print(output)  # 각 스크립트의 전체 출력도 보여줌

        signal_count = 0
        for keyword in signal_keywords:
            signal_count += output.count(keyword)
        return signal_count
    except Exception as e:
        print(f"스크립트 실행 중 오류 발생: {e}")
        return 0

def main():
    base_dir = "I:\내 드라이브\git_hub_homePage\yf\netlify\functions"
    
    # 각 스크립트와 해당 스크립트에서 감지할 위험 신호 키워드 정의
    scripts = {
        "analyze_dxy.py": ["[경고]"],  # 달러 인덱스 약세/급변동
        "analyze_jpy.py": ["[경고]"],  # 엔화 강세 3일 이상
        "track_us10y_bond.py": ["[경고]"],  # 미국 10년물 국채 금리 변동
        "track_vix.py": ["[경고]"],  # VIX 지수 25 돌파/20% 급등
        "track_yield_curve.py": ["[경고]"],  # 2년/10년 국채 금리 역전
        "track_global_markets.py": ["[하락]"],  # 글로벌 시장은 '하락'을 위험 신호로 간주
        "track_nasdaq_drop.py": ["[경고]"] # 나스닥 3% 이상 3일 연속 하락
    }

    total_risk_signals = 0

    for script_name, keywords in scripts.items():
        script_path = os.path.join(base_dir, script_name)
        signals = run_and_check_signal(script_path, keywords)
        total_risk_signals += signals
        print(f"'{script_name}'에서 감지된 신호 수: {signals}개")

    print("\n" + "="*40)
    print(f"총 감지된 위험 신호 수: {total_risk_signals}개")
    print("="*40)

if __name__ == "__main__":
    main()
