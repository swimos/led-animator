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
        Value obj = anim.get("data"); 
        this.saveAnimation(animName, Json.toString(obj));
      }
  
    });
  
    @SwimLane("removeAnimation")
    CommandLane<String> removeAnimationCommand = this.<String>commandLane().onCommand(animName -> {
        animationsList.remove(animName);
  
    });
  
    @Override
    public void didStart() {
      this.loadAnimations();
    }
  
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
  
    public void saveAnimation(String animId, String animData) {
      String fileName = animId + ".json";  
      String absolutePath = this.animationDir + File.separator + fileName;
  
      System.out.println("Save:" + absolutePath);
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