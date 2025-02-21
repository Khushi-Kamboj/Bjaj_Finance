import { useState, useEffect } from "react";
import Select from "react-select";

const options = [
    { value: "numbers", label: "Numbers" },
    { value: "alphabets", label: "Alphabets" },
    { value: "highest_alphabet", label: "Highest Alphabet" }
];

export default function Home() {
    const [inputData, setInputData] = useState("");
    const [response, setResponse] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        document.title = "ABCD123"; // Set roll number as title
    }, []);

    const handleSubmit = async () => {
        try {
            const parsedData = JSON.parse(inputData);
            const res = await fetch("http://localhost:3000/bfhl", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(parsedData)
            });

            const result = await res.json();
            if (result.is_success) setResponse(result);
            else alert("API Error: " + result.message);
        } catch (error) {
            alert("Invalid JSON input or API error");
        }
    };

    const filteredResponse = response
        ? Object.fromEntries(
            Object.entries(response).filter(([key]) => selectedOptions.includes(key))
        )
        : {};

    return (
        <div style={{ padding: "20px", fontFamily: "Arial" }}>
            <h1>BFHL API Frontend</h1>
            <textarea
                value={inputData}
                onChange={(e) => setInputData(e.target.value)}
                placeholder='Enter JSON (e.g. {"data":["M","1","334","4","B"]})'
                style={{ width: "100%", height: "100px", padding: "10px" }}
            />
            <button
                onClick={handleSubmit}
                style={{
                    padding: "10px 20px",
                    marginTop: "10px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                Submit
            </button>

            {response && (
                <>
                    <Select
                        isMulti
                        options={options}
                        onChange={(selected) => setSelectedOptions(selected.map((s) => s.value))}
                        style={{ marginTop: "10px" }}
                    />
                    <h3>Filtered Response:</h3>
                    <pre style={{ background: "#f4f4f4", padding: "10px" }}>
            {JSON.stringify(filteredResponse, null, 2)}
          </pre>
                </>
            )}
        </div>
    );
}
