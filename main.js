let sel = window.getSelection();
let rel1 = document.createRange();
rel1.selectNode(document.getElementById("cal1"));
let rel2 = document.createRange();
rel2.selectNode(document.getElementById("cal2"));

//슬라이드 초기값
let slideIndex = 1;
showSlides(slideIndex);

//양 옆 화살표 온 클릭 함수
function plusSlides(n) {
  showSlides((slideIndex += n));
}

//버튼 클릭시 실행되는 함수
function currentSlide(n) {
  showSlides((slideIndex = n));
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

  for (i = 0; i < slides.length; i++) {
    // 모든 사진을 none으로 처리
    slides[i].style.display = "none";
  }

  for (i = 0; i < dots.length; i++) {
    // dot 클래스가 갖고있는 모든 active 클래스를 지운다 ("" 로 치환)
    dots[i].className = dots[i].className.replace(" active", "");
  }

  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

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
  const regExp = /[a-zA-Z]/g; // 영어
  if (regExp.test(str)) {
    return true;
  } else {
    return false;
  }
}

//단어 해석 함수
document.onpointerup = function (e) {
  if (!selectText().isCollapsed) {
    let word = document.getElementById("word");
    fetch(
      `https://my-simple-mapo-proxy.herokuapp.com/https://dict.naver.com/api3/enko/search?query=${selectText()}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.searchResultMap) {
          let json = data.searchResultMap.searchResultListMap.WORD.items[0];
          let mapoWord = data.searchResultMap.searchResultListMap.WORD.query;
          let range = sel.getRangeAt(0).getBoundingClientRect();
          let rb1 = rel1.getBoundingClientRect();
          let rb2 = rel2.getBoundingClientRect();

          if (mapoWord == "Mapodong") {
            let resultHTML = "";
            let json =
              data.searchResultMap.searchResultListMap.MEANING.items[0];

            resultHTML += `
            <div><strong>${mapoWord}</strong>
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
          } else if (mapoWord == "Mapodong-e") {
            let resultHTML = "";

            resultHTML += `
            <div><strong>${mapoWord}</strong>
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
              <div><strong>${mapoWord}</strong>
              </div><hr>
              <strong class="parts-of-speech"><span>명사</span></strong>
              <div>1. 마포(구)(서울특별시의 서부에 있는 구이다)</div><hr>
              <div class="source">출처: 동아출판 프라임 한영사전</div>`;
            } else {
              resultHTML = `<div>${json.expEntry}</div><hr>`;
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
                    <div>${
                      json.meansCollector[i].means[j].exampleTrans
                    }</div><br>
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

            word.style.top =
              ((range.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((range.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";
            word.style.display = "block";
            word.innerHTML = resultHTML;
          }
        }
      });
  } else {
    word.style.display = "none";
    word.innerHTML = "";
  }
};

//음성 버튼 클릭 이벤트
const audio1 = new Audio("tts/part1.mp3");
document.querySelector(".btn-read-part1").addEventListener("click", (e) => {
  audio1.pause(); // 일시 정지
  audio1.currentTime = 0; // 재생 위치를 처음으로 설정
  audio1.play(); // 처음부터 다시 재생됨
});

const audio2 = new Audio("tts/part2.mp3");
document.querySelector(".btn-read-part2").addEventListener("click", (e) => {
  audio2.pause(); // 일시 정지
  audio2.currentTime = 0; // 재생 위치를 처음으로 설정
  audio2.play(); // 처음부터 다시 재생됨
});

const audio3 = new Audio("tts/part3.mp3");
document.querySelector(".btn-read-part3").addEventListener("click", (e) => {
  audio3.pause(); // 일시 정지
  audio3.currentTime = 0; // 재생 위치를 처음으로 설정
  audio3.play(); // 처음부터 다시 재생됨
});

//문장해석 버튼 클릭 이벤트
document.querySelector(".btn-korean-part1").addEventListener("click", (e) => {
  const korean = document.querySelectorAll(".text-korean-part1");
  if (korean.item(0).style.display == "block") {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "none";
    }
  } else {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "block";
    }
  }
});

