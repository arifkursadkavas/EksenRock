var Constants = {
	eksenURL: 'http://eksenwmp.radyotvonline.com/;stream.mp3',
	rockURL: 'http://rockfm.rockfm.com.tr:9450/;stream.mp3',
	cultURL: 'https://streaming.radio.co/sefac315e7/listen',
	audioTypeMP3: 'audio/mp3',
	audioTypeMPEG: 'audio/mpeg'
};

var Stations = {
	Eksen: {
		url: 'http://eksenwmp.radyotvonline.com:80/;stream.mp3',
		audioType: 'audio/mp3'
	},
	Rock: {
		url: 'http://rockfm.rockfm.com.tr:9450/;stream.mp3',
		audioType: 'audio/mp3'
	},
	Cult: {
		url: 'https://streaming.radio.co/sefac315e7/listen',
		audioType: 'audio/mpeg'
	}
};

var Radio = {
	onLoad: function () {

		onPopSetUI();

		var bgPage = chrome.extension.getBackgroundPage();
		var audioElement = bgPage.player;

		$('#volume').slider({
			min: 0,
			max: 100,
			value: audioElement.volume,
			range: 'min',
			animate: false,
			slide: function (event, ui) {
				setVolume((ui.value) / 100, true);
			}
		});

		var volume = localStorage.getItem('volume');

		if (volume == null || volume == 0) {
			volume = 0.5;
		}

		localStorage.setItem('volume', volume);
		setVolume(volume, true);

		setUISlider(volume);


		var playingRadio = localStorage.getItem('playingRadio');

		setRadioSelection(audioElement, playingRadio);

		$('#radioEksen').click(function () {
			if (localStorage.getItem('playingRadio') != 'eksen')
				setRadioSelection(audioElement, 'eksen');
		});

		$('#rockFM').click(function () {
			if (localStorage.getItem('playingRadio') != 'rock')
				setRadioSelection(audioElement, 'rock');
		});

		$('#cultRecords').click(function () {
			if (localStorage.getItem('playingRadio') != 'cultRecords')
				setRadioSelection(audioElement, 'cultRecords');
		});

		if (audioElement.paused) {
			$('#playImage').attr('src', 'img/play.png');
			$('#albumCover').css('-webkit-animation', '');
		} else {
			$('#playImage').attr('src', 'img/pause.png');
			$('#albumCover').css('-webkit-animation', 'rotation 4s infinite linear');
		}

		$('#playImage').click(function () {
			if (this.src.indexOf('pause.png') > -1) {
				$(this).attr('src', 'img/play.png');
				play(false);
			} else {
				$(this).attr('src', 'img/pause.png');
				play(true);
			}
		});

		$('#speaker').click(function () {
			storedVolume = localStorage.getItem('volume');
			if (storedVolume != 0) {
				setVolume(0, true);
				setUISlider(0);
				localStorage.setItem('preMuteVolume', storedVolume);
				$('#mute').show();
			} else {
				var preMuteVolume = localStorage.getItem('preMuteVolume');
				setVolume(preMuteVolume, true);
				setUISlider(preMuteVolume);
				$('#mute').hide();
			}

		});

		$('#addSong').click(function () {
			var songList = [];
			songList = JSON.parse(localStorage.getItem('songList'));

			var song = $('#songName')[0].innerHTML + '-' + $('#bandName')[0].innerHTML;
			songList.push(song);
			localStorage.setItem('songList', JSON.stringify(songList));
		});
	}
};

function play(play) {
	localStorage.setItem('isPlaying', play);
	var bgPage = chrome.extension.getBackgroundPage();
	var audioElement = bgPage.player;
	if (play) {
		audioElement.play();
		$('#albumCover').css('-webkit-animation', 'rotation 4s infinite linear');
		ga('send', 'event', 'play', localStorage.getItem('playingRadio'), Date.now());
	} else {
		audioElement.pause();
		$('#albumCover').css('-webkit-animation', '');
		ga('send', 'event', 'pause', localStorage.getItem('playingRadio'), Date.now());
	}
}

