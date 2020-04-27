console.info('[main] Loading libraries ...');

const swimClient = require('@swim/client');
const swim = require('@swim/core')
const LedMatrix = require("easybotics-rpi-rgb-led-matrix");
const commandLineArgs = process.argv;

class Main {
    constructor() {
        this.showDebug = true;
        this.mainLoopInterval = 1;
        this.links = [];
        this.args = {};
        this.config = {};

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

        this.processCommandLineArgs();
        this.loadConfig(this.args.config || 'panel1');
        this.swimPort = this.config.swimPort;
        this.swimAddress = this.config.swimAddress;
        this.swimUrl = 'ws://' + this.swimAddress + ':' + this.swimPort;
        this.panelData = {
            id: this.config.id,
            name: this.config.name,
            width: this.config.width,
            height: this.config.height
        }

        
    }

    start() {
        if (this.showDebug) {
            console.info(`[main] started panel: ${this.config.name}`);
        }
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
            .open();

        this.links["ledCommand"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('ledCommand')
            .didSet((newValue) => {
                console.info(newValue)
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

        // do not open now
        this.links["ledPixelIndexes"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.selectedPanelId}`).downlinkValue().laneUri('ledPixelIndexes')
            .didSet((newValue) => {
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

        if(this.config.panelType === "rpi-rgb-led-matrix") {
            this.matrix = new LedMatrix(this.panelData.width, this.panelData.height, this.config.chained, this.config.parallel, this.config.brightness, this.config.hardwareMapping, this.config.rgbSequence);
        }

        if(this.config.panelType === "sensehat") {
            this.matrix = require("sense-hat-led");
        }
        
        if(this.config.panelType === "matrixCreator") {
            this.matrix = require("@matrix-io/matrix-lite");
        }

        // setInterval(() => {
            this.mainLoop();
        // }, 1);

    }

    registerPanel() {
        this.selectedPanelId = this.panelData.id;
        swimClient.command(this.swimUrl, `/ledPanel/${this.selectedPanelId}`, 'newPanel', this.panelData);
    }

    drawCurrentPixelIndexes() {
        let currX = 0;
        let currY = 0;
        let everloop = new Array(this.matrix.led.length);

        //update based on swim led pixel state
        if(this.ledPixelIndexes) {

            for(let i=0; i<this.ledPixelIndexes.length; i++) {
                const currPixel = this.ledPixelIndexes[i];
                const pixelColor = this.pallette[currPixel];

                if(pixelColor && this.matrix) {
                    if(this.config.panelType === "matrixCreator") {
                        if(i<this.matrix.led.length) {
                            everloop[i] = `rgb(${pixelColor})`;
                        }
                    } else {
                        this.matrix.setPixel(currX, currY, pixelColor[0], pixelColor[1], pixelColor[2]);
                    }
                    
                }
    
                if(i%this.config.width===(this.config.width-1)) {
                    currY++;
                    currX = 0;
                } else {
                    currX++;
                }
                
            }
            if(this.config.panelType === "matrixCreator") {
                this.matrix.led.set(everloop);
            }    
        }
        this.matrixDirty = true;
    }



    /**
     * Load up configuration values from config file
     * @param {*} configName 
     */
    loadConfig(configName) {
        if (this.showDebug) {
            console.info('[main] load config');
        }
        // load config
        this.config = require('../config/' + configName + '.json');

        if (this.showDebug) {
            console.info('[main] config loaded');
        }
    }    


    /**
     * utility method to handle processing arguments from the command line
     * arguments will be stored in this.args
     */
    processCommandLineArgs() {
        commandLineArgs.forEach((val, index, arr) => {
            if (val.indexOf('=') > 0) {
                const rowValue = val.split('=');
                this.args[rowValue[0]] = rowValue[1];
            }
        })
    }    
    
    mainLoop() {
        if(this.lastFrame != this.currentFrame || this.ledCommand === "sync") {

            // if(this.pixelsDirty) {
                this.drawCurrentPixelIndexes();
                this.pixelsDirty = false;
            // }
            // if(this.matrixDirty) {
                if(this.matrix && this.panelType === "rpi-rgb-led-matrix") {
                    this.matrix.update();
                }
                
                this.matrixDirty = false;
            // }
            this.lastFrame = this.currentFrame;
        }
        setTimeout(this.mainLoop.bind(this),1);
    }

}

const app = new Main();
app.start();