# Led Panel Animator

Sample Swim application to provide a simple method to display animations on one or more commercial LED matrix display panels. Swim used to maintain panel state and NodeJS used to update panel hardware based on current Swim state. Web UI used to import, create, and manage the animations shown on the panels. 

Application contains a simple web based pixel editor that is used to create and manage the animations displayed on individual LED panels. With the pixel editor you can import animated GIFs, .piskel files, or create your own animtions. No coding needed. You can also sync your panel with what is displayed in the editor and live edit your animations right on the panel in real time.

The application itself can be highly distributed. For example, the server canon a cloud service and manage a number of remote LED panels with each panel attached to its own pi where the client runs. On the flip side, you can simply run the entire thing off a single Pi attached to a panel which runs both server and client right on that pi.

Animation data itself is stored in swim and on disk as JSON. Application supports a number of panel types and sizes with more coming soon. Even supports animating the LEDs on the Matrix Creator and SenseHat boards. Each animation is a JSON object containing things like frame size, fps, name, etc. It also contains an array of RGB values which define all the unique colors in the animation. Using that, the frame data is just a list of index lookups to this color pallette for each pixel. That way, each frame is simply a list of index lookups.

## Hardware Requriements
* Raspberry Pi 3 or 4
* LED Driver Hardware Options:
    * Adafruit RGBMatrix Hat https://www.adafruit.com/product/2345
    * SensHat [link]
    * Matrix Creator
* LED Panel Options:
    * Most 32x32, 64x64, and 64x128 LED panels
    * SenseHat 8x8 LED display
    * Matrix Creator 35 LED circle arrangement

### Notes about different hardware

#### Large LED Panels

If you are using a standard LED panel, its recommended to use the RGBMatrix Hat along with it. It makes hardware setup easier and there are some nice NodeJS APIs for talking directly with the board. No Python or Arduino required.

It is highly recommended that you disable the sound on the Pi to prevent flicker on the LED Panel. You will need to jumper pins 4 and 18 on the board as well. This makes a big difference and is worth the extra bit of work.

If you are using a 64x64 or 64x128 panel you will also need to add solder to pad 8 on the board to enable the proper LED addressing. You will also need some additional command line options to define the shape of your panel. See the bigPanel.json config file for an example 128x64 setup.

You must run NodeJS with sudo so that it gets the proper hardware access needed for high refresh rates. example: `sudo npm start config=panel1`

#### Matrix Creator

Nothing special is needed to play animations on the Creator LEDs. In the Web UI, it will appear as a panel with the size of 35x1. There is an example config file for the creator in the /config folder

#### SenseHat

The SenseHat comes with a 8x8 LED display on its face. Like the creator, nothing extra is needed to drive the LEDs other then using the proper configuration. There is an example in /config.

## Getting Started

### First steps
* [Assemble your Hat if needed](https://learn.adafruit.com/adafruit-rgb-matrix-plus-real-time-clock-hat-for-raspberry-pi/assembly) and attach it to the Pi. If you are using the RGB Matrix Hat, be sure to review the notes above about driving large panels.
* Make sure you have Nodejs 12+ installed on the Pi.
* Make sure you have Java9+ installed where ever you intend to run the server. 


### Install:
* git clone https://github.com/swimos/led-animator.git
* cd node
* npm install
* Edit your json config file in /config so that the swimUrl points to where your server will run. If you are running everything on the same Pi, 127.0.0.1 is fine.

### Run the Server (panel state manager + web ui):
* cd java
* ./gradlew run

### Run the Client (hardware bridge):
* cd node
* sudo npm start config=[configFile]



## Inside the Swim LED Manager Application

The source code has lot of comments to help you understand how things operate. If you need help or have questions, [do not hesitate to reach out and ask](https://gitter.im/swimos/community). We are happy to help!

### Server

Using the [Swim open source library](https://www.swimos.org/) we can create an application server which creates a [Swim WebAgent](https://www.swimos.org/concepts/agents/) for each LED Panel being managed by the application. Each of these WebAgent can then manage the state of the real world panel assigned to it. The data inside every WebAgent is then available to both the Panel clients and WebUI where the state is managed by a user. Clients Can open swim links to the various lanes in the WebAgent to get real time updates when that lane's value changes. This also allows for the server and client to run on different hardware from each other.

### Client

The client scripts use the [Swim JavaScript Client](https://github.com/swimos/swim/tree/master/swim-system-js/swim-mesh-js/%40swim/client) to link to and listen for changes on the [Lanes](https://www.swimos.org/concepts/lanes/) on their respective WebAgents and update the displays based on that state stored in the WebAgent. Each client runs in NodeJS and acts as a bridge to the hardware which drives the physical display. 

### WebUI

The LED Manager UI is also served by Swim and can be found at `http://<your server ip>:9001/`. The WebUI is where users manage what is displayed on each LED Panel that the server is able to manage. The UI itself is a simple pixel editor which allows of importing and editing animated Gifs for display on the LED Panel. When importing new Gifs, be sure to scale them to the correct size for your LED panel before uploading. The Ui also uses the [Swim JavaScript Client](https://github.com/swimos/swim/tree/master/swim-system-js/swim-mesh-js/%40swim/client) to link to same Swim Lanes that the node process listens on. By using [Swim command lanes](https://docs.swimos.org/java/latest/swim.api/swim/api/lane/CommandLane.html), the UI is able update and manage the LED Panel state.

## WebUI Cheatsheet

![cheatsheet](/ui/assets/images/ledAnimatorUI-cheatsheet.png)

## Useful links

*Libraries used in this example*
* https://github.com/easybotics/node-rpi-rgb-led-matrix
* https://www.npmjs.com/package/node-sense-hat
* https://github.com/buzzfeed/libgif-js (SuperGif)
* https://matrix-io.github.io/matrix-documentation/matrix-creator/overview/

*Links to hardware used in this example*
* [Adafruit RGB Matrix HAT](https://www.adafruit.com/product/2345) - for large panels
* [Matrix Creator](https://www.matrix.one/products/creator)
* [SenseHAT](https://www.adafruit.com/product/2738)
* [64x64 LED Panels](https://www.amazon.com/gp/product/B07LFJ73GQ)
* [32x32 LED Panel](https://www.amazon.com/dp/B07BMG7RG4)

*Other Useful Links*
* [Adafruit RGB Matrix Hat Assembly](https://learn.adafruit.com/adafruit-rgb-matrix-plus-real-time-clock-hat-for-raspberry-pi/assembly)

*Swim Documentation*
* [Swim Javascript Docs](https://docs.swimos.org/js/latest/index.html)
* [Swim JavaDocs](https://docs.swimos.org/java/latest/index.html)
* [Swim Tutorials](https://github.com/swimos/tutorial)
* [Swim Community](https://gitter.im/swimos/community)