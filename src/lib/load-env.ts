import z from "zod";

const schema = z.object({
  MONGODB_URI: z.string(),
  MONGODB_NAME: z.string(),
});

export const ENVSchema = schema.parse(process.env);
