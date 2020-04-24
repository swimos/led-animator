**Led Panel Animator**
(work in progress)

App to drive animations on one or more commercial LED matrix display panels. Swim used to maintain panel state and node used to update panel hardware based on that state. Web UI used to import, create, and manage the animations shows on the panels. Animation data also stored in swim.

Notes:
* node drives led panel based on panel state in swim
* ui served by swim
* currently only supports panels at 32x32 pixels
* app can run without panel, just dont run node.
* both swim app and node need to be running to drive a panel
* app uses open source version of swim (3.10.2)
* WebUI can import Piskel files created from https://www.piskelapp.com/
* sample piskel animation files found in /samples folder

Install:
* git clone https://github.com/swimos/led-animator.git
* cd node
* npm install

Run Swim App (panel state manager + web ui):
* cd java
* ./gradlew run

Run Node (hardware bridge):
* cd node
* sudo npm start