/* ==========================================
   FOR SUNNY ☀️ , Main App Logic
   ========================================== */

// ==========================================
// COUNTDOWN LOCK , Unlocks Aug 23, 2025
// ==========================================

const UNLOCK_TIMESTAMP = 1787471100000; // Aug 23, 2026 4:45 PM KST (07:45 UTC) , 1hr before her ~5:45pm KST departure

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
        // If offline, fall back to device time (acceptable , she'll be on a plane)
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
    "Hands OFF the lock 🔒",
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
    "나중에!! 😤",
    "I can hear you tapping from Texas 🙄",
    "Okay.. you're so persistent.. lets try this.. tap me again if....",
    "you....",
    "Just really miss me and can't wait to see me ☺️",
    "Aww... 자기야 ... I like you too ☺️",
    "Just a few more days until we can be together",
    "Until we get to hold each others hands",
    "Until I no longer...need to hug my long pillow...",
    "You've been running around nonstop for some time...",
    "Practicing, doctors, friends...",
    "And you're still thinking of me? ❤️",
    "I see you, and I'm so proud of you ❤️ more than anything!",
    "Do what you need to do and please don't worry about me, okay? ☺️",
    "I just want you to know that even if we don't have time to talk these days...",
    "None of that changes anything for me ☺️",
    "화이팅 자기야 ☺️"
];

// Flower gift sequence , shown FIRST when she taps the lock, reveals the gift at the end.
// TO REMOVE THE FLOWER MESSAGES LATER: just set this to an empty array ->  const flowerMessages = [];
const flowerMessages = [
    "Just a few more days until we can be together",
    "Until we get to hold each others hands",
    "Until I no longer...need to hug my long pillow...",
    "You've been running around nonstop for some time...",
    "Practicing, doctors, friends...",
    "WOW, you barely have time but you still check? ❤️",
    "I see you, and I'm so proud of you ❤️ more than anything!",
    "Do what you need to do and please don't worry about me, okay? ☺️",
    "I just want you to know that even if we don't have time to talk these days...",
    "None of that changes anything for me ☺️",
    "화이팅 자기야 ☺️",
    "Are you sad that the flowers faded? 🥺",
    "Don't be.. they did exactly what they were supposed to do ☺️",
    "They reminded you that someone far away was thinking of you every single day 🥹",
    "And that hasn't changed. Not even a little bit ❤️",
    "They kept you company while we were apart 🥹",
    "And soon, they won't have to anymore...",
    "Because the countdown is almost done ❤️"
];

const FLOWER_GIFT_URL = 'https://sodagift.com/ko/welcome/gift-links/2229133?t=3k8OgWihN0kcw605JHsg';

let lockedTapCount = 0;

function initCountdown() {
    // HARD LOCK , always show locked page during development
    // Change DEV_LOCK to false when ready to use the real timer
    const DEV_LOCK = true;

    // Flight version always skips the lock (she's already on the plane)
    const isFlight = location.pathname.includes('/flight');
    if (isFlight) {
        document.getElementById('locked-page').classList.add('hidden');
        document.getElementById('landing').classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        return;
    }

    // Show locked page immediately , no waiting
    document.getElementById('locked-page').classList.remove('hidden');
    document.getElementById('landing').classList.add('hidden');
    document.body.style.overflow = 'hidden';
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
    const lockBtn = document.getElementById('locked-btn');

    // Start music on first tap (iOS requires audio in user gesture handler)
    if (!musicPlaying) {
        startMusic();
    }

    // Flower messages + teasing messages all cycle together as one loop.
    const allMessages = flowerMessages.concat(lockedMessages);
    const idx = lockedTapCount % allMessages.length;
    showLockedMsg(allMessages[idx]);

    // Reveal the gift button the first time we reach the last flower message,
    // then keep it around for good.
    if (false && flowerMessages.length && idx === flowerMessages.length - 1) {
        localStorage.setItem('flowerGiftRevealed', 'true');
        showFlowerGift();
    }
    lockedTapCount++;
}

// Shows text in the locked-message element with the fade-in animation
function showLockedMsg(text) {
    const msgEl = document.getElementById('locked-message');
    msgEl.style.animation = 'none';
    void msgEl.offsetWidth;
    msgEl.style.animation = 'fadeInUp 0.3s ease-out';
    msgEl.textContent = text;
}

// Fades in the gift button that leads to the new flower gift
function showFlowerGift() {
    if (document.getElementById('gift-btn')) return;
    const btn = document.createElement('a');
    btn.id = 'gift-btn';
    btn.className = 'gift-btn';
    btn.href = FLOWER_GIFT_URL;
    btn.target = '_blank';
    btn.rel = 'noopener';
    btn.textContent = '🌸 Open me';
    const msgEl = document.getElementById('locked-message');
    msgEl.insertAdjacentElement('afterend', btn);
    void btn.offsetWidth; // trigger transition
    btn.classList.add('gift-btn-visible');
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initCheckin();
    // Auto-start music on first tap anywhere (mobile browsers require user gesture)
    function firstTapMusic() {
        startMusic();
        document.removeEventListener('touchstart', firstTapMusic);
        document.removeEventListener('click', firstTapMusic);
    }
    document.addEventListener('touchstart', firstTapMusic, { once: true });
    document.addEventListener('click', firstTapMusic, { once: true });
});

// ==========================================
// TIME-AWARE CHECK-IN BUTTON (Good morning / Goodnight)
// ==========================================

const SHEET_ENDPOINT = 'https://script.google.com/macros/s/AKfycbx_eLVwB3zXsDFRAkVmLu8y9kn4dPVHubBmasXd8koaG9ZNPte0ZgLwmXl0LtA5qnizeA/exec';

// ==========================================
// OPTIONAL ON-SCREEN MESSAGES (leave arrays empty for no message)
// To add messages, just put strings in these arrays, e.g.:
//   morning: ["Good morning 자기야 ☀️", "Did you sleep well? 🥹"]
// If an array is empty, tapping just does the cute animation with no text.
// ==========================================
const checkinMessages = {
    morning: [],
    night: [],
    day: []
};

// Small delayed feedback so buttons don't feel dead
function buttonFeedback(btnEl, messagePool) {
    setTimeout(() => {
        // Button pop
        btnEl.classList.remove('btn-pop-feedback');
        void btnEl.offsetWidth;
        btnEl.classList.add('btn-pop-feedback');
        // Floating heart
        spawnHeart(btnEl);
        // Optional message
        if (messagePool && messagePool.length) {
            const respEl = document.getElementById('checkin-response');
            if (respEl) {
                const msg = messagePool[Math.floor(Math.random() * messagePool.length)];
                respEl.textContent = msg;
                respEl.classList.remove('show');
                void respEl.offsetWidth;
                respEl.classList.add('show');
                clearTimeout(respEl._hideTimer);
                respEl._hideTimer = setTimeout(() => respEl.classList.remove('show'), 5000);
            }
        }
    }, 0);
}

function spawnHeart(btnEl) {
    const rect = btnEl.getBoundingClientRect();
    const heart = document.createElement('span');
    heart.className = 'float-heart';
    heart.textContent = '💗';
    heart.style.left = (rect.left + rect.width / 2 - 11) + 'px';
    heart.style.top = (rect.top - 8) + 'px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 1000);
}

function getKSTHour() {
    try {
        const kst = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
        return kst.getHours();
    } catch (e) {
        return new Date().getHours();
    }
}

function getPeriod() {
    const h = getKSTHour();
    if (h >= 4 && h < 12) return 'morning';
    if (h >= 20 || h < 4) return 'night';
    return 'day';
}

function initCheckin() {
    const btn = document.getElementById('checkin-btn');
    if (!btn) return;
    const period = getPeriod();
    if (period === 'morning') btn.textContent = 'Say Good Morning ☀️';
    else if (period === 'night') btn.textContent = 'Say Goodnight 🌙';
    else btn.textContent = 'Say hi ☺️';
}

