import React, { useState, useEffect } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './ReportTable.css'; // Import the CSS file for styling

const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [systemNameFilter, setSystemNameFilter] = useState("");
  const [userNameFilter, setUserNameFilter] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");  // Track sort direction

  useEffect(() => {
    // Fetch data from API
    axios
      .get("http://localhost:9090/api/reports/fetch/all")
      .then((response) => {
        setReports(response.data);
        setFilteredReports(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the reports!", error);
      });
  }, []);

  // Function to parse date in "dd-MM-yyyy" format into a Date object
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");  // Split the date string
    return new Date(`${year}-${month}-${day}`);     // Return a Date object
  };

  // Handle filtering logic
  const handleFilter = () => {
    let filtered = reports;

    // Filter by system name
    if (systemNameFilter) {
      filtered = filtered.filter((report) =>
        report.systemName.toLowerCase().includes(systemNameFilter.toLowerCase())
      );
    }

    // Filter by user name
    if (userNameFilter) {
      filtered = filtered.filter((report) =>
        report.users.some((user) =>
          user.userName.toLowerCase().includes(userNameFilter.toLowerCase())
        )
      );
    }

    // Date Filter Logic
    filtered = filtered.filter((report) => {
      const reportDate = parseDate(report.date); // Parse report date to Date object

      // Compare with start date and end date
      if (startDate && endDate) {
        return reportDate >= startDate && reportDate <= endDate;
      } else if (startDate) {
        return reportDate >= startDate;
      } else if (endDate) {
        return reportDate <= endDate;
      }
      return true; // No date filter applied
    });

    // Filter by total time spent (minutes)
    filtered = filtered.map((report) => {
      report.users.forEach((user) => {
        user.browsers.forEach((browser) => {
          browser.visitedSites = browser.visitedSites.filter(
            (site) => site.totalTimeSpentInMinutes > 0 // filter out sites with no time spent
          );
        });
      });
      return report;
    });

    setFilteredReports(filtered);
  };

  // Sort the data by total time spent in minutes
  const handleSort = () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newSortDirection);

    const sortedReports = [...filteredReports];

    sortedReports.forEach((report) => {
      report.users.forEach((user) => {
        user.browsers.forEach((browser) => {
          browser.visitedSites.sort((a, b) => {
            if (newSortDirection === "asc") {
              return a.totalTimeSpentInMinutes - b.totalTimeSpentInMinutes;
            } else {
              return b.totalTimeSpentInMinutes - a.totalTimeSpentInMinutes;
            }
          });
        });
      });
    });

    setFilteredReports(sortedReports);
  };

  return (
    <div className="report-table-container">
      <h1>Activity Reports</h1>

      <div className="filter-container">
        {/* System Name Filter */}
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by System Name"
          value={systemNameFilter}
          onChange={(e) => setSystemNameFilter(e.target.value)}
        />

        {/* User Name Filter */}
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by User Name"
          value={userNameFilter}
          onChange={(e) => setUserNameFilter(e.target.value)}
        />

        {/* Date Filter */}
        <div className="date-filter-container">
          <label>Start Date:</label>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
          />
        </div>
        <div className="date-filter-container">
          <label>End Date:</label>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
          />
        </div>

        {/* Apply Filter Button */}
        <button className="filter-button" onClick={handleFilter}>Apply Filters</button>
      </div>

      {/* Table */}
      <table className="activity-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>System Name</th>
            <th>Username</th>
            <th>Browser</th>
            <th>Visited Sites</th>
            {/* Add sorting to the "Total Time Spent" column */}
            <th
              className="sortable-column"
              onClick={handleSort}
              style={{ cursor: "pointer" }}
            >
              Total Time Spent (Minutes) {sortDirection === "asc" ? "↑" : "↓"}
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredReports.map((report) =>
            report.users.map((user) =>
              user.browsers.map((browser) =>
                browser.visitedSites.map((site, index) => (
                  <tr key={index}>
                    {index === 0 && (
                      <td rowSpan={browser.visitedSites.length}>
                        {report.date}
                      </td>
                    )}
                    {index === 0 && (
                      <td rowSpan={browser.visitedSites.length}>
                        {report.systemName}
                      </td>
                    )}
                    {index === 0 && (
                      <td rowSpan={browser.visitedSites.length}>
                        {user.userName}
                      </td>
                    )}
                    <td>{browser.browserName}</td>
                    <td>{site.title}</td>
                    <td>{site.totalTimeSpentInMinutes}</td>
                  </tr>
                ))
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReportTable;
