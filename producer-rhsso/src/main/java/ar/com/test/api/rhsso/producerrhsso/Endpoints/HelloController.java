package ar.com.test.api.rhsso.producerrhsso.Endpoints;


import ar.com.test.api.rhsso.producerrhsso.Model.Hello;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HelloController {

  @GetMapping("/insecure")
  public String insecure(){
    return "Hi, i dont have security";
  }

  @GetMapping("/resource")
  public Hello getHello(@RequestParam(value = "nombre",required = false) String nombre){
    return nombre == null ? new Hello() : new Hello(nombre);
  }

}
