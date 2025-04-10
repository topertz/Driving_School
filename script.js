const quizContainer = document.getElementById("quiz-container");
const resultContainer = document.getElementById("result");
const correctAnswersContainer = document.getElementById("correct-answers");
const submitButton = document.getElementById("submit");
const showAnswersButton = document.getElementById("show-answers");
const generateQuestionsButton = document.getElementById("generateQuestions");
const usernameInput = document.getElementById("username");
const restartButton = document.getElementById("restart");
const loginButton = document.getElementById("loginButton");
const helpButton = document.getElementById("helpButton");
const timer = document.getElementById("timer");
const scoreButton = document.getElementById("scoreButton");
const backButton = document.getElementById("backButton"); 
const clearButton = document.getElementById("clearScores");
const file = document.getElementById("file-input");
const loadButton = document.getElementById("loadButton");
const spacer = document.createElement("div");
const originalBackground = timer.style.background;
let timeLeft = 300;
let startTime = Date.now();
let timerInterval;
let mistakeTracker = {};
let selectedQuestions = [];
let shuffledQuestions = [];
let categories = [];
let questions = [];
let isHelpVisible = false;
let answersVisible = false;
let questionsLoaded = false;
let questionsUploaded = false;
let categoriesLoaded = false;
let screenRefreshed = false;


  $(document).ready(function () {
    let screenRefreshed = false;
    let questions = [];
    let categories = [];
    let questionsLoaded = false;
    let questionsUploaded = false;

    function loadQuestionsFromLocalStorage() {
        const storedQuestions = localStorage.getItem("questions");
        if (storedQuestions) {
            questions = JSON.parse(storedQuestions);
            questionsLoaded = true;
            questionsUploaded = questions.length >= 27;
        } else {
            saveQuestionsToLocalStorage();
        }
    }

    function saveQuestionsToLocalStorage() {
        localStorage.setItem("questions", JSON.stringify(questions));
    }

    function refreshUI() {
        setTimeout(() => {
            location.reload();
        }, 500);
    }

    loadQuestionsFromLocalStorage();

    const storedCategories = localStorage.getItem("categories");
    if (!storedCategories || storedCategories.length === 0) {
        categories = ["Minden", "Paragrafusok", "Táblák", "Szituációk", "Alapfogalmak"];
    } else {
        categories = JSON.parse(storedCategories);
    }

    const categoryDropdown = document.getElementById("help-category");
    categoryDropdown.innerHTML = "";
    categories.forEach(category => {
        const option = document.createElement("option");
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });

    document.getElementById("help-container").style.display = "none";

    document.getElementById("help-category").addEventListener("change", function () {
        showHelp(false);
    });

    document.getElementById("help-button").addEventListener("click", function () {
        showHelp(true);
    });

  document.getElementById("startQuizButton").addEventListener("click", () => {
    let selectedCategory = document.getElementById("quiz-category").value;
    
    let filteredQuestions = questions.filter(q => selectedCategory === "Minden" || q.category === selectedCategory);
    
    if (usernameInput.value.trim() === "") {
        alert("Kérlek, add meg a neved!");
        console.warn("⚠ Nincs megadva felhasználónév!");
        return;
    }

    if (filteredQuestions.length === 0) {
        alert("Nincsenek elérhető kérdések ebben a kategóriában!");
        return;
    }
  startQuiz(filteredQuestions);
});

function startQuiz(filteredQuestions) {
    selectedQuestions = filteredQuestions;
    document.getElementById("quiz-category-container").style.display = "none";
    usernameInput.style.display = "none";
    $("#timer").css("display", "block");
    $("#scoreButton").css("display", "none");
    $("#help-button").css("display", "none");
    $("#backButton").css("display", "block");
    $("#clearScores").css("display", "none");
    loadQuiz(filteredQuestions);
}

    spacer.style.height = timer.offsetHeight + "px";
    timer.parentNode.insertBefore(spacer, timer);

    window.addEventListener("scroll", function () {
        if (window.scrollY > spacer.offsetTop) {
            timer.style.position = "fixed";
            timer.style.top = "10px";
            timer.style.right = "100px";
            timer.style.left = "auto";
            timer.style.transform = "none";
            timer.style.zIndex = "1000";
            timer.style.background = "white";
            timer.style.padding = "10px";
            timer.style.boxShadow = "0px 2px 10px rgba(0,0,0,0.2)";
        } else {
            timer.style.position = "static";
            timer.style.boxShadow = "none";
        }
    });
});

