// game-engine.js
import { getAllGenres, getRandomTrackFromGenre, resetPlayedTracks } from "../core/music.js";
import { AudioManager } from "./audio-manager.js";
import { TimerManager } from "./timer-manager.js";
import { ScoreManager } from "./score-manager.js";
import { UIManager } from "./ui-manager.js";

export class GameEngine {
  constructor() {
    this.audioManager = new AudioManager();
    this.timerManager = new TimerManager();
    this.scoreManager = new ScoreManager();
    this.uiManager = new UIManager();
    
    // Game state
    this.totalRounds = 10;
    this.currentTrack = null;
    this.correctAnswer = '';
    this.gameMode = '';
    this.settings = {
      categories: [],
      questionType: 'mixed',
      previewLength: 10,
      lives: '3'
    };
    this.playedTracks = [];
    this.answerSelected = false;
  }

  // Initialize the game
  async initialize() {
    try {
      // Get game mode and settings
      this.gameMode = new URLSearchParams(window.location.search).get('mode') || 'solo';
      this.loadGameSettings();
      
      // Reset track history
      resetPlayedTracks();
      
      // Initialize managers
      this.scoreManager.initialize(this.gameMode, this.settings);
      this.timerManager.setTimeLimit(this.settings.timeLimit || 15);
      
      // Setup UI based on game mode
      const players = this.setupGameMode();
      this.uiManager.setupGameMode(this.gameMode, this.settings, players);
      
      // Initialize audio
      await this.audioManager.initializeAudio();
      
      // Show loading and start game
      await this.uiManager.simulateLoading();
      
      // Start first round
      this.startNewRound();
      
      // Setup event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('Game initialization failed:', error);
      alert('Failed to initialize the game. Please refresh the page.');
    }
  }

  // Load game settings from localStorage
  loadGameSettings() {
    const savedSettings = localStorage.getItem('riffleGameSettings');
    if (savedSettings) {
      const parsed = JSON.parse(savedSettings);
      this.settings = { ...this.settings, ...parsed };
      
      if (this.settings.rounds && this.settings.rounds !== 'unlimited') {
        this.totalRounds = parseInt(this.settings.rounds);
        document.getElementById('max-score').textContent = this.totalRounds;
      }
      
      // Load avatar
      const avatar = this.settings.avatar || localStorage.getItem('selectedAvatar') || 'avatar1';
      const avatarElement = document.getElementById('player-avatar');
      if (avatarElement) {
        avatarElement.src = `../img/avatars/${avatar}.png`;
      }
    }
  }

  // Setup game mode specific configuration
  setupGameMode() {
    let players = null;
    
    if (['versus', 'team', 'coop'].includes(this.gameMode)) {
      players = this.scoreManager.generateMockPlayers();
    }
    
    return players;
  }

  // Start a new round
  async startNewRound() {
    try {
      // Check if game should end
      if (this.settings.rounds !== 'unlimited' && this.scoreManager.getCurrentRound() >= this.totalRounds) {
        this.endGame();
        return;
      }

      // Check if player ran out of lives
      if (this.scoreManager.isGameOver()) {
        this.showRoundCompletionScreen(true);
        return;
      }

      // Clean up previous round
      this.cleanupPreviousRound();
      
      // Increment round
      const currentRound = this.scoreManager.nextRound();
      
      // Update round info
      this.uiManager.updateRoundInfo(
        currentRound, 
        this.totalRounds, 
        this.settings.rounds === 'unlimited'
      );
      
      // Reset UI for new round
      this.uiManager.resetUI();
      this.audioManager.createMusicVisualizer();
      this.timerManager.resetTimer();
      
      // Get random track
      const track = await this.getRandomTrack();
      this.currentTrack = track;
      this.audioManager.setCurrentTrack(track);
      
      // Prepare question
      const { questionText, genreInfo, correctAnswer } = this.prepareQuestion(track);
      this.correctAnswer = correctAnswer;
      
      // Update question display
      this.uiManager.updateQuestion(questionText, genreInfo);
      
      // Generate and set answer options
      const answerOptions = this.generateAnswerOptions();
      this.uiManager.setAnswerOptions(answerOptions);
      
      // Start the round with delay
      setTimeout(() => {
        this.startRound();
      }, 1000);
      
    } catch (error) {
      console.error('Error starting new round:', error);
      alert('An error occurred while loading the track. Please try again.');
    }
  }

