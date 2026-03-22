import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";
import { usePluginStorage } from "../hooks/usePluginStorage";

const PROCESS_STEPS = [
  "Problema",
  "Data",
  "Tensión",
  "Insight",
  "Idea",
  "Contenido",
  "Distribución",
  "Aprendizaje",
];

interface CaseStudy {
  id: string;
  title: string;
  team: string;
  preview: string;
  story: string[];
  result: string;
  failedSteps: string[];
  diagnosis: string;
  lesson: string;
}

const cases: CaseStudy[] = [
  {
    id: "podcast",
    title: "El podcast que nadie compartió",
    team: "Equipo de contenido de una revista de negocios digital",
    preview:
      "Producción impecable, buenos invitados, distribución pagada. 15.000 oyentes en el primer mes. Cero comunidad. Los sponsors no renovaron.",
    story: [
      "Un equipo de contenido de una revista de negocios decide lanzar un podcast para emprendedores. Tienen data sólida: su audiencia son fundadores de 28 a 42 años, leen libros de management, siguen referentes en LinkedIn y consumen contenido en inglés porque "en español no hay nada bueno".",
      "El problema está claro: los emprendedores latinoamericanos no tienen acceso a contenido práctico de calidad en su idioma. La solución se ve obvia: entrevistar a founders exitosos y contar sus historias. Diez episodios ya planificados, producción de alta calidad, dos sponsors confirmados.",
      "Lanzan. La distribución es agresiva: LinkedIn orgánico, newsletter, pauta pagada en Spotify. El primer mes: 15.000 oyentes. Los números de descarga son buenos. Pero los comentarios son escasos. Nadie comparte los episodios espontáneamente. El grupo de WhatsApp que crearon para la comunidad tiene 12 personas. Después de tres meses, los sponsors no renuevan.",
    ],
    result:
      "El podcast sigue vivo pero nunca despegó como comunidad. El equipo no entiende por qué: la producción es buena, los invitados son relevantes, la distribución fue fuerte.",
    failedSteps: ["Tensión", "Insight"],
    diagnosis:
      "El equipo pasó de Data directamente a Idea sin pasar por Tensión ni Insight. Sabían quién era su audiencia demográficamente, pero nunca preguntaron: ¿qué siente un emprendedor latinoamericano cuando enfrenta esta falta de contenido? La respuesta no es "frustración por falta de información" — es soledad y la sensación de estar improvisando mientras todos los demás parecen tenerlo claro. Ese dolor emocional nunca aparece en el podcast porque nadie lo identificó. El resultado es contenido informativo pero no resonante: se escucha, no se comparte.",
    lesson:
      "El insight que faltaba: los emprendedores no buscan más información de éxito — buscan validación de que sus fracasos son normales. Un podcast que muestra errores reales, dudas y momentos de quiebre conecta emocionalmente. Uno que solo muestra logros genera admiración pasiva, no comunidad.",
  },
  {
    id: "ong",
    title: "2 millones de impresiones, cero donaciones",
    team: "ONG enfocada en educación rural",
    preview:
      "Campaña con gran alcance pagado, contenido emotivo, influencers involucrados. Las donaciones casi no se movieron.",
    story: [
      "Una ONG con 15 años de trabajo en educación rural quiere "levantar conciencia sobre la brecha educativa en zonas alejadas". Tienen estadísticas contundentes: 3 de cada 10 niños en zonas rurales no terminan la primaria. Su audiencia potencial son profesionales urbanos de 25 a 45 años con capacidad de donar.",
      "El equipo define el problema como: "necesitamos más visibilidad en redes sociales para generar donaciones". Producen una campaña con infografías de impacto, videos testimoniales de niños, y un hashtag. Consiguen que tres influencers medianos la difundan. La pauta publicitaria llega a 2 millones de personas en dos semanas.",
      "Los resultados de alcance son los mejores en la historia de la organización. Pero las donaciones suben apenas un 4%. En las métricas de redes: muchos "me gusta", pocos comentarios, casi ningún compartido orgánico. La gente ve los videos, pone un corazón, y sigue scrolleando.",
    ],
    result:
      "La directora de comunicaciones no entiende qué salió mal. El contenido era emotivo, el alcance fue enorme, la causa es urgente. ¿Por qué no donaron?",
    failedSteps: ["Problema", "Tensión"],
    diagnosis:
      "El "problema" que definieron no era un problema — era una meta de comunicación. "Necesitar más visibilidad" es lo que quiere la organización, no la falla que vive la audiencia. Al no identificar el problema real desde la perspectiva del donante potencial, toda la cadena que sigue quedó torcida. La tensión que generó la campaña fue lástima — pero la lástima paraliza, no activa. La gente siente pena, cierra la app, y sigue con su día con una ligera culpa que se disuelve en minutos.",
    lesson:
      "El problema real del donante potencial es la desconexión: no cree que su donación individual cambie algo. La tensión es impotencia mezclada con culpa. El insight: la gente no dona porque no ve el impacto directo de su dinero. La campaña debería mostrar exactamente qué hace $20 por un niño específico, con nombre, escuela y resultado concreto — no estadísticas que abruman sin dar salida.",
  },
  {
    id: "serie",
    title: "La serie perfecta que el algoritmo mató",
    team: "Equipo de marketing de una empresa B2B de software",
    preview:
      "Proceso completo bien ejecutado, 10 episodios producidos antes de lanzar para "ser consistentes". El 80% del público original se fue antes del episodio 8.",
    story: [
      "El equipo de marketing de una empresa de software para ventas aplica la metodología completa y correctamente: el problema es que los equipos de ventas pierden horas en reportes manuales. La tensión es real: los lunes por la mañana son un caos de planillas y el gerente de ventas llega a la reunión con números de la semana pasada. El insight es preciso: el problema no es la falta de datos, sino los 20 minutos de estrés del domingo por la noche preparando el reporte.",
      "La idea es sólida: una serie de LinkedIn llamada "El equipo de ventas a prueba de lunes" — contenido práctico sobre cómo automatizar el caos de los reportes. Planifican 10 episodios, contratan a un editor, y deciden producir todos los episodios antes de lanzar para "garantizar consistencia y no quedarse sin material".",
      "Lanzan el episodio 1. El engagement es el mejor que han tenido: 340 reacciones, 47 comentarios, varios compartidos. En los comentarios, la audiencia pide contenido sobre integraciones con CRM específicos y sobre cómo convencer al equipo de adoptar nuevas herramientas. El equipo lo nota, pero los episodios 2 al 10 ya están producidos sobre otros temas. Los publican igual. El engagement cae episodio a episodio. En el episodio 8, el 80% de los seguidores originales ya no interactúa.",
    ],
    result:
      "La serie termina con buenos números de producción y malos de negocio. El equipo cree que "LinkedIn ya no funciona" y descarta el formato para el próximo trimestre.",
    failedSteps: ["Aprendizaje"],
    diagnosis:
      "El proceso estuvo bien ejecutado hasta el último paso. El error fue producir todo antes de lanzar, lo que rompió la posibilidad de ciclos cortos de aprendizaje. El episodio 1 les dio una señal clarísima — la audiencia quería contenido sobre integraciones y adopción interna — pero no podían actuar porque ya habían producido todo. Los principios 03 y 06 son inseparables: el proceso mental y los ciclos cortos se necesitan mutuamente.",
    lesson:
      "La regla para series de contenido: produce 2-3 episodios, lanza, lee los comentarios durante 72 horas, y ajusta los siguientes. La "consistencia" no viene de producir todo de una vez — viene de publicar con ritmo mientras aprendes. Siempre hay que dejar espacio para que el aprendizaje retroalimente el contenido.",
  },
];

