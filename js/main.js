/**@type {HTMLCanvasElement}*/
var cvs = document.getElementById('cvs');
cvs.width = 700;
cvs.height = 800;
var ctx = cvs.getContext('2d');
var img1 = new Image();
img1.src = './img/bc.png';
// var img2 = new Image();
// img2.src = './img/tree01.png';
var img = {
    "tree1": "./img/tree01.png",
    "tree2": "./img/tree02.png",
    "player": "./img/hero.png",
    "sword": "./img/sword.png",
    "grass": "./img/grass.png",
    "star": "./img/starfood.png",
}
var game = null;
var arr = [];
var body = document.getElementsByTagName('body')[0];
var over = document.createElement('div');
var againButton = document.createElement('button');
window.onload = function () {
    var div = document.createElement('div');
    body.appendChild(div);
    body.appendChild(againButton);
    againButton.innerHTML = '再次挑战';
    againButton.className = 'againChangeButton';
    div.setAttribute('class', 'divs');
    for (var i = 0; i < 3; i++) {
        div.appendChild(document.createElement('div'));
    }
    var tips = document.createElement('div');
    var story = document.createElement('div');
    var back = document.createElement('button');
    tips.innerHTML = "<div>1.本游戏为跑酷类游戏，有助于玩家注意力与反应力的提升，适度的游戏有助于身心健康。<br>2.玩家角色总共有三个星星，当角色不小心被障碍物所伤，即刻扣除一个星星，若数量为零时，意味被魔物抓了(具体了解故事背景)，本次游戏之旅Over。<br>3.游戏中，玩家可以使用<strong>空格</strong>使角色执行跳高翻越障碍物，但要找准时机，当角色死亡时，你可以使用‘w’复活，前提是你有多余的星星。<br><br>Tips:玩家在每次障碍物来临前，做好翻越的准备，如果太晚则会撞到障碍物，如果太早你可能刚好与障碍物相撞，但你可以更合理的利用‘q’，取消跳高动作，总之，当你试玩几次后你会很容易翻越障碍，祝你旅途愉快 </div>"
    story.innerHTML = "<div>很久以前，陆地上生存着一群热爱和平的忍者种族，世界安宁祥和，人们渴望永恒的发展，但有一天，一群外星生物入侵了这里，他们的目的是为了拿到能够支撑这片土地繁衍的“地核”，用来改变星辰轨迹，以此让世界感到恐惧。但人们也不会坐以待毙，终究因实力悬殊，这群号称‘虚空生物’的家伙沾染了这片土地，族长集结全族之力抵御他们，临终前将‘地核’托付给一个叫“绯月”的年轻人，绯月带着全族希望开始了亡命生涯，每时每刻迎来的都是死亡的威胁，他不知道什么才是尽头，但唯有做的只能是不停的奔跑。</div>"
    back.innerHTML = 'back';
    var btn = 0;
    for (var i = 0; i < div.children.length; i++) {
        div.children[i].className = 'div' + btn;
        btn++;
    }
    div.children[0].innerHTML = '开始游戏';
    div.children[1].innerHTML = '玩法技巧';
    div.children[2].innerHTML = '剧情故事';
    var lefts = div.offsetLeft;
    console.log(lefts);

    div.children[0].onclick = function () {

        if (this.innerHTML == '开始游戏') {
            div.className = 'divs1';
            div.style.left = lefts + 'px';
            setTimeout(() => {
                var startTime = Date.now();
                ctx.drawImage(img1, 0, 0, img1.width, img1.height);
                game = new Game(startTime);
                game.update();
                cvs.style.display = 'block';
                this.innerHTML = 'L';
                div.children[1].innerHTML = 'M';
                div.children[2].innerHTML = 'H';
            }, 1000);
        }

    }
    div.children[1].onclick = function () {
        if (this.innerHTML == '玩法技巧') {
            for (var i = div.children.length; i > 0; i--) {
                div.children[i - 1].style.display = 'none';
            }
            setTimeout(() => {
                div.className = 'divs2';
                div.appendChild(back);
                div.appendChild(tips);
            }, 100);
            back.onclick = () => {
                div.removeChild(back);
                div.removeChild(tips);
                div.className = 'divs';
                for (var i = div.children.length; i > 0; i--) {
                    div.children[i - 1].style.display = 'block';
                }
            }
        }
    }
    div.children[2].onclick = function () {
        if (this.innerHTML == '剧情故事') {
            for (var i = div.children.length; i > 0; i--) {
                div.children[i - 1].style.display = 'none';
            }
            setTimeout(() => {
                div.parentElement.style.backgroundImage = 'url(./img/123.jpg)';
                div.className = 'divs3';
                div.appendChild(back);
                div.appendChild(story);
            }, 100);
            back.onclick = () => {
                div.removeChild(back);
                div.removeChild(story);
                div.className = 'divs';
                div.parentElement.style.backgroundImage = 'url(./img/QQ.jpg)';
                for (var i = div.children.length; i > 0; i--) {
                    div.children[i - 1].style.display = 'block';
                }
            }
        }
    }
}
function Game(startTime) {
    var _this = this;
    this.index = 115;
    this.jump = false;
    this.currentFrame = 0;
    this.frame = 0;
    this.lastFrame = 0;
    this.frame1 = 0;
    this.lastFrame1 = 0;
    this.cd = 5;
    this.die = false;
    this.live = 3;
    this.i = 20;
    this.starArr = [];
    this.startTime = startTime;
    this.nowTime = 0;
    this.sumTime = 0;
    this.time1 = 0;
    this.time2 = 0;
    this.swordSpeed = 4;
    for (var i in img) {
        var src1 = img[i];
        i = new Image();
        i.src = '' + src1;
        arr.push(i);
    }
    this.tree = new Tree(arr[0], 0, 400, 2);
    this.tree1 = new Tree(arr[0], 700, 400, 2);
    this.treeback = new Tree(arr[1], 0, 407, .5);
    this.treeback1 = new Tree(arr[1], 700, 407, .5);
    this.grass = new Grass(arr[4], 0, 500, 7);
    this.grass2 = new Grass(arr[4], 350, 500, 7);
    this.grass3 = new Grass(arr[4], 700, 500, 7);
    this.player = new Player();
    for (var i = 0; i < 3; i++) {
        _this.starArr.push(new Star(i))
    }
    this.swordArr = [];
    this.divs1 = document.getElementsByClassName('divs1')[0];

    this.update = function () {
        ctx.clearRect(0, 0, cvs.width, cvs.height);
        ++_this.frame;
        ++_this.frame1;

        Array.from(_this.divs1.children).forEach((val, index) => {
            val.onclick = function () {
                _this.swordSpeed = 4;
                _this.swordSpeed = _this.swordSpeed + index * 4;
            }
        })




        document.onkeydown = function (e) {
            if (e.keyCode == 32 && _this.die == false) {
                _this.jump = true;

            }
            if (e.keyCode == 81 && _this.die == false) {
                _this.jump = false;

            }
            if (e.keyCode == 87 && _this.starArr.length > 0) {
                _this.startTime = Date.now();
                _this.die = false;

            }

        }
        if (_this.jump == true) {
            _this.player.jumpLength(true);
            _this.index = 0;
        }
        if (_this.jump == false) {

            _this.index = 115;
            _this.player.jumpLength(false);
        }
        if (_this.player.y > 540) {
            _this.index = 115;
            _this.jump = false;
            _this.player.y = 540;
            _this.player.t = 0;
        }
        ctx.drawImage(img1, 0, 0, img1.width, img1.height);
        _this.treeback.draw();
        _this.treeback.move();
        _this.treeback1.draw();
        _this.treeback1.move();
        _this.tree.draw();
        _this.tree.move();
        _this.tree1.draw();
        _this.tree1.move();

        if (_this.frame - _this.lastFrame >= _this.cd) {

            _this.currentFrame = _this.currentFrame++ >= 6 ? 0 : _this.currentFrame;
            _this.lastFrame = _this.frame;
        }
        if (_this.frame1 - _this.lastFrame1 >= 100) {
            _this.swordArr.push(new Sword(_this.swordSpeed))

            _this.lastFrame1 = _this.frame1;
        }

        if (_this.swordArr.length >= 1) {
            _this.swordArr.forEach(function (val, index) {

                if (val.x - 100 <= 56 && val.y - _this.player.y <= 66 && val.x > 100 && _this.die == false) {
                    //console.log("dead");
                    _this.die = true;
                    _this.time1 = Date.now();
                    _this.sumTime = _this.time1 - _this.startTime + _this.sumTime;
                    _this.startTime = _this.time1;
                    _this.nowTime = _this.time1;
                    if (_this.starArr.length < 1) {
                    }
                    else {
                        _this.starArr.length--;
                    }
                    _this.index = 345;

                }
                val.isCollision();
                if (val.dead) {
                    _this.swordArr.splice(index, 1);
                }
                val.draw();
                val.move();
            })
        }
        if (_this.player.y == 540 && _this.die == true) {
            _this.player.draw(6, 345);

        }
        else {
            if (_this.die == true) {
                // _this.player.y = 540;
                setTimeout(() => {
                    _this.player.draw(_this.currentFrame, 345);


                })
                _this.player.draw(6, 345);


            }
            else { _this.player.draw(_this.currentFrame, _this.index); }

        }
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 590, 800, 500);


        _this.grass.draw();
        _this.grass.move();
        _this.grass2.draw();
        _this.grass2.move();
        _this.grass3.draw();
        _this.grass3.move();
        _this.starArr.forEach((val, index) => {
            val.draw(_this.i + 40 * index);
        })
        if (_this.die == false) {
            _this.nowTime = Date.now();
        }
        ctx.beginPath();
        ctx.fillStyle = 'white';
        ctx.fillText('Time:' + (Number(_this.nowTime - _this.startTime + _this.sumTime) / 1000).toFixed(1), 600, 50);
        ctx.font = '20px myFont';
        if (_this.starArr.length == 0) {
            setTimeout(() => {
                // alert('loss');
                img1.src = './img/bc1.png';
                _this.divs1.style.display = 'none';
                body.appendChild(over);
                over.className = 'over';
                over.innerHTML = '<h2>你所坚持的时长：</h2><p>'+(Number(_this.nowTime - _this.startTime + _this.sumTime) / 1000).toFixed(1)+'s</p>';
                againButton.style.display = 'block'
                // console.log((Number(_this.nowTime - _this.startTime + _this.sumTime) / 1000).toFixed(1));
            }, 200);
            
           console.log(over.children[2]);
            _this.tree.speed = 0;
            _this.tree1.speed = 0;
            _this.treeback.speed = 0;
            _this.treeback1.speed = 0;
            //    _this.sword.speed = 0;
            //    _this.swordArr = 0;
            //    _this.grass.speed = 0;
            //    _this.grass2.speed = 0;
            //    _this.grass3.speed = 0;
        }
       
            againButton.onclick = () =>{
                window.history.go(0);
            }
        
       
        window.requestAnimationFrame(_this.update);
    }
    function Grass(img, x, y, speed) {
        var _this = this;
        this.img = img;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.draw = function () {
            //ctx.drawImage(arr[1], 0, 0, 1400, 400, _this.x, _this.y, 700, 200);
            ctx.drawImage(_this.img, 0, 0, 240, 40, _this.x, 555, 350, 50);
        }
        this.move = function () {
            if (_this.x <= -340) {
                _this.x = 700;
            }
            else {
                _this.x -= _this.speed;

            }

        }
    }
    function Tree(img, x, y, speed) {
        var _this = this;
        this.img = img;
        this.speed = speed;
        this.x = x;
        this.y = y;
        this.draw = function () {
            //ctx.drawImage(arr[1], 0, 0, 1400, 400, _this.x, _this.y, 700, 200);
            ctx.drawImage(_this.img, 0, 0, 1400, 400, _this.x, _this.y, 700, 200);
        }
        this.move = function () {
            if (_this.x <= x - 700) {
                _this.x = x;
            }
            else {
                _this.x -= _this.speed;

            }

        }
    }


    function Player() {
        var _this = this;
        this.index = 0;
        this.y = 540;
        this.speed = 60;
        this.g = -10;
        this.t = 0;
        this.isJump = false;
        this.speed1 = 60
        this.draw = function (x, index) {
            _this.index = index;
            ctx.drawImage(arr[2], arr[2].width / 7 * x, _this.index, 90, 110, 100, _this.y, 56, 66);
        }
        this.jumpLength = function (isjump) {
            _this.isJump = isjump;
            if (_this.isJump) {
                _this.t += .1;
                _this.speed1 = 60 - 10 * _this.t;
                if (_this.speed1 <= 0) {
                    _this.g = -13;
                }
                _this.y = 540 - (_this.speed * _this.t + _this.g * _this.t * _this.t * .5);

            }
            else {
                //console.log('assa');
                _this.y = 540;
                _this.t = 0;
            }

        }
    }

    function Sword(swordSpeed) {
        var _this = this;
        this.speed = swordSpeed;
        this.x = cvs.width / 8 * 7;
        this.y = Math.floor(Math.random() * (41) + 480);
        this.dead = false;
        this.draw = function () {

            ctx.drawImage(arr[3], 0, 0, arr[3].width, arr[3].height, _this.x, _this.y, arr[3].width / 6, arr[3].height / 6);

        }
        this.move = function () {
            _this.x -= _this.speed;
        }
        this.isCollision = function () {
            if (_this.x < -arr[3].width / 6) {
                _this.dead = true;
            }
        }
    }

    function Star() {
        var _this = this;
        this.draw = function (x) {
            ctx.drawImage(arr[5], 0, 0, 80, 78, x, 20, 40, 39);
        }
    }
}