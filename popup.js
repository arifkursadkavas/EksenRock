var Radio = {
	onLoad: function() {

		onPopSetUI();
		
		var bgPage = chrome.extension.getBackgroundPage();
		var audioElement = bgPage.player;
        
        $("#volume").slider({
            min: 0,
            max: 100,
            value: audioElement.volume,
            range: "min",
            animate: false,
            slide: function(event, ui) {
                setVolume((ui.value) / 100, true);
            }
        });
        
        var volume = localStorage.getItem('volume');
        
        if(volume == null || volume == 0){
            volume  = 0.5;    
        }	    
        
        localStorage.setItem('volume',volume)
        setVolume(volume,true);
        
        setUISlider(volume);
       

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
        
        $("#speaker").click(function(){
            storedVolume = localStorage.getItem('volume');
			if(storedVolume != 0){
                setVolume(0,true);
                setUISlider(0);
                localStorage.setItem('preMuteVolume',storedVolume);
                $("#mute").show();
            }
            else{
                var preMuteVolume = localStorage.getItem('preMuteVolume');
                setVolume(preMuteVolume,true);
                setUISlider(preMuteVolume);
                $("#mute").hide();
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
            $("#albumCover").attr('src', "img/rock.png");
			break;
		}
	}

	localStorage.setItem('playingRadio', radio);

	if(isPlaying == "true")
		audioElement.play();
}

function getCurrentSong () {
	var url = "http://www.radioeksen.com/Json/GetCurrentSong";
    

    var setCover = function(data){
        if(data!= null && data.track != null && data.track.album!= null&&data.track.album.image[1]["#text"] != null){
            $("#albumCover").attr('src', data.track.album.image[1]["#text"]);
        }
        else{
            $("#albumCover").attr('src', "img/eksen.png");
        }            
    }

	var callback = function (data) {
        $("#songName").html(data.TrackName);
        $("#bandName").html(data.Artist);
        
        var coverUrl = "http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=edc27502d7ed8bc36de8aa566c17214d&artist="+data.Artist+"&track="+data.TrackName+"&format=json";
        
        $.post(coverUrl,null,setCover,null);
        
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

function setVolume(myVolume,store) {
    var bgPage = chrome.extension.getBackgroundPage();
	var audioElement = bgPage.player;
    audioElement.volume = myVolume;
    if(store === true){
        localStorage.setItem('volume',myVolume)
    }
    if(myVolume != 0){
        $("#mute").hide();
    }
}

function setUISlider(value){
    $("#volume").slider('value', value*100);
}

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