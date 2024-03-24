/**
 * Alert bootstrap method
 * 
 * @param {string} type chose type from this element (success, danger, warning)
 * @param {*} message message to display
 * @returns
 */
function createAlert(type, message) {
  const alertDiv = document.createElement("div");
  alertDiv.classList.add(
    "alert",
    `alert-${type}`,
    "alert-dismissible",
    "fade",
    "show"
  );
  alertDiv.setAttribute("role", "alert");

  const iconClass = {
    success: "bi-check-circle-fill",
    warning: "bi-exclamation-triangle-fill",
    danger: "bi-exclamation-octagon-fill",
  }[type];

  alertDiv.innerHTML = `
        <strong><i class="bi ${iconClass}"></i></strong>
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

  return alertDiv;
}

module.exports = createAlert;
