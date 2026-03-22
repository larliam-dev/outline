import * as React from "react";
import { IntegrationScene } from "~/scenes/Settings/components/IntegrationScene";
import Heading from "~/components/Heading";
import Tab from "~/components/Tab";
import Tabs from "~/components/Tabs";
import { PrinciplesCards } from "./components/PrinciplesCards";
import { ProcessDiagram } from "./components/ProcessDiagram";
import { ProjectSimulator } from "./components/ProjectSimulator";
import { Quiz } from "./components/Quiz";
import Icon from "./Icon";

type TabId = "principios" | "proceso" | "quiz" | "simulador";

/**
 * Settings panel for the Social Methodology learning plugin.
 * Provides four interactive sections: principles, process diagram, quiz,
 * and project simulator.
 */
function SocialMethodologySettings(): React.ReactElement {
  const [activeTab, setActiveTab] = React.useState<TabId>("principios");

  const handleTabChange = React.useCallback(
    (tab: TabId) => () => setActiveTab(tab),
    []
  );

  return (
    <IntegrationScene title="Metodología Social" icon={<Icon />}>
      <Heading>Metodología Social</Heading>
      <Tabs>
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
        <Tab onClick={handleTabChange("quiz")} active={activeTab === "quiz"}>
          Quiz
        </Tab>
        <Tab
          onClick={handleTabChange("simulador")}
          active={activeTab === "simulador"}
        >
          Simulador
        </Tab>
      </Tabs>
      {activeTab === "principios" && <PrinciplesCards />}
      {activeTab === "proceso" && <ProcessDiagram />}
      {activeTab === "quiz" && <Quiz />}
      {activeTab === "simulador" && <ProjectSimulator />}
    </IntegrationScene>
  );
}

export default SocialMethodologySettings;
