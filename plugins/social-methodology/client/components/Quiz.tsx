import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";
import { usePluginStorage } from "../hooks/usePluginStorage";

interface Principle {
  id: string;
  number: string;
  title: string;
  question: string;
  low: string;
  mid: string;
}

const principles: Principle[] = [
  {
    id: "personas",
    number: "01",
    title: "Personas antes que tecnología",
    question:
      "¿Con qué frecuencia tu equipo empieza un proyecto hablando con personas reales antes de elegir el formato o la herramienta?",
    low: "Acción concreta: agenda entrevistas cortas (15 min) con 3 personas de tu audiencia antes de tu próximo proyecto. No necesitas más.",
    mid: "Vas bien. Sistematízalo: que hablar con personas sea un paso obligatorio del proceso, no una opción.",
  },
  {
    id: "problema",
    number: "02",
    title: "Enamorarse del problema, no de la idea",
    question:
      "¿Puedes describir en una sola frase, sin mencionar la solución, cuál es el problema que resuelve tu proyecto actual?",
    low: "Acción concreta: en tu próximo proyecto, escribe el problema en una sola oración antes de abrir cualquier herramienta de producción.",
    mid: "Bien encaminado. Revisa si todos en tu equipo describirían el problema con las mismas palabras.",
  },
  {
    id: "proceso",
    number: "03",
    title: "Un solo proceso mental",
    question:
      "¿Tu equipo sigue los 8 pasos del proceso (Problema → … → Aprendizaje) en cada proyecto, aunque sea de forma rápida?",
    low: "Acción concreta: usa el proceso completo como checklist en tu próximo proyecto. Una hoja de papel con los 8 pasos es suficiente.",
    mid: "Buen intento. Identifica cuáles pasos sueles saltarte (casi siempre son Tensión e Insight) y enfoca ahí.",
  },
  {
    id: "intereses",
    number: "04",
    title: "Intereses > Demografía",
    question:
      "¿Tu descripción de audiencia incluye qué consumen, qué les preocupa y qué les emociona, además de edad y ubicación?",
    low: "Acción concreta: reescribe tu perfil de audiencia respondiendo solo estas tres preguntas: ¿qué consumen a diario? ¿qué les duele? ¿de qué se enorgullecen?",
    mid: "Estás avanzando. Haz ese ejercicio con todo el equipo para alinear la visión de audiencia.",
  },
  {
    id: "tensiones",
    number: "05",
    title: "Conectar desde tensiones",
    question:
      "¿Tu contenido apela a una emoción clara (alivio, orgullo, pertenencia, miedo a quedarse atrás) más allá de solo dar información útil?",
    low: "Acción concreta: antes de tu próxima pieza, define en una línea: ¿qué emoción quiero generar? ¿Cómo sabré que lo logré?",
    mid: "Ya lo intentas. Sé más explícito: escribe la emoción objetivo antes de producir, para que el equipo la tenga en mente.",
  },
  {
    id: "ciclos",
    number: "06",
    title: "Ciclos cortos de aprendizaje",
    question:
      "¿Tu equipo revisa métricas y ajusta en los primeros días del lanzamiento, sin esperar el reporte mensual?",
    low: "Acción concreta: define 2-3 métricas que puedas revisar a los 3 días del lanzamiento y agéndalo como revisión obligatoria.",
    mid: "Buen ritmo. Asegúrate de que los aprendizajes queden documentados y alimenten el próximo ciclo.",
  },
];

const SCALE_LABELS = ["Casi nunca", "A veces", "La mitad", "Casi siempre", "Siempre"];

function scoreColor(score: number): string {
  if (score <= 2) {
    return "#dc2626";
  }
  if (score === 3) {
    return "#d97706";
  }
  return "#16a34a";
}

/**
 * Self-assessment tool for the Social Methodology.
 * Users rate their team on each of the 6 principles on a 1–5 scale
 * and receive personalized recommendations focused on their weakest areas.
 */
