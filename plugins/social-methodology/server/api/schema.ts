import { z } from "zod";

export const MethodologyTrackSchema = z.object({
  body: z.object({
    event: z.string().max(255),
    data: z.record(z.unknown()).optional(),
  }),
});

export type MethodologyTrackReq = z.infer<typeof MethodologyTrackSchema>;
