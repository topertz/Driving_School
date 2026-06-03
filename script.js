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
    let helpContent = [];

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

    function loadHelpContentFromLocalStorage() {
      const storedHelpContent = localStorage.getItem("helpContent");
      if (storedHelpContent) {
        helpContent = JSON.parse(storedHelpContent);
      } else {
        saveHelpContentToLocalStorage();
      }
    }

    function saveHelpContentToLocalStorage() {
      localStorage.setItem("helpContent", JSON.stringify(helpContent));
  }

    function refreshUI() {
        setTimeout(() => {
            location.reload();
        }, 500);
    }

    loadQuestionsFromLocalStorage();
    loadHelpContentFromLocalStorage();

    const storedCategories = localStorage.getItem("categories");
    if (!storedCategories || storedCategories.length === 0) {
        categories = ["All", "Paragraphs", "Signs", "Situations", "Basic concepts"];
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

    window.onload = async function() {
      await loadQuestionsFromURL();
      loadHelpContentFromURL();
      
      document.getElementById("startQuizButton").disabled = false;
    
      document.getElementById("startQuizButton").addEventListener("click", () => {
        const selectedCategory = document.getElementById("quiz-category").value;
        const filteredQuestions = questions.filter(q => selectedCategory === "All" || q.category === selectedCategory);
    
        if (usernameInput.value.trim() === "") {
            alert("Please give me your name!");
            console.warn("⚠ No username provided!");
            return;
        }
    
        if (filteredQuestions.length === 0) {
            alert("There are no questions available in this category!");
            return;
        }
    
        startQuiz(filteredQuestions);
      });
    };

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

async function loadQuestionsFromURL() {
  const fileUrl = "https://topertz.github.io/Driving_School/questions.json";
  try {
    const response = await fetch(fileUrl);
    const data = await response.json();
    questions = data;
    localStorage.setItem("questions", JSON.stringify(questions));
    questionsUploaded = questions.length >= 27;

    const alertShownSession = sessionStorage.getItem("alertShown");
    if (!alertShownSession) {
      alert("The questions have been successfully loaded!");
      sessionStorage.setItem("alertShown", "true");
    }

    $("#file-input").hide();
    $("#loadButton").hide();
  } catch (error) {
    console.error("Hiba a fájl letöltése közben:", error);
  }
}

function loadHelpContentFromURL() {
  const fileUrl = "https://topertz.github.io/Driving_School/helpContent.json";
  fetch(fileUrl)
    .then(response => response.json())
    .then(data => {
      helpContent = data;
      localStorage.setItem("helpContent", JSON.stringify(helpContent));
      questionsUploaded = questions.length >= 27;
      const alertShownSession = sessionStorage.getItem("alertShown");
      if(!alertShownSession) {
        alert("The questions have been successfully loaded!");
        sessionStorage.setItem("alertShown", "true");
      }
      $("#file-input").hide();
      $("#loadButton").hide();
    })
    .catch(error => {
      console.error("Error downloading file:", error);
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
            alert("Time is up! The test will be automatically evaluated.");
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
    document.getElementById("timer").textContent = `Time: ${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
  }
}

function getRandomQuestions(allQuestions, count, targetPoints) {
  if (!allQuestions || allQuestions.length === 0) {
      console.error("Error: The allQuestions array is empty or not properly initialized!");
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
    console.error("Error: The selectedQuestions array is empty or not loaded properly!");
    return;
  }

  quizContainer.innerHTML = "";
  mistakeTracker = {};

  shuffledQuestions = getRandomQuestions(selectedQuestions, 27, 55);

  if (shuffledQuestions.length === 0) {
    console.error("Error: Unable to select questions!");
    return;
  }

  shuffledQuestions.forEach((q, index) => {
    if (!q) {
      console.error("⚠ Error: Undefined question in the shuffledQuestions list!", index);
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
    questionText = questionText.replace(/\[\d+ score\]/g, ""); 
    questionText += ` [${q.points} score]`;

    if (q.image) {
      questionText += `<br><img src="images/${q.image}" alt="Image for the question" class="question-image" style="margin-top: 10px;">`;
    }

    questionElem.innerHTML = `<p>${questionText}</p>`;

    let optionLabels = ["A", "B", "C"];

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
      alert("There are no results to delete.");
      return;
  }

  if (confirm("Are you sure you want to delete all results?")) {
      localStorage.removeItem("scores");

      const $scoreItems = $(".score-item");
      const lastIndex = $scoreItems.length - 1;

      $scoreItems.each(function(index) {
          $(this).fadeOut(300, function() {
              if (index === lastIndex) {
                  $("#scoreContainer").html("<p>No data available.</p>").show();
                  $("#scoreButton").text("Listing results");
                  alert("All results have been deleted!");
              }
          });
      });
  }
}

function deleteSingleScore(timestamp) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  timestamp = Number(timestamp);

  if (!confirm("Are you sure you want to delete this result?")) {
      return;
  }

  const scoreToDelete = scores.find(score => Number(score.timestamp) === timestamp);

  if (!scoreToDelete) {
    alert("The deleted record cannot be found.");
    return;
  }

  scores = scores.filter(score => Number(score.timestamp) !== timestamp);
  localStorage.setItem("scores", JSON.stringify(scores));

  const $scoreItem = $(`.score-item[data-timestamp="${timestamp}"]`);
  const username = scoreToDelete.username || "Unknown user";

  $scoreItem.fadeOut(300, function () {
    $(this).remove();

    if (scores.length === 0) {
        $("#scoreContainer").html("<p>No data available.</p>");
        $("#scoreButton").text("Listing results");
    }
    alert(`${username} your data has been deleted!`);
  });
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
    scoreButton.text("Listing results");
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

      let testStatus = "";
      if (score.score >= 50 || percentage >= 90) {
        testStatus = "<p><strong>Status:</strong> Test passed</p>";
      } else {
        testStatus = "<p><strong>Status:</strong> Test not passed</p>";
      }

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
          <p><strong>Username:</strong> ${score.username}</p>
          <p><strong>Score:</strong> ${score.score}</p>
          <p><strong>Pivot point:</strong> ${score.totalPoints}</p>
          <p><strong>Percentage:</strong> ${percentage}%</p>
          <p><strong>Category:</strong> ${score.category}</p>
          <p><strong>Timestamp:</strong> ${timestamp}</p>
          <p><strong>Completion time:</strong> ${formattedDuration}</p>
          ${testStatus}
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
          ">Delete</button>
        </div>
      `;
    });
    scoreContainer.html(scoresHtml).show();
    scoreButton.text("Hide results");
  } else {
    scoreContainer.html("<p>There is no data available in the selected category.</p>").show();
    scoreButton.text("Hide results");
  }
}

