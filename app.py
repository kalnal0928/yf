from flask import Flask, render_template, jsonify
import subprocess
import os
import re

# static_folder와 static_url_path를 명시적으로 지정
app = Flask(__name__, static_folder='static', static_url_path='/static')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_check', methods=['POST'])
def run_check():
    project_root = "I:\\내 드라이브\\git_hub_homePage\\yf"
    script_path = os.path.join(project_root, "check_all_risks.py")

    try:
        # check_all_risks.py 스크립트 실행 및 출력 캡처
        result = subprocess.run(
            ["python", script_path],
            capture_output=True,
            text=True,
            check=False  # 에러가 발생해도 예외를 발생시키지 않음
        )
        raw_output = result.stdout + result.stderr
        print(f"[DEBUG app.py] Raw output from check_all_risks.py:\n{raw_output}") # <-- 디버그 출력

        parsed_results = {
            "total_signals": 0,
            "script_details": []
        }

        # 각 스크립트 블록과 신호 수를 찾기 위한 정규식
        script_blocks = re.findall(r"""---\s*(.*?\.py)\s*실행 중\s*---\n(.*?)\n'(.*?\.py)'에서 감지된 신호 수:\s*(\d+)개""", raw_output, re.DOTALL)

        for header_script, script_output_content, footer_script, signals_count_str in script_blocks:
            if header_script == footer_script:
                script_detail = {
                    "name": header_script,
                    "output": script_output_content.strip(),
                    "signals": int(signals_count_str)
                }
                
                # VIX 차트 경로 파싱 및 제거
                if header_script == "track_vix.py":
                    print(f"[DEBUG app.py] Processing track_vix.py output:\n{script_output_content}") # <-- 디버그 출력
                    # 정규식 패턴 수정: 이스케이프 문자 제거하고 더 정확한 패턴 사용
                    chart_path_match = re.search(r'\[VIX_CHART_PATH\]:(.*?)(?:\n|$)', script_output_content)
                    if chart_path_match:
                        script_detail["chart_path"] = chart_path_match.group(1).strip()
                        # 차트 경로 정보를 출력에서 제거
                        script_detail["output"] = re.sub(r'\[VIX_CHART_PATH\]:.*?(?:\n|$)', '', script_detail["output"]).strip()
                        print(f"[DEBUG app.py] VIX chart_path found: {script_detail['chart_path']}") # <-- 이 라인 수정
                        print(f"[DEBUG app.py] VIX output after removal:\n{script_detail['output']}") # <-- 디버그 출력
                # Nasdaq 차트 경로 파싱 및 제거
                elif header_script == "track_nasdaq_drop.py":
                    print(f"[DEBUG app.py] Processing track_nasdaq_drop.py output:\n{script_output_content}") # <-- 디버그 출력
                    # 정규식 패턴 수정: 이스케이프 문자 제거하고 더 정확한 패턴 사용
                    chart_path_match = re.search(r'\[NASDAQ_CHART_PATH\]:(.*?)(?:\n|$)', script_output_content)
                    if chart_path_match:
                        script_detail["chart_path"] = chart_path_match.group(1).strip()
                        # 차트 경로 정보를 출력에서 제거
                        script_detail["output"] = re.sub(r'\[NASDAQ_CHART_PATH\]:.*?(?:\n|$)', '', script_detail["output"]).strip()
                        print(f"[DEBUG app.py] Nasdaq chart_path found: {script_detail['chart_path']}") # <-- 이 라인 수정
                        print(f"[DEBUG app.py] Nasdaq output after removal:\n{script_detail['output']}") # <-- 이 라인 수정
                
                parsed_results["script_details"].append(script_detail)

        # 총 위험 신호 수 추출
        total_match = re.search(r'총 감지된 위험 신호 수:\s*(\d+)개', raw_output)
        if total_match:
            parsed_results["total_signals"] = int(total_match.group(1))

        return jsonify(parsed_results)

    except Exception as e:
        return jsonify({"error": f"스크립트 실행 중 오류 발생: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
