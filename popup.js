var Radio = {
	onLoad: function() {

		onPopSetUI();
		
		var bgPage = chrome.extension.getBackgroundPage();
		var audioElement = bgPage.player;
	    audioElement.volume = 0.6;

		var playingRadio = localStorage.getItem('playingRadio');

	    if(playingRadio == "eksen")
	    {
	    	if(audioElement.paused)
	    	{
	    		audioElement.src = "http://eksenwmp.radyotvonline.com:80/;stream.mp3";
				audioElement.type="audio/mp3";
			}
	    	$("#rockFM").fadeTo( 0, 0.33);
	    	$("body").css("background-color","#FFD800"); 
	    }
	    else if(playingRadio == "rock")
	    {
	    	if(audioElement.paused)
	    	{
	    		audioElement.src = "http://rockfm.rockfm.com.tr:9450/;stream.mp3";
				audioElement.type="audio/mp3";
			}
	    	$("#radioEksen").fadeTo( 0, 0.33);
	    	$("body").css("background-color","#B63440");
	    }

		$("#radioEksen").click(function(){
			if(localStorage.getItem('playingRadio') != "eksen")
				setRadioSelection(audioElement,"eksen");		
		});

		$("#rockFM").click(function(){
			if(localStorage.getItem('playingRadio') != "rock")
				setRadioSelection(audioElement,"rock");
		});

		if(audioElement.paused)
			$("#playImage").attr('src','img/play.png');		
		else
			$("#playImage").attr('src','img/pause.png');		

		$("#playImage").click(function(){
			if(this.src.indexOf("pause.png") > -1){
				$(this).attr('src','img/play.png');
				audioElement.pause();
				localStorage.setItem('isPlaying', "false");				
			}
			else{
				$(this).attr('src','img/pause.png');
				audioElement.play();
				localStorage.setItem('isPlaying', "true");	
			}
		});	
	}
};

function setRadioSelection(audioElement, radio){
	
	var isPlaying = localStorage.getItem('isPlaying');	
	
	switch(radio)
	{
		case "eksen":
		{
			$("#rockFM").fadeTo( 0, 0.33);
			$("#radioEksen").fadeTo( 0, 1);
			audioElement.src = "http://eksenwmp.radyotvonline.com:80/;stream.mp3";
			audioElement.type="audio/mp3";
			getCurrentSong ();		
			chrome.browserAction.setIcon({path  : {
				"19": "img/eksen_icon.png",
				"38": "img/eksen_icon.png"
				}
			});
			$("body").css("background-color","#FFD800"); 
			break;
		}
		case "rock":
		{
			$("#radioEksen").fadeTo( 0, 0.33);
			$("#rockFM").fadeTo( 0, 1);
			audioElement.src = "http://rockfm.rockfm.com.tr:9450/;stream.mp3";
			audioElement.type="audio/mp3";
			clearSongInfo();			
			chrome.browserAction.setIcon({path  : {
				"19": "img/rock_icon.png",
				"38": "img/rock_icon.png"
				}
			});
			$("body").css("background-color","#B63440");
			break;
		}
	}

	localStorage.setItem('playingRadio', radio);

	if(isPlaying == "true")
		audioElement.play();
}
function getCurrentSong () {
	var url = "http://www.radioeksen.com/Json/GetCurrentSong";

	var callback = function (data) {
        $("#songName").text(data.Artist);
        $("#bandName").text(data.TrackName);

	};
	$.get(url, null, callback, null);
};

function clearSongInfo(){
	$("#songName").text("Rock FM");
	$("#bandName").text("Rock FM");
};

function onPopSetUI(){
	var playingRadio = localStorage.getItem('playingRadio');

	if(playingRadio == "rock")
	{
		$("#radioEksen").fadeTo( 0, 0.33);
		clearSongInfo();
	}
	else if(playingRadio == "eksen")
	{
		$("#rock").fadeTo( 0, 0.33);
		getCurrentSong ();
	}
};

document.addEventListener('DOMContentLoaded', function () {
	Radio.onLoad();
});

var _AnalyticsCode = 'UA-71464712-1';
var _gaq = _gaq || [];
_gaq.push(['_setAccount', _AnalyticsCode]);
_gaq.push(['_trackPageview']);

(function() {
  var ga = document.createElement('script');
  ga.type = 'text/javascript';
  ga.async = true;
  ga.src = 'https://ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(ga, s);
})();			