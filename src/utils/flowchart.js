import { supabase } from "./supabase";

export async function getVisibleYears() {
  let { data: flowcharts, error } = await supabase
    .from("flowcharts")
    .select("flowchart_year");

  if (error) {
    throw new Error(error.message);
  }

  flowcharts = flowcharts.map((flowchart) => flowchart.flowchart_year);

  return flowcharts;
}
