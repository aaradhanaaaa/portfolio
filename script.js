// Typed.js animation
const typed = new Typed(".typing", {
  strings: [
    "ECE Student",
    "Frontend Developer",
    "AI Enthusiast",
    "Web Designer"
  ],
  typeSpeed: 90,
  backSpeed: 45,
  backDelay: 1800,
  smartBackspace: true,
  loop: true
});

const API_BASE = 'http://localhost:5000';

// Theme toggle
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const themeToggle = document.querySelector(".theme-toggle");
  const themeIcon = themeToggle?.querySelector("i");

  const setTheme = (mode) => {
    body.classList.toggle("light-mode", mode === "light");
    if (themeIcon) {
      themeIcon.className = mode === "light" ? "fas fa-sun" : "fas fa-moon";
    }
    localStorage.setItem("portfolioTheme", mode);
  };

  const savedTheme = localStorage.getItem("portfolioTheme");
  setTheme(savedTheme === "light" ? "light" : "dark");

  themeToggle?.addEventListener("click", () => {
    setTheme(body.classList.contains("light-mode") ? "dark" : "light");
  });

  // Contact form submission
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", handleFormSubmit);
  }

  renderCertificates("all");
  setupCertTabHandlers();
});

// Form submission handler
async function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const submitBtn = form.querySelector("button[type='submit']");
  const nameInput = form.querySelector("input[type='text']");
  const emailInput = form.querySelector("input[type='email']");
  const messageInput = form.querySelector("textarea");

  // Validation
  if (!nameInput.value.trim() || !emailInput.value.trim() || !messageInput.value.trim()) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
    showNotification("Please enter a valid email address", "error");
    return;
  }

  // Disable submit button and show loading state
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Sending...";

  try {
    const response = await fetch(`${API_BASE}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        message: messageInput.value.trim()
      })
    });

    const data = await response.json();

    if (response.ok && data.success) {
      showNotification(data.message, "success");
      form.reset();
      nameInput.focus();
    } else {
      showNotification(data.error || "Failed to send message", "error");
    }
  } catch (error) {
    console.error("Form submission error:", error);
    showNotification(
      "Connection error. Make sure the backend server is running on http://localhost:5000",
      "error"
    );
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
}

// Certificates data
const certificatesData = [
  {
    category: "ai",
    categoryName: "Artificial Intelligence",
    title: "Artificial Intelligence with Python",
    
    link: "certificates/Aradhana_Apr_2024_internship_54880.pdf"
  },

  {
    category: "frontend",
    categoryName: "Frontend",
    title: "Edunet - Frontend Development",
    link: "certificates/edunet - frontend development.pdf"
  },
  {
    category: "frontend",
    categoryName: "Frontend",
    title: "HTML, JavaScript & Bootstrap",
    link: "certificates/html, Javascript, bootstrap.pdf"
  },
  {
    category: "frontend",
    categoryName: "Frontend",
    title: "Web Development",
    link: "certificates/web development.pdf"
  },
  {
    category: "cybersecurity",
    categoryName: "Cybersecurity",
    title: "Cybersecurity Certification",
    link: "certificates/cyber security.pdf"
  },
  {
    category: "cybersecurity",
    categoryName: "Cybersecurity",
    title: "IBM Cybersecurity Certificate",
    link: "certificates/IBM.pdf"
  },
  {
    category: "ai",
    categoryName: "Artificial Intelligence",
    title: "Getting Started with AI",
    link: "certificates/Getting started with AI.pdf"
  },
  {
    category: "cloud",
    categoryName: "Cloud",
    title: "Journey To Cloud",
    link: "certificates/Journey To Cloud.pdf"
  },
  {
    category: "cloud",
    categoryName: "Cloud",
    title: "Cloud Platform Job Simulation",
    link: "certificates/Cloud Platform Job Simulation.pdf"
  }
];

function renderCertificates(category) {
  const certGrid = document.getElementById("certGrid");
  if (!certGrid) return;

  certGrid.innerHTML = "";

  const filtered = category === "all"
    ? certificatesData
    : certificatesData.filter(cert => cert.category === category);

  filtered.forEach(cert => {
    const certCard = document.createElement("article");
    certCard.className = "cert-card";

    const imageMarkup = cert.image
      ? `<img src="${cert.image}" alt="${cert.title} thumbnail" loading="lazy" />`
      : "";

    const iconMap = {
      ai: 'fas fa-brain',
      cloud: 'fas fa-cloud',
      frontend: 'fab fa-html5',
      cybersecurity: 'fas fa-shield-alt'
    };

    const iconClass = iconMap[cert.category] || 'fas fa-certificate';

    certCard.innerHTML = `
      ${imageMarkup}
      <div class="cert-card-body">
        <i class="${iconClass} cert-card-icon" aria-hidden="true"></i>
        <h3>${cert.title}</h3>
        <p>${cert.categoryName}</p>
      </div>
    `;

    if (cert.link) {
      certCard.addEventListener("click", () => {
        window.open(cert.link, "_blank");
      });
    }

    certGrid.appendChild(certCard);
  });
}

function setupCertTabHandlers() {
  const tabs = document.querySelectorAll(".cert-tab-btn");
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderCertificates(tab.dataset.category);
    });
  });
}

// Notification system
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    padding: 16px 24px;
    border-radius: 12px;
    background: ${
      type === "success"
        ? "rgba(34, 197, 94, 0.95)"
        : type === "error"
        ? "rgba(239, 68, 68, 0.95)"
        : "rgba(79, 123, 255, 0.95)"
    };
    color: white;
    font-weight: 600;
    z-index: 9999;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: slideIn 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOut 0.3s ease-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// Add animations for notifications
const style = document.createElement("style");
style.textContent = `
  @keyframes slideIn {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOut {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
