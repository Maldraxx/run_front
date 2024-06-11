<template>
  <div class="container">
    <h1>Register Problem Page</h1>
    <p>Users can submit new problems here.</p>
    <p>Only users with advanced user permissions can use it.</p>
    <p>User Permissions : beginner / advanced</p>
    <router-link to="/">Click to Home</router-link>

    <select v-model="selectedProblemType">
      <option value="">문제 종류 선택</option>
      <option value="math">수학</option>
      <option value="programming">프로그래밍</option>
    </select>

    <select v-model="selectedLevel">
      <option value="">레벨 선택</option>
      <option v-for="level in levels" :key="level" :value="level">{{ level }}</option>
    </select>

    <input type="text" v-model="problemTitle" placeholder="문제의 제목을 입력하세요">
    
    <textarea v-model="problemDescription" placeholder="문제의 내용을 입력하세요" rows="10" style="width:100%; height:400px;"></textarea>

    <div v-for="index in 3" :key="index">
      <h3>Example {{ index }}</h3>
      <div>
        <label for="input-example">입력 예시 : </label>
        <textarea v-model="inputExamples[index -1 ]" type="text" placerholder="Input Example"></textarea>
        <label for="output-example">출력 예시 : </label>
        <textarea v-model="outputExamples[index -1]" type="text" placerholder="Output Example"></textarea>
      </div>
    </div>
    <button @click="submitProblem">문제 제출</button>
  </div>
</template>

<script>
export default {
  name: 'RegisterProblemPage',
  data() {
    return {
      selectedProblemType: '',
      selectedLevel: '',
      problemTitle: '',
      problemDescription: '',
      inputExamples: ['', '', ''],
      outputExamples: ['', '', ''],
      levels: Array.from({ length: 10 }, (_, i) => i + 1), // 1부터 10까지의 레벨 배열 생성
      formVaild: false,
      showNotification: false
    };
  },
  computed: {
    formValid() {
      return (
        this.selectedProblemType &&
        this.selectedLevel &&
        this.problemTitle &&
        this.problemDescription &&
        this.inputExamples.every(example => example.trim()) &&
        this.outputExamples.every(example => example.trim())
      );
    }
  },
  methods: {
    submitProblem() {
      if (
        this.selectedProblemType &&
        this.selectedLevel &&
        this.problemTitle &&
        this.problemDescription &&
        this.inputExamples.every(example => example.trim()) &&
        this.outputExamples.every(example => example.trim())
      ) {
        // 모든 필드가 채워져 있으면 제출 로직 실행 (API 호출 등)
        // 여기서 API 호출 로직을 구현할 수 있습니다.
        
        // 제출이 성공하면 성공 메시지 표시 또는 기타 작업 수행
        alert('점검 중입니다. 문제가 등록되었습니다.');
        
        // 양식과 알림 재설정
        this.resetForm();
      } else {
        // 어느 필드라도 비어 있으면 알림 표시
        this.showNotification = true;
      }
    },
    resetForm() {
      // 모든 양식 필드 재설정 및 알림 숨김
      this.selectedProblemType = '';
      this.selectedLevel = '';
      this.problemTitle = '';
      this.problemDescription = '';
      this.inputExamples = ['', '', ''];
      this.outputExamples = ['', '', ''];
      this.showNotification = false;
    }
  },
  watch: {
    // 양식 필드의 변경 사항을 감시하고 formValid 플래그를 업데이트합니다.
    selectedProblemType(newValue) {
      this.formValid = !!newValue && !!this.selectedLevel && !!this.problemTitle && !!this.problemDescription && this.inputExamples.every(example => example.trim()) && this.outputExamples.every(example => example.trim());
    },
    selectedLevel(newValue) {
      this.formValid = !!newValue && !!this.selectedProblemType && !!this.problemTitle && !!this.problemDescription && this.inputExamples.every(example => example.trim()) && this.outputExamples.every(example => example.trim());
    },
    problemTitle(newValue) {
      this.formValid = !!newValue && !!this.selectedProblemType && !!this.selectedLevel && !!this.problemDescription && this.inputExamples.every(example => example.trim()) && this.outputExamples.every(example => example.trim());
    },
    problemDescription(newValue) {
      this.formValid = !!newValue && !!this.selectedProblemType && !!this.selectedLevel && !!this.problemTitle && this.inputExamples.every(example => example.trim()) && this.outputExamples.every(example => example.trim());
    },
    inputExamples(newValue) {
      this.formValid = !!newValue.every(example => example.trim()) && !!this.selectedProblemType && !!this.selectedLevel && !!this.problemTitle && !!this.problemDescription && this.outputExamples.every(example => example.trim());
    },
    outputExamples(newValue) {
      this.formValid = !!newValue.every(example => example.trim()) && !!this.selectedProblemType && !!this.selectedLevel && !!this.problemTitle && !!this.problemDescription && this.inputExamples.every(example => example.trim());
    }
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  align-items: center; /* 수평 가운데 정렬 */
  justify-content: center; /* 수직 가운데 정렬 */
  height: 100vh; /* 화면 전체 높이를 차지하도록 설정 */
}

input[type="text"], textarea, select {
  margin: 10px 0;
  padding: 5px;
}


button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

</style>