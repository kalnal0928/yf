from flask import Flask, render_template, jsonify
import subprocess
import os
import re

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/run_check', methods=['POST'])
def run_check():
    project_root = "I:\\내 드라이브\\git_hub_homePage\\yf"
    script_path = os.path.join(project_root, "check_all_risks.py")

    try:
        result = subprocess.run(
            ["python", script_path],
            capture_output=True,
            text=True,
            check=False
        )
        raw_output = result.stdout + result.stderr

        parsed_results = {
            "total_signals": 0,
            "script_details": []
        }

        # 각 스크립트 블록과 신호 수를 찾기 위한 정규식
        # 정규식 문자열을 r"""...""" 형태로 변경하여 ' 문자 처리 개선
        script_blocks = re.findall(r"""---\s*(.*?\.py)\s*실행 중\s*---\n(.*?)\n'(.*?\.py)'에서 감지된 신호 수:\s*(\d+)개""", raw_output, re.DOTALL)

        for header_script, script_output_content, footer_script, signals_count_str in script_blocks:
            if header_script == footer_script:
                parsed_results["script_details"].append({
                    "name": header_script,
                    "output": script_output_content.strip(),
                    "signals": int(signals_count_str)
                })

        # 총 위험 신호 수 추출
        total_match = re.search(r'총 감지된 위험 신호 수:\s*(\d+)개', raw_output)
        if total_match:
            parsed_results["total_signals"] = int(total_match.group(1))

        return jsonify(parsed_results)

    except Exception as e:
        return jsonify({"error": f"스크립트 실행 중 오류 발생: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
