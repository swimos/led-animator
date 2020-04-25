
package swim.ledpanel.agents;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.IOException;

import swim.uri.Uri;
import swim.json.Json;
import swim.structure.Value;

public class ConfigUtil {

  public static final String CONFIG_FILE = envCorrection(System.getenv("CONFIG"), "localhost");
  public static final String CONFIG_DIR = envCorrection(System.getenv("CONFIG_DIR"), "../config/");
  public static final String FULL_CONFIG_PATH = CONFIG_DIR + CONFIG_FILE + ".json";

  public static Value config = Value.absent();

  private static String rawFileContent = "";

  public static void loadConfig() {
    if(bufferFileContents()) {
      try {
        System.out.println("parse json config file");
        // System.out.println(rawFileContent);
        config = Json.parse(rawFileContent);
      } catch(Exception ex) {
        System.out.println("error parsing json config file");
        System.out.println(ex);
      }
    }
    
  }

  private static boolean bufferFileContents() {
    Integer lineCount = 0;
    System.out.println("read config @ " + FULL_CONFIG_PATH);
    try(BufferedReader bufferedReader = new BufferedReader(new FileReader(FULL_CONFIG_PATH))) {  
      String line = bufferedReader.readLine();
      rawFileContent = line;
      while(line != null) {
          line = bufferedReader.readLine();
          if(line != null && line != "null") {
            rawFileContent += line;
            lineCount++;
          }
      } 
        System.out.println("Read " + lineCount.toString() + " lines of " + FULL_CONFIG_PATH);
        return true;
    } catch (FileNotFoundException e) {
        System.out.println("File not found:" + FULL_CONFIG_PATH);
        return false;
    } catch (IOException e) {
        System.out.println("error reading file");
        return false;
    }    
  }  

  /**
   * Helper function that standards parsing environment variables
   *
   * @param env
   * @return null or env.trim()
   */
  private static String envCorrection(String env, String defaultValue) {
    if (env == null) {
      return defaultValue;
    } else return env.trim();
  }

  private static String envCorrection(String env) {
    return envCorrection(env, null);
  }

  /**
   * Helper function that standards parsing environment variable to uniform uppercase
   * @param env
   * @return null or env.trim().toUpperCase()
   */
  private static String upCaseCorrect(String env) {
    if (env == null) {
      return null;
    } else return env.trim().toUpperCase();
  }
}
