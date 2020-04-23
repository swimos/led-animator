class LedMatrixPage {

  swimUrl = null;
  rootHtmlElementId = null;
  rootSwimTemplateId = null;
  rootHtmlElement = null;
  rootSwimElement = null;

  appConfig = null;

  links = {};
  ledPixels = [];
  selectedPixelIndex = -1;
  selectedPixelDiv = null;
  selectedFrame = 0;
  fastTween = swim.Transition.duration(100);
  currentPanelId = 1;
  pixelGrid = null;
  gridOffsetX = null;
  gridOffsetY = null;
  pixelDivCache = [];
  pixelCanvas = null;
  pixelCanvasCxt = null;

  selectedColor = null;
  selectedAnimation = "default";
  selectedColorChip = null;
  activeTool = "brush";
  isFgColorActive = true;
  foregroundColor = null;
  backgroundColor = swim.Color.rgb(0,0,0);

  activeAnimation = null;
  animationListSynced = false;
  animationsList = {};

  framesDiv = null;
  frameDivCache = [];

  constructor(swimUrl, elementID, templateID) {
    this.swimUrl = swimUrl;

  }

  initialize() {
    console.info("[IndexPage]: init", this.userGuid);

    // this.links["ledPixels"] = swim.nodeRef(this.swimUrl, `/ledPanel/${this.currentPanelId}`).downlinkValue().laneUri('ledPixels')
    //   .didSet((newValue) => {
    //     if(newValue.stringValue() !== undefined) {
    //       this.ledPixels = JSON.parse(newValue.stringValue());
    //       this.drawPixels();
    //       // this.links["ledPixels"].close();
    //     }
    //   });

    this.links["animList"] = swim.nodeRef(this.swimUrl, '/animationService').downlinkMap().laneUri('animationsList')
      .didUpdate((key, value) => {
        this.animationsList[key.stringValue()] = value.toObject();
        this.updateAnimationList();
      })
      .didRemove((key) => {
        delete this.animationsList[key.stringValue()];
        this.updateAnimationList();
      })
      .didSync(() => {
        if (!this.animationListSynced) {
          this.animationListSynced = true;
          this.updateAnimationList();
          // this.selectAnimation(Object.keys(this.animationsList)[0]);
          

        }
      });


    this.links["activeAnim"] = swim.nodeRef(this.swimUrl, `/ledPanel/${this.currentPanelId}`).downlinkValue().laneUri('activeAnimation')
      .didSet((newValue) => {
        this.activeAnimation = newValue;
      });

    window.requestAnimationFrame(() => {
      this.start();
    })
  }

  start() {
    console.info("[IndexPage]: start");
    this.pixelGrid = document.getElementById("pixelGrid");
    this.framesDiv = document.getElementById("framesContainer");
    this.pixelCanvas = document.getElementById("pixelCanvas");
    this.pixelCanvas.addEventListener('mousedown', this.handleGridEvent.bind(this));
    this.pixelCanvas.addEventListener('mousemove', this.handleGridEvent.bind(this));
    this.pixelCanvasCxt = this.pixelCanvas.getContext("2d");
    this.gridOffsetX = this.pixelGrid.offsetLeft;
    this.gridOffsetY = this.pixelGrid.offsetTop;

    for (let linkLKey in this.links) {
      this.links[linkLKey].open();
    }

    this.drawFullColorPallette();
    this.newAnimation();
    this.selectColor(swim.Color.rgb(255,255,255));

    document.body.onresize = () => {
      this.handleResize();
    };

    document.getElementById("pixelCanvas").addEventListener("contextmenu", function(e){
      e.preventDefault();
    }, false);    

    document.getElementById('piskelImportButton').addEventListener('change', this.importPiskel.bind(this), false)

    window.requestAnimationFrame(() => {
      this.render();
    });

  }

  render() {

    this.drawPixels();

    window.requestAnimationFrame(() => {
      this.render();
    })
  }

  handleResize() {
    this.drawFullColorPallette();
  }

  handleGridEvent(evt) {
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);
    const pixelX = Math.floor((evt.clientX - this.gridOffsetX) / 13);
    const pixelY = Math.floor((evt.clientY - this.gridOffsetY) / 13);
    const pixelIndex = (pixelY * 32) + pixelX;
    const pixelColorIndex = this.ledPixels[pixelIndex];
    document.getElementById("cursorXPos").innerText = pixelX;
    document.getElementById("cursorYPos").innerText = pixelY;
    document.getElementById("rgbAtCursor").innerText = pallette[pixelColorIndex];
    if (evt.buttons === 1 || evt.buttons === 2) {
      this.selectPixel(evt, pixelIndex, pallette);
    }

  }  

  drawPixels() {
    if(!this.ledPixels) {
      return false;
    }
    // const pixelArr = JSON.parse(this.ledPixels);
    const animData = this.animationsList[this.selectedAnimation];
    const framesList = animData.frames2;
    this.ledPixels = JSON.parse(framesList[this.selectedFrame]);
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);

    // this.pixelGrid.innerHTML = "";

    const frameImageData = this.pixelCanvasCxt.createImageData(32,32);
    
    // frameImageData.put
    // draw on canvas
    let dataIndex = 0;
    for (const pixelIndex in this.ledPixels) {
      const pixel = this.ledPixels[pixelIndex];
      const color = pallette[pixel].split(",");
      frameImageData.data[dataIndex] = parseInt(color[0]);
      frameImageData.data[dataIndex+1] = parseInt(color[1]);
      frameImageData.data[dataIndex+2] = parseInt(color[2]);
      frameImageData.data[dataIndex+3] = 255;
      dataIndex = dataIndex+4;
    }

    this.pixelCanvasCxt.putImageData(frameImageData, 0, 0);
    
    // this.pixelCanvas.addEventListener('mousemove', handleGridEvent);

    // // draw with divs
    // for (const pixelIndex in this.ledPixels) {
    //   const pixel = this.ledPixels[pixelIndex];
    //   const color = pallette[pixel].split(",");
    //   if (pixel != undefined) {
    //     if(!this.pixelDivCache[pixelIndex]) {
    //       const pixelDiv = document.createElement("div");
    //       this.pixelGrid.appendChild(pixelDiv);
    //       this.pixelDivCache[pixelIndex] = pixelDiv;
    //     }
    //     this.pixelDivCache[pixelIndex].style.backgroundColor = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
    //   }

    // }
  }

  selectPixel(evt, index, pallette) {
    // console.info(evt, index, pallette);
    const currPixelColor = pallette[this.ledPixels[index]];
    switch(this.activeTool) {
      case "brush":
      default:
        if (evt.buttons === 1 || evt.buttons === 2) {
          // console.info(this.ledPixels[index]);
          // console.info(currPixelColor);
          let currColorArr = null;
          if(evt.buttons === 1) {
            currColorArr = `${this.foregroundColor.r},${this.foregroundColor.g},${this.foregroundColor.b}`;
          } else if(evt.buttons === 2) {
            currColorArr = `${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b}`;
          }
          let palletteArr = JSON.parse(this.animationsList[this.selectedAnimation].pallette);
          let palletteIndex = palletteArr.indexOf(currColorArr);
          if(palletteIndex < 0) {
            palletteArr.push(currColorArr)
            this.animationsList[this.selectedAnimation].pallette = JSON.stringify(palletteArr);
            palletteIndex = palletteArr.length-1;
            this.drawActiveColorPallette();
          }
          this.ledPixels[index] = palletteIndex;
          this.animationsList[this.selectedAnimation].frames2[this.selectedFrame] = `[${this.ledPixels.toString()}]`;
          // this.animationsList[this.selectedAnimation].frames2[this.selectedFrame] = this.ledPixels;
          // console.info(index, palletteIndex, this.ledPixels);
          // this.drawPixels();
        }

        break;

        
    }
    // this.selectedPixelIndex = index;
    // this.selectedPixelDiv = evt.target;
    // this.updateLedPixel();
  }

  showLedPixels() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedPixels', this.ledPixels.toString());
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedCommand', "showPixels");
  }

  updateColorFromSlider() {
    const newR = document.getElementById("redInputRange").value;
    const newB = document.getElementById("blueInputRange").value;
    const newG = document.getElementById("greenInputRange").value;
    this.selectColor(swim.Color.rgb(newR,newG,newB));
  }

  updateSelectedColor() {
    const newR = document.getElementById("redInput").value;
    const newB = document.getElementById("blueInput").value;
    const newG = document.getElementById("greenInput").value;
    this.selectColor(swim.Color.rgb(newR,newG,newB));
  }

  clearLedPixels(color = "0,0,0") {
    let newArr = Array.apply(null, Array(32 * 32));
    if(color === "selected") {
      color = `${this.foregroundColor.r},${this.foregroundColor.g},${this.foregroundColor.b},`
    }
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);
    let palletteIndex = pallette.indexOf(color);
    if(palletteIndex < 0) {
      pallette.push(color)
      this.animationsList[this.selectedAnimation].pallette = JSON.stringify(pallette);
      palletteIndex = pallette.length-1;
      this.drawActiveColorPallette();
    }

    this.ledPixels = newArr.map(function (x, i) {
      return palletteIndex
    }).toString();

    this.animationsList[this.selectedAnimation].frames2[this.selectedFrame] = `[${this.ledPixels}]`;

    this.drawPixels();

  }

  drawFramesListElements() {
    const animData = this.animationsList[this.selectedAnimation];
    const framesList = animData.frames2;

    for (let i = 0; i < framesList.length; i++) {

      if(!this.frameDivCache[i]) {
        const tempDiv = document.createElement("div");
        tempDiv.addEventListener('click', (evt) => {
          this.selectFrame(i);
        });
        this.framesDiv.appendChild(tempDiv);
  
        this.frameDivCache[i] = tempDiv;
        if(i%5===(5-1) || i === 0 || i === (framesList.length-1)) {
          tempDiv.innerHTML = (i+1);
        } else {
          tempDiv.innerHTML = "&nbsp;";
        }
        tempDiv.innerHTML += "<div class='marker'>|</div><div class='frameBox'></div>";
  
      }

      const frameDiv = this.frameDivCache[i];

      if (this.selectedFrame === i) {
        frameDiv.className = "frame selected";
      } else {
        frameDiv.className = "frame";
      }

      
    }

  }

  selectFrame(frameIndex) {
    if(frameIndex < 0) {
      frameIndex = 0;
    }
    if(frameIndex >= this.animationsList[this.selectedAnimation].frames2.length) {
      frameIndex  =this.animationsList[this.selectedAnimation].frames2.length-1;
    }
    this.selectedFrame = frameIndex;
    // const animData = this.animationsList[this.selectedAnimation];
    // const framesList = animData.frames2;
    // this.ledPixels = JSON.parse(framesList[frameIndex]);
    // this.drawPixels();
    // this.showLedPixels();
    
    this.drawFramesListElements();

  }

  deleteFrame() {
    if (this.selectedFrame != 0) {
      const animData = this.animationsList[this.selectedAnimation];
      const framesList = animData.frames2;
      const newFrameList = framesList.slice(0, (this.selectedFrame - 1)).concat(framesList.slice(this.selectedFrame, framesList.length));
      this.animationsList[this.selectedAnimation].frames2 = newFrameList
      this.selectFrame(this.selectedFrame - 1);
      this.drawFramesListElements();
    }
  }

  addFrame() {
    let newArr = Array.apply(null, Array(32 * 32));
    let newFramePixels = newArr.map(function (x, i) {
      return "0"
    }).toString();
    this.animationsList[this.selectedAnimation].frames2.push(`[${newFramePixels}]`);
    this.selectFrame(this.animationsList[this.selectedAnimation].frames2.length - 1);
    this.drawFramesListElements();

  }

  duplicateFrame() {
    const newFrame = this.animationsList[this.selectedAnimation].frames2[this.selectedFrame].slice()
    this.animationsList[this.selectedAnimation].frames2.push(newFrame);
    this.selectFrame(this.animationsList[this.selectedAnimation].frames2.length - 1);
    this.drawFramesListElements();

    console.info();
  }

  
  selectAnimation(animKey) {
    this.selectedAnimation = animKey
    
    document.getElementById("animName").value = this.animationsList[this.selectedAnimation].name;
    document.getElementById("animSpeed").value = Math.round(1000 / this.animationsList[this.selectedAnimation].speed);
    this.selectFrame(0);
    for(let tempDiv of this.frameDivCache) {
      this.framesDiv.removeChild(tempDiv);
      delete this.frameDivCache[tempDiv];
    }
    this.frameDivCache = [];
    this.drawFramesListElements();
    this.framesDiv.scrollTo(0,0)
    this.drawPixels();
    this.drawActiveColorPallette();
    // this.showLedPixels();
  }

  playAnimationOnPanel() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setActiveAnimation', this.animationsList[this.selectedAnimation]);
  }

  stopAnimationOnPanel() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setActiveAnimation', swim.Value.absent());
  }

  animationTimer = null;
  playAnimationPreview() {
    this.stopAnimationPreview();
    document.getElementById("playButton").value = "S";
    let nextFrame = this.selectedFrame + 1;
    let totalFrames = this.animationsList[this.selectedAnimation].frames2.length;
    if (nextFrame >= totalFrames) {
      nextFrame = 0;
    }
    this.selectFrame(nextFrame);

    // if(this.framesDiv.children[nextFrame]) {

    //   const scrollx = this.framesDiv.children[nextFrame].offsetLeft - this.framesDiv.offsetLeft - (this.framesDiv.offsetWidth/2);
    //   this.framesDiv.scrollTo(scrollx,0)
    // }
    
    this.animationTimer = setTimeout(this.playAnimationPreview.bind(this), this.animationsList[this.selectedAnimation].speed);

  }

  stopAnimationPreview() {
    clearInterval(this.animationTimer);
    this.animationTimer = null;
    document.getElementById("playButton").value = "P";
  }

  toggleAnimationPreview() {
    if(this.animationsList[this.selectedAnimation].frames2.length <= 1) {
      return false;
    }
    if (this.animationTimer === null) {
      this.playAnimationPreview();
      
    } else {
      this.stopAnimationPreview();
      
    }
  }

  selectColor(color = swim.Color.rgb(255,255,255)) {
    // this.selectedColor = swim.Color.rgb(newR, newG, newB);
    if(this.isFgColorActive) {
      this.foregroundColor = color;
      document.getElementById("foregroundColorChip").style.backgroundColor = `rgb(${this.foregroundColor.r},${this.foregroundColor.g},${this.foregroundColor.b})`
      document.getElementById('redInput').value = Math.round(this.foregroundColor.r);
      document.getElementById('redInputRange').value = Math.round(this.foregroundColor.r);
      document.getElementById('greenInput').value = Math.round(this.foregroundColor.g);
      document.getElementById('greenInputRange').value = Math.round(this.foregroundColor.g);
      document.getElementById('blueInput').value = Math.round(this.foregroundColor.b);
      document.getElementById('blueInputRange').value = Math.round(this.foregroundColor.b);
    } else {
      this.backgroundColor = color;
      document.getElementById("backgroundColorChip").style.backgroundColor = `rgb(${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b})`
      document.getElementById('redInput').value = Math.round(this.backgroundColor.r);
      document.getElementById('redInputRange').value = Math.round(this.backgroundColor.r);
      document.getElementById('greenInput').value = Math.round(this.backgroundColor.g);
      document.getElementById('greenInputRange').value = Math.round(this.backgroundColor.g);
      document.getElementById('blueInput').value = Math.round(this.backgroundColor.b);
      document.getElementById('blueInputRange').value = Math.round(this.backgroundColor.b);
  
    }
  }

  drawFullColorPallette() {
    const palletteDiv = document.getElementById("colorPallette");
    const totalColors = 256;
    const totalShades = Math.floor(Math.sqrt(totalColors));
    const palletteWidth = palletteDiv.offsetWidth;
    const colorChipSize = Math.floor(palletteWidth / totalShades);
    let currHue = null;
    let currShade = null;
    let totalChips = 0;
    palletteDiv.innerHTML = ""
    // palletteDiv.style.width = `calc(${colorChipSize}px * ${totalShades})`

    // render greys
    for (let i = 0; i < totalShades; i++) {
      const currGrey = Math.round(Utils.interpolate(255, 0, i, totalShades - 1));
      const newColor = swim.Color.rgb(currGrey, currGrey, currGrey);
      const newColorChip = document.createElement("div");
      // newColorChip.className = (this.selectedColor && this.selectedColor.equals(newColor)) ? "selectedColor" : "";
      newColorChip.id = `colorChip-${totalChips}`;
      newColorChip.style.backgroundColor = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`
      newColorChip.style.height = newColorChip.style.width = `${colorChipSize}px`;
      newColorChip.addEventListener('mousedown', (evt) => {
        page.selectColor(newColor);
      });
      palletteDiv.appendChild(newColorChip);
      totalChips++;
    }

    //render colors
    for (let i = 0; i < totalColors; i++) {

      if (i % totalShades === 0) {
        currHue = Utils.interpolate(0, 360, i, totalColors);
        // currShade = 1;
      } else {

      }
      currShade = Utils.interpolate(.9, 0, i % totalShades, totalShades);
      const newColor = swim.Color.hsl(currHue, 1, currShade).rgb();
      newColor.r = Math.round(newColor.r);
      newColor.g = Math.round(newColor.g);
      newColor.b = Math.round(newColor.b);
      const newColorChip = document.createElement("div");
      // newColorChip.className = (this.selectedColor && this.selectedColor.equals(newColor)) ? "selectedColor" : "";
      newColorChip.id = `colorChip-${totalChips}`;
      newColorChip.style.backgroundColor = `rgb(${newColor.r}, ${newColor.g}, ${newColor.b})`
      newColorChip.style.height = newColorChip.style.width = `${colorChipSize}px`;
      newColorChip.addEventListener('mouseup', (evt) => {
        page.selectColor(newColor);
      });

      palletteDiv.appendChild(newColorChip);
      totalChips++;
    }
  }

  drawActiveColorPallette() {
    console.info("draw active color pallette");

    const pallette = JSON.parse(page.animationsList[page.selectedAnimation].pallette);
    const palletteDiv = document.getElementById("activePallette");
    const palletteWidth = palletteDiv.offsetWidth;
    const colorChipSize = 14;
    let totalChips = 0;

    palletteDiv.innerHTML = "";
    for(let i=0; i<pallette.length; i++) {
      const colorArr = pallette[i].split(",");
      const currColor = swim.Color.rgb(colorArr[0],colorArr[1],colorArr[2]);
      const newColorChip = document.createElement("div");
      // newColorChip.className = (this.selectedColor && this.selectedColor.equals(currColor)) ? "selectedColor" : "";
      newColorChip.id = `colorChip2-${totalChips}`;
      newColorChip.style.backgroundColor = `rgb(${currColor.r}, ${currColor.g}, ${currColor.b})`
      newColorChip.style.height = newColorChip.style.width = `${colorChipSize}px`;
      newColorChip.addEventListener('mouseup', (evt) => {
        page.selectColor(currColor);
      });

      palletteDiv.appendChild(newColorChip);
      totalChips++;
    }
  }

  updateAnimationList() {
    const selectBox = document.getElementById("animationList")
    selectBox.innerHTML = "";
    for (let animKey in this.animationsList) {
      const newOpt = document.createElement("option");
      const currAnim = this.animationsList[animKey];
      newOpt.innerText = currAnim.name;
      newOpt.value = currAnim.id;
      if (this.selectedAnimation == currAnim.id) {
        newOpt.selected = true;
      }
      selectBox.appendChild(newOpt);
    }
  }

  newAnimation() {
    const newAnimId = Utils.newGuid();
    const newArr = Array.apply(null, Array(32 * 32));
    const newFrames = [newArr.map(function (x, i) {
      return "[0,0,0]"
    }).toString()];
    const newFrames2 = [newArr.map(function (x, i) {
      return "0"
    }).toString()];

    const newAnimData = {
      id: newAnimId,
      name: "New Animation",
      speed: 66,
      frames2: [`[${newFrames2}]`],
      pallette: '["0,0,0"]'
    }
    this.animationsList[newAnimId] = newAnimData;
    this.selectAnimation(newAnimId);

  }

  loadAnimation() {
    const dropdown = document.getElementById("animationList");
    const selectedAnim = dropdown[dropdown.selectedIndex].value;
    this.selectAnimation(selectedAnim);
    this.stopAnimationPreview();
  }

  saveAnimation() {
    const saveData = swim.Record.create()
      .slot("id", this.selectedAnimation)
      .slot("data", this.animationsList[this.selectedAnimation]);
    swim.command(this.swimUrl, '/animationService', 'saveAnimation', saveData);
  }

  updateName() {
    const newName = document.getElementById("animName").value;
    this.animationsList[this.selectedAnimation].name = newName;
  }

  updateSpeed() {
    const newSpeed = Math.ceil(1000 / document.getElementById("animSpeed").value);
    this.animationsList[this.selectedAnimation].speed = newSpeed;
    if (this.animationTimer !== null) {
      this.playAnimationPreview();
    }    
  }

  importPiskel(evt) {
    var files = evt.target.files; // FileList object

    // Loop through the FileList and render image files as thumbnails.
    for (var i = 0, f; f = files[i]; i++) {

      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = ((theFile) => {
        return (e) => {
          this.readPiskelFile(theFile, e);          
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
  }

  readPiskelFile(fileInfo, fileData) {
    const newId = Utils.newGuid();
    const piskelData = JSON.parse(fileData.target.result).piskel;
    const newAnim = {
      "id": newId,
      "name": piskelData.name,
      "speed": 1000/piskelData.fps,
      "frames": []
    }
    const frameWidth = 32;
    const frameHeight = 32;
    const framePixelCount = frameWidth * frameHeight;
    const debugArea = document.getElementById("offscreenCanvas");
    const newCanvas = document.createElement("canvas");
    // for(let layerId in piskelData.layers) {
      const currLayer = JSON.parse(piskelData.layers[0]);
      const frameCount = currLayer.frameCount;
      const canvasWidth = frameWidth*frameCount;
      const canvasHeight = frameHeight;
      const tempImg = new Image();
      const pallette = [];
      const newFrameData = [];
      tempImg.onload = (() => {
        newCanvas.width = canvasWidth;
        newCanvas.height = canvasHeight;
        debugArea.appendChild(newCanvas);
        const canvasContext = newCanvas.getContext("2d");
        canvasContext.drawImage(tempImg, 0, 0, canvasWidth, canvasHeight);

        const totalPixels = canvasWidth * canvasHeight;
        let frame = 0
        let row = -1;
        let rowIndex = 0;
        let newFrames = [];
        let newFramesByIndex = [];
        for(let i=0; i<totalPixels; i++) {
          if(i%frameWidth===0) {
            frame++;
          }
          if(i%canvasWidth==0) {
            row++;
            frame = 0;
            rowIndex = 0;
          }
          let x = rowIndex;
          let y = row;
          let pixelData = canvasContext.getImageData(x,y,1,1).data;
          // console.info([pixelData[0],pixelData[1],pixelData[2]]);
          if(!newFrames[frame]) {
            newFrames[frame] = [];
          }
          if(!newFramesByIndex[frame]) {
            newFramesByIndex[frame] = [];
          }
          const currColorStr = `[${pixelData[0]},${pixelData[1]},${pixelData[2]}],`;
          const currColorStr2 = [pixelData[0],pixelData[1],pixelData[2]].toString();
          if(pallette.indexOf(currColorStr2) === -1) {
            pallette.push(currColorStr2);
          }
          const colorIndex = pallette.indexOf(currColorStr2);
          newFramesByIndex[frame].push(colorIndex);
          rowIndex++;
          // console.info(x, y, frame, row);
        }
        for(let frame in newFrames) {
          newFramesByIndex[frame] = JSON.stringify(newFramesByIndex[frame]);
        }        
        // newAnim.frames = newFrames;
        newAnim.frames2 = newFramesByIndex;
        newAnim.pallette = JSON.stringify(pallette);

        this.animationsList[newId] = newAnim;
        this.updateAnimationList();
        // this.selectAnimation(newId)

        // console.info(newFrames);
      })
      tempImg.src = currLayer.chunks[0].base64PNG;
      // debugArea.appendChild(tempImg);
      
    // }
    // console.info(newAnim, piskelData);
  }


}

Utils = {
  newGuid: () => {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0;
      const v = (c === 'x') ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  interpolate(startValue, endValue, stepNumber, lastStepNumber) {
    return (endValue - startValue) * stepNumber / lastStepNumber + startValue;
  },

  setCookie: (cookieName, cookieValue, expireDays) => {
    var newDate = new Date();
    newDate.setTime(newDate.getTime() + (expireDays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + newDate.toUTCString();
    document.cookie = cookieName + "=" + cookieValue + ";" + expires + ";path=/";
  },

  getCookie: (cookieName) => {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieValues = decodedCookie.split('=');
    if (cookieValues.length === 2) {
      return cookieValues[1];
    }
    return "";
  }
}