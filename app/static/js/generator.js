
//display AI generated output only after button is clicked 
document.getElementById("generateBtn").addEventListener("click", function () {
      // Show output section
      document.getElementById("outputSection").style.display = "block";

      // OPTIONAL: dummy data to test visuals
      document.getElementById("output_scope").innerText = "";
      document.getElementById("output_tasks").innerText = "";
      document.getElementById("output_research").innerText = "";
      document.getElementById("output_requirements").innerText = "";
      document.getElementById("output_gantt").innerText = "";
      document.getElementById("output_flags").innerText = "";
    });




    
//download button 
document.getElementById('downloadBtn').addEventListener('click', async () => {
    const outputFields = document.querySelectorAll('.output-field');
    const errorElement = document.getElementById('downloadError');

    // Clear previous error
    errorElement.textContent = "";

    // Check if all output fields are empty
    const isEmpty = Array.from(outputFields).every(field => field.value.trim() === "");
    if (isEmpty) {
        errorElement.textContent = "⚠ Please generate output before downloading the PDF.";
        return;
    }

    // Proceed with PDF generation
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const section = [
        {title: "project Scope", id: 0},
        {title: "Required Tasks", id: 1},
        {title: "Market Research", id: 2},
        {title: "Requirements", id: 3},
        {title: "Gantt Chart", id: 4},
        {title: "Input Flags", id: 5}
    ];

    let y = 10;

    outputFields.forEach((field, i) => {
        const title = sections[i];
        const value = field.value.trim();
        if (!value) return;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(title, 10, y);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(12);
        const lines = doc.splitTextToSize(value, 180);
        doc.text(lines, 10, y);
        y += lines.length * 7 + 6;

        if (y > 270) {
            doc.addPage();
            y = 10;
        }
    });

    doc.save('project_output.pdf');
});