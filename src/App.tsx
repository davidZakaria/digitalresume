import { Navigate, Route, Routes } from 'react-router-dom'
import { GamesLayout } from './layouts/GamesLayout'
import { BreakoutGamePage } from './pages/BreakoutGamePage'
import { DinoGamePage } from './pages/DinoGamePage'
import { Game2048Page } from './pages/Game2048Page'
import { GamesHub } from './pages/GamesHub'
import { LightsOutGamePage } from './pages/LightsOutGamePage'
import { QuizGamePage } from './pages/QuizGamePage'
import { ReactionGamePage } from './pages/ReactionGamePage'
import { ResumePage } from './pages/ResumePage'
import { SnakeGamePage } from './pages/SnakeGamePage'
import { StackMatchPage } from './pages/StackMatchPage'
import { TypingGamePage } from './pages/TypingGamePage'
import { WordSearchGamePage } from './pages/WordSearchGamePage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<ResumePage />} />
      <Route path="/game" element={<GamesLayout />}>
        <Route index element={<GamesHub />} />
        <Route path="stack-match" element={<StackMatchPage />} />
        <Route path="reaction" element={<ReactionGamePage />} />
        <Route path="typing" element={<TypingGamePage />} />
        <Route path="quiz" element={<QuizGamePage />} />
        <Route path="snake" element={<SnakeGamePage />} />
        <Route path="offline-runner" element={<DinoGamePage />} />
        <Route path="2048" element={<Game2048Page />} />
        <Route path="breakout" element={<BreakoutGamePage />} />
        <Route path="word-search" element={<WordSearchGamePage />} />
        <Route path="ship-grid" element={<LightsOutGamePage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
