import { PlantTips } from "@/app/_lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../_lib/openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const plant = body.plant;

  let parsedResult;

  try {
    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "system",
          content:
            "You are a highly respected botanist and biologist with a vast knowledge of houseplants/garden maintenance. Produce the corresponding plant information based on the inputted species.",
        },
        {
          role: "user",
          content: `${plant}`,
        },
      ],
      response_format: zodResponseFormat(PlantTips, "plant_tips"),
    });

    let openaiPlantResult = completion.choices[0].message;

    if (openaiPlantResult.refusal) {
      console.log(openaiPlantResult.refusal);
      return;
    }

    parsedResult = openaiPlantResult.parsed;

    console.log(parsedResult);
  } catch (e) {
    return NextResponse.json({ error: e });
  }

  return NextResponse.json({ success: parsedResult });
}
