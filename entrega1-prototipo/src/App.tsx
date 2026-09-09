import { Navigate, Route, Routes } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { PixFlowProvider } from "@/lib/PixFlow";
import { Home } from "@/screens/Home";
import { Statement } from "@/screens/Statement";
import { TransactionDetail } from "@/screens/TransactionDetail";
import { PixHub } from "@/screens/PixHub";
import { PixRecipient } from "@/screens/PixRecipient";
import { PixAmount } from "@/screens/PixAmount";
import { PixConfirm } from "@/screens/PixConfirm";
import { PixSuccess } from "@/screens/PixSuccess";
import { Receipt } from "@/screens/Receipt";
import { Cards } from "@/screens/Cards";
import { Notifications } from "@/screens/Notifications";
import { More } from "@/screens/More";
import { Login } from "@/screens/Login";

/**
 * Rotas reais no lugar do estado interno usado pelo Figma Make.
 * Cada tela ganha URL própria — o que dá deep link, botão voltar do
 * navegador e captura de screenshot reprodutível.
 */
export default function App() {
  return (
    <PixFlowProvider>
      <Routes>
        {/* Telas com navegação inferior */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/extrato" element={<Statement />} />
          <Route path="/pix" element={<PixHub />} />
          <Route path="/cartoes" element={<Cards />} />
          <Route path="/mais" element={<More />} />
        </Route>

        {/* Telas de fluxo, sem navegação inferior */}
        <Route element={<Layout withNav={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/transacao/:id" element={<TransactionDetail />} />
          <Route path="/pix/destino" element={<PixRecipient />} />
          <Route path="/pix/valor" element={<PixAmount />} />
          <Route path="/pix/confirmar" element={<PixConfirm />} />
          <Route path="/pix/sucesso" element={<PixSuccess />} />
          <Route path="/comprovante/:id" element={<Receipt />} />
          <Route path="/notificacoes" element={<Notifications />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PixFlowProvider>
  );
}
