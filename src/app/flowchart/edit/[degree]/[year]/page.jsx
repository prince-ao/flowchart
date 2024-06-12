/*
    This is the page for editing a degree. It is a form that allows the user to edit the degree's name and description.
*/

export default function EditFlowchart({params}) {

    return (
        <div>
         {params.degree}
         {params.year}
        </div>
    )

}