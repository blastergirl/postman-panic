import { GameContainer } from './components/game/GameContainer';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-6xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Postman Panic
          </h1>
          <p className="text-gray-400 text-lg">
            Help the postman deliver packages while avoiding obstacles!
          </p>
        </header>
        
        <div className="max-w-4xl mx-auto">
          <GameContainer />
        </div>
        
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>Use arrow keys or WASD to move the postman</p>
        </footer>
      </div>
    </div>
  );
}
