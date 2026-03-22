import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";

interface StepConfig {
  id: string;
  label: string;
  subtitle: string;
  prompt: string;
  placeholder: string;
  hint: string;
}

const stepConfigs: StepConfig[] = [
  {
    id: "problema",
    label: "Problema",
    subtitle: "Falla u oportunidad",
    prompt: "¿Cuál es la falla u oportunidad que detectaste?",
    placeholder:
      "Ej: Los equipos de contenido no tienen un proceso claro y cada pieza se hace de forma diferente.",
    hint: "Sé específico. Evita decir "mejorar X" sin explicar qué falla concreta quieres resolver.",
  },
  {
    id: "data",
    label: "Data",
    subtitle: "Contexto y audiencia",
    prompt:
      "¿Quiénes son afectados por este problema? ¿Qué sabes de ellos (intereses, consumo, dolores)?",
    placeholder:
      "Ej: Líderes de contenido de medianas empresas. Consumen newsletters de marketing, siguen referentes en LinkedIn. Les frustra la falta de estructura.",
    hint: "Recuerda: intereses > demografía. No te quedes solo con "25-35 años, Colombia".",
  },
  {
    id: "tension",
    label: "Tensión",
    subtitle: "Dolor o frustración",
    prompt:
      "¿Cuál es el dolor o la frustración central que vive tu audiencia en relación al problema?",
    placeholder:
      "Ej: Sienten que producen mucho pero publican sin norte, lo que les genera ansiedad y sensación de no avanzar.",
    hint: "La tensión es emocional. No es el problema en sí, sino cómo lo vive la persona. ¿Qué le duele, qué le genera alivio, qué le genera orgullo?",
  },
  {
    id: "insight",
    label: "Insight",
    subtitle: "Hallazgo accionable",
    prompt:
      "¿Cuál es la verdad no obvia sobre tu audiencia que abre la puerta a una solución?",
    placeholder:
      "Ej: Los equipos no necesitan más herramientas, necesitan un lenguaje común para pensar el contenido.",
    hint: 'Un buen insight empieza con algo no obvio. Si cualquiera lo diría sin pensar, profundiza más. Prueba la frase: "Parece que X, pero en realidad Y."',
  },
  {
    id: "idea",
    label: "Idea",
    subtitle: "Solución creativa",
    prompt:
      "¿Qué solución creativa propones a partir del insight?",
    placeholder:
      "Ej: Una guía práctica que enseña el proceso de 8 pasos con ejemplos reales, para que el equipo hable el mismo idioma.",
    hint: "La idea debe resolver directamente la tensión. Si no hay conexión emocional, revisa el insight.",
  },
  {
    id: "contenido",
    label: "Contenido",
    subtitle: "Piezas concretas",
    prompt:
      "¿Qué piezas de contenido concretas vas a producir para materializar la idea?",
    placeholder:
      "Ej: 1 guía descargable PDF, 8 posts de LinkedIn explicando cada paso, 1 webinar introductorio.",
    hint: "Sé concreto: formato, canal, cantidad. El contenido es la manifestación tangible de tu idea.",
  },
  {
    id: "distribucion",
    label: "Distribución",
    subtitle: "Alcance y empuje",
    prompt:
      "¿Cómo vas a hacer llegar el contenido a tu audiencia? ¿Por qué canales y con qué estrategia?",
    placeholder:
      "Ej: LinkedIn orgánico + newsletter a base existente + alianza con 2 referentes del sector para difusión.",
    hint: "El mejor contenido sin distribución no existe. Define al menos 2-3 puntos de contacto.",
  },
  {
    id: "aprendizaje",
    label: "Aprendizaje",
    subtitle: "Ajuste y optimización",
    prompt:
      "¿Cómo vas a medir el éxito? ¿Qué señales te indicarán que debes ajustar?",
    placeholder:
      "Ej: Miro descargas de la guía, comentarios en LinkedIn y respuestas al newsletter en la primera semana. Si la tasa de apertura cae, cambio el asunto.",
    hint: "No esperes el reporte mensual. Define métricas rápidas que te permitan ajustar en días, no en meses.",
  },
];

interface SimulatorState {
  answers: Record<string, string>;
}

/**
 * Step-by-step project simulator that guides the user through applying
 * the Social Methodology process to a real project.
 */
export function ProjectSimulator(): React.ReactElement {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});
  const [finished, setFinished] = React.useState(false);

  const step = stepConfigs[currentStep];
  const currentAnswer = answers[step?.id] ?? "";
  const isLast = currentStep === stepConfigs.length - 1;

  const handleAnswerChange = React.useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setAnswers((prev) => ({ ...prev, [step.id]: e.target.value }));
    },
    [step?.id]
  );

  const handleNext = React.useCallback(() => {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  }, [isLast]);

  const handleBack = React.useCallback(() => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  }, []);

  const handleRestart = React.useCallback(() => {
    setAnswers({});
    setCurrentStep(0);
    setFinished(false);
  }, []);

  if (finished) {
    return (
      <Container>
        <FinishHeader>Tu proyecto resumido</FinishHeader>
        <FinishSubtitle>
          Aquí tienes el resumen de tu proyecto aplicando la Metodología Social.
        </FinishSubtitle>
        {stepConfigs.map((s) => (
          <SummaryItem key={s.id}>
            <SummaryLabel>
              <SummaryBadge>{s.label}</SummaryBadge>
              {s.subtitle}
            </SummaryLabel>
            <SummaryAnswer>
              {answers[s.id] || <em>Sin respuesta</em>}
            </SummaryAnswer>
          </SummaryItem>
        ))}
        <RestartButton onClick={handleRestart}>Empezar un nuevo proyecto</RestartButton>
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
      <StepTextarea
        value={currentAnswer}
        onChange={handleAnswerChange}
        placeholder={step.placeholder}
        rows={4}
        aria-label={step.prompt}
      />
      <HintBox>{step.hint}</HintBox>
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
          {stepConfigs.slice(0, currentStep).map((s) => (
            <PreviousItem key={s.id}>
              <PreviousLabel>{s.label}:</PreviousLabel>
              {answers[s.id] || "—"}
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

const RestartButton = styled.button`
  align-self: flex-start;
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