document.querySelector(".btn-korean-part2").addEventListener("click", (e) => {
  const korean = document.querySelectorAll(".text-korean-part2");
  if (korean.item(0).style.display == "block") {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "none";
    }
  } else {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "block";
    }
  }
});

document.querySelector(".btn-korean-part3").addEventListener("click", (e) => {
  const korean = document.querySelectorAll(".text-korean-part3");
  if (korean.item(0).style.display == "block") {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "none";
    }
  } else {
    for (let i = 0; i < korean.length; i++) {
      korean.item(i).style.display = "block";
    }
  }
});

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

//랜덤 퀴즈 문제 출제
let randomWord = "";
let resultHTML = "";
let findBtnIdx = 0;
fetch("/quizWord.json")
  .then((response) => response.json())
  .then((json) => {
    let randomPartNum = Math.floor(Math.random() * json.quizWord.length);
    console.log("randomPartNum", randomPartNum);
    let quizWordLength = json.quizWord[randomPartNum].word.length;
    let randomWordNum = Math.floor(Math.random() * quizWordLength);
    console.log("randomWordNum", randomWordNum);
    randomWord = json.quizWord[randomPartNum].word[randomWordNum];
    console.log("randomWord", randomWord);

    let quizItem = document.querySelectorAll(
      `.text-english-part${randomPartNum + 1}`
    );
    let quiz = document.getElementById("quiz");

    randomWordArray.push(randomWord);

    while (randomWordArray.length < 4) {
      let randomNum = randomButton(quizWordLength);
      let jsonRandomWord = json.quizWord[randomPartNum].word[randomNum];

      if (!randomWordArray.includes(jsonRandomWord)) {
        randomWordArray.push(jsonRandomWord);
      }
    }
    console.log("randomWordArray", randomWordArray);
    shuffle(randomWordArray);
    console.log("randomWordArray", randomWordArray);

    findBtnIdx = randomWordArray.indexOf(randomWord) + 1;
    console.log("findBtnIdx", findBtnIdx);

    resultHTML += `
    <div class="col m6 padding-large">
    <img src="images/part${
      randomPartNum + 1
    }.jpg" class="round image opacity-min-part${
      randomPartNum + 1
    }"  width="100%">
    </div>
    <div class="col m6 padding-large" id="quiz-passage">
    ${quizItem.item(0).outerHTML}
    <div/><br>`;

    for (let i = 1; i < quizItem.length; i++) {
      let passage = quizItem.item(i).outerText;
      let passageBlank = passage.replace(randomWord, "______");

      // console.log("111111", passageBlank);
      resultHTML += `
      <p class="text-english">${passageBlank}</p><br>`;
    }

    let j = 0;
    for (let i = 0; i < randomWordArray.length; i += 2) {
      resultHTML += `<div class="quiz-button-div">`;

      for (j; j < randomWordArray.length; j++) {
        if (1 + j == findBtnIdx) {
          resultHTML += `
          <button class="custom-btn btn btn-answer btn-${
            1 + j
          }" onclick="quizBtn(${1 + j})">${randomWordArray[j]}</button>`;
        } else {
          resultHTML += `
          <button class="custom-btn btn btn-${1 + j}" onclick="quizBtn(${
            1 + j
          })">${randomWordArray[j]}</button>`;
        }

        if (j == 1) {
          j = randomWordArray.length;
        }
      }

      j = randomWordArray.length - 2;
      resultHTML += "</div>";
    }

    quiz.innerHTML = resultHTML;
  });

//퀴즈 버튼 클릭 함수
function quizBtn(buttonNum) {
  let buttonText = document.querySelector(`.btn-${buttonNum}`).innerText;

  if (randomWord.trim() == buttonText.trim()) {
    console.log("정답");

    let passageBlank = resultHTML.replaceAll(
      "______",
      `<span class="btnDeco">${buttonText}</span><span>&nbsp</span>`
    );
    quiz.innerHTML = passageBlank;
  } else {
    console.log("오류");
  }
}
