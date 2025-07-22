document.getElementById('projectForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const idea = document.getElementById('project_idea').value;

    const res = await fetch('/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ idea })
    });

    const data = await res.json();
    document.getElementById('aiOutput').innerText = data.output;
    document.getElementById('outputContainer').style.display = 'block';
    document.getElementById('downloadLink').style.display = 'inline';
    document.getElementById('downloadLink').href = `/download/${data.file_id}`;
});