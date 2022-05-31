// ----------------------------------------------------------------------------
// Socket Event Handlers
// ----------------------------------------------------------------------------
socket.on('Reset', () => {
  btn2.checked = true;
})

// ----------------------------------------------------------------------------
// User Interface Event Handlers
// ----------------------------------------------------------------------------

const btn1 = document.getElementById('npbutton');//意見ありませんボタン
const btn2 = document.getElementById('pbutton');//復活ボタン
const progress = document.getElementById('timerProgress');
const memoArea = document.getElementById('memo');

const params = new URL(window.location.href).searchParams;
const memo = params.get('memo') == 'true';
const timeout = params.get('timeout') == 'true';

if(!memo) memoArea.style.display = 'none';
if(!timeout) progress.style.display = 'none';

let timer;

btn1.addEventListener("click", e => {
    socket.emit('NoOpinions', { timeout });
    if(timeout) timer = setInterval(updateProgress, 300);
});//意見ありませんボタンが押されたらNoOpinionsを実行する
  
btn2.addEventListener("click", e => {
    socket.emit('ShowName');
    stopTimer();
});//復活ボタンが押されたらShowNameを実行する

function stopTimer(){
    if(timer){
        clearInterval(timer);
        timer = null;
        progress.value = 100;  
        btn2.checked = true;
    }
}

function updateProgress() {
  if (progress.value > 0) {
    progress.value--;
  } else if (progress.value == 0) {
    stopTimer();
  }
}

// ----------------------------------------------------------------------------
// Start up
// ----------------------------------------------------------------------------

const truename = prompt('実名を入力してください') || 'unknown';
socket.emit('truename', truename);
const nickname = prompt('ニックネームを入力してください') || 'unknown';
socket.emit('nickname', nickname);
alert('こんにちは' + nickname + 'さん!');