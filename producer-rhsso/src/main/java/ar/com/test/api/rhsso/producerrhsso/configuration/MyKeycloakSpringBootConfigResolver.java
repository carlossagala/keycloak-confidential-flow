package ar.com.test.api.rhsso.producerrhsso.configuration;

import org.keycloak.adapters.KeycloakDeployment;
import org.keycloak.adapters.KeycloakDeploymentBuilder;
import org.keycloak.adapters.spi.HttpFacade;
import org.keycloak.adapters.springboot.KeycloakSpringBootConfigResolver;
import org.keycloak.adapters.springboot.KeycloakSpringBootProperties;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;



//workaround: https://issues.jboss.org/browse/KEYCLOAK-11282
@Configuration
public class MyKeycloakSpringBootConfigResolver extends KeycloakSpringBootConfigResolver {

  @Autowired
  private KeycloakSpringBootProperties properties;

  private KeycloakDeployment keycloakDeployment;

  @Override
  public KeycloakDeployment resolve(HttpFacade.Request facade) {
    if (keycloakDeployment != null) {
      return keycloakDeployment;
    }

    keycloakDeployment = KeycloakDeploymentBuilder.build(properties);
    return keycloakDeployment;
  }
}
