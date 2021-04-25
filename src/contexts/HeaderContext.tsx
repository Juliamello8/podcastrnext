import { createContext, useState, useContext, ReactNode } from 'react'

type HeaderContextData = {
    isLight: boolean;
    toggleTheme: () => void;
}

type HeaderContextProviderProps = {
    children: ReactNode;
}

export const HeaderContext = createContext({} as HeaderContextData);

export function HeaderContextProvider({ children }: HeaderContextProviderProps) {
    const [isLight, setIsLight] = useState(true);

    function toggleTheme() {
        setIsLight(!isLight);
    }

    return (
        < HeaderContext.Provider value={{
            toggleTheme,
            isLight,
        }} >
            {children}
        </HeaderContext.Provider>
    )
}

export const useHeader = () => {
    return useContext(HeaderContext);
}