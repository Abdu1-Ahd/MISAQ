import { BrowserRouter } from 'react-router-dom'
import { AppRouter } from './app/AppRouter'
import { Providers } from './app/providers'
import './App.css'
import { ErrorBoundary } from './app/ErrorBoundary'

export default function App() {
  return <ErrorBoundary><Providers><BrowserRouter><AppRouter /></BrowserRouter></Providers></ErrorBoundary>
}
