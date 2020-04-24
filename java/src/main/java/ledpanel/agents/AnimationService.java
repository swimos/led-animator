package swim.ledpanel.agents;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.structure.Value;

public class AnimationService extends AbstractAgent {

    @SwimLane("animationsList")
    MapLane<String, Value> animationsList = this.<String, Value>mapLane();
  
    @SwimLane("panels")
    MapLane<String, Value> panels = this.<String, Value>mapLane();

    @SwimLane("addPanel")
    CommandLane<Value> addPanelCommand = this.<Value>commandLane().onCommand(panel -> {
      String panelName = panel.get("id").stringValue("none");
      if (panelName != "none") {
        panels.put(panelName, panel);
      }  
    });

    @SwimLane("saveAnimation")
    CommandLane<Value> saveAnimationCommand = this.<Value>commandLane().onCommand(anim -> {
      String animName = anim.get("id").stringValue("none");
      if (animName != "none") {
        animationsList.put(animName, anim.get("data"));
      }
  
    });
  
    @SwimLane("removeAnimation")
    CommandLane<String> removeAnimationCommand = this.<String>commandLane().onCommand(animName -> {
        animationsList.remove(animName);
  
    });
  
}