import Router from "koa-router";
import { QueryTypes } from "sequelize";
import auth from "@server/middlewares/authentication";
import validate from "@server/middlewares/validate";
import { PluginMethodologyEvent } from "@server/models";
import { sequelize } from "@server/storage/database";
import type { APIContext } from "@server/types";
import * as T from "./schema";

const router = new Router();

/**
 * Records a single learning analytics event for the authenticated user.
 * Fire-and-forget by design — the response is always { ok: true }.
 */
router.post(
  "methodology.track",
  auth(),
  validate(T.MethodologyTrackSchema),
  async (ctx: APIContext<T.MethodologyTrackReq>) => {
    const { user } = ctx.state.auth;
    const { event, data } = ctx.input.body;

    await PluginMethodologyEvent.create({
      teamId: user.teamId,
      userId: user.id,
      event,
      data: data ?? null,
    });

    ctx.body = { ok: true };
  }
);

interface SimulatorStepRow {
  step: string;
  count: number;
}

interface CaseRow {
  caseId: string;
  submissions: number;
  correct: number;
}

interface QuizRow {
  count: number;
  personas: string | null;
  problema: string | null;
  proceso: string | null;
  intereses: string | null;
  tensiones: string | null;
  ciclos: string | null;
}

interface CountRow {
  count: number;
}

/**
 * Returns aggregate learning analytics for the current team.
 * Restricted to team administrators.
 */
router.post(
  "methodology.stats",
  auth(),
  async (ctx: APIContext) => {
    const { user } = ctx.state.auth;

    if (!user.isAdmin) {
      ctx.status = 403;
      ctx.body = { error: "Forbidden", message: "Admin access required." };
      return;
    }

    const { teamId } = user;

    const [stepRows, caseRows, quizRows, startedRows, completedRows] =
      await Promise.all([
        sequelize.query<SimulatorStepRow>(
          `SELECT data->>'step' AS step, COUNT(*)::int AS count
           FROM plugin_methodology_events
           WHERE "teamId" = :teamId AND event = 'simulator.step'
           GROUP BY data->>'step'`,
          { replacements: { teamId }, type: QueryTypes.SELECT }
        ),
        sequelize.query<CaseRow>(
          `SELECT data->>'caseId' AS "caseId",
                  COUNT(*)::int AS submissions,
                  COUNT(*) FILTER (WHERE (data->>'correct')::boolean)::int AS correct
           FROM plugin_methodology_events
           WHERE "teamId" = :teamId AND event = 'case.submit'
           GROUP BY data->>'caseId'`,
          { replacements: { teamId }, type: QueryTypes.SELECT }
        ),
        sequelize.query<QuizRow>(
          `SELECT COUNT(*)::int AS count,
                  AVG((data->'scores'->>'personas')::numeric) AS personas,
                  AVG((data->'scores'->>'problema')::numeric) AS problema,
                  AVG((data->'scores'->>'proceso')::numeric) AS proceso,
                  AVG((data->'scores'->>'intereses')::numeric) AS intereses,
                  AVG((data->'scores'->>'tensiones')::numeric) AS tensiones,
                  AVG((data->'scores'->>'ciclos')::numeric) AS ciclos
           FROM plugin_methodology_events
           WHERE "teamId" = :teamId AND event = 'quiz.submit'`,
          { replacements: { teamId }, type: QueryTypes.SELECT }
        ),
        sequelize.query<CountRow>(
          `SELECT COUNT(DISTINCT "userId")::int AS count
           FROM plugin_methodology_events
           WHERE "teamId" = :teamId AND event = 'simulator.step'
             AND data->>'stepIndex' = '0'`,
          { replacements: { teamId }, type: QueryTypes.SELECT }
        ),
        sequelize.query<CountRow>(
          `SELECT COUNT(DISTINCT "userId")::int AS count
           FROM plugin_methodology_events
           WHERE "teamId" = :teamId AND event = 'simulator.complete'`,
          { replacements: { teamId }, type: QueryTypes.SELECT }
        ),
      ]);

    const stepReach = Object.fromEntries(
      stepRows.map((r) => [r.step, r.count])
    );

    const cases = Object.fromEntries(
      caseRows.map((r) => [
        r.caseId,
        {
          submissions: r.submissions,
          correctRate:
            r.submissions > 0
              ? Math.round((r.correct / r.submissions) * 100)
              : 0,
        },
      ])
    );

    const q = quizRows[0];
    const round = (v: string | null) =>
      v !== null ? Math.round(Number(v) * 10) / 10 : null;

    ctx.body = {
      simulator: {
        started: startedRows[0]?.count ?? 0,
        completed: completedRows[0]?.count ?? 0,
        stepReach,
      },
      cases,
      quiz: {
        submissions: q?.count ?? 0,
        avgScores: {
          personas: round(q?.personas ?? null),
          problema: round(q?.problema ?? null),
          proceso: round(q?.proceso ?? null),
          intereses: round(q?.intereses ?? null),
          tensiones: round(q?.tensiones ?? null),
          ciclos: round(q?.ciclos ?? null),
        },
      },
    };
  }
);

export default router;