function tapCheckin() {
    const period = getPeriod();

    // Delayed cute feedback (pop + heart + optional message)
    buttonFeedback(document.getElementById('checkin-btn'), checkinMessages[period]);

    // Start music if not playing (user gesture)
    if (!musicPlaying) startMusic();

    // Rate-limit: log at most once per minute (she can still tap freely)
    const now = Date.now();
    const lastSent = parseInt(localStorage.getItem('lastCheckinSent') || '0', 10);
    if (now - lastSent < 60 * 1000) return;
    localStorage.setItem('lastCheckinSent', String(now));

    const kstTime = new Date().toLocaleString('en-US', {
        timeZone: 'Asia/Seoul',
        hour: 'numeric', minute: '2-digit', hour12: true,
        weekday: 'short', month: 'short', day: 'numeric'
    });

    const greeting = period === 'morning' ? 'Good morning ☀️' : (period === 'night' ? 'Goodnight 🌙' : 'Hi ☺️');

    // Log every tap to Google Sheet. no-cors avoids browser CORS issues.
    fetch(SHEET_ENDPOINT, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
            subject: `Sunny says ${greeting}`,
            message: `Sunny says "${greeting}" , ${kstTime} KST`,
            period: period,
            time_kst: kstTime
        })
    }).catch(() => {
        localStorage.removeItem('lastCheckinSent');
    });
}

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
// BACKGROUND MUSIC , 想见你
// ==========================================

let musicPlaying = false;
const bgTracks = ['audio/you-and-me.mp3','audio/second-chance.mp3', 'audio/xiang-jian-ni.mp3'];
let bgTrackIdx = 0;

function startMusic() {
    if (musicPlaying) return;
    const audio = document.getElementById('bg-music');
    if (!audio) return;
    audio.volume = 0.4;
    // Set up track advancement
    audio.removeEventListener('ended', advanceTrack);
    audio.addEventListener('ended', advanceTrack);
    audio.play().then(() => {
        musicPlaying = true;
        document.querySelectorAll('.music-btn').forEach(btn => {
            btn.classList.add('playing');
            btn.textContent = '🎶';
        });
    }).catch(() => {
        musicPlaying = false;
    });
}

function advanceTrack() {
    const audio = document.getElementById('bg-music');
    bgTrackIdx = (bgTrackIdx + 1) % bgTracks.length;
    audio.src = bgTracks[bgTrackIdx];
    audio.load();
    audio.play().catch(() => {});
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
        question: "What did KC tell you to drink for him during our first week talking?",
        hint: "June 12... KC asked you to get one for him 🥹",
        answers: ['boba', 'boba tea', 'bubble tea'],
        choices: ['Coffee ☕', 'Boba tea 🧋', 'Soju 🍶', 'Orange juice 🍊'],
        correctChoice: 1,
        content: 'getAirportContent'
    },
    {
        id: 'miss-me',
        emoji: '🥹',
        title: "You Miss Me",
        subtitle: "I miss you too, 자기야",
        question: "What's KC's signature photo pose that you caught him doing in every picture?",
        hint: "You noticed it and never let me live it down 😤",
        answers: ['hands in pockets'],
        choices: ['Peace sign ✌️', 'Hands in pockets 👖', 'Holding a suitcase 🧳', 'Arms crossed 😤'],
        correctChoice: 1,
        content: 'getMissMeContent'
    },
    {
        id: 'bored',
        emoji: '🎮',
        title: "You're Bored",
        subtitle: 'How well do you know KC?',
        question: "What board game did KC win 7 out of 8 times?",
        hint: "We played it at KC's friend's game night 🙂",
        answers: ['codenames'],
        choices: ['Monopoly 🎩', 'Codenames 🕵️', 'Uno 🃏', 'Catan 🏝️'],
        correctChoice: 1,
        content: 'getQuizContent'
    },
    {
        id: 'hungry',
        emoji: '🍜',
        title: "You Want to See Our Future",
        subtitle: 'Our bucket list for everything',
        question: "What did KC say he'd always have stocked in his fridge for you?",
        hint: "You were at a cafe and KC made a mental note 😌",
        answers: ['desserts', 'dessert'],
        choices: ['Buldak 🔥', 'Kimchi 🥬', 'Desserts 🍰', 'Ramen 🍜'],
        correctChoice: 2,
        content: 'getBucketListContent'
    },
    {
        id: 'nervous',
        emoji: '🥺',
        title: "You're Nervous About Meeting Me",
        subtitle: "Read this. I promise it helps.",
        question: "What did KC promise we'd do even if we're too scared for the big rollercoasters?",
        hint: "Something... spinny... and childish 🤭",
        answers: ['kids rides', 'teacups', 'spinning cups'],
        choices: ['Watch other people scream 😂', 'Eat funnel cake instead 🍩', 'Go on the kids rides 🎠', 'Leave immediately 🏃'],
        correctChoice: 2,
        content: 'getNervousContent'
    },
    {
        id: 'cant-sleep',
        emoji: '📅',
        title: "You Want to Relive Our Story",
        subtitle: 'June 11 to August 23, day by day',
        question: "What time was it for KC during our first real-time conversation?",
        hint: "KC refused to sleep... you kept telling him to go to bed 😤",
        answers: ['3am', '4am', '3', '4'],
        choices: ['11pm 🌆', '1am 🌙', '3am 😵', '6am ☀️'],
        correctChoice: 2,
        content: 'getTimelineContent'
    },
    {
        id: 'voice',
        emoji: '🎧',
        title: "You Can't Sleep",
        subtitle: 'Close your eyes, press play',
        question: "What Chinese phrase did you guess correctly from KC's voice message?",
        hint: "You figured it out from a song... 想见你",
        answers: ['i miss you', 'wo xiang ni'],
        choices: ['你好 (Hello) 👋', '我好想你 (I miss you) 🥹', '我爱你 (I love you) ❤️', '晚安 (Goodnight) 🌙'],
        correctChoice: 1,
        content: 'getVoiceContent'
    },
    {
        id: 'photos',
        emoji: '📸',
        title: "You Want to Look at Us",
        subtitle: 'A collage of our journey',
        question: "What place did we BOTH visit in Japan, exactly one year apart?",
        hint: "You said it was your favorite place that day 😊",
        answers: ['blue pond', 'farm tomita', 'sapporo', 'hokkaido'],
        choices: ['Tokyo Tower 🗼', 'Blue Pond 🩵', 'Shibuya Crossing 🚶', 'Mt. Fuji 🗻'],
        correctChoice: 1,
        content: 'getPhotosContent'
    },
    // ==========================================
    // BONUS ENVELOPES , "Never Seen" photo unlocks
    // ==========================================
    {
        id: 'bathroom-selfies',
        emoji: '🪞',
        title: "You're wondering what's in my pocket'",
        subtitle: 'Snacks.. always snacks for you 😊',
        question: "What did you always ask about KC's bathroom selfies?",
        hint: "It became our little game... 🫣",
        answers: ['whats in your pocket', 'pocket', 'hiding'],
        choices: ['Why is it so clean? 🧹', "What's in your pocket? 👖", 'Where are the towels? 🛁', 'Who took the photo? 📸'],
        correctChoice: 1,
        content: 'getBathroomContent'
    },
    {
        id: 'crossed-paths',
        emoji: '✨',
        title: "You Want to See Where Our Paths Almost Crossed",
        subtitle: 'Same places. Different years. One fate.',
        question: "What place did we BOTH visit in Hokkaido, one year apart?",
        hint: "You said it was your favorite place that day 💜",
        answers: ['blue pond', 'farm tomita'],
        choices: ['Otaru Canal 🏮', 'Blue Pond / Farm Tomita 💜', 'Asahiyama Zoo 🐧', 'Sapporo Tower 🗼'],
        correctChoice: 1,
        content: 'getCrossedPathsContent'
    },
    {
        id: 'young-me',
        emoji: '👶',
        title: "You Want to See Young KC",
        subtitle: 'Helmet hair era. No refunds.',
        question: "What did KC's hair look like as a kid?",
        hint: "You've seen the evidence... 😭",
        answers: ['helmet', 'bowl'],
        choices: ['Mullet 🤘', 'Helmet hair 🪖', 'Bald 👨‍🦲', 'Mohawk 🦅'],
        correctChoice: 1,
        content: 'getYoungMeContent'
    },
    {
        id: 'videos',
        emoji: '🎬',
        title: "You Want to Watch Our Videos",
        subtitle: 'Press play. Remember us.',
        question: "What game night were you trying to hear KC's voice at for the first time?",
        hint: "You were listening so hard for KC... 🎲",
        answers: ['board game', 'codenames', 'birthday'],
        choices: ['Karaoke night 🎤', 'Board game night 🎲', 'Pool party 🏊', 'Movie night 🍿'],
        correctChoice: 1,
        content: 'getVideosContent'
    },
    {
        id: 'stickers',
        emoji: '🎨',
        title: "You Want to See Our Stickers",
        subtitle: 'Every sticker has a story',
        question: "What did KC call himself that Sunny insisted was an apple?",
        hint: "It was about a fruit... or vegetable... 🧅",
        answers: ['onion', 'apple'],
        choices: ['Potato 🥔', 'Onion (but she said apple) 🧅', 'Tomato 🍅', 'Banana 🍌'],
        correctChoice: 1,
        content: 'getStickersContent'
    },
    {
        id: 'crossword',
        emoji: '✏️',
        title: "You Want a Challenge",
        subtitle: 'A crossword puzzle about us',
        question: "What's the name of the boba shop KC always goes to in Austin?",
        hint: "Chi Cha... something... 🧋",
        answers: ['chi cha san chen', 'chi cha'],
        choices: ['HeyTea 🫧', 'Chi Cha San Chen 🧋', 'Tiger Sugar 🐯', 'Gong Cha 🍵'],
        correctChoice: 1,
        content: 'getCrosswordContent'
    },
    {
        id: 'landing-tx',
        emoji: '🤠',
        title: "You Land in Texas",
        subtitle: 'Almost the last one... ✨',
        question: "What did our paths keep doing before we finally met?",
        hint: "Japan, Austin, Hinge... 🥹",
        answers: ['crossing', 'crossed', 'cross'],
        choices: ['Missing each other 😢', 'Crossing ✨', 'Running parallel 🛤️', 'Going in circles 🔄'],
        correctChoice: 1,
        isFinal: false,
        content: 'getLandingContent'
    },
    {
        id: 'with-me',
        emoji: '💗',
        title: "You're With Me",
        subtitle: 'Hand me your phone. 🤭',
        question: "KC will ask you something. Type your answer here ☺️",
        hint: "",
        answers: ['자기야', 'jagiya', 'jagi', '자기'],
        choices: ['오빠 😏', '자기야 💗', '여보 💍', 'KC 😤'],
        correctChoice: 1,
        isFinal: false,
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
    document.body.style.overflow = '';
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

const wrongMessages = [
    "WRONG 😤😤😤 Do you even know me?!",
    "Excuse me?! Try again!!",
    "That's not it, lady 😤",
    "I'm offended 🙄 Try again",
    "Wow... I'm hurt... but try again 🥹",
    "Are you guessing randomly?! 😤",
    "Nope!! Think harder 🧠",
    "How do you not know this 😭",
    "I can't believe you picked that 😤",
    "Wrong!! Do I mean nothing to you?! 😤😤",
    "Absolutely not 🙅 one more try...",
    "You're lucky I'm giving unlimited tries 😤",
    "GIRL... 😤 seriously?!",
    "Try again before I add more questions 😤",
    "I'm adding a 5th option that says 'I give up' 😤"
];

function openEnvelope(id) {
    const env = envelopes.find(e => e.id === id);
    if (!env) return;

    if (openedEnvelopes.includes(id)) {
        // Already opened, show content directly
        showEnvelopeContent(env);
        return;
    }

    // Lock background scroll
    document.body.style.overflow = 'hidden';

    // Show multiple choice prompt (or text input for the final in-person envelope)
    currentEnvelopeId = id;
    document.getElementById('password-question').textContent = env.question;
    document.getElementById('password-hint').textContent = env.hint || '';
    document.getElementById('password-error').classList.add('hidden');

    // Render choice buttons (or text input for 'with-me')
    const grid = document.getElementById('choices-grid');
    grid.innerHTML = '';

    if (env.id === 'with-me') {
        // Special: text input , she has to say it to his face and type it
        grid.innerHTML = `
            <input type="text" id="password-input" class="choice-input" placeholder="Type your answer..." autocomplete="off" autocapitalize="none">
            <button class="unlock-btn" onclick="checkTypedAnswer()">Unlock 💗</button>
        `;
        setTimeout(() => document.getElementById('password-input').focus(), 400);
        // Handle enter key
        setTimeout(() => {
            const inp = document.getElementById('password-input');
            if (inp) inp.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); checkTypedAnswer(); } });
        }, 100);
    } else {
        env.choices.forEach((choice, idx) => {
            const btn = document.createElement('button');
            btn.className = 'choice-btn';
            btn.textContent = choice;
            btn.addEventListener('click', () => pickChoice(idx));
            grid.appendChild(btn);
        });
    }

    document.getElementById('password-modal').classList.remove('hidden');
}