  // Clean up from previous round
  cleanupPreviousRound() {
    const timeoutBtn = document.getElementById('timeout-next-btn');
    if (timeoutBtn && timeoutBtn.parentNode) {
      timeoutBtn.parentNode.removeChild(timeoutBtn);
    }

    const manualNextBtn = document.getElementById('manual-next-btn');
    if (manualNextBtn && manualNextBtn.parentNode) {
      manualNextBtn.parentNode.removeChild(manualNextBtn);
    }

    this.timerManager.cleanup();
    this.answerSelected = false;
  }

  // Start the round (play music, start timers)
  startRound() {
    // Visual effects
    const pulseEffect = document.createElement('div');
    pulseEffect.className = 'fixed inset-0 bg-purple-900 bg-opacity-10 z-20';
    document.body.appendChild(pulseEffect);
    
    pulseEffect.animate([{ opacity: 0.2 }, { opacity: 0 }], {
      duration: 800,
      easing: 'ease-out'
    }).onfinish = () => pulseEffect.remove();
    
    // Play music
    this.audioManager.playMusic();
    
    // Start timers
    if (this.gameMode !== 'solo') {
      this.timerManager.startTimer(() => this.handleTimeout());
    }
    
    this.timerManager.startPreviewTimeout(
      this.settings.previewLength, 
      () => this.handleTimeout()
    );
    
    // Add continue button for VS modes after preview
    if (this.gameMode !== 'solo') {
      setTimeout(() => {
        this.addContinueButton();
      }, this.settings.previewLength * 1000 + 100);
    }
  }

  // Get random track based on settings
  async getRandomTrack() {
    let track;
    if (this.settings.categories && this.settings.categories.length > 0) {
      const categoryId = this.settings.categories[Math.floor(Math.random() * this.settings.categories.length)];
      track = await getRandomTrackFromGenre(categoryId);
    } else {
      track = await getRandomTrackFromGenre('rock_80s');
    }
    
    // Add to played tracks
    this.playedTracks.push(track);
    
    return track;
  }

  // Prepare question based on track and settings
  prepareQuestion(track) {
    let questionType = this.settings.questionType;
    if (questionType === 'mixed') {
      questionType = Math.random() > 0.5 ? 'song' : 'artist';
    }
    
    let questionText, correctAnswer;
    const genreInfo = track.genreName || 'Rock/Metal';
    
    switch (questionType) {
      case 'song':
        questionText = 'Which song is this?';
        track.cleanTitle = this.uiManager.cleanSongTitle(track.title);
        correctAnswer = track.cleanTitle;
        break;
      case 'artist':
        questionText = 'Which artist/band performs this track?';
        correctAnswer = track.artist;
        break;
      case 'guitarist':
        questionText = 'Who is the guitarist for this track?';
        correctAnswer = track.guitarist || track.artist;
        break;
      default:
        questionText = 'Which artist/band performs this track?';
        correctAnswer = track.artist;
    }
    
    return { questionText, genreInfo, correctAnswer };
  }

