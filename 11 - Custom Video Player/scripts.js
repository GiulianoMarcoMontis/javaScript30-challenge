class CustomVideoPlayer {
    constructor(selector) {
        //// selectors
        this.player = document.querySelector(selector);
        this.video = this.player.querySelector('.viewer');
        this.progress = this.player.querySelector('.progress');
        this.progressBar = this.player.querySelector('.progress__filled');
        this.toggle = this.player.querySelector('.toggle');
        this.skipButtons = this.player.querySelectorAll('[data-skip]');
        this.ranges = this.player.querySelectorAll('.player__slider');
        this.fullScreenToggle = this.player.querySelector('.fullScreenToggle');
        this.mouseDown = false;

        //// listeners
        // play-pause handlers
        this.player.addEventListener('click', this.playPause);
        this.video.addEventListener('play', this.toggleIcon);
        this.video.addEventListener('pause', this.toggleIcon);

        // volume and speed handlers 
        this.ranges.forEach(range => range.addEventListener('change', this.handleRanges));
        this.ranges.forEach(range => range.addEventListener('mousemove', this.handleRanges));

        // skip, progress and time handlers
        this.skipButtons.forEach(skipButton => skipButton.addEventListener('click', this.skipSeconds));
        this.video.addEventListener('timeupdate', this.handleTime);
        this.progress.addEventListener('click', this.dragProgress);
        this.progress.addEventListener('mousemove', () => this.mouseDown && this.dragProgress);
        this.progress.addEventListener('mousedown', this.toggleMouseDown);
        this.progress.addEventListener('mouseup', this.toggleMouseDown);

        // fullscreen handler
        this.fullScreenToggle.addEventListener('click', this.handleFullScreen)
    };

    playPause = (evt) => {
        if (evt.target === this.toggle || evt.target === this.video) {
            if (this.video.paused) this.video.play();
            else this.video.pause();
        } else return;
    };

    toggleIcon = (evt) => {
        this.toggle.textContent = this.video.paused ? '►' : '❚ ❚';
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
