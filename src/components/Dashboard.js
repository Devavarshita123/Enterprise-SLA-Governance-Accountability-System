import React, { useEffect, useMemo, useState } from "react";
import "./Dashboard.css";
import api from "../services/api";

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
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchIncidents = async () => {
    try {
      setLoading(true);

      const response = await api.get(
        "/incident?sysparm_limit=100&sysparm_fields=number,short_description,state,u_sla_at_risk,u_sla_acknowledged,u_sla_breach_reason,u_sla_breach_justification"
      );

      console.log(response.data);

      const data = Array.isArray(response.data?.result)
        ? response.data.result
        : [];

      const formattedData = data.map((item) => ({
        ...item,
        state:
          item.state === "1"
            ? "New"
            : item.state === "2"
            ? "In Progress"
            : item.state === "6"
            ? "Resolved"
            : item.state,

        u_sla_at_risk:
          item.u_sla_at_risk === true ||
          item.u_sla_at_risk === "true",

        u_sla_acknowledged:
          item.u_sla_acknowledged === true ||
          item.u_sla_acknowledged === "true",
      }));

      setIncidents(formattedData);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents();
  }, []);

  const filteredIncidents = useMemo(() => {
    return incidents.filter((i) => {
      const number = i.number || "";
      const description = i.short_description || "";

      return (
        number.toLowerCase().includes(search.toLowerCase()) ||
        description.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [incidents, search]);

  const total = incidents.length;

  const atRisk = incidents.filter(
    (i) => i.u_sla_at_risk
  ).length;

  const acknowledged = incidents.filter(
    (i) => i.u_sla_acknowledged
  ).length;

  const pending = incidents.filter(
    (i) => i.u_sla_at_risk && !i.u_sla_acknowledged
  ).length;

  const stateCount = {
    New: incidents.filter(
      (i) => i.state === "New"
    ).length,

    "In Progress": incidents.filter(
      (i) => i.state === "In Progress"
    ).length,

    Resolved: incidents.filter(
      (i) => i.state === "Resolved"
    ).length,
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
          "#3B82F6",
          "#F59E0B",
          "#10B981",
        ],
        borderColor: [
          "#2563EB",
          "#D97706",
          "#059669",
        ],
        borderWidth: 2,
        borderRadius: 8,
      },
    ],
  };

  const pieData = {
    labels: ["SLA At Risk", "SLA Safe"],
    datasets: [
      {
        data: [
          atRisk,
          total - atRisk,
        ],
        backgroundColor: [
          "#EF4444",
          "#22C55E",
        ],
        borderColor: [
          "#ffffff",
          "#ffffff",
        ],
        borderWidth: 2,
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
          type="text"
          placeholder="Search by Incident Number or Description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="refresh"
          onClick={fetchIncidents}
        >
          Refresh Data
        </button>
      </div>

      {loading ? (
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>
          Loading incidents...
        </h2>
      ) : (
        <>
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
                <Bar
                  data={barData}
                  options={barOptions}
                />
              </div>

            </div>

            <div className="chartCard">

              <h3>SLA Risk Distribution</h3>

              <div style={{ height: "350px" }}>
                <Pie
                  data={pieData}
                  options={pieOptions}
                />
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

              {filteredIncidents.length === 0 ? (

                <tr>
                  <td
                    colSpan="7"
                    style={{
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    No incidents found.
                  </td>
                </tr>

              ) : (

                filteredIncidents.map((incident) => (

                  <tr key={incident.sys_id || incident.number}>

                    <td>{incident.number}</td>

                    <td>{incident.short_description}</td>

                    <td>
                      <span className={getStatusClass(incident.state)}>
                        {incident.state}
                      </span>
                    </td>

                    <td>
                      {incident.u_sla_at_risk
                        ? "🔴 At Risk"
                        : "🟢 Safe"}
                    </td>

                    <td>
                      {incident.u_sla_acknowledged
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      {incident.u_sla_breach_reason || "-"}
                    </td>

                    <td>
                      {incident.u_sla_breach_justification || "-"}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </>
      )}

    </div>
  );
}

export default Dashboard;
