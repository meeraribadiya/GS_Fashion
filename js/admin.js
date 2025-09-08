
// Simple Admin Panel for GS Fashion
const BASE_URL = 'http://192.168.1.5:5000';
const adminPanel = {
  products: [],
  currentProduct: null,
  
  // Initialize the admin panel
  init: function() {
    this.loadProducts();
    this.setupEventListeners();
  },
  
  // Load products from the server
  loadProducts: async function() {
    try {
      const response = await fetch(`${BASE_URL}/products`);
      this.products = await response.json();
      this.renderProductList();
      this.updateStats();
      this.updateAnalytics();
    } catch (error) {
      console.error('Error loading products:', error);
      this.showNotification('Error loading products', 'error');
    }
  },
  
  // Update statistics
  updateStats: function() {
    const totalProducts = this.products.length;
    const inStockCount = this.products.filter(p => p.in_stock).length;
    const outOfStockCount = totalProducts - inStockCount;
    
    document.getElementById('totalProducts').textContent = totalProducts;
    document.getElementById('inStockCount').textContent = inStockCount;
    document.getElementById('outOfStockCount').textContent = outOfStockCount;
  },
  
  // Update category analytics
  updateAnalytics: function() {
    const categories = {
      'kurti': { total: 0, inStock: 0, views: 0 },
      'tunic': { total: 0, inStock: 0, views: 0 },
      'top': { total: 0, inStock: 0, views: 0 }
    };
    
    this.products.forEach(product => {
      if (categories[product.category]) {
        categories[product.category].total++;
        if (product.in_stock) categories[product.category].inStock++;
        categories[product.category].views += product.views || 0;
      }
    });
    
    // Update analytics table
    const analyticsTable = document.getElementById('categoryAnalytics');
    if (!analyticsTable) return;
    
    analyticsTable.innerHTML = '';
    
    for (const [category, data] of Object.entries(categories)) {
      const percentage = Math.round((data.total / this.products.length) * 100) || 0;
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${category.charAt(0).toUpperCase() + category.slice(1)}</td>
        <td>${data.total}</td>
        <td>${data.inStock}</td>
        <td>${data.total - data.inStock}</td>
        <td>${data.views}</td>
        <td>
          <div class="progress" style="height: 6px;">
            <div class="progress-bar" role="progressbar" style="width: ${percentage}%" 
                 aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100">
            </div>
          </div>
          <small>${percentage}%</small>
        </td>
      `;
      analyticsTable.appendChild(row);
    }
    
    // Update chart if Chart.js is available
    if (window.Chart) {
      this.updateChart(categories);
    }
  },
  
  // Update the chart with category data
  updateChart: function(categories) {
    const ctx = document.getElementById('categoryChart');
    if (!ctx) return;
    
    const labels = Object.keys(categories).map(c => c.charAt(0).toUpperCase() + c.slice(1));
    const data = Object.values(categories).map(c => c.total);
    
    // Destroy existing chart if it exists
    if (ctx.chart) {
      ctx.chart.destroy();
    }
    
    // Create new chart
    ctx.chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: ['#2c3e50', '#3498db', '#9b59b6'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom'
          }
        }
      }
    });
  },
  
  // Render product list
  renderProductList: function() {
    const productList = document.getElementById('productList');
    if (!productList) return;
    
    if (this.products.length === 0) {
      productList.innerHTML = `
        <tr>
          <td colspan="6" class="text-center py-5">
            <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
            <p class="mb-0">No products found</p>
            <button class="btn btn-primary mt-3" onclick="adminPanel.showAddForm()">
              <i class="fas fa-plus me-2"></i>Add Your First Product
            </button>
          </td>
        </tr>`;
      return;
    }
    
    productList.innerHTML = this.products.map((product, index) => `
      <tr>
        <td>${index + 1}</td>
        <td>
          <div class="d-flex align-items-center">
            <img src="images/${product.image || 'placeholder.svg'}" alt="${product.name}" 
                 class="product-img me-3" onerror="this.src='images/placeholder.svg'">
            <div>
              <div class="fw-bold">${product.name}</div>
              <small class="text-muted">${product.material || 'No material specified'}</small>
            </div>
          </div>
        </td>
        <td>${product.category ? product.category.charAt(0).toUpperCase() + product.category.slice(1) : 'N/A'}</td>
        <td>₹${parseFloat(product.price || 0).toFixed(2)}</td>
        <td>${product.in_stock ? 
          '<span class="badge bg-success">In Stock</span>' : 
          '<span class="badge bg-danger">Out of Stock</span>'}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-primary me-1" 
                  onclick="adminPanel.editProduct('${product.id}')">
            <i class="fas fa-edit"></i>
          </button>
          <button class="btn btn-sm btn-outline-danger" 
                  onclick="adminPanel.confirmDelete('${product.id}')">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>`).join('');
  },
  
  // Show add product form
  showAddForm: function() {
    this.currentProduct = null;
    const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
    const form = document.getElementById('addProductForm');
    
    // Reset form
    form.reset();
    
    // Set default values
    form.elements['category'].value = 'kurti';
    form.elements['in_stock'].checked = true;
    
    // Set default size to M
    document.querySelectorAll('input[name="sizes[]"]').forEach(checkbox => {
      checkbox.checked = checkbox.value === 'M';
    });
    
    // Update button text
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm d-none" role="status"></span> Add Product';
    
    // Update modal title
    modal._element.querySelector('.modal-title').textContent = 'Add New Product';
    
    // Focus on name field
    form.querySelector('input[name="name"]').focus();
    
    // Reset image preview
    const imagePreview = document.getElementById('imagePreview');
    if (imagePreview) {
      imagePreview.src = '#';
      imagePreview.classList.add('d-none');
    }
    
    // Show modal
    modal.show();
  },
  
  // Edit product
  editProduct: async function(productId) {
    try {
      const response = await fetch(`http://localhost:5000/products/${productId}`);
      this.currentProduct = await response.json();
      
      const form = document.getElementById('addProductForm');
      form.elements['name'].value = this.currentProduct.name || '';
      form.elements['category'].value = this.currentProduct.category || 'kurti';
      form.elements['price'].value = this.currentProduct.price || '';
      form.elements['material'].value = this.currentProduct.material || '';
      form.elements['in_stock'].checked = this.currentProduct.in_stock !== false;
      form.elements['description'].value = this.currentProduct.description || '';
      
      // Handle sizes checkboxes
      const sizes = Array.isArray(this.currentProduct.sizes) 
        ? this.currentProduct.sizes 
        : (this.currentProduct.sizes || '').split(',').map(s => s.trim());
      
      document.querySelectorAll('input[name="sizes[]"]').forEach(checkbox => {
        checkbox.checked = sizes.includes(checkbox.value);
      });
      
      // Update button text
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm d-none" role="status"></span> Update Product';
      
      // Update image preview
      const imagePreview = document.getElementById('imagePreview');
      if (imagePreview) {
        if (this.currentProduct.image) {
          imagePreview.src = `images/${this.currentProduct.image}`;
          imagePreview.classList.remove('d-none');
        } else {
          imagePreview.src = '#';
          imagePreview.classList.add('d-none');
        }
      }
      
      const modal = new bootstrap.Modal(document.getElementById('addProductModal'));
      modal._element.querySelector('.modal-title').textContent = 'Edit Product';
      modal.show();
    } catch (error) {
      console.error('Error loading product:', error);
      this.showNotification('Error loading product details', 'error');
    }
  },
  
  // Handle form submission
  handleFormSubmit: async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    const spinner = submitBtn.querySelector('.spinner-border');
    
    try {
      // Show loading state
      submitBtn.disabled = true;
      spinner.classList.remove('d-none');
      
      // Get all form data
      const formData = new FormData(form);
      const sizes = Array.from(formData.getAll('sizes[]'));
      
      // Create product data object
      const productData = {
        name: formData.get('name') || '',
        category: formData.get('category') || 'kurti',
        price: parseFloat(formData.get('price')) || 0,
        material: formData.get('material') || '',
        sizes: sizes.length > 0 ? sizes : ['M'], // Default to M if no size selected
        in_stock: formData.get('in_stock') === 'on',
        description: formData.get('description') || ''
      };
      
      // Handle image upload if a new file is selected
      const imageFile = formData.get('image');
      if (imageFile && imageFile.size > 0) {
        // In a real app, you would upload the file to a server here
        // For now, we'll just use the file name
        productData.image = imageFile.name;
      } else if (this.currentProduct) {
        // Keep the existing image if editing and no new image was uploaded
        productData.image = this.currentProduct.image || '';
      }
      
      let response;
      const isEdit = !!this.currentProduct;
      
      if (isEdit) {
        // Update existing product
        response = await fetch(`http://localhost:5000/products/${this.currentProduct.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      } else {
        // Add new product
        response = await fetch('http://localhost:5000/products', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(productData)
        });
      }
      
      if (!response.ok) throw new Error('Failed to save product');
      
      // Refresh the product list
      await this.loadProducts();
      
      // Close modal and show success message
      bootstrap.Modal.getInstance(document.getElementById('addProductModal')).hide();
      this.showNotification(`Product ${isEdit ? 'updated' : 'added'} successfully`, 'success');
      
    } catch (error) {
      console.error('Error saving product:', error);
      this.showNotification('Error saving product', 'error');
    } finally {
      submitBtn.disabled = false;
      spinner.classList.add('d-none');
    }
  },
  
  // Confirm before deleting
  confirmDelete: function(productId) {
    this.currentProduct = this.products.find(p => p.id == productId);
    if (!this.currentProduct) return;
    
    if (confirm(`Are you sure you want to delete "${this.currentProduct.name}"?`)) {
      this.deleteProduct();
    }
  },
  
  // Delete product
  deleteProduct: async function() {
    if (!this.currentProduct) return;
    
    try {
      const response = await fetch(`http://localhost:5000/products/${this.currentProduct.id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Failed to delete product');
      
      // Update UI
      this.products = this.products.filter(p => p.id !== this.currentProduct.id);
      this.renderProductList();
      this.updateStats();
      this.updateAnalytics();
      
      this.showNotification('Product deleted successfully', 'success');
      
    } catch (error) {
      console.error('Error deleting product:', error);
      this.showNotification('Error deleting product', 'error');
    }
  },
  
  // Show notification toast
  showNotification: function(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastBody = toast.querySelector('.toast-body');
    
    // Set message and style based on type
    toastBody.textContent = message;
    
    // Remove all type classes and add the new one
    ['bg-primary', 'bg-success', 'bg-danger', 'bg-warning'].forEach(cls => {
      toast.classList.remove(cls);
    });
    
    switch(type) {
      case 'success':
        toast.classList.add('bg-success');
        break;
      case 'error':
        toast.classList.add('bg-danger');
        break;
      case 'warning':
        toast.classList.add('bg-warning');
        break;
      case 'info':
      default:
        toast.classList.add('bg-primary');
    }
    
    // Show the toast
    const bsToast = new bootstrap.Toast(toast, { autohide: true, delay: 3000 });
    bsToast.show();
  },
  
  // Set up event listeners
  setupEventListeners: function() {
    // Add/Edit product form submission
    const productForm = document.getElementById('addProductForm');
    if (productForm) {
      productForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
    }
    
    // Image preview
    const imageInput = document.querySelector('input[type="file"]');
    if (imageInput) {
      imageInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(e) {
            const preview = document.getElementById('imagePreview');
            if (preview) {
              preview.src = e.target.result;
              preview.classList.remove('d-none');
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
    
    // Reset form when modal is hidden
    const addProductModal = document.getElementById('addProductModal');
    if (addProductModal) {
      addProductModal.addEventListener('hidden.bs.modal', () => {
        const form = document.getElementById('addProductForm');
        if (form) {
          form.reset();
          // Reset image preview
          const imagePreview = document.getElementById('imagePreview');
          if (imagePreview) {
            imagePreview.src = '#';
            imagePreview.classList.add('d-none');
          }
        }
        this.currentProduct = null;
      });
    }
  }
};
// Initialize the admin panel when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  adminPanel.init();
});
