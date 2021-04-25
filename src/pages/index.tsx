import { GetStaticProps } from 'next' //tipagem
import Image from 'next/image'
import Link from 'next/link'
//com o Link carrega apenas o conteúdo de episodes/id e não todo o conteúdo da tela como header, footer etc
import Head from 'next/head'

import ptBR from 'date-fns/locale/pt-BR'
import { format, parseISO } from 'date-fns'
import { api } from '../services/api'
import { convertDurationToTimeString } from '../utils/convertDurationToTimeString'

import styles from '../pages/home.module.scss'
import { usePlayer } from '../contexts/PlayerContext'
import { useHeader } from '../contexts/HeaderContext';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latesEpisodes: Episode[];
  allEpisodes: Episode[]
}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {
  const { playList } = usePlayer();//usa o context do player
  const { isLight } = useHeader();

  const episodeList = [...latesEpisodes, ...allEpisodes];

  return (
    <div className={isLight ? styles.homepageLight : styles.homepageDark}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={isLight ? styles.latesEpisodesLight : styles.latesEpisodesDark}>
        <h2>Últimos Lançamentos</h2>
        <ul>
          {latesEpisodes.map((episode, index) => {
            return (
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                  objectFit="cover"
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a>{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Play episódio" />
                </button>
              </li>
            )
          })}
        </ul>
      </section>

      <section className={isLight ? styles.allEpisodesLight : styles.allEpisodesDark}>
        <h2>Todos Episódios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th style={{ width: 72 }}></th>
              <th>Podcastr</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (
                <tr key={episode.id}>
                  <td>
                    <Image
                      width={120}
                      height={120}
                      src={episode.thumbnail}
                      alt={episode.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a>{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 100 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latesEpisodes.length)}>
                      <img src="/play-green.svg" alt="Play Episódio" />
                    </button>
                  </td>

                </tr>
              )
            })}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {

  const { data } = await api.get('/episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => ({
    id: episode.id,
    title: episode.title,
    thumbnail: episode.thumbnail,
    members: episode.members,
    duration: Number(episode.file.duration),
    publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
    durationAsString: convertDurationToTimeString(Number(episode.file.duration)),
    url: episode.file.url,
  }))

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length);

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
    revalidate: 60 * 60 * 8, //cada 8h uma nova requisição é feita e atualizada
  }
}