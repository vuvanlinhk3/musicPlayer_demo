const $ =document.querySelector.bind(document);
const $$ =document.querySelectorAll.bind(document);
const PLAYER_STORAGE_KEY = 'F8_PLAYER'
const songTitle = $('#name-playlist');
const cdImg = $('.cd .cd_img') 
const audio = $('#audio')
const cd = $('.cd');
const iconRepeat = $('.icon-repeat')
const nowPlaying = $('#nowplaying')
const backBtn = $('.icon-back')
var playListElement = $('.play-list');
var clickPlay = $('.fa-circle-play');
var clickPause = $('.fa-circle-pause');
var iconPlay = $('.icon-play');
var progress =$('#progress');
var nextBtn = $('.icon-next');
var iconRandom = $('.icon-random')
const playListMusic = {
    isRandom:false,
    isPlaying:false,
    currentIndex:0,
    isRepeat:false,
    config:  JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    songs: [
        {
                name: 'Bạn Lòng',
                singer: 'Hồ Quang Hiếu',
                path:'./list_Music/Ban-Long-Ho-Phu-Nuoi-Ho-Tu-OST-Ho-Quang-Hieu.mp3',
                img:'./list_ImgMusic/th.jpg'
            },
            {
                name: 'Thế Giới Ảo Tình Yêu Thật',
                singer: 'Trình Định Quang',
                path:'./list_Music/Thế Giới Ảo Tình Yêu Thật.mp3',
                img:'./list_ImgMusic/thegioiaotinhyeuthat.jpg'
            },
            {
                name: 'Thói Quen Của Anh',
                singer: 'Cao Tùng Anh',
                path:'./list_Music/Thói Quen Của Anh.mp3',
                img:'./list_ImgMusic/thoiquencuaanh.jpg'
            },
            {
                name: 'Thuong-Em-Thuong-Lam',
                singer: 'Chi Dân',
                path:'./list_Music/Thuong-Em-Thuong-Lam-Chi-Dan-Bao-Kun.mp3',
                img:'./list_ImgMusic/Loi-bai-hat-Thuong-Em-Thuong-Lam-Chi-Dan.jpg'
            },
            {
                name: 'Tìm Em',
                singer: 'Hồ Quang Hiếu',
                path:'./list_Music/Tìm Em-Hồ Quang Hiếu.mp3',
                img:'./list_ImgMusic/timem.jpg'
            },
            {
                name: 'Only U Remix',
                singer: 'Hoàng Tôn',
                path:'./list_Music/Only U Remix.mp3',
                img:'./list_ImgMusic/onlyyou.jpg'
            },
            {
                name: 'ハレハレヤ',
                singer: '',
                path:'./list_Music/ハレハレヤ- HareHare Ya ver.Sou (Lyrics).mp3',
                img:'./list_ImgMusic/harehareya.jpg'
            },
            {
                name: 'Yêu Nhau Đi Em Ơi',
                singer: 'Châu Khải Phong',
                path:'./list_Music/Yêu Nhau Đi Em Ơi.mp3',
                img:'./list_ImgMusic/yeunhaudiemoi.jpg'
            },
    ],
    setConfig: function(key , value){
        playListMusic.config[key]=value;
        localStorage.setItem(PLAYER_STORAGE_KEY,JSON.stringify(playListMusic.config))
    },
    defineProperties:function(){
        // nhớ tra hàm defineproperty
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }
        })
    },
    render:function(){
        var htmls = this.songs.map((song,index)=>
            `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index = "${index}">
            <div class="imgsong"
            style="background-image: url('${song.img}');">
            </div>
            <div class="bodysong">
            <h3 class="name-music">${song.name}</h3>
            <p class="author">${song.singer}</p>
            </div>
            <div class="option">
                <i class="fa-solid fa-ellipsis"></i>
            </div>
        </div>
            `
            )
            playListElement.innerHTML = htmls.join('');
    },
    headleEven:function(){
        const cdWidth = cd.offsetWidth;
        document.onscroll = function(){
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newCdWidth =cdWidth - scrollTop ;
        cd.style.width = newCdWidth >0 ? newCdWidth +'px' :0;
        cd.style.opacity = newCdWidth / cdWidth;
        }
        var cdImgAnimate = cdImg.animate([
            {
                transform:'rotate(360deg)'
            }
        ],
            {
                duration:10000, //10s
                iterations:Infinity
            }
        )
        
        cdImgAnimate.pause();
            iconPlay.onclick = function() {
        // play song
                if(playListMusic.isPlaying){
                    audio.pause();
                    nowPlaying.textContent = 'Not Playing'
                }
                else{ 
                    audio.play();
                    nowPlaying.textContent = 'Now Playing ...'
        
                }
            audio.onplay = function(){
                playListMusic.isPlaying = true;
                iconPlay.classList.add('active');
                clickPause.classList.add('active')
                cdImgAnimate.play();
            }
            audio.onpause = function(){
                playListMusic.isPlaying = false;
                iconPlay.classList.remove('active');
                clickPause.classList.remove('active')
                cdImgAnimate.pause();
            }
        // khi tiến độ bài hát thay đổi
            audio.ontimeupdate =function(){
                if(audio.duration){
                    const progressPercent = Math.floor(audio.currentTime / audio.duration *100)
                    progress.value = progressPercent;
                }
            }
            // xử lý tua song
            progress.onchange =function(e){
                const seek =audio.duration /100 * e.target.value;
                audio.currentTime =seek
            }
        };
        // next song
        nextBtn.onclick =function(){
            if(playListMusic.isRandom){
                playListMusic.playRandomSong() 
            }
            else{
                playListMusic.nextSong()  
            }
            audio.play();
            playListMusic.render();
            playListMusic.scrollToActiveSong();
        }
         // back song
        backBtn.onclick = function(){
            if(playListMusic.isRandom){
                playListMusic.playRandomSong() 
            }
            else{
                playListMusic.backSong()  
            }
            audio.play();
            playListMusic.render();
            playListMusic.scrollToActiveSong();
        }
       
        //random
        iconRandom.onclick =function(){
            playListMusic.isRandom = !playListMusic.isRandom;
            playListMusic.setConfig('isRandom',playListMusic.isRandom)
            iconRandom.classList.toggle('open',playListMusic.isRandom)
        }
        // khi bật nút reppeat
        iconRepeat.onclick =function(){
            playListMusic.isRepeat = !playListMusic.isRepeat;
            playListMusic.setConfig('isRepeat',playListMusic.isRepeat)
            iconRepeat.classList.toggle('open',playListMusic.isRepeat);
        }
        // next khi ended song
        audio.onended =function(){
            if(playListMusic.isRepeat){
                audio.play();
            }
            else{
               nextBtn.click(); 
            }
            
        }
        // click nút mở bài 
        playListElement.onclick =function(e){
            const songNode = e.target.closest('.song:not(.active)')
            playListMusic.evenClickPlay();
            if(songNode || e.target.closest('.option')){
                if(songNode){
                    playListMusic.currentIndex = Number(songNode.dataset.index)
                    playListMusic.loadCurrenSong();

                    playListMusic.render();
                    audio.play();
                    
                }
            }
            if(e.target.closest('.option')){
            }
        }

    },
    scrollToActiveSong:function(){
        setTimeout (()=>{
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block:'center'
            })
        },200)
    },
    loadCurrenSong:function(){
    songTitle.textContent = this.currentSong.name;
    cdImg.style.backgroundImage =`url('${this.currentSong.img}')`;
    audio.src = this.currentSong.path;
    },
    nextSong:function(){
        
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex =0
        }
        this.loadCurrenSong();
    },
    backSong:function(){
        
        this.currentIndex--;
        if(this.currentIndex < 0 ){
            this.currentIndex = this.songs.length -1;
        }
        this.loadCurrenSong();
    },
    playRandomSong:function(){
        let newIndex 
        do{
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrenSong()
    },
    start:function(){
        this.defineProperties();
        this.headleEven();
        this.loadCurrenSong();
        this.render();
    }
}
playListMusic.start();