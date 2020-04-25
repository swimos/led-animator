package swim.ledpanel;

import swim.api.SwimRoute;
import swim.api.agent.AgentRoute;
import swim.api.plane.AbstractPlane;
import swim.api.space.Space;
import swim.kernel.Kernel;
import swim.server.ServerLoader;
import swim.structure.Value;
import swim.uri.Uri;

import swim.ledpanel.agents.ConfigUtil;

/**
  The ApplicationPlane is the top level of the app.
  This Swim Plane defines the routes to each WebAgent
 */
public class ApplicationPlane extends AbstractPlane {

  public static void main(String[] args) throws InterruptedException {

    ConfigUtil.loadConfig();

    final Kernel kernel = ServerLoader.loadServer();
    final Space space = kernel.getSpace("ledpanel");

    kernel.start();
    System.out.println("Running LED Manager Server...");
    kernel.run();
        
  }
}
