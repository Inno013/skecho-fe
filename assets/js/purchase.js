function showNewProductForm() {
    document.getElementById('newProductForm').style.display = 'block';
    document.getElementById('existingProductForm').style.display = 'none';
}

function hideNewProductForm() {
    document.getElementById('newProductForm').style.display = 'none';
}

function showExistingProductForm() {
    document.getElementById('existingProductForm').style.display = 'block';
    document.getElementById('newProductForm').style.display = 'none';
}

function hideExistingProductForm() {
    document.getElementById('existingProductForm').style.display = 'none';
}