/**
 * 슬라이드 박스
 */

//슬라이드 초기값
let slideIndex = 1;
showSlides(slideIndex);

//양 옆 화살표 온 클릭 함수
function plusSlides(n) {
  showSlides((slideIndex += n));

  target.item(slideIndex - 1).textContent = "";
  dynamicText(slideString(slideIndex - 1), slideIndex - 1);
}

//버튼 클릭시 실행되는 함수
function currentSlide(n) {
  showSlides((slideIndex = n));

  target.item(slideIndex - 1).textContent = "";
  dynamicText(slideString(slideIndex - 1), slideIndex - 1);
}

//showSlides 실행 전달받은 n값
function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("mySlides");
  let dots = document.getElementsByClassName("dot");

  // n이 전달받은 n의 값이 길이보다 크면(3) 1로 초기화 즉 다시 첫번째 사진 인덱스로 만든다
  if (n > slides.length) {
    slideIndex = 1;
  }

  // n이 1보다 작을 경우 mySlide 의 길이를 인덱스로 설정
  if (n < 1) {
    slideIndex = slides.length;
  }

  // 모든 사진을 none으로 처리
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }

  // dot 클래스가 갖고있는 모든 active 클래스를 지운다 ("" 로 치환)
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

//모든 슬라이드 텍스트
let target = document.querySelectorAll(".text");

//첫번째 슬라이드 텍스트 dynamicText 함수 실행
dynamicText(slideString(slideIndex - 1), 0);

//슬라이드 자동 이동 함수
setInterval(() => {
  slideIndex++;
  showSlides(slideIndex);

  target.item(slideIndex - 1).textContent = "";
  dynamicText(slideString(slideIndex - 1), slideIndex - 1);
}, 5000);

//해당 슬라이드 텍스트를 한문자씩 split하는 함수
function slideString(num) {
  let stringArr = ["Sky Park", "World Cup Park", "Mangwon Hangang Park"];
  let selectString = stringArr[num];
  let selectStringArr = selectString.split("");

  return selectStringArr;
}

// 한글자씩 슬라이드 텍스트 출력 함수
function dynamicText(arr, num) {
  if (arr.length > 0) {
    target.item(num).textContent += arr.shift();
    setTimeout(() => {
      dynamicText(arr, num);
    }, 100);
  }
}

/**
 * 단어 해석 박스
 */

//드래그한 텍스트 가져오는 함수
function selectText() {
  let selectionText = ""; //마우스로 드래그한 글

  if (document.getSelection) {
    selectionText = document.getSelection();
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }
  return selectionText;
}

//영어 단어 체크 함수
function checkEng(str) {
  const regExp = /[a-zA-Z]/g; // 영어 정규표현식
  if (regExp.test(str)) {
    return true;
  } else {
    return false;
  }
}

let sel = window.getSelection(); //선택된 텍스트의 범위를 나타냄
let rel1 = document.createRange(); //새 Range 객체를 리턴
rel1.selectNode(document.getElementById("cal1"));
let rel2 = document.createRange(); //새 Range 객체를 리턴
rel2.selectNode(document.getElementById("cal2"));

