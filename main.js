// 이벤트 영역
const text = document.querySelector(".text-english").innerText;
const btnRead = document.getElementById("btn-read");
const btnKorean = document.getElementById("btn-korean");

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

document.onpointerup = function () {
  if (!selectText().isCollapsed) {
    fetch(
      `https://my-simple-mapo-proxy.herokuapp.com/https://dict.naver.com/api3/enko/search?query=${selectText()}`
    )
      .then((response) => response.json())
      .then((data) => {
        let json = data.searchResultMap.searchResultListMap.WORD.items[0];
        if (json && json.meansCollector[0].means[0].value) {
          let resultHTML = "";
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
                <div>${json.meansCollector[i].means[j].exampleTrans}</div><br/>
                </div>`;
              } else if (json.meansCollector[i].means[j].exampleOri) {
                resultHTML += `<div>${j + 1}. ${
                  json.meansCollector[i].means[j].value
                }</div>
                <div>
                <div>${json.meansCollector[i].means[j].exampleOri}</div><br/>
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
          document.getElementById("word").innerHTML = resultHTML;
        }
      });
  } else {
    document.getElementById("word").innerHTML = "";
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
