import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";
import { usePluginStorage } from "../hooks/usePluginStorage";
import { trackEvent } from "../utils/trackEvent";

interface StepConfig {
  id: string;
  label: string;
  subtitle: string;
  prompt: string;
  placeholder: string;
  trap: string;
  hint: string;
  example: string;
}

const stepConfigs: StepConfig[] = [
  {
    id: "problema",
    label: "Problema",
    subtitle: "Falla u oportunidad",
    prompt: "¿Cuál es la falla u oportunidad que detectaste?",
    placeholder:
      "Ej: Los equipos de contenido no tienen un proceso claro y cada pieza se hace de forma diferente, lo que genera desperdicio y resultados inconsistentes.",
    trap:
      "Si tu respuesta empieza con "hacer", "crear" o "lanzar"... estás describiendo una solución, no un problema. Vuelve a la pregunta.",
    hint: "Sé específico. Evita decir "mejorar X" sin explicar qué falla concreta quieres resolver.",
    example:
      "Los equipos de redes sociales trabajan muchas horas pero no tienen un marco común para pensar el contenido. Cada semana improvisan, lo que genera ansiedad y piezas sin hilo conductor.",
  },
  {
    id: "data",
    label: "Data",
    subtitle: "Contexto y audiencia",
    prompt:
      "¿Quiénes son las personas afectadas por este problema? ¿Qué sabes de ellas (intereses, consumo, dolores)?",
    placeholder:
      "Ej: Líderes de contenido de medianas empresas. Consumen newsletters de marketing, siguen referentes en LinkedIn. Les frustra la falta de estructura.",
    trap:
      "Si solo escribiste edad, género o país, tienes demografía, no data. ¿Qué consumen a diario? ¿Qué les preocupa?",
    hint: "Recuerda: intereses > demografía. No te quedes con "25-35 años, Colombia".",
    example:
      "Coordinadores de contenido de empresas medianas (10-50 personas). Consumen The Hustle, referentes de LinkedIn marketing. Buscan validación de su trabajo. Les preocupa no tener impacto visible.",
  },
  {
    id: "tension",
    label: "Tensión",
    subtitle: "Dolor o frustración",
    prompt:
      "¿Cuál es el dolor o la frustración central que vive tu audiencia en relación al problema?",
    placeholder:
      "Ej: Sienten que producen mucho pero publican sin norte, lo que les genera ansiedad y sensación de no avanzar.",
    trap:
      "Si tu tensión suena racional ("no tienen información suficiente"), profundiza: ¿cómo los hace sentir eso? ¿Frustración? ¿Miedo? ¿Vergüenza?",
    hint: "La tensión es emocional. ¿Qué les duele, qué les genera alivio, qué les da orgullo?",
    example:
      "Sienten que trabajan mucho y producen poco impacto. Les da vergüenza no poder explicar por qué hicieron una pieza. Quieren sentir que su trabajo tiene sentido y dirección.",
  },
  {
    id: "insight",
    label: "Insight",
    subtitle: "Hallazgo accionable",
    prompt:
      "¿Cuál es la verdad no obvia sobre tu audiencia que abre la puerta a una solución?",
    placeholder:
      "Ej: Los equipos no necesitan más herramientas, necesitan un lenguaje común para pensar el contenido.",
    trap:
      "Si cualquiera lo diría sin pensarlo, no es un insight. Prueba la frase: "Parece que X, pero en realidad Y."",
    hint: "Un buen insight es incómodo porque dice algo que todos intuyen pero nadie se atreve a decir.",
    example:
      "Parece que el problema es falta de tiempo, pero en realidad es falta de un proceso. Con el mismo tiempo y un marco claro, producirían el doble con la mitad de angustia.",
  },
  {
    id: "idea",
    label: "Idea",
    subtitle: "Solución creativa",
    prompt: "¿Qué solución creativa propones a partir del insight?",
    placeholder:
      "Ej: Una guía práctica que enseña el proceso de 8 pasos con ejemplos reales, para que el equipo hable el mismo idioma.",
    trap:
      "¿Tu idea resuelve directamente la tensión del paso anterior? Si no hay conexión emocional, revisa.",
    hint: "La idea debe hacer sentir alivio, orgullo o pertenencia — no solo dar información.",
    example:
      "Un simulador interactivo donde el equipo aplica los 8 pasos a un proyecto real antes de producir. No es teoría — es práctica guiada que genera confianza y lenguaje compartido.",
  },
  {
    id: "contenido",
    label: "Contenido",
    subtitle: "Piezas concretas",
    prompt:
      "¿Qué piezas concretas vas a producir para materializar la idea?",
    placeholder:
      "Ej: 1 guía descargable PDF, 8 posts de LinkedIn explicando cada paso, 1 webinar introductorio.",
    trap:
      "Evita "hacer contenido de valor". Define formato exacto (video, artículo, post), canal y cantidad.",
    hint: "Sé concreto: formato, canal, cantidad. El contenido es la manifestación tangible de tu idea.",
    example:
      "1 herramienta web interactiva con los 8 pasos. 6 posts de LinkedIn con ejemplos de cada principio. 1 sesión de taller de 90 min con el equipo. 1 plantilla descargable para usar en proyectos.",
  },
  {
    id: "distribucion",
    label: "Distribución",
    subtitle: "Alcance y empuje",
    prompt:
      "¿Cómo vas a hacer llegar el contenido a tu audiencia? ¿Por qué canales y con qué estrategia?",
    placeholder:
      "Ej: LinkedIn orgánico + newsletter a base existente + alianza con 2 referentes del sector para difusión.",
    trap:
      "Publicar no es distribuir. ¿Qué vas a hacer activamente para que llegue? Sin distribución, el mejor contenido no existe.",
    hint: "Define al menos 2-3 puntos de contacto activos con tu audiencia.",
    example:
      "LinkedIn orgánico (3 posts/semana por 2 semanas). Email a base de 500 suscriptores. Alianza con 2 comunidades de comunicadores para compartir la herramienta. DMs directos a 20 contactos clave.",
  },
  {
    id: "aprendizaje",
    label: "Aprendizaje",
    subtitle: "Ajuste y optimización",
    prompt:
      "¿Cómo vas a medir el éxito? ¿Qué señales te indicarán que debes ajustar?",
    placeholder:
      "Ej: Reviso descargas, comentarios en LinkedIn y respuestas al newsletter en la primera semana. Si la tasa de apertura cae, cambio el asunto.",
    trap:
      "Si tu métrica es "alcance" o "impresiones", es muy lenta. ¿Qué puedes medir en los primeros 3 días?",
    hint: "No esperes el reporte mensual. Define métricas que puedas revisar en días, no en meses.",
    example:
      "A las 72h reviso: clicks al simulador, comentarios en LinkedIn y respuestas al email. Si el CTR del email es menor al 3%, cambio el asunto. Si los comentarios son genéricos, ajusto el copy de los posts.",
  },
];

