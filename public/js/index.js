const { response } = require("express");

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
    let tbody = document.querySelector("#tbody");
    tbody.innerHTML = "";

    transactions.forEach((transaction) => {
        let tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${transaction.name}</td>
            <td>${transaction.value}</td>
            `;

        tbody.appendChild(tr);
    });
}

function populateChart() {
    let reverse = transactions.slice().reverse();
    let sum = 0;

    let labels = reverse.map((t) => {
        let date = new Date(t.date);
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    });

    let data = reverse.map((t) => {
        sum += parseInt(t.value);
        return sum;
    });

    if (myChart) {
        myChart.destroy();
    }

    let context = document.getElementById("myChart").getContext("2d");

    myChart = new Chart(context, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Total Over Time",
                    fill: true,
                    backgroundColor: "#7777ff",
                    data,
                },
            ],
        },
    });
}

function sendTransaction(isAdding) {
    let nameEl = document.querySelector("#t-name");
    let amountEl = document.querySelector("#t-amount");
    let errorEl = document.querySelector(".form .error");

    if (nameEl.value === "" || amountEl.value === "") {
        errorEl.textContent = "Information is missing.";
        return;
    } else {
        errorEl.textContent = "";
    }

    let transaction = {
        name: nameEl.value,
        value: amountEl.value,
        date: new Date().toISOString(),
    };

    if (!isAdding) {
        transaction.value *= -1;
    }

    transactions.unshift(transactions);

    populateChart();
    populateTable();
    populateTotal();

    fetch("/api/transaction", {
        method: "POST",
        body: JSON.stringify(transaction),
        headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
        },
    })
        .then((reponse) => {
            return response.json();
        })
        .then((data) => {
            if (data.errors) {
                errorEl.textContent = "Information is missing";
            } else {
                nameEl.value = "";
                amountEl.value = "";
            }
        })
        .catch((err) => {
            saveRecord(transaction);

            nameEl.value = "";
            amountEl.value = "";
        });
}

document.querySelector("#add-btn").onclick = function () {
    sendTransaction(true);
};

document.querySelector("#sub-btn").onclick = function () {
    sendTransaction(false);
};
