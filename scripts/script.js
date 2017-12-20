/*Functions*/
/* 80Years = 4160 weeks = 29120 days
Display Every Week
*/


function parse(str) {
    var args = [].slice.call(arguments, 1),
        i = 0;

    return str.replace(/%s/g, function() {
        return args[i++];
    });
}

function autotab(current,to){
    if (current.getAttribute &&
      current.value.length==current.getAttribute("maxlength")) {
        to.focus()
        }
}


function checkInput(){
  $("#submitButton").on("click", function() {
    var date = new Date();
    var day = $("#dayIn").val();
    var month = $("#monthIn").val();
    var year = $("#yearIn").val();
    var hours = $("#hIn").val();
    var minutes = $("#mIn").val();


    if((0 < day && day <= 31) && (0 < month && month <= 12) && ((date.getFullYear()-110) < year && year <= date.getFullYear())){
        $("#dateForm").slideUp(300);
        $("#submitButton").slideUp(300);
        $("#credits").hide(0);

        if(isNaN(hours) || isNaN(minutes)){
          hours = 0;
          minutes = 0;
        }
        setTimeout(calcDiff(day, month, year, hours, minutes), 300);

        /*
        var max = 2021;
        var td = new Date(max, 11, 14, 0, 0, 0, 0);
        for(var i = 1950; i<=2016; i++){
          var bt = new Date(i, 11, 14, 0, 0, 0, 0);
          var years = (Date.DateDiff("ms", bt, td, 1)/1000/60/60/24/getMeanYear(bt.getUTCFullYear(), td.getUTCFullYear())).toFixed(9);
          console.log(i, getMeanYear(i, max), years);
        }
        */

        makeGrid(daysAlive, weeksAlive, yearsAlive);

        window.setInterval(function(){
          calcDiff(day, month, year, hours, minutes);
          drawText();
        }, 50)

      }
    else {
      alert("Please enter valid birthdate");
      document.getElementById("dateForm").reset();
    }
  });
}

//Based on script from Rob Eberhardt of slingfive.com
Date.DateDiff = function(p_Interval, p_Date1, p_Date2, p_FirstDayOfWeek){
	p_FirstDayOfWeek = (isNaN(p_FirstDayOfWeek) || p_FirstDayOfWeek==0) ? vbSunday : parseInt(p_FirstDayOfWeek);

	var dt1 = p_Date1;
	var dt2 = p_Date2;

	//correct Daylight Savings Ttime (DST)-affected intervals ("d" & bigger)
	if("h,n,s,ms".indexOf(p_Interval.toLowerCase())==-1){
		if(p_Date1.toString().indexOf(":") ==-1){ dt1.setUTCHours(0,0,0,0) };	// no time, assume 12am
		if(p_Date2.toString().indexOf(":") ==-1){ dt2.setUTCHours(0,0,0,0) };	// no time, assume 12am
	}


	// get ms between UTC dates and make into "difference" date
	var iDiffMS = dt2.valueOf() - dt1.valueOf();
	var dtDiff = new Date(iDiffMS);

	// calc various diffs
	var nYears  = dt2.getUTCFullYear() - dt1.getUTCFullYear();
	var nMonths = dt2.getUTCMonth() - dt1.getUTCMonth() + (nYears!=0 ? nYears*12 : 0);
	var nQuarters = parseInt(nMonths / 3);

	var nMilliseconds = iDiffMS;
	var nSeconds = parseInt(iDiffMS / 1000);
	var nMinutes = parseInt(nSeconds / 60);
	var nHours = parseInt(nMinutes / 60);
	var nDays  = parseInt(nHours / 24);	//now fixed for DST switch days
	var nWeeks = parseInt(nDays / 7);

	if(p_Interval.toLowerCase()=='ww'){
			// set dates to 1st & last FirstDayOfWeek
			var offset = Date.DatePart("w", dt1, p_FirstDayOfWeek)-1;
			if(offset){	dt1.setDate(dt1.getDate() +7 -offset);	}
			var offset = Date.DatePart("w", dt2, p_FirstDayOfWeek)-1;
			if(offset){	dt2.setDate(dt2.getDate() -offset);	}
			// recurse to "w" with adjusted dates
			var nCalWeeks = Date.DateDiff("w", dt1, dt2) + 1;
	}

	// return difference
	switch(p_Interval.toLowerCase()){
		case "yyyy": return nYears;
		case "q": return nQuarters;
		case "m": return nMonths;
		case "y": // day of year
		case "d": return nDays;
		case "w": return nWeeks;
		case "ww":return nCalWeeks; // week of year
		case "h": return nHours;
		case "n": return nMinutes;
		case "s": return nSeconds;
		case "ms":return nMilliseconds;
		default : return "invalid interval: '" + p_Interval + "'";
	}
}

