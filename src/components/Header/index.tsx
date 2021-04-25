import format from 'date-fns/format'
import ptBR from 'date-fns/locale/pt-BR'
import { useHeader } from '../../contexts/HeaderContext';

import styles from './styles.module.scss';

export function Header() {
    const currentDate = format(new Date(), 'EEEEEE, d MMMM', {
        locale: ptBR,
    });// Qui, 8 Abril

    const { isLight, toggleTheme } = useHeader();

    return (
        <header className={isLight
            ? styles.headerContainerLight
            : styles.headerContainerDark}>
            <a href={'/'}>
                <img src={isLight ? "/logo-light.svg" : "/logo-dark.svg"} alt="Podcastr" />
            </a>
            <p>O melhor para você ouvir, sempre</p>
            <span>{currentDate}</span>
            <button type="button" onClick={toggleTheme}>
                <img
                    className={styles.theme}
                    src={isLight ? "/dark.svg" : "/light.svg"}
                    alt={isLight ? "Tema Dark" : "Tema Light"}
                />
            </button>
        </header >
    );
}