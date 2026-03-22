import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";

interface Principle {
  number: string;
  title: string;
  description: string;
  yes: string;
  no: string;
}

const principles: Principle[] = [
  {
    number: "01",
    title: "Personas antes que tecnología",
    description:
      "El centro son los problemas, deseos y miedos de la gente, no los algoritmos.",
    yes: "Antes de elegir el formato, entrevistamos a 5 personas para entender qué les preocupa realmente.",
    no: "Lanzamos el chatbot porque es tendencia, sin saber si la audiencia lo necesita o lo usaría.",
  },
  {
    number: "02",
    title: "Enamorarse del problema, no de la idea",
    description:
      "Antes de producir, debemos explicar qué problema real estamos resolviendo.",
    yes: "Antes de grabar un solo video, documentamos en una frase el problema que resuelve la serie.",
    no: "Tenemos una idea increíble de podcast. Empecemos a grabar. (Nadie preguntó qué problema resuelve.)",
  },
  {
    number: "03",
    title: "Un solo proceso mental",
    description:
      "Problema → Data → Tensión → Insight → Idea → Contenido → Distribución → Aprendizaje.",
    yes: "Para cada campaña llenamos el documento de 8 pasos antes de tocar una sola pieza.",
    no: "El cliente quiere más alcance → diseñamos el post. Nos saltamos 6 pasos.",
  },
  {
    number: "04",
    title: "Intereses > Demografía",
    description:
      "Importa más qué consumen y qué les duele que su edad o género.",
    yes: "Nuestra audiencia consume newsletters de finanzas personales, sigue referentes de productividad y le angustia quedar obsoleta.",
    no: "Nuestro público objetivo son hombres de 30-45 años de clase media en Colombia.",
  },
  {
    number: "05",
    title: "Conectar desde tensiones",
    description:
      "Buscamos resolver tensiones y generar emociones (alivio, orgullo, pertenencia).",
    yes: "El contenido apela al miedo de quedarse atrás y ofrece alivio concreto con pasos accionables.",
    no: "Publicamos información útil sobre el tema pero sin una emoción clara ni un gancho que enganche.",
  },
  {
    number: "06",
    title: "Ciclos cortos de aprendizaje",
    description:
      "Se lanza, se mide y se ajusta. No esperamos al reporte mensual.",
    yes: "A los 3 días del lanzamiento revisamos métricas y ajustamos el titular del próximo post.",
    no: "Esperamos el reporte del mes para ver si la campaña funcionó. Para entonces ya es tarde.",
  },
];

/**
 * Displays the 6 non-negotiable principles of the Social Methodology as
 * interactive expandable cards with real ✅/❌ examples.
 */
export function PrinciplesCards(): React.ReactElement {
  const [expanded, setExpanded] = React.useState<string | null>(null);

  const handleToggle = React.useCallback(
    (number: string) => {
      setExpanded(expanded === number ? null : number);
    },
    [expanded]
  );

  return (
    <Container>
      <Intro>
        Estos son los no negociables. Si un proyecto no respeta esto, está mal
        planteado. Haz clic en cualquier principio para ver ejemplos reales.
      </Intro>
      <Grid>
        {principles.map((principle) => {
          const isOpen = expanded === principle.number;
          return (
            <Card
              key={principle.number}
              $expanded={isOpen}
              onClick={() => handleToggle(principle.number)}
              role="button"
              aria-expanded={isOpen}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleToggle(principle.number);
                }
              }}
            >
              <CardNumber>{principle.number}</CardNumber>
              <CardTitle>{principle.title}</CardTitle>
              <CardDescription>{principle.description}</CardDescription>
              {isOpen && (
                <Examples>
                  <ExampleRow>
                    <ExampleTag $type="yes">✅ Así se ve</ExampleTag>
                    <ExampleText>{principle.yes}</ExampleText>
                  </ExampleRow>
                  <ExampleRow>
                    <ExampleTag $type="no">❌ Así NO se ve</ExampleTag>
                    <ExampleText>{principle.no}</ExampleText>
                  </ExampleRow>
                </Examples>
              )}
            </Card>
          );
        })}
      </Grid>
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
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 16px;
`;

const Card = styled.div<{ $expanded: boolean }>`
  border: 1.5px solid
    ${({ $expanded, theme }) => ($expanded ? theme.accent : theme.divider)};
  border-radius: 10px;
  padding: 20px;
  cursor: var(--pointer);
  background: ${({ $expanded, theme }) =>
    $expanded ? `${theme.accent}11` : theme.background};
  transition:
    border-color 150ms ease,
    background 150ms ease;
  display: flex;
  flex-direction: column;
  gap: 6px;

  &:hover {
    border-color: ${s("accent")};
  }

  &:focus-visible {
    outline: 2px solid ${s("accent")};
    outline-offset: 2px;
  }
`;

const CardNumber = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: ${s("accent")};
  display: block;
  line-height: 1;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.5;
`;

const Examples = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 10px;
  padding-top: 12px;
  border-top: 1px solid ${s("divider")};
`;

const ExampleRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ExampleTag = styled.span<{ $type: "yes" | "no" }>`
  font-size: 11px;
  font-weight: 700;
  color: ${({ $type }) => ($type === "yes" ? "#16a34a" : "#dc2626")};
  text-transform: uppercase;
  letter-spacing: 0.04em;
`;

const ExampleText = styled.p`
  font-size: 13px;
  color: ${s("textSecondary")};
  margin: 0;
  line-height: 1.5;
  font-style: italic;
`;