function isLeapYear(y){
  return (y%4==0 && (y%100!=0 || y%400==0));
}

function getMeanYear(start, end){
  var mean = 0;
  for(var i = start; i < end; i++){
    if(isLeapYear(i)){
      mean += 366;
    }
    else{
      mean += 365;
    }
  }
  if(isLeapYear(start)){
    mean -= 1;
  }
  if(isLeapYear(end)){
    mean += 1;
  }

  return mean/(end-start).toFixed(9);

}

function calcDiff(day, month, year, hours, minutes){

  birth = new Date(year,month-1,day, hours, minutes, 0, 0);
  today = new Date();

  secAlive = Date.DateDiff("s", birth, today, 1);
  minAlive = Date.DateDiff("n", birth, today, 1);
  hrsAlive = Date.DateDiff("h", birth, today, 1);
  daysAlive = Date.DateDiff("d", birth, today, 1);
  weeksAlive = Date.DateDiff("w", birth, today, 1);
  yearsAlive = (Date.DateDiff("ms", birth, today, 1)/1000/60/60/24/getMeanYear(birth.getUTCFullYear(), today.getUTCFullYear())).toFixed(9); //31'557'600 = sec per year (per day 86400sec SI unit)



}

function makeGrid(daysAlive, weeksAlive, yearsAlive){
  /*HTML TEST*/
  /*$("#main").html("<p>TEST</p>");*/

  $("#main").html("<div class='grid'>\n");
  $("#main").append("<div class='grid-sizer'></div>\n");

  for(var i = 0; i < 4160; i++){
    if(i <= weeksAlive){
      if(i%52==51 && i/52!=0){
        $("#main").append(parse("<div class='grid-item cyear'>%s</div>\n", Math.ceil(i/52)));
      }
      else{
        $("#main").append("<div class='grid-item lived'></div>\n");
      }
    }
    else{
      if(i%52==51){
        $("#main").append(parse("<div class='grid-item cyear'>%s</div>\n", Math.ceil(i/52)));
      }else{
        $("#main").append("<div class='grid-item toLive'></div>\n");
      }
    }
    if(i==4160-1){$("#main").append("</div><div class='bottom'></div> ");}
  }
/*
  for(var i = 0; i < (Math.round(4160-weeksAlive)); i++){
    if(i%52==51){
      $("#main").append(parse("<div class='grid-item cyear'>%s</div>\n", Math.ceil((weeksAlive/52)+(i/52))));
    }else{
      $("#main").append("<div class='grid-item toLive'></div>\n");
    }
  }*/




  /*Init Masonry*/
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });

  drawText();

}


function drawText(){

  $("#subtitle").html("This is your life until age 80.</br> Every bubble represents a week. </br> ");
  $("#subtitle").append("You have already lived the black ones.</br></br>");
  $("#subtitle").append("Reload page to enter a new date</br></br>");
  $("#subtitle").append("Birth: ", dateFormat(birth), "</br>");
  $("#subtitle").append("Today: ", dateFormat(today), "</br></br>");
  $("#subtitle").append(parse("<b>This is your %sth day alive </br></br>", daysAlive+1));
  $("#subtitle").append("Years: ", yearsAlive, "</br>");
  //$("#subtitle").append("Average year: ", getMeanYear(birth, today).toFixed(3), "</br>");
  $("#subtitle").append("Weeks: ", weeksAlive, "</br>");
  $("#subtitle").append("Days: ", daysAlive, "</br>");
  $("#subtitle").append("Hours: ", hrsAlive, "</br>");
  $("#subtitle").append("Minutes: ", minAlive, "</br>");
  $("#subtitle").append("Seconds: ", secAlive, "</br>");

  $("#counter").remove();
}




