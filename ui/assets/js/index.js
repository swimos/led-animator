/**
 * LedMatrixPage class drives the LED Animation page
 * in this code a 'panel' is any LED panel, matrix, array, etx that can be animated
 * It is assumed that every panel has an array of individually addressable RGB LEDs. 
 * This class handles the page only. The actual driving and updating of LED panels is handled
 * with Node in /node/main.js of this project.
 */
class LedMatrixPage {

  swimUrl = null;
  dialog = null;
  links = {};
  panelLinks = [];
  ledPixels = [];
  selectedFrame = 0;
  currentPanelId = null;
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
  backgroundColor = swim.Color.rgb(0, 0, 0);

  activeAnimation = null;
  animationListSynced = false;
  animationsList = {};
  animationTimer = null;

  panelList = [];
  panelInfo = null;
  panelWidth = 0;
  panelHeight = 0;

  framesDiv = null;
  frameDivCache = [];
  syncPreview = false;
  ledCommand = "stop";

  constructor(swimUrl) {
    this.swimUrl = swimUrl;

  }

  /**
   * class init. setup swim links and deafault objects/variable 
   * and then call start()
   */
  initialize() {

    // load list of animations saved in swim animationService
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
        }
      });

    // load list of LED panels being managed by swim animationService
    this.links["panels"] = swim.nodeRef(this.swimUrl, '/animationService').downlinkMap().laneUri('panels')
      .didUpdate((key, value) => {
        this.panelList[key.stringValue()] = value.toObject();
        if (this.currentPanelId === null) {
          this.selectPanel(key.stringValue());
        }
        this.updateNewPanelList();
      })
      .didSync(() => {
        // if(this.panelList.length == 0) {
        //   this.panelHeight = this.panelWidth = 32;
        //   document.getElementById("mainPanelList").innerText = "No LED Panels to manage"
        // }
      })

    // create dialog manager to use later
    this.dialog = new Dialog("overlayBg", "overlayContent", "overlayTitle");

    // setup some default values
    this.pixelGrid = document.getElementById("pixelGrid");
    this.framesDiv = document.getElementById("framesContainer");
    this.pixelCanvas = document.getElementById("pixelCanvas");
    this.pixelCanvas.addEventListener('mousedown', this.handleGridEvent.bind(this));
    this.pixelCanvas.addEventListener('mousemove', this.handleGridEvent.bind(this));
    this.pixelCanvasCxt = this.pixelCanvas.getContext("2d");
    this.gridOffsetX = this.pixelGrid.offsetLeft;
    this.gridOffsetY = this.pixelGrid.offsetTop;

    // start page on next render frame
    window.requestAnimationFrame(() => {
      this.start();
    })
  }

  /**
   * Start up the LED Animator page
   */
  start() {

    // open all our swim links
    for (let linkLKey in this.links) {
      this.links[linkLKey].open();
    }

    // draw color pallettes and setup page default state
    this.drawFullColorPallette();
    this.newAnimation();
    this.selectColor(swim.Color.rgb(255, 255, 255));

    // prevent right click on canvas so we can use that as erase pixel
    document.getElementById("pixelCanvas").addEventListener("contextmenu", function (e) {
      e.preventDefault();
    }, false);

    // event listern for import piskel button in import dialog
    document.getElementById('piskelImportButton').addEventListener('change', this.importPiskel.bind(this), false)

    // start key event listener for keyboard shortcuts
    this.keyPressHandler();

    // start render loop
    window.requestAnimationFrame(() => {
      this.render();
    });

  }

  /**
   * main render loop
   */
  render() {

    // update canvas in pixelGrid
    this.drawPixels();

    // start render loop timer
    window.requestAnimationFrame(() => {
      this.render();
    })
  }

  /**
   * Select which LED panel/matrix the UI is managing
   * @param {*} panelId 
   */
  selectPanel(panelId = null) {
    // make sure there is a value
    if (panelId == null) {
      console.info("no panel id")
      return false;
    }
    // close panel info swim links for previously selected panel 
    for (let linkLKey in this.panelLinks) {
      this.panelLinks[linkLKey].close();
      delete this.panelLinks[linkLKey];
    }

    // set new panel id
    this.currentPanelId = panelId;

    // setup the panel info swim links we need to keep track of the selected panel state
    this.panelLinks["activeAnimId"] = swim.nodeRef(this.swimUrl, `/ledPanel/${this.currentPanelId}`).downlinkValue().laneUri('activeAnimationId')
      .didSet((newValue) => {
        this.activeAnimation = newValue;
      });

    this.panelLinks["activeAnimation"] = swim.nodeRef(this.swimUrl, `/ledPanel/${this.currentPanelId}`).downlinkValue().laneUri('activeAnimation')
      .didSet((newValue) => {
        if (newValue.isDefined()) {
          // console.info(newValue.get("name").stringValue());
          document.getElementById("panelAnimName").innerHTML = newValue.get("name").stringValue();
        } else {
          document.getElementById("panelAnimName").innerHTML = "None";
        }
      });

    this.panelLinks["ledCommand"] = swim.nodeRef(this.swimUrl, `/ledPanel/${this.currentPanelId}`).downlinkValue().laneUri('ledCommand')
      .didSet((newValue) => {
        this.ledCommand = newValue.stringValue("stop");
        document.getElementById("panelCommand").innerHTML = this.ledCommand;
        const syncButton = document.getElementById("syncButton");
        const playButton = document.getElementById("animPlayButton");
        // update the UI buttons
        if (this.ledCommand === "play") {
          playButton.innerText = "stop";
          playButton.className = "material-icons on";
          syncButton.className = "material-icons";
          syncButton.innerText = "sync";
        }
        if (this.ledCommand === "stop") {
          playButton.innerText = "play_arrow";
          playButton.className = "material-icons";
          syncButton.className = "material-icons";
          syncButton.innerText = "sync";
        }
        if (this.ledCommand === "sync") {
          this.syncPreview = true;
          playButton.innerText = "play_arrow";
          playButton.className = "material-icons";
          syncButton.className = "material-icons on";
          syncButton.innerText = "sync_disabled";
        }
      });

    this.panelLinks["panelInfo"] = swim.nodeRef(this.swimUrl, `/ledPanel/${this.currentPanelId}`).downlinkValue().laneUri('info')
      .didSet((newValue) => {
        if (newValue.isDefined()) {
          this.panelInfo = newValue.toObject();
          this.panelName = this.panelInfo.name;
          this.panelWidth = this.panelInfo.width;
          this.panelHeight = this.panelInfo.height;
          this.pixelCanvas.width = this.panelWidth;
          this.pixelCanvas.height = this.panelHeight;
          document.getElementById('panelSize').innerHTML = `W: ${this.panelWidth} H: ${this.panelHeight}`;
          document.getElementById('panelNameDiv').innerHTML = this.panelName;
          // this.drawPixels();
        }

      });


    // open the swim panel info links for newly selected panel
    for (let linkLKey in this.panelLinks) {
      this.panelLinks[linkLKey].open();
    }

    // refresh panel list state
    this.updateNewPanelList();

  }

  /**
   * draw current frame to pixel grid canvas
   * this is called on render loop and doenst need to be called outside of that
   */
  drawPixels() {
    // make sure we have what we need to work with
    if (!this.ledPixels || this.panelWidth == 0 || this.panelHeight == 0 || Object.keys(this.animationsList).length === 0) {
      return false;
    }

    // get selected animation data from animation list
    const animData = this.animationsList[this.selectedAnimation];
    // get frames data for animation
    const framesList = animData.frames;
    // set led pixel data for selected frame
    this.ledPixels = JSON.parse(framesList[this.selectedFrame]);

    // if there are not pixels, create a new animation to fill things in properly
    if (this.ledPixels.length === 0) {
      this.newAnimation();
    }

    // grab current animation pallette
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);

    // create image data on pixel canvas context
    const frameImageData = this.pixelCanvasCxt.createImageData(this.panelWidth, this.panelHeight);

    // draw pixels to frameImageData
    let dataIndex = 0;
    for (const pixelIndex in this.ledPixels) {
      const pixel = this.ledPixels[pixelIndex];
      const color = pallette[pixel].split(",");
      frameImageData.data[dataIndex] = parseInt(color[0]);
      frameImageData.data[dataIndex + 1] = parseInt(color[1]);
      frameImageData.data[dataIndex + 2] = parseInt(color[2]);
      frameImageData.data[dataIndex + 3] = 255;
      dataIndex = dataIndex + 4;
    }

    // draw new frame to canvas
    this.pixelCanvasCxt.putImageData(frameImageData, 0, 0);

  }

  /**
   * Event handler to catch and handle mouse move and mouse down events on pixel canvas
   * @param {event} evt 
   */
  handleGridEvent(evt) {
    // grab active color pallette
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);
    //find size of pixels being drawn based on size of pixel canvas
    const gridPixelWidth = this.pixelGrid.offsetWidth / this.panelWidth;
    const gridPixelHeight = this.pixelGrid.offsetHeight / this.panelHeight;
    // determine pixel X,Y of cursor based on pixel size in canvas
    const pixelX = Math.floor((evt.clientX - this.gridOffsetX) / gridPixelWidth);
    const pixelY = Math.floor((evt.clientY - this.gridOffsetY) / gridPixelHeight);
    // find color of pixel under cursor
    const pixelIndex = (pixelY * this.panelWidth) + pixelX;
    const pixelColorIndex = this.ledPixels[pixelIndex];
    // update info panel
    document.getElementById("cursorXPos").innerText = pixelX;
    document.getElementById("cursorYPos").innerText = pixelY;
    document.getElementById("rgbAtCursor").innerText = pallette[pixelColorIndex];
    // handle left/right mouse clicks
    if (evt.buttons === 1 || evt.buttons === 2) {
      this.selectPixel(evt, pixelIndex, pallette);
    }

  }

  selectTool(toolName) {
    this.activeTool = toolName;
    const toolButtons = document.getElementById("brushTools").children;

    for(let i=0; i<toolButtons.length; i++) {
      const currButton = toolButtons[i];
      currButton.className = "material-icons";
      if(currButton.id.indexOf(this.activeTool) >= 0) {
        currButton.className += " on";
      }
    }
  }

  /**
   * 
   * @param {mouseEvent} evt 
   * @param {pixelIndex} index 
   * @param {colorPallette} pallette 
   */
  selectPixel(evt, index, pallette) {

    const currPixelColor = pallette[this.ledPixels[index]];
    // switch/case is for adding more tools later such as a color picker
    switch (this.activeTool) {
      case "dropper":
        if (evt.buttons === 1) {
          const colorArr = currPixelColor.split(",");
          this.selectColor(swim.Color.rgb(colorArr[0], colorArr[1], colorArr[2]));
        }
        break;
      case "eraser":
        // update pixel color in led pixel array for current frame
        const colorArr = `${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b}`;
        const colorIndex = pallette.indexOf(colorArr);
        this.ledPixels[index] = colorIndex;
        // update frame data in animation
        this.animationsList[this.selectedAnimation].frames[this.selectedFrame] = `[${this.ledPixels.toString()}]`;

        // if sync enabled, update panel with changes
        if (this.ledCommand === "sync") {
          this.showLedPixels();
        }

        break;

      case "fill":
        if (evt.buttons === 1 || evt.buttons === 2) {
          let currColorArr = null;
          // pick what the new color will be based on which mouse button was clicked
          if (evt.buttons === 1) {
            currColorArr = `${this.foregroundColor.r},${this.foregroundColor.g},${this.foregroundColor.b}`;
          } else if (evt.buttons === 2) {
            currColorArr = `${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b}`;
          }
          // find color index of new color in active color pallette
          let palletteIndex = pallette.indexOf(currColorArr);
          // if color index now found add new color
          if (palletteIndex < 0) {
            pallette.push(currColorArr)
            this.animationsList[this.selectedAnimation].pallette = JSON.stringify(pallette);
            palletteIndex = pallette.length - 1;
            this.drawActiveColorPallette();
          }
  
          // update pixel color in led pixel array for current frame          
          const fillColorIndex = pallette.indexOf(currColorArr);

          // update frame with an area fill using 'fillColorIndex' and starting from where the canvas was clicked
          this.fillFromPixel(index, fillColorIndex);

          // update the frames in the selected animation with the updated frame
          this.animationsList[this.selectedAnimation].frames[this.selectedFrame] = `[${this.ledPixels.toString()}]`;

          // if sync enabled, update panel with changes
          if (this.ledCommand === "sync") {
            this.showLedPixels();
          }
      
        }
        break;
  
      case "brush":
      default:
        let currColorArr = null;
        // pick what the new color will be based on which mouse button was clicked
        if (evt.buttons === 1) {
          currColorArr = `${this.foregroundColor.r},${this.foregroundColor.g},${this.foregroundColor.b}`;
        } else if (evt.buttons === 2) {
          currColorArr = `${this.backgroundColor.r},${this.backgroundColor.g},${this.backgroundColor.b}`;
        }
        // find color index of new color in active color pallette
        let palletteIndex = pallette.indexOf(currColorArr);
        // if color index now found add new color
        if (palletteIndex < 0) {
          pallette.push(currColorArr)
          this.animationsList[this.selectedAnimation].pallette = JSON.stringify(pallette);
          palletteIndex = pallette.length - 1;
          this.drawActiveColorPallette();
        }
        // update pixel color in led pixel array for current frame
        this.ledPixels[index] = palletteIndex;
        // update frame data in animation
        this.animationsList[this.selectedAnimation].frames[this.selectedFrame] = `[${this.ledPixels.toString()}]`;

        // if sync enabled, update panel with changes
        if (this.ledCommand === "sync") {
          this.showLedPixels();
        }

        break;


    }
  }

  /**
   * fill bucket tool. will fill a target area starting from pixel that was clicked.
   * this will call itself recursively in order to fill an area.
   * @param {*} pixelIndex - index of clicked pixel
   * @param {*} colorIndex - color to fill area to
   */
  fillFromPixel(pixelIndex, colorIndex) {
    // console.info('fill', pixelIndex, colorIndex);
    //set current pixel
    if(this.ledPixels[pixelIndex] === colorIndex) {
      return;
    }
    // set some color values
    const previousColorIndex = this.ledPixels[pixelIndex];
    this.ledPixels[pixelIndex] = colorIndex;

    // find neighbor pixels
    const leftPixel = this.ledPixels[pixelIndex-1];
    const rightPixel = this.ledPixels[pixelIndex+1];
    const topPixel = this.ledPixels[pixelIndex-this.panelWidth];
    const bottomPixel = this.ledPixels[pixelIndex+this.panelWidth];

    // find edge pixels to limit fill to
    const minHorizontalIndex = Math.floor(pixelIndex / this.panelWidth) * this.panelWidth;
    const maxHorizontalIndex = Math.ceil(pixelIndex/ this.panelWidth) * this.panelWidth;
    const minVerticalIndex = pixelIndex - minHorizontalIndex;
    const maxVerticalIndex = (this.panelWidth * this.panelHeight) - (this.panelWidth - (pixelIndex - Math.floor(pixelIndex / this.panelWidth) * this.panelWidth)-1);

    // fill to left from current pixel
    if(pixelIndex-1 >= 0 && (pixelIndex-1 >= minHorizontalIndex)) {
      if(leftPixel === previousColorIndex) {
        this.fillFromPixel(pixelIndex-1, colorIndex);
      }  
    }

    // fill to right
    if(pixelIndex+1 < this.ledPixels.length && (pixelIndex+1 < maxHorizontalIndex)) {
      if(rightPixel === previousColorIndex) {
        this.fillFromPixel(pixelIndex+1, colorIndex);
      }  
    }    

    // fill up from current pixel
    if(pixelIndex-this.panelWidth >= 0 && (pixelIndex-this.panelWidth >= minVerticalIndex)) {
      if(topPixel === previousColorIndex) {
        // this.ledPixels[pixelIndex-this.panelWidth] = colorIndex;
        this.fillFromPixel(pixelIndex-this.panelWidth, colorIndex);
      }
    }

    // fill down from current pixel
    if(pixelIndex+this.panelWidth < this.ledPixels.length && (pixelIndex+this.panelWidth < maxVerticalIndex)) {
      if(bottomPixel === previousColorIndex) {
        // this.ledPixels[pixelIndex+this.panelWidth] = colorIndex;
        this.fillFromPixel(pixelIndex+this.panelWidth, colorIndex);
      }
    }

  }


  /**
   * update what is shown on LED panel. Used when sync enabled.
   * Node listens on this lane to know what to draw on the panels themselves
   */
  showLedPixels() {
    const animData = this.animationsList[this.selectedAnimation];
    const framesList = animData.frames;
    this.ledPixels = JSON.parse(framesList[this.selectedFrame]);

    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedPixelIndexes', this.ledPixels.toString());
    // swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedCommand', "showPixels");
  }

  /**
   * turn on ability to sync LED panel with what is shown on animation preview
   */
  syncPanelToPreview() {
    if (!this.syncPreview) {
      if (this.ledCommand === "play") {
        this.stopAnimationOnPanel();
      }
      this.syncPreview = true;
      swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedCommand', 'sync');
      this.pushPalletteToPanel();
      this.showLedPixels();

    } else {
      this.syncPreview = false;
      swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedCommand', 'stop');

    }
  }

  /**
   * handle when the RGB sliders change
   */
  updateColorFromSlider() {
    const newR = document.getElementById("redInputRange").value;
    const newB = document.getElementById("blueInputRange").value;
    const newG = document.getElementById("greenInputRange").value;
    this.selectColor(swim.Color.rgb(newR, newG, newB));
  }

  /**
   * handle when the RGB input fields change
   */
  updateSelectedColor() {
    const newR = document.getElementById("redInput").value;
    const newB = document.getElementById("blueInput").value;
    const newG = document.getElementById("greenInput").value;
    this.selectColor(swim.Color.rgb(newR, newG, newB));
  }

  /**
   * Utility method to set all the pixels of the current frame to a specific color. defaults to black.
   * @param {*} color 
   */
  clearLedPixels(color = "0,0,0") {
    let newArr = Array.apply(null, Array(this.panelWidth * this.panelHeight));
    if (color === "selected") {
      color = `${this.foregroundColor.r},${this.foregroundColor.g},${this.foregroundColor.b},`
    }
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);
    let palletteIndex = pallette.indexOf(color);
    if (palletteIndex < 0) {
      pallette.push(color)
      this.animationsList[this.selectedAnimation].pallette = JSON.stringify(pallette);
      palletteIndex = pallette.length - 1;
      this.drawActiveColorPallette();
    }

    this.ledPixels = newArr.map(function (x, i) {
      return palletteIndex
    }).toString();

    this.animationsList[this.selectedAnimation].frames[this.selectedFrame] = `[${this.ledPixels}]`;

    // if sync enabled, update panel with changes
    if (this.ledCommand === "sync") {
      this.showLedPixels();
    }

  }

  /**
   * Draw the elements which make up the frames list row in the preview
   */
  drawFramesListElements() {
    const animData = this.animationsList[this.selectedAnimation];
    const framesList = animData.frames;

    for (let i = 0; i < framesList.length; i++) {

      if (!this.frameDivCache[i]) {
        const tempDiv = document.createElement("div");
        tempDiv.addEventListener('click', (evt) => {
          this.selectFrame(i);
        });
        this.framesDiv.appendChild(tempDiv);

        this.frameDivCache[i] = tempDiv;
        if (i % 5 === (5 - 1) || i === 0 || i === (framesList.length - 1)) {
          tempDiv.innerHTML = (i + 1);
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

    while(this.framesDiv.children.length > framesList.length) {
      delete this.frameDivCache[this.framesDiv.children.length-1];
      this.framesDiv.removeChild(this.framesDiv.children[this.framesDiv.children.length-1]);
    }


  }

  /**
   * handle selecting a new frame in the animation preview
   * @param {number} frameIndex 
   */
  selectFrame(frameIndex) {
    if (frameIndex < 0) {
      frameIndex = 0;
    }
    if (frameIndex >= this.animationsList[this.selectedAnimation].frames.length) {
      frameIndex = this.animationsList[this.selectedAnimation].frames.length - 1;
    }
    this.selectedFrame = frameIndex;
    if (this.syncPreview) {
      this.showLedPixels();
    }

    this.drawFramesListElements();

  }

  /**
   * delete selected frame from current animation
   */
  deleteFrame() {
    const animData = this.animationsList[this.selectedAnimation];
    const framesList = animData.frames;
    if (this.selectedFrame != 0 || (this.selectedFrame == 0 && framesList.length > 1)) {
      const newFrameList = framesList.slice(0, (this.selectedFrame)).concat(framesList.slice(this.selectedFrame+1, framesList.length));
      this.animationsList[this.selectedAnimation].frames = newFrameList
      this.selectFrame(this.selectedFrame - 1);
      this.drawFramesListElements();
    }
  }

  /**
   * add a new frame to current animation preview
   */
  addFrame() {
    let newArr = Array.apply(null, Array(this.panelWidth * this.panelHeight));
    let newFramePixels = newArr.map(function (x, i) {
      return "0"
    }).toString();
    this.animationsList[this.selectedAnimation].frames.push(`[${newFramePixels}]`);
    this.selectFrame(this.animationsList[this.selectedAnimation].frames.length - 1);
    this.drawFramesListElements();

  }

  /**
   * duplicate current frame. This will append the duplicated frame to the end of the animation
   */
  duplicateFrame() {
    const newFrame = this.animationsList[this.selectedAnimation].frames[this.selectedFrame].slice()
    this.animationsList[this.selectedAnimation].frames.push(newFrame);
    this.selectFrame(this.animationsList[this.selectedAnimation].frames.length - 1);
    this.drawFramesListElements();

  }

  /**
   * Select an animation to display in the animation preview
   * @param {id} animKey 
   */
  selectAnimation(animKey) {
    this.selectedAnimation = animKey

    document.getElementById("animName").value = this.animationsList[this.selectedAnimation].name;
    document.getElementById("nameIdValue").innerHTML = this.animationsList[this.selectedAnimation].id;

    document.getElementById("animSpeed").value = Math.round(1000 / this.animationsList[this.selectedAnimation].speed);
    this.selectFrame(0);
    for (let tempDiv of this.frameDivCache) {
      if(tempDiv) {
        this.framesDiv.removeChild(tempDiv);
        delete this.frameDivCache[tempDiv];
  
      }
    }
    this.frameDivCache = [];
    this.drawFramesListElements();
    this.framesDiv.scrollTo(0, 0)
    // this.drawPixels();
    this.drawActiveColorPallette();
    if (this.syncPreview) {
      this.showLedPixels();
    }

  }

  /**
   * util to push current active pallette to selected panel
   */
  pushPalletteToPanel() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setColorPallette', this.animationsList[this.selectedAnimation].pallette);
  }

  /**
   * util to push current animation preview to panel
   */
  pushAnimationToPanel() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setActiveAnimation', this.animationsList[this.selectedAnimation]);
  }

  /**
   * change panel command state to play. This should make it play whatever the active animation on the panel is.
   */
  playAnimationOnPanel() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedCommand', 'play');
  }

  /**
   * change panel state to stop. stops animations or sync.
   */
  stopAnimationOnPanel() {
    swim.command(this.swimUrl, `/ledPanel/${this.currentPanelId}`, 'setLedCommand', 'stop');
  }

  /**
   * method called by button in ui to toggle panel animation state
   */
  togglePanelAnimationState() {
    if (this.syncPreview) {
      this.syncPanelToPreview(); // this will stop sync if active
    }

    if (this.ledCommand === "stop") {
      this.playAnimationOnPanel();
      // document.getElementById("animPlayButton").value = "Stop";
    } else {
      this.stopAnimationOnPanel();
      // document.getElementById("animPlayButton").value = "Play";
    }

  }

  /**
   * play the current active action in the preview panel
   * this mostly just ticks forward the current frame number
   * actual rendering is done in the main animation loop
   */
  playAnimationPreview() {
    this.stopAnimationPreview();
    const playButton = document.getElementById("playButton");
    playButton.innerText = "stop";
    playButton.className = "material-icons on"
    
    let nextFrame = this.selectedFrame + 1;
    let totalFrames = this.animationsList[this.selectedAnimation].frames.length;
    if (nextFrame >= totalFrames) {
      nextFrame = 0;
    }
    this.selectFrame(nextFrame);

    this.animationTimer = setTimeout(this.playAnimationPreview.bind(this), this.animationsList[this.selectedAnimation].speed);

  }

  /**
   * stop animation playing in preview panel
   */
  stopAnimationPreview() {
    clearInterval(this.animationTimer);
    this.animationTimer = null;
    const playButton = document.getElementById("playButton");
    playButton.innerText = "play_arrow";
    playButton.className = "material-icons"

  }

  /**
   * called by button in ui to toggle preview animation state
   */
  toggleAnimationPreview() {
    if (this.animationsList[this.selectedAnimation].frames.length <= 1) {
      return false;
    }
    if (this.animationTimer === null) {
      this.playAnimationPreview();

    } else {
      this.stopAnimationPreview();

    }
  }

  /**
   * Called when clicking on a color chip in either pallette
   * this will update selectedColor to be the color clicked
   * @param {*} color 
   */
  selectColor(color = swim.Color.rgb(255, 255, 255)) {
    // this.selectedColor = swim.Color.rgb(newR, newG, newB);
    if (this.isFgColorActive) {
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

  toggleFgColorActive() {
    this.isFgColorActive = !this.isFgColorActive;
    document.getElementById("backgroundColorChip").style.zIndex = this.isFgColorActive ? 0 : 1;
    this.selectColor(this.isFgColorActive ? this.foregroundColor : this.backgroundColor);
  }

  /**
   * draw the 'full' rainbow color pallette
   * adjusting the totalColors value will change the total number of color chips rendered
   * into the full color pallette. The code will do its best to provide a full range of colors and shades 
   * which fit into that total number. There will always be an additional greyscale row. 
   * Values less then 32 or greater then 462 are a bit useless.
   * examples:
   *    32 chips = 6 colors w/ 5 shades each
   *    132 chips = 12 colors w/ 11 shades each
   *    256 chips = 16 colors w/ 16 shades each
   *    462 chip = 22 colors w/ 21 shades each
   */
  drawFullColorPallette() {
    const totalColors = 462;
    const palletteDiv = document.getElementById("colorPallette");
    const totalShades = Math.floor(Math.sqrt(totalColors));
    const palletteWidth = palletteDiv.offsetWidth;
    const colorChipSize = Math.floor(palletteWidth / totalShades);
    let currHue = null;
    let currShade = null;
    let totalChips = 0;
    palletteDiv.innerHTML = ""; // lazy clear the parent div

    // render greys
    for (let i = 0; i < totalShades; i++) {
      const currGrey = Math.round(Utils.interpolate(255, 0, i, totalShades - 1));
      const newColor = swim.Color.rgb(currGrey, currGrey, currGrey);
      const newColorChip = document.createElement("div");
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
      }
      currShade = Utils.interpolate(.9, 0, i % totalShades, totalShades);
      const newColor = swim.Color.hsl(currHue, 1, currShade).rgb();
      newColor.r = Math.round(newColor.r);
      newColor.g = Math.round(newColor.g);
      newColor.b = Math.round(newColor.b);
      const newColorChip = document.createElement("div");
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

  /**
   * draw the active color pallette. This should be every unique color in the selected animation.
   */
  drawActiveColorPallette() {
    const pallette = JSON.parse(this.animationsList[this.selectedAnimation].pallette);
    const palletteDiv = document.getElementById("activePallette");
    const palletteWidth = palletteDiv.offsetWidth;
    const colorChipSize = 12;
    let totalChips = 0;

    palletteDiv.innerHTML = "";
    for (let i = 0; i < pallette.length; i++) {
      const colorArr = pallette[i].split(",");
      const currColor = swim.Color.rgb(colorArr[0], colorArr[1], colorArr[2]);
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
    if (this.ledCommand === "sync") {
      this.pushPalletteToPanel();
    }

  }

  /**
   * refresh the animation list dropdown in the load dialog
   * this happens in the background so the dialog is always update to date when shown
   */
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

  /**
   * Update the list of panels sent from the animationService
   * this will render the panel listing the panel section of the page
   */
  updateNewPanelList() {
    const mainDiv = document.getElementById("mainPanelList");

    mainDiv.innerHTML = "";

    for (let panelKey in this.panelList) {
      const currPanel = this.panelList[panelKey];
      const newRow = document.createElement("div");
      newRow.onmousedown = () => {
        this.selectPanel(panelKey);
      }
      newRow.className = "panelRow";
      if (this.currentPanelId == currPanel.id) {
        newRow.className += " selectedPanel";
      }

      const nameDiv = document.createElement("div");
      nameDiv.innerHTML = `${currPanel.name}`;
      newRow.appendChild(nameDiv);

      const sizeDiv = document.createElement("div");
      sizeDiv.innerHTML = `${currPanel.width}px x ${currPanel.height}px`;
      newRow.appendChild(sizeDiv);

      const commandDiv = document.createElement("div");
      newRow.appendChild(commandDiv);

      this.panelLinks[`animCommand-${panelKey}`] = swim.nodeRef(this.swimUrl, `/ledPanel/${panelKey}`).downlinkValue().laneUri('ledCommand')
        .didSet((newValue) => {
          if (newValue.isDefined()) {
            commandDiv.innerText = `Command: ${newValue.toString()}`;
          }

        })

      mainDiv.appendChild(newRow);

    }
    for (let panelKey in this.panelLinks) {
      this.panelLinks[panelKey].open();
    }

  }

  /**
   * create a new empty animation and set it as active
   */
  newAnimation() {
    const newAnimId = Utils.newGuid();
    const newArr = Array.apply(null, Array(this.panelWidth * this.panelHeight));
    const newFrames = [newArr.map(function (x, i) {
      return "[0,0,0]"
    }).toString()];
    const newframes = [newArr.map(function (x, i) {
      return "0"
    }).toString()];

    const newAnimData = {
      id: newAnimId,
      name: "New Animation",
      speed: 66,
      loop: true,
      frames: [`[${newframes}]`],
      pallette: '["0,0,0"]'
    }
    this.animationsList[newAnimId] = newAnimData;
    this.selectAnimation(newAnimId);

  }

  /**
   * load selected animation into preview 
   */
  loadAnimation() {
    const dropdown = document.getElementById("animationList");
    const selectedAnim = dropdown[dropdown.selectedIndex].value;
    this.selectAnimation(selectedAnim);
    this.stopAnimationPreview();
    this.dialog.close()
  }

  /**
   * save current preview animation to animationService in swim
   */
  saveAnimation() {
    if (this.animationsList[this.selectedAnimation].name !== "New Animation") {
      const saveData = swim.Record.create()
        .slot("id", this.selectedAnimation)
        .slot("data", this.animationsList[this.selectedAnimation]);
      swim.command(this.swimUrl, '/animationService', 'saveAnimation', saveData);
    } else {
      console.error("new animation")
    }
  }

  /**
   * update current animation name from name input field
   */
  updateName() {
    const newName = document.getElementById("animName").value;
    this.animationsList[this.selectedAnimation].name = newName;
  }

  /**
   * update current animation speed from speed input field
   */
  updateSpeed() {
    const newSpeed = Math.ceil(1000 / document.getElementById("animSpeed").value);
    this.animationsList[this.selectedAnimation].speed = newSpeed;
    if (this.animationTimer !== null) {
      this.playAnimationPreview();
    }
  }

  /**
   * show overlay dialog
   * @param {*} dialogId 
   */
  showDialog(dialogId) {
    this.dialog.open(dialogId);
  }

  /**
   * hide overlay dialog
   */
  closeDialog() {
    this.dialog.close();
  }


  /**
   * start keypress listener to handle keyboard shortcuts
   */
  keyPressHandler() {
    document.onkeydown = (key) => {
      // console.info(key.code)
      const ctrlDown = key.ctrlKey;
      switch (key.code) {
        case "KeyB":
          if(key.target.id == "") {
            this.selectTool('brush');
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;

        case "KeyE":
          if(key.target.id == "") {
            this.selectTool('eraser');
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;

        case "KeyI":
          if(key.target.id == "") {
            this.selectTool('dropper');
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;

        case "KeyG":
        case "KeyF":
          if(key.target.id == "") {
            this.selectTool('fill');
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;

        case "KeyP":
        case "Space":
          if(key.target.id == "") {
            this.toggleAnimationPreview();
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;
  
        case "Comma":
          if(key.target.id == "") {
            this.selectFrame(this.selectedFrame-1)
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;

        case "Period":
          if(key.target.id == "") {
            this.selectFrame(this.selectedFrame+1)
            key.preventDefault();
            key.stopPropagation();
            
          }
          break;

        case "Enter":
          if(key.target.id != "") {
            key.target.blur();
            if(key.target.id === "animationList") {
              this.loadAnimation();
            }
          }
          break;
            
        case "KeyS":
          if (ctrlDown) {
            this.saveAnimation();
            key.preventDefault();
            key.stopPropagation();

          }
          break;
        case "KeyL":
          if (ctrlDown) {
            this.showDialog('loadFileDialog');
            document.getElementById("animationList").focus();
            key.preventDefault();
            key.stopPropagation();

          }
          break;          

        // case "KeyN":
        //     if (ctrlDown) {
        //       key.preventDefault();
        //       key.stopPropagation();
        //       this.newAnimation();
        //       document.getElementById("animationList").focus();
  
        //     }
        //     break;          
  
  
      }
    }
  }  

  /**
   * import one or more Piskel animation files from local disk
   * @param {*} evt 
   */
  importPiskel(evt) {
    var files = evt.target.files; // FileList object

    // for each selected file
    for (let i = 0, f; f = files[i]; i++) {
      const reader = new FileReader();

      // onload, read file and covert
      reader.onload = ((fileInfo) => {
        return (fileData) => {
          this.readPiskelFile(fileInfo, fileData);
        };
      })(f);

      // Read in the image file as a data URL.
      reader.readAsText(f);
    }
  }

  /**
   * read piskel file and turn it into an animation.
   * @param {*} fileInfo 
   * @param {*} fileData 
   */
  readPiskelFile(fileInfo, fileData) {
    const newId = Utils.newGuid();
    const piskelData = JSON.parse(fileData.target.result).piskel;
    const newAnim = {
      "id": newId,
      "name": piskelData.name,
      "speed": 1000 / piskelData.fps,
      "loop": true,
      "frames": [],
    }
    const frameWidth = this.panelWidth;
    const frameHeight = this.panelHeight;
    const framePixelCount = frameWidth * frameHeight;
    const debugArea = document.getElementById("offscreenCanvas");
    const newCanvas = document.createElement("canvas");
    // for(let layerId in piskelData.layers) {
    const currLayer = JSON.parse(piskelData.layers[0]);
    const frameCount = currLayer.frameCount;
    const canvasWidth = frameWidth * frameCount;
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
      for (let i = 0; i < totalPixels; i++) {
        if (i % frameWidth === 0) {
          frame++;
        }
        if (i % canvasWidth == 0) {
          row++;
          frame = 0;
          rowIndex = 0;
        }
        let x = rowIndex;
        let y = row;
        let pixelData = canvasContext.getImageData(x, y, 1, 1).data;

        if (!newFrames[frame]) {
          newFrames[frame] = [];
        }
        if (!newFramesByIndex[frame]) {
          newFramesByIndex[frame] = [];
        }
        const currColorStr = `[${pixelData[0]},${pixelData[1]},${pixelData[2]}],`;
        const currColorStr2 = [pixelData[0], pixelData[1], pixelData[2]].toString();
        if (pallette.indexOf(currColorStr2) === -1) {
          pallette.push(currColorStr2);
        }
        const colorIndex = pallette.indexOf(currColorStr2);
        newFramesByIndex[frame].push(colorIndex);
        rowIndex++;
        // console.info(x, y, frame, row);
      }
      for (let frame in newFrames) {
        newFramesByIndex[frame] = JSON.stringify(newFramesByIndex[frame]);
      }
      // newAnim.frames = newFrames;
      newAnim.frames = newFramesByIndex;
      newAnim.pallette = JSON.stringify(pallette);

      this.animationsList[newId] = newAnim;
      this.updateAnimationList();
    })
    tempImg.src = currLayer.chunks[0].base64PNG;
  }

}


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

}

/**
 * random helpful utilities used on the page
 */
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