console.log("JS loaded");
console.log("Gantt data:", gantt);



function renderGanttFromJSON(data) {
    console.log("Final Gantt data to render:", data);

    const fixedData = data.map(task => ({
        ...task,
        start: new Date(task.start),
        end: new Date(task.end)
    }));

    const gantt = new Gantt("#gantt", fixedData, {
        view_mode: 'Month',
        date_format: 'YYYY-MM-DD',
        custom_popup_html: task => `
            <div class="details-container">
                <h5>${task.name}</h5>
                <p>Start: ${task.start.toISOString().split('T')[0]}</p>
                <p>End: ${task.end.toISOString().split('T')[0]}</p>
                <p>Progress: ${task.progress}%</p>
            </div>
        `
    });

    // Scroll to first task automatically
    const firstBar = document.querySelector('#gantt .bar-wrapper');
    if (firstBar) {
        const ganttContainer = document.querySelector('#gantt');
        const containerRect = ganttContainer.getBoundingClientRect();
        const barRect = firstBar.getBoundingClientRect();
        
        ganttContainer.scrollLeft = (barRect.left - containerRect.left) - 50; // 50px padding before bar
    }

    console.log("Gantt chart instance created successfully.");

}







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

            try {
                if (Array.isArray(gantt)) {
                    console.log("Calling renderGanttFromJSON now");
                    renderGanttFromJSON(gantt);
                } else if (typeof gantt === 'string') {
                    try {
                        const parsed = JSON.parse(gantt);
                        console.log("Calling renderGanttFromJSON now with parsed JSON");
                        renderGanttFromJSON(parsed);
                    } catch (e) {
                        console.error("Failed to parse gantt string:", e);
                    }
                }
            } catch (err) {
                document.getElementById('gantt').innerHTML = "<p>Error rendering Gantt chart.</p>";
                console.error("Gantt render error:", err);
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
        // For timeline, export the gantt as text summary, since PDF capturing canvas is complicated
        { title: "Time Line", id: "gantt" }, 
        { title: "Input Flags", id: "output_flags" }
    ];

    // Generate PDF logic here...
    // (Not changed here, keep your existing implementation or add later)
});
