import React from 'react'
import { Header } from "./components/header"
import { DAppProvider, ChainId } from '@usedapp/core'
import { getTextOfJSDocComment } from 'typescript'
import { Container } from "@material-ui/core"
import { Main } from './components/Main'


function App() {
  return (
    <DAppProvider config={{
      supportedChains: [ChainId.Kovan],
      notifications: {
        expirationPeriod: 1000,
        checkInterval: 1000,

      }
    }}>
      <Header />
      <Container maxWidth='md'>
        <Main></Main>
      </Container>
    </DAppProvider>

  );
}

export default App;