function setRadioSelection(audioElement, radio) {

	var isPlaying = localStorage.getItem('isPlaying');

	switch (radio) {
		case 'eksen':

			$('#rockFM').fadeTo(0, 0.33);
			$('#cultRecords').fadeTo(0, 0.33);
			$('#radioEksen').fadeTo(0, 1);

			if (audioElement.src !== Constants.eksenURL) {
				audioElement.src = Constants.eksenURL;
				audioElement.type = Constants.audioTypeMP3;
			}

			setEksenCurrentSong();
			chrome.browserAction.setIcon({
				path: {
					'19': 'img/eksen_icon.png',
					'38': 'img/eksen_icon.png'
				}
			});
			$('body').css('background-color', '#FFD800');
			break;

		case 'rock':
			$('#radioEksen').fadeTo(0, 0.33);
			$('#cultRecords').fadeTo(0, 0.33);
			$('#rockFM').fadeTo(0, 1);

			if (audioElement.src !== Constants.rockURL) {
				audioElement.src = Constants.rockURL;
				audioElement.type = Constants.audioTypeMP3;
			}

			clearSongInfo();
			chrome.browserAction.setIcon({
				path: {
					'19': 'img/rock_icon.png',
					'38': 'img/rock_icon.png'
				}
			});
			$('body').css('background-color', '#B63440');
			$('#albumCover').attr('src', 'img/rock.png');
			break;

		case 'cultRecords':
			$('#radioEksen').fadeTo(0, 0.33);
			$('#rockFM').fadeTo(0, 0.33);
			$('#cultRecords').fadeTo(0, 1);

			if (audioElement.src !== Constants.cultURL) {
				audioElement.src = Constants.cultURL;
				audioElement.type = Constants.audioTypeMPEG;
			}

			setCultCurrentSong();
			chrome.browserAction.setIcon({
				path: {
					'19': 'img/cult_icon.png',
					'38': 'img/cult_icon.png'
				}
			});
			$('body').css('background-color', '#FAFB00');
			break;

		default:
			$('#rockFM').fadeTo(0, 0.33);
			$('#cultRecords').fadeTo(0, 0.33);
			$('#radioEksen').fadeTo(0, 1);
			if (audioElement.src !== Constants.eksenURL) {
				audioElement.src = Constants.eksenURL;
				audioElement.type = Constants.audioTypeMP3;
			}
			setEksenCurrentSong();
			chrome.browserAction.setIcon({
				path: {
					'19': 'img/eksen_icon.png',
					'38': 'img/eksen_icon.png'
				}
			});
			$('body').css('background-color', '#FFD800');
			break;

	}

	localStorage.setItem('playingRadio', radio);

	if (isPlaying === 'true' && audioElement.paused) {
		audioElement.play();
	}

	ga('send', 'event', 'changeTo', localStorage.getItem('playingRadio'), Date.now());
}

function setEksenCurrentSong() {
	var url = 'http://www.radioeksen.com/Json/GetCurrentSong';


	var setCover = function (data) {
		if (data != null && data.track != null && data.track.album != null && data.track.album.image[data.track.album.image.length - 1]['#text'] != null) {
			$('#albumCover').attr('src', data.track.album.image[data.track.album.image.length - 1]['#text']);
		} else {
			$('#albumCover').attr('src', 'img/eksen.png');
		}
	};

	var callback = function (data) {
		$('#songName').html(data.TrackName);
		$('#bandName').html(data.Artist);

		var coverUrl = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=edc27502d7ed8bc36de8aa566c17214d&artist=' + data.Artist + '&track=' + data.TrackName + '&format=json';

		$.post(coverUrl, null, setCover, null);

	};
	$.get(url, null, callback, null);
}

function setCultCurrentSong() {
	var url = 'https://public.radio.co/stations/sefac315e7/status';

	var callback = function (data) {
		$('#songName').html(data.current_track.title.split('-')[1]);
		$('#bandName').html(data.current_track.title.split('-')[0]);
		$('#albumCover').attr('src', data.current_track.artwork_url_large);

	};
	$.get(url, null, callback, null);
}

function clearSongInfo() {
	$('#songName').text('Rock FM');
	$('#bandName').text('Rock FM');
}

function onPopSetUI() {
	var playingRadio = localStorage.getItem('playingRadio');

	if (playingRadio == 'rock') {
		$('#radioEksen').fadeTo(0, 0.33);
		$('#cultRecords').fadeTo(0, 0.33);
		clearSongInfo();
	} else if (playingRadio == 'eksen') {
		$('#rock').fadeTo(0, 0.33);
		$('#cultRecords').fadeTo(0, 0.33);
		setEksenCurrentSong();
	} else if (playingRadio == 'cultRecords') {
		$('#rock').fadeTo(0, 0.33);
		$('#radioEksen').fadeTo(0, 0.33);
		setCultCurrentSong();
	}
}

function setVolume(myVolume, store) {
	var bgPage = chrome.extension.getBackgroundPage();
	var audioElement = bgPage.player;
	audioElement.volume = myVolume;
	if (store === true) {
		localStorage.setItem('volume', myVolume);
	} if (myVolume != 0) {
		$('#mute').hide();
	}
}

function setUISlider(value) {
	$('#volume').slider('value', value * 100);
}

document.addEventListener('DOMContentLoaded', function () {
	Radio.onLoad();
});

(function (i, s, o, g, r, a, m) { i['GoogleAnalyticsObject'] = r; i[r] = i[r] || function () { (i[r].q = i[r].q || []).push(arguments); }, i[r].l = 1 * new Date(); a = s.createElement(o), m = s.getElementsByTagName(o)[0]; a.async = 1; a.src = g; m.parentNode.insertBefore(a, m); })(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

ga('create', 'UA-71464712-1', 'auto');
ga('set', 'checkProtocolTask', function () { });
ga('require', 'displayfeatures');
ga('send', 'pageview', 'popup.html');		