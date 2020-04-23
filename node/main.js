console.info('[main] Loading libraries ...');

const swimClient = require('@swim/client');
// const swim = require('@swim/core')
var LedMatrix = require("easybotics-rpi-rgb-led-matrix");

class Main {
    constructor() {
        this.hostUrl = "127.0.0.1";
        this.swimPort = 9001;
        this.swimUrl = 'ws://' + this.hostUrl + ':' + this.swimPort;
        this.showDebug = true;
        this.mainLoopInterval = 1;
        this.links = [];

        // let newArr = Array.apply(null, Array(32*32));
        // this.ledPixels = newArr.map(function(x,i) { return "[255,255,255]" }).toString();
        this.ledPixels = null;
        this.ledPixelIndexes = null;
        this.pallette = null;
        this.pixelsDirty = false;
        this.matrixDirty = false;
        this.ledMessage = "";
        this.ledCommand = null;
        this.selectedPanelId = 1;
        this.currentFrame = 0;
        this.lastFrame = -1;

        this.activeAnimation = null;
        
    }

    /**
     * main initialization method. 
     */
    initialize() {
        if (this.showDebug) {
            console.info('[main] initialize');
        }
    }

    start() {
        if (this.showDebug) {
            console.info('[main] started');
        }

        this.ledMessage = "";
        // swimClient.command(this.swimUrl, `/ledPanel/1`, 'setLedPixels', this.ledPixels);

        // this.links["ledPixelIndexes"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('ledPixelIndexes')
        //     .didSet((newValue) => {
        //         if(newValue.stringValue() !== undefined) {
        //             console.info('indexes', newValue.stringValue());
        //             // this.ledPixelIndexes = JSON.parse(newValue.stringValue());
        //             // this.pixelsDirty = true;
        //             // this.drawCurrentPixelIndexes();
        //         }                
        //     })
            // .open();         

        this.links["currentFrame"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('currentFrame')
            .didSet((newValue) => {
                this.currentFrame = newValue.numberValue(0);
                if(this.activeAnimation && this.activeAnimation.frames2) {
                    this.ledPixelIndexes = JSON.parse(this.activeAnimation.frames2[this.currentFrame]);
                    this.pixelsDirty = true;
                }
    
            })
            .open();         

        this.links["activeAnimation"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('activeAnimation')
            .didSet((newValue) => {
                // console.info('indexes', JSON.parse(newValue.stringValue()));
                if(newValue.toObject) {
                    this.activeAnimation = newValue.toObject();
                }
                
                // this.pallette = JSON.parse(this.activeAnimation.pallette);
                // console.info(this.pallette);

                // console.info(this.activeAnimation.frames2);
            })
            .open();         

        this.links["ledPallette"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('colorPallette')
            .didSet((newValue) => {
                if(newValue.stringValue() !== undefined) {
                    const rawArray = JSON.parse(newValue.stringValue());
                    this.pallette = [];
                    for(let i=0; i<rawArray.length; i++) {
                        const currColor = eval(rawArray[i].split(","));
                        this.pallette.push([parseInt(currColor[0]),parseInt(currColor[1]),parseInt(currColor[2])]);
                    }
                    // this.pixelsDirty = true;
                }                
            })
            .open();         

        this.matrix = new LedMatrix(32,32,1,1,100,'adafruit-hat-pwm', 'RGB');
        

        // setInterval(() => {
            this.mainLoop();
        // }, 1);

    }

    // drawCurrentPixels() {
    //     let currX = 0;
    //     let currY = 0;
    //     const pixelArr = JSON.parse(`[${this.ledPixels}]`)
    //     for(let i=0; i<pixelArr.length; i++) {
    //         const currPixel = pixelArr[i];

    //         this.matrix.setPixel(currX, currY, currPixel[0], currPixel[1], currPixel[2]);

    //         if(i%32===31) {
    //             currY++;
    //             currX = 0;
    //         } else {
    //             currX++;
    //         }

            
    //     }
    //     this.matrix.update();            

    // }

    drawCurrentPixelIndexes() {
        let currX = 0;
        let currY = 0;
        // console.info(this.ledPixelsIndexes);
        if(this.ledPixelIndexes) {
            for(let i=0; i<this.ledPixelIndexes.length; i++) {
                const currPixel = this.ledPixelIndexes[i];
                const pixelColor = this.pallette[currPixel];

                if(pixelColor) {
                    this.matrix.setPixel(currX, currY, pixelColor[0], pixelColor[1], pixelColor[2]);
                }
    
                if(i%32===31) {
                    currY++;
                    currX = 0;
                } else {
                    currX++;
                }
                
            }
    
        }
        this.matrixDirty = true;
    }

    
    mainLoop() {
        if(this.lastFrame != this.currentFrame) {

            // if(this.pixelsDirty) {
                this.drawCurrentPixelIndexes();
                // this.pixelsDirty = false;
            // }
            // if(this.matrixDirty) {
                this.matrix.update();
                this.matrixDirty = false;
            // }
            this.lastFrame = this.currentFrame;
        }
        setTimeout(this.mainLoop.bind(this),2);
        // this.mainLoop();
    }

}

const app = new Main();
app.start();