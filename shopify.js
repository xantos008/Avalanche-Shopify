function getFrame(){
	var element = document.getElementById('avalancheReferral');
  	if(element){
      	var email = localStorage.getItem('email') ? localStorage.getItem('email') : 'shared@shared.com';
	    var firstName = localStorage.getItem('firstname') ? localStorage.getItem('firstname') : "shared";
	    var lastName = localStorage.getItem('lastname') ? localStorage.getItem('lastname') : "shared";
      	var fullName = firstName + " " + lastName;
      	var token = window.avalanche.token;
  		document.getElementById("avalancheReferral").innerHTML = "<iframe sandbox='allow-top-navigation allow-scripts allow-same-origin allow-forms' height='500px' width='100%' src='https://refer-ui-two.vercel.app/?email=" + email + "&name=" + fullName + "&token=" + token + "'></iframe>";
  	}
}

function getCurrentUser (){
  var customerId;
  if(window.Shopify && window.Shopify.checkout && window.Shopify.checkout.customer_id){
  	customerId = window.Shopify.checkout.customer_id;
  } else {
  	customerId = localStorage.getItem('customerId');
  }
  if(customerId){
    var xmlHttp = new XMLHttpRequest();

    xmlHttp.open("get", "https://salty-reef-38656.herokuapp.com/events/shopifyConnection/?type=default&curUrl=https://<api_key>:<api_password>@<your_site_name>.myshopify.com/admin/api/2021-01/customers/" + customerId + ".json");
    
    xmlHttp.setRequestHeader("Content-Type", "application/json");
    xmlHttp.onload = function (data) {
    var jsonResponse = JSON.parse(xmlHttp.response);
      if(jsonResponse && jsonResponse.data && jsonResponse.data.customer && jsonResponse.data.customer.email){
          localStorage.setItem('email', jsonResponse.data.customer.email);
      }
      if(jsonResponse && jsonResponse.data && jsonResponse.data.customer && jsonResponse.data.customer.first_name){
          localStorage.setItem('firstname', jsonResponse.data.customer.first_name);
      }
      if(jsonResponse && jsonResponse.data && jsonResponse.data.customer && jsonResponse.data.customer.last_name){
          localStorage.setItem('lastname', jsonResponse.data.customer.last_name);
      }
    }
    xmlHttp.send();
  }
}

function rememmberMe(){
	var emailFieldId = window.avalanche.email_field;
	var firstnameFieldId = window.avalanche.firstname_field;
	var lastnameFieldId = window.avalanche.lastname_field;
  
  	var emailField = document.getElementById(emailFieldId);
  	var firstnameField = document.getElementById(firstnameFieldId);
  	var lastnameField = document.getElementById(lastnameFieldId);
  	
  	if(emailField && emailField.length > 0){
      if(emailField.value.length > 0){
      	  localStorage.setItem('email', this.value);
      }
      emailField.addEventListener("change", function(){ 
          localStorage.setItem('email', this.value);
      });
  	}
  	if(firstnameField && firstnameField.length > 0){
      if(firstnameField.value.length > 0){
      	  localStorage.setItem('firstname', this.value);
      }
      firstnameField.addEventListener("change", function(){ 
          localStorage.setItem('firstname', this.value);
      });
    }
  	if(lastnameField && lastnameField.length > 0){
      if(lastnameField.value.length > 0){
      	  localStorage.setItem('lastname', this.value);
      }
      lastnameField.addEventListener("change", function(){ 
          localStorage.setItem('lastname', this.value);
      });
    }
}

