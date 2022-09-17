import './styles/main.css'
import { useState, useEffect} from 'react'

import logoImg from './assets/Logo.svg'
import { GameBanner } from './components/GameBanner'

import { CreateAdBanner } from './components/CreateAdBanner'

interface Game {
  id: string;
  title: string;
  bannerUrl: string;
  _count: {
    ads: number;
  }
}

function App() {
  const [games, setGames] = useState([])

  useEffect(() => {
    fetch('http://localhost:3333/games')
    .then(res => res.json())
    .then(data => {
      setGames(data)
    })
  }, [])

  return (
    <div className= "max-w-[1344px] mx-auto flex flex-col items-center my-20">
      <img src={logoImg} alt="" />

      <h1 className="text-6xl text-white font-black mt-20">
        Seu <span className='text-transparent bg-nlw-gradient bg-clip-text'>duo</span> está aqui.
      </h1>

      <div className="grid grid-cols-6 gap-6 mt-16">
        <GameBanner bannerUrl='/image1.png' title="League of Legends" adsCount={5}/>
        <GameBanner bannerUrl='/image2.png' title="League of Legends" adsCount={5}/>
        <GameBanner bannerUrl='/image3.png' title="League of Legends" adsCount={5}/>
        <GameBanner bannerUrl='/image4.png' title="League of Legends" adsCount={5}/>
        <GameBanner bannerUrl='/image5.png' title="League of Legends" adsCount={5}/>
        <GameBanner bannerUrl='/image6.png' title="League of Legends" adsCount={5}/>
      </div>

      <CreateAdBanner />

    </div>
  )
}

export default App