//단어 해석 함수
document.onpointerup = function () {
  if (!selectText().isCollapsed) {
    let word = document.getElementById("word");
    fetch(`https://hee-backend.shop:8080/english?id=${selectText()}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.searchResultMap) {
          let json = data.searchResultMap.searchResultListMap.WORD.items[0];
          let mapoWord = data.searchResultMap.searchResultListMap.WORD.query;
          let range = sel.getRangeAt(0).getBoundingClientRect();
          let rb1 = rel1.getBoundingClientRect();
          let rb2 = rel2.getBoundingClientRect();

          //단어가 Mapodong 경우
          if (mapoWord == "Mapodong") {
            let resultHTML = "";
            let json =
              data.searchResultMap.searchResultListMap.MEANING.items[0];

            resultHTML += `
            <div class="title"><strong>${mapoWord}</strong>
            </div><hr>
            <strong class="parts-of-speech"><span>명사</span></strong>
            <div>1. ${json.expEntry}${json.meansCollector[0].means[0].value}</div><hr>
            <div class="source">출처: ${json.sourceDictnameKO}</div>`;

            word.style.top =
              ((range.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((range.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";
            word.style.display = "block";
            word.innerHTML = resultHTML;

            return;
          }

          //단어가 Mapodong-e 경우
          else if (mapoWord == "Mapodong-e") {
            let resultHTML = "";

            resultHTML += `
            <div class="title"><strong>${mapoWord}</strong>
            </div><hr>
            <strong class="parts-of-speech"><span>명사</span></strong>
            <div>1. 마포구 상징 캐릭터</div><hr>
            <div class="source">출처: 마포구청 홈페이지</div>`;

            word.style.top =
              ((range.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((range.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";
            word.style.display = "block";
            word.innerHTML = resultHTML;

            return;
          } else if (json) {
            let resultHTML = "";

            if (
              mapoWord == "mapo" ||
              mapoWord == "Mapo" ||
              mapoWord == "Mapo's"
            ) {
              resultHTML += `
              <div class="title"><strong>${mapoWord}</strong>
              </div><hr>
              <strong class="parts-of-speech"><span>명사</span></strong>
              <div>1. 마포(구)(서울특별시의 서부에 있는 구이다)</div><hr>
              <div class="source">출처: 나무위키</div>`;
            } else {
              resultHTML = `<div class="title">${json.expEntry}</div><hr>`;
              for (let i = 0; i < json.meansCollector.length; i++) {
                if (json.meansCollector[i].partOfSpeech) {
                  resultHTML += `<strong class="parts-of-speech"><span>${json.meansCollector[i].partOfSpeech}</span></strong>`;
                }
                for (let j = 0; j < json.meansCollector[i].means.length; j++) {
                  if (
                    json.meansCollector[i].means[j].exampleOri &&
                    checkEng(selectText())
                  ) {
                    resultHTML += `
                    <div>${j + 1}. ${
                      json.meansCollector[i].means[j].value
                    }</div>
                    <div>
                    <div>${json.meansCollector[i].means[j].exampleOri}</div>
                    <div>${json.meansCollector[i].means[j].exampleTrans}</div>
                    </div>`;
                  } else if (json.meansCollector[i].means[j].exampleOri) {
                    resultHTML += `
                    <div>${j + 1}. ${
                      json.meansCollector[i].means[j].value
                    }</div>
                    <div>
                    <div>${json.meansCollector[i].means[j].exampleOri}</div>
                    </div>`;
                  } else {
                    resultHTML += `<div>${j + 1}. ${
                      json.meansCollector[i].means[j].value
                    }</div>`;
                  }
                }
                resultHTML += "<hr>";
              }
              resultHTML += `<div class="source">출처: ${json.sourceDictnameKO}</div>`;
            }

            //단어 해석 박스 위치 지정
            word.style.top =
              ((range.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((range.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";

            word.innerHTML = resultHTML;
            word.style.display = "block"; //단어 해석 박스 생성
          }
        }
      });
  } else {
    word.style.display = "none";
    word.innerHTML = "";
  }
};

/**
 * 음성 버튼 박스
 */

//음성 버튼 클릭 이벤트
let audio = new Audio();

function readBtn(readNum) {
  audio.src = `tts/part${readNum}.mp3`;
  audio.pause(); // 일시 정지
  audio.currentTime = 0; // 재생 위치를 처음으로 설정
  audio.play(); // 처음부터 다시 재생됨
}

/**
 * 문장해석 버튼 박스
 */

//문장해석 버튼 클릭 이벤트
function koreanBtn(partNum) {
  const korean = document.querySelectorAll(`.text-korean-part${partNum}`);

  //현재 지문 해석이 있을 경우
  if (korean.item(0).style.display == "block") {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "none";
    }
  } else {
    //현재 지문 해석이 없을경우
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "block";
    }
  }
}

/**
 * 랜덤 퀴즈 박스
 */

//랜덤 버튼 단어 생성
let randomWordArray = [];
function randomButton(quizWordLength) {
  return Math.floor(Math.random() * quizWordLength);
}

//버튼 단어 랜덤 정렬 함수
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/**
 * 랜덤 퀴즈 생성 함수
 */
let randomWord = "";
let resultHTML = "";
let findBtnIdx = 0;
let randomPartNum = 0;

function randomQuiz() {
  fetch("json/quizWord.json")
    .then((response) => response.json())
    .then((json) => {
      randomPartNum = Math.floor(Math.random() * json.quizWord.length); //랜덤 지문 선택
      let quizWordLength = json.quizWord[randomPartNum].word.length; //선택된 지문 총 단어 갯수
      let randomWordNum = Math.floor(Math.random() * quizWordLength); //선택된 지문 단어 랜덤 선택
      randomWord = json.quizWord[randomPartNum].word[randomWordNum];

      let quizItem = document.querySelectorAll(
        `.text-english-part${randomPartNum + 1}`
      );
      let quizItemKorean = document.querySelectorAll(
        `.text-korean-part${randomPartNum + 1}`
      );

      let quiz = document.getElementById("quiz");
      randomWordArray.push(randomWord);

      //정답 단어를 포함한 총 4개 단어 배열
      while (randomWordArray.length < 4) {
        let randomNum = randomButton(quizWordLength);
        let jsonRandomWord = json.quizWord[randomPartNum].word[randomNum];

        //배열 안에 해당 단어가 없을경우 push
        if (!randomWordArray.includes(jsonRandomWord)) {
          randomWordArray.push(jsonRandomWord);
        }
      }

      shuffle(randomWordArray); //버튼 배열 단어 랜덤 정렬

      findBtnIdx = randomWordArray.indexOf(randomWord) + 1; //정답 index 변수
      resultHTML += `
    <h1>Random Quiz</h1><br>
    <div class="col m6 padding-large img-animation">
    <img src="images/part${
      randomPartNum + 1
    }-front.svg" class="round image opacity-min-part${
        randomPartNum + 1
      }-front"  width="100%">
    <img src="images/part${
      randomPartNum + 1
    }-back.svg" class="padding-large round image opacity-min-part${
        randomPartNum + 1
      }-back"  width="100%">
    </div>
    <div class="col m6 padding-large" id="quiz-passage">
    <h1 class="center text-english-title">${quizItem.item(0).outerText}</h1>
    <h1 class="center text-korean-title"> ${
      quizItemKorean.item(0).outerText
    }</h1><br>
    <div/><br>`;

      //퀴즈 지문 빈칸 생성
      for (let i = 1; i < quizItem.length; i++) {
        let passage = quizItem.item(i).outerText;
        let passageBlank = passage.replace(randomWord, "______");

        resultHTML += `
      <p class="text-english">${passageBlank}</p>
      <p class="text-korean">${quizItemKorean.item(i).outerText}</p><br>`;
      }
      resultHTML += `
    <div class="quiz-button-div">
    <div class="toast-answer">정답입니다!</div>
    <div class="toast-wrong">오답입니다!</div>
    </div>`;

      //퀴즈 버튼 생성
      let j = 0;
      for (let i = 0; i < randomWordArray.length; i += 2) {
        resultHTML += `<div class="quiz-button-div">`;

        for (j; j < randomWordArray.length; j++) {
          if (1 + j == findBtnIdx) {
            resultHTML += `
          <button class="custom-btn btn btn-${1 + j}" onclick="quizBtn(${
              1 + j
            })">${randomWordArray[j]}</button>`;
          } else {
            resultHTML += `
          <button class="custom-btn btn-${
            1 + j
          } btn btn-wrong" onclick="quizBtn(${1 + j})">${
              randomWordArray[j]
            }</button>`;
          }

          if (j == 1) {
            j = randomWordArray.length;
          }
        }

        j = randomWordArray.length - 2;
        resultHTML += "</div>";
      }

      resultHTML += `
    <div class="quiz-button-div">
    <button class="custom-btn btn btn-${
      1 + randomWordArray.length
    } quiz-restart-button" onclick="quizBtn(${
        1 + randomWordArray.length
      })">New Quiz</button>
    </div>`;

      quiz.innerHTML = resultHTML;
    });
}
randomQuiz(); //랜덤 퀴즈 함수 호출

