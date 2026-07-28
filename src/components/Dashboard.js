import React, { useState, useEffect } from "react";
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

      const data = Array.isArray(response.data?.result)
  ? response.data.result
  : [];

setIncidents(data);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      alert(
        "Unable to connect to ServiceNow.\nCheck your credentials or CORS configuration."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidents(
      const response = await api.get(
  "/incident?sysparm_limit=100"
);

console.log(response.data);

setIncidents(response.data.result || []);
    );
  }, []);

  const filteredIncidents = incidents.filter((incident) => {
    const number = incident.number || "";
    const description = incident.short_description || "";

    return (
      number.toLowerCase().includes(search.toLowerCase()) ||
      description.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalIncidents = filteredIncidents.length;

  const atRiskCount = filteredIncidents.filter(
    (i) => i.u_sla_at_risk === "true" || i.u_sla_at_risk === true
  ).length;

  const acknowledgedCount = filteredIncidents.filter(
    (i) => i.u_sla_acknowledged === "true" || i.u_sla_acknowledged === true
  ).length;

  const breachedCount = filteredIncidents.filter(
    (i) =>
      i.u_sla_breach_reason &&
      i.u_sla_breach_reason !== ""
  ).length;

  const newCount = filteredIncidents.filter(
    (i) => i.state === "1"
  ).length;

  const progressCount = filteredIncidents.filter(
    (i) => i.state === "2"
  ).length;

  const resolvedCount = filteredIncidents.filter(
    (i) => i.state === "6"
  ).length;

  const barData = {
    labels: ["New", "In Progress", "Resolved"],
    datasets: [
      {
        label: "Incidents",
        data: [newCount, progressCount, resolvedCount],
        backgroundColor: [
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
        borderColor: [
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
        ],
        borderWidth: 1,
      },
    ],
  };

  const pieData = {
    labels: ["SLA At Risk", "SLA Safe"],
    datasets: [
      {
        data: [
          atRiskCount,
          totalIncidents - atRiskCount,
        ],
        backgroundColor: [
          "#FF6384",
          "#4BC0C0",
        ],
      },
    ],
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };
    return (
    <div className="dashboard-container">
      <h1>Enterprise SLA Governance Dashboard</h1>

      <div className="toolbar">
        <input
          type="text"
          placeholder="Search by Incident Number or Description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button onClick={fetchIncidents}>
          Refresh Data
        </button>
      </div>

      {loading ? (
        <h3>Loading incidents...</h3>
      ) : (
        <>
          <div className="cards">

            <div className="card">
              <h2>{totalIncidents}</h2>
              <p>Total Incidents</p>
            </div>

            <div className="card">
              <h2>{atRiskCount}</h2>
              <p>SLA At Risk</p>
            </div>

            <div className="card">
              <h2>{acknowledgedCount}</h2>
              <p>Acknowledged</p>
            </div>

            <div className="card">
              <h2>{breachedCount}</h2>
              <p>SLA Breached</p>
            </div>

          </div>

          <div className="charts">

            <div className="chart-box">
              <h3>Incident Status</h3>
              <Bar
                data={barData}
                options={barOptions}
              />
            </div>

            <div className="chart-box">
              <h3>SLA Risk</h3>
              <Pie
                data={pieData}
                options={pieOptions}
              />
            </div>

          </div>

          <table className="incident-table">
            <thead>
              <tr>
                <th>Incident</th>
                <th>Description</th>
                <th>State</th>
                <th>At Risk</th>
                <th>Acknowledged</th>
                <th>Breach Reason</th>
                <th>Justification</th>
              </tr>
            </thead>

            <tbody>

              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="7">
                    No incidents found.
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((incident) => (
                  <tr key={incident.sys_id || incident.number}>

                    <td>{incident.number}</td>

                    <td>{incident.short_description}</td>

                    <td>
                      {incident.state === "1"
                        ? "New"
                        : incident.state === "2"
                        ? "In Progress"
                        : incident.state === "6"
                        ? "Resolved"
                        : incident.state}
                    </td>

                    <td>
                      {incident.u_sla_at_risk === true ||
                      incident.u_sla_at_risk === "true"
                        ? "Yes"
                        : "No"}
                    </td>

                    <td>
                      {incident.u_sla_acknowledged === true ||
                      incident.u_sla_acknowledged === "true"
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
