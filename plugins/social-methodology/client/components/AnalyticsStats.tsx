import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";
import { client } from "~/utils/ApiClient";

const SIMULATOR_STEPS = [
  "problema",
  "data",
  "tension",
  "insight",
  "idea",
  "contenido",
  "distribucion",
  "aprendizaje",
];

const STEP_LABELS: Record<string, string> = {
  problema: "Problema",
  data: "Data",
  tension: "Tensión",
  insight: "Insight",
  idea: "Idea",
  contenido: "Contenido",
  distribucion: "Distribución",
  aprendizaje: "Aprendizaje",
};

const CASE_LABELS: Record<string, string> = {
  podcast: "El podcast que nadie compartió",
  ong: "2M impresiones, cero donaciones",
  serie: "La serie perfecta que el algoritmo mató",
};

const PRINCIPLE_LABELS: Record<string, string> = {
  personas: "Personas > Tecnología",
  problema: "Enamorarse del problema",
  proceso: "Un solo proceso",
  intereses: "Intereses > Demografía",
  tensiones: "Conectar desde tensiones",
  ciclos: "Ciclos cortos",
};

interface SimulatorStats {
  started: number;
  completed: number;
  stepReach: Record<string, number>;
}

interface CaseStats {
  submissions: number;
  correctRate: number;
}

interface QuizStats {
  submissions: number;
  avgScores: Record<string, number | null>;
}

interface StatsData {
  simulator: SimulatorStats;
  cases: Record<string, CaseStats>;
  quiz: QuizStats;
}

/**
 * Displays aggregate learning analytics for the team. Visible to admins only.
 * Data is fetched from the methodology.stats endpoint on mount.
 */
