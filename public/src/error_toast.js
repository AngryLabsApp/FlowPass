function showToast(message, type = "error", duration = 3000) {
  const toast = document.getElementById("toast");
  
  // set color by type
  const colors = {
    error: "#ef4444",
    success: "#22c55e",
    info: "#3b82f6",
    warning: "#f59e0b"
  };
  toast.style.background = colors[type] || colors.error;
  
  toast.textContent = message;
  toast.classList.add("show");
  
  clearTimeout(toast._timeout);
  toast._timeout = setTimeout(() => {
    toast.classList.remove("show");
  }, duration);
}