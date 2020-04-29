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

public class LedPanelState extends AbstractAgent {

  private TimerRef animationTimer;
  private TimerRef renderTimer;
  String[] palletteData;
  Boolean matrixDirty = false;
  Timer frameTimer = new Timer();
  Boolean isPlaying = false;
  Boolean canPlay = true;

  @SwimLane("info")
  ValueLane<Value> info = this.<Value>valueLane();

  @SwimLane("panelId")
  ValueLane<String> panelId = this.<String>valueLane();

  @SwimLane("activeAnimationId")
  ValueLane<String> activeAnimationId = this.<String>valueLane();

  @SwimLane("activeAnimationName")
  ValueLane<String> activeAnimationName = this.<String>valueLane();

  @SwimLane("currentFrame")
  ValueLane<Integer> currentFrame = this.<Integer>valueLane();

  @SwimLane("colorPallette")
  ValueLane<Value> colorPallette = this.<Value>valueLane();

  @SwimLane("frameRate")
  ValueLane<Integer> frameRate = this.<Integer>valueLane();

  @SwimLane("totalFrames")
  ValueLane<Integer> totalFrames = this.<Integer>valueLane();

  @SwimLane("frames2")
  ValueLane<Value> frames2 = this.<Value>valueLane();

  @SwimLane("ledCommand")
  ValueLane<String> ledCommand = this.<String>valueLane();

  @SwimLane("setLedCommand")
  CommandLane<String> setLedCommand = this.<String>commandLane().onCommand(commandStr -> {
    ledCommand.set(commandStr);
    System.out.println(commandStr);
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

  @SwimLane("ledPixels")
  ValueLane<String> ledPixels = this.<String>valueLane();

  @SwimLane("ledPixelIndexes")
  ValueLane<String> ledPixelIndexes = this.<String>valueLane();

  @SwimLane("setLedPixelIndexes")
  CommandLane<String> setLedPixelsCommand = this.<String>commandLane().onCommand(t -> {
    ledPixelIndexes.set(t);
  });

  @SwimLane("setColorPallette")
  CommandLane<Value> setColorPalletteCommand = this.<Value>commandLane().onCommand(t -> {
    this.colorPallette.set(t);
  });

  @SwimLane("activeAnimation")
  ValueLane<Value> activeAnimation = this.<Value>valueLane();

  @SwimLane("setActiveAnimation")
  CommandLane<Value> setActiveAnimation = this.<Value>commandLane().onCommand(anim -> {
    // System.out.println(anim);
    if(this.animationTimer != null && this.animationTimer.isScheduled()) {
      this.animationTimer.cancel();
    }
    activeAnimation.set(anim);
    activeAnimationId.set(anim.get("id").stringValue());
    activeAnimationName.set(anim.get("name").stringValue());
    frameRate.set(anim.get("speed").intValue());
    // frames.set(anim.get("frames"));
    frames2.set(anim.get("frames2"));
    colorPallette.set(anim.get("pallette"));
    totalFrames.set(frames2.get().length());
    currentFrame.set(0);

    // make sure timer is not already set
    if(!this.isPlaying && this.canPlay) {
      this.startFrameTimer();
    }
    
  });

  @SwimLane("newPanel")
  CommandLane<Value> newPanelCommand = this.<Value>commandLane().onCommand(panel -> {
    panelId.set(panel.get("id").stringValue());
    info.set(panel);
    command(Uri.parse("warp://127.0.0.1:9001"), Uri.parse("animationService"), Uri.parse("addPanel"), panel); 
  });

  // move currentFrame forward, node clients will read and render the change
  private void nextFrame() {
    this.isPlaying = false;
    if(this.canPlay) {
      Integer currFrameNumber = this.currentFrame.get();
    
      Integer newFrameNumber = currFrameNumber + 1;
      if(newFrameNumber >= this.totalFrames.get()) {
        newFrameNumber = 0;
      }
      this.currentFrame.set(newFrameNumber);
  
    }
    // this.startFrameTimer();
  }

  // private void startFrameTimer() {
  //   if(this.animationTimer != null && this.animationTimer.isScheduled()) {
  //     this.animationTimer.cancel();
  //   }

  //   this.animationTimer = setTimer(1, this::nextFrame);
  // }  
      
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
    this.ledCommand.set("stop");
  }  
  
}