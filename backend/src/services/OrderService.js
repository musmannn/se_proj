import OrderRepository from '../repositories/OrderRepository.js';

export default class OrderService {
  constructor() {
    this.orderRepository = new OrderRepository();
    this.allowedStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  }

  buildShippingAddress(payload) {
    if (payload.shippingAddr) {
      return payload.shippingAddr;
    }

    const details = payload.shippingDetails || {};
    const requiredFields = ['fullName', 'email', 'phone', 'addressLine1', 'city', 'country'];

    const missing = requiredFields.filter((field) => !String(details[field] || '').trim());
    if (missing.length) {
      throw new Error('Please provide complete contact and shipping details');
    }

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(details.email);
    if (!emailValid) {
      throw new Error('Please provide a valid email');
    }

    const phoneValid = /^[+0-9()\-\s]{7,20}$/.test(details.phone);
    if (!phoneValid) {
      throw new Error('Please provide a valid phone number');
    }

    const cityRegion = [details.city, details.state].filter(Boolean).join(', ');
    const postalCountry = [details.postalCode, details.country].filter(Boolean).join(', ');

    return [
      details.fullName,
      details.email,
      details.phone,
      details.addressLine1,
      details.addressLine2,
      cityRegion,
      postalCountry,
      details.notes ? `Notes: ${details.notes}` : ''
    ]
      .filter(Boolean)
      .join('\n');
  }

  checkout(userID, payload) {
    const shippingAddr = this.buildShippingAddress(payload);
    return this.orderRepository.checkout({ userID, shippingAddr });
  }

  getOwnOrders(userID) {
    return this.orderRepository.getByUserId(userID);
  }

  getOrderDetail(orderId, requester) {
    const order = this.orderRepository.getDetailById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }

    if (requester.role !== 'admin' && order.userID !== requester.userID) {
      throw new Error('Unauthorized to view this order');
    }
    return order;
  }

  cancelOwnOrder(orderId, userID) {
    const order = this.orderRepository.getById(orderId);
    if (!order || order.userID !== userID) {
      throw new Error('Order not found');
    }
    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }
    return this.orderRepository.cancelAndRestock(orderId);
  }

  getAllOrders() {
    return this.orderRepository.getAll();
  }

  updateOrderStatus(orderId, status) {
    if (!this.allowedStatuses.includes(status)) {
      throw new Error('Invalid status');
    }
    const order = this.orderRepository.getById(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return this.orderRepository.updateStatus(orderId, status);
  }
}
