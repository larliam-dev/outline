import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";

interface Step {
  id: string;
  label: string;
  subtitle: string;
  detail: string;
  keyQuestion: string;
  trap: string;
}

const steps: Step[] = [
  {
    id: "problema",
    label: "Problema",
    subtitle: "Falla u oportunidad",
    detail:
      "Identifica claramente la falla u oportunidad que quieres abordar. Sin un problema bien definido, el resto del proceso no tiene dirección.",
    keyQuestion:
      "¿Puedes describir el problema en una sola oración sin mencionar ninguna solución?",
    trap:
      "Confundir el problema con la solución. "Necesitamos más contenido" es una solución, no un problema.",
  },
  {
    id: "data",
    label: "Data",
    subtitle: "Contexto y audiencia",
    detail:
      "Reúne datos sobre el contexto y la audiencia. ¿Quiénes son? ¿Qué consumen? ¿Qué les preocupa? Los intereses importan más que la demografía.",
    keyQuestion:
      "¿Sabes qué consumen a diario, qué les preocupa y qué les emociona?",
    trap:
      "Quedarse con datos demográficos (edad, género, país) en lugar de intereses, comportamientos y dolores reales.",
  },
  {
    id: "tension",
    label: "Tensión",
    subtitle: "Dolor o frustración",
    detail:
      "Encuentra el dolor o la frustración que vive tu audiencia. La tensión es el puente emocional entre el problema y la solución.",
    keyQuestion:
      "¿Qué emoción vive tu audiencia cuando enfrenta este problema? ¿Frustración, miedo, vergüenza, ansiedad?",
    trap:
      "Confundir la tensión con el problema. La tensión es emocional — cómo vive la persona la situación, no la situación en sí.",
  },
  {
    id: "insight",
    label: "Insight",
    subtitle: "Hallazgo accionable",
    detail:
      "Formula un hallazgo accionable: una verdad no obvia sobre tu audiencia que abre la puerta a una solución creativa.",
    keyQuestion:
      "¿Puedes completar esta frase? "Parece que X, pero en realidad Y."",
    trap:
      "Llamar insight a una observación obvia. Si cualquiera lo diría sin pensarlo, profundiza más.",
  },
  {
    id: "idea",
    label: "Idea",
    subtitle: "Solución creativa",
    detail:
      "Desarrolla la solución creativa a partir del insight. Debe responder directamente a la tensión identificada.",
    keyQuestion:
      "¿Tu idea resuelve directamente la tensión del paso anterior? ¿Hay conexión emocional clara?",
    trap:
      "Enamorarse de una idea brillante que no tiene conexión con la tensión real. Sin esa conexión, no conecta con nadie.",
  },
  {
    id: "contenido",
    label: "Contenido",
    subtitle: "Piezas concretas",
    detail:
      "Convierte la idea en piezas de contenido concretas: artículos, videos, posts, guías, etc. El contenido es la manifestación tangible de la idea.",
    keyQuestion:
      "¿Puedes decir exactamente qué vas a producir, en qué formato y en qué canal?",
    trap:
      "Producir mucho sin criterio. El contenido debe ser la manifestación exacta de la idea, no relleno para llenar el calendario.",
  },
  {
    id: "distribucion",
    label: "Distribución",
    subtitle: "Alcance y empuje",
    detail:
      "Planifica cómo llegar a tu audiencia. El mejor contenido sin distribución no existe. Define canales, formatos y estrategia de amplificación.",
    keyQuestion:
      "¿Tienes al menos 2-3 puntos de contacto activos con tu audiencia, más allá de publicar y esperar?",
    trap:
      "Asumir que con publicarlo ya llega. Publicar no es distribuir. Sin distribución activa, el mejor contenido no existe.",
  },
  {
    id: "aprendizaje",
    label: "Aprendizaje",
    subtitle: "Ajuste y optimización",
    detail:
      "Mide, aprende y ajusta. Los ciclos cortos de aprendizaje permiten mejorar continuamente sin esperar al reporte mensual. Este paso retroalimenta el Problema del siguiente ciclo.",
    keyQuestion:
      "¿Qué señales, en los primeros 3 días, te dirán si debes ajustar o seguir?",
    trap:
      "Esperar el reporte mensual. Los ciclos cortos requieren métricas de días, no de meses.",
  },
];

/**
 * Interactive visualization of the 8-step Social Methodology process.
 * Presented as a cycle. Click on any step to reveal its description,
 * key question, and common trap.
 */
