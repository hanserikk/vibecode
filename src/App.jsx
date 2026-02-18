import { useState } from 'react'
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [formData, setFormData] = useState({
    interests: '',
    skills: '',
    hobbies: ''
  });
  const [ideas, setIdeas] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setIdeas(null);
    setError(null);

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      // Using Gemini 3 Pro - the future flagship model (Projected for 2026 availability)
      const model = genAI.getGenerativeModel({ model: "gemini-3-pro" });

      const prompt = `
**Role:**
You are a world-class Venture Capitalist and Visionary Startup Founder known for spotting "Unicorn" opportunities (startups with $1B+ potential). Your specialty is finding non-obvious intersections between a founder's personal traits and massive market gaps.

**Task:**
Analyze the user's input data:
1. **Interests:** ${formData.interests}
2. **Skills:** ${formData.skills}
3. **Hobbies:** ${formData.hobbies}

**Objective:**
Generate 3 distinct, high-growth startup ideas that synthesize these three areas. Do not generate small business ideas (like a consulting firm or a local shop). Generate scalable, "500x potential" technology or platform plays.

**Guidelines for Idea Generation:**
* **The Intersection:** Look for the "Blue Ocean." How can a specific skill (e.g., Coding) apply to a hobby (e.g., Gardening) in a way that disrupts the industry?
* **Scalability:** The idea must be software-based, a platform, or a high-tech product that can scale globally.
* **Differentiation:** Avoid generic ideas. Think weird, contrarian, and visionary.

**Output Format:**
Please respond in the same language as the user's input (Estonian). 

IMPORTANT: Return functionality strictly as a JSON array with the following keys for each idea: "title", "pitch", "concept", "monetization", "mvp".
Do not use Markdown code blocks.

Example structure:
[
  {
    "title": "Startup Name",
    "pitch": "The Unicorn Pitch",
    "concept": "The Core Concept",
    "monetization": "Monetization details",
    "mvp": "MVP Strategy"
  }
]
        `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Clean up markdown code blocks if present
      const jsonString = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const ideasData = JSON.parse(jsonString);

      setIdeas(ideasData);
    } catch (err) {
      console.error("API Error:", err);
      setError(`Viga: ${err.message || err.toString()}\n\nKontrolli konsooli detailideks.`);

      // Fallback for demo if API fails/key missing
      if (!import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY === 'YOUR_API_KEY_HERE') {
        setError("Palun lisa .env.local faili kehtiv VITE_GEMINI_API_KEY!");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>IDEAVIBE</h1>
      <p className="subtitle">Loo järgmine ükssarvik. 500x potentsiaal.</p>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="interests">Huvid (Interests)</label>
            <input
              type="text"
              id="interests"
              placeholder="Nt. Tehnoloogia, Rahandus, Jätkusuutlikkus..."
              value={formData.interests}
              onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="skills">Oskused (Skills)</label>
            <input
              type="text"
              id="skills"
              placeholder="Nt. Programmeerimine, Turundus, Disain..."
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="hobbies">Hobid (Hobbies)</label>
            <input
              type="text"
              id="hobbies"
              placeholder="Nt. Matkamine, Lugemine, Kokkamine..."
              value={formData.hobbies}
              onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })}
              required
            />
          </div>

          <button type="submit" className="primary-btn" disabled={loading}>
            {loading ? 'GENEREERIN...' : 'GENEREERI IDEED'}
          </button>
        </form>
      </div>

      {loading && (
        <div className="loading-container">
          <div className="spinner"></div>
          <p style={{ marginTop: '20px', color: '#86868b' }}>Analüüsin profiili... Otsin 500x potentsiaali...</p>
        </div>
      )}

      {error && (
        <div style={{ color: 'red', textAlign: 'center', marginTop: '20px', whiteSpace: 'pre-wrap' }}>
          {error}
        </div>
      )}

      {ideas && (
        <div className="results-section">
          <h2 className="results-header">Sinu Sobivaimad Startupid</h2>
          {ideas.map((idea, index) => (
            <div key={index} className="idea-card">
              <div className="idea-title">{idea.title}</div>
              <div className="idea-desc"><strong>🦄 Pitch:</strong> {idea.pitch}</div>
              <div className="idea-detail">
                <p><strong>💡 Kontseptsioon:</strong> {idea.concept}</p>
                <p><strong>💰 Monetiseerimine:</strong> {idea.monetization}</p>
                <p><strong>🛠 MVP:</strong> {idea.mvp}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
