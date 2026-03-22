import * as React from "react";
import styled from "styled-components";
import { IntegrationScene } from "~/scenes/Settings/components/IntegrationScene";
import Heading from "~/components/Heading";
import Tab from "~/components/Tab";
import Tabs from "~/components/Tabs";
import { s } from "@shared/styles";
import { CaseStudies } from "./components/CaseStudies";
import { PrinciplesCards } from "./components/PrinciplesCards";
import { ProcessDiagram } from "./components/ProcessDiagram";
import { ProjectSimulator } from "./components/ProjectSimulator";
import { Autodiagnostico } from "./components/Quiz";
import { clearPluginStorage } from "./hooks/usePluginStorage";
import Icon from "./Icon";

type TabId = "simulador" | "casos" | "principios" | "proceso" | "diagnostico";

/**
 * Settings panel for the Social Methodology learning plugin.
 * Tab order: Simulador (do) → Casos (analyze) → Principios → Proceso → Autodiagnóstico.
 * Includes a reset button that clears all persisted learning progress.
 */
function SocialMethodologySettings(): React.ReactElement {
  const [activeTab, setActiveTab] = React.useState<TabId>("simulador");
  const [resetKey, setResetKey] = React.useState(0);
  const [confirming, setConfirming] = React.useState(false);
  const confirmTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const handleTabChange = React.useCallback(
    (tab: TabId) => () => setActiveTab(tab),
    []
  );

  const handleResetClick = React.useCallback(() => {
    if (!confirming) {
      setConfirming(true);
      confirmTimerRef.current = setTimeout(() => setConfirming(false), 4000);
      return;
    }
    if (confirmTimerRef.current) {
      clearTimeout(confirmTimerRef.current);
    }
    clearPluginStorage();
    setResetKey((k) => k + 1);
    setConfirming(false);
  }, [confirming]);

  React.useEffect(
    () => () => {
      if (confirmTimerRef.current) {
        clearTimeout(confirmTimerRef.current);
      }
    },
    []
  );

  return (
    <IntegrationScene title="Metodología Social" icon={<Icon />}>
      <Heading>Metodología Social</Heading>
      <Tabs>
        <Tab
          onClick={handleTabChange("simulador")}
          active={activeTab === "simulador"}
        >
          Simulador
        </Tab>
        <Tab
          onClick={handleTabChange("casos")}
          active={activeTab === "casos"}
        >
          Casos
        </Tab>
        <Tab
          onClick={handleTabChange("principios")}
          active={activeTab === "principios"}
        >
          Principios
        </Tab>
        <Tab
          onClick={handleTabChange("proceso")}
          active={activeTab === "proceso"}
        >
          Proceso
        </Tab>
        <Tab
          onClick={handleTabChange("diagnostico")}
          active={activeTab === "diagnostico"}
        >
          Autodiagnóstico
        </Tab>
      </Tabs>
      {activeTab === "simulador" && (
        <ProjectSimulator key={`simulator-${resetKey}`} />
      )}
      {activeTab === "casos" && (
        <CaseStudies key={`cases-${resetKey}`} />
      )}
      {activeTab === "principios" && (
        <PrinciplesCards key={`principles-${resetKey}`} />
      )}
      {activeTab === "proceso" && (
        <ProcessDiagram key={`process-${resetKey}`} />
      )}
      {activeTab === "diagnostico" && (
        <Autodiagnostico key={`quiz-${resetKey}`} />
      )}
      <Footer>
        <ResetButton $confirming={confirming} onClick={handleResetClick}>
          {confirming ? "¿Seguro? Haz clic para confirmar" : "Reiniciar progreso"}
        </ResetButton>
      </Footer>
    </IntegrationScene>
  );
}

export default SocialMethodologySettings;

const Footer = styled.div`
  margin-top: 32px;
  padding-top: 16px;
  border-top: 1px solid ${s("divider")};
  display: flex;
  justify-content: flex-end;
`;

const ResetButton = styled.button<{ $confirming: boolean }>`
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: ${({ $confirming }) => ($confirming ? "#dc2626" : "")};
  color: ${({ $confirming, theme }) =>
    $confirming ? "#dc2626" : theme.textTertiary};
  cursor: var(--pointer);
  font-weight: ${({ $confirming }) => ($confirming ? "600" : "400")};
  transition: color 150ms ease;

  &:hover {
    color: ${({ $confirming, theme }) =>
      $confirming ? "#b91c1c" : theme.textSecondary};
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;
