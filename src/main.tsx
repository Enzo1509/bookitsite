import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { initializeSystem } from './lib/system';

// Create loading component
const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="text-center">
      <div className="w-10 h-10 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-gray-600 text-sm">Chargement...</p>
    </div>
  </div>
);

// Initialize the application
async function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  const root = createRoot(rootElement);

  // Show loading screen
  root.render(<LoadingScreen />);

  try {
    // Initialize the system
    await initializeSystem();
    
    // Render the application
    root.render(
      <StrictMode>
        <App />
      </StrictMode>
    );
  } catch (error) {
    console.error('Failed to initialize application:', error);
    root.render(
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-6">
          <h1 className="text-red-600 text-xl font-semibold mb-4">Erreur de l'application</h1>
          <p className="text-gray-600">Une erreur est survenue lors du chargement. Veuillez rafraîchir la page.</p>
        </div>
      </div>
    );
  }
}

// Start initialization
init();