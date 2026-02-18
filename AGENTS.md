# IDEAVIBE - Software Context & Agent Architecture

## 1. System Overview
**Name**: IDEAVIBE
**Purpose**: A startup idea generator that uses personalized user data to generate relevant business concepts.
**Core Technology**: Node.js (Vite + React)
**Theme**: Light, Minimalistic, Modern (Apple/Tesla vibe)
**Languages**:
- **GUI/UI**: Estonian (Eesti keel)
- **Code/Docs**: English

## 2. Design Philosophy
The user interface prioritizes a clean, uncluttered aesthetic with a focus on usability and elegance.
- **Visuals**: Light mode only, high whitespace, subtle shadows, rounded corners.
- **Interaction**: Smooth transitions, "premium" feel.
- **Inspiration**: Apple/Tesla design language.

## 3. Core Functionality
- **User Input**: Users input their personal profile including:
    - Interests (e.g., Sustainability, Fintech)
    - Skills (e.g., Programming, Marketing, Design)
    - Hobbies (e.g., Hiking, Gaming, Photography)
- **Processing**: The system uses **Google Gemini API** to analyze this data and generate startup concepts.
- **Constraint**: Generated startups must aim for **500x capability/impact**, not just 50x.
- **Output**: A curated list of startup ideas tailored to the user.

## 4. Architecture
The system is built on **Node.js** using **Vite + React**.
- **Frontend**: React.
- **Styling**: Vanilla CSS (custom design system).

## 5. Data Model
### User Profile
- **Interests**: Topics or industries the user is passionate about.
- **Skills**: Professional or technical capabilities.
- **Hobbies**: Personal leisure activities.

### Startup Idea
- **Title**: Name of the concept.
- **Description**: Detailed explanation of the business.
- **Relevance**: Why it fits the user's profile (matching skills/interests).
- **Feasibility**: Estimated difficulty or resource requirements.

## 6. Agents (if applicable)
*(Potential for AI agents to generate ideas based on the profile data)*

## 7. Interfaces & APIs
*(List key internal and external interfaces)*
