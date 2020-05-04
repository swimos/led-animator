package swim.ledpanel.agents;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import swim.api.SwimLane;
import swim.api.agent.AbstractAgent;
import swim.api.lane.CommandLane;
import swim.api.lane.MapLane;
import swim.api.lane.ValueLane;
import swim.json.Json;
import swim.structure.Value;

public class AnimationService extends AbstractAgent {

    private String animationDir = "../animations";

    /**
     * Map Lane to store all the saved animations
     */
    @SwimLane("animationsList")
    MapLane<String, Value> animationsList = this.<String, Value>mapLane();
  
    /**
     * Map Lane to store each of the LED panels the app is managing
     */
    @SwimLane("panels")
    MapLane<String, Value> panels = this.<String, Value>mapLane();

    /**
     * Command Lane to add a new LED panel. 
     * Called by LedPanelState when a new panel agent is created
     */
    @SwimLane("addPanel")
    CommandLane<Value> addPanelCommand = this.<Value>commandLane().onCommand(panel -> {
      String panelName = panel.get("id").stringValue("none");
      if (panelName != "none") {
        panels.put(panelName, panel);
      }  
    });

    /**
     * Command Lane to save new or existing animation data to the animationList lane and to disk as JSON.
     * Called by Web UI when clicking the Save button.
     */
    @SwimLane("saveAnimation")
    CommandLane<Value> saveAnimationCommand = this.<Value>commandLane().onCommand(anim -> {
      String animName = anim.get("id").stringValue("none");
      if (animName != "none") {
        animationsList.put(animName, anim.get("data"));
        Value obj = anim.get("data"); 
        this.saveAnimation(animName, Json.toString(obj));
      }
  
    });

    // not used yet
    // @SwimLane("removeAnimation")
    // CommandLane<String> removeAnimationCommand = this.<String>commandLane().onCommand(animName -> {
    //     animationsList.remove(animName);
  
    // });
  
    /**
     * When AnimationService web agent starts, load all saved animations from disk
     * and populate the animationsList lane.
     */
    @Override
    public void didStart() {
      this.loadAnimations();
    }
  
    /**
     * Utility method which loads all saved animation JSON files from disk
     * Called once on startup.
     */
    private void loadAnimations() {
      final File folder = new File(this.animationDir);
      File[] listOfFiles = folder.listFiles();
      // System.out.println("Load:" + folder);
      for (final File fileEntry : listOfFiles) {
        if (!fileEntry.isDirectory()) {
              
            try(BufferedReader bufferedReader = new BufferedReader(new FileReader(fileEntry))) {  
              String line = bufferedReader.readLine();
              String animationContent = line;
              while(line != null) {
                  line = bufferedReader.readLine();
                  if(line != null && line != "null") {
                    animationContent += line;
                  }
              }            
              Value obj = Json.parse(animationContent); 

              this.animationsList.put(obj.get("id").stringValue(), obj);
    
            } catch (FileNotFoundException e) {
                System.out.println("File not found:" + "../templates" + fileEntry);
            } catch (IOException e) {
                System.out.println("error reading file");
            }
        
        } else {
            System.out.println(fileEntry.getName());
        }
      }
  
  
  
    }
  
    /**
     * utility method used to save animation data to disk as a JSON file
     * @param animId - id of the animation
     * @param animData - animation data as a string.
     */
    public void saveAnimation(String animId, String animData) {
      String fileName = animId + ".json";  
      String absolutePath = this.animationDir + File.separator + fileName;
  
      // System.out.println("Save:" + absolutePath);
      try(FileOutputStream fileOutputStream = new FileOutputStream(absolutePath)) {  
        fileOutputStream.write(animData.getBytes());
      } catch (FileNotFoundException e) {
          System.out.println("template file not found");
      } catch (IOException e) {
        System.out.println("file write error");
          // exception handling
      }      
    }    
}