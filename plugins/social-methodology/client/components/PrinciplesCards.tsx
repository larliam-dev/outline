import * as React from "react";
import styled from "styled-components";
import { s } from "@shared/styles";

interface Principle {
  number: string;
  title: string;
  description: string;
}

const principles: Principle[] = [
  {
    number: "01",
    title: "Personas antes que tecnología",
    description:
      "El centro son los problemas, deseos y miedos de la gente, no los algoritmos.",
  },
  {
    number: "02",
    title: "Enamorarse del problema, no de la idea",
    description:
      "Antes de producir, debemos explicar qué problema real estamos resolviendo.",
  },
  {
    number: "03",
    title: "Un solo proceso mental",
    description:
      "Problema → Data → Tensión → Insight → Idea → Contenido → Distribución → Aprendizaje.",
  },
  {
    number: "04",
    title: "Intereses > Demografía",
    description:
      "Importa más qué consumen y qué les duele que su edad o género.",
  },
  {
    number: "05",
    title: "Conectar desde tensiones",
    description:
      "Buscamos resolver tensiones y generar emociones (alivio, orgullo, pertenencia).",
  },
  {
    number: "06",
    title: "Ciclos cortos de aprendizaje",
    description:
      "Se lanza, se mide y se ajusta. No esperamos al reporte mensual.",
  },
];

/**
 * Displays the 6 non-negotiable principles of the Social Methodology as
 * interactive expandable cards.
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
        planteado.
      </Intro>
      <Grid>
        {principles.map((principle) => (
          <Card
            key={principle.number}
            $expanded={expanded === principle.number}
            onClick={() => handleToggle(principle.number)}
            role="button"
            aria-expanded={expanded === principle.number}
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
            {expanded === principle.number && (
              <CardDescription>{principle.description}</CardDescription>
            )}
          </Card>
        ))}
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
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
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
  margin-bottom: 8px;
`;

const CardTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: ${s("text")};
  margin: 0;
`;

const CardDescription = styled.p`
  font-size: 14px;
  color: ${s("textSecondary")};
  margin: 10px 0 0;
  line-height: 1.5;
`;