function getToken(){
  var xmlHttp = new XMLHttpRequest();

 
  xmlHttp.open("get", " https://salty-reef-38656.herokuapp.com/events/shopifyConnection/?type=asset_key&curUrl=https://<api_key>:<api_password>@<your_site_name>.myshopify.com/admin/api/2021-01/themes/84177748073/assets.json&queryfile=config/settings_data.json");
  xmlHttp.setRequestHeader("Content-Type", "application/json");

  xmlHttp.onload = function (data) {
    var jsonResponse = JSON.parse(xmlHttp.response);
    var json = JSON.parse(jsonResponse.data.asset.value);    
    var avalancheToken = json.current.avalanche_token;
    var avalancheLiveToken = json.current.avalanche_live_token;

      var xhr = new XMLHttpRequest();
      var client_id = json.current.avalanche_client_id;
      var client_secret = json.current.avalanche_client_secret;
      xhr.open("get", "https://salty-reef-38656.herokuapp.com/events/updateTokenFromClientCreditentials?client_id=" + client_id +"&client_secret=" + client_secret);
      xhr.onload = function (data) {
        var token = JSON.parse(xhr.response);
        window.avalanche = {
          token: token.token,
          baseUrl: json.current.avalanche_site_base_url,
          redirectUrl: json.current.avalanche_site_redirect,
          premiumUrl: json.current.avalanche_site_premium_url,
          email_field: json.current.avalanche_email_field,
          firstname_field: json.current.avalanche_firstname_field,
          lastname_field: json.current.avalanche_lastname_field
        }
        localStorage.setItem('token', token.token);
        localStorage.setItem('baseUrl', json.current.avalanche_site_base_url);
        localStorage.setItem('redirectUrl', json.current.avalanche_site_redirect);
        localStorage.setItem('premiumUrl', json.current.avalanche_site_premium_url);
        localStorage.setItem('email_field', json.current.avalanche_email_field);
        localStorage.setItem('firstname_field', json.current.avalanche_firstname_field);
        localStorage.setItem('lastname_field', json.current.lastname_field);
      }
      xhr.send();


  };

  xmlHttp.send();
}
getToken();
var getAvalancheData = setInterval(avData, 1000);
function avData (){
  console.log('adasdasdasd');
  if(window.avalanche && window.avalanche.token && window.avalanche.token.length > 50){
    getFrame();
    rememmberMe();
    getFrame();
    confirmedUserRef();
    setPremiumEvent();
    clearInterval(getAvalancheData);
  }
}

function rememmberReferral (){
	const urlParams = new URLSearchParams(window.location.search);
	const refCode = urlParams.get('refAPI_ref_code');
    if(urlParams && refCode){
		localStorage.setItem('refCode', refCode);
    }
}

function setPremiumEvent (skipUrl = false){
    const data = {
      'email': localStorage.getItem('email')
    };
  	const token = window.avalanche.token;
      if(skipUrl){
          var xhr = new XMLHttpRequest();

          xhr.open("post", "https://salty-reef-38656.herokuapp.com/events/premium_event");
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.setRequestHeader("Authorization", token);

          xhr.onload = function () {
            console.log('Set premium event response: ', xhr.response);
          }
          xhr.send(data);  
      } else {
        const curUrl = window.location.href.split(window.avalanche.premiumUrl);
        if(curUrl && curUrl.length > 1){
            var xhr = new XMLHttpRequest();

            xhr.open("post", "https://salty-reef-38656.herokuapp.com/events/premium_event");
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Authorization", token);

            xhr.onload = function () {
              console.log('Set premium event response: ', xhr.response);
            }
            xhr.send(data); 
        }
      }
}

function confirmedUserRef(email = null){
	const refCode = localStorage.getItem('refCode');
  	const emailRefa = email ? email : localStorage.getItem('emailRefa');
    const token = window.avalanche.token;
  	if(refCode && emailRefa && token){
      var xhr = new XMLHttpRequest();

      xhr.open("post", "https://salty-reef-38656.herokuapp.com/events/sign_up_by_email");
      xhr.setRequestHeader("Content-Type", "application/json");
	  xhr.setRequestHeader("Authorization", token);
      var data = {
        'email': emailRefa,
        'referral_code': refCode
      }
      xhr.onload = function () {
          console.log('Confirned user referral response: ', xhr.response);
      }
      xhr.send(data);  
  	}
}

function getEmailReferrer(){
    const refCode = localStorage.getItem('refCode');
  	if(refCode){
      var xhr = new XMLHttpRequest();

      xhr.open("get", "https://salty-reef-38656.herokuapp.com/events/getRefererByCode?refCode=" + refCode);  
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onload = function (data) {
          var json = JSON.parse(xhr.response);
          if(json && json.email){
              localStorage.setItem('emailRefa', json.email);
          }
      }
      xhr.send();
 	}
    
}
getCurrentUser();
rememmberReferral();
getEmailReferrer();