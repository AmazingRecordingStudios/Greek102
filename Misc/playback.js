"use strict";

var jsPlayingClass = "jsplaying";
var fileNameAttribute = 'data-audio-file';

var audios = new Map();

function playclip(element) {

	if(! hasAudio(element)) {
		return;
	}

	togglePlayPauseAudio(element);
}

function togglePlayPauseAudio(element) {

	var audio = getAudio(element);

 	//audio.play();

	if ( isPausedOrStopped(element)) {
		element.classList.add(jsPlayingClass);
        audio.play();
	}
	else{
		audio.pause();
        //audio.currentTime = 0
        element.classList.remove(jsPlayingClass);
    }
}

function isPausedOrStopped(element) {

	var isPlaying = element.classList.contains(jsPlayingClass);

	return  !(isPlaying); // || audio.paused
}

function hasAudio(element) {

	// has attribute
	if(element.hasAttribute(fileNameAttribute)) {

		// has non empty fileName
		var audioFileName = element.getAttribute(fileNameAttribute);
		if(! isEmptyString(audioFileName)) {

			//file name actually works (or raise exception when trying to play)
			// .. TODO

			return true
		}

	}

	return false;
}

function getAudioFullPath(element) {
	var audioDirPath = '../Audio/';

	var audioFileName = element.getAttribute(fileNameAttribute);
	var audioFullPath = audioDirPath + audioFileName;

	return audioFullPath;
}

function getAudio(element) {
	var audioFullPath = getAudioFullPath(element);
	var audio;

	// check if audio is already loaded
	if(audios.has(audioFullPath)) {
		audio = audios.get(audioFullPath);
	}
	else {
		audio = new Audio(audioFullPath);
		audios.set(audioFullPath, audio);
	}

	audio.onended = function() {
  		element.classList.remove(jsPlayingClass);
		audios.delete(audioFullPath);
	};

	return audio;
}

function opencontextmenu(element) {
	var menu = document.getElementById('menu');
	menu.style.display = 'block';

       // close the menu on document click
        // TODO verify if the click is in the menu boundaries
        document.addEventListener("click", hideMenuEventListener);

		function hideMenuEventListener(e) {
			/*menu.style.display = 'none';
			document.removeEventListener("click", hideMenuEventListener);*/
		}

		/*
		// overwrite the right click event
        document.addEventListener("contextmenu", showMenuEventListener);


		function showMenuEventListener(e) {
            e.preventDefault();
            // show the menu
            menu.style.display = 'block';
            // set the left and top position based on mouse event coordonates
            menu.style.left = e.x + 'px';
            menu.style.top = e.y + 'px';
		}
		*/
}

function removeEmptyQuoteElements() {
	var titleClass = "title";
	var greekWordListClass = "greekWordList";
	var greekShortTextClass = "greekShortText";
	var greekLongTextClass = "greekLongText";
	var phoneticsClass = "phonetics";

	removeEmptyElements(titleClass);
	removeEmptyElements(greekWordListClass);
	removeEmptyElements(greekShortTextClass);
	removeEmptyElements(greekLongTextClass);
	removeEmptyElements(phoneticsClass);
}

function removeEmptyElements(elementClass) {
	var filteredElements = document.getElementsByClassName(elementClass);

	var index;
	for (index in filteredElements) {
	  var element = filteredElements[index];
	  if(isEmpty(element)) {
		element.style.display = 'none';
	  }
	}
}

function isEmpty(element) {
	var innerHtml = element.innerHTML;

	return isEmptyString(innerHtml);
}

function isEmptyString(string) {

	return string === "";
}

function includeLoadedHtml(request, elmnt) {
  if (request.readyState == XMLHttpRequest.DONE) {
      if (request.status == 200 || request.status == 0) {
          elmnt.innerHTML = request.responseText;
      } else
      {
        if (request.status == 404) {
          let htmlFile = getLocalResourceRelativeToRoot(elmnt);
          elmnt.innerHTML = "Page not found: " + htmlFile;
        }
        /*remove the attribute, and call this function once more:*/
        elmnt.removeAttribute("w3-include-html");
        includeHTML();
       }
    }
};

function includeHTML() {
  var elements_to_substitute, i;
  /*loop through a collection of all HTML elements:*/
  elements_to_substitute = document.querySelectorAll('[w3-include-html]');
  for (i = 0; i < elements_to_substitute.length; i++) {
    let elmnt = elements_to_substitute[i];
    /*search for elements with a certain atrribute:*/
    let htmlFile = getLocalResourceRelativeToRoot(elmnt);
    if (htmlFile) {
      /*make an HTTP request using the attribute value as the file name:*/
      let xhttp = new XMLHttpRequest();
      //was onreadystatechange / onload
      xhttp.onload = function() { includeLoadedHtml(this, elmnt); };
      xhttp.open("GET", htmlFile, true);
      xhttp.send();
    }
  }
};

function getLocalResourceRelativeToRoot(elmnt) {

  const SITE_BASE_URL = '/Greek102';

  let urlPart2 = elmnt.getAttribute("w3-include-html");

  let rootRelativeUrl = SITE_BASE_URL + urlPart2;

  return rootRelativeUrl;

};
