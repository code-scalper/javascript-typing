

// 사용 변수
const SETTING_TIME = 10;
let words = [];
let time;
let isPlaying = false;
let score = 0;


const url = "https://random-word-api.herokuapp.com/word?number=100";
const timeDisplay = document.querySelector('.time')
const button = document.querySelector('.button')
const wordDisplay = document.querySelector('.word-display')
const wordInput = document.querySelector('.word-input')
const scoreDisplay = document.querySelector('.score')


init();
function init() {
    getWords();
    wordInput.addEventListener('input', checkMatch)
}


function checkStatus() {
    if (!isPlaying && time === 0) {
        isPlaying = false;
        buttonChange('start', '게임시작');
        clearInterval(checkInterval)
    }
}

function checkMatch() {
    if (wordInput.value.toLowerCase() === wordDisplay.innerText.toLowerCase()) {
        wordInput.value = "";
        if (!isPlaying) {
            runNotification('error')
            return
        }
        score++;
        scoreDisplay.innerText = score;
        time = SETTING_TIME;
        const randomIndex = Math.floor(Math.random() * words.length)
        wordDisplay.innerText = words[randomIndex];
        runNotification('success')
    }
}




function run() {
    if (words.length < 1) {
        return;
    }
    wordInput.value = "";
    wordInput.focus()
    score = 0;
    scoreDisplay.innerText = 0;
    time = SETTING_TIME;
    isPlaying = true;
    timeInterval = setInterval(countDown, 1000)
    checkInterval = setInterval(checkStatus, 50)
    buttonChange('loading', '게임중')
}

function countDown() {
    time > 0 ? time-- : isPlaying = false;
    timeDisplay.innerText = time;
    if (!isPlaying) {
        clearInterval(timeInterval)
    }
    console.log('count')
}

// 단어 가져오기
function getWords() {
    axios.get(url).then((res) => {

        res.data.forEach((word) => {
            if (word.length < 7) {
                words.push(word);
            }
            buttonChange('start', '게임시작')
        })
    }).catch((err) => {
        console.log(err);
    })
}

function buttonChange(type, text) {
    button.innerText = text;
    type === 'loading' ? button.classList.add('loading') : button.classList.remove('loading')
}



function runNotification(type) {
    // toastify options
    const option = {
        text: `${wordDisplay.innerText}!!`,
        duration: 3000,
        newWindow: true,
        gravity: "top", // `top` or `bottom`
        position: 'left', // `left`, `center` or `right`
        backgroundColor: "linear-gradient(to right, #00b09b, #96c93d)"
    }
    if (type === 'error') {
        option.text = '우선 게임시작 버튼을 눌러주세요'
        option.position = 'right'
        option.backgroundColor = 'red'
    }

    Toastify(option).showToast();
}