function checkTypedAnswer() {
    const env = envelopes.find(e => e.id === currentEnvelopeId);
    if (!env) return;
    const input = document.getElementById('password-input').value.trim().toLowerCase();
    const isCorrect = env.answers.some(a => input.includes(a.toLowerCase()));

    if (isCorrect) {
        if (!openedEnvelopes.includes(currentEnvelopeId)) {
            openedEnvelopes.push(currentEnvelopeId);
            localStorage.setItem('openedEnvelopes', JSON.stringify(openedEnvelopes));
        }
        closePasswordModal();
        showEnvelopeContent(env);
        renderEnvelopes();
    } else {
        const errorEl = document.getElementById('password-error');
        errorEl.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        errorEl.classList.remove('hidden');
        errorEl.style.animation = 'none';
        void errorEl.offsetWidth;
        errorEl.style.animation = 'shake 0.4s ease-in-out';
    }
}

function pickChoice(idx) {
    const env = envelopes.find(e => e.id === currentEnvelopeId);
    if (!env) return;

    if (idx === env.correctChoice) {
        // Correct! Flash green with a bounce, then open after delay
        const btns = document.querySelectorAll('.choice-btn');
        btns.forEach(b => b.style.pointerEvents = 'none');
        if (btns[idx]) {
            btns[idx].classList.add('choice-correct');
        }

        setTimeout(() => {
            if (!openedEnvelopes.includes(currentEnvelopeId)) {
                openedEnvelopes.push(currentEnvelopeId);
                localStorage.setItem('openedEnvelopes', JSON.stringify(openedEnvelopes));
            }
            closePasswordModal();
            showEnvelopeContent(env);
            renderEnvelopes();
        }, 1200);
    } else {
        // Wrong , show angry message, shake the button
        const errorEl = document.getElementById('password-error');
        errorEl.textContent = wrongMessages[Math.floor(Math.random() * wrongMessages.length)];
        errorEl.classList.remove('hidden');
        errorEl.style.animation = 'none';
        void errorEl.offsetWidth;
        errorEl.style.animation = 'shake 0.4s ease-in-out';

        // Mark the wrong button
        const btns = document.querySelectorAll('.choice-btn');
        if (btns[idx]) {
            btns[idx].classList.add('choice-wrong');
            setTimeout(() => btns[idx].classList.remove('choice-wrong'), 600);
        }
    }
}

function closePasswordModal() {
    document.getElementById('password-modal').classList.add('hidden');
    document.body.style.overflow = '';
    currentEnvelopeId = null;
}

// ==========================================
// SHOW ENVELOPE CONTENT
// ==========================================

function showEnvelopeContent(env) {
    const modal = document.getElementById('envelope-modal');
    const body = document.getElementById('modal-body');
    body.innerHTML = window[env.content]();
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    // Scroll to top of the modal content
    modal.scrollTop = 0;
    const modalContent = modal.querySelector('.modal-content');
    if (modalContent) modalContent.scrollTop = 0;

    // Fire confetti for the final envelope
    if (env.id === 'landing-tx' && typeof confetti === 'function') {
        setTimeout(() => fireConfetti(), 300);
    }
}

