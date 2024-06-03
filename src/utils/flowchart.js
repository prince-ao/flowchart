import { supabase } from "./supabase";

export async function getVisibleYears() {
  let { data: flowcharts, error } = await supabase
    .from("flowcharts")
    .select("flowchart_year");

  if (error) {
    throw new Error(error.message);
  }

  const course_years = flowcharts.map((flowchart) => flowchart.flowchart_year);

  return course_years;
}

export async function createNewFlowchart(nodes, fileName) {
  const { data, error } = await supabase
    .from("flowcharts")
    .insert([{ flowchart_json: nodes, flowchart_year: fileName }]);

  if (error) {
    throw new Error(error.message);
  }
}

export function displayYear(year) {
  return year.split("-").join(" - ");
}
