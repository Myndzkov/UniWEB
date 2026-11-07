/**
 * SYNAPSE // MINIMALIST EDITORIAL SCRIPT WITH MICRO-ANIMATIONS
 * Handles theme toggling, scroll reveal animations, header elevation,
 * prompt clipboard copy, interactive quiz, and section navigation.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. Reading Progress Bar & Header Elevation
  // ==========================================
  const readingProgressBar = document.getElementById('reading-progress');
  const siteHeader = document.querySelector('.site-header');

  window.addEventListener('scroll', () => {
    // Progress calculation
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight > 0) {
      const progressPercent = (window.scrollY / totalHeight) * 100;
      readingProgressBar.style.width = `${Math.min(progressPercent, 100)}%`;
    }

    // Header elevation shadow on scroll
    if (siteHeader) {
      if (window.scrollY > 20) {
        siteHeader.classList.add('scrolled');
      } else {
        siteHeader.classList.remove('scrolled');
      }
    }
  }, { passive: true });

  // ==========================================
  // 2. Scroll-Reveal Observer (Micro-Animations)
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target); // Reveal once
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  // ==========================================
  // 3. Minimalist Notification Toast
  // ==========================================
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  let toastTimeout;

  function showToast(message, duration = 2400) {
    if (toastTimeout) clearTimeout(toastTimeout);
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    toastTimeout = setTimeout(() => {
      toast.classList.add('hidden');
    }, duration);
  }

  // ==========================================
  // 4. Copy to Clipboard for Prompts (with bounce pop)
  // ==========================================
  const copyButtons = document.querySelectorAll('.copy-prompt-btn');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const targetId = button.getAttribute('data-target');
      const targetElement = document.getElementById(targetId);

      if (!targetElement) return;

      const textToCopy = targetElement.textContent.trim();

      try {
        await navigator.clipboard.writeText(textToCopy);
        const originalContent = button.innerHTML;
        
        button.classList.add('copied');
        button.innerHTML = `
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
          <span style="font-weight:700;">¡Copiado!</span>
        `;

        showToast('Prompt técnico copiado al portapapeles');

        setTimeout(() => {
          button.classList.remove('copied');
          button.innerHTML = originalContent;
        }, 2200);
      } catch (err) {
        showToast('Error al copiar. Selecciona el texto manualmente.');
      }
    });
  });

  // ==========================================
  // 5. Smooth Anchor Link Scrolling
  // ==========================================
  const quickJumpLinks = document.querySelectorAll('a[href^="#"]');
  quickJumpLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetId = link.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          targetElement.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // ==========================================
  // 6. Active TOC Highlighting via IntersectionObserver
  // ==========================================
  const sections = document.querySelectorAll('.article-section');
  const tocLinks = document.querySelectorAll('.toc-link');

  const observerOptions = {
    root: null,
    rootMargin: '-10% 0px -70% 0px',
    threshold: 0
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        tocLinks.forEach(link => {
          if (link.getAttribute('data-section') === id) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach(section => sectionObserver.observe(section));

  // ==========================================
  // 7. Focus Mode Toggle
  // ==========================================
  const focusBtn = document.getElementById('focus-mode-btn');
  let isFocusMode = false;

  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      isFocusMode = !isFocusMode;
      document.body.classList.toggle('focus-mode', isFocusMode);
      showToast(isFocusMode ? 'Modo de lectura enfocada activado' : 'Modo estándar restaurado');
    });
  }

  // ==========================================
  // 8. Theme Toggle (with Rotation Animation)
  // ==========================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIconMoon = document.getElementById('theme-icon-moon');
  const themeIconSun = document.getElementById('theme-icon-sun');
  const themeLabel = document.getElementById('theme-label');

  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light');
      if (themeIconMoon) themeIconMoon.classList.add('hidden');
      if (themeIconSun) themeIconSun.classList.remove('hidden');
      if (themeLabel) themeLabel.textContent = 'Claro';
    } else {
      document.documentElement.classList.remove('light');
      if (themeIconMoon) themeIconMoon.classList.remove('hidden');
      if (themeIconSun) themeIconSun.classList.add('hidden');
      if (themeLabel) themeLabel.textContent = 'Oscuro';
    }
  }

  // Load saved preference or default to dark
  const savedTheme = localStorage.getItem('synapse-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      // Trigger rotate animation
      themeToggleBtn.classList.add('animating');
      setTimeout(() => themeToggleBtn.classList.remove('animating'), 500);

      const isCurrentlyLight = document.documentElement.classList.contains('light');
      const newTheme = isCurrentlyLight ? 'dark' : 'light';
      
      applyTheme(newTheme);
      localStorage.setItem('synapse-theme', newTheme);
      showToast(newTheme === 'light' ? 'Modo claro activado ☀️' : 'Modo oscuro activado 🌙');
    });
  }

  // ==========================================
  // 9. Mini-Quiz Interactive Evaluation
  // ==========================================
  const quizBlocks = document.querySelectorAll('.quiz-question-block');
  const scoreDisplay = document.getElementById('quiz-score');
  let currentScore = 0;
  const answeredQuestions = new Set();

  const quizExplanations = {
    1: {
      correct: '¡Correcto! Las bases de datos vectoriales indexan vectores densos y calculan proximidad semántica (similitud coseno / HNSW) para alimentar pipelines RAG.',
      incorrect: 'Incorrecto. La respuesta correcta es la B: calculan proximidad en espacios geométricos vectoriales, no correspondencias literales SQL.'
    },
    2: {
      correct: '¡Correcto! Una petición a través de internet (~150 ms) tarda millones de veces más que la CPU (~0.3 ns) o la RAM (~100 ns). Es el mayor cuello de botella en sistemas.',
      incorrect: 'Incorrecto. La respuesta correcta es la C: la latencia de red WAN introduce retardos físicos millones de veces mayores que la memoria local.'
    },
    3: {
      correct: '¡Correcto! El mecanismo de Autoatención (Self-Attention) procesa tokens simultáneamente en paralelo, permitiendo la escalabilidad masiva de los LLMs modernos.',
      incorrect: 'Incorrecto. La respuesta correcta es la A: la autoatención elimina la secuencialidad obligatoria de las redes recurrentes.'
    },
    4: {
      correct: '¡Correcto! MQTT es el protocolo estándar de telemetría IoT por su bajísima sobrecarga de red y su modelo de publicación/suscripción.',
      incorrect: 'Incorrecto. La respuesta correcta es la B: MQTT (Message Queuing Telemetry Transport) es el estándar para dispositivos embebidos y sensores.'
    }
  };

  quizBlocks.forEach(block => {
    const qId = block.getAttribute('data-q');
    const correctOpt = block.getAttribute('data-correct');
    const buttons = block.querySelectorAll('.quiz-option-btn');
    const feedbackBox = block.querySelector('.quiz-feedback');

    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        if (answeredQuestions.has(qId)) return;
        answeredQuestions.add(qId);

        const chosenOpt = btn.getAttribute('data-opt');
        const isCorrect = chosenOpt === correctOpt;

        // Lock options and mark right answer
        buttons.forEach(b => {
          b.disabled = true;
          b.style.cursor = 'default';
          if (b.getAttribute('data-opt') === correctOpt) {
            b.classList.add('selected-correct');
          }
        });

        if (isCorrect) {
          btn.classList.add('selected-correct');
          currentScore++;
          if (scoreDisplay) scoreDisplay.textContent = currentScore;
          feedbackBox.textContent = quizExplanations[qId].correct;
          feedbackBox.className = 'quiz-feedback success mt-3 text-xs p-3 rounded-xl';
          feedbackBox.classList.remove('hidden');
          showToast(`Pregunta ${qId}: ¡Correcto! (+1 pto)`);
        } else {
          btn.classList.add('selected-incorrect');
          feedbackBox.textContent = quizExplanations[qId].incorrect;
          feedbackBox.className = 'quiz-feedback error mt-3 text-xs p-3 rounded-xl';
          feedbackBox.classList.remove('hidden');
          showToast(`Pregunta ${qId}: Incorrecto`);
        }
      });
    });
  });

  // ==========================================================================
  // 8. ASISTENTE VIRTUAL INTERACTIVO: CUPHEAD // UJGH SYSTEMS GUIDE
  // ==========================================================================
  const assistantRoot = document.getElementById('cuphead-assistant');
  const toggleBtn = document.getElementById('cuphead-toggle-btn');
  const chatPanel = document.getElementById('cuphead-chat-panel');
  const closeBtn = document.getElementById('cuphead-close-btn');
  const clearBtn = document.getElementById('cuphead-clear-btn');
  const voiceToggleBtn = document.getElementById('cuphead-voice-btn');
  const stopVoiceBtn = document.getElementById('cuphead-stop-voice-btn');
  const iconVoiceOn = document.getElementById('icon-voice-on');
  const iconVoiceOff = document.getElementById('icon-voice-off');
  const speakingWaves = document.getElementById('cuphead-speaking-waves');
  const speechTip = document.getElementById('cuphead-tip');
  const tipCloseBtn = document.getElementById('cuphead-tip-close');
  const messagesContainer = document.getElementById('cuphead-messages');
  const inputForm = document.getElementById('cuphead-form');
  const chatInput = document.getElementById('cuphead-input');
  const chipButtons = document.querySelectorAll('.cuphead-chip');
  const voiceSelect = document.getElementById('cuphead-voice-select');
  const testVoiceBtn = document.getElementById('cuphead-test-voice-btn');
  const toneChips = document.querySelectorAll('.cuphead-tone-chip');

  if (assistantRoot && toggleBtn && chatPanel) {

    // --- State Variables ---
    let voiceEnabled = localStorage.getItem('cupheadVoiceEnabled') !== 'false';
    let selectedVoiceURI = localStorage.getItem('cupheadSelectedVoiceURI') || 'auto';
    let selectedTone = localStorage.getItem('cupheadVoiceTone') || 'natural';
    let isSpeaking = false;
    let currentUtterance = null;
    let availableVoices = [];

    // Sync initial voice toggle button state
    function updateVoiceToggleUI() {
      if (voiceEnabled) {
        voiceToggleBtn.classList.add('active');
        iconVoiceOn.classList.remove('hidden');
        iconVoiceOff.classList.add('hidden');
        voiceToggleBtn.title = 'Voz activada (clic para silenciar)';
      } else {
        voiceToggleBtn.classList.remove('active');
        iconVoiceOn.classList.add('hidden');
        iconVoiceOff.classList.remove('hidden');
        voiceToggleBtn.title = 'Voz silenciada (clic para activar)';
      }
    }
    updateVoiceToggleUI();

    voiceToggleBtn.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      localStorage.setItem('cupheadVoiceEnabled', voiceEnabled);
      updateVoiceToggleUI();
      if (!voiceEnabled && isSpeaking) {
        stopSpeaking();
      }
      showToast(voiceEnabled ? 'Voz de Cuphead activada 🔊' : 'Voz de Cuphead silenciada 🔇');
    });

    // --- Helper: Detect if a voice is Neural / Natural ---
    function isNaturalVoice(v) {
      const name = (v.name + ' ' + (v.voiceURI || '')).toLowerCase();
      return name.includes('natural') || 
             name.includes('neural') || 
             name.includes('online') || 
             name.includes('google') || 
             name.includes('multilingual') || 
             name.includes('premium');
    }

    // --- Populate and Group Natural Voices ---
    function populateVoiceList() {
      if (!('speechSynthesis' in window) || !voiceSelect) return;

      const allVoices = window.speechSynthesis.getVoices();
      if (!allVoices || allVoices.length === 0) return;

      availableVoices = allVoices;

      // Filter Spanish voices first
      let spanishVoices = allVoices.filter(v => 
        (v.lang && v.lang.toLowerCase().startsWith('es')) || 
        v.name.toLowerCase().includes('spanish') || 
        v.name.toLowerCase().includes('español')
      );

      // If no Spanish voices are found, use all available
      const voicesToUse = spanishVoices.length > 0 ? spanishVoices : allVoices;

      // Separate into Natural/Neural vs Standard
      const naturalVoices = [];
      const standardVoices = [];

      voicesToUse.forEach(v => {
        if (isNaturalVoice(v)) {
          naturalVoices.push(v);
        } else {
          standardVoices.push(v);
        }
      });

      // Clear existing options
      voiceSelect.innerHTML = '';

      // Auto / Best Voice Option
      const autoOpt = document.createElement('option');
      autoOpt.value = 'auto';
      autoOpt.textContent = naturalVoices.length > 0 
        ? '🌟 Voz Natural Recomendada (Automática)' 
        : '🌟 Voz del Sistema (Automática)';
      voiceSelect.appendChild(autoOpt);

      // Add Natural Voices Group
      if (naturalVoices.length > 0) {
        const natGroup = document.createElement('optgroup');
        natGroup.label = '— Voces Naturales / Neurales (Alta Calidad) —';
        naturalVoices.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.voiceURI || v.name;
          // Clean display name
          let cleanName = v.name
            .replace(/Microsoft\s+/i, '')
            .replace(/Online\s*\(Natural\)\s*-\s*/i, 'Natural ')
            .replace(/Desktop\s*-\s*/i, '')
            .replace(/\(Natural\)/i, 'Natural');
          opt.textContent = `🌟 ${cleanName} (${v.lang})`;
          natGroup.appendChild(opt);
        });
        voiceSelect.appendChild(natGroup);
      }

      // Add Standard Voices Group
      if (standardVoices.length > 0) {
        const stdGroup = document.createElement('optgroup');
        stdGroup.label = '— Voces Estándar del Sistema —';
        standardVoices.forEach(v => {
          const opt = document.createElement('option');
          opt.value = v.voiceURI || v.name;
          opt.textContent = `${v.name} (${v.lang})`;
          stdGroup.appendChild(opt);
        });
        voiceSelect.appendChild(stdGroup);
      }

      // Restore saved selection
      if (selectedVoiceURI) {
        voiceSelect.value = selectedVoiceURI;
      }
    }

    // Initialize voice list
    if ('speechSynthesis' in window) {
      populateVoiceList();
      window.speechSynthesis.onvoiceschanged = populateVoiceList;
    }

    // Voice Selector Change Handler
    if (voiceSelect) {
      voiceSelect.addEventListener('change', (e) => {
        selectedVoiceURI = e.target.value;
        localStorage.setItem('cupheadSelectedVoiceURI', selectedVoiceURI);
        const selectedText = voiceSelect.options[voiceSelect.selectedIndex].text.replace(/^[🌟\s—]+/, '');
        showToast(`Voz seleccionada: ${selectedText.substring(0, 24)}...`);
      });
    }

    // Tone Preset Chips Handler
    function updateToneChipsUI() {
      toneChips.forEach(chip => {
        if (chip.getAttribute('data-tone') === selectedTone) {
          chip.classList.add('active');
        } else {
          chip.classList.remove('active');
        }
      });
    }
    updateToneChipsUI();

    toneChips.forEach(chip => {
      chip.addEventListener('click', () => {
        selectedTone = chip.getAttribute('data-tone');
        localStorage.setItem('cupheadVoiceTone', selectedTone);
        updateToneChipsUI();
        const toneNames = { natural: 'Natural', profesor: 'Docente', animado: 'Ghost' };
        showToast(`Estilo de voz: ${toneNames[selectedTone] || selectedTone}`);
      });
    });

    // --- Speech Synthesis Engine ---
    function stopSpeaking() {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      isSpeaking = false;
      assistantRoot.classList.remove('cuphead-is-talking');
      if (speakingWaves) speakingWaves.classList.add('hidden');
      if (stopVoiceBtn) stopVoiceBtn.classList.add('hidden');
    }

    if (stopVoiceBtn) {
      stopVoiceBtn.addEventListener('click', () => {
        stopSpeaking();
        showToast('Voz detenida');
      });
    }

    // Phonetic dictionary: Expands acronyms and terms for clean natural pronunciation
    function cleanTextForSpeech(raw) {
      if (!raw) return '';

      let text = raw
        .replace(/<[^>]*>/g, ' ') // remove HTML tags
        .replace(/\*\*([^*]+)\*\*/g, '$1') // remove bold
        .replace(/\*([^*]+)\*/g, '$1') // remove italic
        .replace(/`([^`]+)`/g, '$1') // remove code backticks
        .replace(/#{1,6}\s+/g, '') // remove markdown headings
        .replace(/[•☕🎬🤖📡🗄️⚡🧠🌱📝💡👋↗▶\(\)]/g, ' ') // remove icons and parentheses
        .replace(/\s+/g, ' '); // collapse whitespace

      // Technical Acronyms to Natural Spanish Phonetics
      const phoneticExpansions = [
        { regex: /\bUJGH\b/gi, rep: 'U. J. G. H.' },
        { regex: /\bIA\b/g, rep: 'inteligencia artificial' },
        { regex: /\bIoT\b/g, rep: 'I. o. T.' },
        { regex: /\bTinyML\b/gi, rep: 'Tiny M. L.' },
        { regex: /\bVLA\b/g, rep: 'V. L. A.' },
        { regex: /\bRAG\b/g, rep: 'R. A. G.' },
        { regex: /\bSQL\b/gi, rep: 'S. Q. L.' },
        { regex: /\bNoSQL\b/gi, rep: 'No S. Q. L.' },
        { regex: /\bHNSW\b/gi, rep: 'H. N. S. W.' },
        { regex: /\bMQTT\b/gi, rep: 'M. Q. T. T.' },
        { regex: /\bCPU\b/gi, rep: 'C. P. U.' },
        { regex: /\bRAM\b/gi, rep: 'memoria Ram' },
        { regex: /\bE\/S\b/gi, rep: 'entradas y salidas' },
        { regex: /\bI\/O\b/gi, rep: 'I. O.' },
        { regex: /\bACID\b/g, rep: 'A. C. I. D.' },
        { regex: /\bIEEE\b/gi, rep: 'I. triple E.' },
        { regex: /\bAPA\b/gi, rep: 'A. P. A.' },
        { regex: /\bSim2Real\b/gi, rep: 'Sim to Real' },
        { regex: /\b(\d+)\s*ns\b/gi, rep: '$1 nanosegundos' },
        { regex: /\b(\d+)\s*ms\b/gi, rep: '$1 milisegundos' }
      ];

      phoneticExpansions.forEach(({ regex, rep }) => {
        text = text.replace(regex, rep);
      });

      return text.trim();
    }

    function speakText(textToSpeak, force = false) {
      if (!('speechSynthesis' in window)) return;
      if (!voiceEnabled && !force) return;

      stopSpeaking();

      const cleaned = cleanTextForSpeech(textToSpeak);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'es-ES';

      // Apply Voice Tone parameters
      if (selectedTone === 'natural') {
        utterance.rate = 1.0;
        utterance.pitch = 1.0; // Standard realistic human tone
      } else if (selectedTone === 'profesor') {
        utterance.rate = 0.93; // Deliberate and clear
        utterance.pitch = 0.94; // Warm, grounded academic tone
      } else if (selectedTone === 'animado') {
        utterance.rate = 1.08; // Slightly quick
        utterance.pitch = 1.18; // Playful animated Cuphead mascot
      }

      // Pick chosen voice
      const voices = window.speechSynthesis.getVoices();
      if (selectedVoiceURI && selectedVoiceURI !== 'auto' && voices.length > 0) {
        const chosen = voices.find(v => (v.voiceURI === selectedVoiceURI) || (v.name === selectedVoiceURI));
        if (chosen) {
          utterance.voice = chosen;
          if (chosen.lang) utterance.lang = chosen.lang;
        }
      } else if (voices.length > 0) {
        // Priority 1: Natural/Neural Spanish voice
        const bestNatural = voices.find(v => 
          ((v.lang && v.lang.toLowerCase().startsWith('es')) || v.name.toLowerCase().includes('spanish')) && 
          isNaturalVoice(v)
        );
        if (bestNatural) {
          utterance.voice = bestNatural;
          if (bestNatural.lang) utterance.lang = bestNatural.lang;
        } else {
          // Priority 2: Any Spanish voice
          const standardSpanish = voices.find(v => 
            (v.lang && v.lang.toLowerCase().startsWith('es')) || 
            v.name.toLowerCase().includes('spanish')
          );
          if (standardSpanish) {
            utterance.voice = standardSpanish;
            if (standardSpanish.lang) utterance.lang = standardSpanish.lang;
          }
        }
      }

      utterance.onstart = () => {
        isSpeaking = true;
        assistantRoot.classList.add('cuphead-is-talking');
        if (speakingWaves) speakingWaves.classList.remove('hidden');
        if (stopVoiceBtn) stopVoiceBtn.classList.remove('hidden');
      };

      utterance.onend = () => {
        isSpeaking = false;
        assistantRoot.classList.remove('cuphead-is-talking');
        if (speakingWaves) speakingWaves.classList.add('hidden');
        if (stopVoiceBtn) stopVoiceBtn.classList.add('hidden');
      };

      utterance.onerror = () => {
        isSpeaking = false;
        assistantRoot.classList.remove('cuphead-is-talking');
        if (speakingWaves) speakingWaves.classList.add('hidden');
        if (stopVoiceBtn) stopVoiceBtn.classList.add('hidden');
      };

      currentUtterance = utterance;
      window.speechSynthesis.speak(utterance);
    }

    // Test Voice Button Handler
    if (testVoiceBtn) {
      testVoiceBtn.addEventListener('click', () => {
        const testPhrases = {
          natural: "¡Hola! Esta es una prueba de mi voz natural humana para la Universidad Dr. José Gregorio Hernández.",
          profesor: "Saludos cordiales. Esta es una muestra de locución académica para Ingeniería en Sistemas en Maracaibo.",
          animado: "¡Saludos desde el Norte! Soy Ghost, el huargo de Sistemas UJGH. Mis sentidos están listos para orientarte en la web."
        };
        const phrase = testPhrases[selectedTone] || testPhrases.natural;
        speakText(phrase, true);
        showToast('Reproduciendo prueba de voz 🔊');
      });
    }

    // --- Navigation with Pulse Highlight ---
    function navigateToSection(targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('cuphead-highlight-target');
        setTimeout(() => {
          el.classList.remove('cuphead-highlight-target');
        }, 2500);
      }
    }

    // --- Message Rendering in Chat ---
    function appendMessage(sender, text, options = {}) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `cuphead-msg ${sender}`;

      if (sender === 'bot') {
        const avatar = document.createElement('div');
        avatar.className = 'cuphead-msg-avatar';
        avatar.innerHTML = `<img src="assets/ghost.png" alt="Ghost" />`;
        msgDiv.appendChild(avatar);

        const bubble = document.createElement('div');
        bubble.className = 'cuphead-msg-bubble';
        bubble.innerHTML = `<div>${text}</div>`;

        // Footer buttons (Speak + Navigate)
        const footer = document.createElement('div');
        footer.className = 'cuphead-msg-footer';

        // Replay Voice button
        const speakBtn = document.createElement('button');
        speakBtn.className = 'cuphead-speak-btn';
        speakBtn.type = 'button';
        speakBtn.innerHTML = `
          <svg class="w-3 h-3 text-red-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          Escuchar
        `;
        speakBtn.addEventListener('click', () => {
          speakText(text, true);
        });
        footer.appendChild(speakBtn);

        // Section navigation button
        if (options.targetSection) {
          const navBtn = document.createElement('button');
          navBtn.className = 'cuphead-nav-btn';
          navBtn.type = 'button';
          navBtn.innerHTML = `<span>Ir a sección</span> ↗`;
          navBtn.addEventListener('click', () => {
            navigateToSection(options.targetSection);
            showToast(`Navegando a: ${options.sectionName || 'Sección'}`);
          });
          footer.appendChild(navBtn);
        }

        bubble.appendChild(footer);
        msgDiv.appendChild(bubble);

      } else {
        const bubble = document.createElement('div');
        bubble.className = 'cuphead-msg-bubble';
        bubble.textContent = text;
        msgDiv.appendChild(bubble);
      }

      messagesContainer.appendChild(msgDiv);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;

      // Speak automatically if enabled and message is from bot
      if (sender === 'bot') {
        speakText(text);
      }
    }

    // --- Curated Engineering Facts (20 Verified Facts - Non-Repeating Queue) ---
    const funFacts = [
      "Latencia de Hardware vs Red: Un acceso a un registro de CPU toma apenas 0.5 nanosegundos (la luz recorre 15 cm en ese tiempo), mientras que cruzar el océano por un cable submarino de fibra óptica toma 150 milisegundos. ¡A escala humana, si un ciclo de CPU fuera 1 segundo, la red tardaría más de 9.5 años!",
      "Robótica y Modelos VLA: Los robots humanoides modernos ya no dependen de cinemática inversa fija. Emplean modelos VLA (Vision-Language-Action) que mapean secuencias de imágenes RGB-D y órdenes en lenguaje natural directamente a torques de motores articulares a 50 Hz.",
      "Bases de Datos Vectoriales e HNSW: En sistemas RAG modernos no se busca por igualdad estricta (WHERE en SQL), sino por proximidad geométrica (distancia coseno o producto punto) en espacios de 1536 a 3072 dimensiones usando grafos HNSW (Hierarchical Navigable Small World).",
      "TinyML en el Extremo (Edge): Con poda (pruning) y cuantización INT8, hoy es posible ejecutar redes neuronales convolucionales completas en microcontroladores ARM Cortex-M4 con apenas 256 KB de RAM, consumiendo menos de 1 milivatio de potencia.",
      "UJGH y la Ética Computacional: En la Universidad Dr. José Gregorio Hernández (Maracaibo), 'La Universidad de los Valores', la Ingeniería en Sistemas promueve que los sistemas autónomos y algoritmos de IA estén subordinados a la dignidad de la persona humana y el bien común.",
      "Auto-Atención en Transformers: El avance fundamental de la arquitectura Transformer (Vaswani et al.) radica en el cálculo de producto punto escalado Q·K^T / √d_k, permitiendo calcular relaciones entre cualquier par de tokens en paralelo en un solo paso temporal en GPUs.",
      "Aceleración de Silicio y Cores Tensor: Un acelerador moderno para IA (como el chip H100) integra más de 16,000 núcleos de cómputo y motores tensoriales FP8 capaces de ejecutar casi 4 petaflops (4 mil billones de operaciones de punto flotante por segundo).",
      "Teorema CAP en Sistemas Distribuidos: Formulado por Eric Brewer, demuestra que ningún almacén de datos distribuido puede garantizar simultáneamente Consistencia estricta (C), Disponibilidad total (A) y Tolerancia a Particiones de red (P). Solo se pueden garantizar dos.",
      "Conducción Autónoma y Sim2Real: Los algoritmos de conducción supervisada y autónoma de nivel 4 entrenan miles de millones de kilómetros en simuladores fotorrealistas con NeRFs y motores de física sintética antes de que los pesos neuronales toquen un automóvil físico.",
      "Arquitectura Zero-Trust: La seguridad corporativa moderna desechó el modelo de perímetro 'castillo y foso'. Bajo Zero-Trust, cada microservicio, petición y paquete de red debe autenticarse criptográficamente mediante mTLS (mutual TLS), incluso en la red interna.",
      "Infraestructura LLVM y Compiladores: LLVM desacopló los lenguajes de programación del silicio: compila cualquier lenguaje moderno (Rust, Swift, Clang) a una representación intermedia universal (LLVM-IR), permitiendo aplicar décadas de optimizaciones matemáticas a cualquier arquitectura destino.",
      "Green Computing y PUE de Data Centers: El PUE (Power Usage Effectiveness) ideal de un centro de datos es 1.0. Centros de datos de IA de última generación utilizan refrigeración líquida directa al chip (Direct-to-Chip) logrando un PUE de 1.06 y reduciendo drásticamente la huella de carbono.",
      "Telecomunicaciones en el Zulia: El tráfico digital de Maracaibo se integra con redes troncales de fibra óptica y enlaces terrestres de microondas de alta capacidad, enlazando la cuenca del Lago de Maracaibo con los principales backbones internacionales del Caribe.",
      "Machine Learning Tradicional vs Deep Learning: En Machine Learning clásico, los ingenieros deben diseñar manualmente los rasgos predictivos (Feature Engineering). En Deep Learning, las redes neuronales profundas extraen representaciones abstractas de forma completamente autónoma.",
      "Compresión AWQ y Cuantización a 4 bits: Algoritmos de cuantización moderna permiten reducir el peso de un modelo de 70 mil millones de parámetros de 140 GB a tan solo 38 GB de memoria de video, democratizando la IA de frontera en estaciones de trabajo convencionales.",
      "Consenso Distribuido Raft: En sistemas distribuidos como etcd (el núcleo de Kubernetes), el algoritmo Raft resuelve el problema de los 'Generales Bizantinos' permitiendo a clústeres masivos acordar un estado consistente a velocidades de submilisegundo.",
      "3D Gaussian Splatting: Es la técnica de visión por computadora que transformó el renderizado 3D en 2024: sustituye mallas de triángulos poligonales por millones de elipsoides gaussianos rasterizados en tiempo real a más de 120 fotogramas por segundo.",
      "El Kernel Linux en la Infraestructura Global: Con más de 35 millones de líneas de código fuente en C y Rust, el kernel Linux impulsa el 100% de los 500 supercomputadores más potentes del planeta y toda la nube que entrena a los modelos de inteligencia artificial.",
      "InfiniBand y RDMA: Los clústeres de supercómputo para IA no transfieren tensores mediante cables Ethernet convencionales; utilizan switches InfiniBand con RDMA (Remote Direct Memory Access) a 800 Gbps, saltándose la CPU para comunicar directamente las memorias HBM de las GPUs.",
      "Ingeniería de Prompts y Cadena de Pensamiento (CoT): El prompting no es heurística informal: forzar una 'Cadena de Pensamiento' (Chain-of-Thought) en un LLM extiende el horizonte de inferencia autorregresiva en el espacio latente, aumentando el cómputo efectivo antes del muestreo final de tokens."
    ];

    // --- Non-Repeating Queue Manager for Facts ---
    let unviewedFactIndices = [];

    function getNextFact() {
      // If queue is empty or first run, create a full randomized deck
      if (unviewedFactIndices.length === 0) {
        unviewedFactIndices = Array.from({ length: funFacts.length }, (_, i) => i);
        // Fisher-Yates shuffle
        for (let i = unviewedFactIndices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [unviewedFactIndices[i], unviewedFactIndices[j]] = [unviewedFactIndices[j], unviewedFactIndices[i]];
        }
      }
      const factIndex = unviewedFactIndices.pop();
      const currentNumber = funFacts.length - unviewedFactIndices.length;
      const isCompletedDeck = (unviewedFactIndices.length === 0);

      return {
        fact: funFacts[factIndex],
        currentNumber: currentNumber,
        total: funFacts.length,
        remaining: unviewedFactIndices.length,
        isCompletedDeck: isCompletedDeck
      };
    }

    // --- Knowledge Engine & Pattern Matching ---
    function processUserQuery(rawInput) {
      const q = rawInput.toLowerCase().trim();

      // Greetings
      if (q.match(/^(hola|buenas|buenos dias|buenas tardes|que tal|saludos|hey|ghost|lobo|huargo)/)) {
        return {
          text: "¡Saludos! 🐺 Qué gusto saludarte. Soy <strong>Ghost</strong>, el huargo guardián del Norte y tu asistente de investigación para la carrera de <em>Ingeniería en Sistemas</em> en la UJGH. ¿Quieres que te explique algún tema, te lleve a una sección o te cuente un dato técnico asombroso?",
          targetSection: null
        };
      }

      // Who are you / About
      if (q.includes('quien eres') || q.includes('que eres') || q.includes('tu nombre') || q.includes('eres un lobo') || q.includes('huargo')) {
        return {
          text: "¡Soy <strong>Ghost</strong>! 🐺 El legendario huargo albino del Norte (inspirado en Game of Thrones), adoptado por la Facultad de Ingeniería en Sistemas de la UJGH como guardián de la investigación. Conozco cada sección, las arquitecturas de software, la robótica, las redes neuronales y puedo leerte los temas con mi voz.",
          targetSection: null
        };
      }

      // Game of Thrones / Stark Easter Egg
      if (q.includes('game of thrones') || q.includes('stark') || q.includes('jon snow') || q.includes('winter') || q.includes('norte')) {
        return {
          text: "⚔️ <em>¡El invierno llegó a los sistemas de información!</em> Como Ghost, vigilo la soberanía tecnológica y la resiliencia algorítmica de la UJGH. Mis sentidos detectan cuellos de botella y fallos de hardware a kilómetros de distancia.",
          targetSection: null
        };
      }

      // Overview / Resumen
      if (q.includes('resumen') || q.includes('de que trata') || q.includes('contenido')) {
        return {
          text: "Esta web investigativa cubre 4 pilares fundamentales de la ingeniería moderna: <strong>1) Ingeniería de Prompts Pro</strong> (Video, Slides, Código), <strong>2) Panorama Tecnológico</strong> (Robótica Humanoide, IoT y TIC), <strong>3) Sistemas y Datos</strong> (Bases Vectoriales, Latencia E/S y Deep Learning), y <strong>4) Dimensión Ética y Soberanía</strong> en la UJGH.",
          targetSection: 'vlog-article',
          sectionName: 'Inicio del Informe'
        };
      }

      // Video Gen AI / Sora / Runway / Kling
      if (q.includes('video') || q.includes('sora') || q.includes('runway') || q.includes('kling') || q.includes('luma')) {
        return {
          text: "Para video con IA, la clave absoluta es controlar la <strong>coherencia temporal</strong>, la distancia focal del lente (35mm anamórfico) y el movimiento de cámara óptico para evitar mutaciones (*morphing*). ¡Te llevo a la Sección 1.1 donde está el prompt de producción!",
          targetSection: 'prompt-video',
          sectionName: '1.1 Prompts para Video'
        };
      }

      // Presentations / Pitch Decks / Gamma / Claude
      if (q.includes('presentaci') || q.includes('pitch') || q.includes('slide') || q.includes('gamma')) {
        return {
          text: "Para diapositivas ejecutivas con IA, aplicamos el marco narrativo <strong>SCR (Situation, Complication, Resolution)</strong> y la regla estricta de menos de 40 palabras por diapositiva. ¡Mira la Sección 1.2!",
          targetSection: 'prompt-slides',
          sectionName: '1.2 Presentaciones Ejecutivas'
        };
      }

      // Code / Software Development / TypeScript / Cursor
      if (q.includes('codigo') || q.includes('código') || q.includes('software') || q.includes('typescript') || q.includes('cursor') || q.includes('desarrollo')) {
        return {
          text: "En desarrollo de software con IA, redactamos un contrato tipado estricto: TypeScript, esquemas Zod en los límites del sistema, inyección de dependencias y pruebas unitarias automáticas con Vitest. ¡Revisa la plantilla en la Sección 1.3!",
          targetSection: 'prompt-code',
          sectionName: '1.3 Desarrollo de Software'
        };
      }

      // Real-time AI adoption / Live telemetry
      if (q.includes('metrica') || q.includes('métrica') || q.includes('telemetr') || q.includes('tiempo real') || q.includes('adopcion') || q.includes('adopción') || q.includes('contador') || q.includes('usuarios')) {
        return {
          text: "📊 <strong>Telemetría Global de IA en Tiempo Real:</strong><br>El monitor superior estilo Tesla refleja la telemetría viva de adopción:<br>• <strong>+854M de usuarios activos</strong> conectados simultáneamente a motores de IA generativa en el mundo.<br>• <strong>+3.78B de tokens e inferencias</strong> procesados hoy en clústeres acelerados por GPU.<br>• <strong>4.8x de aceleración promedio</strong> en productividad en Ingeniería de Sistemas con enfoque ético de la UJGH.",
          targetSection: 'ai-live-monitor',
          sectionName: 'Monitor de Telemetría en Tiempo Real'
        };
      }

      // Robotics / Embodied AI / VLA / Tesla / Figure
      if (q.includes('robot') || q.includes('humanoide') || q.includes('vla') || q.includes('embodied') || q.includes('tesla') || q.includes('atlas')) {
        return {
          text: "La robótica moderna dio el salto de la cinemática rígida a la <strong>Inteligencia Artificial Encarnada</strong>. Los modelos <strong>VLA</strong> (Vision-Language-Action) permiten que robots como Figure 02 o Tesla Optimus traduzcan visión y lenguaje en comandos motrices directos. ¡Te muestro la Sección 2.1!",
          targetSection: 'robotica-moderna',
          sectionName: '2.1 Robótica Humanoide'
        };
      }

      // IoT / Edge Computing / TinyML / MQTT
      if (q.includes('iot') || q.includes('sensor') || q.includes('tinyml') || q.includes('mqtt') || q.includes('matter') || q.includes('esp32')) {
        return {
          text: "El ecosistema IoT actual utiliza microcontroladores de 32 bits (como el ESP32) ejecutando modelos cuantizados mediante <strong>TinyML</strong> en el borde, comunicándose con baja sobrecarga vía <strong>MQTT</strong> y Matter. ¡Sección 2.2!",
          targetSection: 'iot-ecosistema',
          sectionName: '2.2 Internet de las Cosas'
        };
      }

      // IT vs TIC
      if (q.includes('tic') || q.includes('ti') || q.includes('telecomunicac') || q.includes('infraestructura')) {
        return {
          text: "<strong>TI (Tecnología de la Información):</strong> es la computación interna, servidores y bases de datos. <strong>TIC (Tecnologías de Información y Comunicación):</strong> es la capa de telecomunicaciones, redes 5G y fibra óptica que interconecta a la sociedad. ¡Sección 2.3!",
          targetSection: 'ti-tic-diferencias',
          sectionName: '2.3 IT vs TIC'
        };
      }

      // Databases / SQL / NoSQL / Vector / RAG
      if (q.includes('base de datos') || q.includes('bd') || q.includes('sql') || q.includes('nosql') || q.includes('vector') || q.includes('rag') || q.includes('acid')) {
        return {
          text: "Las <strong>Bases de Datos Vectoriales</strong> indexan representaciones numéricas (*embeddings*) mediante algoritmos de grafos como <strong>HNSW</strong>, permitiendo búsquedas por significado para alimentar arquitecturas <strong>RAG</strong>. ¡Te llevo a la Sección 3.1!",
          targetSection: 'bases-de-datos',
          sectionName: '3.1 Bases de Datos'
        };
      }

      // Latency / I/O / Hardware
      if (q.includes('latencia') || q.includes('e/s') || q.includes('i/o') || q.includes('bus') || q.includes('memoria') || q.includes('cpu') || q.includes('ram')) {
        return {
          text: "¡La jerarquía de latencia física es crucial! Una lectura de registro de CPU toma ~0.3 ns, la memoria RAM ~100 ns, y una petición por red WAN ~150 ms. Esa brecha astronómica obliga a usar programación asíncrona no bloqueante. ¡Mira la Sección 3.2!",
          targetSection: 'entradas-salidas',
          sectionName: '3.2 Entradas/Salidas & Latencia'
        };
      }

      // Machine Learning vs Deep Learning / Transformers
      if (q.includes('machine learning') || q.includes('deep learning') || q.includes('transformer') || q.includes('diferencia') || q.includes('ml')) {
        return {
          text: "La gran frontera: el <strong>ML Clásico</strong> requiere que un humano extraiga variables a mano (*Feature Engineering*); el <strong>Deep Learning</strong> y los <strong>Transformers</strong> extraen patrones jerárquicos automáticamente mediante capas profundas y autoatención. ¡Aquí tienes la tabla comparativa en la Sección 3.3!",
          targetSection: 'ml-vs-dl',
          sectionName: '3.3 ML vs Deep Learning'
        };
      }

      // Ethics / Sustainability / UJGH / Values / Maracaibo
      if (q.includes('etica') || q.includes('ética') || q.includes('ujgh') || q.includes('jose gregorio') || q.includes('josé gregorio') || q.includes('maracaibo') || q.includes('valores') || q.includes('sostenibilidad') || q.includes('green')) {
        return {
          text: "En la <strong>Universidad Dr. José Gregorio Hernández</strong>, 'La Universidad de los Valores', la ingeniería de sistemas se fundamenta en el servicio al ser humano, el *Green Computing* para reducir la huella energética y la soberanía tecnológica latinoamericana. ¡Sección 4!",
          targetSection: 'etica-sostenibilidad',
          sectionName: '4. Dimensión Ética UJGH'
        };
      }

      // Quiz / Exam
      if (q.includes('quiz') || q.includes('test') || q.includes('evalua') || q.includes('pregunta')) {
        return {
          text: "¡Acepta el desafío! He preparado un <strong>Mini-Quiz de 4 preguntas</strong> sobre Bases Vectoriales, Latencia de Hardware, Transformers y protocolos IoT. ¡Vamos allá!",
          targetSection: 'evaluacion-quiz',
          sectionName: '5. Mini-Quiz Evaluativo'
        };
      }

      // Academic References
      if (q.includes('referencia') || q.includes('fuente') || q.includes('ieee') || q.includes('apa') || q.includes('bibliografia')) {
        return {
          text: "Aquí están todas las fuentes científicas formales que respaldan este informe: el paper original de Transformers (Vaswani 2017), Laudon & Laudon, Patterson & Hennessy, y normas IEEE. ¡Sección 6!",
          targetSection: 'referencias-academicas',
          sectionName: '6. Referencias Formales'
        };
      }

      // Fun Fact (Non-repeating sequence across all 20 facts)
      if (q.includes('dato') || q.includes('curioso') || q.includes('sabias') || q.includes('sabías')) {
        const item = getNextFact();
        let footerNotice = item.isCompletedDeck
          ? `<div class="mt-2.5 p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-400 font-medium">✨ ¡Has explorado los 20 datos técnicos únicos sin repetir! La baraja se ha barajado nuevamente para el siguiente ciclo.</div>`
          : `<div class="mt-2 text-[11px] text-[#a1a1aa] font-mono flex items-center justify-between border-t border-[#27272a] pt-1.5"><span>📌 Dato ${item.currentNumber} de ${item.total}</span><span class="text-emerald-400 font-medium">Sin repetir (${item.remaining} restantes)</span></div>`;

        return {
          text: `💡 <strong>Dato Curioso para Ingenieros (#${item.currentNumber}/${item.total}):</strong><br>${item.fact}${footerNotice}`,
          targetSection: null
        };
      }

      // Help
      if (q.includes('ayuda') || q.includes('comando') || q.includes('que puedes hacer')) {
        return {
          text: "Puedes pedirme:<br>• <strong>'Resumen'</strong>: visión global del informe.<br>• <strong>'Video'</strong>, <strong>'Slides'</strong>, <strong>'Código'</strong>: prompts listos.<br>• <strong>'Robótica'</strong>, <strong>'IoT'</strong>, <strong>'Bases de datos'</strong>, <strong>'Latencia'</strong>: conceptos técnicos.<br>• <strong>'Dato curioso'</strong>: curiosidades de ingeniería.<br>• <strong>'Quiz'</strong>: ponerte a prueba.",
          targetSection: null
        };
      }

      // Fallback
      return {
        text: `Entiendo tu interés en <em>"${rawInput}"</em>. Te sugiero explorar las secciones temáticas usando los botones rápidos de aquí abajo, o preguntarme sobre <strong>prompts</strong>, <strong>robótica</strong>, <strong>bases de datos</strong>, <strong>latencia</strong> o el <strong>quiz</strong>.`,
        targetSection: null
      };
    }

    // --- User Form Submission ---
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const query = chatInput.value.trim();
      if (!query) return;

      appendMessage('user', query);
      chatInput.value = '';

      // Assistant thinking delay
      setTimeout(() => {
        const result = processUserQuery(query);
        appendMessage('bot', result.text, {
          targetSection: result.targetSection,
          sectionName: result.sectionName
        });

        if (result.targetSection) {
          navigateToSection(result.targetSection);
        }
      }, 400);
    });

    // --- Quick Chips Clicks & Navigation Controls ---
    const chipsScroll = document.getElementById('cuphead-chips-scroll');
    const chipsPrevBtn = document.getElementById('cuphead-chips-prev-btn');
    const chipsNextBtn = document.getElementById('cuphead-chips-next-btn');
    const chipsExpandBtn = document.getElementById('cuphead-chips-expand-btn');

    if (chipsPrevBtn && chipsScroll) {
      chipsPrevBtn.addEventListener('click', () => {
        chipsScroll.scrollBy({ left: -160, behavior: 'smooth' });
      });
    }

    if (chipsNextBtn && chipsScroll) {
      chipsNextBtn.addEventListener('click', () => {
        chipsScroll.scrollBy({ left: 160, behavior: 'smooth' });
      });
    }

    if (chipsExpandBtn && chipsScroll) {
      chipsExpandBtn.addEventListener('click', () => {
        chipsScroll.classList.toggle('is-expanded');
        chipsExpandBtn.classList.toggle('active');
        const isExp = chipsScroll.classList.contains('is-expanded');
        chipsExpandBtn.title = isExp ? 'Contraer temas a fila única' : 'Ver todos los temas en cuadrícula';
        showToast(isExp ? 'Cuadrícula de temas desplegada ⊞' : 'Vista de temas en fila horizontal ↔');
      });
    }

    // Horizontal wheel scroll support
    if (chipsScroll) {
      chipsScroll.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0 && !chipsScroll.classList.contains('is-expanded')) {
          e.preventDefault();
          chipsScroll.scrollLeft += e.deltaY * 0.9;
        }
      }, { passive: false });

      // Mouse drag-to-scroll interaction
      let isDragging = false;
      let startX, startScrollLeft;

      chipsScroll.addEventListener('mousedown', (e) => {
        if (chipsScroll.classList.contains('is-expanded')) return;
        isDragging = true;
        startX = e.pageX - chipsScroll.offsetLeft;
        startScrollLeft = chipsScroll.scrollLeft;
      });

      window.addEventListener('mouseup', () => { isDragging = false; });
      chipsScroll.addEventListener('mouseleave', () => { isDragging = false; });

      chipsScroll.addEventListener('mousemove', (e) => {
        if (!isDragging || chipsScroll.classList.contains('is-expanded')) return;
        e.preventDefault();
        const x = e.pageX - chipsScroll.offsetLeft;
        const walk = (x - startX) * 1.5;
        chipsScroll.scrollLeft = startScrollLeft - walk;
      });
    }

    chipButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-query');
        appendMessage('user', btn.textContent.trim());

        setTimeout(() => {
          const result = processUserQuery(query);
          appendMessage('bot', result.text, {
            targetSection: result.targetSection,
            sectionName: result.sectionName
          });

          if (result.targetSection) {
            navigateToSection(result.targetSection);
          }
        }, 350);
      });
    });

    // --- Toggle Panel Visibility ---
    function openPanel() {
      chatPanel.classList.remove('hidden');
      toggleBtn.setAttribute('aria-expanded', 'true');
      if (speechTip) speechTip.style.display = 'none';

      // Welcome message if chat is empty
      if (messagesContainer.children.length === 0) {
        appendMessage('bot', '¡Saludos! 🐺 Soy <strong>Ghost</strong>, el huargo del Norte y tu asistente virtual para este informe de <em>Ingeniería en Sistemas</em> de la <strong>Universidad Dr. José Gregorio Hernández</strong>.<br><br>Puedo resolver tus dudas técnicas, guiarte por cada sección y <strong>explicarte las arquitecturas con mi voz</strong>. ¿Qué deseas explorar hoy?');
      }

      chatInput.focus();
    }

    function closePanel() {
      chatPanel.classList.add('hidden');
      toggleBtn.setAttribute('aria-expanded', 'false');
      stopSpeaking();
    }

    toggleBtn.addEventListener('click', () => {
      if (chatPanel.classList.contains('hidden')) {
        openPanel();
      } else {
        closePanel();
      }
    });

    closeBtn.addEventListener('click', closePanel);

    // Close on Escape key
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !chatPanel.classList.contains('hidden')) {
        closePanel();
      }
    });

    // Clear Chat
    clearBtn.addEventListener('click', () => {
      stopSpeaking();
      messagesContainer.innerHTML = '';
      appendMessage('bot', 'Conversación reiniciada. 🐺 ¿En qué tema de Sistemas o IA te puedo apoyar ahora?');
      showToast('Chat de Ghost reiniciado');
    });

    // Speech bubble tip interaction
    if (speechTip) {
      speechTip.addEventListener('click', (e) => {
        if (e.target !== tipCloseBtn) {
          openPanel();
        }
      });

      if (tipCloseBtn) {
        tipCloseBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          speechTip.style.display = 'none';
        });
      }

      // Auto-hide speech bubble tip after 10 seconds
      setTimeout(() => {
        if (speechTip) {
          speechTip.style.opacity = '0';
          setTimeout(() => { speechTip.style.display = 'none'; }, 500);
        }
      }, 10000);
    }

    // Connect Tesla Section Button: Consultar a Ghost
    const btnAskCupheadStats = document.getElementById('btn-ask-cuphead-stats');
    if (btnAskCupheadStats) {
      btnAskCupheadStats.addEventListener('click', () => {
        openPanel();
        const statQuery = '¿Qué significan las métricas de adopción de IA en tiempo real?';
        appendMessage('user', statQuery);
        setTimeout(() => {
          const result = processUserQuery(statQuery);
          appendMessage('bot', result.text, {
            targetSection: result.targetSection,
            sectionName: result.sectionName
          });
          speakText(cleanTextForSpeech(result.text));
        }, 400);
      });
    }

  }

  // ==========================================================================
  // 9. TESLA-STYLE LIVE AI MONITOR TELEMETRY & VIDEO CONTROLS
  // ==========================================================================
  let currentAiUsers = 854921430;
  let currentAiQueries = 3782145890;

  const usersCounterEl = document.getElementById('live-ai-users-counter');
  const queriesCounterEl = document.getElementById('live-ai-queries-counter');

  if (usersCounterEl && queriesCounterEl) {
    // 1-second interval ticking strictly coherent, realistic metrics
    setInterval(() => {
      // Influx of concurrent users: +3 to +19 per second globally
      const userDelta = Math.floor(Math.random() * 17) + 3;
      currentAiUsers += userDelta;

      // Influx of tokens & inference queries: +280 to +850 per second
      const queryDelta = Math.floor(Math.random() * 571) + 280;
      currentAiQueries += queryDelta;

      // Update counters with comma formatting
      usersCounterEl.textContent = currentAiUsers.toLocaleString('en-US');
      queriesCounterEl.textContent = '+' + currentAiQueries.toLocaleString('en-US');

      // Subtle pulse micro-animation
      usersCounterEl.classList.remove('user-ticker-pulse');
      queriesCounterEl.classList.remove('ticker-pulse');
      void usersCounterEl.offsetWidth; // Force DOM reflow
      void queriesCounterEl.offsetWidth;
      usersCounterEl.classList.add('user-ticker-pulse');
      queriesCounterEl.classList.add('ticker-pulse');
    }, 1000);
  }

  // Tesla Video Player Controls
  const teslaVideo = document.getElementById('tesla-live-video');
  const btnToggleLiveVideo = document.getElementById('btn-toggle-live-video');
  const btnMuteLiveVideo = document.getElementById('btn-mute-live-video');
  const iconPauseVideo = document.getElementById('icon-pause-video');
  const iconPlayVideo = document.getElementById('icon-play-video');
  const iconVolMute = document.getElementById('icon-vol-mute');
  const iconVolUnmute = document.getElementById('icon-vol-unmute');

  if (btnToggleLiveVideo && teslaVideo) {
    btnToggleLiveVideo.addEventListener('click', () => {
      if (teslaVideo.paused) {
        teslaVideo.play();
        if (iconPlayVideo) iconPlayVideo.classList.add('hidden');
        if (iconPauseVideo) iconPauseVideo.classList.remove('hidden');
        showToast('Video en vivo reanudado');
      } else {
        teslaVideo.pause();
        if (iconPlayVideo) iconPlayVideo.classList.remove('hidden');
        if (iconPauseVideo) iconPauseVideo.classList.add('hidden');
        showToast('Video en vivo pausado');
      }
    });
  }

  if (btnMuteLiveVideo && teslaVideo) {
    btnMuteLiveVideo.addEventListener('click', () => {
      teslaVideo.muted = !teslaVideo.muted;
      if (teslaVideo.muted) {
        if (iconVolMute) iconVolMute.classList.remove('hidden');
        if (iconVolUnmute) iconVolUnmute.classList.add('hidden');
        showToast('Video silenciado');
      } else {
        if (iconVolMute) iconVolMute.classList.add('hidden');
        if (iconVolUnmute) iconVolUnmute.classList.remove('hidden');
        showToast('Audio de video activado');
      }
    });
  }

  // ==========================================
  // Hero Cover: Destello Azul en Borde al Tocar/Clic
  // ==========================================
  const bannerContainer = document.getElementById('architecture-diagram-container');
  if (bannerContainer) {
    bannerContainer.addEventListener('click', () => {
      // Re-trigger animation cleanly
      bannerContainer.classList.remove('border-destello-active');
      void bannerContainer.offsetWidth; // Force DOM reflow
      bannerContainer.classList.add('border-destello-active');
      
      // Auto-cleanup after animation completes
      setTimeout(() => {
        bannerContainer.classList.remove('border-destello-active');
      }, 1250);
    });
  }

  // ==========================================
  // Ambient Cursor Spotlight (Luz Azul Desenfocada que sigue al puntero)
  // ==========================================
  const cursorGlow = document.getElementById('cursor-ambient-glow');
  if (cursorGlow) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isMoving = false;
    let rafId = null;

    function renderCursorGlow() {
      // Fluid linear interpolation (lerp) for organic glide
      const ease = 0.18;
      currentX += (mouseX - currentX) * ease;
      currentY += (mouseY - currentY) * ease;

      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0) translate(-50%, -50%)`;

      if (Math.abs(mouseX - currentX) > 0.1 || Math.abs(mouseY - currentY) > 0.1) {
        rafId = requestAnimationFrame(renderCursorGlow);
      } else {
        isMoving = false;
        rafId = null;
      }
    }

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!cursorGlow.classList.contains('is-active')) {
        cursorGlow.classList.add('is-active');
      }
      if (!isMoving) {
        isMoving = true;
        rafId = requestAnimationFrame(renderCursorGlow);
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      cursorGlow.classList.remove('is-active');
    });

    document.addEventListener('mouseenter', () => {
      cursorGlow.classList.add('is-active');
    });

    window.addEventListener('mousedown', () => {
      cursorGlow.classList.add('is-clicking');
    });

    window.addEventListener('mouseup', () => {
      cursorGlow.classList.remove('is-clicking');
    });
  }

});



/* ==========================================================================
   SYNAPSE v2 // MEJORAS DE INTERACCIÓN (aditivo; no toca la lógica anterior)
   ========================================================================== */
(() => {
  const init = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));

    /* 1. Imágenes: carga diferida (salvo las marcadas eager) */
    $$('img:not([loading])').forEach(img => { img.loading = 'lazy'; img.decoding = 'async'; });

    /* 2. Videos: pausar fuera de pantalla, sin pisar una pausa manual */
    if ('IntersectionObserver' in window) {
      const vo = new IntersectionObserver(es => es.forEach(({ target: v, isIntersecting }) => {
        if (!isIntersecting && !v.paused) { v.pause(); v.dataset.fxAuto = '1'; }
        else if (isIntersecting && v.dataset.fxAuto) { delete v.dataset.fxAuto; v.play().catch(() => {}); }
      }), { threshold: 0.15 });
      $$('video').forEach(v => vo.observe(v));
    }

    /* 3. Scrollspy del menú superior */
    const links = $$('.nav-link[href^="#"]');
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    if ('IntersectionObserver' in window && map.size) {
      const so = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { links.forEach(l => l.classList.remove('is-current')); map.get(e.target.id)?.classList.add('is-current'); }
      }), { rootMargin: '-35% 0px -60% 0px' });
      map.forEach((_, id) => { const el = document.getElementById(id); if (el) so.observe(el); });
    }

    /* 4. Resplandor de tarjetas que sigue al cursor */
    $$('#vlog-article .rounded-2xl.border, #article-sidebar > div, .prompt-card, .quiz-container')
      .filter(c => !c.querySelector('video'))
      .forEach(c => {
        c.classList.add('fx-spot');
        c.addEventListener('pointermove', e => {
          const r = c.getBoundingClientRect();
          c.style.setProperty('--mx', (e.clientX - r.left) + 'px');
          c.style.setProperty('--my', (e.clientY - r.top) + 'px');
        }, { passive: true });
      });

    /* 5. Botones: ripple + efecto magnético */
    $$('.hero-start-btn, .hero-quiz-btn, .primary-pill-btn, #ai-live-monitor a, #btn-ask-cuphead-stats').forEach(b => {
      b.classList.add('fx-btn');
      b.addEventListener('pointerdown', e => {
        const r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
        const s = document.createElement('span');
        s.className = 'fx-ripple';
        s.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - r.left - d / 2}px;top:${e.clientY - r.top - d / 2}px`;
        b.appendChild(s); setTimeout(() => s.remove(), 650);
      });
      if (!reduce && window.matchMedia('(hover: hover)').matches) {
        b.addEventListener('pointermove', e => {
          const r = b.getBoundingClientRect();
          b.style.translate = `${(e.clientX - r.left - r.width / 2) * .12}px ${(e.clientY - r.top - r.height / 2) * .2}px`;
        }, { passive: true });
        b.addEventListener('pointerleave', () => { b.style.translate = ''; });
      }
    });

    /* 6. Entrada escalonada de figuras, tarjetas y referencias */
    if (!reduce && 'IntersectionObserver' in window) {
      const groups = ['#vlog-article .my-6.rounded-2xl', '#etica-sostenibilidad .grid > div', '#evaluacion-quiz .quiz-question-block', '#referencias-academicas .space-y-3\\.5 > div'];
      const io = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target; io.unobserve(el);
        el.classList.add('fx-in');
        setTimeout(() => { el.classList.remove('fx-pre', 'fx-in'); el.style.removeProperty('--fx-delay'); }, 1100);
      }), { threshold: 0.12 });
      groups.forEach(sel => $$(sel).forEach((el, i) => {
        el.style.setProperty('--fx-delay', (i % 4) * 90 + 'ms');
        el.classList.add('fx-pre'); io.observe(el);
      }));
    }

    /* 7. Contadores animados en las métricas del monitor */
    const animateNum = (el, to, dec, suffix) => {
      if (reduce) return;
      const t0 = performance.now(), dur = 1400;
      const tick = t => {
        const p = Math.min((t - t0) / dur, 1), k = 1 - Math.pow(1 - p, 4);
        el.textContent = (to * k).toFixed(dec) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    if ('IntersectionObserver' in window) {
      const mo = new IntersectionObserver(es => es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target; mo.unobserve(el);
        const m = el.textContent.trim().match(/^([\d.]+)(.*)$/);
        if (m) animateNum(el, parseFloat(m[1]), (m[1].split('.')[1] || '').length, m[2]);
      }), { threshold: 0.6 });
      $$('#ai-live-monitor div').filter(d => d.children.length === 0 && /^(4\.8x|99\.98%)$/.test(d.textContent.trim())).forEach(el => mo.observe(el));
    }

    /* 8. Volver arriba con anillo de progreso */
    const top = document.getElementById('back-to-top'), ring = document.getElementById('back-to-top-ring');
    if (top && ring) {
      const upd = () => {
        const max = document.documentElement.scrollHeight - innerHeight;
        ring.style.strokeDashoffset = 100.5 * (1 - (max > 0 ? scrollY / max : 0));
        top.classList.toggle('is-visible', scrollY > 700);
      };
      addEventListener('scroll', upd, { passive: true }); upd();
      top.addEventListener('click', () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' }));
    }
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();


/* SYNAPSE v3 // Hero: titular por palabras + campo neuronal que reacciona al cursor */
(() => {
  const init = () => {
    const hero = document.getElementById('hero'); if (!hero) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const h1 = hero.querySelector('h1');
    if (h1 && !reduce) {
      const words = h1.textContent.trim().split(/\s+/);
      h1.setAttribute('aria-label', words.join(' '));
      h1.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`).join(' ');
    }
    const c = document.createElement('canvas'); c.id = 'synapse-canvas'; c.setAttribute('aria-hidden', 'true'); hero.prepend(c);
    const ctx = c.getContext('2d'), dpr = Math.min(devicePixelRatio || 1, 2);
    let W, H, pts = [], mx = -999, my = -999, on = true, raf;
    const D = 135, R = 190;
    const size = () => {
      W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.min(95, W / 15));
      pts = Array.from({ length: n }, () => ({ x: Math.random() * W, y: Math.random() * H, vx: (Math.random() - .5) * .45, vy: (Math.random() - .5) * .45 }));
    };
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of pts) {
        if (!reduce) { p.x += p.vx; p.y += p.vy; if (p.x < 0 || p.x > W) p.vx *= -1; if (p.y < 0 || p.y > H) p.vy *= -1; }
      }
      for (let i = 0; i < pts.length; i++) {
        const a = pts[i];
        for (let j = i + 1; j < pts.length; j++) {
          const b = pts[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < D) { ctx.strokeStyle = `rgba(91,140,255,${(1 - d / D) * .28})`; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
        }
        const dm = Math.hypot(a.x - mx, a.y - my);
        if (dm < R) { ctx.strokeStyle = `rgba(255,181,71,${(1 - dm / R) * .75})`; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mx, my); ctx.stroke(); }
        ctx.fillStyle = dm < R ? 'rgba(255,181,71,.95)' : 'rgba(120,160,255,.75)';
        ctx.beginPath(); ctx.arc(a.x, a.y, dm < R ? 2.2 : 1.5, 0, 6.283); ctx.fill();
      }
      if (on && !reduce) raf = requestAnimationFrame(draw);
    };
    size(); draw();
    addEventListener('resize', () => { size(); if (reduce) draw(); });
    addEventListener('pointermove', e => { const r = c.getBoundingClientRect(); mx = e.clientX - r.left; my = e.clientY - r.top; }, { passive: true });
    if ('IntersectionObserver' in window && !reduce) {
      new IntersectionObserver(([e]) => { const v = e.isIntersecting; if (v && !on) { on = true; draw(); } else if (!v) { on = false; cancelAnimationFrame(raf); } }, { threshold: 0 }).observe(hero);
    }
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', init) : init();
})();
