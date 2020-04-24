console.info('[main] Loading libraries ...');

const swimClient = require('@swim/client');
const swim = require('@swim/core')
var LedMatrix = require("easybotics-rpi-rgb-led-matrix");

class Main {
    constructor() {
        this.hostUrl = "127.0.0.1";
        this.swimPort = 9001;
        this.swimUrl = 'ws://' + this.hostUrl + ':' + this.swimPort;
        this.showDebug = true;
        this.mainLoopInterval = 1;
        this.links = [];

        this.ledPixels = null;
        this.ledPixelIndexes = null;
        this.pallette = null;
        this.pixelsDirty = false;
        this.matrixDirty = false;
        this.ledMessage = "";
        this.ledCommand = null;
        this.selectedPanelId = -1;
        this.currentFrame = 0;
        this.lastFrame = -1;
        this.animationsList = [];

        this.activeAnimation = null;
        this.activeAnimationId = -1;
        this.ledCommand = null;
        this.panelData = {
            id: 1,
            name: "Left Panel",
            width: 32,
            height: 32
        }
        
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

        this.selectedPanelId = this.panelData.id;
        this.ledMessage = "";
        this.registerPanel();
        this.links["animList"] = swimClient.nodeRef(this.swimUrl, '/animationService').downlinkMap().laneUri('animationsList')
            .didUpdate((key, value) => {
                this.animationsList[key.stringValue()] = value.toObject();
            })
            .didRemove((key) => {
                delete this.animationsList[key.stringValue()];
            })
            .didSync(() => {
                // we may have reconnected so register panel to be sure.
                this.registerPanel();
            })
            .open();;

        this.links["ledCommand"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('ledCommand')
            .didSet((newValue) => {
                if(newValue.toString) {
                    this.ledCommand = newValue.toString();
                }
                if(this.ledCommand === "sync") {
                    this.links["ledPixelIndexes"].open();                        
                } else {
                    this.links["ledPixelIndexes"].close();
                }
            })
            .open();         

        this.links["ledPixelIndexes"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('ledPixelIndexes')
            .didSet((newValue) => {
                // console.info(newValue.isDefined());
                if(newValue.isDefined()) {
                    
                    this.ledPixelIndexes = JSON.parse(`[${newValue.toString()}]`);
                }
            })


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
                if(newValue.toObject) {
                    this.activeAnimation = newValue.toObject();
                }
            })
            .open();         

        this.links["activeAnimationId"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('activeAnimationId')
            .didSet((newValue) => {
                if(newValue.stringValue) {
                    this.activeAnimationId = newValue.stringValue();
                }
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
                }                
            })
            .open();         

        this.matrix = new LedMatrix(this.panelData.width,this.panelData.height,1,1,100,'adafruit-hat-pwm', 'RGB');
        

        // setInterval(() => {
            this.mainLoop();
        // }, 1);

    }

    registerPanel() {
        swimClient.command(this.swimUrl, `/ledPanel/${this.selectedPanelId}`, 'newPanel', this.panelData);
    }

    drawCurrentPixelIndexes() {
        let currX = 0;
        let currY = 0;

        //update based on swim led pixel state
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
        if(this.lastFrame != this.currentFrame || this.ledCommand === "sync") {

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