/**
 * #quiz 새로고침 함수
 */
window.onload = function () {
  let protocol = window.location.protocol;
  let hostname = window.location.hostname;
  let port = window.location.port;

  if (window.location == `${protocol}//${hostname}:${port}/#quiz`) {
    setTimeout(function () {
      window.location.replace("#quiz");
    }, 1000);
  }
};

/**
 * 랜덤 퀴즈 버튼 클릭 함수
 */
let passageWrong = "";

function quizBtn(buttonNum) {
  let buttonText = document.querySelector(`.btn-${buttonNum}`).innerText;

  //새 퀴즈 버튼 이벤트
  if (buttonNum === randomWordArray.length + 1) {
    newQuiz();
    return;
  }

  //정답 버튼 이벤트
  if (buttonNum === findBtnIdx) {
    //지문 빈칸을 정답 단어로 치환
    let passageBlank = resultHTML
      .replaceAll(
        "______",
        `<span class="textDeco">${buttonText}</span><span>&nbsp</span>`
      )
      .replace(
        `class="center text-korean-title"`,
        `class="center text-korean-title" style="display: block"`
      )
      .replaceAll(
        `class="text-korean"`,
        `class="text-korean" style="display: block"`
      )
      .replaceAll("btn btn-wrong", `btn-pressed" disabled = "true`)
      .replace(`btn-${buttonNum}`, `btn-${buttonNum} btn-answer`)
      .replace(
        "toast-answer",
        `toast-answer toast-answer-animation" style="display: block;`
      );
    quiz.innerHTML = passageBlank;

    setTimeout(() => {
      document.querySelector(".toast-answer").style.display = "none";
    }, 2000);

    //다시하기 버튼 생성
    document.querySelector(".quiz-restart-button").style.display = "block";
  } else {
    if (passageWrong == "") {
      passageWrong = resultHTML
        .replace(
          `btn-${buttonNum} btn btn-wrong`,
          `btn-${buttonNum} btn-pressed" disabled = "true`
        )
        .replace("toast-wrong", `toast-wrong toast-wrong-animation`);
    } else {
      passageWrong = passageWrong
        .replace(
          `btn-${buttonNum} btn`,
          `btn-${buttonNum} btn-pressed" disabled = "true`
        )
        .replace("toast-wrong", `toast-wrong toast-wrong-animation`);
    }

    quiz.innerHTML = passageWrong;
  }
}

/**
 * 새로운 퀴즈 생성 함수
 */
function newQuiz() {
  //초기화
  randomWordArray = [];
  randomWord = "";
  resultHTML = "";
  findBtnIdx = 0;
  randomPartNum = 0;
  passageWrong = "";

  document.getElementById("quiz").addEventListener("load", () => {
    window.location.href + " #quiz";
  });

  randomQuiz(); //랜덤 퀴즈 생성 함수 호출

  setTimeout(() => {
    window.location.replace("#quiz"); //0.2초 뒤에 id quiz 이동
  }, 200);
}