export function AnalyticsStats(): React.ReactElement {
  const [data, setData] = React.useState<StatsData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    setLoading(true);
    client
      .post<StatsData>("/methodology.stats")
      .then((res) => {
        setData(res);
        setError(null);
      })
      .catch(() => {
        setError("No se pudieron cargar las estadísticas.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Container><LoadingText>Cargando estadísticas…</LoadingText></Container>;
  }

  if (error || !data) {
    return <Container><ErrorText>{error ?? "Error desconocido."}</ErrorText></Container>;
  }

  const { simulator, cases, quiz } = data;
  const completionRate =
    simulator.started > 0
      ? Math.round((simulator.completed / simulator.started) * 100)
      : 0;

  const maxStepCount = Math.max(
    ...SIMULATOR_STEPS.map((s) => simulator.stepReach[s] ?? 0),
    1
  );

  const sortedPrinciples = Object.entries(quiz.avgScores)
    .filter(([, v]) => v !== null)
    .sort(([, a], [, b]) => (a as number) - (b as number));

  return (
    <Container>
      <Section>
        <SectionTitle>Simulador</SectionTitle>
        <MetaRow>
          <MetaStat>
            <MetaValue>{simulator.started}</MetaValue>
            <MetaLabel>iniciaron</MetaLabel>
          </MetaStat>
          <MetaDivider />
          <MetaStat>
            <MetaValue>{simulator.completed}</MetaValue>
            <MetaLabel>completaron</MetaLabel>
          </MetaStat>
          <MetaDivider />
          <MetaStat>
            <MetaValue>{completionRate}%</MetaValue>
            <MetaLabel>tasa de compleción</MetaLabel>
          </MetaStat>
        </MetaRow>
        {simulator.started > 0 && (
          <>
            <BarChartLabel>Avance por paso</BarChartLabel>
            <BarChart>
              {SIMULATOR_STEPS.map((stepId) => {
                const count = simulator.stepReach[stepId] ?? 0;
                const pct = Math.round((count / maxStepCount) * 100);
                return (
                  <BarRow key={stepId}>
                    <BarStepLabel>{STEP_LABELS[stepId]}</BarStepLabel>
                    <BarTrack>
                      <BarFill $pct={pct} />
                    </BarTrack>
                    <BarCount>{count}</BarCount>
                  </BarRow>
                );
              })}
            </BarChart>
          </>
        )}
        {simulator.started === 0 && (
          <EmptyHint>Aún no hay datos del simulador.</EmptyHint>
        )}
      </Section>

      <Section>
        <SectionTitle>Casos</SectionTitle>
        {Object.keys(CASE_LABELS).map((caseId) => {
          const stat = cases[caseId];
          if (!stat) {
            return (
              <CaseRow key={caseId}>
                <CaseName>{CASE_LABELS[caseId]}</CaseName>
                <CaseMeta>Sin datos aún</CaseMeta>
              </CaseRow>
            );
          }
          return (
            <CaseRow key={caseId}>
              <CaseName>{CASE_LABELS[caseId]}</CaseName>
              <CaseMeta>
                {stat.submissions} {stat.submissions === 1 ? "análisis" : "análisis"} ·{" "}
                <CaseRate $rate={stat.correctRate}>{stat.correctRate}% correctos</CaseRate>
              </CaseMeta>
            </CaseRow>
          );
        })}
        {Object.keys(cases).length === 0 && (
          <EmptyHint>Aún no hay datos de casos.</EmptyHint>
        )}
      </Section>

      <Section>
        <SectionTitle>Autodiagnóstico</SectionTitle>
        <MetaRow>
          <MetaStat>
            <MetaValue>{quiz.submissions}</MetaValue>
            <MetaLabel>{quiz.submissions === 1 ? "diagnóstico" : "diagnósticos"} completados</MetaLabel>
          </MetaStat>
        </MetaRow>
        {quiz.submissions > 0 && sortedPrinciples.length > 0 && (
          <>
            <BarChartLabel>Promedio por principio (1–5)</BarChartLabel>
            <BarChart>
              {sortedPrinciples.map(([key, value]) => {
                const pct = Math.round(((value as number) / 5) * 100);
                return (
                  <BarRow key={key}>
                    <BarStepLabel>{PRINCIPLE_LABELS[key] ?? key}</BarStepLabel>
                    <BarTrack>
                      <BarFill $pct={pct} $quiz />
                    </BarTrack>
                    <BarCount>{(value as number).toFixed(1)}</BarCount>
                  </BarRow>
                );
              })}
            </BarChart>
            {sortedPrinciples.length >= 2 && (
              <InsightRow>
                <InsightChip $type="weak">
                  Más débil: {PRINCIPLE_LABELS[sortedPrinciples[0][0]] ?? sortedPrinciples[0][0]}
                </InsightChip>
                <InsightChip $type="strong">
                  Más fuerte: {PRINCIPLE_LABELS[sortedPrinciples[sortedPrinciples.length - 1][0]] ?? sortedPrinciples[sortedPrinciples.length - 1][0]}
                </InsightChip>
              </InsightRow>
            )}
          </>
        )}
        {quiz.submissions === 0 && (
          <EmptyHint>Aún no hay diagnósticos completados.</EmptyHint>
        )}
      </Section>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 28px;
  max-width: 640px;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${s("textTertiary")};
  margin: 0;
`;

const MetaRow = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const MetaStat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const MetaValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${s("text")};
  line-height: 1;
`;

const MetaLabel = styled.span`
  font-size: 12px;
  color: ${s("textTertiary")};
`;

const MetaDivider = styled.div`
  width: 1px;
  height: 32px;
  background: ${s("divider")};
`;

const BarChartLabel = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: ${s("textTertiary")};
`;

const BarChart = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const BarRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const BarStepLabel = styled.span`
  font-size: 13px;
  color: ${s("textSecondary")};
  width: 100px;
  flex-shrink: 0;
  text-align: right;
`;

const BarTrack = styled.div`
  flex: 1;
  height: 8px;
  background: ${s("divider")};
  border-radius: 4px;
  overflow: hidden;
`;

const BarFill = styled.div<{ $pct: number; $quiz?: boolean }>`
  height: 100%;
  width: ${({ $pct }) => $pct}%;
  background: ${({ $quiz, theme }) => ($quiz ? theme.accent : "#6366f1")};
  border-radius: 4px;
  transition: width 600ms ease;
`;

const BarCount = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${s("text")};
  width: 32px;
  flex-shrink: 0;
`;

const CaseRow = styled.div`
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 10px 14px;
  border: 1px solid ${s("divider")};
  border-radius: 8px;
`;

const CaseName = styled.span`
  font-size: 13px;
  color: ${s("text")};
`;

const CaseMeta = styled.span`
  font-size: 13px;
  color: ${s("textTertiary")};
  white-space: nowrap;
`;

const CaseRate = styled.span<{ $rate: number }>`
  color: ${({ $rate }) =>
    $rate >= 60 ? "#16a34a" : $rate >= 40 ? "#d97706" : "#dc2626"};
  font-weight: 600;
`;

const InsightRow = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
`;

const InsightChip = styled.span<{ $type: "weak" | "strong" }>`
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ $type }) =>
    $type === "weak" ? "#dc262611" : "#16a34a11"};
  color: ${({ $type }) => ($type === "weak" ? "#dc2626" : "#16a34a")};
  border: 1px solid
    ${({ $type }) => ($type === "weak" ? "#dc262644" : "#16a34a44")};
`;

const EmptyHint = styled.p`
  font-size: 13px;
  color: ${s("textTertiary")};
  margin: 0;
  font-style: italic;
`;

const LoadingText = styled.p`
  font-size: 14px;
  color: ${s("textTertiary")};
  margin: 0;
`;

const ErrorText = styled.p`
  font-size: 14px;
  color: #dc2626;
  margin: 0;
`;
