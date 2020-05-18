import {
  alert as answerAlert,
  baseUrl,
  examTypes,
  examYears,
  manipulateAlert,
  postFormData,
  get
} from './utils/index.js';

const answerSubject = document.querySelector('#answer-subject');
const answerExamType = document.querySelector('#answer-exam-type');
const answerExamYear = document.querySelector('#answer-exam-year');
const answerAnswers = document.querySelector('#answer-answers');
const answerExamNumber = document.querySelector('#answer-exam-number');
const answerPhoto = document.querySelector('#answer-photo');
const submitAnswer = document.querySelector('#submit-answer');
const submitAnswerSpannerBtn = document.querySelector('#submit-answer-spanner-btn');
const submitAnswerAlert = document.querySelector('#submit-answer-alert');
const answerForm = document.querySelector('#answer-form');
const answerSubjectValue = document.querySelector('#answer-subject-value');

window.addEventListener('DOMContentLoaded', loadNecessaryData);
submitAnswer.addEventListener('click', async () => {
  submitAnswerSpannerBtn.classList.remove('d-none');

  const formData = new FormData();
  formData.append('photo', answerPhoto.files[0]);
  formData.append('answer', answerAnswers.value);
  formData.append('answerNumber', answerExamNumber.value);
  formData.append('subject', answerSubjectValue.value);
  formData.append('examType', answerExamType.value);
  formData.append('examYear', answerExamYear.value);

  try {
    const response = await postAnswer(formData);
    console.log('response:', response);
    if (response.error) {
      throw new Error(response.error.message);
    }

    submitAnswerSpannerBtn.classList.add('d-none');
    answerForm.classList.add('d-none');

    submitAnswerAlert.classList.add('d-none', 'alert-success');
    submitAnswerAlert.innerHTML = answerAlert('Success', 'Answer successfully posted.');
    submitAnswerAlert.classList.remove('d-none');
    manipulateAlert(submitAnswerAlert, answerForm);
  } catch (e) {
    submitAnswerSpannerBtn.classList.add('d-none');

    submitAnswerAlert.classList.remove('d-none', 'alert-success');
    submitAnswerAlert.classList.add('alert-primary');
    submitAnswerAlert.innerHTML = answerAlert('Error', e.message);
    manipulateAlert(submitAnswerAlert, answerForm);
  }
});

async function loadNecessaryData() {
  loadExamYear();
  loadExamType();
  await loadSubjects();
}

function loadExamYear() {
  answerExamYear.innerHTML = examYears();
}

function loadExamType() {
  answerExamType.innerHTML = examTypes();
}

async function loadSubjects() {
  const url = `${baseUrl}/subjects`;
  try {
    const subjects = await get(url);

    if (subjects.error) {
      throw new Error(subjects.error.message);
    }

    let subjectElements = '';

    subjects.data.map(subject => {
      subjectElements += `
          <option value="${subject.subject}">${subject.subject}</option>
      `;
    });

    answerSubject.innerHTML = subjectElements;
  } catch (e) {
    console.log(e.message);
  }
}

async function postAnswer(answer = {}) {
  const url = `${baseUrl}/answers`;
  return await postFormData(url, answer);
}