function closeModal() {
    document.getElementById('envelope-modal').classList.add('hidden');
    document.body.style.overflow = '';
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
            <p>My Sunny ☺️</p>
            <p>I can't believe this day is finally here! Do you remember our very first conversation?</p>
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
            <p>That reason has been counting down every single day... And today, that countdown finally hits zero 😊</p>
            <p>I'm so proud of you for finishing your summer, for spending beautiful time with your family, and for being patient!</p>
            <p>Now board that plane, enjoy our website, and know that someone in Texas is smiling like an idiot right now thinking about you 😊</p>
            <p>See you soon.</p>
        </div>
        <div class="message-signature">, Your KC ☀️</div>
    `;
}

function getMissMeContent() {
    return `
        <h2 class="section-title">I Miss You Too 🥹</h2>
        <div class="message-text">
            <p>자기야... 🥹</p>
            <p>If you're opening this, it means we're both feeling that same ache right now. Because wherever I am, whatever I'm doing, I'm feeling it too.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I just miss Texas a little bit. ☺️ I just have a lot of things waiting for me there.<div class="bubble-time">Jun 23</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>I'm sure whatever's waiting for you here in Texas is incredibly happy to hear that and is constantly counting down the days ☺️<div class="bubble-time">Jun 23</div></div>
        </div>
        <div class="message-text">
            <p>I miss you when I walk past flowers at the grocery store. I miss you at the Korean bar watching Korea play. I miss you when I eat my baby buldak alone. I miss you every time I record a voice message and wish I could just say it to your face.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble me"><span class="bubble-name">KC</span>It feels a little funny to say that I miss talking to you when that was our first genuine conversation in real time, but... I miss talking to you ☺️<div class="bubble-time">Jun 24</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>You're making it really hard not to miss you even more 😭😭<div class="bubble-time">Jun 25</div></div>
        </div>
        <div class="message-text">
            <p>But missing each other isn't a sad thing. It means we built something real across 10,000 miles. It means what we have matters to both of us equally. And every day apart is one day closer to together.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>It feels like we've known each other for much longer than we actually have!<div class="bubble-time">Jun 25</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>Why does it feel like I've already known you forever?<div class="bubble-time">Jun 25</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Haha, you're making the distance feel even longer now 🥲 But it'll make finally meeting each other even more exciting<div class="bubble-time">Jun 25</div></div>
        </div>
        <div class="message-text">
            <p>So when you miss me, close your eyes, press play, and know that I'm somewhere doing the same thing. Thinking of you. Counting down. Just like you are.</p>
            <p>我好想你 ☺️</p>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-babe-miss-you-chinese.opus')">▶</button>
            <div class="audio-info">
                <div class="audio-title">我好想你</div>
                <div class="audio-subtitle">The voice message you replayed 10 times</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="message-signature">, Your hands-in-the-pocket boy 🥹</div>
    `;
}

function getQuizContent() {
    quizScore = 0;
    quizAnswered = 0;
    return `
        <h2 class="section-title">How Well Do You Know KC? 🎮</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1.5rem; font-size:0.9rem;">17 questions. No cheating. Let's see what you've got 😤</p>
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
                "He eats spicy x2 buldak sauce like a true Korean 🔥",
                "He eats baby buldak only",
                "He once cried eating mild salsa",
                "He's secretly immune to all spice"
            ],
            correct: 0
        },
        {
            q: "What does KC do with his hands in every photo?",
            options: [
                "Peace sign like a true tourist ✌️",
                "Shoves them in his pockets because he's awkward",
                "Doesn't know what to do with them",
                "Both B and C"
            ],
            correct: 3
        },
        {
            q: "Why did KC carry a suitcase in one of his photoshoots?",
            options: [
                "He's always traveling",
                "There are snacks in the suitcase",
                "To avoid putting his hands in his pockets 😭",
                "He's just cool"
            ],
            correct: 2
        },
        {
            q: "Why did KC think he was an honorary Korean?",
            options: [
                "He looks Korean",
                "Owns more Buldak flavors than Sunny 😤",
                "Speaks better Korean than Sunny",
                "Secretly has a Korean passport"
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
            q: "We're basically _____ now",
            options: [
                '"BLACKPINK 🩷🖤"',
                '"Yin Yang"',
                '"Milk and Cookies"',
                '"Brother and Sister"'
            ],
            correct: 0
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
            q: "What did Sunny wear to church that embarrassed her sister?",
            options: [
                "Cap + Crocs with Jibbitz 🐊",
                "Pajamas",
                "Gym clothes",
                "Halloween costume"
            ],
            correct: 0
        },
        {
            q: "What insect did KC say 'actually tasted pretty good'?",
            options: [
                "Crickets 🦗",
                "Ants 🐜",
                "Scorpions 🦂",
                "He'd never eat insects (lies)"
            ],
            correct: 2
        },
        {
            q: "What image did KC traumatize Sunny with by telling her to Google it?",
            options: [
                "A spider",
                "Balut (developing duck egg) 🥚",
                "A centipede",
                "His morning hair"
            ],
            correct: 1
        },
        {
            q: "What does KC's hair look like fresh out of the shower?",
            options: [
                "A wet dog",
                "A mushroom 🍄",
                "A bird's nest",
                "Perfectly styled (as if)"
            ],
            correct: 1
        },
        {
            q: "KC breeds something as a hobby. What?",
            options: [
                "Fish 🐟",
                "Shrimps 🦐",
                "Snails 🐌",
                "Frogs 🐸"
            ],
            correct: 1
        },
        {
            q: "What drink does KC drink when he's sick (Malaysian style)?",
            options: [
                "Ginger tea",
                "100 Plus (isotonic drink)",
                "Hot lemon water",
                "Soju (for courage)"
            ],
            correct: 1
        },
        {
            q: "What Korean phrase did KC accidentally mess up and say 'garlic' instead?",
            options: [
                "I like you → garlic",
                "Goodnight → garlic",
                "You're pretty → onion",
                "Thank you → kimchi"
            ],
            correct: 0
        },
        {
            q: "KC said 'RED FLAG!!' about something. What was it?",
            options: [
                "She eats buldak 3x a week",
                "She can't cook",
                "She doesn't eat sashimi 🍣",
                "She sleeps at 4am"
            ],
            correct: 2
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

    if (quizAnswered === 17) {
        setTimeout(showQuizScore, 600);
    }
}

function showQuizScore() {
    const scoreCard = document.getElementById('quiz-score-card');
    const scoreNum = document.getElementById('quiz-final-score');
    const scoreText = document.getElementById('quiz-final-text');

    scoreNum.textContent = `${quizScore} / 17`;

    if (quizScore === 17) {
        scoreText.textContent = "You know me better than I know myself. Come here already 😭";
    } else if (quizScore >= 12) {
        scoreText.textContent = "Okay you've been paying attention... I see you 🤭";
    } else if (quizScore >= 7) {
        scoreText.textContent = "Were you even reading my messages?! 😤😤😤";
    } else {
        scoreText.textContent = "...Are you sure you're on the right flight? 🤣";
    }

    scoreCard.classList.remove('hidden');
    scoreCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function getBucketListContent() {
    return `
        <h2 class="section-title">Our Bucket List 🍜🌸</h2>
        <div class="message-text">
            <p>Are you excited to start our future together? </p> 
            <p>You better be ☺️ Every time you mentioned something you haven't done, something you want to try, or somewhere you want to go, it goes into our bucket list! ☺️ </p>
        </div>
        <div class="bucket-list">
            <div class="bucket-category">
                <div class="bucket-category-title">🍳 Food & Drink</div>
                <div class="bucket-item">Soondubu at Anyeoung Tofu (Austin) , TOP PRIORITY</div>
                <div class="bucket-item">Make soondubu together at home</div>
                <div class="bucket-item">Indian food , start you on medium spice</div>
                <div class="bucket-item">REAL tacos , carne asada, al pastor, lengua</div>
                <div class="bucket-item">Malaysian food , rendang (try making it together)</div>
                <div class="bucket-item">Haidilao in Austin</div>
                <div class="bucket-item">Hot Pot at home with friends... or if we're lazy.. Haidilao</div>
                <div class="bucket-item">Turkish delight and baklava </div>
                <div class="bucket-item">Durian</div>
                <div class="bucket-item">Spice challenge , your buldak vs my Indian food</div>
                <div class="bucket-item">Franklin BBQs</div>
                <div class="bucket-item">Terry Black</div>
                <div class="bucket-item">Korean BBQ where YOU cook</div>
                <div class="bucket-item">Late night Korean food run</div>
                <div class="bucket-item">HeyTea date</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">🎀 Activities & Dates</div>
                <div class="bucket-item">Bouldering / rock climbing</div>
                <div class="bucket-item">Six Flags San Antonio , tallest scariest rollercoaster</div>
                <div class="bucket-item">Skydiving (holding hands)</div>
                <div class="bucket-item">National park , White Sands or Big Bend</div>
                <div class="bucket-item">Ice skating date</div>
                <div class="bucket-item">Rollerblading (your first time)</div>
                <div class="bucket-item">Camping trip</div>
                <div class="bucket-item">Late night drive (you're passenger princess)</div>
                <div class="bucket-item">Sunset dinner at my apartment</div>
                <div class="bucket-item">Pool date , midnight by the pool just talking</div>
                <div class="bucket-item">Museum date</div>
                <div class="bucket-item">Board game night</div>
                <div class="bucket-item">IMAX movie together</div>
                <div class="bucket-item">Watch dating shows together</div>
                <div class="bucket-item">Matching couple Crocs with Jibbitz</div>
                <div class="bucket-item">Couple t-shirts / shoes</div>
                <div class="bucket-item">Dye hair together , me white, you blonde</div>
                <div class="bucket-item">Make slime/squishies together</div>
                <div class="bucket-item">Picnic with homemade gimbap and hwachae + your favorite flowers</div>
                <div class="bucket-item">Korean spa day</div>
                <div class="bucket-item">Apartment hunting date</div>
                <div class="bucket-item">Beach trip</div>
                <div class="bucket-item">PC bang / gaming date , watch you play League</div>
                <div class="bucket-item">Take the Attachment Styles quiz</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">� Travel</div>
                <div class="bucket-item">Paris + Disneyland (with my French friend, double date)</div>
                <div class="bucket-item">Disneyland</div>
                <div class="bucket-item">Korea , Ji Soo as our tour guide</div>
                <div class="bucket-item">Japan together</div>
                <div class="bucket-item">Europe trip</div>
                <div class="bucket-item">Visit Nacogdoches , explore together since you don't know all the spots either</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">💗 Milestones</div>
                <div class="bucket-item">Meet in Dallas , August 23/24</div>
                <div class="bucket-item">Celebrate 100th day</div>
                <div class="bucket-item">First home-cooked meal together</div>
                <div class="bucket-item">Write you a letter </div>
                <div class="bucket-item">Attend your next recital 🎻</div>
            </div>
            <div class="bucket-category">
                <div class="bucket-category-title">� Things I'll Stock For You</div>
                <div class="bucket-item">Buldak (original + rose)</div>
                <div class="bucket-item">Homerun ball, banana kick, turtle chips mala</div>
                <div class="bucket-item">Coke Zero</div>
                <div class="bucket-item">Chocolate desserts always in the fridge</div>
                <div class="bucket-item">Mint chocolate ice cream</div>
                <div class="bucket-item">Pink things that remind me of you</div>
                <div class="bucket-item">Thick blankets</div>
                <div class="bucket-item">Iced Americano supplies</div>
                <div class="bucket-item">Pocari Sweat</div>
                <div class="bucket-item">Squishies / stress toys</div>
                <div class="bucket-item">Couple Crocs + Jibbitz</div>
            </div>
        </div>
        <div class="message-text" style="margin-top:1.5rem;">
            <p>Every one of these has your name written on it. Let's start checking them off. ☺️</p>
        </div>
        <div class="message-signature">, KC 🗒️✨</div>
    `;
}

function getNervousContent() {
    return `
        <h2 class="section-title">Hey. I Know. Me Too. 🥺</h2>
        <div class="message-text">
            <p>Hey. I know what you're feeling right now, because I'm feeling the exact same thing.</p>
            <p>What if it's awkward? What if we run out of things to say? What if it doesn't feel the same in person?</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble me"><span class="bubble-name">KC</span>You seem so well dressed it kinda makes me nervous about meeting you hahaha!<div class="bubble-time">Jun 19</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Don't be nervous! I only dress up when I'm taking pictures. Most of the time I'm just wearing whatever is comfortable. 😌<div class="bubble-time">Jun 19</div></div>
        </div>
        <div class="message-text">
            <p>I've thought about all of that too. And here's what I keep coming back to: We talked until 3am the very first time we were online together. We never ran out of things to say across a 14-hour time difference.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I think this might be the first time we've actually been online and talking at the same time!<div class="bubble-time">Jun 23</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>I know ☺️ and yet someone just wants me gone 🥹<div class="bubble-time">Jun 23</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I don't want you gone. 😂 I just don't want to be responsible for your sleep schedule!<div class="bubble-time">Jun 23</div></div>
        </div>
        <div class="message-text">
            <p>If we could do all of that without ever being in the same room... imagine what it'll be like when we finally are.</p>
            <p>But also - if it IS a little awkward at first? That's okay. That's normal. We don't have to be perfect. We just have to be us.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble me"><span class="bubble-name">KC</span>I'm scared of heights, but maybe if we could hold hands through the most of it I'd be down to try<div class="bubble-time">Jun 24</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I think I'd be scared 😭😭 but maybe I'd be brave enough to try it if I had the right person with me<div class="bubble-time">Jun 24</div></div>
        </div>
        <div class="message-text">
            <p>I'm not expecting you to be the violin headshot version of yourself. I'm excited to meet the jet-lagged, ramen-eating, Crocs-wearing you. The real one.</p>
            <p>And I'll be honest - I'm going to be nervous too. My hands will be in my pockets. I might talk too fast.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Honestly, I was too busy looking at your face to notice where your hands were. 😂<div class="bubble-time">Jun 23</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>And honestly, I already feel really comfortable with you. I just wish we weren't so far apart right now. 🥺<div class="bubble-time">Jun 13</div></div>
        </div>
        <div class="message-text">
            <p>So take a breath. We've got this. Together. ☺️</p>
        </div>
        <div class="message-signature">- Your golden retriever, KC 🐕</div>
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
                <div class="timeline-text">You're going to Japan and to the EXACT same places I went last year.</div>
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
                <div class="timeline-text">Our first real-time conversation. I stayed up until 6am. You kept telling me to sleep... never going to happen!!</div>
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
        <div class="message-signature">, To be continued... in person ☺️</div>
    `;
}
function getVoiceContent() {
    return `
        <h2 class="section-title">Close Your Eyes, Press Play 🎧</h2>
        <div class="message-text">
            <p>All our voice notes in one place. Some are mine, some are yours. Close your eyes and pretend we're next to each other. ☺️</p>
        </div>
        <p style="text-align:center; color:#ff6b9d; font-weight:700; margin:1rem 0 0.5rem;">KC's voice 🎙️</p>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-babe-miss-you-chinese.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">寶貝,我好想你</div><div class="audio-subtitle">Baby, I miss you so much (Chinese)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-miss-you-chinese.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">我好想你</div><div class="audio-subtitle">I miss you so much (Chinese)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-miss-you-korean-solo.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">보고 싶어</div><div class="audio-subtitle">I miss you (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-youre-cute-mix.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기야, you're so cute</div><div class="audio-subtitle">English + Korean mix</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-i-really-like-you.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">I really like you, by the way</div><div class="audio-subtitle">English</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-youre-cute-chinese.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">寶貝,你太可愛了</div><div class="audio-subtitle">Baby, you're so cute (Chinese)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-all-i-want-is-you-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">내가 원하는 건 너 하나 밖에 없어</div><div class="audio-subtitle">All I want is only you (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-want-to-be-with-you-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">너랑 같이 있고 싶어</div><div class="audio-subtitle">I want to be with you (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-heart-only-for-you.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기야, my heart is only for you</div><div class="audio-subtitle">Korean + English mix</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-think-of-me-tonight-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">오늘 밤에 내 생각하면서 잘 거야?</div><div class="audio-subtitle">Will you think of me tonight? (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-thinking-of-you-miss-you-mix.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">네 생각 하고 있어, I miss you</div><div class="audio-subtitle">Thinking of you (Korean/English)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-you-are-most-beautiful.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">In the world, you are the most beautiful</div><div class="audio-subtitle">English</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-how-cheer-you-up-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">어떻게 하면 기분 풀어줄 수 있어?</div><div class="audio-subtitle">How can I cheer you up? (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-want-see-pretty-face-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기 예쁜 얼굴 보고 싶어</div><div class="audio-subtitle">I want to see your pretty face (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-good-morning-eat-salad.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">Good morning! Don't forget to eat salad today!</div><div class="audio-subtitle">English</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-sleep-well-good-dream.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">Sleep well, have a good dream</div><div class="audio-subtitle">English</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-goodnight-miss-you-mix.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기야, goodnight, I'll miss you</div><div class="audio-subtitle">Korean/English mix</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-miss-you-so-much-english.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">I miss you so much</div><div class="audio-subtitle">English</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-i-dont-like-you-teasing.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기야, 나 안 좋아해</div><div class="audio-subtitle">Babe, I don't like you (teasing 😤)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/kc-my-name-chinese.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">蔡光成</div><div class="audio-subtitle">KC saying his Chinese name</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <p style="text-align:center; color:#ff6b9d; font-weight:700; margin:1.5rem 0 0.5rem;">Sunny's voice ☀️</p>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-goodnight-so-happy.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">Good night. Thank you for making me so happy today.</div><div class="audio-subtitle">Her voice + 잘 자</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-miss-you-waiting-picture.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">I miss you so much because I've been waiting for your picture</div><div class="audio-subtitle">Her voice</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-i-like-you-even-more.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">I like you even more</div><div class="audio-subtitle">Her voice</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-practicing-my-name.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">蔡光成</div><div class="audio-subtitle">Her practicing KC's Chinese name</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-correcting-garlic.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">The garlic incident 🧄</div><div class="audio-subtitle">Her correcting KC's pronunciation</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-babe-im-shy-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기야 부끄러워</div><div class="audio-subtitle">Babe, I'm shy (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-babe-youre-cute-korean.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">자기야 너무 귀여워</div><div class="audio-subtitle">Babe, you're so cute (Korean)</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-are-you-miss-me.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">Are you miss me?</div><div class="audio-subtitle">Her cute broken English</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-your-voice-sexy.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">Baby, your voice is really sexy</div><div class="audio-subtitle">Her voice</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her-your-voice-comparison.opus')">▶</button>
            <div class="audio-info"><div class="audio-title">Your Chinese is deeper, English is sexier, Korean is cute</div><div class="audio-subtitle">Her ranking KC's voices</div></div>
            <div class="audio-waves"><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div></div>
        </div>
        <div class="message-text" style="margin-top:1.5rem;">
            <p>Your voice does the same thing to me. Every single one. On loop. ☺️</p>
        </div>
        <div class="message-signature">- KC 🎙️</div>
    `;
}

function getPhotosContent() {
    return `
        <h2 class="section-title">Our Photo Diary 📸</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1.5rem; font-size:0.85rem;">Every picture tells our story. Here are the ones that made my heart race.</p>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/violin-headshot.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/violin-professional.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/violin-her.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/practice-room.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/recital-after.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/spain-mallorca.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/mallorca-red-dress.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/ballet.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/ice-skating.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/skating-her.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/beach-her.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/beach-her-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/france-selfie.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/library-pink-skirt.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bunny-costume.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/earrings-pretty.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/her-with-friend.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/photobooth.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/changing-room.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/zara-fitting.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/church-no-crocs.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/her-crocs.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bikini-sticker.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/first-flowers.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/first-flowers-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/austin-begging-sticker.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/good-morning-spam.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/cat.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/tulips.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/smiling-me-fav.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/smiling-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/celebrity-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/photoshoot-short-hair.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/hokkaido-fav.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/hokkaido-golden-hour.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/hokkaido-touching-sun.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/hokkaido-failed-sun.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/japan-flowers.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/japan-flowers-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/japan-front-of-garden.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/kamui-rock.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/alpaca-flirt.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/alpaca-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/chongqing-valley.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/chongqing-fog.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/houston-friends.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/houston-cool.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/prada-marfa.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/prada-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/singapore-hair.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/silly-chair-sticker.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/onion-apple-sticker.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/cute-sticker.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/soft-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/car-selfie-nervous.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/car-white-hat.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/pimple-patch.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/grandpa-emulate.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/gym-selfie.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/gym.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/too-thin-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/big-bend-1.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/big-bend-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/new-york-friends.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/new-york-solo.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/portland-friends.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/pre-portland-crew.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/sapporo-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/mt-fuji-morning.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/stone-hedge-pose.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/shrimp-cracker.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/neverseen-farm-tomita-road.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/neverseen-hakodate-road.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/neverseen-photoshoot.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/neverseen-wedding-suit.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/kc-cowboy.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/posing-1.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/old-school.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/funny-shirt.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/petting-dog.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/my-seung-cup.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/misidentified.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/suit.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/jollibee.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/drunk-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/drunk-me-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/drunk-me-3.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/pimple-patch (2).jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/apple (2).jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260615-WA0005.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260615-WA0009.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260622-WA0000.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260628-WA0015.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260710-WA0008.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260719-WA0026.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260722-WA0051.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260722-WA0058.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260723-WA0002.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260724-WA0017.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260724-WA0020.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260724-WA0021.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260727-WA0016.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260727-WA0029.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/IMG-20260806-WA0009.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div class="message-text" style="margin-top:1.5rem;">
            <p>Every single photo you sent me is saved. Every video replayed dozens of times. Every sticker screenshot'd and smiled at.</p>
            <p>I can't wait to fill our camera rolls with photos of us together. Starting very, very soon. ☺️</p>
        </div>
        <div class="message-signature">, KC 📷</div>
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
        <div class="message-signature">, Your honorary Korean 🇰🇷<br>original buldak level: kids' edition<br>hands-in-pockets champion<br>golden retriever<br>자기야's KC ❤️</div>
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
            <p>We're here.</p>
            <p>Not 14 hours apart. Not behind a screen. Not a voice message replayed at 4am. Not a countdown on a phone.</p>
            <p>Us. Right here. Together.</p>
            <p>Everything since June 11th led to this. Every text, every voice note, every late night where neither of us wanted to say goodnight, every sticker war, every "go to sleep!" that got ignored... it was all building to this exact moment.</p>
            <p>72 days. Thousands of messages. One timezone. And now... zero distance.</p>
        </div>
        <div class="audio-player">
            <button class="audio-play-btn" onclick="playAudio(this, 'audio/her practicing my name.opus')">▶</button>
            <div class="audio-info">
                <div class="audio-title">For us, right now ☺️</div>
                <div class="audio-subtitle">Press play together.</div>
            </div>
            <div class="audio-waves">
                <div class="bar"></div><div class="bar"></div><div class="bar"></div>
                <div class="bar"></div><div class="bar"></div><div class="bar"></div><div class="bar"></div>
            </div>
        </div>
        <div class="message-text">
            <p>Our paths crossed in Sapporo without us knowing. They crossed again in Austin. And now they don't have to cross anymore... because they finally merged.</p>
            <p>이제 시작이야. This is just the beginning. And there's nobody else in the world I'd rather start it with. ☺️</p>
        </div>
        <div style="text-align:center; margin-top:2rem; padding:1.5rem; background:linear-gradient(135deg,#fff0f5,#ffeef8); border-radius:16px;">
            <div style="font-family:'Caveat',cursive; font-size:1.2rem; color:#ff6b9d; margin-bottom:0.5rem;">Our first ✓</div>
            <div style="font-size:1rem; color:#4a3040; text-decoration:line-through; opacity:0.7;">☐ Our first hug</div>
            <div style="font-size:1rem; color:#4a3040; font-weight:700; margin-top:0.25rem;">☑️ Done. Finally. ☺️</div>
        </div>
        <div class="message-signature">, Us. Finally here. ❤️</div>
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
        // Audio file not found , show placeholder behavior
        btn.textContent = '▶';
        wavesEl.classList.remove('playing');
    });

    currentAudio.addEventListener('ended', () => {
        btn.textContent = '▶';
        wavesEl.classList.remove('playing');
    });
}

// ==========================================
// BONUS CONTENT , "Never Seen" Photo Unlocks
// ==========================================

function getBathroomContent() {
    return `
        <h2 class="section-title">The Bathroom Selfie Era 🪞</h2>
        <div class="message-text">
            <p>It all started when I hid my bathroom stuff behind emojis. Then you asked the question that started it all...</p>
        </div>
        <div class="photo-collage">
        <div class="photo-item">
            <img src="photos/bathroom-selfies/hiding-early.jpg" alt="">
            <div class="photo-caption"><!-- CAPTION --></div>
        </div>
        <div class="photo-item">
            <img src="photos/bathroom-selfies/hiding-game-og.jpg" alt="">
            <div class="photo-caption"><!-- CAPTION --></div>
        </div>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Whats in your porcket?!<div class="bubble-time">Jul 27</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>Omg<div class="bubble-time">Jul 27</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>I need more stickers in my picture next time hahaha<div class="bubble-time">Jul 27</div></div>
        </div>
        <div class="photo-collage">
        <div class="photo-item">
            <img src="photos/bathroom-selfies/hiding-mentos.jpg" alt="">
            <div class="photo-caption"><!-- CAPTION --></div>
        </div>
        <div class="photo-item">
            <img src="photos/bathroom-selfies/hiding-pocket.jpg" alt="">
            <div class="photo-caption"><!-- CAPTION --></div>
        </div>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble me"><span class="bubble-name">KC</span>What's in your pocket?!<div class="bubble-time">Jul 28</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I didnt hide anything<div class="bubble-time">Jul 28</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Unlike you<div class="bubble-time">Jul 28</div></div>
        </div>
        <div class="message-text">
            <p>But you knew well enough that I could never hide things from you... </p>
        </div>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/bathroom-selfies/hiding-snacks-ac.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/hiding-ginger-ale.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/hiding-1a.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/hiding-1b.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div class="message-text">
            <p>You've always been quite an analyzer... I love that whenever I sent you pictures.. I could always expect you to disappear for 10 minutes 🤣</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Dont worry I saw your handsome face too And I noticed your hand in your pocket as well 🤭<div class="bubble-time">Jun 28</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>I'm sooooo maaadd hahahaha i forgot about the hands in the pocket 😭😭😭<div class="bubble-time">Jun 28</div></div>
        </div>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/bathroom-selfies/bathroom.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/corgi-shirt.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/work-cap-lazy.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/banana-republic-jacket.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/sticker-no-phone.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/IMG-20260718-WA0016.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/IMG-20260721-WA0009.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/IMG-20260727-WA0022.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/IMG-20260803-WA0012.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/bathroom-selfies/IMG-20260810-WA0006.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div class="message-text">
            <p>But these became one of my favorite past times... to purposely hide things around the area or in my pockets for you to spot! Can you still spot all of them without me pointing them out? 🤣</p>
        </div>
        <div class="message-signature">, The guy who can't hide anything from you 😤</div>
    `;
}

function getCrossedPathsContent() {
    return `
        <h2 class="section-title">Where Our Paths Crossed ✨</h2>
        <div class="message-text">
            <p>Separated by 100 miles before we met when you were at Nacododghes... 10,000 miles after we started talking when you returned to Korea for the summer... but yet... fate played a funny trick on us by bringing us to two of the same exact locations in Japan, one year apart...</p>
            <p>Same places. Different years. One fate that kept pushing us closer until today.</p>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>I think this might be the same place! 😄<div class="bubble-time">Jun 17</div></div>
            <div class="chat-bubble me"><span class="bubble-name">KC</span>Hahaha OMG yes i think so?!?! You must've been to the farm tomita?!?! The lavender/melon ice cream?<div class="bubble-time">Jun 17</div></div>
        </div>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/when-we-crossed-paths/blue-pond-her.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <div class="locked-photo" onclick="unlockPhoto(this, 'bluepond-cross-q')">
                    <img src="photos/when-we-crossed-paths/blue-pond-me-neverseen.jpg" alt="">
                    <div class="locked-photo-overlay">
                        <span class="lock-emoji">🔒</span>
                        <p>Tap to unlock</p>
                    </div>
                </div>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div id="bluepond-cross-q" class="photo-question hidden"><div class="photo-question-inner">
            <p style="font-weight:700; margin-bottom:0.8rem;">How many months apart were we at the Blue Pond?</p>
            <div class="choices-grid">
                <button class="choice-btn" onclick="checkPhotoAnswer(this, false)">6 months</button>
                <button class="choice-btn" onclick="checkPhotoAnswer(this, true)">12 months</button>
                <button class="choice-btn" onclick="checkPhotoAnswer(this, false)">3 months</button>
            </div>
        </div></div>
        <div class="chat-bubbles">
            <div class="chat-bubble me"><span class="bubble-name">KC</span>OMG that's so pretty 🙂 both you and the pond!! It feels so weird that you're at the exact same place as i was last year...<div class="bubble-time">Jun 17</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>And you're right… it's kind of wild to think we could've crossed paths without even knowing it. 😆✨<div class="bubble-time">Jun 17</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Yes, exactly! Farm Tomita! I couldn't remember the name, so in my head it was just "the lavender field." 😭<div class="bubble-time">Jun 17</div></div>
        </div>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/when-we-crossed-paths/farm-tomita-sign.jpg?v=2" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/when-we-crossed-paths/farm-tomita-icecream-her.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/when-we-crossed-paths/farm-tomita-icecream-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/when-we-crossed-paths/farm-tomita-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div class="chat-bubbles">
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>And honestly, I was really happy to find out we'd visited the same places. It felt like our paths crossed, even if it was a year apart.<div class="bubble-time">Jun 19</div></div>
            <div class="chat-bubble her"><span class="bubble-name">Sunny ☀️</span>Maybe we're meant to be 😊<div class="bubble-time">Jun 24</div></div>
        </div>
        <div class="message-text" style="margin-top:1rem;">
            <p>Yet in the end, fate was kind on us because it finally brought you to Texas ☺️</p>
        </div>
        <div class="message-signature">, Your Sapporo boy ✨</div>
    `;
}

function getYoungMeContent() {
    return `
        <h2 class="section-title">Young KC 👶</h2>
        <div class="message-text">
            <p>You asked for this. No refunds. No takebacks. This is the helmet hair era.</p>
        </div>
        <div class="photo-collage">
            <div class="photo-item">
                <img src="photos/young-me/young-me.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/young-me/young-me-2.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/young-me/young-me-3.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="photo-item">
                <img src="photos/young-me/young-helmet-hair.jpg" alt="">
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div class="message-text" style="margin-top:1rem;">
            <p>I peaked late. But I peaked for you. 🥹</p>
        </div>
        <div class="message-signature">, Helmet hair KC 🪖</div>
    `;
}

function getVideosContent() {
    return `
        <h2 class="section-title">Our Videos 🎬</h2>
        <div class="message-text">
            <p>Press play. Close your eyes. Remember us.</p>
        </div>
        <div class="video-gallery">
            <div class="video-item">
                <video src="videos/vid-her-flowers-thank-you.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-her-slime.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-her-bowling.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-her-skating-fall.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-board-game-voice.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-pool-texting.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-birthday.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-hair-styling-sexy.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-hair-styling-full.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-hair-pimple-patch.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-korean-encouragement.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-singapore-friends.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/vid-funny-shirt.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260626-WA0011.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260626-WA0016.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260626-WA0019.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260626-WA0022.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260627-WA0003.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260627-WA0004.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260627-WA0006.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260628-WA0041.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260629-WA0024.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260705-WA0011.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260705-WA0012.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260711-WA0003.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260718-WA0031.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260718-WA0034.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260718-WA0035.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260718-WA0037.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260720-WA0001.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260722-WA0039.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260803-WA0029.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260804-WA0005.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260805-WA0002.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260805-WA0003.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260807-WA0016.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260807-WA0018.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
            <div class="video-item">
                <video src="videos/VID-20260808-WA0030.mp4" controls preload="none"></video>
                <div class="photo-caption"><!-- CAPTION --></div>
            </div>
        </div>
        <div class="message-signature">, KC 🎬</div>
    `;
}

// ==========================================
// TIMELINE CONTENT
// ==========================================

function getTimelineContent() {
    return `
        <h2 class="section-title">Our Story 📅</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1.5rem; font-size:0.85rem;">June 11 to August 23. Every moment that led us here.</p>
        <div class="timeline">
            <div class="timeline-item"><div class="timeline-date">Jun 11</div><div class="timeline-text">"Hi! It's me. Sunny! 😊" - it all begins</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 12</div><div class="timeline-text">"Drink a good boba tea for me please 🥹"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 13</div><div class="timeline-text">First midnight texts. Neither wants to stop.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 14</div><div class="timeline-text">Pink is her color. Noted forever.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 15</div><div class="timeline-text">She leaves for Japan. Tulips at the grocery store.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 17</div><div class="timeline-text">Blue Pond. Farm Tomita. Paths crossed one year apart.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 18</div><div class="timeline-text">World Cup night. Korea vs Mexico. Somi Somi after.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 21</div><div class="timeline-text">The violin headshot drops. "OHHHH MYYY GOOOSSHHH"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 23</div><div class="timeline-text">First real-time chat. 3am-6am. "Wrong answer!! 😤"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 24</div><div class="timeline-text">Prada Marfa. "Was that suitcase to avoid pockets?"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 25</div><div class="timeline-text">"Why does it feel like I've already known you forever?"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 26</div><div class="timeline-text">Board game night. Codenames champion.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jun 28</div><div class="timeline-text">Hair styling at midnight. "Your hair looks so cool!"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 3</div><div class="timeline-text">First voice messages. "I miss you 🥹"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 5</div><div class="timeline-text">KC sick, eats buldak anyway. "You shouldn't eat ramen when you're sick!!"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 6</div><div class="timeline-text">The suit photo. "WOW 🤩 Damnnn" Hands still in pockets.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 7</div><div class="timeline-text">Mom hid her Alo pants. Mushroom hair confession.</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 10</div><div class="timeline-text">"Why are you hiding these pictures from me!! 😭"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 13</div><div class="timeline-text">She called him 자기야 for the first time</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 18</div><div class="timeline-text">First Korean voice note exchange</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 26</div><div class="timeline-text">Sticker war begins. Bikini sticker incident. "I hate you 😤"</div></div>
            <div class="timeline-item"><div class="timeline-date">Jul 27</div><div class="timeline-text">"Whats in your porcket?!" - a game is born</div></div>
            <div class="timeline-item"><div class="timeline-date">Aug 9</div><div class="timeline-text">"We're both just as lucky we crossed paths ❤️"</div></div>
            <div class="timeline-item"><div class="timeline-date">Aug 23</div><div class="timeline-text">✈️ The countdown hits zero.</div></div>
        </div>
        <div class="message-text" style="margin-top:1.5rem;">
            <p>74 days. Thousands of messages. One timezone away from forever. ☺️</p>
        </div>
        <div class="message-signature">- KC 📅</div>
    `;
}

// ==========================================
// STICKERS CONTENT
// ==========================================

function getStickersContent() {
    return `
        <h2 class="section-title">Our Sticker Collection 🎨</h2>
        <div class="message-text">
            <p>You turned us into stickers. Some I love. Some I hate. All of them make me smile.</p>
        </div>
        <div class="sticker-grid">
            <div class="sticker-item"><img src="stickers/sticker-apple-me.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-are-you-kidding.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-bikini-hair.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-cute-me.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-her-bikini.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-her-red-dress.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-hungry-feed-me.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-me-no-phone.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-puff-hair.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-send-pictures.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker-silly-chair-pout.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker1.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker2.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/sticker3.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260726-WA0045.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260727-WA0046.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260729-WA0012.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260730-WA0006.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260730-WA0027.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260730-WA0028.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260802-WA0034.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260803-WA0005.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260803-WA0006.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260803-WA0008.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260805-WA0017.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260805-WA0018.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260805-WA0027.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
            <div class="sticker-item"><img src="stickers/STK-20260805-WA0044.webp" alt=""><div class="photo-caption"><!-- CAPTION --></div></div>
        </div>
        <div class="message-signature">- The guy you keep turning into stickers 😤</div>
    `;
}

// ==========================================
// CROSSWORD CONTENT
// ==========================================

function getCrosswordContent() {
    const grid = [
        // 12 cols x 10 rows
        // P=pockets, BULDAK, SAPPORO, LAVENDER, PINK, BOBA, VIOLIN, CODENAMES
        [' ',' ',' ','P',' ',' ',' ',' ',' ',' ',' ',' '],
        [' ',' ',' ','O',' ','B',' ',' ',' ',' ',' ',' '],
        [' ','B','U','L','D','A','K',' ',' ',' ',' ',' '],
        [' ',' ',' ','L',' ','V',' ',' ',' ',' ',' ',' '],
        ['S','A','P','P','O','R','O',' ',' ',' ',' ',' '],
        [' ',' ',' ','O',' ','N',' ',' ',' ',' ',' ',' '],
        [' ',' ','P','I','N','K',' ',' ',' ',' ',' ',' '],
        [' ',' ',' ','N',' ',' ',' ',' ',' ',' ',' ',' '],
        [' ','V','I','O','L','I','N',' ',' ',' ',' ',' '],
        ['C','O','D','E','N','A','M','E','S',' ',' ',' '],
    ];

    const clues = {
        across: [
            { num: 3, clue: "The spicy noodles she eats 3x a week (6)", row: 2, col: 1 },
            { num: 5, clue: "City in Japan where our paths crossed (7)", row: 4, col: 0 },
            { num: 7, clue: "Her favorite color (4)", row: 6, col: 2 },
            { num: 9, clue: "Her instrument (6)", row: 8, col: 1 },
            { num: 10, clue: "The board game KC always wins (9)", row: 9, col: 0 },
        ],
        down: [
            { num: 1, clue: "Where KC's hands always are (7)", row: 0, col: 3 },
            { num: 2, clue: "The ice cream flavor at Farm Tomita (8)", row: 1, col: 5 },
        ]
    };

    let gridHTML = '<div class="crossword-grid">';
    for (let r = 0; r < grid.length; r++) {
        for (let c = 0; c < grid[r].length; c++) {
            const letter = grid[r][c];
            if (letter === ' ') {
                gridHTML += '<div class="cw-cell cw-blank"></div>';
            } else {
                // Check if this cell starts a word
                let num = '';
                for (const cl of [...clues.across, ...clues.down]) {
                    if (cl.row === r && cl.col === c) num = cl.num;
                }
                gridHTML += '<div class="cw-cell cw-active" data-answer="' + letter + '">' +
                    (num ? '<span class="cw-num">' + num + '</span>' : '') +
                    '<input type="text" maxlength="1" class="cw-input" autocomplete="off" autocapitalize="characters">' +
                    '</div>';
            }
        }
    }
    gridHTML += '</div>';

    let clueHTML = '<div class="cw-clues"><div class="cw-clue-section"><strong>Across</strong>';
    clues.across.forEach(c => { clueHTML += '<div class="cw-clue">' + c.num + '. ' + c.clue + '</div>'; });
    clueHTML += '</div><div class="cw-clue-section"><strong>Down</strong>';
    clues.down.forEach(c => { clueHTML += '<div class="cw-clue">' + c.num + '. ' + c.clue + '</div>'; });
    clueHTML += '</div></div>';

    return `
        <h2 class="section-title">Our Crossword ✏️</h2>
        <p style="text-align:center; color:#8b6b7a; margin-bottom:1rem; font-size:0.85rem;">Fill in the puzzle about us. Tap Check when you're done!</p>
        ${gridHTML}
        ${clueHTML}
        <button class="unlock-btn" style="margin-top:1rem;" onclick="checkCrossword()">Check ✏️</button>
        <p id="cw-result" style="text-align:center; margin-top:0.8rem; font-weight:700; color:#ff6b9d;"></p>
    `;
}

function checkCrossword() {
    const cells = document.querySelectorAll('.cw-cell.cw-active');
    let correct = 0;
    let total = cells.length;
    cells.forEach(cell => {
        const input = cell.querySelector('.cw-input');
        const answer = cell.dataset.answer;
        if (input.value.toUpperCase() === answer) {
            cell.style.background = '#e8f5e9';
            correct++;
        } else if (input.value) {
            cell.style.background = '#fff0f0';
        }
    });
    const result = document.getElementById('cw-result');
    if (correct === total) {
        result.textContent = "You got them all!! 💗";
    } else {
        result.textContent = correct + ' / ' + total + ' correct. Keep trying! 😤';
    }
}

// ==========================================
// VIDEO - pause others when one plays
// ==========================================

document.addEventListener('play', function(e) {
    if (e.target.tagName === 'VIDEO') {
        var videos = document.querySelectorAll('video');
        videos.forEach(function(v) {
            if (v !== e.target && !v.paused) v.pause();
        });
    }
}, true);

// ==========================================
// IMAGE VIEWER , tap photo to view fullscreen
// ==========================================

document.addEventListener('click', function (e) {
    var img = e.target;
    if (img.tagName !== 'IMG') {
        var item = e.target.closest('.photo-item');
        if (item) img = item.querySelector('img');
        else return;
    }
    if (!img || !img.closest('#modal-body')) return;
    // Don't open blurred locked photos
    if (img.closest('.locked-photo') && !img.closest('.locked-photo').classList.contains('unlocked')) return;

    var viewer = document.createElement('div');
    viewer.className = 'img-viewer';
    viewer.innerHTML = '<img src="' + img.src + '" alt="">';
    viewer.addEventListener('click', function () { viewer.remove(); });
    document.body.appendChild(viewer);
});

// ==========================================
// LOCKED PHOTO , blur until question answered
// ==========================================

function unlockPhoto(photoEl, questionId) {
    if (photoEl.classList.contains('unlocked')) return;
    var q = document.getElementById(questionId);
    if (!q) return;
    // Show as a centered popup
    q.classList.remove('hidden');
}

function checkPhotoAnswer(btn, isCorrect) {
    if (isCorrect) {
        var questionDiv = btn.closest('.photo-question');
        // Find the locked photo by ID reference
        var photoId = questionDiv.id.replace('-q', '');
        var allLocked = document.querySelectorAll('.locked-photo');
        allLocked.forEach(function (lp) {
            if (lp.getAttribute('onclick') && lp.getAttribute('onclick').indexOf(questionDiv.id) !== -1) {
                lp.classList.add('unlocked');
            }
        });
        questionDiv.classList.add('hidden');
    } else {
        btn.classList.add('choice-wrong');
        setTimeout(function () { btn.classList.remove('choice-wrong'); }, 600);
    }
}

// ==========================================
// BUCKET LIST , tappable checkboxes
// ==========================================

(function () {
    var checked = JSON.parse(localStorage.getItem('bucketChecked') || '[]');

    document.addEventListener('click', function (e) {
        var item = e.target.closest('.bucket-item');
        if (!item) return;

        var text = item.textContent.trim();
        var idx = checked.indexOf(text);
        if (idx === -1) {
            checked.push(text);
            item.classList.add('checked');
        } else {
            checked.splice(idx, 1);
            item.classList.remove('checked');
        }
        localStorage.setItem('bucketChecked', JSON.stringify(checked));
    });

    // Restore checked state when modal content loads
    var observer = new MutationObserver(function () {
        var items = document.querySelectorAll('.bucket-item');
        items.forEach(function (item) {
            if (checked.indexOf(item.textContent.trim()) !== -1) {
                item.classList.add('checked');
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
