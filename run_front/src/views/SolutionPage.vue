<template>
  <div>
    <h2
      @click="showUserProblems = !showUserProblems"
      :class="{ clicked: showUserProblems }"
    >
      문제 목록
    </h2>
    <ul v-if="showUserProblems" class="user-problems">
      <li
        v-for="problem in userProblems"
        :key="problem.id"
        @click="selectProblem(problem)"
      >
        {{ problem.title }}
      </li>
    </ul>

    <div class="container">
      <div class="left-pane">
        <div v-if="selectedProblem">
          <h3>선택한 문제: {{ selectedProblem.title }}</h3>
          <textarea
            v-model="userCode"
            rows="10"
            cols="50"
            placeholder="작성했던 코드 불러와줘야 할 듯"
          ></textarea>
          <button @click="submitCode">채점하기</button>
          <button @click="requestFeedback">문제 풀이 요청</button>
          <h3 v-if="gradingResult">{{ gradingResult }}</h3>
        </div>
      </div>

      <div class="right-pane">
        <div v-if="problemSolution">
          <h3>문제 해답:</h3>
          <pre>{{ problemSolution }}</pre>
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
      userProblems: [
        { id: 1, title: "문제1" },
        { id: 2, title: "문제2" },
        { id: 3, title: "문제3" },
        { id: 4, title: "문제4" },
        { id: 5, title: "문제5" }, // 임시로 넣음
      ],
      selectedProblem: null,
      userCode: "",
      feedback: "",
      showUserProblems: false,
      gradingResult: "",
      problemSolution: "",
    };
  },
  mounted() {
    axios
      .get("/user/problems")
      .then((response) => {
        this.userProblems = response.data;
      })
      .catch((error) => {
        console.error("문제 목록을 불러오는 중 에러 발생: ", error);
      });
  },
  methods: {
    selectProblem(problem) {
      this.selectedProblem = problem;
      this.gradingResult = "";
      this.problemSolution = "";
    },
    submitCode() {
      axios
        .post("/grade", {
          problemId: this.selectedProblem.id,
          code: this.userCode,
        })
        .then((response) => {
          console.log("채점 결과:", response.data);
          this.gradingResult = `채점 결과: '${response.data}'`;
        })
        .catch((error) => {
          console.error("채점 요청 중 에러 발생: ", error);
        });
    },
    requestFeedback() {
      axios
        .post("/request-feedback", {
          problemId: this.selectedProblem.id,
          code: this.userCode,
        })
        .then((response) => {
          console.log("챗 지피티 피드백:", response.data);
          this.problemSolution = response.data.solution;
        })
        .catch((error) => {
          console.error("문제 풀이 요청 중 에러 발생: ", error);
        });
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
</style>
