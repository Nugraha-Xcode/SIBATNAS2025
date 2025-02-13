export function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) === " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

export function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

export function dateToString(date) {
  // Use an array to format the month numbers
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var month = months[date.getMonth()];
  var day = date.getDate();
  var year = date.getFullYear();

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var time =
    (hours > 11 ? hours - 11 : hours + 1) +
    ":" +
    minutes +
    (hours > 11 ? "PM" : "AM");
  // Returns formatted date as string (e.g. January 28, 2011 - 7:30PM EST)
  return month + " " + day + ", " + year + " - " + time;
}

export function dateToStringDate(date) {
  // Use an array to format the month numbers
  var months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  var month = months[date.getMonth()];
  var day = date.getDate();
  var year = date.getFullYear();

  var hours = date.getHours();
  var minutes = date.getMinutes();
  var time =
    (hours > 11 ? hours - 11 : hours + 1) +
    ":" +
    minutes +
    (hours > 11 ? "PM" : "AM");
  // Returns formatted date as string (e.g. January 28, 2011 - 7:30PM EST)
  return month + " " + day + ", " + year;
}
