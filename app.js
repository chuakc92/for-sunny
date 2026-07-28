/* ==========================================
   FOR SUNNY ☀️ — Main App Logic
   ========================================== */

// ==========================================
// COUNTDOWN LOCK — Unlocks Aug 23, 2025
// ==========================================

const UNLOCK_TIMESTAMP = 1787410800000; // Aug 23, 2026 00:00:00 KST (= Aug 22 15:00:00 UTC)

// Server time offset to prevent phone clock cheating
let serverTimeOffset = 0;

async function fetchServerTime() {
    try {
        // Use WorldTimeAPI to get actual UTC time
        const response = await fetch('https://worldtimeapi.org/api/timezone/Asia/Seoul');
        if (response.ok) {
            const data = await response.json();
            const serverNow = new Date(data.datetime).getTime();
            const localNow = Date.now();
            serverTimeOffset = serverNow - localNow;
        }
    } catch (e) {
        // If offline, fall back to device time (acceptable — she'll be on a plane)
        serverTimeOffset = 0;
    }
}

function getTrueNow() {
    return Date.now() + serverTimeOffset;
}

const lockedMessages = [
    "Patience, 자기야 😤 You're not allowed in yet!",
    "Nice try, lady! Come back on August 23rd 🥹",
    "I said NO 😤😤😤 ...but I miss you too",
    "Still locked! Go practice violin or something 🎻",
    "The kids' version of patience isn't available either 🔥",
    "Hey!! Did I say you could open this?! 😤",
    "You're as impatient as me at 3am... go to sleep!!",
    "Hands OFF the lock 🔒 (get it? like my pockets? 🥹)",
    "Not yet!! But I promise it's worth the wait ☺️",
    "🙄 Fine. Here's a sneak peek: ████████. Happy?",
    "Come back and tap me when you've leveled up enough to handle this content 😏",
    "I'm not opening until you're on that plane ✈️",
    "You're gonna wear me out before August 23rd 😤",
    "If you tap me one more time I'm adding MORE days 😤😤",
    "Okay that one was cute but still NO 🥹",
    "The countdown is real, the lock is real, my love is real ☺️",
    "Go eat some buldak and come back later 🔥",
    "Is this how you treat all your locks?! I feel used 😭",
    "나중에!! (that means LATER) 😤",
    "I can hear you tapping from Texas 🙄"
];

let lockedTapCount = 0;

function initCountdown() {
    // HARD LOCK — always show locked page during development
    // Change DEV_LOCK to false when ready to use the real timer
    const DEV_LOCK = true;

    // Show locked page immediately — no waiting
    document.getElementById('locked-page').classList.remove('hidden');
    document.getElementById('landing').classList.add('hidden');
    updateCountdownTimer();
    setInterval(updateCountdownTimer, 1000);

    if (DEV_LOCK) return;

    // When not dev-locked, fetch server time and unlock if past date
    fetchServerTime().then(() => {
        const now = getTrueNow();
        if (now >= UNLOCK_TIMESTAMP) {
            document.getElementById('locked-page').classList.add('hidden');
            document.getElementById('landing').classList.remove('hidden');
        }
    });
}

