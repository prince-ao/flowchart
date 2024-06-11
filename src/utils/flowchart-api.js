import { supabase } from "./supabase";

export async function getVisibleYears() {
  console.log(`${getFlowchartEnv()}`);
  let { data: flowcharts, error } = await supabase
    .from(`${getFlowchartEnv()}`)
    .select("flowchart_year");

  if (error) {
    throw new Error(error.message);
  }

  const course_years = flowcharts.map((flowchart) => flowchart.flowchart_year);

  return course_years;
}

export async function createNewFlowchart(nodes, fileName) {
  const { data, error } = await supabase
    .from(`${getFlowchartEnv()}`)
    .insert([{ flowchart_json: nodes, flowchart_year: fileName }]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getDegreeMapByDegree(degree) {
  if (!degree) throw new Error("degree required");

  let { data: flowcharts, error } = await supabase
    .from("degrees")
    .select(`name, ${getFlowchartEnv()}(flowchart_json, flowchart_year)`)
    .eq("name", degree);

  if (error) {
    throw new Error(error.message);
  }

  return flowcharts;
}

export async function getDegreeMapByDegreeYear(degree, year) {
  if (!degree || !year) throw new Error("degree and year required");

  let { data: flowcharts, error } = await supabase
    .from("degrees")
    .select(`name, ${getFlowchartEnv()}(flowchart_json, flowchart_year)`)
    .eq("name", degree)
    .eq(`${getFlowchartEnv()}.flowchart_year`, year);

  if (error || flowcharts.length === 0) {
    if (flowcharts.length === 0)
      throw new Error("degree and year could not be found");
    else throw new Error(error.message);
  }

  return flowcharts;
}

export async function getAllFlowcharts() {
  let { data: flowcharts, error } = await supabase
    .from(`${getFlowchartEnv()}`)
    .select("flowchart_year, flowchart_json");

  if (error) {
    throw new Error(error.message);
  }

  return flowcharts;
}

export async function deleteFlowchart(flowchart_year) {
  let { data, error } = await supabase
    .from(`${getFlowchartEnv()}`)
    .delete()
    .eq("flowchart_year", flowchart_year);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getAllCourses() {
  let { data: classes, error } = await supabase
    .from("courses")
    .select("code, name, category, url");

  if (error) {
    throw error;
  }

  return classes;
}

export async function getDegrees() {
  let { data: degrees, error } = await supabase
    .from(`degrees`)
    .select(`name, ${getFlowchartEnv()}(flowchart_year, flowchart_json)`);

  if (error) {
    throw new Error(error.message);
  }

  return degrees;
}

export function getFlowchartEnv() {
  return process.env.NEXT_PUBLIC_ENV === "dev"
    ? "flowcharts_dev"
    : "flowcharts";
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
  if (!year) {
    return;
  }
  return year.split("-").join(" - ");
}
