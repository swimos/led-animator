package swim.ledpanel.agents;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.structure.Record;
import swim.structure.Value;
import swim.uri.Uri;
import java.util.Timer;
import java.util.TimerTask;

/**
 * Every LED Panel will get its own LedPanelState WebAgent
 * this webaget manages what animations can be displayed
 * and what should currently be rendered on the LED panel. 
 * One or more node processes will listen to lanes in this
 * agent and render what it needs to based on the agents's state. 
 * It is up to node to deal with hardware differences between LED panels.
 * Many of the default values in this agent will be populated by json config files
 * load in from Node on startup. Node will call the /newPanel command with the 
 * new config data. This also triggers the creation of the web agent.
 */
public class LedPanelState extends AbstractAgent {

  String[] palletteData;
  Boolean matrixDirty = false;
  Timer frameTimer = new Timer();
  Boolean isPlaying = false;
  Boolean canPlay = true;

  // panel config data from Node
  @SwimLane("info")
  ValueLane<Value> info = this.<Value>valueLane();

  // id used to access this webagent
  @SwimLane("panelId")
  ValueLane<String> panelId = this.<String>valueLane();

  // id of the active animation for the panel.
  @SwimLane("activeAnimationId")
  ValueLane<String> activeAnimationId = this.<String>valueLane();

  // full animation data for active animation
  @SwimLane("activeAnimation")
  ValueLane<Value> activeAnimation = this.<Value>valueLane();

  // active anim name. convenience lane for UI.
  @SwimLane("activeAnimationName")
  ValueLane<String> activeAnimationName = this.<String>valueLane();

  // the current frame number of the active animation to display
  // used by node to know what show be currently displayed.
  @SwimLane("currentFrame")
  ValueLane<Integer> currentFrame = this.<Integer>valueLane();

  // array of all the unique rgb values that make up the active animation
  @SwimLane("colorPallette")
  ValueLane<Value> colorPallette = this.<Value>valueLane();

  // framerate of active animation
  @SwimLane("frameRate")
  ValueLane<Integer> frameRate = this.<Integer>valueLane();

  // total number of frames in active animation
  @SwimLane("totalFrames")
  ValueLane<Integer> totalFrames = this.<Integer>valueLane();

  // actual frame data of active animation
  // frame data is stored as an array of string arrays with
  // each string array being an array of color indexes for every pixel.
  // that color index is a lookup into colorPallette
  @SwimLane("frames")
  ValueLane<Value> frames = this.<Value>valueLane();

  // the string array of color indexes which make up the current frame
  // this is used to let the webUI sync with the led panel itself.
  // when sync is on, Node will render ledPixelIndexes instead of currentFrame
  @SwimLane("ledPixelIndexes")
  ValueLane<String> ledPixelIndexes = this.<String>valueLane();

  // the current command the panel is running. Consider this the panel state.
  @SwimLane("ledCommand")
  ValueLane<String> ledCommand = this.<String>valueLane()
    .didSet((commandStr, oldStr) -> {
      switch(commandStr) {
        case "play":
          this.colorPallette.set(this.activeAnimation.get().get("pallette"));
          this.canPlay = true;
          break;
        case "stop":
          this.canPlay = false;
          break;
        case "sync":
          this.canPlay = false;
      }
  
    });

  // command lane used to change ledCommand. called by WebUI to manage panel state.
  @SwimLane("setLedCommand")
  CommandLane<String> setLedCommand = this.<String>commandLane().onCommand(commandStr -> {
    ledCommand.set(commandStr);
  });

  // command to update ledPixelIndex. Called by WebUI while sync command is active
  @SwimLane("setLedPixelIndexes")
  CommandLane<String> setLedPixelsCommand = this.<String>commandLane().onCommand(t -> {
    ledPixelIndexes.set(t);
  });

  // command to update the color pallette for what is being displayed. 
  // this can be called by WebUI when changing states.
  @SwimLane("setColorPallette")
  CommandLane<Value> setColorPalletteCommand = this.<Value>commandLane().onCommand(t -> {
    this.colorPallette.set(t);
  });

  // command to change the active animation data
  @SwimLane("setActiveAnimation")
  CommandLane<Value> setActiveAnimation = this.<Value>commandLane().onCommand(anim -> {

    activeAnimation.set(anim);
    activeAnimationId.set(anim.get("id").stringValue());
    activeAnimationName.set(anim.get("name").stringValue());
    frameRate.set(anim.get("speed").intValue());
    frames.set(anim.get("frames"));
    colorPallette.set(anim.get("pallette"));
    totalFrames.set(frames.get().length());
    currentFrame.set(0);

    this.ledCommand.set("play");
    
  });

  // Command to create a new Led Panel Agent. 
  // incoming data is panel configuration info.
  @SwimLane("newPanel")
  CommandLane<Value> newPanelCommand = this.<Value>commandLane().onCommand(panel -> {
    panelId.set(panel.get("id").stringValue());
    info.set(panel);
    command(Uri.parse("warp://127.0.0.1:9001"), Uri.parse("animationService"), Uri.parse("addPanel"), panel); 
  });

  // move currentFrame forward, node clients will read and render the change
  private void nextFrame() {
    this.isPlaying = false;
    if(this.ledCommand.get() == "play") {
      Integer currFrameNumber = this.currentFrame.get();
    
      Integer newFrameNumber = currFrameNumber + 1;
      if(newFrameNumber >= this.totalFrames.get()) {
        newFrameNumber = 0;
        Value loopValue = this.activeAnimation.get().get("loop");
        if(loopValue != Value.absent() && loopValue.booleanValue() == false) {
          System.out.println("stop");
          this.ledCommand.set("stop");
        }
      }
      this.currentFrame.set(newFrameNumber);
  
    }
  }

  /**
   * timer to move the animation forwarded when playing
   */
  private void startFrameTimer() {
    this.isPlaying = true;
    frameTimer.schedule(new TimerTask() {
      
      @Override
      public void run() {
        // this.isPlaying = true;
        nextFrame();
        startFrameTimer();
      }
    }, Long.valueOf(this.frameRate.get()));
    
  }

  @Override
  public void didStart() {
    this.startFrameTimer();
    this.ledCommand.set("stop");
  }  
  
}