function updateCountdownTimer() {
    const now = getTrueNow();
    const diff = UNLOCK_TIMESTAMP - now;

    if (diff <= 0) {
        document.getElementById('countdown-timer').textContent = '0d 0h 0m 0s';
        return;
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const timerEl = document.getElementById('countdown-timer');
    if (days > 0) {
        timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    } else {
        timerEl.textContent = `${hours}h ${minutes}m ${seconds}s`;
    }
}

function tapLocked() {
    const msgEl = document.getElementById('locked-message');
    const msg = lockedMessages[lockedTapCount % lockedMessages.length];
    lockedTapCount++;

    // Start music on first tap (iOS requires audio in user gesture handler)
    if (!musicPlaying) {
        startMusic();
    }

    // Reset animation
    msgEl.style.animation = 'none';
    void msgEl.offsetWidth;
    msgEl.style.animation = 'fadeInUp 0.3s ease-out';
    msgEl.textContent = msg;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initCountdown);

// ==========================================
// STICKER TAP ANIMATIONS
// ==========================================

function tapSticker(el, type) {
    // Remove any existing animation class
    el.classList.remove('sticker-anim-grow', 'sticker-anim-backflip', 'sticker-anim-angry');
    // Force reflow so animation restarts if tapped again
    void el.offsetWidth;
    el.classList.add('sticker-anim-' + type);

    // Remove class after animation ends so it can replay
    el.addEventListener('animationend', function handler() {
        el.classList.remove('sticker-anim-' + type);
        el.removeEventListener('animationend', handler);
    });
}

// ==========================================
// BACKGROUND MUSIC — 想见你
// ==========================================

let musicPlaying = false;

function startMusic() {
    if (musicPlaying) return;
    const audio = document.getElementById('bg-music');
    audio.volume = 0.4;
    audio.play();
    musicPlaying = true;
    document.querySelectorAll('.music-btn').forEach(btn => {
        btn.classList.add('playing');
        btn.textContent = '🎶';
    });
}

function toggleMusic() {
    const audio = document.getElementById('bg-music');
    if (musicPlaying) {
        audio.pause();
        musicPlaying = false;
        document.querySelectorAll('.music-btn').forEach(btn => {
            btn.classList.remove('playing');
            btn.textContent = '🎵';
        });
    } else {
        startMusic();
    }
}

// ==========================================
// ENVELOPE DATA
// ==========================================

const envelopes = [
    {
        id: 'airport',
        emoji: '✈️',
        title: "You're at the Airport",
        subtitle: 'For when it finally begins',
        question: "What did I tell you to drink for me during our first week talking?",
        hint: "June 12... I asked you to get one for me 🥹",
        answers: ['boba', 'boba tea', 'bubble tea'],
        content: 'getAirportContent'
    },
    {
        id: 'miss-me',
        emoji: '🥹',
        title: "You Miss Me",
        subtitle: "I miss you too, 자기야",
        question: "What's my signature photo pose that you caught me doing in every picture?",
        hint: "You noticed it and never let me live it down 😤",
        answers: ['hands in pockets', 'pockets', 'hand in pocket', 'hands in pocket', 'hands in his pockets'],
        content: 'getMissMeContent'
    },
    {
        id: 'bored',
        emoji: '🎮',
        title: "You're Bored",
        subtitle: 'How well do you know KC?',
        question: "What board game did I win 7 out of 8 times?",
        hint: "We played it at my friend's game night 🙂",
        answers: ['codenames', 'code names', 'codename'],
        content: 'getQuizContent'
    },
    {
        id: 'hungry',
        emoji: '🍜',
        title: "You're Hungry",
        subtitle: 'Our food bucket list',
        question: "What did I say I'd always have stocked in my fridge for you?",
        hint: "You were at a cafe and I made a mental note 😌",
        answers: ['desserts', 'dessert', 'chocolate', 'sweets'],
        content: 'getHungryContent'
    },
    {
        id: 'nervous',
        emoji: '🥺',
        title: "You're Nervous About Meeting Me",
        subtitle: "Read this. I promise it helps.",
        question: "What did I promise we'd do even if we're too scared for the big rollercoasters?",
        hint: "Something... spinny... and childish 🤭",
        answers: ['kids rides', 'teacups', 'spinning cups', 'spinning cup rides', 'kid rides', 'tea cups', 'kids ride'],
        content: 'getNervousContent'
    },
    {
        id: 'cant-sleep',
        emoji: '🌙',
        title: "You Can't Sleep",
        subtitle: 'Our best moments, timestamped',
        question: "What time was it for me during our first real-time conversation?",
        hint: "I refused to sleep... you kept telling me to go to bed 😤",
        answers: ['3am', '4am', '3 am', '4 am', '3', '4'],
        content: 'getMemoriesContent'
    },
    {
        id: 'voice',
        emoji: '🎧',
        title: "You Want to Hear My Voice",
        subtitle: 'Press play, close your eyes',
        question: "What Chinese phrase did you guess correctly from my voice message?",
        hint: "You figured it out from a song... 想见你",
        answers: ['wo hao xiang ni', 'i miss you', '我好想你', 'wo xiang ni', 'xiang ni'],
        content: 'getVoiceContent'
    },
    {
        id: 'photos',
        emoji: '📸',
        title: "You Want to Look at Us",
        subtitle: 'A collage of our journey',
        question: "What place did we BOTH visit in Japan, exactly one year apart?",
        hint: "You said it was your favorite place that day 😊",
        answers: ['blue pond', 'farm tomita', 'sapporo', 'hokkaido', 'lavender field'],
        content: 'getPhotosContent'
    },
    {
        id: 'future',
        emoji: '🌸',
        title: "You Want to See Our Future",
        subtitle: 'Everything waiting for us',
        question: "What color am I buying everything in for you?",
        hint: "Your iPhone, your tumbler, your whole life... 💗",
        answers: ['pink'],
        content: 'getFutureContent'
    },
    {
        id: 'landing-tx',
        emoji: '🤠',
        title: "You Land in Texas",
        subtitle: 'Almost the last one... ✨',
        question: "What am I to you? (hint: it rhymes with 'honorary Korean'...)",
        hint: "Just kidding. What did our paths keep doing? 🥹",
        answers: ['crossing', 'crossed', 'cross'],
        isFinal: false,
        content: 'getLandingContent'
    },
    {
        id: 'with-me',
        emoji: '💗',
        title: "You're With Me",
        subtitle: 'Hand me your phone. 🤭',
        question: "Say it to my face. What do you call me? ☺️",
        hint: "이제 시작이야...",
        answers: ['자기야', 'jagiya', 'jagi', '자기'],
        isFinal: true,
        isSecret: true,
        content: 'getWithMeContent'
    }
];

// ==========================================
// STATE
// ==========================================

let currentEnvelopeId = null;
let openedEnvelopes = JSON.parse(localStorage.getItem('openedEnvelopes') || '[]');
let quizScore = 0;
let quizAnswered = 0;

// ==========================================
// APP INITIALIZATION
// ==========================================

function enterApp() {
    // Start music on first interaction if not already playing
    if (!musicPlaying) {
        toggleMusic();
    }
    document.getElementById('landing').classList.add('hidden');
    document.getElementById('envelopes').classList.remove('hidden');
    renderEnvelopes();
}

function renderEnvelopes() {
    const grid = document.querySelector('.envelope-grid');
    grid.innerHTML = '';

    envelopes.forEach(env => {
        // Hide final/secret envelope until all others opened
        if (env.isFinal) {
            const allOthersOpened = envelopes
                .filter(e => !e.isFinal)
                .every(e => openedEnvelopes.includes(e.id));
            if (!allOthersOpened && !openedEnvelopes.includes(env.id)) {
                return;
            }
        }

        const card = document.createElement('div');
        card.className = 'envelope-card';
        if (openedEnvelopes.includes(env.id)) card.classList.add('opened');
        if (env.isFinal) {
            card.classList.add('final-envelope');
            if (!openedEnvelopes.includes(env.id)) {
                card.classList.add('glow');
            }
        }

        const isOpened = openedEnvelopes.includes(env.id);
        card.innerHTML = `
            <span class="envelope-emoji">${env.emoji}</span>
            <div class="envelope-info">
                <div class="envelope-title">Open When ${env.title}</div>
                <div class="envelope-subtitle">${env.subtitle}</div>
            </div>
            <span class="envelope-lock">${isOpened ? '💗' : '🔒'}</span>
        `;

        card.addEventListener('click', () => openEnvelope(env.id));
        grid.appendChild(card);
    });

    updateProgress();
}

function updateProgress() {
    document.getElementById('opened-count').textContent = openedEnvelopes.length;
}

// ==========================================
// ENVELOPE OPEN / PASSWORD LOGIC
// ==========================================

function openEnvelope(id) {
    const env = envelopes.find(e => e.id === id);
    if (!env) return;

    if (openedEnvelopes.includes(id)) {
        // Already opened, show content directly
        showEnvelopeContent(env);
        return;
    }

    // Show password prompt
    currentEnvelopeId = id;
    document.getElementById('password-question').textContent = env.question;
    document.getElementById('password-hint').textContent = env.hint || '';
    document.getElementById('password-input').value = '';
    document.getElementById('password-error').classList.add('hidden');
    document.getElementById('password-modal').classList.remove('hidden');

    setTimeout(() => {
        document.getElementById('password-input').focus();
    }, 400);
}

function checkPassword() {
    const env = envelopes.find(e => e.id === currentEnvelopeId);
    if (!env) return;

    const input = document.getElementById('password-input').value.trim().toLowerCase();
    const isCorrect = env.answers.some(a => input.includes(a.toLowerCase()));

    if (isCorrect) {
        // Mark as opened
        if (!openedEnvelopes.includes(currentEnvelopeId)) {
            openedEnvelopes.push(currentEnvelopeId);
            localStorage.setItem('openedEnvelopes', JSON.stringify(openedEnvelopes));
        }
        closePasswordModal();
        showEnvelopeContent(env);
        renderEnvelopes();
    } else {
        const errorEl = document.getElementById('password-error');
        errorEl.classList.remove('hidden');
        errorEl.style.animation = 'none';
        // Force reflow
        void errorEl.offsetWidth;
        errorEl.style.animation = 'shake 0.4s ease-in-out';
    }
}

function closePasswordModal() {
    document.getElementById('password-modal').classList.add('hidden');
    currentEnvelopeId = null;
}

// Handle Enter key on password input
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('password-input').addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkPassword();
        }
    });
});

