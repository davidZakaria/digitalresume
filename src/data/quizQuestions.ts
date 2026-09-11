import { shuffle } from '../lib/random'

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correctIndex: number
}

type QuizSourceItem = {
  id: string
  question: string
  answer: string
  wrong: string[]
}

function buildQuestions(): QuizSourceItem[] {
  return [
    {
      id: 'france',
      question: 'The capital of France is:',
      answer: 'Paris',
      wrong: ['Lyon', 'Marseille', 'Brussels'],
    },
    {
      id: 'h2o',
      question: 'The chemical formula H₂O refers to:',
      answer: 'Water',
      wrong: ['Salt', 'Carbon dioxide', 'Hydrogen peroxide'],
    },
    {
      id: 'jupiter',
      question: 'The largest planet in our solar system is:',
      answer: 'Jupiter',
      wrong: ['Saturn', 'Neptune', 'Earth'],
    },
    {
      id: 'ww2',
      question: 'World War II in Europe is most commonly said to have ended in:',
      answer: '1945',
      wrong: ['1918', '1939', '1950'],
    },
    {
      id: 'dna',
      question: 'DNA stands for:',
      answer: 'Deoxyribonucleic acid',
      wrong: ['Dinitrogen acid', 'Dual nucleus array', 'Dynamic ribon acid'],
    },
    {
      id: 'mona',
      question: 'The Mona Lisa hangs in the Louvre and was painted by:',
      answer: 'Leonardo da Vinci',
      wrong: ['Michelangelo', 'Raphael', 'Vincent van Gogh'],
    },
    {
      id: 'continents',
      question: 'The commonly taught number of continents is:',
      answer: '7',
      wrong: ['5', '6', '8'],
    },
    {
      id: 'prime',
      question: 'The smallest prime number is:',
      answer: '2',
      wrong: ['1', '3', '0'],
    },
    {
      id: 'photosynthesis',
      question: 'Plants release which gas into the air during photosynthesis?',
      answer: 'Oxygen',
      wrong: ['Carbon monoxide', 'Nitrogen', 'Helium'],
    },
    {
      id: 'nile',
      question: 'The Nile River flows predominantly:',
      answer: 'Northward',
      wrong: ['Southward', 'Eastward only', 'Westward only'],
    },
    {
      id: 'mars',
      question: 'Mars is often called the:',
      answer: 'Red Planet',
      wrong: ['Blue Planet', 'Ringed Planet', 'Ice Giant'],
    },
    {
      id: 'speed-sound',
      question: 'At sea level, sound travels roughly this fast in dry air:',
      answer: 'About 340 m/s',
      wrong: ['About 3 m/s', 'About 3,000 m/s', 'Faster than light'],
    },
    {
      id: 'haiku',
      question: 'A traditional Japanese haiku has how many lines?',
      answer: 'Three',
      wrong: ['One', 'Four', 'Five'],
    },
    {
      id: 'ocean',
      question: 'The largest ocean on Earth is the:',
      answer: 'Pacific Ocean',
      wrong: ['Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
    },
    {
      id: 'brain',
      question: 'The human organ that uses about 20% of the body’s resting energy is the:',
      answer: 'Brain',
      wrong: ['Liver', 'Heart', 'Kidneys'],
    },
  ]
}

export function createQuizRound(questionCount = 10): QuizQuestion[] {
  const raw = shuffle(buildQuestions()).slice(0, questionCount)
  return raw.map((q) => {
    const options = shuffle([q.answer, ...q.wrong])
    const correctIndex = options.indexOf(q.answer)
    return {
      id: q.id,
      question: q.question,
      options,
      correctIndex,
    }
  })
}
