let sel = window.getSelection();
let rel1 = document.createRange();
rel1.selectNode(document.getElementById("cal1"));
let rel2 = document.createRange();
rel2.selectNode(document.getElementById("cal2"));

//슬라이드 초기값
let slideIndex = 1;
//시작시 실행되는 showSlides함수 slideIndex=1
showSlides(slideIndex);

//양 옆 화살표 온 클릭 함수
function plusSlides(n) {
  // n값에 slideIndex의 값을 더한 후 showSlides함수를 실행
  showSlides((slideIndex += n));
}

//버튼 클릭시 실행되는 함수
function currentSlide(n) {
  // n값에 slideIndex의 값을 대입한 후 showSlides함수를 실행
  showSlides((slideIndex = n));
}

//showSlides 실행 전달받은 n값
function showSlides(n) {
  let i;
  // 각 사진이 들어있는 div.mySlides 불러온다
  let slides = document.getElementsByClassName("mySlides");
  // 각 이미지에 대한 버튼 클래스를 불러온다
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
  // slides[slideIndex - 1] if문으로 처리받은 slideIndex값에 -1을 해 slides 의 클래스를 block으로 만든다
  slides[slideIndex - 1].style.display = "block";
  // 그에 맞는 dot 클래스를 가진 span 에 active 클래스를 추가한다
  dots[slideIndex - 1].className += " active";
}

fetch("passage.json")
  .then((response) => response.json())
  .then((json) => {
    const passage = document.getElementById("passage");
    let resultHTML = "";
  });

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
          let r = sel.getRangeAt(0).getBoundingClientRect();
          let rb1 = rel1.getBoundingClientRect();
          let rb2 = rel2.getBoundingClientRect();

          if (mapoWord == "Mapodong") {
            let resultHTML = "";
            let json =
              data.searchResultMap.searchResultListMap.MEANING.items[0];
            resultHTML += `<div><strong>${mapoWord}</strong>
            </div><hr/>
            <div>${json.expEntry}</div><br/>
            <div>1. ${json.meansCollector[0].means[0].value}</div><hr/>
            <div class="source">출처: ${json.sourceDictnameKO}</div>`;
            word.style.top =
              ((r.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((r.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";
            word.style.display = "block";
            word.innerHTML = resultHTML;
            return;
          } else if (mapoWord == "Mapodong-e") {
            let resultHTML = "";
            let json =
              data.searchResultMap.searchResultListMap.MEANING.items[0];
            resultHTML += `<div><strong>${mapoWord}</strong>
            </div><hr/>
            <div>명사</div><br/>
            <div>1. 마포구 상징 캐릭터</div><hr/>
            <div class="source">출처: 마포구청 홈페이지</div>`;
            word.style.top =
              ((r.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((r.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";
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
              resultHTML += `<div><strong>${mapoWord}</strong>
              </div><hr/>
              <div>명사</div><br/>
              <div>1. 마포(구)(서울특별시의 서부에 있는 구이다)</div><hr/>
              <div class="source">출처: 동아출판 프라임 한영사전</div>`;
            } else {
              resultHTML = `<div>${json.expEntry}</div><hr/>`;
              for (let i = 0; i < json.meansCollector.length; i++) {
                if (json.meansCollector[i].partOfSpeech) {
                  resultHTML += `<div>${json.meansCollector[i].partOfSpeech}</div><br/>`;
                }
                for (let j = 0; j < json.meansCollector[i].means.length; j++) {
                  if (
                    json.meansCollector[i].means[j].exampleOri &&
                    checkEng(selectText())
                  ) {
                    resultHTML += `<div>${j + 1}. ${
                      json.meansCollector[i].means[j].value
                    }</div>
                    <div>
                    <div>${json.meansCollector[i].means[j].exampleOri}</div>
                    <div>${
                      json.meansCollector[i].means[j].exampleTrans
                    }</div><br/>
                    </div>`;
                  } else if (json.meansCollector[i].means[j].exampleOri) {
                    resultHTML += `<div>${j + 1}. ${
                      json.meansCollector[i].means[j].value
                    }</div>
                    <div>
                    <div>${
                      json.meansCollector[i].means[j].exampleOri
                    }</div><br/>
                    </div>`;
                  } else {
                    resultHTML += `<div>${j + 1}. ${
                      json.meansCollector[i].means[j].value
                    }</div>`;
                  }
                }
                resultHTML += "<hr/>";
              }
              resultHTML += `<div class="source">출처: ${json.sourceDictnameKO}</div>`;
            }
            word.style.top =
              ((r.bottom - rb2.top) * 100) / (rb1.top - rb2.top) + "px";
            word.style.left =
              ((r.left - rb2.left) * 100) / (rb1.left - rb2.left) + "px";
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

document.querySelector(".btn-read-part1").addEventListener("click", (e) => {
  const audio = new Audio("tts/part1.mp3");
  audio.pause(); // 일시 정지
  audio.currentTime = 0; // 재생 위치를 처음으로 설정
  audio.play(); // 처음부터 다시 재생됨
});

document.querySelector(".btn-read-part2").addEventListener("click", (e) => {
  const audio = new Audio("tts/part2.mp3");
  audio.pause(); // 일시 정지
  audio.currentTime = 0; // 재생 위치를 처음으로 설정
  audio.play(); // 처음부터 다시 재생됨
});

document.querySelector(".btn-read-part3").addEventListener("click", (e) => {
  const audio = new Audio("tts/part3.mp3");
  audio.pause(); // 일시 정지
  audio.currentTime = 0; // 재생 위치를 처음으로 설정
  audio.play(); // 처음부터 다시 재생됨
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
