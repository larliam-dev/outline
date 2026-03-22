import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    id: 1,
    question:
      "Según el principio 01 de la metodología, ¿qué está en el centro del trabajo?",
    options: [
      "Los algoritmos y la tecnología",
      "Los problemas, deseos y miedos de la gente",
      "Las métricas de alcance",
      "El presupuesto del proyecto",
    ],
    correctIndex: 1,
    explanation:
      "El principio "Personas antes que tecnología" establece que el centro son los problemas, deseos y miedos de la gente, no los algoritmos.",
  },
  {
    id: 2,
    question:
      "¿Cuál es el primer paso del proceso de la Metodología Social?",
    options: ["Data", "Insight", "Problema", "Idea"],
    correctIndex: 2,
    explanation:
      "El proceso comienza con Problema (falla u oportunidad). Sin identificarlo claramente, el resto del proceso no tiene dirección.",
  },
  {
    id: 3,
    question: "¿Qué ocurre en la etapa de "Tensión" del proceso?",
    options: [
      "Se define el presupuesto del contenido",
      "Se identifica el dolor o la frustración de la audiencia",
      "Se lanza el contenido a los canales",
      "Se miden los resultados obtenidos",
    ],
    correctIndex: 1,
    explanation:
      "La etapa de Tensión busca identificar el dolor o la frustración que vive la audiencia. Es el puente emocional entre el problema y la solución.",
  },
  {
    id: 4,
    question:
      "Según el principio 04, ¿qué importa más a la hora de conocer a la audiencia?",
    options: [
      "Su edad y género",
      "Su nivel socioeconómico",
      "Qué consumen y qué les duele",
      "Su ubicación geográfica",
    ],
    correctIndex: 2,
    explanation:
      ""Intereses > Demografía": importa más qué consumen y qué les duele que su edad o género.",
  },
  {
    id: 5,
    question:
      "¿Qué diferencia a un Insight de una simple observación?",
    options: [
      "Que es estadísticamente significativo",
      "Que es validado por el cliente",
      "Que es accionable: abre la puerta a una solución creativa",
      "Que tiene al menos tres fuentes de datos",
    ],
    correctIndex: 2,
    explanation:
      "Un Insight es un hallazgo accionable: una verdad no obvia sobre la audiencia que abre la puerta a una solución creativa.",
  },
  {
    id: 6,
    question:
      "El principio de "Ciclos cortos de aprendizaje" implica que…",
    options: [
      "Solo se lanza cuando el proyecto es perfecto",
      "Se espera el reporte mensual para ajustar",
      "Se lanza, se mide y se ajusta de forma continua",
      "Los ciclos deben durar al menos un trimestre",
    ],
    correctIndex: 2,
    explanation:
      "El principio 06 dice: "Se lanza, se mide y se ajusta. No esperamos al reporte mensual."",
  },
  {
    id: 7,
    question:
      "¿Cuál es el paso que cierra el ciclo y retroalimenta el inicio del proceso?",
    options: ["Distribución", "Contenido", "Insight", "Aprendizaje"],
    correctIndex: 3,
    explanation:
      "Aprendizaje (ajuste y optimización) cierra el ciclo y alimenta de vuelta al principio, permitiendo mejorar el proceso.",
  },
  {
    id: 8,
    question:
      "Antes de producir contenido, ¿qué debes poder explicar según el principio 02?",
    options: [
      "El formato más viral del momento",
      "El presupuesto disponible para la campaña",
      "Qué problema real estás resolviendo",
      "Cuántos seguidores tiene tu audiencia",
    ],
    correctIndex: 2,
    explanation:
      ""Enamorarse del problema, no de la idea": antes de producir, debes explicar qué problema real estás resolviendo.",
  },
];

type AnswerState = "unanswered" | "correct" | "incorrect";

/**
 * Quiz component to test knowledge of the Social Methodology principles and process.
 */
