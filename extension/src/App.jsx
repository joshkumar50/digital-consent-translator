import React, { useState } from 'react';
import './App.css'; // This connects our component to the stylesheet

// A new component to smartly display the summary as a color-coded list
const SummaryDisplay = ({ summary }) => {
  // Split the summary string into an array of lines, looking for '*' as the bullet point
  const lines = summary.split('\n').filter(line => line.trim().startsWith('*'));

  // Function to determine the CSS class based on risk labels
  const getRiskClass = (line) => {
    if (line.toLowerCase().includes('(high risk)')) return 'risk-high';
    if (line.toLowerCase().includes('(medium risk)')) return 'risk-medium';
    if (line.toLowerCase().includes('(low risk)')) return 'risk-low';
    return '';
  };

  // If for some reason the AI doesn't return bullet points, show the raw text
  if (lines.length === 0) {
    return <p className="loading-text">{summary}</p>;
  }

  return (
    <div className="summary-container">
      <ul>
        {lines.map((line, index) => (
          <li key={index} className={getRiskClass(line)}>
            {/* Remove the bullet point and risk label for a cleaner look */}
            {line.replace(/^\*\s*/, '').replace(/\((high|medium|low)\srisk\)/i, '').trim()}
          </li>
        ))}
      </ul>
    </div>
  );
};

function App() {
  const [summary, setSummary] = useState("Click 'Summarize Page' to get your AI-powered summary.");
  const [loading, setLoading] = useState(false);
  const [isSummaryComplete, setIsSummaryComplete] = useState(false);

  const summarizePage = async () => {
    setLoading(true);
    setSummary("Extracting text and calling the AI...");
    setIsSummaryComplete(false);

    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) {
        setSummary("Error: Could not find an active tab.");
        setLoading(false);
        return;
    }

    try {
        const response = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: extractPageText,
        });

        const pageText = response[0]?.result;
        if (!pageText) {
            setSummary("Error: Could not extract readable text from this page.");
            setLoading(false);
            return;
        }

        const backendResponse = await fetch('http://127.0.0.1:5000/summarize', {
            method: 'POST',
            mode: 'cors', // Explicitly set CORS mode
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: pageText }),
        });

        if (!backendResponse.ok) {
            throw new Error(`Backend error: ${backendResponse.statusText}`);
        }

        // --- STREAMING LOGIC ---
        const reader = backendResponse.body.getReader();
        const decoder = new TextDecoder();
        let cumulativeSummary = "";
        
        setSummary(""); // Clear the "Analyzing..." message
        setIsSummaryComplete(true); // Switch to display mode early for the stream

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            
            const chunk = decoder.decode(value, { stream: true });
            cumulativeSummary += chunk;
            setSummary(cumulativeSummary);
        }

    } catch (error) {
        console.error("Summarization error:", error);
        setSummary(`Error: ${error.message}`);
        setIsSummaryComplete(false);
    } finally {
        setLoading(false);
    }
  };

  // Improved text extraction function to get more relevant content
  function extractPageText() {
      const body = document.body;
      if (body) {
          const text = Array.from(body.querySelectorAll('p, li, h1, h2, h3'))
                             .map(el => el.textContent.trim())
                             .filter(t => t.length > 50) // Filter for meaningful paragraph lengths
                             .join('\n\n'); // Add spacing between paragraphs for better AI context
          return text;
      }
      return '';
  }

  // --- THIS IS THE CORRECTED AND FINAL RENDER BLOCK ---
  return (
    <div className="app-container">
      <h3>Privacy Guardian</h3>
      <div className="content-area">
        {isSummaryComplete && !loading ? (
          <SummaryDisplay summary={summary} />
        ) : (
          <p className="loading-text">{summary}</p>
        )}
      </div>
      <button onClick={summarizePage} disabled={loading}>
        {loading ? 'Analyzing...' : 'Summarize Page'}
      </button>
    </div>
  );
}

export default App;