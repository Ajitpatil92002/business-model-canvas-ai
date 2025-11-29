import { z } from "zod"

export const bmcSchema = z.object({
  customer_segments: z
    .string()
    .describe("Who are the most important customers? Be specific with demographics, behaviors, and needs."),
  value_propositions: z.string().describe("What value do we deliver to the customer? What problems are we solving?"),
  channels: z
    .string()
    .describe("How do we reach our customer segments? Through which channels do they want to be reached?"),
  customer_relationships: z
    .string()
    .describe("What type of relationship does each customer segment expect? How do we establish and maintain them?"),
  revenue_streams: z.string().describe("For what value are customers willing to pay? How would they prefer to pay?"),
  key_resources: z.string().describe("What key resources do our value propositions require?"),
  key_activities: z.string().describe("What key activities do our value propositions require?"),
  key_partnerships: z
    .string()
    .describe("Who are our key partners and suppliers? Which key resources are we acquiring from partners?"),
  cost_structure: z.string().describe("What are the most important costs inherent in our business model?"),
  competitor_analysis: z
    .string()
    .describe("Who are the main competitors? What are their strengths and weaknesses? Use real company names."),
  market_insights: z.string().describe("What are the current market trends, size, and growth opportunities?"),
  search_queries_used: z.array(z.string()).describe("List the search queries you would use to research this business"),
})

export type BMCData = z.infer<typeof bmcSchema>
