const swimClient = require('@swim/client');

const commandLineArgs = process.argv;

/**
 * Main class used to drive an individual LED RGB panel
 * based on the state stored in a Swim WebAgent for that panel.
 */
class Main {
    constructor() {
        this.showDebug = false;
        this.mainLoopInterval = 30;
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
        this.frameWidth = this.config.width;
        this.frameHeight = this.config.height;

        this.mainLoopTimeout = null;
        this.tempPixel = null;
        this.tempPixelColor = null;
    }

    /**
     * main startup method. Create swim links and do basic setup to run panel.
     */
    start() {
        console.info(`[main] starting panel: ${this.config.name}`);
        this.registerPanel();

        // ** create all the required swim links to the Swim webagent to get the data needed to drive the LED panel

        // ledCommand defines the current state of the LED panel (play, stop, sync), which changes how the panel behaves
        this.links["ledCommand"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('ledCommand')
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

        // this is the array of pixels which get displayed. the value of each pixel its lookup index on the active color pallette.
        // do not open now
        this.links["ledPixelIndexes"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('ledPixelIndexes')
            .didSet((newValue) => {
                if(newValue.isDefined()) {
                    this.ledPixelIndexes = newValue.toString().split(',');
                    this.pixelsDirty = true;
                }
            })

        // current frame number to be displayed. updated by webagent to produce animations
        this.links["currentFrame"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('currentFrame')
            .didSet((newValue) => {
                this.currentFrame = newValue.numberValue(0);
                if(this.activeAnimation && this.activeAnimation.frames) {
                    this.ledPixelIndexes = this.activeAnimation.frames[this.currentFrame].replace('[','').replace(']').split(',');
                    this.pixelsDirty = true;
                }
    
            })
            .open();         

        // current animation to be displayed on the LED panel
        this.links["activeAnimation"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('activeAnimation')
            .didSet((newValue) => {
                if(newValue.toObject) {
                    this.activeAnimation = newValue.toObject();
                }
            })
            .open();         

        // ID of active animation
        this.links["activeAnimationId"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('activeAnimationId')
            .didSet((newValue) => {
                if(newValue.stringValue) {
                    this.activeAnimationId = newValue.stringValue();
                }
            })
            .open();         

        // width of active animation being displayed. This can vary from active animation and so needs its own listener.
        this.links["frameWidth"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('frameWidth')
            .didSet((newValue) => {
                if(newValue.isDefined()) {
                    this.frameWidth = newValue.numberValue();
                }
            })
            .open();         

        // height of active animation being displayed. This can vary from active animation and so needs its own listener.
        this.links["frameHeight"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('frameHeight')
            .didSet((newValue) => {
                if(newValue.isDefined()) {
                    this.frameHeight = newValue.numberValue();
                }
            })
            .open();         

        // pallette of all the unqiue colors which make up the active animation. 
        // This ends up as an array of color values stored as an array of integers for R,G and B
        this.links["ledPallette"] = swimClient.nodeRef(this.swimUrl, `/ledPanel/${this.panelData.id}`).downlinkValue().laneUri('colorPallette')
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


        // ** now setup our hardware **

        // if we are using the rgb matrix hat, initialize it
        // and set out matrix variable
        if(this.config.panelType === "rpi-rgb-led-matrix") {
            const LedMatrix = require("easybotics-rpi-rgb-led-matrix");
            this.matrix = new LedMatrix(this.panelData.width, this.panelData.height, this.config.chained, this.config.parallel, this.config.brightness, this.config.hardwareMapping, this.config.rgbSequence, this.config.cmdLineArgs);
            this.config.width = this.config.width * this.config.parallel;

        }

        // if we are suing sensehat, init and set
        if(this.config.panelType === "sensehat") {
            this.matrix = require("sense-hat-led");
            if(this.config.rotation) {
                this.matrix.setRotation(this.config.rotation);
            }
            
        }
        
        // init set and matrix creator
        if(this.config.panelType === "matrixCreator") {
            this.matrix = require("@matrix-io/matrix-lite");
        }

        // kick off main loop
        this.mainLoop();
     
        console.info(`[main] Panel Started: ${this.config.name}`);

    }

    /**
     * command to notify swim app server that this panel exists. Passes panel config to app server
     */
    registerPanel() {
        swimClient.command(this.swimUrl, `/ledPanel/${this.panelData.id}`, 'newPanel', this.config);
    }

    /**
     * Update LED pixels based on data in LedPixelIndexs. 
     * Managing the pixels happens differently for different hardware.
     * For Large LEd panels, this updates an offset canvas which gets 
     * written to the LEDs during the mainLoop update.
     * The Maxtix creator updates an array of rgb values which get passed 
     * to the Creator once the array has been updated
     * On the senseHat this just updates each pixel directly.
     */
    drawCurrentPixelIndexes() {
        let currX = 0;
        let currY = 0;
        let everloop = null;

        // if matrix creator, create new empty array for pixel data
        if(this.config.panelType === "matrixCreator") {
            everloop = new Array(this.matrix.led.length);
        }

        // make sure we have pixel data to work with
        if(this.ledPixelIndexes) {

            // for each pixel in ledPixelIndexes
            for(let i=0; i<this.ledPixelIndexes.length; i++) {
                this.tempPixel = this.ledPixelIndexes[i];
                this.tempPixelColor = this.pallette[this.tempPixel];

                // make sure we have a pixel color and hardware to talk to
                if(this.tempPixelColor && this.matrix) {
                    // update matrix creator array with pixel RGB value
                    if(this.config.panelType === "matrixCreator") {
                        if(i<this.matrix.led.length) {
                            everloop[i] = `rgb(${this.tempPixelColor})`;
                        }
                    } else {
                        // update sensehat or LED panel with new pixel RGB value
                        this.matrix.setPixel(currX, currY, this.tempPixelColor[0], this.tempPixelColor[1], this.tempPixelColor[2]);
                    }
                    
                }
    
                // do some math to keep track of the X & Y position of the current pixel inside the final image.
                if(i%this.frameWidth===(this.frameWidth-1)) {
                    currY++;
                    currX = 0;
                } else {
                    currX++;
                }
                
            }

            // if we are using the matrix creator, update it now.
            if(this.config.panelType === "matrixCreator") {
                this.matrix.led.set(everloop);
            }    

            // mark dirty flag for mainLoop
            this.matrixDirty = true;
        }
        
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
    
    /**
     * main app loop. this is where the LED panel will actually get updated
     */
    mainLoop() {
        if(this.lastFrame != this.currentFrame || this.ledCommand === "sync") {

            if(this.pixelsDirty) {
                this.drawCurrentPixelIndexes();
                this.pixelsDirty = false;
            }
            if(this.matrixDirty) {
                if(this.matrix && this.config.panelType === "rpi-rgb-led-matrix") {
                    this.matrix.update();
                }
                
                this.matrixDirty = false;
            }
            this.lastFrame = this.currentFrame;
        }
        clearTimeout(this.mainLoopTimeout);
        this.mainLoopTimeout = setTimeout(this.mainLoop.bind(this), 5);
    }

}

// create Main and start everything up.
const app = new Main();
app.start();
