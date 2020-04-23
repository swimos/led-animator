package swim.ledpanel.agents;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.concurrent.TimerRef;
import swim.structure.Record;
import swim.structure.Value;
import java.util.Timer;
import java.util.TimerTask;

public class LedPanelState extends AbstractAgent {

  private TimerRef animationTimer;
  private TimerRef renderTimer;
  String[] palletteData;
  Boolean matrixDirty = false;
  Timer frameTimer = new Timer();
  Boolean isPlaying = false;

  @SwimLane("name")
  ValueLane<String> name = this.<String>valueLane().didSet((n, o) -> {
    System.out.println("Startup servo: " + n);
  });

  @SwimLane("animationId")
  ValueLane<String> animationId = this.<String>valueLane();

  @SwimLane("currentFrame")
  ValueLane<Integer> currentFrame = this.<Integer>valueLane();

  @SwimLane("colorPallette")
  ValueLane<Value> colorPallette = this.<Value>valueLane();

  @SwimLane("frameRate")
  ValueLane<Integer> frameRate = this.<Integer>valueLane();

  @SwimLane("totalFrames")
  ValueLane<Integer> totalFrames = this.<Integer>valueLane();

  // @SwimLane("frames")
  // ValueLane<Value> frames = this.<Value>valueLane();

  @SwimLane("frames2")
  ValueLane<Value> frames2 = this.<Value>valueLane();

  @SwimLane("setName")
  CommandLane<String> setName = this.<String>commandLane().onCommand(t -> {
    name.set(t);
  });

  @SwimLane("ledCommand")
  ValueLane<String> ledCommand = this.<String>valueLane();

  @SwimLane("setLedCommand")
  CommandLane<String> setLedCommand = this.<String>commandLane().onCommand(t -> {
    ledCommand.set(t);
  });

  @SwimLane("ledMessage")
  ValueLane<String> ledMessage = this.<String>valueLane();

  @SwimLane("setLedMessage")
  CommandLane<String> setLedMessage = this.<String>commandLane().onCommand(t -> {
    ledMessage.set(t);
  });

  @SwimLane("ledPixels")
  ValueLane<String> ledPixels = this.<String>valueLane();

  @SwimLane("ledPixelIndexes")
  ValueLane<String> ledPixelIndexes = this.<String>valueLane();

  @SwimLane("setLedPixels")
  CommandLane<String> setLedPixels = this.<String>commandLane().onCommand(t -> {
    ledPixels.set(t);
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
    animationId.set(anim.get("id").stringValue());
    frameRate.set(anim.get("speed").intValue());
    // frames.set(anim.get("frames"));
    frames2.set(anim.get("frames2"));
    colorPallette.set(anim.get("pallette"));
    // this.palletteData = colorPallette.get();
    totalFrames.set(frames2.get().length());
    currentFrame.set(0);

    if(!this.isPlaying) {
      this.startFrameTimer();
    }
    
  });

  private void playNextFrame() {
    this.isPlaying = false;
    Integer currFrameNumber = this.currentFrame.get();
    // String currFrame2Str = this.frames2.get().getItem(currFrameNumber).stringValue();
    // this.ledPixelIndexes.set(currFrame2Str);
    
    Integer newFrameNumber = currFrameNumber + 1;
    if(newFrameNumber >= this.totalFrames.get()) {
      newFrameNumber = 0;
    }
    this.currentFrame.set(newFrameNumber);
    // this.startFrameTimer();
  }

  // private void startFrameTimer() {
  //   if(this.animationTimer != null && this.animationTimer.isScheduled()) {
  //     this.animationTimer.cancel();
  //   }

  //   this.animationTimer = setTimer(1, this::playNextFrame);
  // }  
      
  private void startFrameTimer() {
    this.isPlaying = true;
    frameTimer.schedule(new TimerTask() {
      
      @Override
      public void run() {
        // this.isPlaying = true;
        playNextFrame();
        startFrameTimer();
      }
    }, Long.valueOf(this.frameRate.get()));
    
  }
  
}