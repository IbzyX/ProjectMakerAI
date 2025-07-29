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