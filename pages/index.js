import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto p-4 mt-16 text-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-200">Welcome to the Casino</h1>
      <p className="text-lg mb-6 text-blue-100">
        Play exciting games and climb the leaderboard!
      </p>
      <div className="space-x-4">
        <Link href="/blackjack">
          <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Play Blackjack
          </a>
        </Link>
        <Link href="/roulette">
          <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            Play Roulette
          </a>
        </Link>
        <Link href="/leaderboard">
          <a className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
            View Leaderboard
          </a>
        </Link>
      </div>
    </div>
  );
}