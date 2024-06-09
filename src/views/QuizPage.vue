<template>
  <div>
    <div class="header">
      <h1>코딩 테스트</h1>
    </div>

    <!-- 문제 생성 섹션 -->
    <div class="action-container">
      <div class="create-problem">
        <h2>문제 생성</h2>

        <!-- 언어 선택 
        <select v-model="selectedLanguage">
          <option value="">언어 선택</option>
          <option
            v-for="language in languages"
            :key="language.id"
            :value="language.id"
          >
            {{ language.name }}
          </option>
        </select>
        -->

        <!-- 문제 종류 선택 -->
        <select v-model="selectedProblemType">
          <option value="">문제 종류 선택</option>
          <option
            v-for="problemType in problemTypes"
            :key="problemType.id"
            :value="problemType.id">
            {{ problemType.name }}
          </option>
        </select>

        <select v-model="selectedDifficulty">
          <option value="">난이도 선택</option>
          <option 
            v-for="n in 10"
            :key="n"
            :value="n">
            {{ n }}
          </option>
        </select>

        <button
          class="btn"
          @click="createProblem"
          :disabled="!selectedProblemType || !selectedDifficulty"
        >
          생성
        </button>
        <button class="btn" @click="fetchPreviousProblems">
          이전 문제 불러오기
        </button>
      </div>
    </div>

    <div class="container">
      <div class="content">
        <div class="problem-display">
          <h2>생성된 문제</h2>
          <div v-if="createdProblem && createdProblem.text">
            <h3>{{ createdProblem.title }}</h3>
            
            <h4>
              난이도: {{ createdProblem.difficulty }}, 언어:
              {{ getLanguageName(createdProblem.language) }}
            </h4>
            <div
              v-for="(example, index) in createdProblem.inputExamples"
              :key="index"
            >
              <p><strong></strong> {{ example }}</p>
              <p>
                <strong></strong> {{ createdProblem.outputExamples[index] }}
              </p>
            </div>
          </div>
          <div v-else>
            <p>문제가 생성되지 않았습니다.</p>
          </div>
        </div>
        <div class="editor">
          <h2>코드 에디터</h2>
          <select v-model="editorLanguage">
            <option
              v-for="language in languages"
              :key="language.id"
              :value="language.id"
            >
              {{ language.name }}
            </option>
          </select>
          <textarea
            v-model="code"
            class="scrollable"
            placeholder="여기에 코드를 입력하세요."
          ></textarea>
          <button class="btn" @click="submitCode">제출</button>
        </div>
      </div>

      <div v-if="message" class="message-overlay">{{ message }}</div>

      <div v-if="result" class="result">
        <h2>결과</h2>
        <pre>{{ result }}</pre>
      </div>

      <div v-if="previousProblems.length" class="previous-problems">
        <h2>이전 문제들</h2>
        <ul>
          <div v-for="problem in previousProblems" :key="problem.id">
            <h3>{{ problem.title }}</h3>
            <!--<p>{{ problem.problem_text }}</p>-->
            <h3>
              <p>난이도: {{ problem.skill }}, 언어:
              {{ getLanguageName(problem.language) }}</p>
              <button class="btn" @click="retryProblem(problem)">다시 풀기</button>
            </h3>
          </div>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      code: "",
      selectedDifficulty: 5, // 사용자가 선택한 난이도
      selectedLanguage: "", // 사용자가 선택한 언어
      editorLanguage: "", // 코드 에디터에서 사용자가 선택한 언어
      selectedProblemType: "", // 사용자가 선택한 문제 종류
      languages: [
        { id: 45, name: "Assembly (NASM 2.14.02)" },
        { id: 46, name: "Bash (5.0.0)" },
        { id: 47, name: "Basic (FBC 1.07.1)" },
        { id: 75, name: "C (Clang 7.0.1)" },
        { id: 76, name: "C++ (Clang 7.0.1)" },
        { id: 48, name: "C (GCC 7.4.0)" },
        { id: 52, name: "C++ (GCC 7.4.0)" },
        { id: 49, name: "C (GCC 8.3.0)" },
        { id: 53, name: "C++ (GCC 8.3.0)" },
        { id: 50, name: "C (GCC 9.2.0)" },
        { id: 54, name: "C++ (GCC 9.2.0)" },
        { id: 86, name: "Clojure (1.10.1)" },
        { id: 51, name: "C# (Mono 6.6.0.161)" },
        { id: 77, name: "COBOL (GnuCOBOL 2.2)" },
        { id: 55, name: "Common Lisp (SBCL 2.0.0)" },
        { id: 90, name: "Dart (2.19.2)" },
        { id: 56, name: "D (DMD 2.089.1)" },
        { id: 57, name: "Elixir (1.9.4)" },
        { id: 58, name: "Erlang (OTP 22.2)" },
        { id: 44, name: "Executable" },
        { id: 87, name: "F# (.NET Core SDK 3.1.202)" },
        { id: 59, name: "Fortran (GFortran 9.2.0)" },
        { id: 60, name: "Go (1.13.5)" },
        { id: 95, name: "Go (1.18.5)" },
        { id: 88, name: "Groovy (3.0.3)" },
        { id: 61, name: "Haskell (GHC 8.8.1)" },
        { id: 91, name: "Java (JDK 17.0.6)" },
        { id: 62, name: "Java (OpenJDK 13.0.1)" },
        { id: 63, name: "JavaScript (Node.js 12.14.0)" },
        { id: 93, name: "JavaScript (Node.js 18.15.0)" },
        { id: 78, name: "Kotlin (1.3.70)" },
        { id: 64, name: "Lua (5.3.5)" },
        { id: 89, name: "Multi-file program" },
        { id: 79, name: "Objective-C (Clang 7.0.1)" },
        { id: 65, name: "OCaml (4.09.0)" },
        { id: 66, name: "Octave (5.1.0)" },
        { id: 67, name: "Pascal (FPC 3.0.4)" },
        { id: 85, name: "Perl (5.28.1)" },
        { id: 68, name: "PHP (7.4.1)" },
        { id: 43, name: "Plain Text" },
        { id: 69, name: "Prolog (GNU Prolog 1.4.5)" },
        { id: 70, name: "Python (2.7.17)" },
        { id: 92, name: "Python (3.11.2)" },
        { id: 71, name: "Python (3.8.1)" },
        { id: 80, name: "R (4.0.0)" },
        { id: 72, name: "Ruby (2.7.0)" },
        { id: 73, name: "Rust (1.40.0)" },
        { id: 81, name: "Scala (2.13.2)" },
        { id: 82, name: "SQL (SQLite 3.27.2)" },
        { id: 83, name: "Swift (5.2.3)" },
        { id: 74, name: "TypeScript (3.7.4)" },
        { id: 94, name: "TypeScript (5.0.3)" },
        { id: 84, name: "Visual Basic.Net (vbnc 0.0.0.5943)" },
      ],
      problemTypes: [
        { id : 1, name: "수학"},
        { id : 2, name: "프로그래밍"},
      ],
      createdProblem: null, // 생성된 문제
      previousProblems: [], // 이전 문제들
      message: "",
      result: "",
    };
  },
  methods: {
    async createProblem() {
      const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰을 가져옴
      try {
        console.log("API 요청 시작");
        this.showMessage("문제를 생성중입니다. 잠시만 기다려주세요.");
        const response = await axios.post(
          "https://destiny-back-63f6h32ypq-de.a.run.app/blue/question/make_question",
          {
            email: "admin@admin.com",
            question_type: this.selectedProblemType,
            skill: this.selectedDifficulty,
            //language: this.getLanguageName(this.selectedLanguage)
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함
            },
          }
        );
        console.log("API 응답 받음:", JSON.stringify(response.data, null, 2));

        const responseData = response.data.split("^&*");
        const problemTitle = responseData[2];
        const problemText = responseData[4];
        const inputExamples = responseData.filter(
          (_, index) => index % 2 === 0 && index > 3
        );
        const outputExamples = responseData.filter(
          (_, index) => index % 2 !== 0 && index > 4
        );

        // createdProblem 객체 업데이트
        this.createdProblem = {
          title: problemTitle,
          text: problemText,
          inputExamples: inputExamples,
          outputExamples: outputExamples,
          difficulty: this.selectedDifficulty,
          language: this.selectedLanguage,
          type: this.selectedProblemType,
        };

        /*if (response.data.success) {
          this.createdProblem = {
            id: response.data.id, // 실제 API 응답에 따라 수정
            skill: "7",
            language: this.selectedLanguage,
            problem_text: response.data.problem_text, // 문제 텍스트를 추가
          };
          this.showMessage("문제가 성공적으로 생성되었습니다.");
        } else {
          this.showMessage("문제 생성에 실패했습니다: " + response.data.detail);
        }
        */
      } catch (error) {
        console.error("에러 발생:", error);
        console.log("에러 응답 데이터:", error.response?.data);
        this.showMessage(
          `문제 생성 중 오류가 발생했습니다: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    async fetchPreviousProblems() {
      const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰을 가져옴
      try {
        const response = await axios.get(
          "https://destiny-back-63f6h32ypq-de.a.run.app/blue/question/get_my_question",
          {
            headers: {
              Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함
            },
          }
        );
        this.previousProblems = response.data; // 응답 데이터에서 이전 문제들 저장
        this.showMessage("이전 문제를 성공적으로 불러왔습니다.");
      } catch (error) {
        console.error("에러 발생:", error);
        console.log("에러 응답 데이터:", error.response?.data);
        this.showMessage(
          `이전 문제 불러오기 중 오류가 발생했습니다: ${
            error.response?.data?.message || error.message
          }`
        );
      }
    },
    async submitCode() {
      if (this.createdProblem && this.code && this.editorLanguage) {
        const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰을 가져옴
        try {
          console.log("API 요청 시작");
          const response = await axios.post(
            "https://destiny-back-63f6h32ypq-de.a.run.app/blue/question/check_answer",
            {
              user_code : "print(\"a\")",
              question_id : 4,
              language_id : "71"
            },
            {
              headers: {
                Authorization: `Bearer ${token}`, // 요청 헤더에 토큰을 포함
              },
            }
          );
          console.log("API 응답 받음:", JSON.stringify(response.data, null, 2));
        // 응답 데이터에 따라 처리
        this.result = response.data; // 결과를 result 변수에 저장
        if (this.result === "Success : True") {
          this.showMessage("정답입니다 ");
        } else {
          this.showMessage("오답입니다 ");
        }
        } catch (error) {
          console.error("에러 발생:", error);
          console.log("에러 응답 데이터:", error.response?.data);
          this.showMessage(
            `코드 제출 중 오류가 발생했습니다: ${
              error.response?.data?.message || error.message
            }`
          );
        }
      } else {
        this.showMessage("문제와 코드를 모두 작성해 주세요.");
      }
    },
    retryProblem(problem){
      this.createdProblem = problem;
      console.log("retryProblem 호출됨:", this.createdProblem);
    },
    getLanguageName(languageId) {
      const language = this.languages.find((lang) => lang.id === languageId);
      return language ? language.name : "Unknown";
    },
    getProblemTitle(problem){
      return problem.title || "제목 없음";
    },
    showMessage(message) {
      this.message = message;
      setTimeout(() => {
        this.message = "";
      }, 3000); // 메시지가 3초 후에 사라지도록 설정
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 20px auto;
  padding: 0 20px;
}

.header {
  background-color: #003a9a;
  color: #faf7ff;
  padding: 20px;
  text-align: center;
}

.header h1 {
  margin: 0;
}

.content {
  display: flex;
  justify-content: space-between;
}

.problem-display {
  flex: 1;
  background-color: #faf7ff;
  border-radius: 4px;
  padding: 20px;
  margin-right: 10px;
  max-width: 48%;
}

.problem-display .problem-text {
  font-size: 0.9em; /* 2포인트 작은 글씨 */
}

.editor {
  flex: 1;
  background-color: #faf7ff;
  border-radius: 4px;
  padding: 20px;
  max-width: 48%;
}

.editor textarea {
  width: calc(100% - 20px);
  height: 600px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f2f2f2;
  color: #333;
}

.action-container {
  max-width: 800px;
  margin: 20px auto;
}

.create-problem {
  display: flex;
  flex-direction: column; /* Flex direction to column for better layout */
  align-items: flex-start; /* Align items to the start */
}

.create-problem h2 {
  margin-bottom: 10px; /* Margin bottom for better spacing */
}

.create-problem input,
.create-problem select {
  margin-bottom: 10px; /* Margin bottom for better spacing */
  padding: 10px; /* Padding for better look */
  width: 100%; /* Full width */
  max-width: 300px; /* Max width */
}

.create-problem .btn {
  background-color: #004aad;
  color: #faf7ff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px; /* 버튼 간격 추가 */
  margin-bottom: 10px; /* Margin bottom for better spacing */
}

.create-problem .btn:last-child {
  margin-right: 0; /* 마지막 버튼의 오른쪽 여백 제거 */
}

.create-problem .btn:hover {
  background-color: #003a9a;
}

.btn {
  background-color: #004aad;
  color: #faf7ff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn:hover {
  background-color: #003a9a;
}

.scrollable {
  max-height: 600px;
  overflow-y: auto;
}

.message-overlay {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(0, 58, 154, 0.9);
  color: #fff;
  padding: 20px;
  border-radius: 4px;
  text-align: center;
  z-index: 1000;
  font-size: 1.5em;
}

.previous-problems {
  background-color: #faf7ff;
  border-radius: 4px;
  padding: 20px;
  margin-top: 20px;
}

.previous-problems h2 {
  margin-top: 0;
}

.previous-problems ul {
  list-style-type: none;
  padding-left: 0;
}

.previous-problems li {
  margin-bottom: 20px;
  border-bottom: 1px solid #ccc;
  padding-bottom: 10px;
}
</style>
