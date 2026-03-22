import * as React from "react";
import { IntegrationScene } from "~/scenes/Settings/components/IntegrationScene";
import Heading from "~/components/Heading";
import Tab from "~/components/Tab";
import Tabs from "~/components/Tabs";
import { PrinciplesCards } from "./components/PrinciplesCards";
import { ProcessDiagram } from "./components/ProcessDiagram";
import { ProjectSimulator } from "./components/ProjectSimulator";
import { Autodiagnostico } from "./components/Quiz";
import Icon from "./Icon";

type TabId = "simulador" | "principios" | "proceso" | "diagnostico";

/**
 * Settings panel for the Social Methodology learning plugin.
 * Tabs ordered to lead with doing (Simulador) before reading (Principios, Proceso).
 * The Quiz has been replaced by a self-assessment Autodiagnóstico.
 */
function SocialMethodologySettings(): React.ReactElement {
  const [activeTab, setActiveTab] = React.useState<TabId>("simulador");

  const handleTabChange = React.useCallback(
    (tab: TabId) => () => setActiveTab(tab),
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
      {activeTab === "simulador" && <ProjectSimulator />}
      {activeTab === "principios" && <PrinciplesCards />}
      {activeTab === "proceso" && <ProcessDiagram />}
      {activeTab === "diagnostico" && <Autodiagnostico />}
    </IntegrationScene>
  );
}

export default SocialMethodologySettings;
