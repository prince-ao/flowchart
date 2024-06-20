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

export async function createNewFlowchart(chart, year, degree) {
  const { data: degrees, d_error } = await supabase
    .from(`degrees`)
    .select("id, name");

  if (d_error) {
    throw new Error(d_error.message);
  }

  const { _, error } = await supabase.from(`${getFlowchartEnv()}`).insert([
    {
      flowchart_json: chart,
      flowchart_year: year,
      degrees_fk: degrees.find((m_degree) => m_degree.name === degree).id,
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }
}

export async function addDegree(degree_name, color) {
  const { _, error } = await supabase
    .from("degrees")
    .insert([{ name: degree_name, color }]);

  if (error) throw new Error(error);
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

export async function getAllDegrees() {
  let { data: degrees, error } = await supabase.from("degrees").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return degrees;
}

export async function getDegreeMapByDegreeYear(degree, year) {
  if (!degree || !year) throw new Error("degree and year required");

  let { data: flowcharts, error } = await supabase
    .from("degrees")
    .select(`name, color, ${getFlowchartEnv()}(flowchart_json, flowchart_year)`)
    .eq("name", degree)
    .eq(`${getFlowchartEnv()}.flowchart_year`, year);

  if (error || flowcharts.length === 0) {
    if (flowcharts.length === 0)
      throw new Error("degree and year could not be found");
    else throw new Error(error.message);
  }

  return flowcharts;
}

export async function getDegreeMapYears(degree) {
  let { data: years, error } = await supabase
    .from("degrees")
    .select(`name, ${getFlowchartEnv()}(flowchart_year)`)
    .eq("name", degree);

  if (error) {
    throw new Error(error.message);
  }

  return years;
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

export async function updateFlowchart(flowchart_data, year, degree) {
  const { data: degrees, d_error } = await supabase
    .from(`degrees`)
    .select("id, name");

  if (d_error) {
    throw new Error(d_error.message);
  }

  let { data, error } = await supabase
    .from(`${getFlowchartEnv()}`)
    .update({ flowchart_json: flowchart_data })
    .eq("flowchart_year", year)
    .eq("degrees_fk", degrees.find((m_degree) => m_degree.name === degree).id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function addCourse(code, name, url, category) {
  const { _, error } = await supabase
    .from("courses")
    .insert([{ code, name, url, category }]);

  if (error) throw new Error(error.message);
}

export async function deleteDegreeMap(year, degree) {
  const { data: degrees, d_error } = await supabase
    .from(`degrees`)
    .select("id, name");

  if (d_error) {
    throw new Error(d_error.message);
  }

  let { data, error } = await supabase
    .from(`${getFlowchartEnv()}`)
    .delete()
    .eq("flowchart_year", year)
    .eq("degrees_fk", degrees.find((m_degree) => m_degree.name === degree).id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deleteDegree(degree) {
  let { data, error } = await supabase
    .from(`degrees`)
    .delete()
    .eq("name", degree);

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
  console.log("clean", nodes);
  return nodes.map((node) => ({
    id: node.id,
    type: node.type,
    courseCode: node.data.courseCode,
    courseName: node.data.courseName,
    position: node.position,
    postrequisites: node.data.postrequisites,
    corequisites: node.data.corequisites,
  }));
}

export function dirtyNodes(nodes) {
  console.log("dirty", nodes);
  return nodes.map((node) => ({
    id: node.id,
    type: node.type,
    data: {
      courseCode: node.courseCode,
      courseName: node.courseName,
      postrequisites: node.postrequisites,
      corequisites: node.corequisites,
    },
    position: { x: node.position.x, y: node.position.y },
  }));
}

export function displayYear(year) {
  if (!year) {
    return;
  }
  return year.split("-").join(" - ");
}
