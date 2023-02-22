/**
 * @jest-environment jsdom
 */
import * as wm from "./index.js";

const html = `
      <p class="wm-ko">한국어</p>
      <p class="wm-en">English</p>
      <p id="content">[[ko]]한국어[[en]]English</p>

      <button id="btnKo" data-wm-sel="ko">To Korean</button>
      <button id="btnEn" data-wm-sel="en">To English</button>
      <button id="btnSwitch" data-wm-switch>Switch</button>`;

describe('buttons', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    wm.init();
    wm.addSelectLangButtonEvent();
    wm.addSwitchLangButtonEvent();
  });

  afterEach(() => {
    // remove eventlisteners
    document.body.outerHTML = document.body.outerHTML;
    document.body.innerHtml = "";
  });

  test("select button with text node", () => {
    const btnKo = document.querySelector("#btnKo");
    const btnEn = document.querySelector("#btnEn");
    const content = document.querySelector("#content");

    btnEn.click();
    expect(content.textContent).toEqual("English");
    
    btnKo.click();
    expect(content.textContent).toEqual("한국어");
  });

  test("select button with css class", () => {
    const btnKo = document.querySelector("#btnKo");
    const wmKo = document.querySelector(".wm-ko");
    let wmKoStyle = window.getComputedStyle(wmKo);
    
    const btnEn = document.querySelector("#btnEn");
    const wmEn = document.querySelector(".wm-en");
    let wmEnStyle = window.getComputedStyle(wmEn);

    btnEn.click();
    wmKoStyle = window.getComputedStyle(wmKo);
    expect(wmKoStyle.display).toEqual('none');
    wmEnStyle = window.getComputedStyle(wmEn);
    expect(wmEnStyle.display).toEqual('block');
    
    btnKo.click();
    wmKoStyle = window.getComputedStyle(wmKo);
    expect(wmKoStyle.display).toEqual('block');
    wmEnStyle = window.getComputedStyle(wmEn);
    expect(wmEnStyle.display).toEqual('none');
  });

  test("switch button with text node", () => {
    const btnSwitch = document.querySelector("#btnSwitch");
    const content = document.querySelector("#content");


    btnSwitch.click();
    expect(content.textContent).toEqual("English");
    
    btnSwitch.click();
    expect(content.textContent).toEqual("한국어");
  });

  test("switch button with css class", () => {
    const btnSwitch = document.querySelector("#btnSwitch");
    const content = document.querySelector("#content");
    
    const wmKo = document.querySelector(".wm-ko");
    let wmKoStyle = window.getComputedStyle(wmKo);
    
    const wmEn = document.querySelector(".wm-en");
    let wmEnStyle = window.getComputedStyle(wmEn);

    btnSwitch.click();
    wmKoStyle = window.getComputedStyle(wmKo);
    expect(wmKoStyle.display).toEqual('none');
    wmEnStyle = window.getComputedStyle(wmEn);
    expect(wmEnStyle.display).toEqual('block');

    btnSwitch.click();
    wmKoStyle = window.getComputedStyle(wmKo);
    expect(wmKoStyle.display).toEqual('block');
    wmEnStyle = window.getComputedStyle(wmEn);
    expect(wmEnStyle.display).toEqual('none');
  });
});

describe("url param", () => {
  beforeEach(() => {
    document.body.innerHTML = html;
  });

  afterEach(() => {
    // remove eventlisteners
    document.body.outerHTML = document.body.outerHTML;
    document.body.innerHtml = "";
  });

  test("url param with text node en", () => {
    const content = document.querySelector("#content");
 
    const enLocation = {
      ...window.location,
      search: '?lang=en',
    };

    Object.defineProperty(window, 'location', {
      writable: true,
      value: enLocation,
    });
    wm.init();
    expect(content.textContent).toEqual("English");
  });

  test("url param with text node ko", () => {
    const content = document.querySelector("#content");
    
    const koLocation = {
      ...window.location,
      search: '?lang=ko',
    };

    Object.defineProperty(window, 'location', {
      writable: true,
      value: koLocation,
    });
    wm.init();
    expect(content.textContent).toEqual("한국어");
  });

  test("url param with css class en", () => {
    const content = document.querySelector("#content");
    
    const wmKo = document.querySelector(".wm-ko");
    let wmKoStyle = window.getComputedStyle(wmKo);
    
    const wmEn = document.querySelector(".wm-en");
    let wmEnStyle = window.getComputedStyle(wmEn);
    
    const enLocation = {
      ...window.location,
      search: '?lang=en',
    };

    Object.defineProperty(window, 'location', {
      writable: true,
      value: enLocation,
    });
    wm.init();
    wmKoStyle = window.getComputedStyle(wmKo);
    expect(wmKoStyle.display).toEqual('none');
    wmEnStyle = window.getComputedStyle(wmEn);
    expect(wmEnStyle.display).toEqual('block');
  });
  
  test("url param with css class ko", () => {
    const content = document.querySelector("#content");
    
    const wmKo = document.querySelector(".wm-ko");
    let wmKoStyle = window.getComputedStyle(wmKo);
    
    const wmEn = document.querySelector(".wm-en");
    let wmEnStyle = window.getComputedStyle(wmEn);
    
    const koLocation = {
      ...window.location,
      search: '?lang=ko',
    };
  
    Object.defineProperty(window, 'location', {
      writable: true,
      value: koLocation,
    });
    wm.init();
    wmKoStyle = window.getComputedStyle(wmKo);
    expect(wmKoStyle.display).toEqual('block');
    wmEnStyle = window.getComputedStyle(wmEn);
    expect(wmEnStyle.display).toEqual('none');
  });
});
