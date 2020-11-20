let Pairs = []
const isMac = /Macintosh/.test(navigator.userAgent)
let $lapiKey = $('.lapi-key')

isMac? $lapiKey.text(' Control+S '):$lapiKey.text('  Alt+S ')

// 从 storage 中取出 Pairs 字段，并设置在页面上。
chrome.storage.local.get(['Pairs'], function (res) {
  if (res.Pairs) {
    Pairs = res.Pairs
    for(var i = 0, len = Pairs.length; i < len; i++){
        let appendEl = '<li><span class="match">' + Pairs[i][0] + '</span>\n' +
        '<button class="button close-button">&times</button>\n' +
        '</li>';
        let appendRU = '<li><span class="rule">' + Pairs[i][1] + '</span>\n' +
        '</li>'
      $('ul.Matches').append(appendEl)
      $('ul.Rules').append(appendRU)
    }
  }
})

let addEl = $('#addpattern')
let addRU = $('#addrule')
addEl.focus()
let MatchCon = $('ul.Matches')
let RuleCon = $('ul.Rules')

MatchCon.delegate('.close-button', 'click', function () {
    let $this = $(this)
    let matchValue = $this.siblings().html()
    Pairs = Pairs.filter(function (item) {
      return item[0] !== matchValue
    })
    chrome.storage.local.set({Pairs: Pairs})
    $this.parent().addClass('fade')
    setTimeout(function () {
      $this.parent().remove()
    }, 800)
})


$('.add-pair').on('click',addPair)
  addEl.bind('keypress',function(event){
    if(event.keyCode === 13) addPair()
})


function addPair(){
    if(!validate(addEl.val(), addRU.val())){
      addEl.addClass('add-wrong')
      addRU.addClass('add-wrong')
    }
    else{
      let appendEl = '<li><span class="match">' + addEl.val() + '</span>\n' +
        '<button class="button close-button">&times</button>\n' +
        '</li>'
      let appendRU = '<li><span class="rule">' + addRU.val() + '</span>\n' +
        '</li>'
      $('ul.Matches').append(appendEl)
      $('ul.Rules').append(appendRU)
      var pair = [addEl.val(), addRU.val()]
      Pairs.push(pair)
      chrome.storage.local.set({Pairs: Pairs})
      addEl.removeClass('add-wrong')
      addRU.removeClass('add-wrong')
      addEl.focus().val('')
      addRU.val('')
    }
}

function validate(value1, value2){
    value1 = value1.trim()
    value2 = value2.trim()
    if(value1.length ===0 | value2.length ===0){
      return false
    }
    //return eval(value1) instanceof RegExp
    return true
}