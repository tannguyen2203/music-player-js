const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = "MUSIC PLAYER";
const heading = $("header h2");
const cdThump = $(".cd-thumb");
const audio = $("audio");
const playBtn = $(".btn-toggle-play");
const cd = $(".cd");
const player = $(".player");
const progress = $("#progress");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Malibu",
      singer: "16 Typh",
      path: "asssets/music/16 Typh - Malibu.mp3",
      image: "asssets/image/malibu.jpg",
    },
    {
      name: "Milion Dollar Boy",
      singer: "16 Typh",
      path: "asssets/music/16 Typh - Million Dollar Boy.mp3",
      image: "asssets/image/miliondollar.jpg",
    },
    {
      name: "Pray",
      singer: "16 Typh",
      path: "asssets/music/16 Typh - Pray.mp3",
      image: "asssets/image/pray.jpg",
    },
    {
      name: "Call Out My name",
      singer: "The Weeknd",
      path: "asssets/music/Call Out My Name - The Weeknd.mp3",
      image: "asssets/image/calloutmyname.jpg",
    },
    {
      name: "Chim Sau",
      singer: "16 Typh",
      path: "asssets/music/Chim Sau - MCK Trung Tran (NhacPro.net).mp3",
      image: "asssets/image/chimsau.jpg",
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = app.songs.map((song, index) => {
      return `
                <div class="song ${
                  index === this.currentIndex ? "active" : ""
                }" data-index="${index}">
                    <div
                        class="thumb"
                        style="background-image: url('${song.image}')"
                    ></div>
                    <div class="body">
                        <h3 class="title">${song.name}</h3>
                        <p class="author">${song.singer}</p>
                    </div>
                    <div class="option">
                        <i class="fas fa-ellipsis-h"></i>
                    </div>
                  </div>
                `;
    });
    playlist.innerHTML = htmls.join("");
  },

  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },

  loadCurrentSong: function () {
    heading.textContent = app.currentSong.name;
    cdThump.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      },
    });
  },

  handleEvent: function () {
    const cdWidth = cd.offsetWidth;
    const _this = this;

    //Xu ly cd quay / dung

    const cdThumpAnimate = cdThump.animate(
      [
        {
          transform: "rotate(360deg)",
        },
      ],
      {
        duration: 10000,
        iterations: Infinity,
      }
    );
    cdThumpAnimate.pause();
    //xử lý phóng to thu nhỏ CD
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    //Xử lý play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // khi play bai hat
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumpAnimate.play();
    };
    //khi pause bai hat

    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumpAnimate.pause();
    };

    //xử lý thanh progress chạy khi play bài hát

    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor(
          (audio.currentTime / audio.duration) * 100
        );
        progress.value = progressPercent;
      }
    };

    //Xu ly khi tua bai hat
    progress.onchange = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      console.log((audio.currentTime = seekTime));
    };

    //next bai hat

    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActive();
    };

    // prev bai hat

    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActive();
    };

    // xu li tu dong chay het bai thi chuyen bai khac

    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.onclick();
      }
    };

    //toggle nut random bai hat

    randomBtn.onclick = function () {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    //repeat bai hat
    repeatBtn.onclick = function () {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");
      if (songNode || e.target.closest(".option")) {
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }
      }
    };
  },

  scrollToActive: function () {
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }, 300);
  },

  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },

  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    console.log(this.songs.length);
    this.loadCurrentSong();
  },

  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex);
    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },

  playRepeatSong: function () {
    let currentIndex;
    audio.play();
  },

  //Khi tien do bai hat thay doi

  start: function () {
    this.loadConfig();
    //Định nghĩa các thuộc tính
    this.defineProperties();

    this.loadCurrentSong();

    //Lắng nghe và xử lý các sự kiện (Dom Events)
    this.handleEvent();

    //Render các bài hát
    this.render();

    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  },
};
app.start();