function checkAnswers() {
  if (resultContainer.style.display === "block") {
    resultContainer.style.display = "none";
  } else {
    resultContainer.style.display = "block";
  }

  if (timeLeft > 0 && !confirm("Are you sure you want to finish the test?")) {
    return;
  }

  let score = 0;
  let totalPoints = 55;
  mistakeTracker = {};
  let unanswered = false;

  const selectedCategory = $("#quiz-category").val();

  /*totalPoints = selectedCategory === "Situations" ? 12 :
                selectedCategory === "Signs" ? 16 :
                selectedCategory === "Paragraphs" ? 27 : 55;*/

  if (!selectedQuestions || selectedQuestions.length === 0) {
    console.error("❌ Error: The selectedQuestions array is empty or not properly initialized!");
    return;
  }

  $("input[type='radio']:checked").each(function() {
    let questionIndex = $(this).data("index");

    if (questionIndex === undefined) {
      console.error("❌ Error: The input element does not have a 'data-index' attribute!");
      return;
    }

    if (questionIndex >= shuffledQuestions.length) {
      console.error(`❌ Error: A questionIndex (${questionIndex}) too large! Array length: ${shuffledQuestions.length}`);
      return;
    }

    let q = shuffledQuestions[questionIndex];
    let selectedOption = $(this).val();
    const optionsContainer = $(`input[name="question_${questionIndex}"]`).parent();

    if (!q) {
      console.error(`❌ Error: The question is undefined (index: ${questionIndex})`);
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

  if (unanswered && !confirm("You have not answered all questions. Are you sure you want to evaluate and save the result?")) {
    return;
  }

  clearInterval(timerInterval);

  let percentage = ((score / totalPoints) * 100).toFixed(2);
  let message = percentage >= 90 ? `Congratulations, you passed the ${selectedCategory} test!` : "Sorry, it didn't work! Try again.";
  submitButton.style.display = "none";
  
  /*const previousStatus = localStorage.getItem("userTestStatus");
  if (percentage < 60) {
    localStorage.setItem("userTestStatus", "incomplete");
  } else {
    localStorage.setItem("userTestStatus", "completed");
  }
  let filteredQuestions = questions.filter(q => selectedCategory === "All" || q.category === selectedCategory);
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
  localStorage.setItem("userTestStatus", "incomplete");*/

  resultContainer.innerHTML = `Result: ${score} / ${totalPoints} score (${percentage}%) <br> ${message}`;
  resultContainer.style.display = "block";

  let username = $("#username").val().trim();
  if (username) {
    saveScore(username, score, totalPoints, percentage, selectedCategory);
  } else {
    console.warn("⚠ Failed to save score: no username provided.");
  }
}

function toggleCorrectAnswers() {
  if (answersVisible) {
      hideAnswers();
      showAnswersButton.textContent = "Correct Answers";
  } else {
      showCorrectAnswers();
      showAnswersButton.textContent = "Hiding";
  }
  answersVisible = !answersVisible;
}

function showCorrectAnswers() {
  submitButton.style.display = "none";
  markAnswersInQuiz(true);
  clearInterval(timerInterval);
}

function clearSelections() {
    selectedQuestions.forEach((q, index) => {
        let selectedOption = document.querySelector(`input[name="question_${index}"]:checked`);
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
        const selectedOption = document.querySelector(`input[name="question_${index}"]:checked`);
        let selectedValue = selectedOption ? parseInt(selectedOption.value) : null;

        q.options.forEach((option, i) => {
            let optionInput = document.querySelector(`input[name="question_${index}"][value="${i}"]`);
            let optionLabel = document.querySelector(`label[for="${optionInput.id}"]`);

            let optionLabelText = `${String.fromCharCode(65 + i)}. ${option}`;

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
                optionLabel.textContent = optionLabelText + symbol;
                optionInput.disabled = true;
            } else {
                optionLabel.textContent = optionLabelText;
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
  const helpContentElement = document.getElementById("help-content");
  const helpContainer = document.getElementById("help-container");
  const helpButton = document.getElementById("help-button");

  if (fromButton) {
      if (helpContainer.style.display === "block") {
          helpContainer.style.display = "none";
          helpButton.textContent = "Show help";
          categorySelect.selectedIndex = 0;
          return;
      } else {
          helpContainer.style.display = "block";
          helpButton.textContent = "Hide help";
      }
  }

  helpContentElement.innerHTML = "";

  if (category === "Basic concepts") {
      if (helpContent.length === 0) {
          helpContentElement.innerHTML = "<p>There are no questions available in the 'Basic Concepts' category.</p>";
      } else {
          helpContent.forEach(item => {
              const title = item.title || "N/A";
              const description = item.description || "N/A";

              const contentContainer = document.createElement("div");
              contentContainer.classList.add("question-block");

              contentContainer.style.border = "2px solid #ccc";
              contentContainer.style.padding = "15px";
              contentContainer.style.margin = "10px 0";
              contentContainer.style.borderRadius = "10px";
              contentContainer.style.backgroundColor = "#f9f9f9";
              contentContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
              contentContainer.style.position = "relative";

              const question = document.createElement("p");
              question.innerHTML = `<strong>${title}</strong>`;
              question.style.margin = "0";
              question.style.padding = "5px";
              question.style.cursor = "pointer";

              const descriptionElement = document.createElement("p");
              descriptionElement.innerHTML = description;
              descriptionElement.style.display = "none";
              descriptionElement.style.marginTop = "5px";
              descriptionElement.style.padding = "10px";
              descriptionElement.style.background = "#e6f7ff";
              descriptionElement.style.borderLeft = "4px solid #007bff";
              descriptionElement.style.borderRadius = "5px";
              descriptionElement.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.1)";
              descriptionElement.style.cursor = "pointer";

              const closeButton = document.createElement("span");
              closeButton.innerHTML = "&#10005;";
              closeButton.style.fontSize = "20px";
              closeButton.style.cursor = "pointer";
              closeButton.style.position = "absolute";
              closeButton.style.top = "10px";
              closeButton.style.right = "10px";
              closeButton.style.color = "#ff0000";
              closeButton.style.display = "none";

              const closeAllButton = document.createElement("span");
              closeAllButton.innerHTML = "&#10005;";
              closeAllButton.style.fontSize = "20px";
              closeAllButton.style.cursor = "pointer";
              closeAllButton.style.position = "absolute";
              closeAllButton.style.top = "10px";
              closeAllButton.style.left = "10px";
              closeAllButton.style.color = "#28a745";
              closeAllButton.style.display = "none";

              question.addEventListener("click", function () {
                  const currentDisplay = descriptionElement.style.display;
                  descriptionElement.style.display = currentDisplay === "none" ? "block" : "none";

                  closeButton.style.display = descriptionElement.style.display === "block" ? "block" : "none";
                  closeAllButton.style.display = descriptionElement.style.display === "block" ? "block" : "none";
              });

              closeButton.addEventListener("click", function () {
                  /*helpContainer.style.display = "none";
                  helpButton.textContent = "Show help";
                  categorySelect.selectedIndex = 0;*/

                  descriptionElement.style.display = "none";
                  closeButton.style.display = "none";
                  closeAllButton.style.display = "none";
              });

              closeAllButton.addEventListener("click", function () {
                helpContainer.style.display = "none";
                helpButton.textContent = "Show help";
                categorySelect.selectedIndex = 0;
            });

              contentContainer.appendChild(question);
              contentContainer.appendChild(descriptionElement);
              contentContainer.appendChild(closeButton);
              contentContainer.appendChild(closeAllButton);
              helpContentElement.appendChild(contentContainer);
          });
      }
  } else {
    let filteredQuestions = [];

    if (category === "All") {
        filteredQuestions = [...questions];
    
        helpContent.forEach(item => {
            filteredQuestions.push({
                question: item.title,
                answer: item.description,
                category: "Basic concepts"
            });
        });
    } else {
        filteredQuestions = questions.filter(q =>
            (q.Category || q.category || "").trim().toLowerCase() === category.trim().toLowerCase()
        );
    }

      if (filteredQuestions.length === 0) {
          helpContentElement.innerHTML = "<p>There are no questions available in this category.</p>";
      } else {
          filteredQuestions.forEach(item => {
              const questionText = item.question || "N/A";
              const answer = item.answer || "N/A";
              const imagePath = item.image || "";
              const itemCategory = (item.Category || item.category || "").trim().toLowerCase();

              const questionContainer = document.createElement("div");
              questionContainer.classList.add("question-block");

              questionContainer.style.border = "2px solid #ccc";
              questionContainer.style.padding = "15px";
              questionContainer.style.margin = "10px 0";
              questionContainer.style.borderRadius = "10px";
              questionContainer.style.backgroundColor = "#f9f9f9";
              questionContainer.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";
              questionContainer.style.position = "relative";

              const question = document.createElement("p");
              question.innerHTML = `<strong>Question:</strong> ${questionText}`;
              question.style.margin = "0";
              question.style.padding = "5px";
              question.style.cursor = imagePath.trim() !== "" ? "default" : "pointer";

              let image = null;
              if (imagePath.trim() !== "") {
                  image = document.createElement("img");
                  image.src = `images/${imagePath}`;
                  image.alt = "Image for the question";
                  image.style.maxWidth = "100%";
                  image.style.height = "auto";
                  image.style.margin = "10px 0";
                  image.style.borderRadius = "5px";
                  image.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.2)";
                  image.style.cursor = "pointer";
              }

              const answerElement = document.createElement("p");
              answerElement.innerHTML = `<strong>Response:</strong> ${answer}`;
              answerElement.style.display = "none";
              answerElement.style.marginTop = "5px";
              answerElement.style.padding = "10px";
              answerElement.style.background = "#e6f7ff";
              answerElement.style.borderLeft = "4px solid #007bff";
              answerElement.style.borderRadius = "5px";
              answerElement.style.boxShadow = "0px 0px 5px rgba(0, 0, 0, 0.1)";
              answerElement.style.cursor = "default";

              const closeButton = document.createElement("span");
              closeButton.innerHTML = "&#10005;";
              closeButton.style.fontSize = "12px";
              closeButton.style.cursor = "pointer";
              closeButton.style.position = "absolute";
              closeButton.style.top = "10px";
              closeButton.style.right = "10px";
              closeButton.style.color = "#ff0000";
              closeButton.style.display = "none";

              const closeAllButton = document.createElement("span");
              closeAllButton.innerHTML = "&#10005;";
              closeAllButton.style.fontSize = "12px";
              closeAllButton.style.cursor = "pointer";
              closeAllButton.style.position = "absolute";
              closeAllButton.style.top = "10px";
              closeAllButton.style.left = "10px";
              closeAllButton.style.color = "#28a745";
              closeAllButton.style.display = "none";

              if (image) {
                  image.addEventListener("click", function () {
                      const currentDisplay = answerElement.style.display;
                      answerElement.style.display = currentDisplay === "none" ? "block" : "none";

                      closeButton.style.display = answerElement.style.display === "block" ? "block" : "none";
                      closeAllButton.style.display = answerElement.style.display === "block" ? "block" : "none";
                  });
              }

              if (imagePath.trim() === "") {
                  question.addEventListener("click", function () {
                      const currentDisplay = answerElement.style.display;
                      answerElement.style.display = currentDisplay === "none" ? "block" : "none";

                      closeButton.style.display = answerElement.style.display === "block" ? "block" : "none";
                      closeAllButton.style.display = answerElement.style.display === "block" ? "block" : "none";
                  });
              }

              closeButton.addEventListener("click", function () {
                  /*helpContainer.style.display = "none";
                  helpButton.textContent = "Show help";
                  categorySelect.selectedIndex = 0;*/

                  answerElement.style.display = "none";
                  closeButton.style.display = "none";
                  closeAllButton.style.display = "none";
              });

              closeAllButton.addEventListener("click", function () {
                helpContainer.style.display = "none";
                helpButton.textContent = "Show help";
                categorySelect.selectedIndex = 0;
            });

              questionContainer.appendChild(question);
              if (image) questionContainer.appendChild(image);
              questionContainer.appendChild(answerElement);
              questionContainer.appendChild(closeButton);
              questionContainer.appendChild(closeAllButton);
              helpContentElement.appendChild(questionContainer);
          });
      }
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
    console.warn("⚠ Error: Question category selector ('quiz-category') not found!");
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
