import { PlantTips } from "@/app/_lib/openai";
import { NextRequest, NextResponse } from "next/server";
import { openai } from "../../_lib/openai";
import { zodTextFormat } from "openai/helpers/zod";

export async function POST(req: NextRequest) {
  console.log(1);

  const body = await req.json();
  const plant = body.plant;

  console.log(2);

  let completion;

  try {
    completion = await openai.responses.parse({
      instructions: "You are a highly respected botanist and biologist with a vast knowledge of houseplants/garden maintenance. Produce the corresponding plant information based on the inputted species.",
      model: "gpt-4.1-nano",
      input: plant,
      text: {
        format: zodTextFormat(PlantTips, "plant_tips"),
      } 
    });

    console.log(await completion);

    if (!completion) return NextResponse.json({ error: "No plant details returned." });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ error: e });
  } finally {
    return NextResponse.json({ success: completion!.output_text });
  }
}
