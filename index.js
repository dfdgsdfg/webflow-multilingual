// http://multilinguale.webflow.io
import ISO6391 from 'iso-639-1'

const defaultLang = 'en'
const langRegExp = /\[\[([a-z]{2})\]\]([^\[]+)/g
const isStorageEnabled = ! (typeof localStorage == 'undefined')
let userLang = (navigator.userLanguage||navigator.browserLanguage||navigator.language||defaultLang).substr(0,2)
let documentLang = new Set()
let documentLangIter

function getLangParam() {
   const arr = /lang=([a-z]{2})/g.exec(location.search)
   return arr ? arr[1] : null
}

function getLangFromStorage() {
   return isStorageEnabled ? localStorage.getItem('lang') : undefined
}

function setLang(lang) {
   userLang = lang
   if(isStorageEnabled){
       localStorage.setItem('lang', userLang)
   }
   console.log('[wm] setLang:', lang, userLang)
   applyLang()
}

function applyLang() {
   textDict.forEach((o) => {
       o.el.textContent = o.dict[userLang]
   })

  ISO6391.getAllCodes().forEach(lang => {
    lang === userLang
      ? document.querySelectorAll(`.wm-${lang}`).forEach(el => el.style.display = el.dataset.wmDisplay)
      : document.querySelectorAll(`.wm-${lang}`).forEach(el => el.style.display = 'none')
  })
}

function textNodesUnder(el) {
  let node
 const nodes = []
 const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false)
 
 while (node=walk.nextNode()) {
     nodes.push(node)
 }
 
 return nodes
}

const textDict = []

// https://medium.com/@roxeteer/javascript-one-liner-to-get-elements-text-content-without-its-child-nodes-8e59269d1e71
function parentElTextOnly(el) {
  return Array.from(el.childNodes).reduce((acc, node) => {
    return acc + (node.nodeType === 3 ? node.textContent : '')
  }, '')
}

window.addEventListener('DOMContentLoaded', () => {
  userLang = getLangParam() || getLangFromStorage() || userLang
  if(isStorageEnabled) {
    localStorage.setItem('lang', userLang);
  }

  ISO6391.getAllCodes().forEach(lang => {
    document.querySelectorAll(`.wm-${lang}`).forEach(el => el.dataset.wmDisplay = el.style.display)
  })
  
  textNodesUnder(document).filter((node) => {
    return langRegExp.test(parentElTextOnly(node.parentElement))
  }).forEach((node, i) => {
    const dict = {}
    let arr
    while((arr = langRegExp.exec(parentElTextOnly(node.parentElement))) != null) {
      dict[arr[1]] = arr[2]
      documentLang.add(arr[1])
    }
    textDict.push({
      el: node.parentElement,
      dict
    })
  })
  console.log('[wm] documentLang:', documentLang)
  documentLangIter = documentLang[Symbol.iterator]()
  applyLang()
});


/////////////////////////

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wm-sel]').forEach((el) => {
    el.addEventListener('click', (evt) => {
      evt.stopPropagation()
      evt.preventDefault()
      console.log('[wm] click:', el.dataset.wmSel)
      setLang(el.dataset.wmSel)
    })
  })
})

///////////////////////////

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-wm-switch]').forEach((el) => {
    el.addEventListener('click', (evt) => {
      evt.stopPropagation()
      evt.preventDefault()
      let nextLang = documentLangIter.next().value
      if (nextLang === userLang) {
        nextLang = documentLangIter.next().value
      }
      if (!nextLang) {
        documentLangIter = documentLang[Symbol.iterator]()
        nextLang = documentLangIter.next().value
      }
      setLang(nextLang)
      console.log('[wm] switch:', nextLang)
    })
  })
})
