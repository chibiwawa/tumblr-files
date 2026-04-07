		function togglePlay() {
		  var audio = document.getElementById('sidebar-audio');
		  var btn = document.getElementById('toggle-btn');
		  if (audio.paused) {
			audio.play();
			btn.innerHTML = '⏸';
		  } else {
			audio.pause();
			btn.innerHTML = '▶';
		  }
		}