  // Generate answer options
  generateAnswerOptions() {
    const enhancedOptions = {
      'song': {
        '60s': ['House Of The Rising Sun', 'Purple Haze', 'Born To Be Wild', 'Light My Fire', 'Fortunate Son', 'Good Vibrations', 'Satisfaction', 'Gimme Shelter', 'White Rabbit', 'All Along The Watchtower'],
        '70s': ['Stairway To Heaven', 'Hotel California', 'Smoke On The Water', 'Bohemian Rhapsody', 'Black Dog', 'Paranoid', 'Another Brick In The Wall', 'Dream On', 'Layla', 'Free Bird'],
        '80s': ['Sweet Child O\' Mine', 'Enter Sandman', 'Back in Black', 'Crazy Train', 'Run To The Hills', 'Breaking The Law', 'You Give Love A Bad Name', 'Welcome To The Jungle', 'Master of Puppets', 'Jump'],
        '90s': ['Nothing Else Matters', 'Smells Like Teen Spirit', 'Black Hole Sun', 'Enter Sandman', 'One', 'Sober', 'Alive', 'Jeremy', 'Zombie', 'Basket Case'],
        '00s': ['Chop Suey!', 'In The End', 'Toxicity', 'Seven Nation Army', 'Boulevard of Broken Dreams', 'Numb', 'The Pretender', 'Mr. Brightside', 'Last Resort', 'Diary of Jane']
      },
      'artist': {
        '60s': ['The Doors', 'Jimi Hendrix', 'The Beatles', 'The Rolling Stones', 'Jefferson Airplane', 'Steppenwolf', 'Cream', 'The Who', 'The Animals', 'Creedence Clearwater Revival'],
        '70s': ['Led Zeppelin', 'Black Sabbath', 'Deep Purple', 'Queen', 'Pink Floyd', 'AC/DC', 'Aerosmith', 'Lynyrd Skynyrd', 'The Eagles', 'Kiss'],
        '80s': ['Metallica', 'Guns N\' Roses', 'Iron Maiden', 'Judas Priest', 'Motley Crue', 'Van Halen', 'Bon Jovi', 'Def Leppard', 'Megadeth', 'Scorpions'],
        '90s': ['Nirvana', 'Pearl Jam', 'Soundgarden', 'Alice In Chains', 'Rage Against The Machine', 'Tool', 'Red Hot Chili Peppers', 'Radiohead', 'The Cranberries', 'Green Day'],
        '00s': ['System Of A Down', 'Linkin Park', 'Disturbed', 'The White Stripes', 'Slipknot', 'Evanescence', 'Foo Fighters', 'The Killers', 'Papa Roach', 'Breaking Benjamin']
      },
      'guitarist': {
        '60s': ['Jimi Hendrix', 'Keith Richards', 'Eric Clapton', 'Pete Townshend', 'Jimmy Page', 'Jeff Beck', 'David Gilmour', 'Jorma Kaukonen', 'John Fogerty', 'George Harrison'],
        '70s': ['Jimmy Page', 'Tony Iommi', 'Ritchie Blackmore', 'Brian May', 'David Gilmour', 'Angus Young', 'Joe Perry', 'Allen Collins', 'Don Felder', 'Ace Frehley'],
        '80s': ['Kirk Hammett', 'Slash', 'Dave Murray', 'K.K. Downing', 'Mick Mars', 'Eddie Van Halen', 'Richie Sambora', 'Phil Collen', 'Marty Friedman', 'Rudolf Schenker'],
        '90s': ['Kurt Cobain', 'Mike McCready', 'Kim Thayil', 'Jerry Cantrell', 'Tom Morello', 'Adam Jones', 'John Frusciante', 'Jonny Greenwood', 'Billie Joe Armstrong', 'Noel Gallagher'],
        '00s': ['Daron Malakian', 'Brad Delson', 'Dan Donegan', 'Jack White', 'Jim Root', 'Ben Moody', 'Dave Grohl', 'Matthew Bellamy', 'Zacky Vengeance', 'Mark Tremonti']
      },
      'turkish': {
        'artist': ['Barış Manço', 'Erkin Koray', 'Cem Karaca', 'Murat Ses', 'Mor ve Ötesi', 'Duman', 'Pentagram/Mezarkabul', 'Hayko Cepkin', 'Kurban', 'Şebnem Ferah'],
        'song': ['Dönence', 'Yine Yalnızım', 'Resimdeki Gözyaşları', 'İşte Hendek İşte Deve', 'Bir Derdim Var', 'Senden Daha Güzel', 'Lions In A Cage', 'Bertaraf Et', 'Yirmi', 'Can Kırıkları']
      }
    };
    
    const questionType = this.settings.questionType === 'mixed' ? 
      (this.correctAnswer === (this.currentTrack.cleanTitle || this.currentTrack.title) ? 'song' : 'artist') : this.settings.questionType;
    
    // Determine era and genre
    let era = '80s';
    let genre = 'rock';
    
    if (this.currentTrack.genreName) {
      const genreLower = this.currentTrack.genreName.toLowerCase();
      if (genreLower.includes('60')) era = '60s';
      else if (genreLower.includes('70')) era = '70s';
      else if (genreLower.includes('80')) era = '80s';
      else if (genreLower.includes('90')) era = '90s';
      else if (genreLower.includes('00') || genreLower.includes('2000')) era = '00s';
      
      if (genreLower.includes('turkish') || genreLower.includes('anatolia')) {
        genre = 'turkish';
      }
    }
    
    let options = [this.correctAnswer];
    
    // Add appropriate fake options
    while (options.length < 4) {
      let optionPool;
      
      if (genre === 'turkish' && enhancedOptions.turkish[questionType]) {
        optionPool = enhancedOptions.turkish[questionType];
      } else if (enhancedOptions[questionType] && enhancedOptions[questionType][era]) {
        optionPool = enhancedOptions[questionType][era];
      } else {
        const allEras = Object.values(enhancedOptions[questionType] || {}).flat();
        optionPool = allEras.length > 0 ? allEras : enhancedOptions.artist['80s'];
      }
      
      const randomOption = optionPool[Math.floor(Math.random() * optionPool.length)];
      
      if (!options.includes(randomOption)) {
        options.push(randomOption);
      }
    }
    
    return this.uiManager.shuffleArray(options);
  }