export function Quiz(): React.ReactElement {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [selected, setSelected] = React.useState<number | null>(null);
  const [answers, setAnswers] = React.useState<AnswerState[]>(
    Array(questions.length).fill("unanswered")
  );
  const [finished, setFinished] = React.useState(false);

  const currentQuestion = questions[currentIndex];
  const isAnswered = selected !== null;

  const handleSelect = React.useCallback(
    (optionIndex: number) => {
      if (isAnswered) {
        return;
      }
      setSelected(optionIndex);
      const isCorrect = optionIndex === currentQuestion.correctIndex;
      setAnswers((prev) => {
        const next = [...prev];
        next[currentIndex] = isCorrect ? "correct" : "incorrect";
        return next;
      });
    },
    [isAnswered, currentQuestion.correctIndex, currentIndex]
  );

  const handleNext = React.useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
    } else {
      setFinished(true);
    }
  }, [currentIndex]);

  const handleRestart = React.useCallback(() => {
    setCurrentIndex(0);
    setSelected(null);
    setAnswers(Array(questions.length).fill("unanswered"));
    setFinished(false);
  }, []);

  const score = answers.filter((a) => a === "correct").length;

  if (finished) {
    return (
      <Container>
        <ResultCard>
          <ResultEmoji>
            {score >= questions.length * 0.75 ? "🎯" : score >= questions.length * 0.5 ? "📈" : "📚"}
          </ResultEmoji>
          <ResultScore>
            {score} / {questions.length}
          </ResultScore>
          <ResultMessage>
            {score === questions.length
              ? "¡Perfecto! Dominas la Metodología Social."
              : score >= questions.length * 0.75
              ? "Muy bien. Tienes una base sólida."
              : score >= questions.length * 0.5
              ? "Vas por buen camino. Repasa los principios."
              : "Sigue repasando. La metodología tiene mucho valor."}
          </ResultMessage>
          <AnswerSummary>
            {questions.map((q, i) => (
              <AnswerDot key={q.id} $state={answers[i]} title={q.question} />
            ))}
          </AnswerSummary>
          <RestartButton onClick={handleRestart}>Intentar de nuevo</RestartButton>
        </ResultCard>
      </Container>
    );
  }

  return (
    <Container>
      <Progress>
        Pregunta {currentIndex + 1} de {questions.length}
      </Progress>
      <ProgressBar>
        <ProgressFill $percent={((currentIndex + 1) / questions.length) * 100} />
      </ProgressBar>
      <QuestionText>{currentQuestion.question}</QuestionText>
      <OptionsList>
        {currentQuestion.options.map((option, i) => {
          let state: "default" | "correct" | "incorrect" | "missed" = "default";
          if (isAnswered) {
            if (i === currentQuestion.correctIndex) {
              state = "correct";
            } else if (i === selected) {
              state = "incorrect";
            }
          }
          return (
            <OptionButton
              key={i}
              $state={state}
              onClick={() => handleSelect(i)}
              disabled={isAnswered}
            >
              <OptionLetter>{String.fromCharCode(65 + i)}</OptionLetter>
              {option}
            </OptionButton>
          );
        })}
      </OptionsList>
      {isAnswered && (
        <ExplanationBox
          $correct={selected === currentQuestion.correctIndex}
        >
          <ExplanationLabel>
            {selected === currentQuestion.correctIndex ? "✓ Correcto" : "✗ Incorrecto"}
          </ExplanationLabel>
          {currentQuestion.explanation}
        </ExplanationBox>
      )}
      {isAnswered && (
        <NextButton onClick={handleNext}>
          {currentIndex < questions.length - 1
            ? "Siguiente pregunta →"
            : "Ver resultados"}
        </NextButton>
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

const Progress = styled.span`
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

const QuestionText = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
  line-height: 1.5;
`;

const OptionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const OptionButton = styled.button<{
  $state: "default" | "correct" | "incorrect" | "missed";
}>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1.5px solid
    ${({ $state, theme }) => {
      if ($state === "correct") {
        return "#22c55e";
      }
      if ($state === "incorrect") {
        return "#ef4444";
      }
      return theme.divider;
    }};
  background: ${({ $state, theme }) => {
    if ($state === "correct") {
      return "#22c55e22";
    }
    if ($state === "incorrect") {
      return "#ef444422";
    }
    return theme.background;
  }};
  color: ${s("text")};
  font-size: 14px;
  text-align: left;
  cursor: ${({ disabled }) => (disabled ? "default" : "var(--pointer)")};
  transition:
    border-color 150ms ease,
    background 150ms ease;

  &:hover:not(:disabled) {
    border-color: ${s("accent")};
    background: ${({ theme }) => `${theme.accent}11`};
  }
`;

const OptionLetter = styled.span`
  font-weight: 700;
  font-size: 13px;
  color: ${s("textTertiary")};
  flex-shrink: 0;
  width: 18px;
`;

const ExplanationBox = styled.div<{ $correct: boolean }>`
  padding: 14px 16px;
  border-radius: 8px;
  background: ${({ $correct }) => ($correct ? "#22c55e22" : "#f9731622")};
  border: 1.5px solid ${({ $correct }) => ($correct ? "#22c55e" : "#f97316")};
  font-size: 14px;
  color: ${s("textSecondary")};
  line-height: 1.6;
`;

const ExplanationLabel = styled.div`
  font-weight: 700;
  font-size: 13px;
  margin-bottom: 6px;
  color: ${s("text")};
`;

const NextButton = styled.button`
  align-self: flex-end;
  padding: 10px 20px;
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

const ResultCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 32px;
  border: 1.5px solid ${s("divider")};
  border-radius: 12px;
  background: ${s("backgroundSecondary")};
`;

const ResultEmoji = styled.div`
  font-size: 48px;
`;

const ResultScore = styled.div`
  font-size: 36px;
  font-weight: 700;
  color: ${s("text")};
`;

const ResultMessage = styled.p`
  font-size: 15px;
  color: ${s("textSecondary")};
  text-align: center;
  margin: 0;
`;

const AnswerSummary = styled.div`
  display: flex;
  gap: 6px;
`;

const AnswerDot = styled.div<{ $state: AnswerState }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${({ $state }) => {
    if ($state === "correct") {
      return "#22c55e";
    }
    if ($state === "incorrect") {
      return "#ef4444";
    }
    return "#9ca3af";
  }};
`;

const RestartButton = styled.button`
  padding: 10px 24px;
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
