import { Suspense } from 'react';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <Suspense 
        fallback={
          <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
            <div className="text-white text-xl">Loading...</div>
          </div>
        }
      >
        <AppRoutes />
      </Suspense>
    </BrowserRouter>
  );
}

export default App;