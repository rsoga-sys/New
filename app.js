// ===== English Communication - Pronunciation Practice App =====

(function () {
  'use strict';

  // ===== Constants =====
  const LEVEL_TITLES = [
    'ビギナー',       // 1
    'ルーキー',       // 2
    'トレーニー',     // 3
    'スピーカー',     // 4
    'トーカー',       // 5
    'ナレーター',     // 6
    'アーティスト',   // 7
    'エキスパート',   // 8
    'マスター',       // 9
    'レジェンド',     // 10+
  ];

  const ACHIEVEMENTS = [
    { id: 'first_try',      icon: '\u{1F3AF}', name: '初挑戦',           desc: '初めて発音を練習した',            check: s => s.totalPractices >= 1 },
    { id: 'ten_practices',  icon: '\u{1F4AA}', name: '練習熱心',         desc: '10回練習した',                    check: s => s.totalPractices >= 10 },
    { id: 'fifty_practices', icon: '\u{1F525}', name: '努力の達人',      desc: '50回練習した',                    check: s => s.totalPractices >= 50 },
    { id: 'hundred_club',   icon: '\u{1F3C6}', name: '100回クラブ',      desc: '100回練習した',                   check: s => s.totalPractices >= 100 },
    { id: 'perfect_score',  icon: '\u{2B50}',  name: 'パーフェクト',     desc: 'スコア100%を達成した',            check: s => s.bestScore >= 100 },
    { id: 'score_90',       icon: '\u{1F31F}', name: '発音上手',         desc: 'スコア90%以上を達成した',          check: s => s.bestScore >= 90 },
    { id: 'streak_3',       icon: '\u{1F525}', name: '3日連続',          desc: '3日連続で練習した',               check: s => s.maxStreak >= 3 },
    { id: 'streak_7',       icon: '\u{26A1}',  name: '1週間連続',        desc: '7日連続で練習した',               check: s => s.maxStreak >= 7 },
    { id: 'streak_30',      icon: '\u{1F48E}', name: '1ヶ月連続',        desc: '30日連続で練習した',              check: s => s.maxStreak >= 30 },
    { id: 'level_5',        icon: '\u{1F451}', name: 'トーカー',         desc: 'レベル5に到達した',               check: s => s.level >= 5 },
    { id: 'level_10',       icon: '\u{1F3C5}', name: 'レジェンド',       desc: 'レベル10に到達した',              check: s => s.level >= 10 },
    { id: 'perfect_3',      icon: '\u{1F947}', name: 'パーフェクト三連', desc: 'パーフェクトを3回達成した',        check: s => s.perfectCount >= 3 },
    { id: 'xp_1000',        icon: '\u{1F4B0}', name: 'XPマスター',       desc: '累計1000XPを獲得した',            check: s => s.totalXp >= 1000 },
    { id: 'multilingual',   icon: '\u{1F30D}', name: '多言語チャレンジ', desc: '3種類以上の言語で練習した',        check: s => s.languagesUsed >= 3 },
  ];

  const SCORE_LABELS = [
    { min: 100, label: 'パーフェクト!', cls: 'score-perfect' },
    { min: 80,  label: 'すばらしい!',   cls: 'score-great' },
    { min: 60,  label: 'いい調子!',     cls: 'score-good' },
    { min: 40,  label: 'もう少し!',     cls: 'score-ok' },
    { min: 0,   label: 'がんばろう!',   cls: 'score-poor' },
  ];

  const ENCOURAGEMENT = [
    '何度も練習すると上達します!',
    '繰り返しが力になります!',
    '前回より良くなっています!',
    '諦めずに続けましょう!',
    '一つずつ確実に!',
  ];

  // ===== Pronunciation Advice Database =====
  const PRONUNCIATION_TIPS = {
    'the': { phonetic: '/ðə/ or /ðiː/', tip: '舌先を上の前歯の裏に軽く当て、声を出しながら「ザ」と発音します。日本語の「ザ」とは異なり、舌と歯の間から空気を出す「th」の音を意識しましょう。' },
    'this': { phonetic: '/ðɪs/', tip: '「th」は舌先を上の前歯に当てて振動させます。「ディス」ではなく、舌を噛むような感覚で発音しましょう。' },
    'that': { phonetic: '/ðæt/', tip: '「th」の音に注意。舌先を歯の間に出して発音します。「ザット」ではありません。' },
    'think': { phonetic: '/θɪŋk/', tip: '無声の「th」です。舌先を上の前歯に当て、息だけを出します。「シンク」ではなく、舌を歯に当てる感覚を意識しましょう。' },
    'three': { phonetic: '/θriː/', tip: '「th」は舌先を歯に当てて息を出します。「スリー」ではなく、舌を使った「θ」の音を出しましょう。' },
    'through': { phonetic: '/θruː/', tip: '「th」の無声音から始めます。舌先を歯に当ててから「ルー」に繋げます。' },
    'with': { phonetic: '/wɪð/', tip: '最後の「th」は有声音です。舌先を歯の間に出して振動させます。' },
    'world': { phonetic: '/wɜːrld/', tip: '「ワールド」ではなく、唇を丸めて「wɜːr」と発音し、舌を巻いて「ld」を付けます。「r」と「l」の区別が重要です。' },
    'right': { phonetic: '/raɪt/', tip: '「r」は舌を口の奥に引いて丸め、どこにも触れずに発音します。「ライト」の「ラ」とは舌の位置が異なります。' },
    'light': { phonetic: '/laɪt/', tip: '「l」は舌先を上の前歯の裏（歯茎）にしっかりつけて発音します。「r」と混同しないように注意しましょう。' },
    'really': { phonetic: '/ˈriːəli/', tip: '最初の「r」は舌をどこにも触れずに発音します。日本語の「リ」とは異なる音です。' },
    'very': { phonetic: '/ˈveri/', tip: '「v」は上の前歯で下唇を軽く噛んで振動させます。「ベリー」ではなく「ヴェリー」に近い音です。' },
    'love': { phonetic: '/lʌv/', tip: '「v」は下唇に上の歯を当てて振動させます。「ラブ」ではなく、最後を「ヴ」で終えましょう。' },
    'have': { phonetic: '/hæv/', tip: '最後の「v」は下唇を上の歯に当てて声を出します。「ハブ」ではありません。' },
    'of': { phonetic: '/ʌv/', tip: '「オブ」ではなく「アヴ」に近い発音です。「f」ではなく「v」の有声音で終わります。' },
    'would': { phonetic: '/wʊd/', tip: '「l」は発音しません。「ウッド」のように唇を丸めて「wʊd」と発音します。' },
    'could': { phonetic: '/kʊd/', tip: '「l」は発音しません。「クッド」のように発音します。' },
    'should': { phonetic: '/ʃʊd/', tip: '「l」は発音しません。「シュッド」のように発音します。' },
    'although': { phonetic: '/ɔːlˈðoʊ/', tip: '「th」は有声音です。舌先を歯の間に出して振動させ、「オール・ゾウ」のように発音します。' },
    'woman': { phonetic: '/ˈwʊmən/', tip: '「ウーマン」ではなく「ウマン」に近い発音です。最初の母音は短い「ʊ」です。' },
    'women': { phonetic: '/ˈwɪmɪn/', tip: '「ウィメン」ではなく「ウィミン」に近い発音です。「o」を「ɪ」と発音するのが特徴です。' },
    'comfortable': { phonetic: '/ˈkʌmftəbl/', tip: '4音節ではなく3音節で発音します。「カンフタブル」のように「or」を省略した発音が自然です。' },
    'vegetable': { phonetic: '/ˈvedʒtəbl/', tip: '4音節ではなく3音節で発音します。「ヴェジタブル」のように短縮して発音します。' },
    'temperature': { phonetic: '/ˈtemprətʃər/', tip: '4音節ではなく3音節で発音します。「テンプラチャー」のように中間の母音を省略します。' },
    'often': { phonetic: '/ˈɔːfn/', tip: '「t」は発音しない場合が多いです。「オーフン」のように発音します。' },
    'asked': { phonetic: '/æskt/', tip: '3つの子音「skt」が続きます。「アスクト」ではなく、スムーズに「æskt」と繋げましょう。' },
    'months': { phonetic: '/mʌnθs/', tip: '最後の「ths」は舌を歯に当てたまま「s」を加えます。難しい場合は「mʌnts」でも通じます。' },
    'clothes': { phonetic: '/kloʊðz/', tip: '「クローゼス」ではなく「クロウズ」に近い1音節の発音です。' },
    'island': { phonetic: '/ˈaɪlənd/', tip: '「s」は発音しません。「アイランド」と読みます。' },
    'Wednesday': { phonetic: '/ˈwenzdeɪ/', tip: '「d」は発音しません。「ウェンズデイ」と発音します。' },
    'February': { phonetic: '/ˈfebjueri/', tip: '最初の「r」は省略されることが多く、「フェビュエリ」のように発音します。' },
    'library': { phonetic: '/ˈlaɪbreri/', tip: '「ライブラリー」ではなく「ライブレリー」に近い発音です。' },
    'pronunciation': { phonetic: '/prəˌnʌnsiˈeɪʃn/', tip: '「プロナウンシエーション」ではなく「プロナンシエイション」です。「noun」ではなく「nun」の音に注意。' },
    'comfortable': { phonetic: '/ˈkʌmftərbl/', tip: '「コンフォータブル」ではなく「カンフタブル」と3音節で発音します。' },
    'interesting': { phonetic: '/ˈɪntrəstɪŋ/', tip: '4音節ではなく3音節で「イントゥレスティング」のように発音するのが自然です。' },
    'different': { phonetic: '/ˈdɪfrənt/', tip: '3音節ではなく2音節で「ディフレント」のように発音するのが自然です。' },
    'chocolate': { phonetic: '/ˈtʃɒklət/', tip: '3音節ではなく2音節で「チョクレット」のように発音します。' },
    'business': { phonetic: '/ˈbɪznəs/', tip: '「ビジネス」ではなく「ビズネス」に近い2音節の発音です。' },
    'schedule': { phonetic: '/ˈskedʒuːl/', tip: 'アメリカ英語では「スケジュール」、イギリス英語では「シェジュール」と発音します。' },
    'particularly': { phonetic: '/pərˈtɪkjələrli/', tip: '音節が多いので、「パティキュラリー」のように中間の音を省略しがちですが、「r」の音を意識しましょう。' },
    'literally': { phonetic: '/ˈlɪtərəli/', tip: '「リテラリー」のように4音節で発音します。「t」を軽い「d」のように発音するとより自然です。' },
    'environment': { phonetic: '/ɪnˈvaɪrənmənt/', tip: '「エンバイロンメント」のように、「v」の音を正しく出し、「n」で終わることに注意しましょう。' },
    'determine': { phonetic: '/dɪˈtɜːrmɪn/', tip: '最後の「e」は発音しません。「ディターミン」のように3音節で発音します。' },
    'a': { phonetic: '/ə/ or /eɪ/', tip: '通常は弱く「ア」と発音しますが、強調する場合は「エイ」と発音します。' },
    'an': { phonetic: '/ən/', tip: '弱く「アン」と発音します。次の単語と繋げて自然に発音しましょう。' },
    'are': { phonetic: '/ɑːr/', tip: '「アー」と伸ばす音です。会話では弱く「アr」のように発音されることが多いです。' },
    'were': { phonetic: '/wɜːr/', tip: '「ワー」ではなく「ウァー」に近い発音です。唇を軽く丸めて発音します。' },
    'our': { phonetic: '/aʊr/', tip: '「アワー」のように二重母音で発音します。「アー」だけにならないよう注意しましょう。' },
    'their': { phonetic: '/ðɛr/', tip: '「ゼアー」のように発音します。「th」の有声音を忘れずに。' },
    'there': { phonetic: '/ðɛr/', tip: '「ゼアー」。「th」は舌先を歯の間に出して振動させます。' },
    'where': { phonetic: '/wɛr/', tip: '「ウェア」のように発音します。「wh」は「w」の音で始めます。' },
    'what': { phonetic: '/wʌt/', tip: '「ホワット」ではなく「ワット」に近い発音です。「wh」は「w」の音です。' },
    'who': { phonetic: '/huː/', tip: '「フー」のように発音します。「w」は発音しません。' },
    'how': { phonetic: '/haʊ/', tip: '「ハウ」と二重母音で発音します。口を大きく開けて「a」から「u」に移動します。' },
  };

  // ===== Generic pronunciation tips by pattern =====
  function getGenericTip(word) {
    const lower = word.toLowerCase();

    if (lower.match(/th/)) {
      return { phonetic: null, tip: '「th」の音が含まれています。舌先を上の前歯に当てて発音しましょう。有声音（the, this）か無声音（think, three）かを意識してください。' };
    }
    if (lower.match(/^r/) || lower.match(/r[aeiou]/)) {
      return { phonetic: null, tip: '「r」の音に注意しましょう。舌を口の奥に引いて丸め、どこにも触れないようにして発音します。日本語の「ラ行」とは異なります。' };
    }
    if (lower.match(/^l/) || lower.match(/l[aeiou]/)) {
      return { phonetic: null, tip: '「l」の音に注意しましょう。舌先を上の歯茎にしっかりつけて発音します。「r」と区別することが重要です。' };
    }
    if (lower.match(/v/)) {
      return { phonetic: null, tip: '「v」の音が含まれています。上の前歯で下唇を軽く噛み、振動させて発音します。「b」の音とは異なります。' };
    }
    if (lower.match(/f/)) {
      return { phonetic: null, tip: '「f」の音が含まれています。上の前歯で下唇を軽く噛み、息だけを出します。「h」の音とは異なります。' };
    }
    if (lower.match(/wh/)) {
      return { phonetic: null, tip: '「wh」は通常「w」の音で発音します。唇を丸めて前に突き出すようにしましょう。' };
    }
    if (lower.match(/tion$|sion$/)) {
      return { phonetic: null, tip: '語尾の「-tion/-sion」は「ション」と発音します。アクセントはその直前の音節に置くことが多いです。' };
    }
    if (lower.match(/ght$/)) {
      return { phonetic: null, tip: '語尾の「-ght」の「gh」は発音しません。「t」の音だけになります。' };
    }
    if (lower.match(/ous$/)) {
      return { phonetic: null, tip: '語尾の「-ous」は「アス」のように軽く発音します。' };
    }
    if (lower.match(/[aeiou]{2,}/)) {
      return { phonetic: null, tip: '連続する母音に注意しましょう。英語では母音の組み合わせで特別な音になることがあります。ゆっくり正しい音を確認してみてください。' };
    }

    return { phonetic: null, tip: 'この単語の発音を確認しましょう。お手本の発音を聞いて、もう一度チャレンジしてみてください。' };
  }

  // ===== State =====
  let state = loadState();
  let recognition = null;
  let isRecording = false;
  let currentUtterance = null;

  // ===== DOM Elements =====
  const $ = id => document.getElementById(id);
  const $$ = sel => document.querySelectorAll(sel);

  const dom = {
    streakCount: $('streakCount'),
    levelNum: $('levelNum'),
    xpText: $('xpText'),
    xpFill: $('xpFill'),
    levelTitle: $('levelTitle'),
    langSelect: $('langSelect'),
    targetText: $('targetText'),
    recordBtn: $('recordBtn'),
    recordStatus: $('recordStatus'),
    recognizedContainer: $('recognizedContainer'),
    recognizedText: $('recognizedText'),
    pulseRing: $('pulseRing'),
    resultsSection: $('resultsSection'),
    scoreNumber: $('scoreNumber'),
    scoreFill: $('scoreFill'),
    scoreLabel: $('scoreLabel'),
    wordAnalysis: $('wordAnalysis'),
    feedback: $('feedback'),
    xpGained: $('xpGained'),
    xpGainedAmount: $('xpGainedAmount'),
    retryBtn: $('retryBtn'),
    newTextBtn: $('newTextBtn'),
    historyList: $('historyList'),
    clearHistoryBtn: $('clearHistoryBtn'),
    achievementsList: $('achievementsList'),
    totalPractices: $('totalPractices'),
    avgScore: $('avgScore'),
    bestScore: $('bestScore'),
    totalXp: $('totalXp'),
    maxStreak: $('maxStreak'),
    perfectCount: $('perfectCount'),
    scoreChart: $('scoreChart'),
    levelUpModal: $('levelUpModal'),
    newLevelDisplay: $('newLevelDisplay'),
    newTitleDisplay: $('newTitleDisplay'),
    closeLevelUp: $('closeLevelUp'),
    achievementModal: $('achievementModal'),
    achievementIcon: $('achievementIcon'),
    achievementName: $('achievementName'),
    achievementDesc: $('achievementDesc'),
    closeAchievement: $('closeAchievement'),
    confetti: $('confetti'),
    toast: $('toast'),
    scoreCircle: $('scoreCircle'),
    playModelBtn: $('playModelBtn'),
    pronunciationAdvice: $('pronunciationAdvice'),
    adviceList: $('adviceList'),
  };

  // ===== Initialization =====
  function init() {
    initSpeechRecognition();
    initSpeechSynthesis();
    bindEvents();
    updateUI();
    updateStreak();
    renderAchievements();
    renderStats();
    renderHistory();
  }

  // ===== State Management =====
  function loadState() {
    const saved = localStorage.getItem('speakquest_state');
    const defaults = {
      level: 1,
      xp: 0,
      totalXp: 0,
      streak: 0,
      maxStreak: 0,
      lastPracticeDate: null,
      totalPractices: 0,
      bestScore: 0,
      perfectCount: 0,
      totalScore: 0,
      history: [],
      unlockedAchievements: [],
      languagesUsed: [],
    };
    if (saved) {
      try {
        return { ...defaults, ...JSON.parse(saved) };
      } catch (e) {
        return defaults;
      }
    }
    return defaults;
  }

  function saveState() {
    localStorage.setItem('speakquest_state', JSON.stringify(state));
  }

  // ===== Speech Recognition Setup =====
  function initSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      dom.recordStatus.textContent = 'お使いのブラウザは音声認識に対応していません。Chrome推奨です。';
      dom.recordBtn.disabled = true;
      return;
    }

    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isRecording = true;
      dom.recordBtn.classList.add('recording');
      dom.pulseRing.classList.add('active');
      dom.recordStatus.textContent = '聞いています... 話してください';
      dom.recognizedContainer.style.display = 'block';
      dom.recognizedText.textContent = '...';
      dom.resultsSection.style.display = 'none';
    };

    recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      dom.recognizedText.textContent = finalTranscript || interimTranscript;
    };

    recognition.onend = () => {
      isRecording = false;
      dom.recordBtn.classList.remove('recording');
      dom.pulseRing.classList.remove('active');
      dom.recordStatus.textContent = 'マイクボタンを押して録音';

      const recognized = dom.recognizedText.textContent.trim();
      if (recognized && recognized !== '...') {
        analyzeAndScore(recognized);
      } else {
        dom.recordStatus.textContent = '音声が認識できませんでした。もう一度お試しください。';
      }
    };

    recognition.onerror = (event) => {
      isRecording = false;
      dom.recordBtn.classList.remove('recording');
      dom.pulseRing.classList.remove('active');
      if (event.error === 'no-speech') {
        dom.recordStatus.textContent = '音声が検出されませんでした。もう一度お試しください。';
      } else if (event.error === 'not-allowed') {
        dom.recordStatus.textContent = 'マイクへのアクセスが許可されていません。ブラウザの設定を確認してください。';
      } else {
        dom.recordStatus.textContent = 'エラーが発生しました: ' + event.error;
      }
    };
  }

  // ===== Speech Synthesis (Model Audio) =====
  function initSpeechSynthesis() {
    if (!('speechSynthesis' in window)) {
      dom.playModelBtn.style.display = 'none';
      return;
    }
  }

  function playModelAudio() {
    const text = dom.targetText.value.trim();
    if (!text) return;

    // Stop any current speech
    if (window.speechSynthesis.speaking) {
      window.speechSynthesis.cancel();
      dom.playModelBtn.classList.remove('playing');
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = dom.langSelect.value;
    utterance.rate = 0.85;
    utterance.pitch = 1.0;

    // Try to find a good voice for the language
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = dom.langSelect.value.split('-')[0];
    const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix) && v.localService === false)
      || voices.find(v => v.lang.startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    utterance.onstart = () => {
      dom.playModelBtn.classList.add('playing');
    };

    utterance.onend = () => {
      dom.playModelBtn.classList.remove('playing');
      currentUtterance = null;
    };

    utterance.onerror = () => {
      dom.playModelBtn.classList.remove('playing');
      currentUtterance = null;
    };

    currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  function speakWord(word) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = dom.langSelect.value;
    utterance.rate = 0.7;
    utterance.pitch = 1.0;

    const voices = window.speechSynthesis.getVoices();
    const langPrefix = dom.langSelect.value.split('-')[0];
    const matchingVoice = voices.find(v => v.lang.startsWith(langPrefix) && v.localService === false)
      || voices.find(v => v.lang.startsWith(langPrefix));
    if (matchingVoice) {
      utterance.voice = matchingVoice;
    }

    window.speechSynthesis.speak(utterance);
  }

  // ===== Event Bindings =====
  function bindEvents() {
    // Target text input
    dom.targetText.addEventListener('input', () => {
      const hasText = dom.targetText.value.trim().length > 0;
      dom.recordBtn.disabled = !hasText || !recognition;
      dom.playModelBtn.disabled = !hasText || !('speechSynthesis' in window);
      dom.recordStatus.textContent = hasText ? 'マイクボタンを押して録音' : '文章を入力してください';
    });

    // Play model audio button
    dom.playModelBtn.addEventListener('click', playModelAudio);

    // Ensure voices are loaded
    if ('speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = () => {
        // Voices loaded, button is ready
      };
    }

    // Record button
    dom.recordBtn.addEventListener('click', () => {
      if (!recognition) return;
      if (isRecording) {
        recognition.stop();
      } else {
        recognition.lang = dom.langSelect.value;
        try {
          recognition.start();
        } catch (e) {
          dom.recordStatus.textContent = '録音を開始できませんでした。もう一度お試しください。';
        }
      }
    });

    // Sample sentences
    $$('.sample-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        dom.targetText.value = btn.dataset.text;
        dom.targetText.dispatchEvent(new Event('input'));
      });
    });

    // Retry
    dom.retryBtn.addEventListener('click', () => {
      dom.resultsSection.style.display = 'none';
      dom.recognizedContainer.style.display = 'none';
      dom.recordStatus.textContent = 'マイクボタンを押して録音';
    });

    // New text
    dom.newTextBtn.addEventListener('click', () => {
      dom.targetText.value = '';
      dom.targetText.dispatchEvent(new Event('input'));
      dom.resultsSection.style.display = 'none';
      dom.recognizedContainer.style.display = 'none';
      dom.targetText.focus();
    });

    // Tab navigation
    $$('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        $$('.tab').forEach(t => t.classList.remove('active'));
        $$('.tab-content').forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.dataset.tab;
        $(target + 'Tab').classList.add('active');

        if (target === 'history') renderHistory();
        if (target === 'achievements') renderAchievements();
        if (target === 'stats') renderStats();
      });
    });

    // Clear history
    dom.clearHistoryBtn.addEventListener('click', () => {
      if (confirm('練習履歴をすべて削除しますか?')) {
        state.history = [];
        saveState();
        renderHistory();
        showToast('履歴を削除しました');
      }
    });

    // Modals
    dom.closeLevelUp.addEventListener('click', () => {
      dom.levelUpModal.style.display = 'none';
    });
    dom.closeAchievement.addEventListener('click', () => {
      dom.achievementModal.style.display = 'none';
    });
  }

  // ===== Pronunciation Analysis =====
  function analyzeAndScore(recognized) {
    const target = dom.targetText.value.trim();
    const targetWords = normalizeText(target).split(/\s+/).filter(Boolean);
    const recognizedWords = normalizeText(recognized).split(/\s+/).filter(Boolean);

    // Compute word-level matching using LCS
    const { matches, wordResults } = compareWords(targetWords, recognizedWords);

    // Calculate score
    const score = targetWords.length > 0
      ? Math.round((matches / targetWords.length) * 100)
      : 0;

    // Display results
    displayResults(score, wordResults, target, recognized);

    // Update state
    const xpEarned = calculateXP(score);
    addXP(xpEarned);

    // Track language used
    const lang = dom.langSelect.value;
    if (!state.languagesUsed.includes(lang)) {
      state.languagesUsed.push(lang);
    }

    // Update stats
    state.totalPractices++;
    state.totalScore += score;
    if (score > state.bestScore) state.bestScore = score;
    if (score === 100) state.perfectCount++;

    // Update streak
    updateStreak();

    // Add to history
    state.history.unshift({
      id: Date.now(),
      target: target,
      recognized: recognized,
      score: score,
      xp: xpEarned,
      lang: lang,
      date: new Date().toISOString(),
    });

    // Keep history at most 200 entries
    if (state.history.length > 200) {
      state.history = state.history.slice(0, 200);
    }

    saveState();
    updateUI();

    // Check achievements
    checkAchievements();
  }

  function normalizeText(text) {
    return text
      .toLowerCase()
      .replace(/[.,!?;:'"()\-\u3001\u3002\u300C\u300D\uFF01\uFF1F]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function compareWords(targetWords, recognizedWords) {
    // Build LCS table for word-level alignment
    const m = targetWords.length;
    const n = recognizedWords.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));

    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        if (targetWords[i - 1] === recognizedWords[j - 1]) {
          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
        }
      }
    }

    // Backtrack to find matched words
    const matchedTargetIndices = new Set();
    let i = m, j = n;
    while (i > 0 && j > 0) {
      if (targetWords[i - 1] === recognizedWords[j - 1]) {
        matchedTargetIndices.add(i - 1);
        i--;
        j--;
      } else if (dp[i - 1][j] > dp[i][j - 1]) {
        i--;
      } else {
        j--;
      }
    }

    const wordResults = targetWords.map((word, idx) => ({
      word: word,
      correct: matchedTargetIndices.has(idx),
    }));

    return {
      matches: matchedTargetIndices.size,
      wordResults: wordResults,
    };
  }

  // ===== Display Results =====
  function displayResults(score, wordResults, target, recognized) {
    dom.resultsSection.style.display = 'block';

    // Animate score circle
    const circumference = 2 * Math.PI * 54; // r=54
    const offset = circumference - (score / 100) * circumference;
    const scoreInfo = SCORE_LABELS.find(s => score >= s.min);

    // Reset for animation
    dom.scoreFill.style.transition = 'none';
    dom.scoreFill.style.strokeDashoffset = circumference;
    dom.scoreNumber.textContent = '0';
    dom.scoreLabel.textContent = '';
    dom.scoreLabel.className = 'score-label';

    // Set color based on score
    const strokeColor = score >= 100 ? '#F59E0B'
      : score >= 80 ? '#10B981'
      : score >= 60 ? '#2563EB'
      : score >= 40 ? '#F59E0B'
      : '#EF4444';
    dom.scoreFill.style.stroke = strokeColor;

    // Trigger animation
    requestAnimationFrame(() => {
      dom.scoreFill.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
      dom.scoreFill.style.strokeDashoffset = offset;

      // Animate number
      animateNumber(dom.scoreNumber, 0, score, 1200);

      setTimeout(() => {
        dom.scoreLabel.textContent = scoreInfo.label;
        dom.scoreLabel.classList.add(scoreInfo.cls);
      }, 800);
    });

    // XP gained display
    const xp = calculateXP(score);
    dom.xpGainedAmount.textContent = xp;
    dom.xpGained.style.display = 'block';

    // Word analysis
    dom.wordAnalysis.innerHTML = '';
    wordResults.forEach(wr => {
      const chip = document.createElement('span');
      chip.className = 'word-chip ' + (wr.correct ? 'word-correct' : 'word-incorrect');
      chip.textContent = wr.word;
      dom.wordAnalysis.appendChild(chip);
    });

    // Pronunciation advice for incorrect words
    const incorrectWords = wordResults.filter(w => !w.correct).map(w => w.word);
    displayPronunciationAdvice(incorrectWords);

    // Feedback
    const correctCount = wordResults.filter(w => w.correct).length;
    const totalWords = wordResults.length;
    const encouragement = ENCOURAGEMENT[Math.floor(Math.random() * ENCOURAGEMENT.length)];

    let feedbackHTML = `<strong>${correctCount} / ${totalWords}</strong> 単語が正確に発音されました。<br>`;
    if (incorrectWords.length > 0) {
      feedbackHTML += `<br>改善が必要な単語: <strong>${incorrectWords.join(', ')}</strong><br>`;
    }
    if (score === 100) {
      feedbackHTML += '<br>完璧です! 素晴らしい発音でした!';
    } else {
      feedbackHTML += `<br>${encouragement}`;
    }
    dom.feedback.innerHTML = feedbackHTML;

    // Scroll to results
    setTimeout(() => {
      dom.resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);
  }

  // ===== Display Pronunciation Advice =====
  function displayPronunciationAdvice(incorrectWords) {
    if (incorrectWords.length === 0) {
      dom.pronunciationAdvice.style.display = 'none';
      return;
    }

    dom.pronunciationAdvice.style.display = 'block';
    dom.adviceList.innerHTML = '';

    // Show advice for up to 5 words to keep it manageable
    const wordsToAdvise = incorrectWords.slice(0, 5);

    wordsToAdvise.forEach(word => {
      const lower = word.toLowerCase();
      const tip = PRONUNCIATION_TIPS[lower] || getGenericTip(lower);

      const item = document.createElement('div');
      item.className = 'advice-item';

      let html = `<div class="advice-word">${escapeHTML(word)}</div>`;
      if (tip.phonetic) {
        html += `<div class="advice-phonetic">${escapeHTML(tip.phonetic)}</div>`;
      }
      html += `<div class="advice-tip">${escapeHTML(tip.tip)}</div>`;
      html += `<button class="advice-listen-btn" data-word="${escapeHTML(word)}">&#x1F50A; 発音を聞く</button>`;

      item.innerHTML = html;
      dom.adviceList.appendChild(item);

      // Add click handler for the listen button
      item.querySelector('.advice-listen-btn').addEventListener('click', (e) => {
        e.preventDefault();
        speakWord(e.target.dataset.word || word);
      });
    });

    if (incorrectWords.length > 5) {
      const more = document.createElement('div');
      more.style.cssText = 'font-size: 0.8rem; color: #64748B; text-align: center; margin-top: 8px;';
      more.textContent = `他 ${incorrectWords.length - 5} 単語もお手本の発音で確認しましょう`;
      dom.adviceList.appendChild(more);
    }
  }

  function animateNumber(el, from, to, duration) {
    const start = performance.now();
    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      el.textContent = Math.round(from + (to - from) * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ===== XP & Leveling =====
  function calculateXP(score) {
    let xp = Math.round(score * 0.5); // base: 0-50 XP
    if (score === 100) xp += 30;      // perfect bonus
    if (score >= 90) xp += 15;        // great bonus
    // Streak bonus
    if (state.streak >= 7) xp = Math.round(xp * 1.5);
    else if (state.streak >= 3) xp = Math.round(xp * 1.2);
    return Math.max(xp, 5); // minimum 5 XP
  }

  function xpForLevel(level) {
    return 80 + (level - 1) * 40; // 80, 120, 160, 200...
  }

  function addXP(amount) {
    state.xp += amount;
    state.totalXp += amount;

    // Check for level up
    let levelsGained = 0;
    while (state.xp >= xpForLevel(state.level)) {
      state.xp -= xpForLevel(state.level);
      state.level++;
      levelsGained++;
    }

    if (levelsGained > 0) {
      showLevelUp(state.level);
    }
  }

  function getLevelTitle(level) {
    const idx = Math.min(level - 1, LEVEL_TITLES.length - 1);
    return LEVEL_TITLES[idx];
  }

  // ===== Streak =====
  function updateStreak() {
    const today = new Date().toDateString();
    const lastDate = state.lastPracticeDate;

    if (lastDate === today) {
      // Already practiced today, no change
      return;
    }

    if (lastDate) {
      const last = new Date(lastDate);
      const diff = Math.floor((new Date(today) - last) / (1000 * 60 * 60 * 24));
      if (diff === 1) {
        state.streak++;
      } else if (diff > 1) {
        state.streak = 1;
      }
    } else {
      state.streak = 1;
    }

    state.lastPracticeDate = today;
    if (state.streak > state.maxStreak) {
      state.maxStreak = state.streak;
    }
    saveState();
  }

  // ===== Achievements =====
  function checkAchievements() {
    const statsForCheck = {
      totalPractices: state.totalPractices,
      bestScore: state.bestScore,
      maxStreak: state.maxStreak,
      level: state.level,
      perfectCount: state.perfectCount,
      totalXp: state.totalXp,
      languagesUsed: state.languagesUsed.length,
    };

    for (const ach of ACHIEVEMENTS) {
      if (!state.unlockedAchievements.includes(ach.id) && ach.check(statsForCheck)) {
        state.unlockedAchievements.push(ach.id);
        saveState();
        showAchievementUnlock(ach);
        return; // Show one at a time
      }
    }
  }

  // ===== UI Rendering =====
  function updateUI() {
    dom.streakCount.textContent = state.streak;
    dom.levelNum.textContent = state.level;
    dom.levelTitle.textContent = getLevelTitle(state.level);

    const xpNeeded = xpForLevel(state.level);
    dom.xpText.textContent = `${state.xp} / ${xpNeeded} XP`;
    dom.xpFill.style.width = `${(state.xp / xpNeeded) * 100}%`;
  }

  function renderHistory() {
    if (state.history.length === 0) {
      dom.historyList.innerHTML = '<p class="empty-message">まだ練習履歴がありません</p>';
      return;
    }

    dom.historyList.innerHTML = state.history.map(item => {
      const date = new Date(item.date);
      const dateStr = `${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      const scoreInfo = SCORE_LABELS.find(s => item.score >= s.min);
      const langLabel = dom.langSelect.querySelector(`option[value="${item.lang}"]`);
      const langName = langLabel ? langLabel.textContent : item.lang;

      return `
        <div class="history-item" data-id="${item.id}">
          <div class="history-left">
            <div class="history-text">${escapeHTML(item.target)}</div>
            <div class="history-meta">
              <span>${dateStr}</span>
              <span>${langName}</span>
              <span>+${item.xp} XP</span>
            </div>
          </div>
          <div class="history-score ${scoreInfo.cls}">${item.score}%</div>
        </div>
      `;
    }).join('');

    // Click to load into practice
    dom.historyList.querySelectorAll('.history-item').forEach(el => {
      el.addEventListener('click', () => {
        const id = parseInt(el.dataset.id);
        const item = state.history.find(h => h.id === id);
        if (item) {
          dom.targetText.value = item.target;
          dom.targetText.dispatchEvent(new Event('input'));
          dom.langSelect.value = item.lang;
          // Switch to practice tab
          $$('.tab').forEach(t => t.classList.remove('active'));
          $$('.tab-content').forEach(c => c.classList.remove('active'));
          $$('.tab')[0].classList.add('active');
          $('practiceTab').classList.add('active');
          showToast('文章を読み込みました。再チャレンジしましょう!');
        }
      });
    });
  }

  function renderAchievements() {
    dom.achievementsList.innerHTML = ACHIEVEMENTS.map(ach => {
      const unlocked = state.unlockedAchievements.includes(ach.id);
      return `
        <div class="achievement-card ${unlocked ? 'unlocked' : 'locked'}">
          <span class="icon">${ach.icon}</span>
          <div class="name">${ach.name}</div>
          <div class="desc">${ach.desc}</div>
        </div>
      `;
    }).join('');
  }

  function renderStats() {
    dom.totalPractices.textContent = state.totalPractices;
    dom.avgScore.textContent = state.totalPractices > 0
      ? Math.round(state.totalScore / state.totalPractices) + '%'
      : '0%';
    dom.bestScore.textContent = state.bestScore + '%';
    dom.totalXp.textContent = state.totalXp;
    dom.maxStreak.textContent = state.maxStreak + '日';
    dom.perfectCount.textContent = state.perfectCount;

    // Score distribution chart
    renderScoreChart();
  }

  function renderScoreChart() {
    const buckets = [
      { label: '0-19', min: 0, max: 19, count: 0, color: '#EF4444' },
      { label: '20-39', min: 20, max: 39, count: 0, color: '#EF4444' },
      { label: '40-59', min: 40, max: 59, count: 0, color: '#F59E0B' },
      { label: '60-79', min: 60, max: 79, count: 0, color: '#2563EB' },
      { label: '80-99', min: 80, max: 99, count: 0, color: '#10B981' },
      { label: '100', min: 100, max: 100, count: 0, color: '#F59E0B' },
    ];

    state.history.forEach(item => {
      for (const b of buckets) {
        if (item.score >= b.min && item.score <= b.max) {
          b.count++;
          break;
        }
      }
    });

    const maxCount = Math.max(...buckets.map(b => b.count), 1);

    dom.scoreChart.innerHTML = buckets.map(b => {
      const height = (b.count / maxCount) * 100;
      return `
        <div class="chart-bar-container">
          <div class="chart-bar" style="height: ${Math.max(height, 3)}%; background: ${b.color};"
               title="${b.label}: ${b.count}回"></div>
          <div class="chart-label">${b.label}</div>
        </div>
      `;
    }).join('');
  }

  // ===== Modals & Notifications =====
  function showLevelUp(level) {
    dom.newLevelDisplay.textContent = `Lv. ${level}`;
    dom.newTitleDisplay.textContent = getLevelTitle(level);
    dom.levelUpModal.style.display = 'flex';
    spawnConfetti();
  }

  function showAchievementUnlock(ach) {
    // Delay slightly so it doesn't overlap with level up
    setTimeout(() => {
      dom.achievementIcon.textContent = ach.icon;
      dom.achievementName.textContent = ach.name;
      dom.achievementDesc.textContent = ach.desc;
      dom.achievementModal.style.display = 'flex';
    }, dom.levelUpModal.style.display === 'flex' ? 2000 : 300);
  }

  function showToast(message) {
    dom.toast.textContent = message;
    dom.toast.classList.add('show');
    setTimeout(() => dom.toast.classList.remove('show'), 2500);
  }

  function spawnConfetti() {
    dom.confetti.innerHTML = '';
    const colors = ['#2563EB', '#60A5FA', '#10B981', '#F59E0B', '#EF4444', '#93C5FD'];
    for (let i = 0; i < 40; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = Math.random() * 0.8 + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.width = (Math.random() * 6 + 4) + 'px';
      piece.style.height = (Math.random() * 6 + 4) + 'px';
      dom.confetti.appendChild(piece);
    }
  }

  // ===== Utility =====
  function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  // ===== Start =====
  document.addEventListener('DOMContentLoaded', init);
})();
