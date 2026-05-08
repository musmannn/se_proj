import InventoryRepository from '../repositories/InventoryRepository.js';

export default class InventoryService {
  constructor() {
    this.inventoryRepository = new InventoryRepository();
  }

  getByProductId(productId) {
    return this.inventoryRepository.getByProductId(productId);
  }

  updateInventory(inventoryId, payload) {
    const existing = this.inventoryRepository.getById(inventoryId);
    if (!existing) {
      throw new Error('Inventory record not found');
    }

    if (payload.stockQty !== undefined && Number(payload.stockQty) < 0) {
      throw new Error('stockQty must be zero or greater');
    }
    if (payload.safetyStock !== undefined && Number(payload.safetyStock) < 0) {
      throw new Error('safetyStock must be zero or greater');
    }

    return this.inventoryRepository.update(inventoryId, {
      stockQty: payload.stockQty !== undefined ? Number(payload.stockQty) : undefined,
      safetyStock: payload.safetyStock !== undefined ? Number(payload.safetyStock) : undefined
    });
  }

  getLowStockAlerts() {
    return this.inventoryRepository.getLowStockAlerts();
  }

  getAllInventoryWithAlerts() {
    return this.inventoryRepository.getAllWithAlerts();
  }
}
