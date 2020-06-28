
/**
 * utility class to handle importing animations from gifs and piskels
 */
class ImportUtil {

    constructor() {
  
    }
  
    readFile(fileBlob, onImport, onUpdate) {
  
      const fileName = fileBlob.name;
      const fileNameArr = fileName.split(".")
      const fileType = fileNameArr[fileNameArr.length-1];
      const reader = new FileReader();
  
      if(onUpdate) {
        onUpdate(`Running .${fileType} import`);
      }
  
      reader.onload = ((fileBlob) => {
        return (fileData) => {
          switch(fileType) {
            case "gif":
              this.importGif(fileName, fileData, onImport, onUpdate);
              break;
            case "piskel":
              this.importPiskel(fileName, fileData, onImport, onUpdate);
              break;
    
          }
          
        };
      })(fileBlob);
  
      if(fileType === "piskel") {
        reader.readAsText(fileBlob);
      } else {
        reader.readAsDataURL(fileBlob);
      }
      // 
  
    }
    
    
    importGif(fileName, fileData, onImport, onUpdate) {
  
      const img = new Image();
      img.src = fileData.target.result;
      document.getElementById("offscreenCanvas").appendChild(img);
  
      const newId = Utils.newGuid();
      const frameWidth = img.width;
      const frameHeight = img.height;
      const newAnim = {
        "id": newId,
        "name": fileName,
        "speed": 40,
        "loop": true,
        "frameWidth": frameWidth,
        "frameHeight": frameHeight,
        "frames": [],
      }
      const pallette = [];
  
      const sgif = window.SuperGif({
        gif: img,
        loop_mode: false,
        auto_play: false,
        max_width: document.getElementById("importWidth").value,
        rubbable: false
      }, false);
  
      const finalize = () => {
        if(onUpdate) {
          onUpdate(`Finalize Import`);
        }
  
        for(let frame in newAnim.frames) {
          newAnim.frames[frame] = JSON.stringify(newAnim.frames[frame]);
        }
        newAnim.pallette = JSON.stringify(pallette);
        if(onImport) {
          if(onUpdate) {
            onUpdate(`Import Complete`);
          }
          onImport(newAnim);
        }        
      }
      if(onUpdate) {
        onUpdate(`Loading GIF`);
      }

      sgif.load(() => {
        const canvasElement = sgif.get_canvas();
        const canvasContext = canvasElement.getContext("2d");
        // foreach frame in gif
        for(let z=0; z<sgif.get_length(); z++) {
          sgif.move_to(z);  
          
          // console.info(`Read frame #${z}`);
          if(onUpdate) {
            onUpdate(`Reading frame #${z}`);
          }

            const canvasWidth = img.width;
            const canvasHeight = img.height;
            newAnim.frameWidth = canvasWidth;
            newAnim.frameHeight = canvasHeight;
      
            newAnim.frames.push(this.imageToFrame(img, canvasContext, pallette));
            if(z ==sgif.get_length()-1) {
              console.info('finalize');
              finalize();
            }
          
          // const tempImg = new Image();
          // tempImg.style.imageRendering = "pixelated";

          // const mainElem = document.getElementsByTagName("main")[0];
          // mainElem.appendChild(tempImg);  
    
          // tempImg.width = document.getElementById("importWidth").value;
          // tempImg.height = document.getElementById("importHeight").value;

          // tempImg.src = canvasElement.toDataURL();

          // tempImg.onload = (() => {
          //   const tempCanvas = document.createElement("canvas");
          //   tempCanvas.width = tempImg.width;
          //   tempCanvas.style.width = `${tempImg.width}px`;
          //   tempCanvas.height = tempImg.height;
          //   tempCanvas.style.height = `${tempImg.height}px`;
          //   const canvasContext2 = tempCanvas.getContext("2d");
          //   canvasContext2.drawImage(tempImg, 0, 0, tempImg.width, tempImg.height);
                
          //   const mainElem = document.getElementsByTagName("main")[0];
          //   mainElem.appendChild(tempCanvas);
  
          //   const canvasWidth = img.width;
          //   const canvasHeight = img.height;
          //   newAnim.frameWidth = canvasWidth;
          //   newAnim.frameHeight = canvasHeight;
      
          //   newAnim.frames.push(this.imageToFrame(img, canvasContext2, pallette));
          //   if(z ==sgif.get_length()-1) {
          //     console.info('finalize');
          //     finalize();
          //   }
          // });

          
        }
      });
    }
  