window.onload = function() {
  loadQuestionsFromURL();
};

function loadQuestionsFromURL() {
  const fileUrl = "https://topertz.github.io/Driving_School/questions.json";
  fetch(fileUrl)
    .then(response => response.json())
    .then(data => {
      questions = data;
      localStorage.setItem("questions", JSON.stringify(questions));
      questionsUploaded = questions.length >= 27;
      const alertShownSession = sessionStorage.getItem("alertShown");
      if(!alertShownSession) {
        alert("A kérdések sikeresen betöltődtek!");
        sessionStorage.setItem("alertShown", "true");
      }
      $("#file-input").hide();
      $("#loadButton").hide();
    })
    .catch(error => {
      console.error("Hiba a fájl letöltése közben:", error);
    });
}

function BackToHomePage() {
    window.location.href = "index.html";
}

function startTimer() {
    clearInterval(timerInterval);
    updateTimerDisplay();

    timerInterval = setInterval(() => {
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            alert("Lejárt az idő! A teszt automatikusan kiértékelődik.");
            checkAnswers();
            return;
        }

        timeLeft--;
        updateTimerDisplay();
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById("timer").textContent = `Idő: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomQuestions(allQuestions, count, targetPoints) {
  if (!allQuestions || allQuestions.length === 0) {
      console.error("Hiba: Az allQuestions tömb üres vagy nincs megfelelően inicializálva!");
      return [];
  }

  let categories = [...new Set(allQuestions.map(q => q.category))];
  let selectedQuestions = [];
  let remainingQuestions = [...allQuestions];
  let currentPoints = 0;

  categories.forEach(category => {
      let categoryQuestions = remainingQuestions.filter(q => q.category === category);
      if (categoryQuestions.length > 0) {
          shuffleArray(categoryQuestions);
          let selected = categoryQuestions[0];
          selectedQuestions.push(selected);
          remainingQuestions = remainingQuestions.filter(q => q !== selected);
          currentPoints += selected.points;
      }
  });

  while (selectedQuestions.length < count && remainingQuestions.length > 0) {
      shuffleArray(remainingQuestions);
      let selected = remainingQuestions[0];

      if (currentPoints + selected.points <= targetPoints) {
          selectedQuestions.push(selected);
          currentPoints += selected.points;
      }
      remainingQuestions.shift();
  }
  return selectedQuestions;
}

function loadQuiz(selectedQuestions) {
  if (!selectedQuestions || selectedQuestions.length === 0) {
    console.error("Hiba: A selectedQuestions tömb üres vagy nincs megfelelően betöltve!");
    return;
  }

  quizContainer.innerHTML = "";
  mistakeTracker = {};

  shuffledQuestions = getRandomQuestions(selectedQuestions, 27, 55);

  if (shuffledQuestions.length === 0) {
    console.error("Hiba: Nem sikerült kérdéseket kiválasztani!");
    return;
  }

  shuffledQuestions.forEach((q, index) => {
    if (!q) {
      console.error('⚠ Hiba: Undefined kérdés a shuffledQuestions listában!', index);
      return;
    }

    const questionElem = document.createElement("div");
    questionElem.classList.add("question-block");
    questionElem.setAttribute("data-index", index);

    questionElem.style.border = "2px solid #ccc";
    questionElem.style.padding = "15px";
    questionElem.style.margin = "10px 0";
    questionElem.style.borderRadius = "10px";
    questionElem.style.backgroundColor = "#f9f9f9";
    questionElem.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";

    let questionText = `${index + 1}. ${q.question}`;
    questionText = questionText.replace(/\[\d+ pont\]/g, ''); 
    questionText += ` [${q.points} pont]`;

    if (q.image) {
      questionText += `<br><img src="images/${q.image}" alt="Kép a kérdéshez" class="question-image" style="margin-top: 10px;">`;
    }

    questionElem.innerHTML = `<p>${questionText}</p>`;

    let optionLabels = ['A', 'B', 'C'];

    q.options.forEach((option, i) => {
      const optionContainer = document.createElement("div");
      optionContainer.classList.add("option");

      const inputElem = document.createElement("input");
      inputElem.type = "radio";
      inputElem.name = `question_${index}`;
      inputElem.value = i;
      inputElem.id = `question_${index}_option_${i}`;
      inputElem.setAttribute("data-index", index);

      const labelElem = document.createElement("label");
      labelElem.textContent = `${optionLabels[i]}. ${option}`;
      labelElem.setAttribute("for", inputElem.id);

      optionContainer.appendChild(inputElem);
      optionContainer.appendChild(labelElem);
      questionElem.appendChild(optionContainer);
    });

    quizContainer.appendChild(questionElem);
  });

  quizContainer.style.display = "block";
  submitButton.style.display = "inline-block";
  showAnswersButton.style.display = "inline-block";
  restartButton.style.display = "inline-block";
  backButton.style.display = "inline-block";

  timeLeft = 300;
  updateTimerDisplay();
  startTimer();
}

function saveScore(username, score, totalPoints, percentage, category) {
  let endTime = Date.now();
  let actualDuration = 300 - timeLeft;
  let duration = Math.floor((endTime - startTime) / 1000);
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push({
      username: username,
      score: score,
      totalPoints: totalPoints,
      percentage: percentage,
      category: category,
      timestamp: endTime,
      duration: actualDuration
  });

  localStorage.setItem("scores", JSON.stringify(scores));
}

function clearScores() {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  
  if (scores.length === 0) {
      alert("Nincs törölhető eredmény.");
      return;
  }

  if (confirm("Biztosan törölni szeretnéd az összes eredményt?")) {
      localStorage.removeItem("scores");
      $("#scoreContainer").empty().show();
      $("#scoreButton").text("Eredmények kilistázása");
      alert("Az összes eredmény törölve lett!");
  }
}

function deleteSingleScore(timestamp) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  timestamp = Number(timestamp);

  if (!confirm("Biztosan törölni szeretnéd ezt az eredményt?")) {
      return;
  }

  scores = scores.filter(score => Number(score.timestamp) !== timestamp);

  localStorage.setItem("scores", JSON.stringify(scores));

  $(`.score-item[data-timestamp="${timestamp}"]`).remove();

  if (scores.length === 0) {
      $("#scoreContainer").html("<p>Nincs elérhető adat.</p>");
      $("#scoreButton").text("Eredmények kilistázása");
  }
}

$(document).off("click", ".delete-score").on("click", ".delete-score", function() {
  let timestamp = $(this).closest(".score-item").data("timestamp");
  deleteSingleScore(timestamp);
});

function listScore() {
  let scoreContainer = $("#scoreContainer");
  let scoreButton = $("#scoreButton");
  let scoreFilterContainer = $("#score-filter-container");
  let selectedCategory = $("#score-category").val();

  $("#maintitle").hide();
  $("#username").hide();
  $("#secondarytitle").hide();
  $("#quiz-category").hide();
  $("#startQuizButton").hide();
  $("#help-button").hide();
  $("#backButton").show();

  scoreFilterContainer.show();

  if (scoreContainer.is(":visible")) {
    scoreContainer.hide();
    scoreButton.text("Eredmények kilistázása");
    return;
  }

  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  scores.sort((a, b) => b.score - a.score);

  if (selectedCategory !== "") {
    scores = scores.filter(score => score.category === selectedCategory);
  }

  if (scores.length > 0) {
    let scoresHtml = "";
    scores.forEach(score => {
      let percentage = ((score.score / score.totalPoints) * 100).toFixed(2);
      let timestamp = score.timestamp
        ? new Date(score.timestamp).toLocaleString("hu-HU", {
            year: "numeric",
            month: "long",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          }).replace(/(\s)(\d{2})\.(\d{2})\./, "$1$2$3")
        : "N/A";

      let duration = score.duration || 0;
      let minutes = Math.floor(duration / 60);
      let seconds = duration % 60;
      let formattedDuration = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;

      scoresHtml += `
        <div class="score-item" data-timestamp="${score.timestamp}" style="
            border: 2px solid #3498db;
            background-color: #ecf0f1;
            padding: 15px;
            margin: 10px 0;
            border-radius: 10px;
            box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);
            position: relative;
        ">
          <p><strong>Felhasználónév:</strong> ${score.username}</p>
          <p><strong>Pontszám:</strong> ${score.score}</p>
          <p><strong>Összpont:</strong> ${score.totalPoints}</p>
          <p><strong>Százalék:</strong> ${percentage}%</p>
          <p><strong>Kategória:</strong> ${score.category}</p>
          <p><strong>Időbélyeg:</strong> ${timestamp}</p>
          <p><strong>Teljesítési idő</strong> ${formattedDuration}</p>
          <button class="delete-score" style="
              background-color: #e74c3c;
              color: white;
              border: none;
              padding: 8px 12px;
              border-radius: 5px;
              cursor: pointer;
              position: absolute;
              top: 10px;
              right: 10px;
          ">Törlés</button>
        </div>
      `;
    });
    scoreContainer.html(scoresHtml).show();
    scoreButton.text("Eredmények elrejtése");
  } else {
    scoreContainer.html("<p>Nincs elérhető adat a kiválasztott kategóriában.</p>").show();
    scoreButton.text("Eredmények elrejtése");
  }
}

function checkAnswers() {
  if (resultContainer.style.display === "block") {
    resultContainer.style.display = "none";
  } else {
    resultContainer.style.display = "block";
  }

  if (timeLeft > 0 && !confirm("Biztosan be akarod fejezni a tesztet?")) {
    return;
  }

  let score = 0;
  let totalPoints = 55;
  mistakeTracker = {};
  let unanswered = false;

  const selectedCategory = $("#quiz-category").val();

  /*totalPoints = selectedCategory === "Szituációk" ? 12 :
                selectedCategory === "Táblák" ? 16 :
                selectedCategory === "Paragrafusok" ? 27 : 55;*/

  if (!selectedQuestions || selectedQuestions.length === 0) {
    console.error("❌ Hiba: A selectedQuestions tömb üres vagy nincs megfelelően inicializálva!");
    return;
  }

  $("input[type='radio']:checked").each(function() {
    let questionIndex = $(this).data("index");

    if (questionIndex === undefined) {
      console.error("❌ Hiba: Az input elemnek nincs 'data-index' attribútuma!");
      return;
    }

    if (questionIndex >= shuffledQuestions.length) {
      console.error(`❌ Hiba: A questionIndex (${questionIndex}) túl nagy! A tömb hossza: ${shuffledQuestions.length}`);
      return;
    }

    let q = shuffledQuestions[questionIndex];
    let selectedOption = $(this).val();
    const optionsContainer = $(`input[name='question_${questionIndex}']`).parent();

    if (!q) {
      console.error(`❌ Hiba: A kérdés undefined (index: ${questionIndex})`);
      return;
    }

    if (selectedOption !== undefined) {
      optionsContainer.css("border", "");
      const selectedAnswer = q.options[selectedOption];

      if (selectedAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
        score += q.points;
      } else {
        mistakeTracker[q.category] = (mistakeTracker[q.category] || 0) + 1;
      }
    } else {
      optionsContainer.css("border", "2px solid red");
      mistakeTracker[q.category] = (mistakeTracker[q.category] || 0) + 1;
      unanswered = true;
    }
});

  if (unanswered && !confirm("Nem válaszoltál minden kérdésre. Biztosan ki akarod értékelni és menteni az eredményt?")) {
    return;
  }

  clearInterval(timerInterval);

  let percentage = ((score / totalPoints) * 100).toFixed(2);
  let message = percentage >= 60 ? `Gratulálok, sikerült a ${selectedCategory} teszt!` : "Sajnálom, nem sikerült! Próbáld meg újra.";

  const previousStatus = localStorage.getItem("userTestStatus");
  if (percentage < 60) {
    localStorage.setItem("userTestStatus", "incomplete");
  } else {
    localStorage.setItem("userTestStatus", "completed");
  }
  let filteredQuestions = questions.filter(q => selectedCategory === "Minden" || q.category === selectedCategory);
  let questionCount = filteredQuestions.length;
  if (previousStatus === "incomplete") {
    let totalPoints = 0;
    let halfPointsQuestions = [];
    for (let i = 0; i < filteredQuestions.length; i++) {
      totalPoints += filteredQuestions[i].points;
      halfPointsQuestions.push(filteredQuestions[i]);
      if (totalPoints >= 55 / 2) {
        break;
      }
    }
    questionCount = halfPointsQuestions.length;
  }
  shuffledQuestions = getRandomQuestions(filteredQuestions, questionCount, 55);
  localStorage.setItem("userTestStatus", "incomplete");

  resultContainer.innerHTML = `Eredmény: ${score} / ${totalPoints} pont (${percentage}%) <br> ${message}`;
  resultContainer.style.display = "block";

  let username = $("#username").val().trim();
  if (username) {
    saveScore(username, score, totalPoints, percentage, selectedCategory);
  } else {
    console.warn("⚠ A pontszám mentése sikertelen: nincs megadva felhasználónév.");
  }
}

function toggleCorrectAnswers() {
    if (answersVisible) {
        hideAnswers();
        showAnswersButton.textContent = "Helyes Válaszok";
    } else {
        showCorrectAnswers();
        showAnswersButton.textContent = "Elrejtés";
    }
    answersVisible = !answersVisible;
}

function showCorrectAnswers() {
    markAnswersInQuiz(true);
    clearInterval(timerInterval);
}

function clearSelections() {
    selectedQuestions.forEach((q, index) => {
        let selectedOption = document.querySelector(`input[name='question_${index}']:checked`);
        if (selectedOption) {
            selectedOption.checked = false;
        }
    });
}

function hideAnswers() {
    markAnswersInQuiz(false);
    clearSelections();
}

function markAnswersInQuiz(show) {
    shuffledQuestions.forEach((q, index) => {
        const correctIndex = q.options.indexOf(q.answer);
        const selectedOption = document.querySelector(`input[name='question_${index}']:checked`);
        let selectedValue = selectedOption ? parseInt(selectedOption.value) : null;

        q.options.forEach((option, i) => {
            let optionInput = document.querySelector(`input[name='question_${index}'][value='${i}']`);
            let optionLabel = document.querySelector(`label[for='${optionInput.id}']`);

            if (show) {
                let symbol = "";
                if (i === correctIndex) {
                    symbol = " ✔";
                    optionLabel.style.color = "green";
                }
                if (selectedValue !== null && i === selectedValue && i !== correctIndex) {
                    symbol = " ❌";
                    optionLabel.style.color = "red";
                }
                optionLabel.textContent = option + symbol;
                optionInput.disabled = true;
            } else {
                optionLabel.textContent = option;
                optionLabel.style.color = "";
                optionInput.disabled = false;
            }
        });
    });
}

function toggleHelpDetail(id) {
  const element = document.getElementById(id);
  if (element.style.display === "none") {
      element.style.display = "block";
  } else {
      element.style.display = "none";
  }
}

function showHelp(fromButton = false) {
  const categorySelect = document.getElementById("help-category");
  const category = categorySelect.value;
  const helpContent = document.getElementById("help-content");
  const helpContainer = document.getElementById("help-container");
  const helpButton = document.getElementById("help-button");

  if (fromButton) {
      if (helpContainer.style.display === "block") {
          helpContainer.style.display = "none";
          helpButton.textContent = "Segítség megjelenítése";
          categorySelect.selectedIndex = 0;
          return;
      } else {
          helpContainer.style.display = "block";
          helpButton.textContent = "Segítség elrejtése";
      }
  }

  const filteredQuestions = category === "Minden"
      ? questions
      : questions.filter(q => (q.Category || q.category || "").trim().toLowerCase() === category.trim().toLowerCase());

  helpContent.innerHTML = "";

  if (category === "Alapfogalmak") {
    helpContent.innerHTML = `
        <div style="background-color: #fffbe6; padding: 15px; border: 1px solid #ffe58f; border-radius: 10px; margin-top: 10px;">
            <h3>🚗 Alapfogalmak</h3>
            <ul style="list-style: none; padding-left: 0;">
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('jobbbkez')">
                    <strong>Jobbkéz-szabály</strong>
                    <p id="jobbbkez" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        Olyan útkereszteződésben, ahol sem közúti jelzések, sem forgalomirányító fényjelző készülék, sem rendőr nem szabályozza az áthaladást,
                        az elsőbbséget a jobb kéz felől érkező jármű részére kell biztosítani. Ez az ún. „alapértelmezett” elsőbbségi szabály.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('rendor')">
                    <strong>Rendőr irányítása</strong>
                    <p id="rendor" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        Forgalmat irányító rendőr jelzései elsőbbséget élveznek minden más forgalmi irányító eszközzel (táblák, lámpák) szemben.
                        A rendőr testtartása alapján: ha szemből vagy hátulról látható, akkor az adott irányból érkezők megállási kötelezettséggel bírnak (tilos az áthaladás).
                        Ha oldalról látható, az adott irányból érkezők szabadon áthaladhatnak. Kézmozdulatai kiegészíthetik vagy felülírhatják ezt – például ha kinyújtott kézzel irányt mutat vagy megállásra szólít fel.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('fouton')">
                    <strong>Elsőbbség főúton</strong>
                    <p id="fouton" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        A főútvonalon közlekedő járművek elsőbbséget élveznek az arról letérő vagy oda becsatlakozó mellékutakról érkezőkkel szemben.
                        A főútvonalat sárga színű rombusz alakú tábla jelzi, amely az elsőbbség viszonyait egyértelműsíti.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('stop')">
                    <strong>Stop tábla</strong>
                    <p id="stop" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        A „STOP” feliratú nyolcszög alakú tábla teljes, tényleges megállást ír elő – még abban az esetben is, ha a kereszteződés látszólag szabad.
                        A járműnek a tábla vagy útburkolati jel vonalában meg kell állnia, és csak a forgalmi viszonyok felmérése után haladhat tovább.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('korforg')">
                    <strong>Körforgalom</strong>
                    <p id="korforg" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        Körforgalomba történő behajtás előtt elsőbbséget kell adni a körforgalomban már bent lévő járművek részére,
                        amennyiben ezt "Elsőbbségadás kötelező" tábla is jelzi. A körforgalomban haladók mindig elsőbbséget élveznek.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('gyorshajt')">
                    <strong>Gyorshajtás</strong>
                    <p id="gyorshajt" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        A megengedett legnagyobb sebesség túllépése (gyorshajtás) szigorúan tilos, még akkor is, ha a forgalom ténylegesen ennél gyorsabb tempóban halad.
                        A sebességhatárokat a táblák, valamint a lakott terület jellege határozza meg – azok túllépése szabálysértésnek minősül.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('villamos')">
                    <strong>Villamos elsőbbsége</strong>
                    <p id="villamos" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        A villamos – különösen útkereszteződésben – elsőbbséget élvez más járművekkel szemben, még akkor is, ha jobbról érkezik másik jármű.
                        Kivételt képez, ha a jelzések (pl. elsőbbségadás tábla, rendőr, lámpa) ettől eltérő elsőbbségi viszonyt határoznak meg.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('utszuk')">
                    <strong>Útszűkület</strong>
                    <p id="utszuk" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        Szűk útszakasz esetén – ahol két jármű nem fér el egymás mellett – a táblák határozzák meg, hogy melyik irányból érkezőknek van elsőbbsége.
                        Ha nincs jelzés, akkor az a jármű élvez elsőbbséget, amelynek irányából az akadály nem található az út jobb szélén.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('felvaltott')">
                    <strong>Felváltott haladás (zipzár-elv)</strong>
                    <p id="felvaltott" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        A „zipzár-elv” értelmében szűkülő útszakaszon a járművek felváltva, egymást beengedve haladnak tovább.
                        A szabály célja a forgalom folyamatosságának biztosítása, és a torlódások csökkentése – különösen sávbeszűkülés esetén.
                    </p>
                </li>
                <li style="cursor: pointer; margin: 10px 0; padding: 10px; background-color: #fff; border-radius: 5px; box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);" onclick="toggleHelpDetail('gyalogos')">
                    <strong>Gyalogos átkelőhely</strong>
                    <p id="gyalogos" style="display: none; margin-top: 5px; padding: 5px; background-color: #e6f7ff; border-radius: 5px; box-shadow: 0px 0px 5px rgba(0, 0, 0, 0.1);">
                        Kijelölt gyalogos-átkelőhelynél a gyalogos részére elsőbbséget kell biztosítani, ha az áthaladási szándék egyértelmű.
                        A járművezetőnek csökkentenie kell a sebességét, és szükség esetén meg is kell állnia az elsőbbség megadásához.
                    </p>
                </li>
            </ul>
        </div>
    `;
    helpContainer.style.display = "block";
    return;
}

  if (filteredQuestions.length === 0) {
      helpContent.innerHTML = "<p>Nincs elérhető kérdés ebben a kategóriában.</p>";
  } else {
      filteredQuestions.forEach(item => {
          const questionText = item.question || item.question || "N/A";
          const answer = item.Answer || item.answer || "N/A";
          const imagePath = item.Image || item.image || "";
          const itemCategory = (item.Category || item.category || "").trim().toLowerCase();

          const questionContainer = document.createElement("div");
          questionContainer.classList.add("question-block");

          questionContainer.style.border = "2px solid #ccc";
          questionContainer.style.padding = "15px";
          questionContainer.style.margin = "10px 0";
          questionContainer.style.borderRadius = "10px";
          questionContainer.style.backgroundColor = "#f9f9f9";
          questionContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";

          const question = document.createElement("p");
          question.innerHTML = `<strong>Kérdés:</strong> ${questionText}`;
          question.style.margin = "0";
          question.style.padding = "5px";

          let image = null;
          if (imagePath.trim() !== "") {
              image = document.createElement("img");
              image.src = `images/${imagePath}`;
              image.alt = "Kép a kérdéshez";
              image.style.maxWidth = "100%";
              image.style.height = "auto";
              image.style.margin = "10px 0";
              image.style.borderRadius = "5px";
              image.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.2)";
          }

          const answerElement = document.createElement("p");
          answerElement.innerHTML = `<strong>Válasz:</strong> ${answer}`;
          answerElement.style.display = "none";
          answerElement.style.marginTop = "5px";
          answerElement.style.padding = "10px";
          answerElement.style.background = "#e6f7ff";
          answerElement.style.borderLeft = "4px solid #007bff";
          answerElement.style.borderRadius = "5px";
          answerElement.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.1)";
          answerElement.style.cursor = "default";

          if (itemCategory === "táblák" || itemCategory === "szituációk") {
              if (image) {
                  image.style.cursor = "pointer";
                  image.addEventListener("click", function () {
                      answerElement.style.display = answerElement.style.display === "none" ? "block" : "none";
                  });
              }
          }
          else if (itemCategory === "paragrafusok") {
              questionContainer.style.cursor = "pointer";
              questionContainer.addEventListener("click", function (event) {
                  if (!answerElement.contains(event.target)) {
                      answerElement.style.display = answerElement.style.display === "none" ? "block" : "none";
                  }
              });
          }

          questionContainer.appendChild(question);
          if (image) questionContainer.appendChild(image);
          questionContainer.appendChild(answerElement);
          helpContent.appendChild(questionContainer);
      });
  }
  helpContainer.style.display = "block";
}

function smoothScrollToTop() {
    const startPosition = window.scrollY;
    const duration = 600;
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress);

        window.scrollTo(0, startPosition * (1 - easeOutQuad));

        if (elapsedTime < duration) {
            requestAnimationFrame(scrollStep);
        }
    }

    requestAnimationFrame(scrollStep);
}

function restartQuiz() {
  quizContainer.innerHTML = "";
  resultContainer.innerHTML = "";
  correctAnswersContainer.innerHTML = "";

  let categorySelect = document.getElementById("quiz-category");
  if (!categorySelect) {
    console.warn("⚠ Hiba: A kérdéskategória kiválasztó ('quiz-category') nem található!");
    return;
  }
  loadQuiz(shuffledQuestions);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

submitButton.addEventListener("click", checkAnswers);
showAnswersButton.addEventListener("click", showCorrectAnswers);
restartButton.addEventListener("click", restartQuiz);
showAnswersButton.addEventListener("click", toggleCorrectAnswers);
clearButton.addEventListener("click", clearScores);