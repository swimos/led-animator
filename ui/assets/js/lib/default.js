document.addEventListener('DOMContentLoaded', ()=> {
  if (navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1 ) {
    var e = ["%c Created by SWIM team at SWIM.AI Inc. %c @SWIM.ai %c www.swim.ai", "display:block; padding:5px; background: #4171B8; color:#fff;", "display:block; padding:5px; background: #6ccbf4; color:#fff;", "display:block; padding:5px;"];
    console.info.apply(console, e)
  }

  const copyrightElement = document.querySelector('.copyright');
  if(copyrightElement) {
    const date = new Date();
    const copyright = "&copy; " + date.getFullYear() +" SWIM.AI Inc. All Rights Reserved"
    copyrightElement.innerHTML = copyright;
  }

}, false);
