// 이벤트 영역
const text = document.querySelector(".text-english").innerText;
const btnRead = document.getElementById("btn-read");
const btnKorean = document.getElementById("btn-korean");
let sel = window.getSelection();
let rel1 = document.createRange();
rel1.selectNode(document.getElementById("cal1"));
let rel2 = document.createRange();
rel2.selectNode(document.getElementById("cal2"));

function selectText() {
  let selectionText = ""; //마우스로 드래그한 글
  if (document.getSelection) {
    selectionText = document.getSelection();
  } else if (document.selection) {
    selectionText = document.selection.createRange().text;
  }
  return selectionText;
}

function checkEng(str) {
  const regExp = /[a-zA-Z]/g; // 영어
  if (regExp.test(str)) {
    return true;
  } else {
    return false;
  }
}

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

          if (json.meansCollector[0].means[0].value) {
            let r = sel.getRangeAt(0).getBoundingClientRect();
            let rb1 = rel1.getBoundingClientRect();
            let rb2 = rel2.getBoundingClientRect();
            let resultHTML = "";

            if (mapoWord == "mapo" || mapoWord == "Mapo") {
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

let audio = new Audio("tts/part1.mp3");
btnRead.addEventListener("click", (e) => {
  audio.pause(); // 일시 정지
  audio.currentTime = 0; // 재생 위치를 처음으로 설정
  audio.play(); // 처음부터 다시 재생됨
});

btnKorean.addEventListener("click", (e) => {
  const korean = document.querySelectorAll(".text-korean");
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
