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
let startTime = Date.now();
let timerInterval;
let mistakeTracker = {};
let selectedQuestions = [];
let shuffledQuestions = [];
let categories = [];
let isHelpVisible = false;
let answersVisible = false;
let questionsLoaded = false;
let questionsUploaded = false;
let categoriesLoaded = false;
let screenRefreshed = false;

let questions = [
    {
      "question": "Az elsőbbségadási kötelesség alatt az értendő, hogy: [2 pont]",
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
      "question": "A gépjárművén menet közben kötelező bekapcsolni: [2 pont]",
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
      "question": "A járművezetőnek: [2 pont]",
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
      "question": "Ha az úttesten nincsenek kijelölve a forgalmi sávok, az úttestnek az a része tekintendő forgalmi sávnak, amely lehetővé teszi, hogy: [2 pont]",
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
      "question": "Az előzendő járműnek tilos: [2 pont]",
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
      "question": "A balra bekanyarodó jármű vezetője: [2 pont]",
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
      "question": "Ha a jármű vezetője megállás vagy várakozás szándékával az úttest vagy a járda szélére hajt: [2 pont]",
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
      "question": "A közúti baleset résztvevője: [2 pont]",
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
      "question": "A közúti közlekedés közúti jelzésekkel és közúti jelzőberendezésekkel történő szabályozása: [2 pont]",
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
      "question": "Ha a biztonsági ruházattal kötelezően ellátott gépjármű vezetője az úttesten a gépjárművén kívül tartózkodik kényszervárakozás folyamán, főleg a közlekedés megszakításakor a gépjárművén keletkezett meghibásodás miatt vagy közlekedési baleset következtében, köteles: [2 pont]",
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
      "question": "Kerékpárral elsősorban: [1 pont]",
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
      "question": "A jármű közúti közlekedésre műszakilag alkalmatlannak minősül, ha: [1 pont]",
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
      "question": "A jármű közúti közlekedésre műszakilag alkalmatlannak minősül, ha: [1 pont]",
      "options": [
        "a kipufogó gázrendszer valamely része tömítetlen, ennek következtében a kipufogógáz beszivárog az utasok, a járművezető vagy a rakomány közé, vagy nagymértékű zaj forrása,",
        "a járművezető helyéről nem lehet beállítani a jobboldali elülső visszapillantó tükröt,",
        "nem tudja elérni legalább a 80 km/óra  sebességet."
      ],
      "answer": "a kipufogó gázrendszer valamely része tömítetlen, ennek következtében a kipufogógáz beszivárog az utasok, a járművezető vagy a rakomány közé, vagy nagymértékű zaj forrása,",
      "points": 1,
      "category": "Paragrafusok"
    },
    {
      "question": "A járda: [2 pont]",
      "options": [
        "csak a megfelelő jelzéssel megjelölt út vagy útrész,",
        "a jobb oldali útpadka; ahol nincs, a járda az úttest jobb oldali, egy méter széles széle,",
        "az út elsősorban gyalogosok közlekedésére szolgáló, az úttesttől rendszerint szintkülönbséggel vagy más módon elhatárolt része."
      ],
      "answer": "az út elsősorban gyalogosok közlekedésére szolgáló, az úttesttől rendszerint szintkülönbséggel vagy más módon elhatárolt része.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Ha az úttestet összefüggő hótakaró, jégréteg borítja, esetleg felülete eljegesedett, az M1és N1 kategóriájú gépjármű vezetője az ilyen járművet a közúti közlekedésben csak akkor használhatja, ha: [2 pont]",
      "options": [
        "annak összes tengelye el van látva téli gumiabroncsokkal,",
        "annak meghajtó tengelye el van látva téli gumiabroncsokkal,",
        "balesetbiztosítással rendelkezik."
      ],
      "answer": "annak összes tengelye el van látva téli gumiabroncsokkal,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A járművezetőnek álló tömegközlekedési jármű kikerülésénél tekintettel kell lennie arra, hogy személyek futhatnak az úttestre és: [2 pont]",
      "options": [
        "ezért mindig legfeljebb 15 km/óra sebességgel kell közlekednie,",
        "ezért mindig le kell állítania a járművét,",
        "úgy kell közlekednie, hogy a személyeket ne veszélyeztethesse."
      ],
      "answer": "úgy kell közlekednie, hogy a személyeket ne veszélyeztethesse.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Járművel tilos előzni, ha az előtte haladó jármű vezetője menetirány-változtatást jelez: [2 pont]",
      "options": [
        "jobbra,",
        "balra, mégpedig semmilyen esetben sem,",
        "balra, és ha nem előzhető meg jobbról, esetleg ha nem előzhető meg egy másik szabad, az úttesten azonos menetirányban kijelölt forglami sávban."
      ],
      "answer": "balra, és ha nem előzhető meg jobbról, esetleg ha nem előzhető meg egy másik szabad, az úttesten azonos menetirányban kijelölt forglami sávban.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A járművezető az előtte haladó jármű után: [2 pont]",
      "options": [
        "köteles legalább 10 m-es követési távolságot tartani,",
        "köteles olyan követési távolságot tartani, amilyen a jármű 60 km/óra sebességről való megállításához szükséges,",
        "köteles olyan követési távolságot tartani, hogy időben képes legyen csökkenteni sebességét, esetleg leállítani a járművet, ha az előtte haladó jármű csökkenti sebességét vagy megáll."
      ],
      "answer": "köteles olyan követési távolságot tartani, hogy időben képes legyen csökkenteni sebességét, esetleg leállítani a járművet, ha az előtte haladó jármű csökkenti sebességét vagy megáll.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A jobbra bekanyarodó gépjármű és motor nélküli jármű vezetője: [2 pont]",
      "options": [
        "köteles haladási elsőbbséget adni a szembejövő tömegközlekedési járműveknek, ha azok balra kanyarodnak,",
        "ott, ahol a villamos mellett baloldalon szabad haladni, a villamosnak köteles haladási elsőbbséget adni,",
        "köteles haladási elsőbbséget adni a mögötte haladó első járműnek."
      ],
      "answer": "köteles haladási elsőbbséget adni a mögötte haladó első járműnek.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Járművel tilos megfordulni: [2 pont]",
      "options": [
        "egyirányú forgalmú közúton,",
        "lakóövezetben,",
        "mindenfajta útkereszteződésben."
      ],
      "answer": "egyirányú forgalmú közúton,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Az a vezető, aki úgy szándékozik eltávozni járművétől, hogy szükség esetén nem tud majd azonnal közbelépni, köteles: [2 pont]",
      "options": [
        "járművét mindig csak a kijelölt várakozóhelyen leállítani,",
        "gondoskodni arról, hogy járműve ne veszélyeztesse a közúti közlekedés biztonságát és folyamatosságát, valamint, hogy más személy ne használhassa járművét,",
        "kirakni a járműből a benne szállított dolgokat."
      ],
      "answer": "gondoskodni arról, hogy járműve ne veszélyeztesse a közúti közlekedés biztonságát és folyamatosságát, valamint, hogy más személy ne használhassa járművét,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Járművel tilos megállni és várakozni: [2 pont]",
      "options": [
        "útkereszteződésben és az útkereszteződés határa előtti 15 m távolságban, valamint 10 m-rel utána,",
        "mindenfajta útkereszteződésben,",
        "útkereszteződésben és az útkereszteződés határa előtti 5 m távolságban, valamint 5 m-rel utána; ez nem érvényes a T-alakú útkereszteződésben a torkolló út szemközti oldalán lakott területen belül."
      ],
      "answer": "útkereszteződésben és az útkereszteződés határa előtti 5 m távolságban, valamint 5 m-rel utána; ez nem érvényes a T-alakú útkereszteződésben a torkolló út szemközti oldalán lakott területen belül.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A gépjárművezetőnek tilos előznie, ha: [2 pont]",
      "options": [
        "az előzéskor a kimondottan kisebb sebességgel korlátozná az  utána közlekedő járművet, amely előbb kezdte meg az előzést",
        "különleges gépjármű közlekedik előtte,",
        "ha a községben erre az előzött gépjármű vezetőjét nem figyelmeztette figyelmeztető hangjelzéssel."
      ],
      "answer": "az előzéskor a kimondottan kisebb sebességgel korlátozná az  utána közlekedő járművet, amely előbb kezdte meg az előzést",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A személyszállításra szolgáló gépjárműben, az arra fenntartott helyeken: [2 pont]",
      "options": [
        "15 évnél idősebb és 160 cm-nél magasabb személyek szállíthatók,",
        "a személyszállítás csak a gépjármű megengedett össztömegéig megengedett, eközben a szállított személyek száma magasabb lehet a forgalmi engedélyben feltüntetett ülőhelyek számánál,",
        "a személyszállítás csak a gépjármű megengedett hasznos terheléséig szabad , eközben a szállított személyek száma nem lehet magasabb a forgalmi engedélyben feltüntetett ülőhelyek számánál."
      ],
      "answer": "a személyszállítás csak a gépjármű megengedett hasznos terheléséig szabad , eközben a szállított személyek száma nem lehet magasabb a forgalmi engedélyben feltüntetett ülőhelyek számánál.",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "A fényjelző készülék két egymás mellett elhelyezett, felváltva villogó, piros fényt adó lámpájának figyelmeztető jelzése: [2 pont]",
      "options": [
        "a gyalogosoknak tiltja az úttestre lépést,",
        "a járművezetőt kötelezi járműve megállítására a fényjelző készülék előtt,",
        "a járművezetőt kötelezi a haladási sebesség csökkentésére."
      ],
      "answer": "a járművezetőt kötelezi járműve megállítására a fényjelző készülék előtt,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Ha gépjármű vontatására vontatókötelet használnak: [1 pont]",
      "options": [
        "annak hossza nem lehet kevesebb 1,5 m-nél,",
        "a járművek közti távolság nem lehet kevesebb 2,5 m-nél,",
        "a járművek közti távolság nem lehet kevesebb 2 m-nél,"
      ],
      "answer": "a járművek közti távolság nem lehet kevesebb 2,5 m-nél,",
      "points": 1,
      "category": "Paragrafusok"
    },
    {
      "question": "A jármű közúti közlekedésre műszakilag alkalmatlannak minősül, ha: [1 pont]",
      "options": [
        "a gumiabroncs külső felületén szakadások, sérülések észlelhetők, amelyek kitakarják a szövetvázat vagy károsítják azt,",
        "nem rendelkezik legalább egy fehér színű, kereső fényszóróval,",
        "a távolsági fényszórókat nem lehet helyzetlámpákra átkapcsolni."
      ],
      "answer": "a gumiabroncs külső felületén szakadások, sérülések észlelhetők, amelyek kitakarják a szövetvázat vagy károsítják azt,",
      "points": 1,
      "category": "Paragrafusok"
    },
    {
      "question": "A motor nélküli jármű: [2 pont]",
      "options": [
        "emberi vagy állati erővel mozgatott pótkocsi a mozgássérült személyek mechanikus vagy elektromos tolószéke kivételével,",
        "emberi vagy állati erővel mozgatottjármű, villamos és trolibusz,",
        "az a gépjármű is, amelynek menetkész önsúlya nem haladja meg a 400 kg-ot."
      ],
      "answer": "emberi vagy állati erővel mozgatott pótkocsi a mozgássérült személyek mechanikus vagy elektromos tolószéke kivételével,",
      "points": 2,
      "category": "Paragrafusok"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
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
      "question": "Az itt ábrázolt útjelző tábla szerint tilos: [2 pont]",
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
      "question": "Az itt ábrázolt útjelző tábla olyan helyet jelöl: [2 pont]",
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
      "question": "Az itt ábrázolt útelzárást jelző korlát: [2 pont]",
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
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
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
      "question": "Az itt ábrázolt jelzéssel kötelező megjelölni: [2 pont]",
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
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
      "options": [
        "tiltja az oszlopban haladó járművek előzését,",
        "olyan útszakaszra ﬁgyelmeztet, ahol torlódások alakulnak ki, főként sűrű forgalom esetén hosszú emelkedőkön, hegyi átjárókon stb.,",
        "személygépkocsiknak tiltja a párhuzamos közlekedést."
      ],
      "answer": "olyan útszakaszra ﬁgyelmeztet, ahol torlódások alakulnak ki, főként sűrű forgalom esetén hosszú emelkedőkön, hegyi átjárókon stb.,",
      "points": 2,
      "image": "torlodas.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt, kiegészítő táblával ellátott jelzőtábla: [2 pont]",
      "options": [
        "a 80 m távolságban levö vasúti átjáróra, valamint a közút és a vasút kereszteződésének alakjára ﬁgyelmeztet,",
        "forgalmi akadályra figyelmeztet,",
        "közút és vasút szinten felüli keresztezésére ﬁgyelmeztet."
      ],
      "answer": "a 80 m távolságban levö vasúti átjáróra, valamint a közút és a vasút kereszteződésének alakjára ﬁgyelmeztet,",
      "points": 2,
      "image": "vasut.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Autóbusszal behajtani tilos,",
        "Autóbusszal behajtani szabad,.",
        "Autóbuszoknak fenntartott forgalmi sáv"
      ],
      "answer": "Autóbusszal behajtani tilos,",
      "points": 2,
      "image": "autobusz.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Kötelező kikerülési irány,",
        "Mentesítő útvonal iránya,.",
        "Egyirányú forgalom."
      ],
      "answer": "Mentesítő útvonal iránya,.",
      "points": 2,
      "image": "mentoutvonal.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Útirányváltozást előjelző tábla,",
        "Kötelező haladási irány,",
        "Fenntartott forgalmi sávok."
      ],
      "answer": "Fenntartott forgalmi sávok.",
      "points": 2,
      "image": "forgalmisavok.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Ajánlott sebességek,",
        "Általános megengedett legnagyobb sebességek,",
        "Korlátozás a forgalmi sávokban"
      ],
      "answer": "Általános megengedett legnagyobb sebességek,",
      "points": 2,
      "image": "sebessegek.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt, tilalmi jelzőtábla alatt elhelyezett kiegészítő tábla: [2 pont]",
      "options": [
        "olyan járműre korlátozza a tilalom hatályát, amelynek legnagyobb megengedett össztömege kisebb a kiegészítő táblán feltüntetett adatnál,",
        "olyan járműre korlátozza a tilalom hatályát, amelynek legnagyobb megengedett össztömege meghaladja a kiegészítő táblán feltüntetett adatot; járműszerelvény esetében a szerelvényt alkotó járművek együttes súlya az irányadó",
        "a jármű kettős tengelyére jutó megengedett legnagyobb terhelést jelzi."
      ],
      "answer": "olyan járműre korlátozza a tilalom hatályát, amelynek legnagyobb megengedett össztömege meghaladja a kiegészítő táblán feltüntetett adatot; járműszerelvény esetében a szerelvényt alkotó járművek együttes súlya az irányadó",
      "points": 2,
      "image": "meghaladas.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Az útpadkán várakozni tilos,",
        "Kavicsfelverődés,",
        "Abroncssérülés veszélye."
      ],
      "answer": "Kavicsfelverődés,",
      "points": 2,
      "image": "kavics.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
      "options": [
        "a meteorológiai állomás valamely berendezésére hívja fel a ﬁgyelmet,",
        "repülőtér közelségére hívja fel a ﬁgyelmet,",
        "olyan útszakaszra hívja fel a ﬁgyelmet, ahol a közúti közlekedés biztonságát erős oldalszél veszélyeztetheti."
      ],
      "answer": "olyan útszakaszra hívja fel a ﬁgyelmet, ahol a közúti közlekedés biztonságát erős oldalszél veszélyeztetheti.",
      "points": 2,
      "image": "szel.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Legkisebb megengedett sebesség,",
        "Legnagyobb megengedett sebesség,",
        "Ajánlott sebesség."
      ],
      "answer": "Legnagyobb megengedett sebesség,",
      "points": 2,
      "image": "legnagyobb.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Legkisebb megengedett sebesség,",
        "Legnagyobb megengedett sebesség,",
        "Ajánlott sebesség."
      ],
      "answer": "Legkisebb megengedett sebesség,",
      "points": 2,
      "image": "legkisebb.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "Útkereszteződést előjelző tábla,",
        "Zsákutcát előjelző tábla,",
        "Tilos balra kanyarodni"
      ],
      "answer": "Zsákutcát előjelző tábla,",
      "points": 2,
      "image": "zsakutca.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
      "options": [
        "azt a helyetjelöli, ahol a megállóhelyen álló villamost balról is ki lehet kerülni,",
        "a közúti forgalmi akadály kikerülésének módjáról tájékoztat,",
        "a villamospálya elzárását jelzi."
      ],
      "answer": "azt a helyetjelöli, ahol a megállóhelyen álló villamost balról is ki lehet kerülni,",
      "points": 2,
      "image": "balrol.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útburkolati jel: [2 pont]",
      "options": [
        "azt a területet jelzi, ahol tilos megállni,",
        "elválasztja az úttest szélét a kerékpárúttól,",
        "azt a területet jelzi, ahol tilos várakozni,"
      ],
      "answer": "azt a területet jelzi, ahol tilos várakozni,",
      "points": 2,
      "image": "varakozas.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
      "options": [
        "olyan helyre ﬁgyelmeztet, ahol a közút fölött alacsonyat szállnak a repülőgépek,",
        "repülőtéri saját használatú utat jelöl,",
        "tiltja a gépjárművek és a motor nélküli járművek behajtását a repülőtér területére."
      ],
      "answer": "olyan helyre ﬁgyelmeztet, ahol a közút fölött alacsonyat szállnak a repülőgépek,",
      "points": 2,
      "image": "repulogep.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "A szembejövő forgalom elsőbbsége,",
        "Elsőbbség a szembejövő forgalommal szemben,",
        "Kétirányú forgalom."
      ],
      "answer": "A szembejövő forgalom elsőbbsége,",
      "points": 2,
      "image": "szembejovo.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla: [2 pont]",
      "options": [
        "utasítja a vezetőt, hogy a megjelölt útszakaszon téli gumiabroncsot használjon,",
        "utasítja a vezetőt, hogy a megjelölt útszakaszon menet közben hóláncot használjon; a hóláncot legalább a hajtótengely két kerekén kell használni,",
        "arról tájékoztatja a járművezetőt, hogy a közelben gumiabroncs javító van."
      ],
      "answer": "utasítja a vezetőt, hogy a megjelölt útszakaszon menet közben hóláncot használjon; a hóláncot legalább a hajtótengely két kerekén kell használni,",
      "points": 2,
      "image": "holanc.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelzõ tábla jelentése: [2 pont]",
      "options": [
        "Aluljáró vagy felüljáró,",
        "Autópálya,",
        "Főútvonal."
      ],
      "answer": "Autópálya,",
      "points": 2,
      "image": "autopalya.png",
      "category": "Táblák"
    },
    {
      "question": "Az itt ábrázolt útjelző tábla jelentése: [2 pont]",
      "options": [
        "III. osztályú közút,",
        "Nemzetközi útvonal,",
        "II. osztályú közút."
      ],
      "answer": "Nemzetközi útvonal,",
      "points": 3,
      "image": "nemzetkozi.png",
      "category": "Táblák"
    },
    {
      "question": "Az útkereszteződésbe elsőként hajt be: [3 pont]",
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
      "question": "Ha a forgalomirányító rendőr jobb karja melső középtartásba, bal karja pedig oldalsó középtartásba van emelve, ennek jelentése \"Állj!\": [3 pont]",
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
      "question": "Az Ön járműve hányadikként halad át az útkereszteződésen: [3 pont]",
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
    },
    {
      "question": "A piros jármű hányadikként halad át az útkereszteződésen: [3 pont]",
      "options": [
        "elsőként egyszerre a zöld járművel,",
        "utolsóként,",
        "elsőként egyszerre a kék járművel."
      ],
      "answer": "utolsóként,",
      "points": 3,
      "image": "hatar.png",
      "category": "Szituációk"
    },
    {
      "question": "A kék jármű vezetője: [3 pont]",
      "options": [
        "köteles haladási elsőbbséget adni a piros jármű vezetőjének, aki abban  a folytonos sávban halad, amelybe át akar hajtani,",
        "a piros jármű vezetője előtt elsőbbséget élvez, mivel az előzésre kiszabott forgalmi sávban halad,",
        "a piros jármű vezetője előtt elsőbbséget élvez, mivel a lassú járművek számára fenntartott forgalmi sávban halad."
      ],
      "answer": "köteles haladási elsőbbséget adni a piros jármű vezetőjének, aki abban  a folytonos sávban halad, amelybe át akar hajtani,",
      "points": 3,
      "image": "sav.png",
      "category": "Szituációk"
    },
    {
      "question": "A járművek a következő sorrendben haladnak át az útkereszteződésen: [3 pont]",
      "options": [
        "1. az ön járműve, 2. kék, 3. piros,",
        "1. kék, 2. piros, 3. az ön járműve,",
        "1. kék, 2. az ön járműve, 3. piros."
      ],
      "answer": "1. kék, 2. piros, 3. az ön járműve,",
      "points": 3,
      "image": "szabaly.png",
      "category": "Szituációk"
    },
    {
      "question": "Az ön járműve hányadikként halad át az útkereszteződésen: [3 pont]",
      "options": [
        "harmadikként,",
        "másodikként",
        "elsőként."
      ],
      "answer": "elsőként.",
      "points": 3,
      "image": "elso.png",
      "category": "Szituációk"
    },
    {
      "question": "Az útkereszteződésen másodikként halad át: [3 pont]",
      "options": [
        "a sárga jármű,",
        "a zöld jármű,",
        "a piros jármű."
      ],
      "answer": "a piros jármű.",
      "points": 3,
      "image": "masodik.png",
      "category": "Szituációk"
    },
    {
      "question": "A járművek a következő sorrendben haladnak át az akadály körül: [3 pont]",
      "options": [
        "1. piros, 2. kék, 3. sárga, 4. zöld,",
        "1. kék, 2. zöld, 3. piros, 4. sárga,",
        "1. kék, 2. piros, 3. sárga, 4. zöld."
      ],
      "answer": "1. piros, 2. kék, 3. sárga, 4. zöld,",
      "points": 3,
      "image": "felvaltva.png",
      "category": "Szituációk"
    },
    {
      "question": "A járművek a következő sorrendben haladnak át az útkereszteződésen: [3 pont]",
      "options": [
        "1. a piros egyszerre a zölddel, 2. az ön járműve,",
        "1. az ön járműve, 2. a piros egyszerre a zölddel,",
        "1. zöld, 2. az ön járműve, 3. piros"
      ],
      "answer": "1. a piros egyszerre a zölddel, 2. az ön járműve,",
      "points": 3,
      "image": "mellekut.png",
      "category": "Szituációk"
    },
    {
      "question": "Az útkereszteződésen utolsóként halad át: [3 pont]",
      "options": [
        "az ön járműve,",
        "a villamos egyszerre az ön járművével,",
        "a sárga jármű."
      ],
      "answer": "az ön járműve,",
      "points": 3,
      "image": "sin.png",
      "category": "Szituációk"
    },
    {
      "question": "A zöld jármű hányadikként halad át az útkereszteződésen: [3 pont]",
      "options": [
        "harmadikként,",
        "elsőként,",
        "másodikként."
      ],
      "answer": "másodikként.",
      "points": 3,
      "image": "zold.png",
      "category": "Szituációk"
    },
    {
      "question": "Ha az útkereszteződés elhagyására felszólító fényjelző világít: [3 pont]",
      "options": [
        "mindkét villamos vezetője elsőbbséget élvez a többi jármű előtt,",
        "a balra kanyarodó piros jármű vezetője köteles elsőbbséget adni a szembejővő zöld és sárga járműnek, valamint mindkét villamosnak,",
        "a balra kanyarodó piros jármű vezetője elsőbbséget élvez a szembejővő zöld és sárga jármű, valamint mindkét villamos előtt."
      ],
      "answer": "a balra kanyarodó piros jármű vezetője elsőbbséget élvez a szembejővő zöld és sárga jármű, valamint mindkét villamos előtt.",
      "points": 3,
      "image": "balra.png",
      "category": "Szituációk"
    },
    {
      "question": "Az útkereszteződésen másodikként halad át: [3 pont]",
      "options": [
        "a piros jármű",
        "a kék jármű,",
        "az ön járműve."
      ],
      "answer": "a piros jármű",
      "points": 3,
      "image": "piros.png",
      "category": "Szituációk"
    },
    {
      "question": "A járművek a következő sorrendben haladnak át az útkereszteződésen: [3 pont]",
      "options": [
        "1. kék egyszerre az ön járművével, 2. zöld, 3. piros,",
        "1. zöld, 2. piros, 3. kék, 4. az ön járműve,",
        "1. az ön járműve, 2. zöld, 3. kék egyszerre a pirossal."
      ],
      "answer": "1. az ön járműve, 2. zöld, 3. kék egyszerre a pirossal.",
      "points": 3,
      "image": "egyszerre.png",
      "category": "Szituációk"
    },
    {
      "question": "A kék jármű hányadikként halad at az útkereszteződésen: [3 pont]",
      "options": [
        "elsőként,",
        "másodikként,",
        "utolsóként."
      ],
      "answer": "másodikként,",
      "points": 3,
      "image": "kanyarodas.png",
      "category": "Szituációk"
    },
    {
      "question": "A piros jármű vezetője számára megengedett: [4 pont]",
      "options": [
        "a zöld fényű nyíl jelzésére folytathatja útját jobbra; közben elsőbbsége van a zöld járművel szemben, de elsőbbségett kell adnia a szabad irányban átkelő gyalogosoknak,",
        "a kékjárművel egyszerre haladhat át az útkereszteződésen; közben tilos veszélyeztetnie a szabad irányban haladó zöld jármű vezetőjét, és tilos korlátoznia a gyalogosokat,",
        "a zöld fényű kiegészítő nyíl jelzésére bekanyarodhat jobbra; közben haladási elsőbbséget köteles adni a szabad irányban haladó járműveknek,valamint a szabad irányban átkelő gyalogosoknak is."
      ],
      "answer": "a zöld fényű kiegészítő nyíl jelzésére bekanyarodhat jobbra; közben haladási elsőbbséget köteles adni a szabad irányban haladó járműveknek,valamint a szabad irányban átkelő gyalogosoknak is.",
      "points": 4,
      "image": "gyalogosok.png",
      "category": "Szituációk"
    },
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

    
  
  // Teszt indítása a kiválasztott kategória alapján
  document.getElementById("startQuizButton").addEventListener("click", () => {
    let selectedCategory = document.getElementById("quiz-category").value;
    
    // Kérdések szűrése a kiválasztott kategória alapján
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
    
    // Elindítjuk a tesztet a szűrt kérdésekkel
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

function getRandomQuestions(allQuestions, count, targetPoints) {
  if (!allQuestions || allQuestions.length === 0) {
      console.error("Hiba: Az allQuestions tömb üres vagy nincs megfelelően inicializálva!");
      return [];
  }

  let categories = [...new Set(allQuestions.map(q => q.category))];
  let selectedQuestions = [];
  let remainingQuestions = [...allQuestions];
  let currentPoints = 0;

  // Először minden kategóriából választunk egy kérdést
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

  // A maradék helyek kitöltése úgy, hogy az összpontszám 55 legyen
  while (selectedQuestions.length < count && remainingQuestions.length > 0) {
      shuffleArray(remainingQuestions);
      let selected = remainingQuestions[0];

      if (currentPoints + selected.points <= targetPoints) {
          selectedQuestions.push(selected);
          currentPoints += selected.points;
      }
      remainingQuestions.shift();
  }

  console.log("Összpontszám:", currentPoints);
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
  console.log(selectedQuestions);

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

    // Ha van kép, hozzáadjuk
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
          let timestamp = score.timestamp 
          ? new Date(score.timestamp).toLocaleString("hu-HU", { 
              year: "numeric", 
              month: "long",  // 2-digit
              day: "2-digit", 
              hour: "2-digit", 
              minute: "2-digit", 
              second: "2-digit"
            }).replace(/\./g, "").replace(/\s/g, ". ") 
          : "N/A";

          let duration = score.duration || 0;
          let minutes = Math.floor(duration / 60);
          let seconds = duration % 60;
          let formattedDuration = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

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
      scoreContainer.html("<p>Nincs elérhető adat.</p>").show();
      scoreButton.text("Eredmények elrejtése");
  }

  $("#maintitle").hide();
  $("#username").hide();
  $("#secondarytitle").hide();
  $("#quiz-category").hide()
  $("#startQuizButton").hide();
  $("#help-button").hide();
  $("#backButton").show();
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

    let q = shuffledQuestions[questionIndex];  // 🔹 Most már a kevert kérdésekből nézzük!
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
        console.log(`🎯 Helyes válasz! +${q.points} pont`);
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
          answerElement.style.display = "none";
          answerElement.style.marginTop = "5px";
          answerElement.style.padding = "10px";
          answerElement.style.background = "#e6f7ff"; // Világoskék háttér
          answerElement.style.borderLeft = "4px solid #007bff"; // Kiemelés
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
  let categorySelect = document.getElementById("quiz-category");
  if (!categorySelect) {
      console.warn("⚠ Hiba: A kérdéskategória kiválasztó ('quiz-category') nem található!");
      return;
  }
  let selectedCategory = categorySelect.value;
  let filteredQuestions = questions.filter(q => selectedCategory === "Minden" || q.category === selectedCategory);
  loadQuiz(filteredQuestions);
  window.scrollTo({ top: 0, behavior: "smooth" });
}

submitButton.addEventListener("click", checkAnswers);
showAnswersButton.addEventListener("click", showCorrectAnswers);
restartButton.addEventListener("click", restartQuiz);
showAnswersButton.addEventListener("click", toggleCorrectAnswers);
clearButton.addEventListener("click", clearScores);