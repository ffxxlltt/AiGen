// 模拟订单数据
let orders = [];
let currentPage = 1;
const pageSize = 10;
let filteredOrders = [];

// 初始化页面
document.addEventListener('DOMContentLoaded', function() {
    generateMockData();
    renderOrders();
});

// 生成模拟订单数据
function generateMockData() {
    const statuses = ['pending', 'paid', 'shipped', 'completed', 'cancelled'];
    const products = ['iPhone 15 Pro', 'MacBook Air', 'AirPods Pro', 'iPad Pro', 'Apple Watch'];
    const customers = ['张三', '李四', '王五', '赵六', '钱七'];
    
    orders = [];
    for (let i = 1; i <= 50; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        const randomCustomer = customers[Math.floor(Math.random() * customers.length)];
        const randomAmount = (Math.random() * 10000 + 100).toFixed(2);
        
        const orderDate = new Date();
        orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
        
        orders.push({
            id: `ORD${String(i).padStart(4, '0')}`,
            customer: randomCustomer,
            product: randomProduct,
            amount: randomAmount,
            status: randomStatus,
            orderDate: orderDate.toISOString().split('T')[0],
            details: {
                address: `北京市朝阳区建国路${i}号`,
                phone: `138${String(i).padStart(8, '0')}`,
                paymentMethod: Math.random() > 0.5 ? '微信支付' : '支付宝',
                note: i % 3 === 0 ? '请尽快发货' : ''
            }
        });
    }
    filteredOrders = [...orders];
}

// 渲染订单列表
function renderOrders() {
    const tableBody = document.getElementById('ordersTableBody');
    const pageInfo = document.getElementById('pageInfo');
    
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const currentOrders = filteredOrders.slice(startIndex, endIndex);
    
    tableBody.innerHTML = '';
    
    currentOrders.forEach(order => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${order.id}</td>
            <td>${order.customer}</td>
            <td>${order.product}</td>
            <td>¥${order.amount}</td>
            <td><span class="status status-${order.status}">${getStatusText(order.status)}</span></td>
            <td>${order.orderDate}</td>
            <td>
                <button class="action-btn view-btn" onclick="viewOrder('${order.id}')">查看</button>
                <button class="action-btn edit-btn" onclick="editOrder('${order.id}')">编辑</button>
                <button class="action-btn delete-btn" onclick="deleteOrder('${order.id}')">删除</button>
            </td>
        `;
        
        tableBody.appendChild(row);
    });
    
    pageInfo.textContent = `第 ${currentPage} 页，共 ${Math.ceil(filteredOrders.length / pageSize)} 页`;
}

// 获取状态文本
function getStatusText(status) {
    const statusMap = {
        'pending': '待付款',
        'paid': '已付款',
        'shipped': '已发货',
        'completed': '已完成',
        'cancelled': '已取消'
    };
    return statusMap[status] || status;
}

// 搜索订单
function searchOrders() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    filteredOrders = orders.filter(order => 
        order.id.toLowerCase().includes(searchTerm) ||
        order.customer.toLowerCase().includes(searchTerm) ||
        order.product.toLowerCase().includes(searchTerm)
    );
    
    currentPage = 1;
    renderOrders();
}

// 应用筛选条件
function applyFilters() {
    const statusFilter = document.getElementById('statusFilter').value;
    const dateFrom = document.getElementById('dateFrom').value;
    const dateTo = document.getElementById('dateTo').value;
    
    filteredOrders = orders.filter(order => {
        let matches = true;
        
        if (statusFilter && order.status !== statusFilter) {
            matches = false;
        }
        
        if (dateFrom && order.orderDate < dateFrom) {
            matches = false;
        }
        
        if (dateTo && order.orderDate > dateTo) {
            matches = false;
        }
        
        return matches;
    });
    
    currentPage = 1;
    renderOrders();
}

// 重置筛选条件
function resetFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('dateFrom').value = '';
    document.getElementById('dateTo').value = '';
    
    filteredOrders = [...orders];
    currentPage = 1;
    renderOrders();
}

// 刷新订单
function refreshOrders() {
    generateMockData();
    resetFilters();
    alert('订单数据已刷新！');
}

// 查看订单详情
function viewOrder(orderId) {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const modal = document.getElementById('orderModal');
    const details = document.getElementById('orderDetails');
    
    details.innerHTML = `
        <div class="order-detail-item">
            <h3>基本信息</h3>
            <p><strong>订单号：</strong>${order.id}</p>
            <p><strong>客户：</strong>${order.customer}</p>
            <p><strong>商品：</strong>${order.product}</p>
            <p><strong>金额：</strong>¥${order.amount}</p>
            <p><strong>状态：</strong><span class="status status-${order.status}">${getStatusText(order.status)}</span></p>
            <p><strong>下单时间：</strong>${order.orderDate}</p>
        </div>
        
        <div class="order-detail-item">
            <h3>配送信息</h3>
            <p><strong>收货地址：</strong>${order.details.address}</p>
            <p><strong>联系电话：</strong>${order.details.phone}</p>
        </div>
        
        <div class="order-detail-item">
            <h3>支付信息</h3>
            <p><strong>支付方式：</strong>${order.details.paymentMethod}</p>
        </div>
        
        ${order.details.note ? `
        <div class="order-detail-item">
            <h3>备注</h3>
            <p>${order.details.note}</p>
        </div>
        ` : ''}
    `;
    
    modal.style.display = 'block';
}

// 编辑订单
function editOrder(orderId) {
    alert(`编辑订单 ${orderId} 的功能待实现`);
    // 这里可以打开编辑模态框或跳转到编辑页面
}

// 删除订单
function deleteOrder(orderId) {
    if (confirm(`确定要删除订单 ${orderId} 吗？此操作不可恢复。`)) {
        orders = orders.filter(order => order.id !== orderId);
        filteredOrders = filteredOrders.filter(order => order.id !== orderId);
        renderOrders();
        alert(`订单 ${orderId} 已删除`);
    }
}

// 关闭模态框
function closeModal() {
    document.getElementById('orderModal').style.display = 'none';
}

// 分页功能
function nextPage() {
    const totalPages = Math.ceil(filteredOrders.length / pageSize);
    if (currentPage < totalPages) {
        currentPage++;
        renderOrders();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderOrders();
    }
}

// 点击模态框外部关闭
window.onclick = function(event) {
    const modal = document.getElementById('orderModal');
    if (event.target === modal) {
        closeModal();
    }
};

// 键盘事件支持
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        closeModal();
    }
    
    if (event.key === 'Enter' && document.activeElement.id === 'searchInput') {
        searchOrders();
    }
});