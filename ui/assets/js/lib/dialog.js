
/**
 * Helper class to manage the overlay dialog
 */
class Dialog {

    bgDiv = null;
    contentDiv = null;
    titleDiv = null;
  
  
    constructor(bgId, contentId, titleId) {
      this.bgDiv = document.getElementById(bgId);
      this.contentDiv = document.getElementById(contentId);
      this.titleDiv = document.getElementById(titleId);
      this.bgDiv.style.opacity = 0;
      this.bgDiv.style.display = "none";
    }
  
    open(dialogId) {
      this.bgDiv.style.display = "block";
      this.bgDiv.style.opacity = 1;
      switch (dialogId) {
        case "load":
          this.titleDiv.innerText = "Load Animation";
          break;
      }
      for (let i = 0; i < this.contentDiv.children.length; i++) {
        const currChild = this.contentDiv.children[i];
        if (currChild.id === dialogId) {
          currChild.style.display = "block";
        } else {
          currChild.style.display = "none";
        }
      }
  
    }
  
    close() {
      this.bgDiv.style.opacity = 0;
      setTimeout(() => {
        this.bgDiv.style.display = "none";
      }, 100);
  
  
    }
  
    setTitle(newStr) {
      this.titleDiv.innerText = newStr;
    }
  
  }
  