export function ProcessDiagram(): React.ReactElement {
  const [activeStep, setActiveStep] = React.useState<string | null>(null);

  const handleStepClick = React.useCallback(
    (id: string) => {
      setActiveStep(activeStep === id ? null : id);
    },
    [activeStep]
  );

  const activeStepData = steps.find((st) => st.id === activeStep);

  return (
    <Container>
      <Intro>
        Cada proyecto importante debe pasar por estos pasos. En el día a día
        pueden ser rápidos, pero no opcionales. El proceso es un{" "}
        <strong>ciclo</strong>: Aprendizaje siempre vuelve a Problema.
      </Intro>
      <StepsRow>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepNode
              $active={activeStep === step.id}
              onClick={() => handleStepClick(step.id)}
              role="button"
              aria-expanded={activeStep === step.id}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleStepClick(step.id);
                }
              }}
            >
              <StepBox $active={activeStep === step.id}>
                <StepLabel>{step.label}</StepLabel>
              </StepBox>
              <StepSubtitle>{step.subtitle}</StepSubtitle>
            </StepNode>
            {index < steps.length - 1 && <Arrow aria-hidden>→</Arrow>}
          </React.Fragment>
        ))}
      </StepsRow>
      <CycleLabel>↩ Aprendizaje vuelve a Problema — el proceso nunca termina</CycleLabel>
      {activeStepData ? (
        <DetailPanel>
          <DetailTitle>
            <DetailBadge>{activeStepData.label}</DetailBadge>
            {activeStepData.subtitle}
          </DetailTitle>
          <DetailText>{activeStepData.detail}</DetailText>
          <DetailSection>
            <DetailSectionLabel>Pregunta clave</DetailSectionLabel>
            <DetailSectionText>{activeStepData.keyQuestion}</DetailSectionText>
          </DetailSection>
          <TrapSection>
            <DetailSectionLabel>⚠ Trampa común</DetailSectionLabel>
            <DetailSectionText>{activeStepData.trap}</DetailSectionText>
          </TrapSection>
        </DetailPanel>
      ) : (
        <Hint>Haz clic en cualquier paso para ver la pregunta clave y la trampa más común.</Hint>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Intro = styled.p`
  color: ${s("textSecondary")};
  font-size: 15px;
  margin: 0 0 8px;
  line-height: 1.6;
`;

const StepsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: 4px 0;
`;

const StepNode = styled.div<{ $active: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: var(--pointer);
  flex-shrink: 0;

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
    border-radius: 6px;
  }
`;

const StepBox = styled.div<{ $active: boolean }>`
  border: 2px solid
    ${({ $active, theme }) => ($active ? theme.accent : theme.divider)};
  border-radius: 8px;
  padding: 8px 12px;
  background: ${({ $active, theme }) =>
    $active ? `${theme.accent}1a` : theme.background};
  transition:
    border-color 150ms ease,
    background 150ms ease;
  white-space: nowrap;

  &:hover {
    border-color: ${s("accent")};
  }
`;

const StepLabel = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${s("text")};
`;

const StepSubtitle = styled.span`
  font-size: 11px;
  color: ${s("textTertiary")};
  margin-top: 4px;
  text-align: center;
  max-width: 80px;
  white-space: normal;
  word-break: break-word;
`;

const Arrow = styled.span`
  color: ${s("textTertiary")};
  font-size: 16px;
  align-self: flex-start;
  margin-top: 12px;
  padding: 0 4px;
  flex-shrink: 0;
`;

const CycleLabel = styled.p`
  font-size: 12px;
  color: ${s("textTertiary")};
  margin: 0;
  font-style: italic;
`;

const DetailPanel = styled.div`
  border: 1.5px solid ${s("divider")};
  border-radius: 10px;
  padding: 16px 20px;
  background: ${s("backgroundSecondary")};
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const DetailTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const DetailBadge = styled.span`
  background: ${s("accent")};
  color: ${s("accentText")};
  border-radius: 5px;
  padding: 2px 8px;
  font-size: 12px;
`;

const DetailText = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.6;
`;

const DetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  background: ${({ theme }) => `${theme.accent}0d`};
  border: 1px solid ${({ theme }) => `${theme.accent}33`};
`;

const TrapSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 10px 12px;
  border-radius: 8px;
  background: #f9731611;
  border: 1px solid #f9731644;
`;

const DetailSectionLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${s("textTertiary")};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailSectionText = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.5;
`;

const Hint = styled.p`
  font-size: 13px;
  color: ${s("textTertiary")};
  margin: 0;
  text-align: center;
  font-style: italic;
`;