/**
 * Step-by-step project simulator that guides the user through applying
 * the Social Methodology process to a real project. Each step includes
 * a trap warning and a collapsible example answer for reference.
 */
export function ProjectSimulator(): React.ReactElement {
  const [currentStep, setCurrentStep] = usePluginStorage("simulator_step", 0);
  const [answers, setAnswers] = usePluginStorage<Record<string, string>>(
    "simulator_answers",
    {}
  );
  const [finished, setFinished] = usePluginStorage("simulator_finished", false);
  const [copied, setCopied] = React.useState(false);
  const [showExample, setShowExample] = React.useState(false);

  const step = stepConfigs[currentStep];
  const currentAnswer = answers[step?.id] ?? "";
  const isLast = currentStep === stepConfigs.length - 1;

  React.useEffect(() => {
    if (currentStep === 0 && !finished) {
      trackEvent("simulator.step", { step: stepConfigs[0].id, stepIndex: 0 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAnswerChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAnswers((prev) => ({ ...prev, [step.id]: e.target.value }));
    },
    [step?.id]
  );

  const handleNext = React.useCallback(() => {
    if (isLast) {
      trackEvent("simulator.complete");
      setFinished(true);
    } else {
      const nextIndex = currentStep + 1;
      trackEvent("simulator.step", {
        step: stepConfigs[nextIndex].id,
        stepIndex: nextIndex,
      });
      setCurrentStep(nextIndex);
      setShowExample(false);
    }
  }, [isLast, currentStep]);

  const handleBack = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
    setShowExample(false);
  }, []);

  const handleRestart = React.useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
    setFinished(false);
    setShowExample(false);
    trackEvent("simulator.step", { step: stepConfigs[0].id, stepIndex: 0 });
  }, []);

  const handleToggleExample = React.useCallback(() => {
    setShowExample((prev) => !prev);
  }, []);

  const buildExportText = React.useCallback((): string => {
    const lines: string[] = [
      "METODOLOGÍA SOCIAL – RESUMEN DE PROYECTO",
      "=".repeat(42),
      "",
    ];
    for (const sc of stepConfigs) {
      lines.push(`[${sc.label.toUpperCase()}] ${sc.subtitle}`);
      lines.push(answers[sc.id] || "(sin respuesta)");
      lines.push("");
    }
    return lines.join("\n");
  }, [answers]);

  const handleCopy = React.useCallback(async () => {
    await navigator.clipboard.writeText(buildExportText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [buildExportText]);

  const handleDownload = React.useCallback(() => {
    const text = buildExportText();
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "metodologia-social-proyecto.txt";
    a.click();
    URL.revokeObjectURL(url);
  }, [buildExportText]);

  if (finished) {
    return (
      <Container>
        <FinishHeader>Tu proyecto resumido</FinishHeader>
        <FinishSubtitle>
          Aquí tienes el resumen de tu proyecto aplicando la Metodología Social.
          Ahora vuelve al Problema con lo que aprendas.
        </FinishSubtitle>
        {stepConfigs.map((sc) => (
          <SummaryItem key={sc.id}>
            <SummaryLabel>
              <SummaryBadge>{sc.label}</SummaryBadge>
              {sc.subtitle}
            </SummaryLabel>
            <SummaryAnswer>
              {answers[sc.id] || <em>Sin respuesta</em>}
            </SummaryAnswer>
          </SummaryItem>
        ))}
        <ExportActions>
          <ExportButton onClick={handleCopy}>
            {copied ? "✓ Copiado" : "Copiar al portapapeles"}
          </ExportButton>
          <ExportButton onClick={handleDownload}>Descargar .txt</ExportButton>
          <RestartButton onClick={handleRestart}>
            Empezar un nuevo proyecto
          </RestartButton>
        </ExportActions>
      </Container>
    );
  }

  return (
    <Container>
      <StepHeader>
        <StepBadge>{step.label}</StepBadge>
        <StepTitle>{step.subtitle}</StepTitle>
        <StepCounter>
          {currentStep + 1} / {stepConfigs.length}
        </StepCounter>
      </StepHeader>
      <ProgressBar>
        <ProgressFill
          $percent={((currentStep + 1) / stepConfigs.length) * 100}
        />
      </ProgressBar>
      <StepPrompt>{step.prompt}</StepPrompt>
      <TrapBox>
        <TrapLabel>⚠ Trampa común</TrapLabel>
        {step.trap}
      </TrapBox>
      <StepTextarea
        value={currentAnswer}
        onChange={handleAnswerChange}
        placeholder={step.placeholder}
        rows={4}
        aria-label={step.prompt}
      />
      <HintBox>{step.hint}</HintBox>
      <ExampleToggle
        onClick={handleToggleExample}
        aria-expanded={showExample}
      >
        {showExample ? "Ocultar ejemplo ↑" : "Ver un ejemplo de referencia ↓"}
      </ExampleToggle>
      {showExample && <ExampleBox>{step.example}</ExampleBox>}
      <Actions>
        {currentStep > 0 && (
          <BackButton onClick={handleBack}>← Volver</BackButton>
        )}
        <NextButton onClick={handleNext} disabled={!currentAnswer.trim()}>
          {isLast ? "Ver resumen del proyecto" : "Siguiente paso →"}
        </NextButton>
      </Actions>
      {currentStep > 0 && (
        <PreviousAnswers>
          <PreviousTitle>Lo que llevas hasta aquí:</PreviousTitle>
          {stepConfigs.slice(0, currentStep).map((sc) => (
            <PreviousItem key={sc.id}>
              <PreviousLabel>{sc.label}:</PreviousLabel>
              {answers[sc.id] || "—"}
            </PreviousItem>
          ))}
        </PreviousAnswers>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-width: 640px;
`;

const StepHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const StepBadge = styled.span`
  background: ${s("accent")};
  color: ${s("accentText")};
  border-radius: 6px;
  padding: 3px 10px;
  font-size: 13px;
  font-weight: 600;
`;

const StepTitle = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: ${s("text")};
`;

const StepCounter = styled.span`
  margin-left: auto;
  font-size: 13px;
  color: ${s("textTertiary")};
`;

const ProgressBar = styled.div`
  height: 4px;
  background: ${s("divider")};
  border-radius: 4px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percent: number }>`
  height: 100%;
  width: ${({ $percent }) => $percent}%;
  background: ${s("accent")};
  border-radius: 4px;
  transition: width 300ms ease;
`;

const StepPrompt = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
  line-height: 1.5;
`;

const TrapBox = styled.div`
  padding: 10px 14px;
  border-radius: 8px;
  background: #f9731611;
  border-left: 3px solid #f97316;
  font-size: 13px;
  color: ${s("textSecondary")};
  line-height: 1.5;
`;

const TrapLabel = styled.div`
  font-weight: 700;
  font-size: 11px;
  color: #f97316;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 4px;
`;

const StepTextarea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border-radius: 8px;
  border: 1.5px solid ${s("divider")};
  background: ${s("background")};
  color: ${s("text")};
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
  transition: border-color 150ms ease;
  box-sizing: border-box;

  &::placeholder {
    color: ${s("textTertiary")};
  }

  &:focus {
    outline: none;
    border-color: ${s("accent")};
  }
`;

const HintBox = styled.div`
  padding: 10px 14px;
  border-radius: 8px;
  background: ${s("backgroundSecondary")};
  border-left: 3px solid ${s("accent")};
  font-size: 13px;
  color: ${s("textSecondary")};
  line-height: 1.5;
`;

const ExampleToggle = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: ${s("accent")};
  cursor: var(--pointer);
  font-weight: 500;

  &:hover {
    text-decoration: underline;
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const ExampleBox = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  background: ${s("backgroundSecondary")};
  border: 1.5px dashed ${s("divider")};
  font-size: 13px;
  color: ${s("textSecondary")};
  line-height: 1.6;
  font-style: italic;
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
`;

const BackButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: 1.5px solid ${s("divider")};
  background: ${s("background")};
  color: ${s("text")};
  font-size: 14px;
  font-weight: 500;
  cursor: var(--pointer);
  transition:
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    border-color: ${s("accent")};
  }
`;

const NextButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  background: ${s("accent")};
  color: ${s("accentText")};
  font-size: 14px;
  font-weight: 600;
  cursor: var(--pointer);
  transition: opacity 150ms ease;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }

  &:hover:not(:disabled) {
    opacity: 0.85;
  }
`;

const PreviousAnswers = styled.div`
  border: 1.5px solid ${s("divider")};
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: ${s("backgroundSecondary")};
`;

const PreviousTitle = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: ${s("textTertiary")};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const PreviousItem = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.5;
`;

const PreviousLabel = styled.span`
  font-weight: 600;
  color: ${s("text")};
  margin-right: 4px;
`;

const FinishHeader = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${s("text")};
  margin: 0;
`;

const FinishSubtitle = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.6;
`;

const SummaryItem = styled.div`
  border: 1.5px solid ${s("divider")};
  border-radius: 10px;
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SummaryLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  font-weight: 600;
  color: ${s("textSecondary")};
`;

const SummaryBadge = styled.span`
  background: ${s("accent")};
  color: ${s("accentText")};
  border-radius: 5px;
  padding: 1px 7px;
  font-size: 11px;
`;

const SummaryAnswer = styled.p`
  font-size: 14px;
  color: ${s("text")};
  margin: 0;
  line-height: 1.6;
`;

const ExportActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 4px;
`;

const ExportButton = styled.button`
  padding: 10px 18px;
  border-radius: 8px;
  border: none;
  background: ${s("accent")};
  color: ${s("accentText")};
  font-size: 14px;
  font-weight: 600;
  cursor: var(--pointer);
  transition: opacity 150ms ease;

  &:hover {
    opacity: 0.85;
  }
`;

const RestartButton = styled.button`
  padding: 10px 20px;
  border-radius: 8px;
  border: 1.5px solid ${s("divider")};
  background: ${s("background")};
  color: ${s("text")};
  font-size: 14px;
  font-weight: 500;
  cursor: var(--pointer);
  transition:
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    border-color: ${s("accent")};
  }
`;