// ==========================================
// SHOW ENVELOPE CONTENT
// ==========================================

function showEnvelopeContent(env) {
    const modal = document.getElementById('envelope-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = window[env.content]();
    modal.classList.remove('hidden');

    // Fire confetti for the final envelope
    if (env.id === 'landing-tx' && typeof confetti === 'function') {
        setTimeout(() => fireConfetti(), 300);
    }
}

function closeModal() {
    document.getElementById('envelope-modal').classList.add('hidden');
}

// ==========================================
// CONFETTI
// ==========================================

function fireConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(canvas, { resize: true });

    myConfetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ff6b9d', '#ffb6c1', '#ffd700', '#ff8a80', '#fff0f5']
    });

    setTimeout(() => {
        myConfetti({
            particleCount: 50,
            spread: 100,
            origin: { y: 0.4 },
            colors: ['#ff6b9d', '#ffb6c1', '#ffd700']
        });
    }, 500);
}

// ==========================================
// CONTENT GENERATORS
// ==========================================

function getAirportContent() {
    return `
        <h2 class="section-title">You're at the Airport ✈️</h2>
        <div class="message-text">
            <p>Hey you ☺️</p>
            <p>I can't believe this day is finally here. Do you remember our very first conversation?</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Hi! It's me. Sunny! 😊<div class="bubble-time">Jun 11, 5:57 AM</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>안녕하세요!!!! 🙂<div class="bubble-time">Jun 11, 7:04 AM</div></div>
        </div>
        <div class="message-text">
            <p>From that very first message on June 11th, you've made every single day brighter. Through time zones, jet lag, your music theory nightmares, your Japan trip, the World Cup heartbreaks, and all those late nights where we both refused to sleep because we didn't want to stop talking.</p>
            <p>You once said you started having a reason to look forward to coming back to Texas.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>But honestly… I think I've started to have a reason to look forward to going back to Texas. 😂 Maybe that's why staying here for so long suddenly feels a little too long.<div class="bubble-time">Jun 15, 1:37 AM</div></div>
        </div>
        <div class="message-text">
            <p>Well, that reason has been counting down every single day. And today, that countdown finally hits zero.</p>
            <p>I'm so proud of you for finishing your summer, for spending beautiful time with your family, and for being patient with this whole distance thing. You handled it all with that effortless positivity that made me fall for you in the first place.</p>
            <p>Now board that plane, enjoy this little gift I made for you, and know that someone in Texas is smiling like an idiot right now thinking about you.</p>
            <p>See you so, so soon.</p>
        </div>
        <div class="message-signature">— KC ☀️</div>
    `;
}

function getMissMeContent() {
    return `
        <h2 class="section-title">I Miss You Too 🥹</h2>
        <div class="message-text">
            <p>자기야... 🥹</p>
            <p>If you're opening this, it means you miss me. And honestly? I've missed you every single day since June 11th.</p>
            <p>I missed you when I walked past tulips at the grocery store. I missed you at the Korean bar watching your team play. I missed you when I ate buldak (the kids' version, don't judge me). I missed you every time I sent a voice message and wished I could just whisper it to you in person instead.</p>
            <p>But here's what I want you to know: missing someone this much, from this far away, before you've even met them... that tells me everything I need to know about what we have.</p>
            <p>You once said:</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>It feels like we've known each other for much longer than we actually have!<div class="bubble-time">Jun 25</div></div>
        </div>
        <div class="message-text">
            <p>I felt that from day one.</p>
            <p>So when you miss me, just hit play and close your eyes. Pretend I'm right next to you. Because soon enough, I will be. And then you'll never have to miss me from this far away again.</p>
            <p>我好想你 ☺️</p>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/miss-you-chinese.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">我好想你</div>
                <div class="audio-subtitle">The voice message you replayed 10 times</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="message-signature">— Your hands-in-pockets boy 🥹</div>
    `;
}

function getQuizContent() {
    quizScore = 0;
    quizAnswered = 0;
    return `
        <h2 class="section-title">How Well Do You Know KC? 🎮</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1.5rem; font-size:0.9rem;">10 questions. No cheating. Let's see what you've got 😤</p>
        <div class="quiz-container" id="quiz-container">
            ${generateQuizHTML()}
        </div>
        <div class="quiz-score hidden" id="quiz-score-card">
            <div class="quiz-score-number" id="quiz-final-score"></div>
            <div class="quiz-score-text" id="quiz-final-text"></div>
        </div>
    `;
}

