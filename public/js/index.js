let transactions = [];
let myChart;

fetch("/api/transaction")
    .then((response) => {
        return response.json();
    })
    .then((data) => {
        transactions = data;

        populateTotal();
        populateTable();
        populateChart();
    });

function populateTotal() {
    let total = transactions.reduce((total, t) => {
        return total + parseInt(t.value);
    }, 0);

    let totalEl = document.querySelector("#total");
    totalEl.textContent = total;
}

function populateTable() {
    let tableBody = document.querySelector("#tableBody");
    tableBody.innerHTML = "";

    transactions.forEach((transaction) => {
        let offTr = document.createElement("offTr");
        offTr.innerHTML = `
            <td>${transaction.name}</td>
            <td>${transaction.value}</td>
            `;

        tableBody.appendChild(offTr);
    });
}