$(function() {
  var d = new Date();
  $("#credits").html("(C) " + d.getFullYear() + " by Luca Fluri" );
  checkInput();


});



/*
 * Date Format 1.2.3
 * (c) 2007-2009 Steven Levithan <stevenlevithan.com>
 * MIT license
 *
 * Includes enhancements by Scott Trenda <scott.trenda.net>
 * and Kris Kowal <cixar.com/~kris.kowal/>
 *
 * Accepts a date, a mask, or a date and a mask.
 * Returns a formatted version of the given date.
 * The date defaults to the current date/time.
 * The mask defaults to dateFormat.masks.default.
 */

var dateFormat = function () {
	var	token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g,
		timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g,
		timezoneClip = /[^-+\dA-Z]/g,
		pad = function (val, len) {
			val = String(val);
			len = len || 2;
			while (val.length < len) val = "0" + val;
			return val;
		};

	// Regexes and supporting functions are cached through closure
	return function (date, mask, utc) {
		var dF = dateFormat;

		// You can't provide utc if you skip other args (use the "UTC:" mask prefix)
		if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
			mask = date;
			date = undefined;
		}

		// Passing date through Date applies Date.parse, if necessary
		date = date ? new Date(date) : new Date;
		if (isNaN(date)) throw SyntaxError("invalid date");

		mask = String(dF.masks[mask] || mask || dF.masks["default"]);

		// Allow setting the utc argument via the mask
		if (mask.slice(0, 4) == "UTC:") {
			mask = mask.slice(4);
			utc = true;
		}

		var	_ = utc ? "getUTC" : "get",
			d = date[_ + "Date"](),
			D = date[_ + "Day"](),
			m = date[_ + "Month"](),
			y = date[_ + "FullYear"](),
			H = date[_ + "Hours"](),
			M = date[_ + "Minutes"](),
			s = date[_ + "Seconds"](),
			L = date[_ + "Milliseconds"](),
			o = utc ? 0 : date.getTimezoneOffset(),
			flags = {
				d:    d,
				dd:   pad(d),
				ddd:  dF.i18n.dayNames[D],
				dddd: dF.i18n.dayNames[D + 7],
				m:    m + 1,
				mm:   pad(m + 1),
				mmm:  dF.i18n.monthNames[m],
				mmmm: dF.i18n.monthNames[m + 12],
				yy:   String(y).slice(2),
				yyyy: y,
				h:    H % 12 || 12,
				hh:   pad(H % 12 || 12),
				H:    H,
				HH:   pad(H),
				M:    M,
				MM:   pad(M),
				s:    s,
				ss:   pad(s),
				l:    pad(L, 3),
				L:    pad(L > 99 ? Math.round(L / 10) : L),
				t:    H < 12 ? "a"  : "p",
				tt:   H < 12 ? "am" : "pm",
				T:    H < 12 ? "A"  : "P",
				TT:   H < 12 ? "AM" : "PM",
				Z:    utc ? "UTC" : (String(date).match(timezone) || [""]).pop().replace(timezoneClip, ""),
				o:    (o > 0 ? "-" : "+") + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4),
				S:    ["th", "st", "nd", "rd"][d % 10 > 3 ? 0 : (d % 100 - d % 10 != 10) * d % 10]
			};

		return mask.replace(token, function ($0) {
			return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
		});
	};
}();

// Some common format strings
dateFormat.masks = {
	"default":      "ddd mmm dd yyyy HH:MM:ss",
	shortDate:      "m/d/yy",
	mediumDate:     "mmm d, yyyy",
	longDate:       "mmmm d, yyyy",
	fullDate:       "dddd, mmmm d, yyyy",
	shortTime:      "h:MM TT",
	mediumTime:     "h:MM:ss TT",
	longTime:       "h:MM:ss TT Z",
	isoDate:        "yyyy-mm-dd",
	isoTime:        "HH:MM:ss",
	isoDateTime:    "yyyy-mm-dd'T'HH:MM:ss",
	isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
};

// Internationalization strings
dateFormat.i18n = {
	dayNames: [
		"Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat",
		"Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
	],
	monthNames: [
		"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
		"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
	]
};

// For convenience...
Date.prototype.format = function (mask, utc) {
	return dateFormat(this, mask, utc);
};