interface CaseState {
  selectedStep: string | null;
  explanation: string;
  submitted: boolean;
}

/**
 * Active learning section with real project case studies.
 * Users read a story, identify which process step failed, and
 * receive a detailed diagnosis after submitting their analysis.
 */
export function CaseStudies(): React.ReactElement {
  const [activeCase, setActiveCase] = React.useState<string | null>(null);
  const [caseStates, setCaseStates] = usePluginStorage<
    Record<string, CaseState>
  >("case_states", {});

  const handleSelectCase = React.useCallback((id: string) => {
    setActiveCase(id);
  }, []);

  const handleBack = React.useCallback(() => {
    setActiveCase(null);
  }, []);

  const handleSelectStep = React.useCallback(
    (caseId: string, step: string) => {
      setCaseStates((prev) => ({
        ...prev,
        [caseId]: {
          ...prev[caseId],
          selectedStep: step,
          explanation: prev[caseId]?.explanation ?? "",
          submitted: prev[caseId]?.submitted ?? false,
        },
      }));
    },
    []
  );

  const handleExplanationChange = React.useCallback(
    (caseId: string, value: string) => {
      setCaseStates((prev) => ({
        ...prev,
        [caseId]: {
          ...prev[caseId],
          selectedStep: prev[caseId]?.selectedStep ?? null,
          explanation: value,
          submitted: prev[caseId]?.submitted ?? false,
        },
      }));
    },
    []
  );

  const handleSubmit = React.useCallback((caseId: string) => {
    setCaseStates((prev) => ({
      ...prev,
      [caseId]: {
        ...prev[caseId],
        submitted: true,
      },
    }));
  }, []);

  if (activeCase) {
    const c = cases.find((x) => x.id === activeCase);
    if (!c) {
      return <Container />;
    }
    const state = caseStates[c.id] ?? {
      selectedStep: null,
      explanation: "",
      submitted: false,
    };
    const isCorrect =
      state.selectedStep !== null &&
      c.failedSteps.includes(state.selectedStep);

    return (
      <Container>
        <BackButton onClick={handleBack}>← Volver a los casos</BackButton>
        <CaseTitle>{c.title}</CaseTitle>
        <CaseTeam>{c.team}</CaseTeam>
        <StorySection>
          {c.story.map((paragraph, i) => (
            <StoryParagraph key={i}>{paragraph}</StoryParagraph>
          ))}
          <ResultBox>{c.result}</ResultBox>
        </StorySection>
        {!state.submitted ? (
          <>
            <AnalysisPrompt>
              ¿En qué paso del proceso falló este equipo?
            </AnalysisPrompt>
            <StepGrid>
              {PROCESS_STEPS.map((step) => (
                <StepOption
                  key={step}
                  $selected={state.selectedStep === step}
                  onClick={() => handleSelectStep(c.id, step)}
                  aria-pressed={state.selectedStep === step}
                >
                  {step}
                </StepOption>
              ))}
            </StepGrid>
            <AnalysisLabel>
              ¿Por qué crees que falló ahí? (opcional)
            </AnalysisLabel>
            <AnalysisTextarea
              value={state.explanation}
              onChange={(e) =>
                handleExplanationChange(c.id, e.target.value)
              }
              placeholder="Escribe tu razonamiento antes de ver el diagnóstico..."
              rows={3}
            />
            <SubmitButton
              onClick={() => handleSubmit(c.id)}
              disabled={!state.selectedStep}
            >
              Ver diagnóstico
            </SubmitButton>
          </>
        ) : (
          <DiagnosisSection>
            <DiagnosisHeader $correct={isCorrect}>
              {isCorrect ? (
                <>
                  <DiagnosisIcon>✓</DiagnosisIcon>
                  Bien identificado — el paso{" "}
                  <strong>{state.selectedStep}</strong> es donde falló.
                </>
              ) : (
                <>
                  <DiagnosisIcon>→</DiagnosisIcon>
                  El fallo principal fue en{" "}
                  <strong>{c.failedSteps.join(" y ")}</strong>, no en{" "}
                  {state.selectedStep}.
                </>
              )}
            </DiagnosisHeader>
            <DiagnosisTitle>Diagnóstico</DiagnosisTitle>
            <DiagnosisText>{c.diagnosis}</DiagnosisText>
            <LessonBox>
              <LessonLabel>Lo que debían haber hecho</LessonLabel>
              <LessonText>{c.lesson}</LessonText>
            </LessonBox>
            <RetryButton onClick={() => handleBack()}>
              Analizar otro caso
            </RetryButton>
          </DiagnosisSection>
        )}
      </Container>
    );
  }

  return (
    <Container>
      <Intro>
        Cada caso describe un proyecto real con un error específico. Tu trabajo
        es leer la historia, identificar en qué paso del proceso falló el
        equipo, y explicar por qué — antes de ver el diagnóstico.
      </Intro>
      <CaseList>
        {cases.map((c) => {
          const done = caseStates[c.id]?.submitted;
          return (
            <CaseCard
              key={c.id}
              onClick={() => handleSelectCase(c.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleSelectCase(c.id);
                }
              }}
            >
              <CaseCardTop>
                <CaseCardTitle>{c.title}</CaseCardTitle>
                {done && <DonePill>Analizado</DonePill>}
              </CaseCardTop>
              <CaseCardTeam>{c.team}</CaseCardTeam>
              <CaseCardPreview>{c.preview}</CaseCardPreview>
              <CaseCardCta>Leer y analizar →</CaseCardCta>
            </CaseCard>
          );
        })}
      </CaseList>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 680px;
`;

const Intro = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.6;
`;

const CaseList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const CaseCard = styled.div`
  border: 1.5px solid ${s("divider")};
  border-radius: 12px;
  padding: 20px;
  cursor: var(--pointer);
  display: flex;
  flex-direction: column;
  gap: 6px;
  transition:
    border-color 150ms ease,
    background 150ms ease;

  &:hover {
    border-color: ${s("accent")};
    background: ${({ theme }) => `${theme.accent}08`};
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
  }
`;

const CaseCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

const CaseCardTitle = styled.h3`
  font-size: 16px;
  font-weight: 700;
  color: ${s("text")};
  margin: 0;
`;

const DonePill = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #16a34a;
  background: #16a34a1a;
  border: 1px solid #16a34a44;
  border-radius: 20px;
  padding: 2px 10px;
  white-space: nowrap;
  flex-shrink: 0;
`;

const CaseCardTeam = styled.span`
  font-size: 12px;
  color: ${s("textTertiary")};
`;

const CaseCardPreview = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 4px 0 0;
  line-height: 1.5;
`;

const CaseCardCta = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${s("accent")};
  margin-top: 4px;
`;

const BackButton = styled.button`
  align-self: flex-start;
  background: none;
  border: none;
  padding: 0;
  font-size: 13px;
  color: ${s("textTertiary")};
  cursor: var(--pointer);
  font-weight: 500;

  &:hover {
    color: ${s("text")};
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
    border-radius: 2px;
  }
`;

const CaseTitle = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${s("text")};
  margin: 0;
`;

const CaseTeam = styled.span`
  font-size: 13px;
  color: ${s("textTertiary")};
`;

const StorySection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 18px 20px;
  border: 1.5px solid ${s("divider")};
  border-radius: 10px;
  background: ${s("backgroundSecondary")};
`;

const StoryParagraph = styled.p`
  font-size: 14px;
  color: ${s("text")};
  margin: 0;
  line-height: 1.7;
`;

const ResultBox = styled.div`
  padding: 12px 14px;
  border-radius: 8px;
  background: #f9731611;
  border-left: 3px solid #f97316;
  font-size: 13px;
  color: ${s("textSecondary")};
  line-height: 1.5;
  font-style: italic;
`;

const AnalysisPrompt = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
`;

const StepGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const StepOption = styled.button<{ $selected: boolean }>`
  padding: 8px 16px;
  border-radius: 8px;
  border: 1.5px solid
    ${({ $selected, theme }) => ($selected ? theme.accent : theme.divider)};
  background: ${({ $selected, theme }) =>
    $selected ? `${theme.accent}1a` : theme.background};
  color: ${({ $selected, theme }) =>
    $selected ? theme.accent : theme.textSecondary};
  font-size: 13px;
  font-weight: ${({ $selected }) => ($selected ? "600" : "400")};
  cursor: var(--pointer);
  transition:
    border-color 150ms ease,
    background 150ms ease,
    color 150ms ease;

  &:hover {
    border-color: ${s("accent")};
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
  }
`;

const AnalysisLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${s("textSecondary")};
`;

const AnalysisTextarea = styled.textarea`
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

const SubmitButton = styled.button`
  align-self: flex-start;
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

const DiagnosisSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

const DiagnosisHeader = styled.div<{ $correct: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: 8px;
  background: ${({ $correct }) => ($correct ? "#16a34a1a" : "#f9731611")};
  border: 1.5px solid
    ${({ $correct }) => ($correct ? "#16a34a55" : "#f9731655")};
  font-size: 14px;
  color: ${s("text")};
  line-height: 1.5;
`;

const DiagnosisIcon = styled.span`
  font-size: 16px;
  font-weight: 700;
  flex-shrink: 0;
`;

const DiagnosisTitle = styled.h3`
  font-size: 15px;
  font-weight: 700;
  color: ${s("text")};
  margin: 0;
`;

const DiagnosisText = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.7;
`;

const LessonBox = styled.div`
  padding: 14px 16px;
  border-radius: 10px;
  background: ${({ theme }) => `${theme.accent}0d`};
  border: 1.5px solid ${({ theme }) => `${theme.accent}33`};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const LessonLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  color: ${s("accent")};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const LessonText = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.6;
`;

const RetryButton = styled.button`
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
