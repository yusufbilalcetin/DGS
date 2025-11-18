import { dgsTopics, students } from "../utils/constants.js";

export function renderDashboard(data) {
    const grid = document.getElementById("stats-grid");
    grid.innerHTML = "";

    students.forEach(student => {
        const percentages = calculatePercentages(student, data);

        grid.innerHTML += createDashboardCard(student, percentages);
    });
}
