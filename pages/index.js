import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4 text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Casino</h1>
      <p className="text-lg mb-6">Play exciting games and climb the leaderboard!</p>
      <div className="space-x-4">
        <Link href="/blackjack">
          <a className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
            Play Blackjack
          </a>
        </Link>
        <Link href="/roulette">
          <a className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
            Play Roulette
          </a>
        </Link>
        <Link href="/leaderboard">
          <a className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600">
            View Leaderboard
          </a>
        </Link>
      </div>
    </div>
  );
}