  // Add continue button for VS modes
  addContinueButton() {
    if (!this.answerSelected) {
      const questionContainer = document.querySelector('.question-container');
      if (questionContainer && !document.getElementById('manual-next-btn')) {
        const nextBtn = document.createElement('button');
        nextBtn.id = 'manual-next-btn';
        nextBtn.className = 'bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4 transition duration-300';
        nextBtn.textContent = 'Continue';
        nextBtn.onclick = () => {
          if (nextBtn.parentNode) {
            nextBtn.parentNode.removeChild(nextBtn);
          }
          this.showRoundCompletionScreen(false);
        };
        questionContainer.appendChild(nextBtn);
      }
    }
  }

  // Handle answer selection
  handleAnswerClick(selectedButton) {
    const selectedAnswer = selectedButton.dataset.answer;
    
    // Mark answer as selected
    this.answerSelected = true;
    this.timerManager.setAnswerSelected(true);
    
    // Stop timers
    this.timerManager.stopTimer();
    this.timerManager.clearPreviewTimeout();
    
    // Check if answer is correct
    const isCorrect = selectedAnswer === this.correctAnswer;
    
    // Update UI
    this.uiManager.markButtonSelected(selectedButton, isCorrect, this.correctAnswer);
    
    // Update score
    if (isCorrect) {
      this.scoreManager.addScore();
      this.uiManager.createConfetti();
    } else {
      // Reduce lives in Marathon mode
      if (this.gameMode === 'solo') {
        this.scoreManager.reduceLives();
      }
    }
    
    // Update multiplayer scores
    if (['versus', 'team', 'coop'].includes(this.gameMode)) {
      this.scoreManager.updatePlayerScore(0, isCorrect ? 1 : 0);
    }
    
    // Continue after delay
    setTimeout(() => this.checkGameProgress(), 2000);
  }

  // Handle timeout (no answer selected)
  handleTimeout() {
    if (this.timerManager.handleTimeout()) {
      // Show timeout UI
      this.uiManager.handleTimeoutUI(this.correctAnswer, this.answerSelected);
      
      // Reduce lives for Marathon mode
      if (this.gameMode === 'solo') {
        this.scoreManager.reduceLives();
      }
      
      // Continue after delay
      setTimeout(() => this.checkGameProgress(), 1200);
    }
  }

  // Check game progress and decide next action
  checkGameProgress() {
    // Check if game should end
    if (this.scoreManager.isGameOver()) {
      this.showRoundCompletionScreen(true);
      return;
    }
    
    // Show round completion screen
    this.showRoundCompletionScreen();
  }

  // Show round completion screen
  showRoundCompletionScreen(isGameOver = false) {
    // Allow music to continue if not paused
    if (this.audioManager.musicPlayer.paused) {
      this.audioManager.stopMusicVisualizer();
    }
    
    // Prepare score data
    const scoreData = {
      ...this.scoreManager.getGameStats(),
      gameMode: this.gameMode,
      avatar: this.settings.avatar || localStorage.getItem('selectedAvatar') || 'avatar1',
      totalRounds: this.totalRounds,
      players: this.scoreManager.players
    };
    
    // Show completion screen
    this.uiManager.showRoundCompletionScreen(
      this.currentTrack,
      scoreData,
      isGameOver,
      () => {
        this.audioManager.pauseMusic();
        
        if (isGameOver || (this.settings.rounds !== 'unlimited' && this.scoreManager.getCurrentRound() >= this.totalRounds)) {
          this.endGame();
        } else {
          this.startNewRound();
        }
      }
    );
  }

  // End the game and show final results
  endGame() {
    this.audioManager.pauseMusic();
    
    const scoreData = {
      ...this.scoreManager.getGameStats(),
      gameMode: this.gameMode,
      avatar: this.settings.avatar || localStorage.getItem('selectedAvatar') || 'avatar1',
      totalRounds: this.totalRounds,
      players: this.scoreManager.getSortedPlayers(),
      playedTracks: this.playedTracks
    };
    
    this.uiManager.showFinalResults(
      scoreData,
      () => window.location.reload(), // Replay
      () => window.location.href = '../../index.html' // Main menu
    );
  }

  // Setup event listeners
  setupEventListeners() {
    // Answer button clicks
    this.uiManager.answerButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (!this.answerSelected) {
          this.handleAnswerClick(e.currentTarget);
        }
      });
    });
    
    // Audio manager page interaction setup
    this.audioManager.setupPageInteractionHandlers();
    
    // Main menu button
    const mainMenuBtn = document.getElementById('mainMenuBtn');
    if (mainMenuBtn) {
      mainMenuBtn.addEventListener('click', () => {
        window.location.href = '../../index.html';
      });
    }
  }

  // Cleanup when game ends
  cleanup() {
    this.timerManager.cleanup();
    this.audioManager.pauseMusic();
  }
}