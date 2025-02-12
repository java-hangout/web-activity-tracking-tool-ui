import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './ReportTable.css';

const ReportTable = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10); // Rows per page (10 rows)
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [systemNameFilter, setSystemNameFilter] = useState("");
  const [userNameFilter, setUserNameFilter] = useState("");
  const [timeSpentFilter, setTimeSpentFilter] = useState(""); // Time spent filter
  const [sortDirection, setSortDirection] = useState("asc"); // Sorting direction
  const [sortedByTimeSpent, setSortedByTimeSpent] = useState(false); // Track sorting
  const navigate = useNavigate(); // Initialize navigate function

  useEffect(() => {
    axios
      .get("http://localhost:9090/api/reports/fetch/all")
      .then((response) => {
        setReports(response.data);
        setFilteredReports(response.data); // Initially set filteredReports to all reports
      })
      .catch((error) => {
        console.error("There was an error fetching the reports..!!", error);
      });
  }, []);

  // Helper function to parse the date
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split("-");
    return new Date(`${year}-${month}-${day}`);
  };

  const handleFilter = () => {
    let filtered = reports;

    if (systemNameFilter) {
      filtered = filtered.filter((report) =>
        report.systemName.toLowerCase().includes(systemNameFilter.toLowerCase())
      );
    }

    if (userNameFilter) {
      filtered = filtered.filter((report) =>
        report.users.some((user) =>
          user.userName.toLowerCase().includes(userNameFilter.toLowerCase())
        )
      );
    }

    if (timeSpentFilter) {
      const timeSpent = parseInt(timeSpentFilter, 10);

      filtered = filtered.filter((report) => {
        return report.users.some((user) =>
          user.browsers.some((browser) =>
            browser.visitedSites.some((site) =>
              site.totalTimeSpentInMinutes >= timeSpent
            )
          )
        );
      });
    }

    filtered = filtered.filter((report) => {
      const reportDate = parseDate(report.date);
      if (startDate && endDate) {
        return reportDate >= startDate && reportDate <= endDate;
      } else if (startDate) {
        return reportDate >= startDate;
      } else if (endDate) {
        return reportDate <= endDate;
      }
      return true;
    });

    setFilteredReports(filtered);
    setCurrentPage(1);
  };

  const generateCSV = (data) => {
    const flattenedData = [];
    data.forEach((report) => {
      report.users.forEach((user) => {
        user.browsers.forEach((browser) => {
          browser.visitedSites.forEach((site) => {
            flattenedData.push({
              Date: report.date,
              SystemName: report.systemName,
              UserName: user.userName,
              Browser: browser.browserName,
              SiteTitle: site.title,
              TotalTimeSpentInMinutes: site.totalTimeSpentInMinutes,
            });
          });
        });
      });
    });

    const headers = [
      "Date",
      "SystemName",
      "UserName",
      "Browser",
      "SiteTitle",
      "TotalTimeSpentInMinutes",
    ];

    const rows = flattenedData.map((row) =>
      headers.map((header) => row[header] || "").join(",")
    );

    const csvContent = [headers.join(","), ...rows].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "report.csv";
    link.click();
  };

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredReports.slice(indexOfFirstRow, indexOfLastRow);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredReports.length / rowsPerPage);

  const handleSort = () => {
    const newSortDirection = sortDirection === "asc" ? "desc" : "asc";
    setSortDirection(newSortDirection);

    // Flattening the data
    const flattenedData = [];
    filteredReports.forEach((report) => {
      report.users.forEach((user) => {
        user.browsers.forEach((browser) => {
          browser.visitedSites.forEach((site) => {
            flattenedData.push({
              date: report.date,
              systemName: report.systemName,
              userName: user.userName,
              browserName: browser.browserName,
              siteTitle: site.title,
              totalTimeSpentInMinutes: site.totalTimeSpentInMinutes,
            });
          });
        });
      });
    });

    // Sorting the flattened data by TotalTimeSpentInMinutes
    flattenedData.sort((a, b) => {
      return newSortDirection === "asc"
        ? a.totalTimeSpentInMinutes - b.totalTimeSpentInMinutes
        : b.totalTimeSpentInMinutes - a.totalTimeSpentInMinutes;
    });

    // Re-grouping the sorted data
    const reGroupedData = flattenedData.reduce((acc, row) => {
      const report = acc.find(
        (r) => r.date === row.date && r.systemName === row.systemName
      );
      if (report) {
        const user = report.users.find((u) => u.userName === row.userName);
        if (user) {
          const browser = user.browsers.find((b) => b.browserName === row.browserName);
          if (browser) {
            browser.visitedSites.push({
              title: row.siteTitle,
              totalTimeSpentInMinutes: row.totalTimeSpentInMinutes,
            });
          } else {
            user.browsers.push({
              browserName: row.browserName,
              visitedSites: [
                {
                  title: row.siteTitle,
                  totalTimeSpentInMinutes: row.totalTimeSpentInMinutes,
                },
              ],
            });
          }
        } else {
          report.users.push({
            userName: row.userName,
            browsers: [
              {
                browserName: row.browserName,
                visitedSites: [
                  {
                    title: row.siteTitle,
                    totalTimeSpentInMinutes: row.totalTimeSpentInMinutes,
                  },
                ],
              },
            ],
          });
        }
      } else {
        acc.push({
          date: row.date,
          systemName: row.systemName,
          users: [
            {
              userName: row.userName,
              browsers: [
                {
                  browserName: row.browserName,
                  visitedSites: [
                    {
                      title: row.siteTitle,
                      totalTimeSpentInMinutes: row.totalTimeSpentInMinutes,
                    },
                  ],
                },
              ],
            },
          ],
        });
      }
      return acc;
    }, []);

    setFilteredReports(reGroupedData);
  };

  const handleShowPieChart = () => {
    navigate('/pie-chart', { state: { reports: filteredReports } });
  };

  return (
    <div className="report-table-container">
      <div className="filter-container">
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by System Name"
          value={systemNameFilter}
          onChange={(e) => setSystemNameFilter(e.target.value)}
        />
        <input
          className="filter-input"
          type="text"
          placeholder="Filter by User Name"
          value={userNameFilter}
          onChange={(e) => setUserNameFilter(e.target.value)}
        />
        <input
          className="filter-input"
          type="number"
          placeholder="Filter by Time Spent (Minutes)"
          value={timeSpentFilter}
          onChange={(e) => setTimeSpentFilter(e.target.value)}
        />
        <div className="date-filter">
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date)}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
            placeholderText="Select Start Date"
          />
        </div>
        <div className="date-filter">
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date)}
            dateFormat="dd/MM/yyyy"
            className="date-picker"
            placeholderText="Select End Date"
          />
        </div>
        <button className="filter-button" onClick={handleFilter}>
          Apply Filters
        </button>
        <button
          className="download-button"
          onClick={() => generateCSV(filteredReports)}
        >
          Download CSV
        </button>
        <button className="download-button" onClick={handleShowPieChart}>
          Show Pie Chart
        </button>
      </div>

      {/* Table code */}
      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>System Name</th>
            <th>User Name</th>
            <th>Browser</th>
            <th>Site Title</th>
            <th
              className="sortable"
              onClick={handleSort}
              style={{ cursor: "pointer" }}
            >
              Total Time Spent (Minutes) {sortDirection === "asc" ? "↑" : "↓"}
            </th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((report, index) => {
            return report.users.map((user) =>
              user.browsers.map((browser) =>
                browser.visitedSites.map((site) => (
                  <tr key={index}>
                    <td>{report.date}</td>
                    <td>{report.systemName}</td>
                    <td>{user.userName}</td>
                    <td>{browser.browserName}</td>
                    <td>{site.title}</td>
                    <td>{site.totalTimeSpentInMinutes}</td>
                  </tr>
                ))
              )
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + 1}
            className={`page-button ${currentPage === index + 1 ? "active" : ""}`}
            onClick={() => paginate(index + 1)}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ReportTable;