function generateQuizHTML() {
    const questions = [
        {
            q: "What's KC's spice tolerance level?",
            options: [
                "He adds EXTRA buldak sauce like a true Korean 🔥",
                "He eats the kids' version and calls it a day ✅",
                "He once cried eating mild salsa",
                "He's secretly immune to all spice"
            ],
            correct: 1
        },
        {
            q: "What does KC do with his hands in every photo?",
            options: [
                "Peace sign like a true tourist ✌️",
                "Shoves them in his pockets because he's awkward",
                "Holds a random suitcase as a prop",
                "Both B and C honestly"
            ],
            correct: 3
        },
        {
            q: "What did KC accidentally send you with NO audio?",
            options: [
                "A cooking tutorial he was proud of",
                "A video of him saying something sweet for the first time",
                "His karaoke audition tape",
                "A gym progress update"
            ],
            correct: 1
        },
        {
            q: "What did KC mistake for a kangaroo?",
            options: [
                "His neighbor's large dog",
                "A raccoon digging through his trash",
                "A cat in the dark",
                "His own shadow at 3am"
            ],
            correct: 1
        },
        {
            q: "What's KC's favorite fruit that he eats with weird powder?",
            options: [
                "Mangoes with chili",
                "Pears with dried prune powder",
                "Apples with cinnamon",
                "Watermelon with salt"
            ],
            correct: 1
        },
        {
            q: "What did KC groggy-text you at 6am that made no sense?",
            options: [
                '"I have my beautiful"',
                '"I have my handsome"',
                '"I have my sunshine"',
                '"I have my breakfast"'
            ],
            correct: 1
        },
        {
            q: "What did KC say he'd do if you paid for a date?",
            options: [
                "He'd be impressed",
                "He'd assume you don't want to see him anymore 😭",
                "He'd split it evenly next time",
                "He'd cook you dinner to make up for it"
            ],
            correct: 1
        },
        {
            q: "What was KC's excuse for not singing at his friend's birthday?",
            options: [
                "He was too shy",
                "He was busy recording on his phone",
                "He forgot the lyrics",
                "He was eating cake"
            ],
            correct: 1
        },
        {
            q: "How many meals did KC and his friends eat on their Houston food trip?",
            options: [
                "3 meals a day like normal people",
                "5 on day 1, 6 on day 2",
                "7 on day 1, 8 on day 2",
                "They lost count"
            ],
            correct: 2
        },
        {
            q: "What does KC call himself?",
            options: [
                "A golden retriever",
                "An honorary Korean",
                "A hands-in-pockets boy",
                "All of the above 😭"
            ],
            correct: 3
        }
    ];

    return questions.map((q, i) => `
        <div class="quiz-question" id="quiz-q-${i}">
            <div class="quiz-question-text">Q${i+1}: ${q.q}</div>
            ${q.options.map((opt, j) => `
                <button class="quiz-option" onclick="answerQuiz(${i}, ${j}, ${q.correct})">${opt}</button>
            `).join('')}
        </div>
    `).join('');
}

function answerQuiz(questionIdx, selectedIdx, correctIdx) {
    const questionEl = document.getElementById(`quiz-q-${questionIdx}`);
    const buttons = questionEl.querySelectorAll('.quiz-option');

    // Prevent double-answering
    if (questionEl.dataset.answered) return;
    questionEl.dataset.answered = 'true';

    buttons.forEach((btn, i) => {
        btn.style.pointerEvents = 'none';
        if (i === correctIdx) {
            btn.classList.add('correct');
        } else if (i === selectedIdx && selectedIdx !== correctIdx) {
            btn.classList.add('wrong');
        }
    });

    if (selectedIdx === correctIdx) quizScore++;
    quizAnswered++;

    if (quizAnswered === 10) {
        setTimeout(showQuizScore, 600);
    }
}

