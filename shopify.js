function getFrame(){
	var element = document.getElementById('avalancheReferral');
  	if(element && element.length > 0){
      	var email = localStorage.getItem('email') ? localStorage.getItem('email') : 'shared@shared.com';
	    var firstName = localStorage.getItem('firstname') ? localStorage.getItem('firstname') : "shared";
	    var lastName = localStorage.getItem('lastname') ? localStorage.getItem('lastname') : "shared";
      	var fullName = firstName + " " + lastName;
  		element.innerHtml = "<iframe sandbox='allow-top-navigation allow-scripts allow-same-origin allow-forms' height='500px' width='100%' src='https://refer-ui-two.vercel.app/?email=" + email + "&name=" + fullname + "&token=" + token + "'></iframe>";
  	}
}

function getCurrentUser (){
  var xmlHttp = new XMLHttpRequest();

  xmlHttp.open("get", "https://7e1a63f175cb00e327c6a161aee5fa39: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@amote1234.myshopify.com/admin/api/2021-01/users/current.json");
  xmlHttp.setRequestHeader("Content-Type", "application/json");
  xmlHttp.onload = function (data) {
  var jsonResponse = JSON.parse(xmlHttp.response);
    if(jsonResponse && jsonResponse.user && jsonResponse.user.email){
    	localStorage.setItem('email', jsonResponse.user.email);
    }
    if(jsonResponse && jsonResponse.user && jsonResponse.user.first_name){
    	localStorage.setItem('firstname', jsonResponse.user.first_name);
    }
    if(jsonResponse && jsonResponse.user && jsonResponse.user.last_name){
    	localStorage.setItem('lastname', jsonResponse.user.last_name);
    }
  }
  xmlHttp.send();
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

  xmlHttp.open("get", "https://7e1a63f175cb00e327c6a161aee5fa39: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@amote1234.myshopify.com/admin/api/2021-01/themes/120702304415/assets.json?asset[key]=config/settings_data.json");
  xmlHttp.setRequestHeader("Content-Type", "application/json");

  xmlHttp.onload = function (data) {
    var jsonResponse = JSON.parse(xmlHttp.response);
    var json = JSON.parse(jsonResponse.asset.value);
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
      }
      xhr.send();


  };

  xmlHttp.send();
}
getToken();
var getAvalancheData = setInterval(avData, 1000);
function avData (){
  if(window.avalanche && window.avalanche.token && window.avalanche.token.length > 50){
  	clearInterval(getAvalancheData);
    getFrame();
    rememmberMe();
    getFrame();
    confirmedUserRef();
    setPremiumEvent();
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
      'email': localStorage.getItem('email');
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
setPremiumEvent();
getCurrentUser();
rememmberReferral();
getEmailReferrer();