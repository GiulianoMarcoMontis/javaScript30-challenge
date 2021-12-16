class CustomVideoPlayer {
    constructor(selector) {
        this.player = document.querySelector(selector);
        this.video = this.player.querySelector('.viewer');
        this.progress = this.player.querySelector('.progress');
        this.progressBar = this.player.querySelector('.progress__filled');
        this.toggle = this.player.querySelector('.toggle');
        this.skipButtons = this.player.querySelectorAll('[data-skip]');
        this.ranges = this.player.querySelectorAll('.player__slider');
        this.fullScreenToggle = this.player.querySelector('.fullScreenToggle');
        this.mouseDown = false;
    };

    playPause = () => {
        if (this.video.paused) this.video.play();
        else this.video.pause();
      };

    toggleIcon = (evt) => {
        this.toggle.textContent = evt.target.paused ? '►' : '❚ ❚';
    };
    
    skipSeconds = (evt) => {
        this.video.currentTime += parseFloat(evt.target.dataset.skip);
    };

    handleRanges = (evt) => {
        const { name, value } = evt.target;
        this.video[name] = value;
    };

    handleTime = (evt) => {
        const progressPercent = (this.video.currentTime / this.video.duration) * 100;
        this.progressBar.style.flexBasis = `${progressPercent}%`;
    };

    dragProgress = (evt) => {
        const scrubTime = (evt.offsetX / this.progress.offsetWidth) * this.video.duration;
        this.video.currentTime = scrubTime;
      };

    toggleMouseDown = () => {
        this.mouseDown = !this.mouseDown;
    };

    handleFullScreen = () => {
        document.fullscreenElement = 
            document.fullscreenElement || 
            document.mozFullscreenElement || 
            document.msFullscreenElement || 
            document.webkitFullscreenDocument;

        document.exitFullscreen = 
            document.exitFullscreen || 
            document.mozExitFullscreen || 
            document.msExitFullscreen || 
            document.webkitExitFullscreen;

        this.video.requestFullscreen = 
            this.video.requestFullscreen || 
            this.video.mozRequestFullscreen || 
            this.video.msRequestFullscreen || 
            this.video.webkitRequestFullscreen;

        
        if (!document.fullscreenElement) {
            this.video.requestFullscreen()
                .catch(err => {
                    alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
                });
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
        
    };
};

//// class init
const newVideoPlayer = new CustomVideoPlayer('.player');

//// listeners
// play-pause handlers
newVideoPlayer.video.addEventListener('click', newVideoPlayer.playPause);
newVideoPlayer.toggle.addEventListener('click', newVideoPlayer.playPause);
newVideoPlayer.video.addEventListener('play', newVideoPlayer.toggleIcon);
newVideoPlayer.video.addEventListener('pause', newVideoPlayer.toggleIcon);

// volume and speed handlers 
newVideoPlayer.ranges.forEach(range => range.addEventListener('change', newVideoPlayer.handleRanges));
newVideoPlayer.ranges.forEach(range => range.addEventListener('mousemove', newVideoPlayer.handleRanges));

// skip, progress and time handlers
newVideoPlayer.skipButtons.forEach(skipButton => skipButton.addEventListener('click', newVideoPlayer.skipSeconds));
newVideoPlayer.video.addEventListener('timeupdate', newVideoPlayer.handleTime);
newVideoPlayer.progress.addEventListener('click', newVideoPlayer.dragProgress);
newVideoPlayer.progress.addEventListener('mousemove', () => newVideoPlayer.mouseDown && newVideoPlayer.dragProgress);
newVideoPlayer.progress.addEventListener('mousedown', newVideoPlayer.toggleMouseDown);
newVideoPlayer.progress.addEventListener('mouseup', newVideoPlayer.toggleMouseDown);

// fullscreen handler
newVideoPlayer.fullScreenToggle.addEventListener('click', newVideoPlayer.handleFullScreen)
