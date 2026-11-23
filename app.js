// World News Detective — editable learning-framework draft.
// All pupil input is kept in memory for this open browser tab only.
// No external scripts, analytics, cookies, logins, or submission server.
(() => {
  'use strict';

  const one = (selector, parent = document) => parent.querySelector(selector);
  const all = (selector, parent = document) => [...parent.querySelectorAll(selector)];
  const state = {
    page: 'home', completed: new Set(), predictions: [],
    nickname: '', avatar: '✦', quizScore: null, culture: null, badges: new Set()
  };
  const stages = ['warmup', 'malaysia', 'newzealand', 'quiz', 'culture', 'exit'];
  const keys = {
    a: {country:'Malaysia', day:'Thursday', place:'hall', event:'Culture Sharing Day'},
    b: {country:'New Zealand', day:'Friday', place:'library', event:'Family Stories Day'}
  };
  const questions = [
    {q:'Report A: What did families teach?', opts:['Traditional games','Swimming lessons','Computer coding','Football rules'], answer:0},
    {q:'Report A: What did pupils make after the event?', opts:['A birthday cake','Thank-you cards in English','A school garden','Paper airplanes'], answer:1},
    {q:'Report A: Who said, “We learn when we listen to each other”?', opts:['Ruby','A visitor','Miss Lim','The headmaster'], answer:2},
    {q:'Report B: What did pupils teach one another?', opts:['Greetings in different languages','How to bake bread','New sports rules','How to draw maps'], answer:0},
    {q:'Report B: What did teams make?', opts:['Paper crowns','School uniforms','Colourful posters about respect','A new library'], answer:2},
    {q:'Report B: Where was Family Stories Day held?', opts:['At the sports field','In the library','In the school hall','At the beach'], answer:1}
  ];

  const passportPassed = {a:false,b:false};
  const soundPassed = {a:false,b:false};
  let cultureSorterPassed = false;
  let cultureReflectionPassed = false;
  function awardBadge(badge, message) {
    if (state.badges.has(badge)) return;
    state.badges.add(badge);
    const stamp = one('#badge-' + badge);
    if (stamp) { stamp.classList.add('earned');stamp.setAttribute('aria-label','Earned: ' + stamp.querySelector('b').textContent); }
    one('#stamp-message').textContent = '⭐ Badge earned! ' + message + ' (' + state.badges.size + ' of 4 stamps).';
  }
  function setCompleted(stage) {
    if (stages.includes(stage)) state.completed.add(stage);
    const done = state.completed.size;
    one('#progress-number').textContent = `${done} / 6`;
    one('#progress-fill').style.width = `${done / 6 * 100}%`;
    one('#progress-bar').setAttribute('aria-valuenow', String(done));
    all('.nav-link').forEach(btn => btn.classList.toggle('completed', state.completed.has(btn.dataset.page)));
  }
  // Lightweight teacher-only presentation gate. GitHub Pages is a static site,
  // so a password written in public JavaScript is NEVER real authentication.
  const TEACHER_DEMO_PASSWORD = 'vivica123';
  const teacherGate = one('#teacher-gate');
  let teacherUnlocked = false;
  let previousTeacherFocus = null;
  function showTeacherGate() {
    previousTeacherFocus = document.activeElement;
    one('#teacher-gate-password').value = '';
    one('#teacher-gate-error').textContent = '';
    teacherGate.hidden = false;
    one('#teacher-gate-password').focus();
  }
  function closeTeacherGate() {
    teacherGate.hidden = true;
    one('#teacher-gate-password').value = '';
    one('#teacher-gate-error').textContent = '';
    if (previousTeacherFocus?.focus) previousTeacherFocus.focus();
  }
  function navigate(page) {
    if (!one('#page-' + page)) return;
    if (page === 'teacher' && !teacherUnlocked) {
      showTeacherGate();
      return;
    }
    state.page = page;
    all('.page').forEach(el => el.classList.toggle('active', el.id === 'page-' + page));
    all('.nav-link').forEach(btn => {
      const active = btn.dataset.page === page;
      btn.classList.toggle('active', active);
      if (active) btn.setAttribute('aria-current', 'page');
      else btn.removeAttribute('aria-current');
    });
    one('.teacher-link').classList.toggle('active', page === 'teacher');
    window.scrollTo({top:0, behavior:'instant'});
    // Focus the new page title for screen-reader and keyboard navigation.
    const heading = one('#page-' + page + ' h1');
    if (heading) {
      heading.setAttribute('tabindex', '-1');
      heading.focus({preventScroll:true});
    }
  }
  all('[data-page], [data-go], [data-page-link]').forEach(btn => btn.addEventListener('click', e => {
    e.preventDefault();
    navigate(btn.dataset.page || btn.dataset.go || btn.dataset.pageLink);
  }));
  one('#teacher-gate-form').addEventListener('submit', event => {
    event.preventDefault();
    if (one('#teacher-gate-password').value === TEACHER_DEMO_PASSWORD) {
      teacherUnlocked = true;
      closeTeacherGate();
      navigate('teacher');
    } else {
      one('#teacher-gate-error').textContent = 'Incorrect password. Please try again.';
      one('#teacher-gate-password').select();
    }
  });
  one('#teacher-gate-close').addEventListener('click', closeTeacherGate);
  one('#teacher-gate-cancel').addEventListener('click', closeTeacherGate);
  teacherGate.addEventListener('click', event => {
    if (event.target === teacherGate) closeTeacherGate();
  });
  teacherGate.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeTeacherGate();
    }
    if (event.key === 'Tab') {
      const targets = all('button:not([disabled]), input:not([disabled])', teacherGate);
      const first = targets[0], last = targets[targets.length - 1];
      if (event.shiftKey && document.activeElement === first) {event.preventDefault(); last.focus();}
      else if (!event.shiftKey && document.activeElement === last) {event.preventDefault(); first.focus();}
    }
  });
  one('#teacher-lock').addEventListener('click', () => {
    teacherUnlocked = false;
    navigate('home');
  });
  one('#how-it-works').addEventListener('click', () => {
    one('.learning-banner').scrollIntoView({behavior:'smooth', block:'center'});
  });

  // Optional nickname/avatar, with no storage or online registration.
  const modal = one('#profile-modal');
  let selectedAvatar = '✦';
  function closeModal() { modal.hidden = true; one('#profile-button').focus(); }
  one('#profile-button').addEventListener('click', () => {
    modal.hidden = false; one('#nickname').focus();
  });
  one('#modal-close').addEventListener('click', closeModal);
  one('#profile-skip').addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !modal.hidden) closeModal();
    // Keep keyboard focus inside the open dialog.
    if (e.key === 'Tab' && !modal.hidden) {
      const elements = all('button:not([disabled]), input:not([disabled])', modal);
      const first = elements[0], last = elements[elements.length - 1];
      if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
      else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
    }
  });
  all('[data-avatar]').forEach(btn => btn.addEventListener('click', () => {
    selectedAvatar = btn.dataset.avatar;
    all('[data-avatar]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
  }));
  one('#profile-save').addEventListener('click', () => {
    const nickname = one('#nickname').value.replace(/[<>]/g,'').trim().slice(0,16);
    state.nickname = nickname;
    state.avatar = selectedAvatar;
    one('#profile-button').textContent = state.avatar;
    one('#greeting').textContent = nickname ? `Hello, Detective ${nickname}!` : 'Hello, Detective!';
    closeModal();
  });

  // Predictions: pupil chooses at most two clues.
  const predictionButtons = all('[data-predict]');
  predictionButtons.forEach(btn => btn.addEventListener('click', () => {
    const selected = btn.getAttribute('aria-pressed') === 'true';
    const count = predictionButtons.filter(x => x.getAttribute('aria-pressed') === 'true').length;
    if (!selected && count >= 2) {
      one('#prediction-hint').textContent = 'You can choose only two clues. Deselect one to change it.';
      return;
    }
    btn.setAttribute('aria-pressed', String(!selected));
    const current = predictionButtons.filter(x => x.getAttribute('aria-pressed') === 'true').length;
    one('#prediction-hint').textContent = `${current} of 2 clues selected.`;
  }));
  one('#save-prediction').addEventListener('click', () => {
    const selected = predictionButtons.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.predict);
    if (!selected.length) {one('#prediction-hint').textContent = 'Please choose at least one clue.';return;}
    state.predictions = selected;
    setCompleted('warmup');
    navigate('malaysia');
  });

  // Listening passports: check factual recall based on the two exact transcripts.
  ['a','b'].forEach(letter => {
    const form = one('#passport-' + letter);
    const feedback = one('#feedback-' + letter);
    form.addEventListener('submit', event => {
      event.preventDefault();
      const data = new FormData(form);
      const blanks = Object.keys(keys[letter]).filter(k => !data.get(k));
      if (blanks.length) {feedback.textContent = 'Please answer all four questions first.';feedback.classList.add('error');return;}
      const correct = Object.entries(keys[letter]).filter(([k,v]) => data.get(k) === v).length;
      feedback.classList.toggle('error', correct < 3);
      feedback.textContent = `${correct} of 4 facts correct. ` +
        (correct === 4 ? 'Excellent listening! You found all four facts.' :
         correct === 3 ? 'Well done! Replay once to check the remaining fact.' :
         'Good effort. Replay the report, use the optional word clues, and try again.');
      if (correct >= 3) {
        setCompleted(letter === 'a' ? 'malaysia' : 'newzealand');
        passportPassed[letter] = true;
        if (passportPassed.a && passportPassed.b) awardBadge('listening','Listening Ace');
      }
    });
    const audio = one('#audio-' + letter);
    const status = one('#audio-state-' + letter);
    audio.addEventListener('play', () => {status.textContent = 'Now listening. Pause or replay whenever you need.';});
    audio.addEventListener('error', () => {status.textContent = 'Teacher audio has not been added yet. Open Teacher Studio or preview your own file below.';});
    all('source', audio).forEach(source => source.addEventListener('error', () => {
      if (audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE) status.textContent = 'Teacher audio not available yet. You can preview an audio file from your device below.';
    }));
    const input = one('#preview-' + letter);
    let previewURL = null;
    input.addEventListener('change', () => {
      const file = input.files?.[0];
      if (!file) return;
      if (file.type && !file.type.startsWith('audio/')) {status.textContent = 'Please select an audio file.';return;}
      if (previewURL) URL.revokeObjectURL(previewURL);
      previewURL = URL.createObjectURL(file);
      audio.pause(); audio.src = previewURL; audio.load();
      status.textContent = `Local preview: ${file.name}. This file has NOT been published to the website.`;
    });
  });
  all('[data-toggle-support]').forEach(btn => btn.addEventListener('click', () => {
    const target = one('#support-' + btn.dataset.toggleSupport);
    const show = target.hidden;
    target.hidden = !show;
    btn.setAttribute('aria-expanded', String(show));
    btn.textContent = show ? 'Hide word clues' : 'Show word clues';
  }));

  // Quiz questions are inserted from fixed teaching content, not from user input.
  const quizRoot = one('#quiz-questions');
  questions.forEach((item, i) => {
    const card = document.createElement('div');
    card.className = 'quiz-question';
    const title = document.createElement('p'); title.className = 'quiz-q'; title.textContent = `${i + 1}. ${item.q}`;
    const options = document.createElement('div'); options.className = 'quiz-options';
    item.opts.forEach((option, j) => {
      const label = document.createElement('label'); label.className = 'quiz-option';
      const radio = document.createElement('input'); radio.type='radio';radio.name='q'+i;radio.value=String(j);
      const txt = document.createElement('span');txt.textContent=option;
      label.append(radio,txt);options.append(label);
    });
    card.append(title,options);quizRoot.append(card);
  });
  const quizForm = one('#quiz-form');
  quizForm.addEventListener('change', () => {
    one('#quiz-count').textContent = `${questions.filter((_,i) => one('input[name="q'+i+'"]:checked', quizForm)).length} / 6`;
  });
  quizForm.addEventListener('submit', e => {
    e.preventDefault();
    const missing = questions.some((_,i) => !one('input[name="q'+i+'"]:checked', quizForm));
    if (missing) {one('#quiz-results').textContent = 'Answer all six questions before checking your clues.';return;}
    let score = 0;
    questions.forEach((item,i) => {
      const value = Number(one('input[name="q'+i+'"]:checked', quizForm).value);
      const right = value === item.answer; if (right) score++;
      all('.quiz-question', quizRoot)[i].classList.toggle('correct', right);
      all('.quiz-question', quizRoot)[i].classList.toggle('incorrect', !right);
    });
    state.quizScore = score;
    one('#quiz-results').textContent = `${score} / 6 clues found. ` + (score === 6 ? 'Brilliant detective work!' : 'Great effort. Listen again and try the ones marked “Check again”.');
    setCompleted('quiz');
  });
  one('#quiz-reset').addEventListener('click', () => {
    quizForm.reset();
    all('.quiz-question').forEach(item => item.classList.remove('correct', 'incorrect'));
    one('#quiz-results').textContent=''; one('#quiz-count').textContent='0 / 6';
    state.quizScore = null;
    state.completed.delete('quiz');setCompleted('quiz-reset');
  });

  one('#culture-form').addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const values = ['similarity','difference','question'].map(key => String(data.get(key) || '').trim());
    if (values.some(s => s.length < 8)) {
      one('#culture-feedback').classList.add('error');
      one('#culture-feedback').textContent = 'Write a short idea in each box. Try using the sentence starters.';
      return;
    }
    state.culture = values;
    one('#culture-feedback').classList.remove('error');
    one('#culture-feedback').textContent = 'Your three ideas are saved for this visit only. Share them respectfully with a partner.';
    setCompleted('culture');
    cultureReflectionPassed = true;
    if (cultureSorterPassed) awardBadge('culture','Culture Connector');
  });
  one('#exit-form').addEventListener('submit', e => {
    e.preventDefault();
    const value = String(new FormData(e.currentTarget).get('strategy') || '').trim();
    const msg = one('#exit-feedback');
    if (value.length < 8) {msg.textContent='Write one listening strategy that helped you.';msg.classList.add('error');return;}
    msg.classList.remove('error'); msg.textContent='Your reflection is complete. Keep practising your listening skills!';
    one('#certificate').hidden = false;
    one('#certificate-badges').textContent = `Detective stamps earned: ${state.badges.size} of 4. Each careful listen counts!`;
    one('#certificate-name').textContent = state.nickname ? `Detective ${state.nickname}, you completed your listening adventure!` : 'Detective, you completed your listening adventure!';
    setCompleted('exit');
    one('#certificate').scrollIntoView({behavior:'smooth', block:'center'});
  });
  one('#print-certificate').addEventListener('click', () => window.print());

  // Optional local browser recording: no upload; user downloads their own file.
  let recorder = null, stream = null, parts = [], recordingURL = null;
  const recordingStatus = one('#record-status');
  const startButton = one('#record-start'), stopButton = one('#record-stop');
  const audioPreview = one('#record-preview'), download = one('#record-download');
  function supportedMime() {
    if (typeof MediaRecorder === 'undefined') return '';
    return ['audio/webm;codecs=opus','audio/webm','audio/mp4','audio/ogg;codecs=opus'].find(t => MediaRecorder.isTypeSupported(t)) || '';
  }
  startButton.addEventListener('click', async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      recordingStatus.textContent = 'Your browser does not support recording here. Record with your phone or another app and preview the file in Listening Station.';
      return;
    }
    try {
      stream = await navigator.mediaDevices.getUserMedia({audio:true});
      parts = [];
      const mimeType = supportedMime();
      recorder = mimeType ? new MediaRecorder(stream,{mimeType}) : new MediaRecorder(stream);
      recorder.ondataavailable = event => {if(event.data?.size) parts.push(event.data);};
      recorder.onstop = () => {
        const type = recorder.mimeType || 'audio/webm';
        const blob = new Blob(parts,{type});
        stream?.getTracks().forEach(track=>track.stop());stream=null;
        if (!blob.size) {recordingStatus.textContent='No sound was captured. Please record again.';return;}
        if (recordingURL) URL.revokeObjectURL(recordingURL);
        recordingURL = URL.createObjectURL(blob);
        audioPreview.src = recordingURL; audioPreview.hidden = false;
        const ext = type.includes('mp4')?'m4a':type.includes('ogg')?'ogg':'webm';
        const dest = one('#record-target').value;
        download.href = recordingURL;
        const filename = dest === 'welcome' ? `welcome.${ext}` : `news-${dest}.${ext}`;
        download.download = filename;
        download.textContent = `Download ${filename}`;
        download.hidden = false;
        recordingStatus.textContent = `Recording ready! Download ${filename}, then place it in assets/audio/ on GitHub. The site does not upload it for you.`;
        startButton.disabled = false;stopButton.disabled = true;
      };
      recorder.onerror = () => {recordingStatus.textContent = 'Recording stopped unexpectedly. Try using your phone recorder.';};
      recorder.start();startButton.disabled = true;stopButton.disabled = false;
      recordingStatus.textContent = 'Recording now. Speak clearly and pause between sentences. Click Stop when finished.';
    } catch(err) {
      stream?.getTracks().forEach(track=>track.stop());stream=null;
      recordingStatus.textContent = 'Microphone permission was not granted or is unavailable. You can record with your phone and upload the file later.';
      startButton.disabled = false;stopButton.disabled = true;
    }
  });
  stopButton.addEventListener('click', () => {
    if (recorder?.state === 'recording') {recorder.stop();stopButton.disabled=true;recordingStatus.textContent='Finishing your recording…';}
  });


  // SOUND HUNT — pupils recognise spoken items; two decoys per report.
  all('[data-sound]').forEach(btn => btn.addEventListener('click', () => {
    const selected = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!selected));
    one('#sound-feedback-' + btn.dataset.sound).textContent = 'Listen again if needed. Choose the four things you really heard.';
  }));
  ['a','b'].forEach(letter => {
    const tiles = all(`[data-sound="${letter}"]`);
    one(`[data-check-sound="${letter}"]`).addEventListener('click', () => {
      const selected = tiles.filter(b => b.getAttribute('aria-pressed') === 'true');
      const message = one('#sound-feedback-' + letter);
      if (!selected.length) {message.textContent = 'Select some clues after you listen.'; return;}
      const correct = tiles.filter(b => (b.getAttribute('aria-pressed') === 'true') === (b.dataset.answer === 'true')).length;
      message.textContent = correct === 6
        ? 'Perfect! All four real clues found. You spotted the two decoys too!'
        : `${correct} of 6 choices match the recording. Replay and check the words you heard.`;
      message.classList.toggle('success',correct===6);
      soundPassed[letter] = correct === 6;
      if (soundPassed.a && soundPassed.b) awardBadge('sounds','Sound Spotter');
    });
    one(`[data-reset-sound="${letter}"]`).addEventListener('click',()=>{
      tiles.forEach(tile=>tile.setAttribute('aria-pressed','false'));
      one('#sound-feedback-'+letter).textContent='Choices cleared. Listen again, then choose your real clues!';
    });
  });

  // STORY SCRAMBLE — keyboard accessible move-up / move-down controls.
  const storySteps = {
    a: [
      'The school held Culture Sharing Day.',
      'Families brought photographs and taught games.',
      'Pupils shared stories about celebrations.',
      'Pupils made thank-you cards in English.'
    ],
    b: [
      'The school held Family Stories Day.',
      'Pupils showed photographs and family stories.',
      'Pupils taught greetings in different languages.',
      'Teams made colourful posters about respect.'
    ]
  };
  let timelineReport = 'a';
  let timelineOrder = [2,0,3,1];
  const timelineList = one('#timeline-list');
  function shuffleTimeline(){
    const permutations = [[3,1,0,2],[1,3,2,0],[2,0,3,1],[3,2,0,1]];
    timelineOrder = permutations[Math.floor(Math.random()*permutations.length)].slice();
    renderTimeline();
    one('#timeline-feedback').textContent='The news cards are mixed! Arrange them from first to last.';
  }
  function renderTimeline(){
    timelineList.replaceChildren();
    timelineOrder.forEach((index,pos)=>{
      const li=document.createElement('li');
      li.className='timeline-card';
      const n=document.createElement('span');n.className='timeline-position';n.textContent=String(pos+1);
      const message=document.createElement('span');message.className='timeline-copy';message.textContent=storySteps[timelineReport][index];
      const controls=document.createElement('div');controls.className='timeline-controls';
      for (const [delta,symbol,label] of [[-1,'↑','Move earlier'],[1,'↓','Move later']]){
        const button=document.createElement('button');button.type='button';button.textContent=symbol;
        button.setAttribute('aria-label',`${label}: ${storySteps[timelineReport][index]}`);
        button.disabled=(delta<0&&pos===0)||(delta>0&&pos===3);
        button.addEventListener('click',()=>{
          const other=pos+delta;
          [timelineOrder[pos],timelineOrder[other]]=[timelineOrder[other],timelineOrder[pos]];
          renderTimeline();
          const updated=all('li',timelineList)[other];
          one(`button[aria-label^="${delta<0?'Move earlier':'Move later'}"]`,updated)?.focus();
          one('#timeline-feedback').textContent='Card moved! Keep arranging your evidence.';
        });
        controls.append(button);
      }
      li.append(n,message,controls);timelineList.append(li);
    });
  }
  one('#timeline-report').addEventListener('change',e=>{timelineReport=e.target.value; shuffleTimeline();});
  one('#timeline-reset').addEventListener('click',shuffleTimeline);
  one('#timeline-check').addEventListener('click',()=>{
    const correct=timelineOrder.filter((n,i)=>n===i).length;
    one('#timeline-feedback').textContent=correct===4
      ? 'Wonderful! All four events are in the correct sequence. News Sequencer badge unlocked!'
      : `${correct} of 4 cards are in the correct places. Listen for the order of the events and try again.`;
    if(correct===4) awardBadge('sequence','News Sequencer');
  });
  renderTimeline();

  // FACT CHECK — decide whether a statement agrees with the audio evidence.
  const facts = [
    {text:'Culture Sharing Day took place on Thursday.',truth:true,report:'A · Malaysia'},
    {text:'The Malaysian pupils held the event on a football field.',truth:false,report:'A · Malaysia'},
    {text:'The pupils made thank-you cards in English.',truth:true,report:'A · Malaysia'},
    {text:'Family Stories Day took place on Saturday.',truth:false,report:'B · New Zealand'},
    {text:'The pupils taught one another greetings in different languages.',truth:true,report:'B · New Zealand'},
    {text:'Teams made colourful posters about respecting traditions.',truth:true,report:'B · New Zealand'}
  ];
  const factRoot=one('#factcheck-cards');
  function renderFacts(){
    factRoot.replaceChildren();
    facts.forEach((fact,i)=>{
      const card=document.createElement('div');card.className='fact-card';
      const topic=document.createElement('small');topic.className='fact-topic';topic.textContent=fact.report;
      const question=document.createElement('p');question.textContent=`${i+1}. ${fact.text}`;
      const choices=document.createElement('div');choices.className='fact-choices';
      [true,false].forEach(value=>{
        const label=document.createElement('label');label.className='fact-choice';
        const input=document.createElement('input');input.type='radio';input.name='fact'+i;input.value=String(value);
        const span=document.createElement('span');span.textContent=value?'✓ Matches the news':'✕ Does not match';
        label.append(input,span);choices.append(label);
      });
      card.append(topic,question,choices);factRoot.append(card);
    });
  }
  renderFacts();
  one('#factcheck-check').addEventListener('click',()=>{
    const response=facts.map((_,i)=>one(`input[name="fact${i}"]:checked`,factRoot));
    const msg=one('#factcheck-feedback');
    if (response.some(x=>!x)){msg.textContent='Choose an answer for each of the six news cards first.';return;}
    const count=response.filter((answer,i)=>(answer.value==='true')===facts[i].truth).length;
    all('.fact-card',factRoot).forEach((card,i)=>{
      card.classList.toggle('correct',(response[i].value==='true')===facts[i].truth);
      card.classList.toggle('incorrect',(response[i].value==='true')!==facts[i].truth);
    });
    msg.textContent=`${count} / 6 accurate fact checks. `+(count===6?'Excellent! You spotted every false news statement.':'Revisit the reports and check the cards marked “Listen again”.');
    if(count===6) setCompleted('quiz');
  });
  one('#factcheck-reset').addEventListener('click',()=>{renderFacts();one('#factcheck-feedback').textContent='Try again after another listen.';});

  // CULTURE SORTER — avoids generalisations; events in these fictional reports only.
  const cultureTiles=[
    {text:'Pupils showed photographs',answer:'both'},
    {text:'Pupils made thank-you cards',answer:'a'},
    {text:'Teams made respect posters',answer:'b'},
    {text:'Pupils shared stories',answer:'both'},
    {text:'Families taught traditional games',answer:'a'},
    {text:'Pupils taught greetings in different languages',answer:'b'}
  ];
  const sorterRoot=one('#sorter-list');
  const sorterSelections=Array(cultureTiles.length).fill(null);
  function renderSorter(){
    sorterRoot.replaceChildren();
    cultureTiles.forEach((tile,i)=>{
      const card=document.createElement('div');card.className='sorter-card';
      const text=document.createElement('p');text.textContent=`${i+1}. ${tile.text}`;
      const group=document.createElement('div');group.className='sorter-options';group.setAttribute('role','group');group.setAttribute('aria-label',tile.text);
      [['a','Malaysia'],['b','New Zealand'],['both','Both reports']].forEach(([value,label])=>{
        const btn=document.createElement('button');btn.type='button';btn.textContent=label;
        btn.setAttribute('aria-pressed',String(sorterSelections[i]===value));
        btn.addEventListener('click',()=>{sorterSelections[i]=value;
          all('button',group).forEach(b=>b.setAttribute('aria-pressed',String(b===btn)));
          one('#sorter-feedback').textContent='Great! Choose a report for every clue, then check.';
        });
        group.append(btn);
      });
      card.append(text,group);sorterRoot.append(card);
    });
  }
  renderSorter();
  one('#sorter-check').addEventListener('click',()=>{
    const msg=one('#sorter-feedback');
    if (sorterSelections.some(x=>x===null)){msg.textContent='Choose a report for all six clues first.';return;}
    const count=sorterSelections.filter((v,i)=>v===cultureTiles[i].answer).length;
    all('.sorter-card',sorterRoot).forEach((card,i)=>{
      card.classList.toggle('correct',sorterSelections[i]===cultureTiles[i].answer);
      card.classList.toggle('incorrect',sorterSelections[i]!==cultureTiles[i].answer);
    });
    cultureSorterPassed=count===6;
    msg.textContent=`${count} / 6 connections correct. `+(count===6?'You noticed what was shared and what was different! Talk about it with a partner.':'Listen for the differences and try the cards marked “Check this clue”.');
    if (cultureSorterPassed && cultureReflectionPassed) awardBadge('culture','Culture Connector');
  });
  one('#sorter-reset').addEventListener('click',()=>{
    sorterSelections.fill(null);renderSorter();
    all('.sorter-card').forEach(el=>el.classList.remove('correct','incorrect'));
    one('#sorter-feedback').textContent='All selections cleared. Listen and compare again!';
  });
  function resetEnhancedGames(){
    state.badges.clear();
    all('.stamp').forEach(stamp=>{stamp.classList.remove('earned');stamp.removeAttribute('aria-label')});
    one('#stamp-message').textContent='Your stamps will appear here as you complete detective missions.';
    passportPassed.a=false; passportPassed.b=false; soundPassed.a=false; soundPassed.b=false;
    cultureSorterPassed=false; cultureReflectionPassed=false;
    all('[data-sound]').forEach(b=>b.setAttribute('aria-pressed','false'));
    ['a','b'].forEach(letter=>{one('#sound-feedback-'+letter).textContent='Choose the four things you heard.';});
    one('#timeline-report').value='a';timelineReport='a';shuffleTimeline();renderFacts();
    sorterSelections.fill(null);renderSorter();
    ['timeline-feedback','factcheck-feedback','sorter-feedback'].forEach(id=>one('#'+id).textContent='Ready for a new detective adventure!');
    one('#certificate-badges').textContent='';
  }

  one('#reset-session').addEventListener('click', () => {
    if (!window.confirm('Clear all answers and progress from this browser tab?')) return;
    state.completed.clear();state.predictions=[];state.quizScore=null;state.culture=null;resetEnhancedGames();
    all('form').forEach(form=>form.reset());
    predictionButtons.forEach(btn=>btn.setAttribute('aria-pressed','false'));
    all('.quiz-question').forEach(el=>el.classList.remove('correct','incorrect'));
    one('#quiz-results').textContent='';one('#quiz-count').textContent='0 / 6';
    all('.form-feedback').forEach(el=>{el.textContent='';el.classList.remove('error');});
    one('#prediction-hint').textContent='Choose up to 2 clue cards.';
    one('#certificate').hidden=true;
    setCompleted('reset'); navigate('home');
  });
  // Opening the welcome modal is optional. Visitors can skip it without giving a name.
  modal.hidden = false;
})();