function showQuizScore() {
    const scoreCard = document.getElementById('quiz-score-card');
    const scoreNum = document.getElementById('quiz-final-score');
    const scoreText = document.getElementById('quiz-final-text');

    scoreNum.textContent = `${quizScore} / 10`;

    if (quizScore === 10) {
        scoreText.textContent = "You know me better than I know myself. Come here already 😭";
    } else if (quizScore >= 7) {
        scoreText.textContent = "Okay you've been paying attention... I see you 🤭";
    } else if (quizScore >= 4) {
        scoreText.textContent = "Were you even reading my messages?! 😤😤😤";
    } else {
        scoreText.textContent = "...Are you sure you're on the right flight? 🤣";
    }

    scoreCard.classList.remove('hidden');
    scoreCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getHungryContent() {
    return `
        <h2 class="section-title">Our Food Bucket List 🍜</h2>
        <div class="message-text">
            <p>Okay listen. When you land, here's what's waiting for you:</p>
            <p>I know your order. Chocolate everything. Boba (mango or brown sugar). Sushi. Tteokbokki (the spicy one, fine).</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Come back and talk to me when you've leveled up enough to handle the original Buldak 😏<div class="bubble-time">Jun 23</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>Can I at least have a bottle of milk 🥹<div class="bubble-time">Jun 23</div></div>
        </div>
        <div class="message-text">
            <p>A Paris Baguette coffee because apparently that's all you trust them for here 😤. And maybe some of that Dubai chocolate if I can find it.</p>
            <p>But more than that — here's our official food bucket list. Every single one of these, we're doing together:</p>
        </div>
        <div class="bucket-list">
            <div class="bucket-category">
                <div class="bucket-category-title">🍳 Dates</div>
                <div class="bucket-item">Old Alley Hotpot (the mala one — I'll handle your spice training)</div>
                <div class="bucket-item">Sushi date in Austin</div>
                <div class="bucket-item">Your first real Indian curry (with backup milk, I promise)</div>
                <div class="bucket-item">That dessert place we've BOTH been to — together this time</div>
                <div class="bucket-item">HeyTea boba run (grape for me, mango for you)</div>
                <div class="bucket-item">Midnight Canes run 🐔</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">👩‍🍳 Cooking Together</div>
                <div class="bucket-item">Homemade gimbap picnic</div>
                <div class="bucket-item">Nasi lemak cooking date (you: sous chef)</div>
                <div class="bucket-item">Making hwachae together in the summer</div>
                <div class="bucket-item">Buldak challenge: original vs original (house rules: NO extra sauce)</div>
                <div class="bucket-item">Japanese curry — I'll actually take a good picture this time</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">🏆 Challenges</div>
                <div class="bucket-item">Paris Baguette vs Tous Les Jours official taste test</div>
                <div class="bucket-item">7-meal Houston food trip (yes, you're coming next time)</div>
                <div class="bucket-item">Find a coin karaoke + eat tteokbokki after</div>
                <div class="bucket-item">Finding the best sushi in Austin together</div>
            </div>
        </div>
        <div class="message-text">
            <p>I told you I had a list. This is just the food section. 🙂</p>
        </div>
        <div class="message-signature">— Your honorary Korean chef 🇰🇷</div>
    `;
}

function getNervousContent() {
    return `
        <h2 class="section-title">Hey. I Know. Me Too. 🥺</h2>
        <div class="message-text">
            <p>I know what you're feeling right now, because I'm feeling it too.</p>
            <p>What if it's awkward? What if we run out of things to say? What if the real version of me doesn't match the texting version?</p>
            <p>Let me tell you something: I'm nervous too. Genuinely nervous. You've seen me try to style my hair at midnight, panic about what to do with my hands, and accidentally send videos with no audio. The real me is exactly that — a little clumsy, a little goofy, and completely head over heels for you.</p>
            <p>Here's what I want you to know:</p>
            <p>There's no pressure. None at all. If you want to sit in the car and just listen to music for the first 10 minutes because it feels weird, we'll do that. If you want to laugh at how I look compared to my photos, go ahead (I'm bracing myself). If you need me to put my hands in my pockets so you feel less overwhelmed by my presence... I'll do that too 🥹</p>
            <p>Remember when you said this?</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>And honestly, I already feel really comfortable with you. I just wish we weren't so far apart right now. 🥺<div class="bubble-time">Jun 13, 2:45 PM</div></div>
        </div>
        <div class="message-text">
            <p>That was June 13th. Just two days after we started talking. If you felt safe with me in two days over text, imagine how you'll feel when I'm actually standing in front of you.</p>
            <p>I'm not here to impress you. I'm here because over 70+ days of talking across time zones, late nights, and thousands of messages, you became the person I want to see the most in this world.</p>
            <p>And I meant what I said: I'd be happy going on kids' rides with you all day if that's what makes you comfortable.</p>
            <p>But I have a feeling the second we see each other, all the nervousness will disappear and it'll feel exactly like our 3am chats — like we've known each other forever.</p>
            <p>See you so soon, pretty girl. 🌸</p>
        </div>
        <div class="message-signature">— Your golden retriever, KC 🐕</div>
    `;
}

function getMemoriesContent() {
    return `
        <h2 class="section-title">Our Story So Far 🌙</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1.5rem; font-size:0.85rem;">Every moment that made me fall for you, timestamped.</p>
        <div class="timeline">
            <div class="timeline-item">
                <div class="timeline-date">June 11, 5:57 AM</div>
                <div class="timeline-text">The message that started everything.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Hi! It's me. Sunny! 😊<div class="bubble-time">5:57 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 11, 7:04 AM</div>
                <div class="timeline-text">My terrible attempt at Korean to impress you.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>안녕하세요!!!! 🙂<div class="bubble-time">7:04 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>How can u speak korean?!<div class="bubble-time">7:10 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 11, 11:08 PM</div>
                <div class="timeline-text">Korea wins their World Cup match! 🇰🇷 Our first shared celebration.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Yes! I'm watching as well!! This is crazy!<div class="bubble-time">11:08 PM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I honestly never thought we would win<div class="bubble-time">11:08 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 13, 2:45 PM</div>
                <div class="timeline-text">The message that made my heart stop. Two days. That's all it took.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>And honestly, I already feel really comfortable with you. I just wish we weren't so far apart right now. 🥺<div class="bubble-time">2:45 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 14</div>
                <div class="timeline-text">I found out your favorite color is pink. Started planning immediately. 💗</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>You like black, I like pink… I guess we're BLACKPINK now. 😂🩷🖤<div class="bubble-time">7:22 PM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Kpop references?!?! Lady, you're officially Playing with Fire 🔥<div class="bubble-time">8:43 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 15</div>
                <div class="timeline-text">You're going to Japan — to the EXACT same places I went last year.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I'm going to sapporo! Have you ever been?<div class="bubble-time">7:08 PM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>YES!!! That was my last Japan trip!!!<div class="bubble-time">7:09 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 17</div>
                <div class="timeline-text">Blue Pond, Farm Tomita, lavender ice cream. Same spots, one year apart. ✨</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I think this might be the same place! 😄<div class="bubble-time">4:31 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>And you're right… it's kind of wild to think we could've crossed paths without even knowing it. 😆✨<div class="bubble-time">8:50 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 18</div>
                <div class="timeline-text">World Cup heartbreak 🥹 Korea loses to Mexico. Dessert heals all wounds.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>UMM HELLO?! Our team ☺️ Honorary Korean remember?!<div class="bubble-time">10:04 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 21, 11:06 AM</div>
                <div class="timeline-text">You send me your violin headshot. I stand by this reaction.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>OHHHH MYYY GOOOSSHHH You're so beautiful 😭<div class="bubble-time">11:06 AM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>🥵🥵🥵🥵🥵<div class="bubble-time">11:06 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 22-23, 3:52 AM</div>
                <div class="timeline-text">Our first real-time conversation. I stayed up until 6am. You kept telling me to sleep. I refused.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Wait… isn't it like 3am over there right now? Why are u still awake??<div class="bubble-time">3:52 AM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Maybe I was waiting to speak with you? 🥹<div class="bubble-time">3:53 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I think this might be the first time we've actually been online and talking at the same time!<div class="bubble-time">4:04 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 23, 5:08 AM</div>
                <div class="timeline-text">The Great Buldak Debate begins. 🔥</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Come back and talk to me when you've leveled up enough to handle the original Buldak 😏<div class="bubble-time">5:08 AM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Can I at least have a bottle of milk 🥹<div class="bubble-time">5:09 AM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>WAIT where's the sweet version of you 😤😤😤<div class="bubble-time">5:09 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 23, 4:35 AM</div>
                <div class="timeline-text">First time I mentioned holding your hand. Heart: exploded.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Well as long as I can hold the other hand i guess 🙄<div class="bubble-time">4:35 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Hahaha that's actually a pretty good idea though<div class="bubble-time">4:36 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 23, 4:08 AM</div>
                <div class="timeline-text">You trying to come back earlier... for me 🥹</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I'm trying to figure out a way to come back earlier 🥺<div class="bubble-time">4:08 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I just miss Texas a little bit. ☺️ I just have a lot of things waiting for me there.<div class="bubble-time">4:12 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 24</div>
                <div class="timeline-text">I showed you my actual bucket list. Our future started taking shape.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Wait you actually made a list? 🥹 that's sooo sweet<div class="bubble-time">7:32 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>That actually sounds really nice 😆 I think I'd love that, especially if I got to experience it with you!<div class="bubble-time">7:30 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 24</div>
                <div class="timeline-text">The dessert place in Austin. Another crossing of paths.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Yes! I think I remember going there once late at night because I was looking for a place that was still open. Maybe we're meant to be 😊<div class="bubble-time">10:34 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 25</div>
                <div class="timeline-text">Coin karaoke! I said I'd never step into a booth with a music student 🤣</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Listen here lady, I'm not about to step into a karaoke booth with a music student 🤣<div class="bubble-time">1:44 AM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>But whenever my friends organize one, you better believe I'm dragging you there to show you off 😤<div class="bubble-time">1:45 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 25, 12:28 AM</div>
                <div class="timeline-text">We both felt it at the same time.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Why does it feel like I've already known you forever?<div class="bubble-time">12:28 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>It feels like we've known each other for much longer than we actually have!<div class="bubble-time">12:30 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 27</div>
                <div class="timeline-text">Voice trading day! First time we heard each other speak.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>That clip was way too short! 😭 I kept replaying it trying to hear your voice But I found you You have a really nice deep voice ☺️<div class="bubble-time">2:45 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 28, 11:54 PM</div>
                <div class="timeline-text">I styled my hair at midnight. You saved it as your favorite look on me.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>No way! I actually think this is the best your hair has ever looked You should do it like this more often 🤭<div class="bubble-time">12:31 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">June 29</div>
                <div class="timeline-text">You told me about your best friend's letters. I thought: I'm going to do something like that for her too. This is it. 💌</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>She wrote me a whole bunch of letters. There was one to read when I first arrived, one for a month later, one for when I was feeling sad, one for when I was happy… It honestly meant so much to me 🥹❤️<div class="bubble-time">8:49 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">July 26</div>
                <div class="timeline-text">The sticker war 🤣 And our first voice messages to each other.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>NOOOOOOOOO NOT THE GARLIC 😭😭😭<div class="bubble-time">4:01 PM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Its not garlic! For me its apple<div class="bubble-time">4:02 PM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>Does that make me the.. Apple of your eye 🥹<div class="bubble-time">4:02 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">July 26</div>
                <div class="timeline-text">Voice messages in Chinese and Korean. Your voice drives me crazy 🥰</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Hehe i like you more<div class="bubble-time">4:16 PM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>OMGGGGGGGGGGG How can your voice be so sweet 😭<div class="bubble-time">4:29 PM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">July 27</div>
                <div class="timeline-text">The final countdown begins. 27 days.</div>
                <div class="chat-bubbles">
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Ive been witing for you!!<div class="bubble-time">7:43 AM</div></div>
                    <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Becasue i missed youu 😭<div class="bubble-time">7:43 AM</div></div>
                    <div class="chat-bubble me"><span class="bubble-name">KC</span>27 days 🥺<div class="bubble-time">8:12 AM</div></div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-date">August 23 ✈️</div>
                <div class="timeline-text">You're here. We made it. The distance is over. And everything that comes next? We write together. ☀️❤️</div>
            </div>
        </div>
        <div class="message-signature">— To be continued... in person ☺️</div>
    `;
}
function getVoiceContent() {
    return `
        <h2 class="section-title">Press Play 🎧</h2>
        <div class="message-text">
            <p>Here's a collection of voice notes just for you. Some new, some from our chats that I know you liked replaying. Hit play whenever you need me. ☺️</p>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/good-morning.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">Good morning, 자기야 ☀️</div>
                <div class="audio-subtitle">English + Chinese morning greeting</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/miss-you.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">我好想你 (I miss you)</div>
                <div class="audio-subtitle">The one you replayed over and over</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/bedtime.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">For when you're falling asleep 🌙</div>
                <div class="audio-subtitle">The soft Chinese version you said you loved more</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/something-new.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">Something new to guess 🤭</div>
                <div class="audio-subtitle">Figure this one out, genius</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/for-smile.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">For when you need to smile 😊</div>
                <div class="audio-subtitle">A silly one — I tried my best Korean</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="message-text" style="margin-top:1.5rem;">
            <p>Your voice does the same thing to me, by the way. Every time I listen to your Korean voice messages, I can't stop smiling. I play them on loop.</p>
            <p>See you soon so I can hear it in person ☺️</p>
        </div>
        <div class="message-signature">— KC 🎙️</div>
    `;
}

function getPhotosContent() {
    return `
        <h2 class="section-title">Our Photo Diary 📸</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1.5rem; font-size:0.85rem;">Every picture tells our story. Here are the ones that made my heart race.</p>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/blue-pond-her.jpg" alt="">
                <div class="photo-caption">Your Blue Pond — June 17 🩵</div>
            </div>
            <div class="photo-item">
                <img src="photos/blue-pond-me.jpg" alt="">
                <div class="photo-caption">My Blue Pond — one year earlier ✨</div>
            </div>
            <div class="photo-item wide">
                <img src="photos/farm-tomita-her.jpg" alt="">
                <div class="photo-caption">Farm Tomita — "I couldn't remember the name, so in my head it was just the lavender field" 💜</div>
            </div>
            <div class="photo-item">
                <img src="photos/violin-headshot.jpg" alt="">
                <div class="photo-caption">The violin headshot that broke me 🎻 "OHHHH MYYY GOOOSSHHH"</div>
            </div>
            <div class="photo-item">
                <img src="photos/recital-dress.jpg" alt="">
                <div class="photo-caption">Your recital in the red dress 🌹 I wished I'd met you 2 months earlier</div>
            </div>
            <div class="photo-item">
                <img src="photos/spain-mallorca.jpg" alt="">
                <div class="photo-caption">Mallorca, Spain — you in a dress by the ocean. Breathtaking. 🌊</div>
            </div>
            <div class="photo-item">
                <img src="photos/ballet.jpg" alt="">
                <div class="photo-caption">Ballet in pink — "It's not sexy tho 😂" ...wrong. 💗</div>
            </div>
            <div class="photo-item wide">
                <img src="photos/ice-skating.jpg" alt="">
                <div class="photo-caption">Central Park ice skating 🎿 "I don't fall anymore! I'm actually really good!" ...the video says otherwise 🤣</div>
            </div>
            <div class="photo-item">
                <img src="photos/karaoke.jpg" alt="">
                <div class="photo-caption">Coin karaoke booth 🎤 "I randomly walked in because I just couldn't walk past it!"</div>
            </div>
            <div class="photo-item">
                <img src="photos/cafe-dessert.jpg" alt="">
                <div class="photo-caption">The cafe with the lavender ice cream 🍦 "Wrong answer!! 😤" "Okay it supposed to be talking with you 🤭"</div>
            </div>
            <div class="photo-item">
                <img src="photos/world-cup.jpg" alt="">
                <div class="photo-caption">World Cup night 🇰🇷 We watched together across the world</div>
            </div>
            <div class="photo-item">
                <img src="photos/tulips.jpg" alt="">
                <div class="photo-caption">The tulips I stared at for 10 minutes because they reminded me of you 🌷</div>
            </div>
            <div class="photo-item wide">
                <img src="photos/prada-marfa.jpg" alt="">
                <div class="photo-caption">Prada Marfa — I brought a suitcase just to have a prop. You caught my hands in my pockets AGAIN 😤</div>
            </div>
            <div class="photo-item">
                <img src="photos/somi-somi.jpg" alt="">
                <div class="photo-caption">Somi Somi dessert 🍦 Another place we'd both been. "Maybe we're meant to be 😊"</div>
            </div>
            <div class="photo-item">
                <img src="photos/hair-styling.jpg" alt="">
                <div class="photo-caption">Midnight hair styling 💇‍♂️ "I actually think this is the best your hair has ever looked" — saved forever</div>
            </div>
            <div class="photo-item">
                <img src="photos/buldak.jpg" alt="">
                <div class="photo-caption">The spicy tteokbokki you challenged me to try. I'm scared. 🔥</div>
            </div>
            <div class="photo-item">
                <img src="photos/cat.jpg" alt="">
                <div class="photo-caption">Your cat 🐱 "So cuuuuttteee I just wanna cuddle her!!" ...I don't see you though 😤</div>
            </div>
            <div class="photo-item wide">
                <img src="photos/stickers.jpg" alt="">
                <div class="photo-caption">The sticker war of July 26th — you're an artist with these 🤣</div>
            </div>
        </div>
        <div style="margin-top:1.5rem;">
            <p style="font-size:0.85rem; color:#8b6b7a; text-align:center; margin-bottom:0.75rem;">Some of my favorite reactions to your photos:</p>
            <div class="chat-bubbles">
                <div class="chat-bubble me"><span class="bubble-name">KC</span>OMG that's so pretty 🙂 both you and the pond!!<div class="bubble-time">Jun 17</div></div>
                <div class="chat-bubble me"><span class="bubble-name">KC</span>OHHHH MYYY GOOOSSHHH You're so beautiful 😭<div class="bubble-time">Jun 21</div></div>
                <div class="chat-bubble me"><span class="bubble-name">KC</span>My gosh you look amazingggg in that red dress 😍<div class="bubble-time">Jun 29</div></div>
                <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Its not sexy tho 😂<div class="bubble-time">Jul 26</div></div>
                <div class="chat-bubble me"><span class="bubble-name">KC</span>What do you mean it's not sexy.. you already have that sexy model face 😭<div class="bubble-time">Jul 26</div></div>
                <div class="chat-bubble me"><span class="bubble-name">KC</span>I keep having to scroll up to look at yours 🥹 you're soooo pretty 😭<div class="bubble-time">Jun 23</div></div>
            </div>
        </div>
        <div class="message-text" style="margin-top:1.5rem;">
            <p>Every single photo you sent me is saved. Every video replayed dozens of times. Every sticker screenshot'd and smiled at.</p>
            <p>I can't wait to fill our camera rolls with photos of us together. Starting very, very soon. ☺️</p>
        </div>
        <div class="message-signature">— KC 📷</div>
    `;
}

function getFutureContent() {
    return `
        <h2 class="section-title">Our Future 🌸</h2>
        <div class="message-text">
            <p>Every time you mentioned something you haven't done, something you want to try, or somewhere you want to go — I wrote it down. This is our list. Not mine. Ours.</p>
            <p>We're going to check these off together, one by one, at whatever pace makes you happy. No rush. No pressure. Just us exploring life side by side.</p>
        </div>
        <div class="bucket-list">
            <div class="bucket-category">
                <div class="bucket-category-title">🌸 First Dates</div>
                <div class="bucket-item">Our first hug at the airport</div>
                <div class="bucket-item">Picnic date with homemade gimbap, hwachae, and your favorite flowers</div>
                <div class="bucket-item">Boba date at my favorite shop (the one that made me think of you)</div>
                <div class="bucket-item">Sushi date in Austin</div>
                <div class="bucket-item">That dessert place in Austin we've BOTH been to — together this time</div>
                <div class="bucket-item">Fancy dinner where I finally wear the suit 😌</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">🎀 Adventures</div>
                <div class="bucket-item">Six Flags San Antonio (teacups first, rollercoasters if you're brave)</div>
                <div class="bucket-item">Rock climbing / bouldering (baby skin princess hands club)</div>
                <div class="bucket-item">Ice skating / rollerblading date in Austin</div>
                <div class="bucket-item">National park trip (White Sands or Big Bend)</div>
                <div class="bucket-item">San Diego beach trip 🏖️</div>
                <div class="bucket-item">Camping under the stars</div>
                <div class="bucket-item">Skydiving (holding hands the ENTIRE time)</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">🎶 Together Things</div>
                <div class="bucket-item">Coin karaoke (even if we have to drive to Houston)</div>
                <div class="bucket-item">Cooking nasi lemak together (you: sous chef)</div>
                <div class="bucket-item">Board game night (I'll teach you Codenames properly)</div>
                <div class="bucket-item">Ballet class (I'll probably fall, you'll probably laugh)</div>
                <div class="bucket-item">Gym dates in basic outfits 🏋️</div>
                <div class="bucket-item">Watch your next performance from the front row 🎻</div>
                <div class="bucket-item">Drive around Austin with you as passenger princess</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">🌍 Someday</div>
                <div class="bucket-item">Korea together (you show me Seoul, I eat all the tteokbokki)</div>
                <div class="bucket-item">Paris 🇫🇷</div>
                <div class="bucket-item">Japan again — same places, same time, finally together</div>
                <div class="bucket-item">Malaysia (I'll introduce you to my family + real nasi lemak)</div>
                <div class="bucket-item">Spain (Mallorca again — but this time with me)</div>
                <div class="bucket-item">New Year's ball drop together 🎊</div>
            </div>
        </div>
        <div class="message-text">
            <p>Every one of these has your name written on it. Let's start checking them off. ☺️</p>
        </div>
        <div class="message-signature">— KC 🗒️✨</div>
    `;
}

function getLandingContent() {
    return `
        <h2 class="section-title">Welcome Home, 자기야 🤠☀️</h2>
        <div style="text-align:center; margin:1.5rem 0;">
            <div style="font-family:'Caveat',cursive; font-size:3.5rem; color:#ff6b9d; font-weight:700;">0 days</div>
            <div style="font-size:1rem; color:#8b6b7a; font-weight:600;">The countdown is over.</div>
        </div>
        <div class="message-text">
            <p>You made it. We made it. ☀️</p>
            <p>I'm probably pacing around right now, fixing my hair for the 47th time, with my hands in my pockets because I still don't know what to do with them. But the second I see you, I know exactly what I'm going to do with them.</p>
            <p>Thank you for being patient. Thank you for being you. Thank you for every message, every voice note, every sticker, every picture, and every moment that made this distance feel a little shorter.</p>
            <p>Thank you for matching my energy, for texting me back even at 4am with jet lag, for teaching me Korean, for trusting me with your stories and your pictures, and for giving this random guy from Hinge a real chance.</p>
            <p>I told you once that you're entirely worth the wait. I meant every word.</p>
            <p>Now let's go start our list. ☺️</p>
        </div>
        <div class="message-signature">— Your honorary Korean 🇰🇷<br>original buldak level: kids' edition<br>hands-in-pockets champion<br>golden retriever<br>자기야's KC ❤️</div>
        <div style="text-align:center; margin-top:2rem; padding:1.5rem; background:linear-gradient(135deg,#fff0f5,#ffeef8); border-radius:16px;">
            <div style="font-family:'Caveat',cursive; font-size:1.5rem; color:#ff6b9d;">To be continued... in person ☺️</div>
        </div>
    `;
}

function getWithMeContent() {
    return `
        <h2 class="section-title">이제 시작이야 💗</h2>
        <p style="text-align:center; font-family:'Caveat',cursive; font-size:1.3rem; color:#8b6b7a; margin-bottom:1.5rem;">This is just the beginning.</p>
        <div class="message-text">
            <p>자기야...</p>
            <p>If you're reading this, it means I'm right next to you. Actually here. Not 14 hours away. Not behind a screen. Not a voice message you replay at 4am.</p>
            <p>Me. Right here.</p>
            <p>I've been waiting for this moment since June 11th. Every text, every voice note, every late night, every "go to sleep!" that I ignored, every picture I replayed, every sticker you made of me — it was all leading to right now.</p>
            <p>I don't know if I'm shaking or if you are. Probably both.</p>
            <p>I just want you to know: you are so much more beautiful in person. Your voice is so much softer. And my hands finally have somewhere to be.</p>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/with-you.m4a')">▶</button>
            <div class="audio-info">
                <div class="audio-title">For you, right now ☺️</div>
                <div class="audio-subtitle">Press play. I'll wait.</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="message-text">
            <p>72 days. Thousands of messages. One timezone away. And now zero distance between us.</p>
            <p>Thank you for saying 자기야 to my face. I've been dreaming about hearing that since July.</p>
            <p>이제 시작이야. This is just the beginning. And I'm so glad it's with you.</p>
        </div>
        <div style="text-align:center; margin-top:2rem; padding:1.5rem; background:linear-gradient(135deg,#fff0f5,#ffeef8); border-radius:16px;">
            <div style="font-family:'Caveat',cursive; font-size:1.2rem; color:#ff6b9d; margin-bottom:0.5rem;">Our first item ✓</div>
            <div style="font-size:1rem; color:#4a3040; text-decoration:line-through; opacity:0.7;">☐ Our first hug at the airport</div>
            <div style="font-size:1rem; color:#4a3040; font-weight:700; margin-top:0.25rem;">☑️ Our first hug. ☺️</div>
        </div>
        <div class="message-signature">— Your KC. Finally here. ❤️</div>
    `;
}

// ==========================================
// AUDIO PLAYER
// ==========================================

let currentAudio = null;

function playAudio(btn, src) {
    const playerEl = btn.closest('.audio-player');
    const wavesEl = playerEl.querySelector('.audio-waves');

    // If same audio is playing, pause it
    if (currentAudio && currentAudio.src.includes(src) && !currentAudio.paused) {
        currentAudio.pause();
        btn.textContent = '▶';
        wavesEl.classList.remove('playing');
        return;
    }

    // Stop any other playing audio
    if (currentAudio) {
        currentAudio.pause();
        document.querySelectorAll('.audio-play-btn').forEach(b => b.textContent = '▶');
        document.querySelectorAll('.audio-waves').forEach(w => w.classList.remove('playing'));
    }

    // Play new audio
    currentAudio = new Audio(src);
    currentAudio.play().then(() => {
        btn.textContent = '⏸';
        wavesEl.classList.add('playing');
    }).catch(() => {
        // Audio file not found — show placeholder behavior
        btn.textContent = '▶';
        wavesEl.classList.remove('playing');
    });

    currentAudio.addEventListener('ended', () => {
        btn.textContent = '▶';
        wavesEl.classList.remove('playing');
    });
}
