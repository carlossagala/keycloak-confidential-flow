var express = require('express');
var router = express.Router();
var ClientOAuth2 = require('client-oauth2')
var Request = require("request");


const CLIENT_ID = process.env.CLIENT_ID || "api-bearer";
const CLIENT_SECRET = process.env.CLIENT_SECRET || "3623a18d-e627-4e27-b81c-45788037dcaa";
const SSO_REALM = process.env.SSO_REALM || "test";
const SSO_HOST = process.env.SSO_HOST || "http://localhost:8081";
const SCOPE = process.env.SCOPE || "api-bearer";
const RESOURCE_HOST = process.env.RESOURCE_HOST || "http://localhost:8080";


const githubAuth = new ClientOAuth2({
  clientId: CLIENT_ID,
  clientSecret: CLIENT_SECRET,
  accessTokenUri: `${SSO_HOST}/auth/realms/${SSO_REALM}/protocol/openid-connect/token`,
  scopes: [SCOPE]
})


var access_token  = null;
var refresh_token = null;
var token = null;


router.get('/', function(req, res, next) {

  res.send("/login")

});

router.get('/login', function(req, res, next) {

  if(!access_token){
    getToken(res)
  }

});


router.get('/consume', function(req, res, next) {

if(token != null) {
  token.refresh().then(new_token => {
    token = new_token
    fetchResource(res,token)
  })
}else{
  fetchResource(res)
}
});

router.get('/logout', function(req, res, next) {

    cleanToken(res);

});



function getToken(res){
   githubAuth.credentials.getToken()
      .then(function (user) {
        access_token = user.accessToken
        refresh_token = user.refreshToken

        token = githubAuth.createToken(access_token, refresh_token);

        res.send("###################\n ACCESS TOKEN: " + access_token + "\n###################")


      })
}


function cleanToken(res){
    access_token = null;
    token = null;
    refresh_token = null;

    res.send("###################\n ACCESS TOKEN: " + access_token + "\n###################");
}



function fetchResource(res, token){
  if(token){
      Request.get({"headers": { "Authorization": "bearer " + token.accessToken }, "url": `${RESOURCE_HOST}/api/resource`},
       (error, response, body) => {
          if(error) {
              return console.dir(error);
          }
          res.send(JSON.parse(body));
      });
    }else{
      Request.get(`${RESOURCE_HOST}/api/resource`, (error, response, body) => {
          if(error) {
              return console.dir(error);
          }
          res.send(JSON.parse(body));
      });




  }
  }


module.exports = router;
