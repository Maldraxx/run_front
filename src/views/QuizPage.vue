<template>
  <div>
    <div class="header">
      <h1>코딩 테스트</h1>
    </div>

    <!-- 문제 생성 및 지난 문제 불러오기 컨테이너 -->
    <div class="action-container">
      <div class="action-section">
        <!-- 문제 생성 섹션 -->
        <div class="create-problem">
          <h2>문제 생성</h2>
          <select v-model="selectedProblem" @change="loadSelectedProblem">
            <option value="">코딩 문제 선택</option>
            <option v-for="problem in category" :key="problem.id" :value="problem.id">
              {{ problem.title }}
            </option>
          </select>

          <!-- 난이도 선택 -->
          <select v-model="selectedDifficulty">
            <option value="">난이도 선택</option>
            <option value="10">10</option>
            <option value="9">9</option>
            <option value="8">8</option>
            <option value="7">7</option>
            <option value="6">6</option>
            <option value="5">5</option>
            <option value="4">4</option>
            <option value="3">3</option>
            <option value="2">2</option>
            <option value="1">1</option>
          </select>

          <button class="btn" @click="createProblem" :disabled="!selectedProblem || !selectedDifficulty">
            생성
          </button>
        </div>

        <!-- 지난 문제 불러오기 섹션 -->
        <div class="load-previous">
          <button class="btn load-previous-btn" @click="loadPreviousProblems">
            지난 문제 불러오기
          </button>
        </div>
      </div>
    </div>

    

    <div class="container">
      <div class="content">
        <div class="problem">
          <h2>문제</h2>
          <ul class="scrollable">
            <li v-for="problem in displayedProblems" :key="problem.id" @click="showProblemDetail(problem)">
              {{ problem.title }}
            </li>
          </ul>
        </div>

        <div class="editor">
          <h2>코드 에디터</h2>
          <select v-model="selectedLanguage">
            <option value="python">Python</option>
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="c">C</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
          </select>
          <textarea v-model="code" class="scrollable" placeholder="여기에 코드를 입력하세요."></textarea>
          <button class="btn" @click="submitCode">제출</button>
        </div>
      </div>

      <div v-if="message" class="message">{{ message }}</div>

      <div v-if="result" class="result">
        <h2>결과</h2>
        <pre>{{ result }}</pre>
      </div>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      problem: "이곳에 생성된 문제가 표시될 예정입니다.",
      code: "",
      selectedProblem: "", // 사용자가 선택한 코딩 문제의 ID
      selectedDifficulty: "10", // 사용자가 선택한 난이도
      selectedLanguage: "python", // 사용자가 선택한 언어
      selectedPreviousProblem: "", // 사용자가 선택한 지난 문제의 ID
      category: [
        { id: "자료구조", title: "자료구조 문제" },
        { id: "알고리즘", title: "알고리즘 문제" },
        { id: "SQL", title: "SQL 문제" },
      ], // 코딩 문제 목록
      problemList: [
        
      ], // 문제 목록
      previousProblems: [
        
      ], // 지난 문제 목록
      selectedProblemDetail: null, // 선택한 문제의 상세 내용을 보여주기 위한 변수
      message: "",
      result: "",
    };
  },
  computed: {
    displayedProblems() {
      return this.selectedPreviousProblem ? this.previousProblems : this.problemList;
    }
  },
  mounted() {
    // 코딩 문제 목록을 불러오는 로직
    axios
      .get("https://asia-east1-projectrun-418503.cloudfunctions.net/gpt_code_generator")
      .then((response) => {
        this.category = response.data;
      })
      .catch((error) => {
        console.error("코딩 문제 목록을 불러오는 중 에러 발생: ", error);
        this.showMessage("코딩 문제 목록을 불러오는 중 에러가 발생했습니다.");
      });
  },
  methods: {
    loadSelectedProblem() {
      // 선택한 코딩 문제의 ID를 기반으로 문제를 불러오는 로직
      if (this.selectedProblem) {
        axios
          .get("https://asia-east1-projectrun-418503.cloudfunctions.net/gpt_code_generator", {
            params: {
              category: this.selectedProblem,
              difficulty: this.selectedDifficulty,
            },
          })
          .then((response) => {
            this.problemList = response.data.problems;
          })
          .catch((error) => {
            console.error("문제를 불러오는 중 에러 발생: ", error);
            this.showMessage("선택한 문제를 불러오는 중 에러가 발생했습니다.");
          });
      } else {
        this.problemList = []; // 선택한 문제가 없는 경우 문제 목록을 초기화
      }
    },
    createProblem() {
      if (this.selectedProblem && this.selectedDifficulty) {
        axios
          .post("/create-problem/", {
            category: this.selectedProblem,
            difficulty: this.selectedDifficulty,
          })
          .then((response) => {
            this.problemList.push(response.data.problem);
          })
          .catch((error) => {
            console.error("에러:", error);
            this.showMessage("문제 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
          });
      } else {
        this.showMessage("카테고리와 난이도를 선택해주세요.");
      }
    },
    loadPreviousProblems() {
      axios
        .get("/load-previous-problems/")
        .then((response) => {
          this.previousProblems = response.data.problems;
          this.problemList = response.data.problems; // 지난 문제들을 문제 리스트에 추가
        })
        .catch((error) => {
          console.error("지난 문제를 불러오는 중 에러 발생: ", error);
          this.showMessage("지난 문제를 불러오는 중 에러가 발생했습니다.");
        });
    },
    loadSelectedPreviousProblem() {
      if (this.selectedPreviousProblem) {
        axios
          .get(`/get-previous-problem/${this.selectedPreviousProblem}`)
          .then((response) => {
            this.problemList = [response.data.problem]; // 선택한 지난 문제를 문제 리스트에 추가
          })
          .catch((error) => {
            console.error("지난 문제를 불러오는 중 에러 발생: ", error);
            this.showMessage("선택한 지난 문제를 불러오는 중 에러가 발생했습니다.");
          });
      } else {
        this.problemList = []; // 선택한 지난 문제가 없는 경우 문제 목록을 초기화
      }
    },
    submitCode() {
      this.isLoading = true;
      axios
        .post("/submit-code/", {
          code: this.code,
          language: this.selectedLanguage,
        })
        .then((response) => {
          this.result = response.data.result;
          this.showMessage("성공적으로 코드가 제출되었습니다.");
        })
        .catch((error) => {
          console.error("에러:", error);
          this.showMessage("코드 제출 중 오류가 발생했습니다. 다시 시도해주세요.");
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    showMessage(message) {
      alert(message);
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px; /* Increased the width */
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

.problem {
  flex: 1;
  background-color: #faf7ff;
  border-radius: 4px;
  padding: 20px;
  margin-right: 10px;
  max-width: 48%; /* Adjust the max-width */
}

.editor {
  flex: 1;
  background-color: #faf7ff;
  border-radius: 4px;
  padding: 20px;
  max-width: 48%; /* Adjust the max-width */
}

.editor textarea {
  width: calc(100% - 20px);
  height: 600px; /* Increased the height */
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: #f2f2f2;
  color: #333;
}

.action-container {
  max-width: 800px; /* Set a max-width for the action container */
  margin: 20px auto; /* Center the container */
}

.action-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
}

.create-problem,
.load-previous {
  display: flex;
  align-items: center;
}

.create-problem h2,
.load-previous h2 {
  margin-right: 10px;
}

.create-problem select,
.load-previous select {
  margin-right: 10px;
}

.create-problem .btn,
.load-previous .btn {
  background-color: #004aad;
  color: #faf7ff;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.create-problem .btn:hover,
.load-previous .btn:hover {
  background-color: #003a9a;
}

.previous-problems {
  margin-top: 20px;
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
  max-height: 600px; /* Increased the height */
  overflow-y: auto;
}
</style>
