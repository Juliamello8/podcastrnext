import { Header } from '../components/Header'
import { Player } from '../components/Player'
import { HeaderContextProvider } from '../contexts/HeaderContext'
import { PlayerContextProvider } from '../contexts/PlayerContext'

import styles from '../styles/app.module.scss'
import '../styles/global.scss'

function MyApp({ Component, pageProps }) {
  return (
    <HeaderContextProvider>
      <PlayerContextProvider>
        <div className={styles.wrapper}>
          <main>
            <Header />
            <Component {...pageProps} />
          </main>
          <Player />
        </div>
      </PlayerContextProvider>
    </HeaderContextProvider>
  )

}

export default MyApp
