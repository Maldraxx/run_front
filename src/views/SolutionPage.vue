<template>
  <div>
    <h2
      @click="showUserProblems = !showUserProblems"
      :class="{ clicked: showUserProblems }"
    >
      문제 목록
    </h2>
    

    <div class="container">
      <div class="left-pane">
        <ul v-if="showUserProblems" class="user-problems">
          <li
            v-for="problem in userProblems"
            :key="problem.question_id"
            @click="selectProblem(problem)"
          >
            {{ problem.question_summary }}
          </li>
        </ul>
        <div v-if="problemSolution">
          <button @click="openChatBot">챗봇 열기</button>
        </div>
      </div>

      <div v-if="message" class="message-overlay">{{ message }}</div>

      <div class="right-pane">
        <select v-model="editorLanguage">
            <option
              v-for="language in languages"
              :key="language.id"
              :value="language.id"
            >
              {{ language.name }}
            </option>
          </select>
        <div v-if="selectedProblem">
          <h3>선택한 문제: {{ selectedProblem.question_summary }}</h3>
          <p>{{ selectedProblem.question_detail }}</p>
          <p v-if="selectedProblem.question_sample_input1">
            예시 입력 1: {{ selectedProblem.question_sample_input1 }}
          </p>
          <p v-if="selectedProblem.question_sample_output1">
            예시 출력 1: {{ selectedProblem.question_sample_output1 }}
          </p>
          <p v-if="selectedProblem.question_sample_input2">
            예시 입력 2: {{ selectedProblem.question_sample_input2 }}
          </p>
          <p v-if="selectedProblem.question_sample_output2">
            예시 출력 2: {{ selectedProblem.question_sample_output2 }}
          </p>
          <p v-if="selectedProblem.question_sample_input3">
            예시 입력 3: {{ selectedProblem.question_sample_input3 }}
          </p>
          <p v-if="selectedProblem.question_sample_output3">
            예시 출력 3: {{ selectedProblem.question_sample_output3 }}
          </p>
          <textarea
            v-model="userCode"
            rows="100"
            cols="300"
            placeholder="코드 작성"
          ></textarea>
          <button @click="submitCode">채점하기</button>
          <button @click="requestFeedback">문제 풀이 요청</button>
          <h3 v-if="gradingResult">{{ gradingResult }}</h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      userProblems: [],
      selectedProblem: null,
      userCode: "",
      gradingResult: "",
      showUserProblems: false,
      problemSolution: "",
      showChatGPT: true,
      editorLanguage: "",
      message: "",
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
    };
  },
  mounted() {
    this.fetchUserProblems();
  },
  methods: {
    selectProblem(problem) {
      this.selectedProblem = problem;
      this.gradingResult = "";
    },
    async fetchUserProblems() {
      const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰을 가져옴
      try {
        const response = await axios.get(
          "https://destiny-back-63f6h32ypq-de.a.run.app/blue/question/get_my_question",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        //this.userProblems = response.data;
        this.userProblems = response.data.map(problem => ({
          ...problem,
          question_id: problem.question_id,
        }));
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
      const token = localStorage.getItem("authToken");
      try {
        console.log("API 요청 시작");
        const response = await axios.post(
          "https://destiny-back-63f6h32ypq-de.a.run.app/blue/question/check_answer",
          /*
          {
            "user_code" : "print(\"a\")",
            "question_id" : 4,
            "language_id" : "71",
          },
          */
          ///*
          {
            user_code: this.userCode,
            question_id: this.selectedProblem.question_id,
            language_id: this.editorLanguage,
          },
          //*/
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        this.result = response.data; // 결과를 result 변수에 저장
        if (this.result === "Success : True") {
          this.showMessage("정답입니다 ");
          this.gradingResult = "정답입니다.";
        } else {
          this.showMessage("오답입니다 ");
          this.gradingResult = "오답입니다.";
        }
      } catch (error) {
        console.error("채점 요청 중 에러 발생: ", error);
      }
    },
    chatButton() {
      this.showChatGPT = !this.showChatGPT;
    },  
    openChatBot() {
      window.location.href = "https://chatgpt.com";
    },
    showMessage(message) {
      this.message = message;
      setTimeout(() => {
        this.message = "";
      }, 2000); // 메시지가 2초 후에 사라지도록 설정
    },
  },
};
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}

li {
  cursor: pointer;
  margin-bottom: 10px;
}

textarea {
  margin-top: 10px;
  width: 100%;
}

button {
  display: block;
  margin-top: 10px;
}

.feedback {
  border: 1px solid #ccc;
  padding: 10px;
  margin-top: 10px;
}

.clicked {
  color: blue;
}

.container {
  display: flex;
  padding-top: 20px;
}

.left-pane,
.right-pane {
  flex: 1;
  padding: 20px;
}

.left-pane {
  border-right: 1px solid #ccc;
}

pre {
  white-space: pre-wrap;
  word-wrap: break-word;
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
</style>
