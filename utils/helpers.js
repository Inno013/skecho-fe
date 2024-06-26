function showErrorMessages(err, parentElement) {
  err = err.response.data;
  if (err.status >= 400 && err.status <= 422) {
    err.errors.forEach((error) => {
      const alertError = createAlert("danger", error);
      parentElement.appendChild(alertError);
    });
  } else {
    const alertError = createAlert("danger", err.message);
    parentElement.appendChild(alertError);
  }
}

function clearChieldElements(parentElement) {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

function hideModal(idModal) {
  document.getElementById(idModal).classList.remove("show");
  document.getElementById(idModal).setAttribute("aria-modal", "false");
  document.getElementById(idModal).setAttribute("style", "display: none");
  document.body.classList.remove("modal-open");
  document.getElementsByClassName("modal-backdrop")[0].remove();
}

// for search, next, previous page
class FilterData {
  attributes = {
    search: "",
    page: 0,
    size: 10,
    totalPage: 1,
  };

  incrementPage() {
    if (!(this.attributes.page < this.attributes.totalPage - 1)) return false;
    this.attributes.page++;
    return true;
  }

  decremnetPage() {
    if (!(this.attributes.page > 0)) return false;
    this.attributes.page--;
    return true;
  }

  setSearch(search) {
    this.attributes.search = search;
    this.attributes.page = 0;
  }

  setTotalPage(totalPage) {
    this.attributes.totalPage = totalPage;
  }

  toQueryParams(endpoint) {
    return `${endpoint}?search=${this.attributes.search}&page=${this.attributes.page}&size=${this.attributes.size}`;
  }
}
function convertToIDR(amount) {
  return amount;
  // Format the amount with comma as thousand separator and IDR currency symbol
  var formattedResult = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(amount);

  return formattedResult;
}
function convertIDRtoInt(idrString) {
  // Remove non-digit characters from the IDR string
  // var cleanIDR = idrString.replace(/\D/g, "");
  return parseInt(idrString);
  // Parse the cleaned string to an integer
  var intValue = parseInt(cleanIDR, 10);

  return intValue;
}

module.exports = {
  showErrorMessages,
  clearChieldElements,
  convertToIDR,
  convertIDRtoInt,
  hideModal,
  FilterData,
};
