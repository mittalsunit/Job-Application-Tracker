const apiBaseUrl = "http://localhost:5000/api";

// Handle Login
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "dashboard.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
});

// Handle Signup
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch(`${apiBaseUrl}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      alert("Signup successful! You can now log in.");
      window.location.href = "login.html";
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
});

// Handle Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
  localStorage.removeItem("token");
  window.location.href = "login.html";
});

// Fetch and display jobs
async function fetchJobs() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view this page!");
    window.location.href = "login.html";
    return;
  }

  // Get filter values
  const search = document.getElementById("search").value;
  const status = document.getElementById("status").value;
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;

  // Build query string
  const params = new URLSearchParams({
    search,
    status,
    startDate,
    endDate,
  }).toString();

  try {
    const response = await fetch(`${apiBaseUrl}/jobs?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (response.ok) {
      const jobsTable = document
        .getElementById("jobsTable")
        .querySelector("tbody");
      jobsTable.innerHTML = ""; // Clear existing rows

      data.jobs.forEach((job) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${job.companyName}</td>
            <td>${job.jobTitle}</td>
            <td>${job.status}</td>
            <td>${job.applicationDate}</td>
            <td>${job.notes}</td>
            <td>
              <button onclick="deleteJob(${job.id})">Delete</button>
            </td>
          `;
        jobsTable.appendChild(row);
      });
    } else {
      alert(data.message || "Failed to fetch jobs.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching jobs.");
  }
}

// Handle filter form submission
document.getElementById("filterForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  fetchJobs(); // Fetch jobs with the applied filters
});

// Add a new job
document.getElementById("jobForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  // const companyName = document.getElementById("companyName").value;
  // const jobTitle = document.getElementById("jobTitle").value;
  // const applicationDate = document.getElementById("applicationDate").value;
  // const status = document.getElementById("status").value;
  // const notes = document.getElementById("notes").value;


  const formData = new FormData();
  formData.append("companyName", document.getElementById("companyName").value);
  formData.append("jobTitle", document.getElementById("jobTitle").value);
  formData.append("applicationDate", document.getElementById("applicationDate").value);
  formData.append("status", document.getElementById("status").value);
  formData.append("notes", document.getElementById("notes").value);
  const resume = document.getElementById("resume").files[0];
  if (resume) formData.append("resume", resume);

  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${apiBaseUrl}/jobs`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      // body: JSON.stringify({
      //   companyName,
      //   jobTitle,
      //   applicationDate,
      //   status,
      //   notes,
      // }),


      body: formData,
    });

    if (response.ok) {
      alert("Job added successfully!");
      fetchJobs(); // Refresh the job list
      document.getElementById("jobForm").reset();
    } else {
      const data = await response.json();
      alert(data.message || "Failed to add job.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while adding the job.");
  }
});

// Delete a job
async function deleteJob(jobId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${apiBaseUrl}/jobs/${jobId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Job deleted successfully!");
      fetchJobs(); // Refresh the job list
    } else {
      const data = await response.json();
      alert(data.message || "Failed to delete job.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the job.");
  }
}

// Automatically fetch jobs on page load
if (window.location.pathname.endsWith("jobs.html")) {
  fetchJobs();
}

// Send a reminder email
document
  .getElementById("reminderForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value;
    const subject = document.getElementById("subject").value;
    const message = document.getElementById("message").value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiBaseUrl}/reminders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email, subject, message }),
      });

      if (response.ok) {
        alert("Reminder sent successfully!");
        document.getElementById("reminderForm").reset();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to send reminder.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while sending the reminder.");
    }
  });

// Fetch and display companies
async function fetchCompanies() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view this page!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/companies`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (response.ok) {
      const companiesTable = document
        .getElementById("companiesTable")
        .querySelector("tbody");
      companiesTable.innerHTML = ""; // Clear existing rows

      data.companies.forEach((company) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${company.name}</td>
            <td>${company.size || "N/A"}</td>
            <td>${company.industry || "N/A"}</td>
            <td>${company.contactDetails || "N/A"}</td>
            <td>${company.notes || "N/A"}</td>
            <td>
              <button onclick="deleteCompany(${company.id})">Delete</button>
            </td>
          `;
        companiesTable.appendChild(row);
      });
    } else {
      alert(data.message || "Failed to fetch companies.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching companies.");
  }
}

// Add a new company
document
  .getElementById("companyForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const size = document.getElementById("size").value;
    const industry = document.getElementById("industry").value;
    const contactDetails = document.getElementById("contactDetails").value;
    const notes = document.getElementById("notes").value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiBaseUrl}/companies`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name, size, industry, contactDetails, notes }),
      });

      if (response.ok) {
        alert("Company added successfully!");
        fetchCompanies(); // Refresh the company list
        document.getElementById("companyForm").reset();
      } else {
        const data = await response.json();
        alert(data.message || "Failed to add company.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while adding the company.");
    }
  });

// Delete a company
async function deleteCompany(companyId) {
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${apiBaseUrl}/companies/${companyId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (response.ok) {
      alert("Company deleted successfully!");
      fetchCompanies(); // Refresh the company list
    } else {
      const data = await response.json();
      alert(data.message || "Failed to delete company.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while deleting the company.");
  }
}

// Automatically fetch companies on page load
if (window.location.pathname.endsWith("companies.html")) {
  fetchCompanies();
}

// Fetch and display user profile
async function fetchProfile() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view this page!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (response.ok) {
      document.getElementById("name").value = data.user.name;
      document.getElementById("email").value = data.user.email;
    } else {
      alert(data.message || "Failed to fetch profile.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching the profile.");
  }
}

// Update user profile
document
  .getElementById("profileForm")
  ?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;

    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${apiBaseUrl}/user/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name }),
      });

      if (response.ok) {
        alert("Profile updated successfully!");
      } else {
        const data = await response.json();
        alert(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error(error);
      alert("An error occurred while updating the profile.");
    }
  });

if (window.location.pathname.endsWith("profile.html")) {
  fetchProfile();
}

// Fetch analytics data and render charts
async function fetchAnalytics() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must be logged in to view this page!");
    window.location.href = "login.html";
    return;
  }

  try {
    const response = await fetch(`${apiBaseUrl}/analytics`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (response.ok) {
      renderStatusChart(data.statusCounts);
      renderTimelineChart(data.timelineCounts);
    } else {
      alert(data.message || "Failed to fetch analytics data.");
    }
  } catch (error) {
    console.error(error);
    alert("An error occurred while fetching analytics data.");
  }
}

// Render status chart
function renderStatusChart(statusCounts) {
  const labels = statusCounts.map((item) => item.status);
  const data = statusCounts.map((item) => item.count);

  const ctx = document.getElementById("statusChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ["#007bff", "#ffc107", "#28a745", "#dc3545"],
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow chart resizing
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });
}

// Render timeline chart
function renderTimelineChart(timelineCounts) {
  const labels = timelineCounts.map((item) => item.month);
  const data = timelineCounts.map((item) => item.count);

  const ctx = document.getElementById("timelineChart").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "Applications Over Time",
          data,
          borderColor: "#007bff",
          fill: true,
          backgroundColor: "rgba(0, 123, 255, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false, // Allow chart resizing
      plugins: {
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Month",
          },
        },
        y: {
          title: {
            display: true,
            text: "Number of Applications",
          },
        },
      },
    },
  });
}

// Automatically fetch analytics data on dashboard load
if (window.location.pathname.endsWith("dashboard.html")) {
  fetchAnalytics();
}
