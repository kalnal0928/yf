import json
import subprocess
import os

def handler(event, context):
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    # 각 스크립트와 해당 스크립트에서 감지할 위험 신호 키워드 정의
    # 이 부분은 check_all_risks.py의 로직을 가져왔습니다.
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
    results_details = []

    for script_name, keywords in scripts.items():
        script_path = os.path.join(base_dir, script_name)
        
        # 스크립트 실행 및 출력 캡처
        try:
            process = subprocess.run(
                ["python", script_path],
                capture_output=True,
                text=True,
                check=False, # 에러가 발생해도 예외를 발생시키지 않음
                env=os.environ # 환경 변수 전달
            )
            output = process.stdout + process.stderr

            signal_count = 0
            for keyword in keywords:
                signal_count += output.count(keyword)
            
            total_risk_signals += signal_count
            results_details.append({
                "script_name": script_name,
                "signals": signal_count,
                "output": output.strip() # 공백 제거
            })
        except Exception as e:
            results_details.append({
                "script_name": script_name,
                "signals": 0,
                "output": f"스크립트 실행 중 오류 발생: {e}"
            })

    return {
        "statusCode": 200,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps({
            "total_risk_signals": total_risk_signals,
            "details": results_details
        })
    }
