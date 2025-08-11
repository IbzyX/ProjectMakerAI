document.addEventListener('DOMContentLoaded', () => {
  const alerts = document.querySelectorAll('.alert');

  alerts.forEach(alert => {
    setTimeout(() => {
      alert.classList.add('fade-out');
      setTimeout(() => alert.remove(), 1000);
    }, 5000);
  });
});

function toggleDropdown(event) {
    event.preventDefault();
    const dropdown = document.getElementById("userDropdown");
    dropdown.style.display = (dropdown.style.display === "block") ? "none" : "block";
}

// Hide dropdown on outside click
window.onclick = function(event) {
    if (!event.target.closest('.dropdown')) {
        const dropdown = document.getElementById("userDropdown");
        if (dropdown) dropdown.style.display = "none";
    }
}

