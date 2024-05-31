import { supabase } from "./supabase";

export async function getVisibleYears() {
  let { data: flowcharts, error } = await supabase
    .from("flowcharts")
    .select("flowchart_year");

  if (error) {
    throw new Error(error.message);
  }

  let course_years = flowcharts.map((flowchart) =>
    flowchart.flowchart_year.split("-").join("-")
  );

  return course_years;
}
