import { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

function Dashboard() {
  const [search, setSearch] = useState("");
  const [incidents, setIncidents] = useState([]);

  useEffect(() => {
    setIncidents([
      {
        number: "INC0010001",
        short_description: "Email server is down",
        state: "In Progress",
        u_sla_at_risk: true,
        u_sla_acknowledged: false,
        u_sla_breach_reason: "Network Issue",
        u_sla_breach_justification: "Waiting for network team",
      },
      {
        number: "INC0010002",
        short_description: "VPN connection issue",
        state: "Resolved",
        u_sla_at_risk: false,
        u_sla_acknowledged: true,
        u_sla_breach_reason: "",
        u_sla_breach_justification: "",
      },
      {
        number: "INC0010003",
        short_description: "Laptop not booting",
        state: "New",
        u_sla_at_risk: true,
        u_sla_acknowledged: true,
        u_sla_breach_reason: "Hardware Failure",
        u_sla_breach_justification: "Replacement requested",
      },
      {
        number: "INC0010004",
        short_description: "Printer offline",
        state: "In Progress",
        u_sla_at_risk: false,
        u_sla_acknowledged: false,
        u_sla_breach_reason: "",
        u_sla_breach_justification: "",
      },
    ]);
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter(
      (i) =>
        i.number.toLowerCase().includes(search.toLowerCase()) ||
        i.short_description.toLowerCase().includes(search.toLowerCase())
    );
  }, [incidents, search]);

  const total = incidents.length;
  const atRisk = incidents.filter((i) => i.u_sla_at_risk).length;
  const acknowledged = incidents.filter(
    (i) => i.u_sla_acknowledged
  ).length;
  const pending = incidents.filter(
    (i) => i.u_sla_at_risk && !i.u_sla_acknowledged
  ).length;

  const stateCount = {
    New: incidents.filter((i) => i.state === "New").length,
    "In Progress": incidents.filter(
      (i) => i.state === "In Progress"
    ).length,
    Resolved: incidents.filter((i) => i.state === "Resolved").length,
  };

  const barData = {
  labels: ["New", "In Progress", "Resolved"],
  datasets: [
    {
      label: "Incidents",
      data: [
        stateCount.New,
        stateCount["In Progress"],
        stateCount.Resolved,
      ],
      backgroundColor: [
        "#ef4444",
        "#f59e0b",
        "#22c55e",
      ],
      borderColor: [
        "#dc2626",
        "#d97706",
        "#16a34a",
      ],
      borderWidth: 2,
      borderRadius: 10,
    },
  ],
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

const pieData = {
  labels: ["At Risk", "Safe"],
  datasets: [
    {
      data: [atRisk, total - atRisk],
      backgroundColor: [
        "#ef4444",
        "#22c55e",
      ],
      borderColor: [
        "#ffffff",
        "#ffffff",
      ],
      borderWidth: 2,
    },
  ],
};

const pieOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: "top",
    },
  },
};

  const getStatusClass = (state) => {
    if (state === "Resolved") return "status resolved";
    if (state === "In Progress") return "status progress";
    return "status new";
  };

  return (
    <div className="container">

      <h1>Enterprise SLA Governance Dashboard</h1>

      <p className="subtitle">
        Real-Time SLA Monitoring and Incident Analytics
      </p>

      <div className="topbar">
        <input
          className="search"
          placeholder="Search Incident..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="refresh"
          onClick={() => window.location.reload()}
        >
          Refresh
        </button>
      </div>

      <div className="cards">

        <div className="card">
          <h3>📄 Total Incidents</h3>
          <h2>{total}</h2>
        </div>

        <div className="card">
          <h3>⚠ SLA At Risk</h3>
          <h2>{atRisk}</h2>
        </div>

        <div className="card">
          <h3>✅ Acknowledged</h3>
          <h2>{acknowledged}</h2>
        </div>

        <div className="card">
          <h3>⏳ Pending</h3>
          <h2>{pending}</h2>
        </div>

      </div>

      <div className="charts">

        <div className="chartCard">
          <h3>Incident Status</h3>
          <div style={{ height: "350px" }}>
  <Bar data={barData} options={barOptions} />
</div>
        </div>

        <div className="chartCard">
          <h3>SLA Risk Distribution</h3>
          <div style={{ height: "350px" }}>
  <Pie data={pieData} options={pieOptions} />
</div>
        </div>

      </div>

      <table>

        <thead>
          <tr>
            <th>Incident</th>
            <th>Description</th>
            <th>State</th>
            <th>SLA Risk</th>
            <th>Acknowledged</th>
            <th>Breach Reason</th>
            <th>Justification</th>
          </tr>
        </thead>

        <tbody>

          {filteredIncidents.map((incident) => (

            <tr key={incident.number}>

              <td>{incident.number}</td>

              <td>{incident.short_description}</td>

              <td>
                <span className={getStatusClass(incident.state)}>
                  {incident.state}
                </span>
              </td>

              <td>
                {incident.u_sla_at_risk ? "🔴 At Risk" : "🟢 Safe"}
              </td>

              <td>
                {incident.u_sla_acknowledged ? "Yes" : "No"}
              </td>

              <td>
                {incident.u_sla_breach_reason || "-"}
              </td>

              <td>
                {incident.u_sla_breach_justification || "-"}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default Dashboard;