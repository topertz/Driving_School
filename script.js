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
const spacer = document.createElement("div");
const originalBackground = timer.style.background;
let timeLeft = 300;
let timerInterval;
let mistakeTracker = {};
let selectedQuestions = [];
let categories = [];
let isHelpVisible = false;
let answersVisible = false;
let questionsLoaded = false;
let questionsUploaded = false;
let categoriesLoaded = false;
let screenRefreshed = false;

let questions = [
    {
      "question": "Az elsőbbségadási kötelesség alatt az értendő, hogy [2 pont]",
      "options": [
        "a közúti közlekedés résztvevője köteles úgy eljárni, hogy annak, akinek haladási elsőbbsége van, ne kelljen hirtelen megváltoztatnia haladási irányát vagy haladási sebességét,",
        "a közúti közlekedés résztvevője köteles úgy eljárni, hogy annak, akinek haladási elsőbbsége van, ne kelljen hirtelen megváltoztatnia haladási irányát, de megváltoztathatja haladási sebességét,",
        "a közúti közlekedés résztvevője köteles úgy eljárni, hogy annak, akinek haladási elsőbbsége van, ne kelljen megváltoztatnia haladási sebességét, de megváltoztathatja haladási irányát."
      ],
      "answer": "a közúti közlekedés résztvevője köteles úgy eljárni, hogy annak, akinek haladási elsőbbsége van, ne kelljen hirtelen megváltoztatnia haladási irányát vagy haladási sebességét,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A gépjárművén menet közben kötelező bekapcsolni? [2 pont]",
      "options": [
        "a jármű belső megvilágítását,",
        "a távolsági fényszórókat,",
        "a tompított fényszórókat vagy az azokkal egyenrangú megvilágítást."
      ],
      "answer": "a tompított fényszórókat vagy az azokkal egyenrangú megvilágítást.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A járművezetőnek? [2 pont]",
      "options": [
        "Járművezetés közben szabad telefonkészüléket használnia,",
        "járművezetés közben tilos telefonkészüléket használnia, a \"szabad kéz\" rendszer felhasználásával való telefonálás kivételével,",
        "járművezetés közben tilos rádiót hallgatnia."
      ],
      "answer": "járművezetés közben tilos telefonkészüléket használnia, a \"szabad kéz\" rendszer felhasználásával való telefonálás kivételével,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Ha az úttesten nincsenek kijelölve a forgalmi sávok, az úttestnek az a része tekintendő forgalmi sávnak, amely lehetővé teszi, hogy [2 pont]",
      "options": [
        "három- vagy többkerekű járművek egymás mögött sorban haladhassanak,",
        "a legalább kétkerekű járművek egymás mögött sorban haladhassanak,",
        "csak a kétkerekű járművek haladhassanak egymás mögött sorban."
      ],
      "answer": "három- vagy többkerekű járművek egymás mögött sorban haladhassanak,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Az előzendő járműnek tilos [2 pont]",
      "options": [
        "menetsebességének növelésén kívül az előzés végrehajtását bármilyen módon akadályoznia,",
        "menetsebességét növelni és az előzés végrehajtását bármilyen módon akadályoznia,",
        "menetsebességét csökkenteni."
      ],
      "answer": "menetsebességét növelni és az előzés végrehajtását bármilyen módon akadályoznia,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A járművezető csak megfelelő sebességgel közlekedhet, hogy járművét képes legyen a következő távolságon belül megállítani: [2 pont]",
      "options": [
        "20 m, autópályán és gyorsforgalmi úton 50 m,",
        "30 m,",
        "amelyre kilátása van."
      ],
      "answer": "amelyre kilátása van.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A balra bekanyarodó jármű vezetője [2 pont]",
      "options": [
        "csak a vele szemben közlekedő járműveknek köteles haladási elsőbbséget adni,",
        "a vele szemben közlekedő gépjárműveknek és motor nélküli járműveknek, a mindkét irányban közlekedő villamosoknak és az úttesten átkelő gyalogosoknak köteles haladási elsőbbséget adni,",
        "csak a szembejövő gépjárműveknek köteles haladási elsőbbséget adni."
      ],
      "answer": "a vele szemben közlekedő gépjárműveknek és motor nélküli járműveknek, a mindkét irányban közlekedő villamosoknak és az úttesten átkelő gyalogosoknak köteles haladási elsőbbséget adni,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Ha a jármű vezetője megállás vagy várakozás szándékával az úttest vagy a járda szélére hajt, [2 pont]",
      "options": [
        "nem köteles jelezni menetirányának megváltozását,",
        "köteles jelezni menetirányának megváltozását,",
        "csak lakott területen köteles jelezni menetirányának megváltoztatását."
      ],
      "answer": "köteles jelezni menetirányának megváltozását,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A közúti baleset résztvevője [2 pont]",
      "options": [
        "semmilyen intézkedést nem tehet a sérült személy megmentése érdekében, ha az hátráltatná a közúti baleset kivizsgálását,",
        "köteles lehetővé tenni a közúti forgalom helyreállítását, de csak akkor, ha ő okozta a közúti balesetet,",
        "köteles megfelelő intézkedéseket tenni a közúti baleset következtében veszélybe került személy vagy vagyon megmentése érdekében."
      ],
      "answer": "köteles megfelelő intézkedéseket tenni a közúti baleset következtében veszélybe került személy vagy vagyon megmentése érdekében.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Az önállóan vagy más közúti jelzéssel együtt használt villogó sárga fényjelzés jelentése a következő: [2 pont]",
      "options": [
        "a járművezető köteles megállítani járművét a kerékpáros-átkelőhely előtt,",
        "a járművezető a gyalogos-átkelőhelyen kőteles elsőbbséget adni a gyalogosoknak,",
        "a fokozott óvatosság szükségességére figyelmeztet."
      ],
      "answer": "a fokozott óvatosság szükségességére figyelmeztet.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A közúti közlekedés közúti jelzésekkel és közúti jelzőberendezésekkel történő szabályozása [2 pont]",
      "options": [
        "fölérendeltségben van a közúti közlekedés általános szabályozásával szemben,",
        "csak a lakó-, sétáló- és iskolaövezetben van fölérendeltségben a közúti közlekedés általános szabályozásával szemben,",
        "nincs fölérendeltségben a közúti közlekedés általános szabályozásával szemben."
      ],
      "answer": "fölérendeltségben van a közúti közlekedés általános szabályozásával szemben,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Ha a biztonsági ruházattal kötelezően ellátott gépjármű vezetője az úttesten a gépjárművén kívül tartózkodik kényszervárakozás folyamán, főleg a közlekedés megszakításakor a gépjárművén keletkezett meghibásodás miatt vagy közlekedési baleset következtében, köteles [2 pont]",
      "options": [
        "a jármű mögött 20 m távolságban fehér színű, nem vakító világítótestet elhelyezni,",
        "haladéktalanul hívni a vontatószolgálatot,",
        "viselni a biztonsági ruházatot."
      ],
      "answer": "viselni a biztonsági ruházatot.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Kerékpárral elsősorban [1 pont]",
      "options": [
        "a járdán kell közlekedni,",
        "kerékpárúton kell közlekedni,",
        "a bal oldali útpadkán kell közlekedni."
      ],
      "answer": "kerékpárúton kell közlekedni,",
      "points": 1,
      "category": "Paragrafusok"
    },
    {
      "question": "A jármű közúti közlekedésre műszakilag alkalmatlannak minősül, ha [1 pont]",
      "options": [
        "ugyanazon futóműre különböző abroncsok kerültek felszerelésre",
        "a helyzetlámpák aktív fénycsóvájának legalacsonyabb pontja 350 mm-tól magasabbat van az úttest szintje fölött,",
        "a távolsági fényszórókat nem lehet helyzetlámpákra átkapcsolni."
      ],
      "answer": "ugyanazon futóműre különböző abroncsok kerültek felszerelésre",
      "points": 1,
      "category": "Paragrafusok"
    },
    {
      "question": "A gumiabroncs felületének középső részén található fő mintázat mélysége, amely a gumiabroncs futófelületén található mintázat megközelítőleg háromnegyedét takarja be, nem lehet kevesebb, mint [1 pont]",
      "options": [
        "L1e kategóriájú jármű esetében 1,6 mm,",
        "az összes kategóriájú jármű esetében 1,6 mm,",
        "L1e kategóriájú jármű esetében 1,0 mm."
      ],
      "answer": "L1e kategóriájú jármű esetében 1,0 mm.",
      "points": 1,
      "category": "Paragrafusok"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla [2 pont]",
      "options": [
        "sorompó nélküli vasúti átjáróra figyelmeztet,",
        "közút és villamospálya kereszteződésére figyelmeztet,",
        "olyan útkereszteződésre figyelmeztet, ahol a haladási elsőbbséget jelzőtáblák nem szabályozzák."
      ],
      "answer": "olyan útkereszteződésre figyelmeztet, ahol a haladási elsőbbséget jelzőtáblák nem szabályozzák.",
      "points": 2,
      "image": "sorompo.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla szerint tilos [2 pont]",
      "options": [
        "gépjárművel és motor nélküli járművel behajtani,",
        "a jelzett járműfajtákkal behajtani,",
        "a jelzett járműfajtákkal előzni."
      ],
      "answer": "a jelzett járműfajtákkal behajtani,",
      "points": 2,
      "image": "haromagu.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla olyan helyet jelöl [2 pont]",
      "options": [
        "ahol az úttesten lassító küszöböt építettek,",
        "ahol a megemelt szintű villamos-pályán keresztirányban szabad átjárni,",
        "ahol részben a járdán merőlegesen vagy ferdén állva szabad várakozni és jelzi a jármű járdán való várakozásának módját."
      ],
      "answer": "ahol részben a járdán merőlegesen vagy ferdén állva szabad várakozni és jelzi a jármű járdán való várakozásának módját.",
      "points": 2,
      "image": "parkolas.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt, kiegészítő táblával ellátott jelzőtábla jelentése: [2 pont]",
      "options": [
        "főutat jelöl, főként lakott területen belül, az útkereszteződés, valamint a főút és az alárendelt út tényleges alakjának feltüntetésével,",
        "útkereszteződést jelöl, ahol a haladási elsőbbséget jelzőtáblák nem szabályozzák,",
        "alárendelt utat és útkereszteződést jelöl."
      ],
      "answer": "főutat jelöl, főként lakott területen belül, az útkereszteződés, valamint a főút és az alárendelt út tényleges alakjának feltüntetésével,",
      "points": 2,
      "image": "fout.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Egyirányú forgalom,",
        "Útirány-előjelző tábla,",
        "Kötelező haladási irány."
      ],
      "answer": "Egyirányú forgalom,",
      "points": 2,
      "image": "egyiranyu.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útelzárást jelző korlát [2 pont]",
      "options": [
        "az úttest részleges lezárását jelzi; a nyilak az úttest szabad része felé mutatnak,",
        "az úttest teljes szélességű lezárását jelzi,",
        "egyirányú forgalmú útszakaszt jelöl."
      ],
      "answer": "az úttest részleges lezárását jelzi; a nyilak az úttest szabad része felé mutatnak,",
      "points": 2,
      "image": "kanyar.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla [2 pont]",
      "options": [
        "a hátralevő távolságot jelzi addig a helyig, ahonnan kezdve hatályos az a jelzőtábla, amely alatt elhelyezték,",
        "a terelőút irányát jelzi,",
        "azt az útszakaszt jelzi, ahol a fölötte levő jelzőtábla hatályos."
      ],
      "answer": "a hátralevő távolságot jelzi addig a helyig, ahonnan kezdve hatályos az a jelzőtábla, amely alatt elhelyezték,",
      "points": 2,
      "image": "nyil.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt jelzéssel kötelező megjelölni [2 pont]",
      "options": [
        "gyermekeket szállító autóbuszt,",
        "azt az útszakaszt, ahol gyakran tartózkodnak gyerekek (iskola, óvoda, játszótér stb. közelében),",
        "a gyermekeket szállító személygépkocsit."
      ],
      "answer": "azt az útszakaszt, ahol gyakran tartózkodnak gyerekek (iskola, óvoda, játszótér stb. közelében),",
      "points": 2,
      "image": "gyerekek.png",
      "category": "Táblák"
    },
    {
      "question": "Az útkereszteződésbe elsőként hajt be [3 pont]",
      "options": [
        "a zöld jármű,",
        "a kék jármű,",
        "a piros jármű."
      ],
      "answer": "a piros jármű.",
      "points": 3,
      "image": "jobbkez.png",
      "category": "Szituációk"
    },
    {
      "question": "Ha a forgalomirányító rendőr jobb karja melső középtartásba, bal karja pedig oldalsó középtartásba van emelve, ennek jelentése \"Állj!\" [3 pont]",
      "options": [
        "a zöld jármű vezetője számára,",
        "a piros és sárga jármű vezetője számára,",
        "a rendőr háta mögött átkelő gyalogosok számára."
      ],
      "answer": "a piros és sárga jármű vezetője számára,",
      "points": 3,
      "image": "rendor.png",
      "category": "Szituációk"
    },
    {
      "question": "Az Ön járműve hányadikként halad át az útkereszteződésen? [3 pont]",
      "options": [
        "elsőként,",
        "utolsóként,",
        "másodikként."
      ],
      "answer": "utolsóként,",
      "points": 3,
      "image": "elony.png",
      "category": "Szituációk"
    },
    {
      "question": "A járművek a következő sorrendben haladnak át az útkereszteződésen: [3 pont]",
      "options": [
        "1. villamos, 2. zöld, 3. kék, 4. sárga, 5. az Ön járműve,",
        "1. zöld, 2. villamos, 3. kék, 4. sárga, 5. az Ön járműve,",
        "1. kék, 2. zöld, 3. sárga, 4. az Ön járműve, 5. villamos."
      ],
      "answer": "1. villamos, 2. zöld, 3. kék, 4. sárga, 5. az Ön járműve,",
      "points": 3,
      "image": "villamos.png",
      "category": "Szituációk"
    }
  ]


  $(document).ready(function () {
    let screenRefreshed = false;
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
            // Ha még nincs eltárolva, akkor a beágyazott questions változót mentjük el
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
        categories = ["Minden", "Paragrafusok", "Táblák", "Szituációk"];
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

    generateQuestionsButton.addEventListener("click", () => {
        if (usernameInput.value.trim() === "") {
            alert("Kérlek, add meg a neved!");
            console.warn("⚠ Nincs megadva felhasználónév!");
            return;
        }

        if (!questionsLoaded) {
            console.warn("⚠ A kérdések még nincsenek betöltve! Újratöltés...");
            loadQuestionsFromLocalStorage();
        }
        startQuiz();
    });

    function startQuiz() {
        generateQuestionsButton.style.display = "none";
        usernameInput.style.display = "none";
        $("#timer").css("display", "block");
        $("#scoreButton").css("display", "none");
        $("#help-button").css("display", "none");
        $("#backButton").css("display", "block");
        $("#clearScores").css("display", "none");
        loadQuiz();
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

function BackToHomePage() {
    window.location.href = "index.html";
}
function Redirect() {
    window.location.href = "register.html";
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

function getRandomQuestions(allQuestions, count) {
    // Ha nincs rögzített hiba, akkor véletlenszerűen választunk kérdéseket
    if (Object.keys(mistakeTracker).length === 0) {
        let shuffled = [...allQuestions];
        shuffleArray(shuffled);
        return shuffled.slice(0, count);
    }

    let sortedTypes = Object.entries(mistakeTracker)
        .sort((a, b) => b[1] - a[1]) // Csökkenő sorrendbe rendezzük a leggyakoribb hibák szerint
        .map(entry => entry[0]); // Csak a típusokat vesszük ki

    let prioritizedQuestions = new Set();

    // Elsőként csak azokat a kérdéseket adjuk hozzá, amelyek a legtöbbször elrontott típusokhoz tartoznak
    for (let type of sortedTypes) {
        let filteredQuestions = allQuestions.filter(q => q.type === type);
        shuffleArray(filteredQuestions);

        filteredQuestions.forEach(q => {
            if (prioritizedQuestions.size < count) {
                prioritizedQuestions.add(q);
            }
        });

        // Ha már elértük a kívánt mennyiséget, kilépünk a ciklusból
        if (prioritizedQuestions.size >= count) {
            return Array.from(prioritizedQuestions);
        }
    }

    // Ha nem sikerült elég kérdést összegyűjteni, pótoljuk véletlenszerű kérdésekkel
    let remainingQuestions = allQuestions.filter(q => !prioritizedQuestions.has(q));
    shuffleArray(remainingQuestions);

    remainingQuestions.forEach(q => {
        if (prioritizedQuestions.size < count) {
            prioritizedQuestions.add(q);
        }
    });

    return Array.from(prioritizedQuestions).slice(0, count);
}

function loadQuiz() {
    quizContainer.innerHTML = "";
    mistakeTracker = {};
    selectedQuestions = getRandomQuestions(questions, 27);

    selectedQuestions.forEach((q, index) => {
        const questionElem = document.createElement("div");
        questionElem.classList.add("question-block");

        questionElem.style.border = "2px solid #ccc";
        questionElem.style.padding = "15px";
        questionElem.style.margin = "10px 0";
        questionElem.style.borderRadius = "10px";
        questionElem.style.backgroundColor = "#f9f9f9";
        questionElem.style.boxShadow = "2px 2px 10px rgba(0, 0, 0, 0.1)";

        questionElem.innerHTML = `<p>${index + 1}. ${q.question}</p>`;
        let optionLabels = ['A', 'B', 'C'];

        if (q.image) {
            const imageBox = document.createElement("div");
            imageBox.classList.add("image-box");

            const imageElem = document.createElement("img");
            imageElem.src = `images/${q.image}`;
            imageElem.alt = `Kép a(z) ${index + 1}. kérdéshez`;
            imageElem.style.maxWidth = "100%";

            imageBox.appendChild(imageElem);
            questionElem.appendChild(imageBox);
        }

        q.options.forEach((option, i) => {
            const optionContainer = document.createElement("div");
            optionContainer.classList.add("option");

            const inputElem = document.createElement("input");
            inputElem.type = "radio";
            inputElem.name = `question_${index}`; // Egyedi név minden kérdéshez
            inputElem.value = i;
            inputElem.id = `question_${index}_option_${i}`;

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

function saveScore(username, score, totalPoints, percentage) {
  let scores = JSON.parse(localStorage.getItem("scores")) || [];

  scores.push({
      username: username,
      score: score,
      totalPoints: totalPoints,
      percentage: percentage,
      timestamp: Date.now()
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

  // Győződjünk meg róla, hogy a timestamp szám
  timestamp = Number(timestamp);

  // Megerősítés a törléshez (csak egyszer kérdezi meg)
  if (!confirm("Biztosan törölni szeretnéd ezt az eredményt?")) {
      return;
  }

  // Töröljük az adott timestamp-hez tartozó elemet a tömbből
  scores = scores.filter(score => Number(score.timestamp) !== timestamp);

  localStorage.setItem("scores", JSON.stringify(scores));

  // Csak az adott elemet töröljük a DOM-ból, nem frissítjük az egész listát
  $(`.score-item[data-timestamp="${timestamp}"]`).remove();

  // Ha nincs több eredmény, frissítjük a szöveget
  if (scores.length === 0) {
      $("#scoreContainer").html("<p>Nincs elérhető adat.</p>");
      $("#scoreButton").text("Eredmények kilistázása");
  }
}

// Eseménykezelő delegálás (csak egyszer)
$(document).off("click", ".delete-score").on("click", ".delete-score", function() {
  let timestamp = $(this).closest(".score-item").data("timestamp");
  deleteSingleScore(timestamp);
});

function listScore() {
  let scoreContainer = $("#scoreContainer");
  let scoreButton = $("#scoreButton");

  if (scoreContainer.children().length > 0) {
      scoreContainer.toggle();
      scoreButton.text(scoreContainer.is(":visible") ? "Eredmények elrejtése" : "Eredmények kilistázása");
      return;
  }

  let scores = JSON.parse(localStorage.getItem("scores")) || [];
  if (scores.length > 0) {
      let scoresHtml = "";
      scores.forEach(score => {
          let percentage = ((score.score / score.totalPoints) * 100).toFixed(2);
          let timestamp = score.timestamp ? new Date(score.timestamp).toLocaleString() : "N/A";

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
                  <p><strong>Időbélyeg:</strong> ${timestamp}</p>
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
      scoreContainer.html("<p>Nincs elérhető adat.</p>").show();
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
  let totalPoints = 55; // 100% = 55 pont
  mistakeTracker = {};
  let unanswered = false; // Ha van megválaszolatlan kérdés, ezt true-ra állítjuk

  selectedQuestions.forEach((q, index) => {
      const selectedOption = $(`input[name='question_${index}']:checked`).val();
      const optionsContainer = $(`input[name='question_${index}']`).parent(); // Opciók konténere

      if (selectedOption !== undefined) {
          // Ha van választott opció, eltávolítjuk a piros keretet
          optionsContainer.css("border", "");
          const selectedAnswer = q.options[selectedOption];

          if (selectedAnswer.trim().toLowerCase() === q.answer.trim().toLowerCase()) {
              score += q.points;
          } else {
              mistakeTracker[q.type] = (mistakeTracker[q.type] || 0) + 1;
          }
      } else {
          // Ha nincs válasz, a rádiógombok köré piros keretet rakunk
          optionsContainer.css("border", "2px solid red");
          mistakeTracker[q.type] = (mistakeTracker[q.type] || 0) + 1;
          unanswered = true;
      }
  });

  if (unanswered && !confirm("Nem válaszoltál minden kérdésre. Biztosan ki akarod értékelni és menteni az eredményt?")) {
      return; // Nem állítjuk le a timert és nem értékeljük ki a tesztet
  }

  // Ha minden kérdésre válaszoltak, vagy megerősítették a folytatást, csak akkor állítjuk le a timert és értékeljük ki
  clearInterval(timerInterval);

  let percentage = ((score / totalPoints) * 100).toFixed(2);
  let message = percentage >= 50 ? "Gratulálok!" : "Nem sikerült!";

  resultContainer.innerHTML = `Eredmény: ${score} / ${totalPoints} pont (${percentage}%) <br> ${message}`;
  resultContainer.style.display = "block";

  let username = $("#username").val().trim();

  if (username) {
      saveScore(username, score, totalPoints, percentage);
  } else {
      console.warn("A pontszám mentése sikertelen: nincs megadva felhasználónév.");
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
    selectedQuestions.forEach((q, index) => {
        const correctIndex = q.options.indexOf(q.answer);
        const selectedOption = document.querySelector(`input[name='question_${index}']:checked`);
        let selectedValue = selectedOption ? parseInt(selectedOption.value) : null;

        q.options.forEach((option, i) => {
            let optionInput = document.querySelector(`input[name='question_${index}'][value='${i}']`);
            let optionLabel = document.querySelector(`label[for='${optionInput.id}']`);

            if (show) {
                let symbol = "";
                if (i === correctIndex) {
                    symbol = " ✔"; // Helyes válasz
                    optionLabel.style.color = "green";
                }
                if (selectedValue !== null && i === selectedValue && i !== correctIndex) {
                    symbol = " ❌"; // Rossz válasz
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
          answerElement.style.display = (itemCategory === "táblák" || itemCategory === "szituációk" || itemCategory === "paragrafusok") ? "none" : "block";
          answerElement.style.marginTop = "5px";
          answerElement.style.padding = "5px";
          answerElement.style.background = "#f9f9f9";
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
    const duration = 600; // Az animáció időtartama (ms)
    const startTime = performance.now();

    function scrollStep(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOutQuad = 1 - (1 - progress) * (1 - progress); // Egy kis easing hatás

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
    loadQuiz();
    window.scrollTo({ top: 0, behavior: "smooth" });
    //smoothScrollToTop();
}

submitButton.addEventListener("click", checkAnswers);
showAnswersButton.addEventListener("click", showCorrectAnswers);
restartButton.addEventListener("click", restartQuiz);
showAnswersButton.addEventListener("click", toggleCorrectAnswers);
clearButton.addEventListener("click", clearScores);