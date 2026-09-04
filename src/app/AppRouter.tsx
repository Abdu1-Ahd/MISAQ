import { Navigate, Route, Routes } from 'react-router-dom'
import { RouteGuard } from './RouteGuard'
import { AppShell } from './AppShell'

const Placeholder = ({ title, detail }: { title: string; detail: string }) => <section className="placeholder"><p className="eyebrow">PHASE 0</p><h1>{title}</h1><p>{detail}</p></section>

export function AppRouter() {
  return <Routes>
    <Route path="/sign-in" element={<Placeholder title="Welcome to MISAQ" detail="Sign-in and onboarding arrive in the next phase." />} />
    <Route element={<RouteGuard><AppShell /></RouteGuard>}>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Placeholder title="Your Kameti dashboard" detail="A clear view of every shared savings circle." />} />
      <Route path="/kameti/create" element={<Placeholder title="Create a Kameti" detail="Set the amount, frequency, and member cap." />} />
      <Route path="/kameti/join" element={<Placeholder title="Join a Kameti" detail="Invite links and QR joining arrive in the next phase." />} />
      <Route path="/kameti/:id/manager" element={<Placeholder title="Manager view" detail="Turn order and payment controls arrive in the next phase." />} />
      <Route path="/kameti/:id/contributor" element={<Placeholder title="Contributor view" detail="Your turn and payment status will live here." />} />
      <Route path="/archive" element={<Placeholder title="Archive" detail="Completed Kametis will be kept here." />} />
      <Route path="*" element={<Placeholder title="Page not found" detail="That destination does not exist." />} />
    </Route>
  </Routes>
}
