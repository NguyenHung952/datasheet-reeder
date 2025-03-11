async function analyzeFile() {
    const fileInput = document.getElementById('fileInput').files[0];
    
    if (!fileInput) {
        alert("⚠️ Vui lòng chọn file!");
        return;
    }

    if (fileInput.name.endsWith('.pdf')) {
        analyzePDF(fileInput);
    } else if (fileInput.name.endsWith('.csv')) {
        analyzeCSV(fileInput);
    } else {
        alert("⚠️ Chỉ hỗ trợ PDF hoặc CSV!");
    }
}

async function analyzePDF(file) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(file);
    
    reader.onload = async function() {
        const result = await Tesseract.recognize(reader.result, 'eng');
        const text = result.data.text;

        extractAndCompare(text);
    };
}

function analyzeCSV(file) {
    const reader = new FileReader();
    reader.readAsText(file);
    
    reader.onload = function() {
        extractAndCompare(reader.result);
    };
}

function extractAndCompare(text) {
    console.log("Dữ liệu từ Datasheet:", text);

    // Giả lập trích xuất dữ liệu từ datasheet
    const extractedData = {
        voltage: 5.5,  // Giả lập lấy từ PDF
        current: 2.5   // Giả lập lấy từ PDF
    };

    const userRequirements = {
        voltage: 5,
        current: 2
    };

    updateTable(extractedData, userRequirements);
    drawChart(extractedData, userRequirements);
}

function updateTable(data, requirements) {
    const tableBody = document.querySelector("#resultTable tbody");
    tableBody.innerHTML = `
        <tr>
            <td>Điện Áp (V)</td>
            <td>${data.voltage}V</td>
            <td>≥ ${requirements.voltage}V</td>
            <td>${data.voltage >= requirements.voltage ? "✔️ Đạt" : "❌ Không đạt"}</td>
        </tr>
        <tr>
            <td>Dòng Điện (A)</td>
            <td>${data.current}A</td>
            <td>≥ ${requirements.current}A</td>
            <td>${data.current >= requirements.current ? "✔️ Đạt" : "❌ Không đạt"}</td>
        </tr>
    `;
}

function drawChart(data, requirements) {
    const ctx = document.getElementById('chart').getContext('2d');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ["Điện Áp (V)", "Dòng Điện (A)"],
            datasets: [
                {
                    label: "Datasheet",
                    data: [data.voltage, data.current],
                    backgroundColor: 'blue'
                },
                {
                    label: "Nhu Cầu",
                    data: [requirements.voltage, requirements.current],
                    backgroundColor: 'green'
                }
            ]
        }
    });
}
