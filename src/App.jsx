import { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai";
import confetti from 'canvas-confetti';

function App() {
  const [formData, setFormData] = useState({
    interests: '',
    skills: '',
    hobbies: ''
  });
  const [gameState, setGameState] = useState('input'); // input, loading, playing
  const [cards, setCards] = useState([]);
  const [error, setError] = useState(null);
  const [gameResult, setGameResult] = useState(null); // 'win', 'lose', or null

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FFD700', '#FFA500', '#0071e3', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FFD700', '#FFA500', '#0071e3', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGameState('loading');
    setCards([]);
    setError(null);
    setGameResult(null);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      // Switching to Gemini 2.0 Flash - The most stable model currently
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-001" });

      const prompt = `
**Role:**
You are a Startup Generator Game Engine.
Create 3 Startup Ideas based on these inputs:
*   **Interests:** ${formData.interests}
*   **Skills:** ${formData.skills}
*   **Hobbies:** ${formData.hobbies}

**Objective:**
Generate a JSON object with a single array \`game_cards\` containing exactly 3 items:
1.  **The Unicorn:** One GENUINE, serious, billion-dollar idea.
    *   \`type\`: "unicorn"
    *   \`valuation\`: "$1 Billion+"
2.  **Dogshit #1:** One ABSOLUTELY TERRIBLE, satirical idea.
    *   \`type\`: "dogshit"
    *   \`valuation\`: "$5"
3.  **Dogshit #2:** Another TERRIBLE, satirical idea.
    *   \`type\`: "dogshit"
    *   \`valuation\`: "A half-eaten sandwich"

**Card Structure:**
{
    "title": "Name",
    "pitch": "Short pitch",
    "valuation": "Value",
    "type": "unicorn" | "dogshit"
}

**Output:**
Return ONLY valid JSON.
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const data = JSON.parse(jsonString);

      // Shuffle the cards
      let shuffled = [...data.game_cards];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Add verified state to each card
      const playableCards = shuffled.map(card => ({
        ...card,
        revealed: false
      }));

      setCards(playableCards);
      setGameState('playing');

    } catch (err) {
      console.error("API Error:", err);
      setError(`Error: ${err.message || err.toString()}`);
      setGameState('input');

      if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        setError("Please add a valid VITE_GEMINI_API_KEY to .env.local!");
      }
    }
  };

  const handleCardClick = (index) => {
    if (cards[0].revealed) return; // Game already over

    // Reveal ALL cards
    const newCards = cards.map(c => ({ ...c, revealed: true }));
    setCards(newCards);

    const clickedCard = cards[index];

    if (clickedCard.type === 'unicorn') {
      setGameResult('win');
      triggerConfetti();
    } else {
      setGameResult('lose');
    }
  };

  const resetGame = () => {
    setGameState('input');
    setCards([]);
    setGameResult(null);
    setFormData({ interests: '', skills: '', hobbies: '' });
  };

  return (
    <div className="container">
      <h1>IDEAVIBE</h1>
      <p className="subtitle">Pick the Unicorn. Avoid the Dogshit. 🦄 vs 💩</p>

      {gameState === 'input' && (
        <div className="card input-card">
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label htmlFor="interests">Interests</label>
              <input
                type="text"
                id="interests"
                placeholder="e.g. Crypto, AI, Space..."
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="skills">Skills</label>
              <input
                type="text"
                id="skills"
                placeholder="e.g. Coding, Sales, Meme-making..."
                value={formData.skills}
                onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
                required
              />
            </div>

            <div className="input-group">
              <label htmlFor="hobbies">Hobbies</label>
              <input
                type="text"
                id="hobbies"
                placeholder="e.g. Surfing, Chess, Sleeping..."
                value={formData.hobbies}
                onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="primary-btn">
              DEAL CARDS
            </button>
          </form>
          {error && <div className="error-msg">{error}</div>}
        </div>
      )}

      {gameState === 'loading' && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Shuffling the deck... 🃏</p>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-board-container">
          <div className={`cards-hand ${gameResult ? 'game-over' : ''}`}>
            {cards.map((card, index) => (
              <div
                key={index}
                className={`game-card ${card.revealed ? 'revealed' : ''} ${card.revealed ? card.type : ''} card-${index}`}
                onClick={() => handleCardClick(index)}
                style={{ '--i': index }}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <div className="card-pattern"></div>
                    <div className="card-logo">🦄</div>
                  </div>
                  <div className="card-back">
                    <div className="result-icon">
                      {card.type === 'unicorn' ? '🦄' : '💩'}
                    </div>
                    <h3 className="card-title">{card.title}</h3>
                    <p className="card-pitch">{card.pitch}</p>
                    <div className="card-valuation">
                      Valuation: <strong>{card.valuation}</strong>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {gameResult && (
            <div className="result-message">
              {gameResult === 'win' ? (
                <h2 className="win-text">YOU FOUND THE UNICORN! 🚀</h2>
              ) : (
                <h2 className="lose-text">YOU STEPPED IN IT! 💩</h2>
              )}
              <button className="reset-btn" onClick={resetGame}>Deal Again</button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
