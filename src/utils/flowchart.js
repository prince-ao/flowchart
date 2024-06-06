import { supabase } from "./supabase";

export async function getVisibleYears() {
  console.log(`flowcharts${appendEnv()}`);
  let { data: flowcharts, error } = await supabase
    .from(`flowcharts${appendEnv()}`)
    .select("flowchart_year");

  if (error) {
    throw new Error(error.message);
  }

  const course_years = flowcharts.map((flowchart) => flowchart.flowchart_year);

  return course_years;
}

export async function createNewFlowchart(nodes, fileName) {
  const { data, error } = await supabase
    .from(`flowcharts${appendEnv()}`)
    .insert([{ flowchart_json: nodes, flowchart_year: fileName }]);

  if (error) {
    throw new Error(error.message);
  }
}

function appendEnv() {
  return process.env.NEXT_PUBLIC_ENV === "dev"
    ? "_dev"
    : process.env.NEXT_PUBLIC_ENV === "qa"
    ? "_qa"
    : "";
}

export function cleanNodes(nodes) {
  return nodes.map((node) =>
    node.type === "coreq"
      ? {
          id: node.id,
          courseName1: node.data.courseNumber1,
          fullName1: node.data.fullName1,
          courseName2: node.data.courseNumber2,
          fullName2: node.data.fullName2,
          nodeType: node.type,
          position: node.position,
          prerequisites: node.data.prerequisites,
        }
      : {
          id: node.id,
          courseName: node.data.courseNumber,
          description: node.data.description,
          fullName: node.data.fullName,
          nodeType: node.type,
          position: node.position,
          prerequisites: node.data.prerequisites,
        }
  );
}

export function displayYear(year) {
  return year.split("-").join(" - ");
}