export function Autodiagnostico(): React.ReactElement {
  const [scores, setScores] = usePluginStorage<Record<string, number>>(
    "quiz_scores",
    {}
  );
  const [submitted, setSubmitted] = usePluginStorage("quiz_submitted", false);

  const allAnswered = principles.every((p) => scores[p.id] !== undefined);

  const handleScore = React.useCallback((id: string, value: number) => {
    setScores((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSubmit = React.useCallback(() => {
    setSubmitted(true);
  }, []);

  const handleRestart = React.useCallback(() => {
    setScores({});
    setSubmitted(false);
  }, []);

  if (submitted) {
    const sorted = [...principles].sort(
      (a, b) => (scores[a.id] ?? 3) - (scores[b.id] ?? 3)
    );
    const weakest = sorted.slice(0, 3);

    return (
      <Container>
        <ResultHeader>Tu diagnóstico</ResultHeader>
        <ResultSubtitle>
          Estos son los tres principios donde tu equipo tiene más margen de
          mejora hoy:
        </ResultSubtitle>
        {weakest.map((p) => {
          const score = scores[p.id] ?? 3;
          return (
            <ResultCard key={p.id} $color={scoreColor(score)}>
              <ResultCardTop>
                <ResultNumber>{p.number}</ResultNumber>
                <ResultTitle>{p.title}</ResultTitle>
                <ScorePill $color={scoreColor(score)}>
                  {SCALE_LABELS[score - 1]}
                </ScorePill>
              </ResultCardTop>
              <ResultRec>{score <= 2 ? p.low : p.mid}</ResultRec>
            </ResultCard>
          );
        })}
        <ScoreSummary>
          {principles.map((p) => (
            <ScoreDot
              key={p.id}
              $color={scoreColor(scores[p.id] ?? 0)}
              title={`${p.title}: ${SCALE_LABELS[(scores[p.id] ?? 1) - 1]}`}
            />
          ))}
        </ScoreSummary>
        <RestartButton onClick={handleRestart}>
          Hacer el diagnóstico de nuevo
        </RestartButton>
      </Container>
    );
  }

  return (
    <Container>
      <Intro>
        No hay respuestas correctas o incorrectas. Evalúa honestamente cómo
        está tu equipo <em>hoy</em>, no cómo debería estar.
      </Intro>
      {principles.map((p) => (
        <PrincipleBlock key={p.id}>
          <PrincipleHeader>
            <PrincipleNumber>{p.number}</PrincipleNumber>
            <PrincipleTitle>{p.title}</PrincipleTitle>
          </PrincipleHeader>
          <PrincipleQuestion>{p.question}</PrincipleQuestion>
          <ScaleRow role="group" aria-label={p.title}>
            {[1, 2, 3, 4, 5].map((v) => (
              <ScaleButton
                key={v}
                $selected={scores[p.id] === v}
                onClick={() => handleScore(p.id, v)}
                aria-label={`${v} – ${SCALE_LABELS[v - 1]}`}
                aria-pressed={scores[p.id] === v}
              >
                <ScaleValue>{v}</ScaleValue>
                <ScaleLabel>{SCALE_LABELS[v - 1]}</ScaleLabel>
              </ScaleButton>
            ))}
          </ScaleRow>
        </PrincipleBlock>
      ))}
      <SubmitRow>
        <SubmitButton onClick={handleSubmit} disabled={!allAnswered}>
          Ver mi diagnóstico
        </SubmitButton>
        {!allAnswered && (
          <SubmitHint>Responde todos los principios para continuar.</SubmitHint>
        )}
      </SubmitRow>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 640px;
`;

const Intro = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.6;
`;

const PrincipleBlock = styled.div`
  border: 1.5px solid ${s("divider")};
  border-radius: 10px;
  padding: 16px 18px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background: ${s("background")};
`;

const PrincipleHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const PrincipleNumber = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${s("accent")};
  line-height: 1;
  flex-shrink: 0;
`;

const PrincipleTitle = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
`;

const PrincipleQuestion = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.5;
`;

const ScaleRow = styled.div`
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
`;

const ScaleButton = styled.button<{ $selected: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1.5px solid
    ${({ $selected, theme }) => ($selected ? theme.accent : theme.divider)};
  background: ${({ $selected, theme }) =>
    $selected ? `${theme.accent}1a` : theme.background};
  cursor: var(--pointer);
  transition:
    border-color 150ms ease,
    background 150ms ease;
  min-width: 60px;
  flex: 1;

  &:hover {
    border-color: ${s("accent")};
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
  }
`;

const ScaleValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${s("text")};
`;

const ScaleLabel = styled.span`
  font-size: 10px;
  color: ${s("textTertiary")};
  text-align: center;
  line-height: 1.2;
`;

const SubmitRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
`;

const SubmitButton = styled.button`
  padding: 11px 24px;
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

const SubmitHint = styled.span`
  font-size: 13px;
  color: ${s("textTertiary")};
`;

const ResultHeader = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${s("text")};
  margin: 0;
`;

const ResultSubtitle = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
`;

const ResultCard = styled.div<{ $color: string }>`
  border: 1.5px solid ${({ $color }) => $color}44;
  border-radius: 10px;
  padding: 16px 18px;
  background: ${({ $color }) => `${$color}0d`};
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const ResultCardTop = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
`;

const ResultNumber = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: ${s("accent")};
  flex-shrink: 0;
`;

const ResultTitle = styled.span`
  font-size: 14px;
  font-weight: 600;
  color: ${s("text")};
  flex: 1;
`;

const ScorePill = styled.span<{ $color: string }>`
  font-size: 11px;
  font-weight: 600;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => `${$color}22`};
  border: 1px solid ${({ $color }) => `${$color}55`};
  border-radius: 20px;
  padding: 2px 10px;
  white-space: nowrap;
`;

const ResultRec = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.6;
`;

const ScoreSummary = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`;

const ScoreDot = styled.div<{ $color: string }>`
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  flex-shrink: 0;
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
