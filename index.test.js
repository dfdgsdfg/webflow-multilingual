test("btn-lang works", () => {
  document.body.innerHTML = `
    <p class="wm-ko">한국어</p>
    <p class="wm-en">English</p>
    <p id="t1">[[ko]]한국어 [[en]]English</p>
    <p>[[ko]]한국어 <br> 한국어[[en]]English <br> English</p>
    <p>[[ko]]한국어
      한국어
      [[en]]English
    English</p>
    <button id="btnKo" data-wm-sel="ko">한국어</button>
    <button id="btnEn" data-wm-sel="en">English</button>
    <button id="btnSwitch" data-wm-switch>Switch</button>`;
  require("./index");
  console.log(window.defaultLang);
  const btnKo = document.querySelector("#btnKo");
  const btnEn = document.querySelector("#btnEn");
  const btnSwitch = document.querySelector("#btnSwitch");

  btnEn.click();
  btnKo.click();
  expect(document.querySelector("#t1").textContent).toEqual("한국어");
});
