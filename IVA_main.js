// Variables
let theta_x_start;
let theta_y_start;
let x;
let y;
// Array of both x and y values, and FoV in the following order : [x1, y1, x2, y2, ... xn, yn]
let values = [];

// Defining pano dimension in 2D coordinate system (predifined) and pi_rad
let W = 16384;
let H = 8192;
let pi_rad = Math.PI;
//console.log(-pi_rad)

// Calculating starting x and y coordinate of the pixel (point P in Salento paper)
let x_start = Math.round(theta_x_start * H / pi_rad);
let y_start = Math.round(theta_y_start * H / pi_rad);


// Printing current variables
//console.log("current fov: " + pano.getFov());
pano.setPan(0);
pano.setTilt(0);
pano.setFov(50);

let panoid;

//za ip
let myip = "0.0.0.0";
ajax("https://api.ipify.org", function (data) {
  //alert(data);
  myip = data;
});

// za visitorId (unique user id)
// Taken from : https://github.com/fingerprintjs/fingerprintjs
// Initialize the agent at application startup.
const fpPromise = import('https://openfpcdn.io/fingerprintjs/v3')
  .then(FingerprintJS => FingerprintJS.load());

let visitorId;

// Get the visitor identifier when you need it.
fpPromise
  .then(fp => fp.get())
  .then(result => {
    // This is the visitor identifier:
    visitorId = result.visitorId;
    // console.log(visitorId);
  });

//
let browserName;
fnBrowserDetect();

// Mouse movements tracking
let idle_time = 0;
let mouse_tracking = function (mouse_active) {
  // Increment the idle time counter every second.
  let idleInterval = setInterval(timerIncrement, 1000); // 1 second

  document.onmousemove = function () {
    idle_time = 0;
  }
  document.onmousedown = function () {    
    idle_time = 0;
  }

  function timerIncrement() {
    idle_time = idle_time + 1;
    // za proveru u konzoli: ako je neaktivan mis 2 sekunde traking se zaustavlja
    if (idle_time == 2) {
      // console.log("zaustavi traking");
    } 
  }
};

mouse_tracking();


// We calculate x and y coordinates of the image
function CalculateImageCoordinates() {

  // Fov
  let fov = (pano.getFov() * (pi_rad / 180)).toFixed(2);

  // Izracunavamo trenutne uglove (Pan and Tilt)
  let theta_x = Math.round(pano.getPan());
  let theta_y = Math.round(pano.getTilt());
  // console.log("theta_x: " + theta_x + " , theta_y: " + theta_y);
  // Konvertujemo uglove u radijane
  theta_x = theta_x * (pi_rad / 180);
  theta_y = theta_y * (pi_rad / 180);
  theta_x = theta_x.toFixed(2); // .toFix method rounds a number To 2 decimal places
  theta_y = theta_y.toFixed(2);

  x = Math.abs(Math.round(theta_x * H / pi_rad));
  y = Math.abs(Math.round(theta_y * H / pi_rad));

  //// Izracunavamo koordinate x i y na 2D panorami nakon rotacije
  // S obzirom da 1) ugao rotacije moze da bude pozitivan ili negativan i 2) da je horizontalna rotacija beskonacna postavljamo sledece uslove za x:
  if (theta_x < 0 && theta_x > -pi_rad) {
    // x must be greater than 0
    // console.log("ugao je izmedju 0 i -pi");
    x = Math.abs(x);
  }
  if (theta_x < 0 && theta_x < -pi_rad) {
    // x must be less than 0
    // console.log("ugao je izmedju -pi i -2pi");
    x = -(Math.abs(2 * H - x));
  }
  if (theta_x > 0 && theta_x < pi_rad) {
    // x must be less than 0
    // console.log("ugao je izmedju 0 i pi");
    x = -(Math.abs(x));
  }
  if (theta_x > 0 && theta_x > pi_rad) { //
    // x must be greater than 0
    //  console.log("ugao je izmedju pi i 2pi");
    x = Math.abs(2 * H - x)
  }
  if (theta_y > 0 && theta_y < (pi_rad / 2)) {
    y = Math.abs(y);
  }
  if (theta_y < 0 && theta_y > -(pi_rad / 2)) {
    y = -y;
  }

  // console.log("x: " + x + " , y: " + y);

  values.push(x, y, fov);
  // console.log(values);

  // Get panoID to know which pano is observed
  panoid = pano.getCurrentNode();

  // anabling tracking for mobile
  

  // window width and height
  let screenHeight = window.innerHeight;
  let screenWidth = window.innerWidth;

  //ovde salji na gsheet
// Google sheet link is hidden
  var client = new HttpClient();
  client.get("https://script.google.com/macros/s/hidden/exec?VisitorUUID=" + visitorId + "&userip=" + myip + "&Platforma=" + browserName + "&X=" + x + "&Y=" + y + "&FoV=" + fov + "&panoid=" + panoid + "&screenWidth=" + screenWidth + "&screenHeight=" + screenHeight, function (response) {
    console.log("poslato ka GS -> success:x=" & x & " " & myip);
  });
}


setInterval(function () {
  if (active == true && active_skin == true && idle_time < 2) {
    CalculateImageCoordinates();
  }
}, 1000);

// setInterval(function () {
// console.log("active= " + active);
// console.log("active_skin= " + active_skin);  
// }, 1000);


var HttpClient = function () {
  this.get = function (aUrl, aCallback) {
    var anHttpRequest = new XMLHttpRequest();
    anHttpRequest.onreadystatechange = function () {
      if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
        aCallback(anHttpRequest.responseText);
    }

    anHttpRequest.open("GET", aUrl, true);
    // anHttpRequest.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    // anHttpRequest.setRequestHeader('Access-Control-Allow-Origin', '*');
    anHttpRequest.send(null);
  }
}

function getXmlHttpObject() {
  var xmlHttp;
  try {
    // Firefox, Opera 8.0+, Safari
    xmlHttp = new XMLHttpRequest();
  } catch (e) {
    // Internet Explorer
    try {
      xmlHttp = new ActiveXObject("Msxml2.XMLHTTP");
    } catch (e) {
      xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
  }
  if (!xmlHttp) {
    alert("Your browser does not support AJAX!");
  }
  return xmlHttp;
}

// nadji ip helper
function ajax(url, onSuccess, onError) {

  var xmlHttp = getXmlHttpObject();

  xmlHttp.onreadystatechange = function () {
    if (this.readyState === 4) {

      // onSuccess
      if (this.status === 200 && typeof onSuccess == 'function') {
        onSuccess(this.responseText);
      }

      // onError
      else if (typeof onError == 'function') {
        onError();
      }

    }
  };
  xmlHttp.open("GET", url, true);
  xmlHttp.send(null);
  return xmlHttp;
}

//detect browser helper
function fnBrowserDetect() {

  let userAgent = navigator.userAgent;
  //  let browserName; na pocetku zbog inicijalizacije

  if (userAgent.match(/chrome|chromium|crios/i)) {
    browserName = "chrome";
  } else if (userAgent.match(/firefox|fxios/i)) {
    browserName = "firefox";
  } else if (userAgent.match(/safari/i)) {
    browserName = "safari";
  } else if (userAgent.match(/opr\//i)) {
    browserName = "opera";
  } else if (userAgent.match(/edg/i)) {
    browserName = "edge";
  } else {
    browserName = "No browser detection";
  }


}



