import { Route, Routes } from "react-router-dom";
import { AppShell } from "./components/layout/AppShell";
import { Overview } from "./pages/Overview";
import { Enrichment } from "./pages/Enrichment";
import { Sequences } from "./pages/Sequences";
import { Pipeline } from "./pages/Pipeline";
import { Analytics } from "./pages/Analytics";
import { Workflows } from "./pages/Workflows";
import { DataQuality } from "./pages/DataQuality";
import { EmailFinder } from "./pages/EmailFinder";

export function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<Overview />} />
        <Route path="/enrichment" element={<Enrichment />} />
        <Route path="/sequences" element={<Sequences />} />
        <Route path="/finder" element={<EmailFinder />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/workflows" element={<Workflows />} />
        <Route path="/data-quality" element={<DataQuality />} />
      </Route>
    </Routes>
  );
}
