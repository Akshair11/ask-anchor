document.addEventListener("DOMContentLoaded", () => {
    const goalsInput = document.getElementById("goals-input");
    const generateRoadmapBtn = document.getElementById("generate-roadmap-btn");
    const roadmapFlowchart = document.getElementById("roadmap-flowchart");

    generateRoadmapBtn.addEventListener("click", () => {
        const goals = goalsInput.value.trim();

        if (!goals) {
            alert("Please enter your goals.");
            return;
        }

        fetch("/roadmap/generate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ goals }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.steps) {
                    renderFlowchart(data.steps);
                } else {
                    alert("Failed to generate roadmap. Please try again.");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
                alert("Something went wrong while generating the roadmap.");
            });
    });

    // Function to preprocess and clean roadmap data
    const preprocessRoadmapData = (steps) => {
        let flowchartDefinition = "graph TB\n";  // Set graph direction to Top to Bottom
        let stepCounter = 1;  // To keep track of step numbers

        steps.forEach((step, index) => {
            if (step.trim() !== "") {
                // Remove numbering and dot (e.g., "1. Learn HTML..." becomes "Learn HTML...")
                const cleanedStep = step.replace(/^\d+\.\s*/, "").trim();  // Regex to remove numbers and dots
                // alert(cleanedStep)
                // Add the cleaned step to the flowchart
                flowchartDefinition += `Step${stepCounter}["${cleanedStep}"]\n`;

                // If it's not the last step, connect the current step to the next one
                if (index < steps.length - 1) {
                    flowchartDefinition += `Step${stepCounter} --> Step${stepCounter + 1}\n`;
                }

                stepCounter++;
            }
        });

        return flowchartDefinition;
    };

    // Function to render the flowchart
    const renderFlowchart = (steps) => {
        let flowchartDefinition = preprocessRoadmapData(steps);

        // Add the flowchart definition to the container
        roadmapFlowchart.innerHTML = `<div class="mermaid">${flowchartDefinition}</div>`;

        // Re-initialize Mermaid with the rendered chart
        mermaid.initialize({ startOnLoad: true });
        mermaid.contentLoaded();  // Explicitly trigger Mermaid rendering after content is loaded
    };
});
