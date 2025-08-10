console.log("JS loaded");

document.getElementById('projectForm').addEventListener('submit', async (e) => {
    e.preventDefault(); 
    console.log("generate button clicked");

    const generateBtn = document.getElementById('generateBtn');
    const spinner = document.getElementById('spinner');
    const outputSection = document.getElementById('outputSection');
    const outputError = document.getElementById('downloadError');

    const data = {
        title: document.getElementById('title').value,
        description: document.getElementById('description').value,
        features: document.getElementById('features').value,
        team_size: document.getElementById('team_size').value,
        time_span: document.getElementById('time_span').value
    };

    outputError.textContent = "";
    outputSection.style.display = 'none';

    generateBtn.classList.add('loading');

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });        

        const result = await response.json();

        if (result.output) {
            const {
                scope,
                tasks,
                research,
                requirements,
                gantt,
                flags
            } = result.output;

            // Show text sections as plain text
            document.getElementById('output_scope').textContent = scope || "";
            document.getElementById('output_tasks').textContent = tasks || "";
            document.getElementById('output_research').textContent = research || "";
            document.getElementById('output_requirements').textContent = requirements || "";

            // Flags - if empty or no real content, display 'No flags'
            if (!flags || flags.trim().length === 0) {
                document.getElementById('output_flags').textContent = "No flags.";
            } else {
                document.getElementById('output_flags').textContent = flags;
            }



            outputSection.style.display = 'block';
            outputSection.scrollIntoView({ behavior: 'smooth' });

        } else {
            outputError.textContent = "Error generating output.";
        }

    } catch (error) {
        outputError.textContent = "Error: " + error.message;
    } finally {
        generateBtn.classList.remove('loading');
    }
});
document.getElementById('downloadBtn').addEventListener('click', () => {
    const outputError = document.getElementById('downloadError');
    outputError.textContent = "";

    const sections = [
        { title: "Project Scope", id: "output_scope" },
        { title: "Required Tasks", id: "output_tasks" },
        { title: "Market Research", id: "output_research" },
        { title: "Requirements", id: "output_requirements" },
        { title: "Time Line", id: "gantt" },
        { title: "Input Flags", id: "output_flags" }
    ];

    const allEmpty = sections.every(section => {
        const content = document.getElementById(section.id).textContent.trim();
        return content === "";
    });

    if (allEmpty) {
        outputError.textContent = "⚠ Please generate output before downloading the PDF.";
        return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    let y = 10;

    sections.forEach(section => {
        const value = document.getElementById(section.id).textContent.trim();
        if (!value) return;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(14);
        doc.text(section.title, 10, y);
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

    window.open(doc.output('bloburl'), '_blank');
    doc.save('project_output.pdf');
});
