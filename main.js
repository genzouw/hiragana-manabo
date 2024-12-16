const correctSound = new Audio("correct.mp3");
const incorrectSound = new Audio("incorrect.mp3");

const wordData = {
  あ: { word: "あり", image: "a.png", reading: "あり" },
  い: { word: "いちご", image: "i.png", reading: "いちご" },
  う: { word: "うさぎ", image: "u.png", reading: "うさぎ" },
  え: { word: "えんぴつ", image: "e.png", reading: "えんぴつ" },
  お: { word: "おにぎり", image: "o.png", reading: "おにぎり" },
  か: { word: "かめ", image: "ka.png", reading: "かめ" },
  き: { word: "きつね", image: "ki.png", reading: "きつね" },
  く: { word: "くま", image: "ku.png", reading: "くま" },
  け: { word: "ケーキ", image: "ke.png", reading: "ケーキ" },
  こ: { word: "こたつ", image: "ko.png", reading: "こたつ" },
  さ: { word: "さかな", image: "sa.png", reading: "さかな" },
  し: { word: "しまうま", image: "si.png", reading: "しまうま" },
  す: { word: "すいか", image: "su.png", reading: "すいか" },
  せ: { word: "せみ", image: "se.png", reading: "せみ" },
  そ: { word: "そら", image: "so.png", reading: "そら" },
  た: { word: "たこ", image: "ta.png", reading: "たこ" },
  ち: { word: "ちくわ", image: "ti.png", reading: "ちくわ" },
  つ: { word: "つき", image: "tu.png", reading: "つき" },
  て: { word: "てんとうむし", image: "te.png", reading: "てんとうむし" },
  と: { word: "とけい", image: "to.png", reading: "とけい" },
  な: { word: "なす", image: "na.png", reading: "なす" },
  に: { word: "にんじん", image: "ni.png", reading: "にんじん" },
  ぬ: { word: "ぬいぐるみ", image: "nu.png", reading: "ぬいぐるみ" },
  ね: { word: "ねずみ", image: "ne.png", reading: "ねずみ" },
  の: { word: "のり", image: "no.png", reading: "のり" },
  は: { word: "はな", image: "ha.png", reading: "はな" },
  ひ: { word: "ひつじ", image: "hi.png", reading: "ひつじ" },
  ふ: { word: "ふくろう", image: "hu.png", reading: "ふくろう" },
  へ: { word: "へび", image: "he.png", reading: "へび" },
  ほ: { word: "ほし", image: "ho.png", reading: "ほし" },
  ま: { word: "まくら", image: "ma.png", reading: "まくら" },
  み: { word: "みかん", image: "mi.png", reading: "みかん" },
  む: { word: "むし", image: "mu.png", reading: "むし" },
  め: { word: "めがね", image: "me.png", reading: "めがね" },
  も: { word: "もも", image: "mo.png", reading: "もも" },
  や: { word: "やさい", image: "ya.png", reading: "やさい" },
  ゆ: { word: "ゆき", image: "yu.png", reading: "ゆき" },
  よ: { word: "よる", image: "yo.png", reading: "よる" },
  ら: { word: "らいおん", image: "ra.png", reading: "らいおん" },
  り: { word: "りんご", image: "ri.png", reading: "りんご" },
  る: {
    word: "るんば",
    image: "ru.png",
    reading: "るんば",
  },
  れ: { word: "れもん", image: "re.png", reading: "れもん" },
  ろ: { word: "ろうそく", image: "ro.png", reading: "ろうそく" },
  わ: { word: "わに", image: "wa.png", reading: "わに" },
};

let totalQuestions = 10;