    importPiskel(fileName, fileData, onImport, onUpdate) {
      const newId = Utils.newGuid();
      const piskelData = JSON.parse(fileData.target.result).piskel;
      const frameWidth = piskelData.width;
      const frameHeight = piskelData.height;
  
      const newAnim = {
        "id": newId,
        "name": piskelData.name,
        "speed": 1000 / piskelData.fps,
        "loop": true,
        "frameWidth": frameWidth,
        "frameHeight": frameHeight,
        "frames": [],
      }
      const debugArea = document.getElementById("offscreenCanvas");
      const newCanvas = document.createElement("canvas");
      // for(let layerId in piskelData.layers) {
      const currLayer = JSON.parse(piskelData.layers[0]);
      const frameCount = currLayer.frameCount;
      const canvasWidth = frameWidth * frameCount;
      const canvasHeight = frameHeight;
      const tempImg = new Image();
      const pallette = [];
  
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
  
          const currColorStr = [pixelData[0], pixelData[1], pixelData[2]].toString();
          if (pallette.indexOf(currColorStr) === -1) {
            pallette.push(currColorStr);
          }
          const colorIndex = pallette.indexOf(currColorStr);
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
        if(onImport) {
          onImport(newAnim);
        }
  
        // this.animationsList[newId] = newAnim;
        // this.updateAnimationList();
      })
      tempImg.src = currLayer.chunks[0].base64PNG;
    }  

    imageToFrame(img, canvasContext, pallette) {
      const newFrame = [];
      const canvasWidth = img.width;
      const canvasHeight = img.height;
      // newAnim.frameWidth = canvasWidth;
      // newAnim.frameHeight = canvasHeight;
      const totalPixels = canvasWidth * canvasHeight;
      let row = -1;
      let rowIndex = 0;

      // foreach pixel in frame
      for (let i = 0; i < totalPixels; i++) {
        if (i % canvasWidth == 0) {
          row++;
          rowIndex = 0;
        }
        let x = rowIndex;
        let y = row;

        let pixelData = canvasContext.getImageData(x, y, 1, 1).data;

        function toFive(pixelData) {
          let nValue = pixelData.toString();
          // let nMod = nValue%5;
          // let nEnd = nMod - (nMod<=5) ? 0 : 5;
          let newValue = 0;
          if(nValue.length === 1) {
            newValue = 0
          } else if(nValue.length === 2) {
            newValue = `${nValue[0]}0`;
          } else {
            newValue = `${nValue[0]}${nValue[1]}0`;
          }
          return newValue;
        }
        let rValue = toFive(pixelData[0].toString());
        let gValue = toFive(pixelData[1].toString());
        let bValue = toFive(pixelData[2].toString());

        const currColorStr = [rValue, gValue, bValue].toString();
        // const currColorStr = [pixelData[0], pixelData[1], pixelData[2]].toString();
        // console.info(currColorStr, pallette.indexOf(currColorStr), pallette.length);
        if (pallette.indexOf(currColorStr) === -1) {
          pallette.push(currColorStr);
        }
        const colorIndex = pallette.indexOf(currColorStr);
        newFrame.push(colorIndex);
        // console.info(x, y, frame, row);
        rowIndex++;
      }
      // newAnim.frames.push(JSON.stringify(newFrame));
      return newFrame;
      // newAnim.frames.push(newFrame);      
    }
  }