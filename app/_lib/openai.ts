import OpenAI from "openai";
import { z } from "zod";

const openai = new OpenAI();

const PlantTips = z.object({
    genus: z.string(),
    species: z.string(),
    common_names: z.array(z.string()),
    regions: z.array(z.string()),
    growing_tips: z.object({
        soil_type: z.string(),
        watering: z.string(),
    })
})

export { openai, PlantTips };