document.addEventListener("DOMContentLoaded", function () {
  const questionDiv = document.getElementById("question");
  const choiceButtons = document.querySelectorAll(".choice-btn");
  const startButton = document.getElementById("start-btn");
  const scoreDiv = document.getElementById("score");
  const historyDiv = document.getElementById("history");
  const wordImage = document.getElementById("word-image");
  const settingsDiv = document.getElementById("settings");

  let currentQuestion;
  let currentQuestionIndex = 0;
  let correctAnswers = 0;
  const completedQuestions = [];
  let gameHistory = [];

  function generateHiraganaQuestion() {
    console.log("start : generateHiraganaQuestion");
    let availableQuestions = Array.from(
      document.querySelectorAll('#settings input[type="checkbox"]:checked'),
    ).map((checkbox) => checkbox.value);

    if (availableQuestions.length === 0) {
      alert("少なくとも一つのひらがなを選択してください。");
      return null;
    }

    if (availableQuestions.length <= completedQuestions.length) {
      completedQuestions.length = 0;
    }

    availableQuestions = availableQuestions.filter(
      (hiragana) => !completedQuestions.includes(hiragana),
    );

    const questionKey =
      availableQuestions[Math.floor(Math.random() * availableQuestions.length)];

    completedQuestions.push(questionKey);

    return {
      hiragana: questionKey,
      word: wordData[questionKey].word,
      image: wordData[questionKey].image,
      reading: wordData[questionKey].reading,
      question: wordData[questionKey].word.replace(/^./, "■"),
    };
  }

  function displayQuestion() {
    console.log("start : displayQuestion");
    currentQuestion = generateHiraganaQuestion();
    if (currentQuestion === null) {
      return;
    }
    questionDiv.textContent = currentQuestion.question;
    wordImage.src = `images/${currentQuestion.image}`;
    wordImage.style.display = "inline";
    speakQuestion(currentQuestion.reading);
    generateChoices();
    choiceButtons.forEach((button) => {
      button.style.backgroundColor = "#f0f0f0";
      button.style.opacity = 1;
    });
  }

  function speakQuestion(questionReading) {
    console.log(questionReading);
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = questionReading;
    utterance.voice = speechSynthesis.getVoices().filter(function (n) {
      return n.name == "Google 日本語";
    })[0];
    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  }

  function generateChoices() {
    const correctAnswer = currentQuestion.hiragana;
    const choices = [correctAnswer];
    const allHiragana = Object.keys(wordData).filter(
      (key) => key !== correctAnswer,
    );

    while (choices.length < 4) {
      const randomIndex = Math.floor(Math.random() * allHiragana.length);
      const randomChoice = allHiragana[randomIndex];
      if (!choices.includes(randomChoice)) {
        choices.push(randomChoice);
      }
    }

    choices.sort(() => Math.random() - 0.5);
    choiceButtons.forEach((button, index) => {
      button.textContent = choices[index];
      button.onclick = () => checkAnswer(choices[index]);
    });
  }

  function speakAnswer(answerReading) {
    const utterance = new SpeechSynthesisUtterance();
    utterance.text = answerReading;
    utterance.voice = speechSynthesis.getVoices().filter(function (n) {
      return n.name == "Google 日本語";
    })[0];
    utterance.lang = "ja-JP";
    speechSynthesis.speak(utterance);
  }

  function checkAnswer(selectedAnswer) {
    choiceButtons.forEach((button) => {
      button.disabled = true;
    });
    const selectedButton = Array.from(choiceButtons).find(
      (button) => button.textContent == selectedAnswer,
    );
    const correctAnswer = currentQuestion.hiragana;
    const correctAnswerButton = Array.from(choiceButtons).find(
      (button) => button.textContent == correctAnswer,
    );

    correctAnswerButton.style.backgroundColor = "lightgreen";
    if (selectedAnswer === correctAnswer) {
      correctAnswers++;
      playCorrectSound();
    } else {
      selectedButton.style.backgroundColor = "pink";
      playIncorrectSound();
      speakAnswer(currentQuestion.reading);
    }

    setTimeout(() => {
      console.log("start : setTimeout");
      currentQuestionIndex++;
      updateScore();
      choiceButtons.forEach((button) => {
        button.disabled = false;
      });
      if (currentQuestionIndex < totalQuestions) {
        displayQuestion();
      } else {
        endGame();
      }
    }, 2000);
  }

  function playCorrectSound() {
    correctSound.play();
  }

  function playIncorrectSound() {
    incorrectSound.play();
  }

  function updateScore() {
    scoreDiv.textContent = `${currentQuestionIndex + 1} 問目`;
  }

  function endGame() {
    const gameResult = {
      correctAnswers: correctAnswers,
      totalQuestions: totalQuestions,
      date: new Date().toLocaleString(),
      questions: gameHistory.map((history) => history.question),
    };

    gameHistory.push(gameResult);
    localStorage.setItem("hiraganaGameHistory", JSON.stringify(gameHistory));
    displayHistory();
    questionDiv.textContent = `正解数は ${correctAnswers} でした！`;
    wordImage.style.display = "none";
    choiceButtons.forEach((button) => (button.style.display = "none"));
    startButton.style.display = "inline-block";
  }

  function loadHistory() {
    const storedHistory = localStorage.getItem("hiraganaGameHistory");
    if (storedHistory) {
      gameHistory = JSON.parse(storedHistory);
    }
  }

  function displayHistory() {
    // 一度領域をすべてクリアする
    historyDiv.innerHTML = "";
    const filteredHistory = gameHistory
      .filter((result) => result.date !== undefined)
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    filteredHistory.forEach((result) => {
      console.log(result.date);
      const historyItem = document.createElement("p");
      historyItem.textContent = `${result.date} 正解数: ${result.correctAnswers}/${result.totalQuestions} ${result.correctAnswers === result.totalQuestions ? "🥇" : result.correctAnswers === result.totalQuestions - 1 ? "🥈" : ""}`;
      historyDiv.appendChild(historyItem);
    });
  }

  startButton.addEventListener("click", function () {
    currentQuestionIndex = 0;
    correctAnswers = 0;
    startButton.style.display = "none";
    choiceButtons.forEach((button) => (button.style.display = "inline-block"));
    displayQuestion();
    updateScore();
  });

  loadSettings();
  loadHistory();
  displayHistory();
  document
    .querySelectorAll('#settings input[type="checkbox"]')
    .forEach((checkbox) => {
      checkbox.addEventListener("change", saveSettings);
    });
  document
    .getElementById("questionCount")
    .addEventListener("change", saveSettings);
});

function loadSettings() {
  const storedHiragana = localStorage.getItem("selectedHiragana");
  if (storedHiragana) {
    const selectedHiragana = JSON.parse(storedHiragana);
    document
      .querySelectorAll('#settings input[type="checkbox"]')
      .forEach((checkbox) => {
        checkbox.checked = selectedHiragana.includes(checkbox.value);
      });
  }

  const storedQuestionCount = localStorage.getItem("hiraganaQuestionCount");
  if (storedQuestionCount) {
    document.getElementById("questionCount").value = storedQuestionCount;
    totalQuestions = parseInt(storedQuestionCount);
  }
}

function saveSettings() {
  const selectedHiragana = Array.from(
    document.querySelectorAll('#settings input[type="checkbox"]:checked'),
  ).map((checkbox) => checkbox.value);
  localStorage.setItem("selectedHiragana", JSON.stringify(selectedHiragana));

  const questionCount = document.getElementById("questionCount").value;
  localStorage.setItem("hiraganaQuestionCount", questionCount);
  totalQuestions = parseInt(questionCount);
}
